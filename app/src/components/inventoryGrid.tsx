import { INVENTORY_COLUMNS, InventorySlot } from "@/state/inventory";
import { colors, styles } from "@/styles/main";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const GAP = 6;
// så länge måste man hålla in innan en ruta lyfts, så att ett vanligt
// tryck öppnar detaljskärmen och ett svep scrollar
const LONG_PRESS_MS = 200;
const DROP_MS = 120;
const LIFTED_SCALE = 1.1;

// rutans övre vänstra hörn i griden
const slotPosition = (index: number, size: number) => {
  "worklet";
  return {
    x: (index % INVENTORY_COLUMNS) * (size + GAP),
    y: Math.floor(index / INVENTORY_COLUMNS) * (size + GAP),
  };
};

// rutan under en punkt i griden, eller -1 utanför
const slotAt = (x: number, y: number, size: number, count: number) => {
  "worklet";
  const column = Math.floor(x / (size + GAP));
  const row = Math.floor(y / (size + GAP));
  if (x < 0 || y < 0 || column >= INVENTORY_COLUMNS) return -1;

  const index = row * INVENTORY_COLUMNS + column;
  return index < count ? index : -1;
};

type InventoryGridProps = {
  slots: InventorySlot[];
  onMove: (from: number, to: number) => void;
  onOpen: (id: string) => void;
  // sant medan något dras, så att skärmen kan stänga av scrollning
  onDragStateChange?: (dragging: boolean) => void;
};

// fasta rutor där sakerna kan dras mellan. En sak som släpps på en tom
// ruta flyttas dit, och på en annan sak byter de plats
export const InventoryGrid = ({
  slots,
  onMove,
  onOpen,
  onDragStateChange,
}: InventoryGridProps) => {
  const [width, setWidth] = useState(0);
  // rutan som en dragen sak just nu är över
  const hoverIndex = useSharedValue(-1);

  const size =
    width > 0 ? (width - GAP * (INVENTORY_COLUMNS - 1)) / INVENTORY_COLUMNS : 0;
  const rows = Math.ceil(slots.length / INVENTORY_COLUMNS);

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ width: "100%", height: rows * size + (rows - 1) * GAP }}
    >
      {size > 0 &&
        slots.map((_, index) => (
          <EmptySlot
            key={index}
            index={index}
            size={size}
            hoverIndex={hoverIndex}
          />
        ))}

      {/* sakerna har sitt id som key, så att en flyttad sak behåller sin vy */}
      {size > 0 &&
        slots.map(
          (slot, index) =>
            slot && (
              <ItemTile
                key={slot.id}
                slot={slot}
                index={index}
                size={size}
                count={slots.length}
                hoverIndex={hoverIndex}
                onMove={onMove}
                onOpen={onOpen}
                onDragStateChange={onDragStateChange}
              />
            ),
        )}
    </View>
  );
};

type EmptySlotProps = {
  index: number;
  size: number;
  hoverIndex: SharedValue<number>;
};

// rutans ram, som lyser upp när en sak dras över den
const EmptySlot = ({ index, size, hoverIndex }: EmptySlotProps) => {
  const { x, y } = slotPosition(index, size);

  const highlight = useAnimatedStyle(() => ({
    borderColor:
      hoverIndex.get() === index ? colors.accent : colors.cardBorder,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderWidth: 1,
        },
        highlight,
      ]}
    />
  );
};

type ItemTileProps = {
  slot: NonNullable<InventorySlot>;
  index: number;
  size: number;
  count: number;
  hoverIndex: SharedValue<number>;
  onMove: (from: number, to: number) => void;
  onOpen: (id: string) => void;
  onDragStateChange?: (dragging: boolean) => void;
};

const ItemTile = ({
  slot,
  index,
  size,
  count,
  hoverIndex,
  onMove,
  onOpen,
  onDragStateChange,
}: ItemTileProps) => {
  const { x, y } = slotPosition(index, size);

  // rutans plats och fingrets förflyttning sedan den lyftes. Platsen ligger
  // också i en shared value, så att båda kan ändras samtidigt vid släpp
  const baseX = useSharedValue(x);
  const baseY = useSharedValue(y);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const lifted = useSharedValue(false);

  // sant när den här rutan själv släpptes på sin nya plats, som den då
  // redan står på. Annars glider den dit (t.ex. när den bytt plats)
  const dropped = useSharedValue(false);
  const previousSize = useRef(size);

  useLayoutEffect(() => {
    const animate = !dropped.get() && previousSize.current === size;
    dropped.set(false);
    previousSize.current = size;

    dragX.set(0);
    dragY.set(0);
    baseX.set(animate ? withTiming(x, { duration: DROP_MS }) : x);
    baseY.set(animate ? withTiming(y, { duration: DROP_MS }) : y);
  }, [x, y, size, baseX, baseY, dragX, dragY, dropped]);

  const gesture = useMemo(() => {
    const lift = () => {
      Haptics.selectionAsync();
      onDragStateChange?.(true);
    };

    const drop = (target: number) => {
      dropped.set(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onMove(index, target);
    };

    const release = () => onDragStateChange?.(false);

    const pan = Gesture.Pan()
      .activateAfterLongPress(LONG_PRESS_MS)
      .onStart(() => {
        lifted.set(true);
        hoverIndex.set(index);
        scheduleOnRN(lift);
      })
      .onChange((e) => {
        dragX.set(e.translationX);
        dragY.set(e.translationY);
        // rutan under sakens mitt
        hoverIndex.set(
          slotAt(
            baseX.get() + e.translationX + size / 2,
            baseY.get() + e.translationY + size / 2,
            size,
            count,
          ),
        );
      })
      .onEnd(() => {
        const target = hoverIndex.get();
        hoverIndex.set(-1);
        scheduleOnRN(release);

        // utanför griden eller på samma ruta: tillbaka dit den stod
        if (target < 0 || target === index) {
          dragX.set(withSpring(0));
          dragY.set(withSpring(0, undefined, () => lifted.set(false)));
          return;
        }

        const to = slotPosition(target, size);
        dragX.set(withTiming(to.x - baseX.get(), { duration: DROP_MS }));
        dragY.set(
          withTiming(to.y - baseY.get(), { duration: DROP_MS }, (finished) => {
            lifted.set(false);
            if (finished) scheduleOnRN(drop, target);
          }),
        );
      });

    const tap = Gesture.Tap()
      .runOnJS(true)
      .onEnd((_, success) => {
        if (success) onOpen(slot.id);
      });

    // tap väntar på att pan inte blir av, så att en lång tryckning lyfter
    return Gesture.Exclusive(pan, tap);
  }, [
    index,
    size,
    count,
    slot.id,
    onMove,
    onOpen,
    onDragStateChange,
    baseX,
    baseY,
    dragX,
    dragY,
    lifted,
    dropped,
    hoverIndex,
  ]);

  const position = useAnimatedStyle(() => ({
    zIndex: lifted.get() ? 10 : 1,
    transform: [
      { translateX: baseX.get() + dragX.get() },
      { translateY: baseY.get() + dragY.get() },
      { scale: withTiming(lifted.get() ? LIFTED_SCALE : 1, { duration: 80 }) },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            top: 0,
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
          },
          position,
        ]}
      >
        <Image
          source={slot.icon}
          style={{ width: size * 0.6, height: size * 0.6 }}
          contentFit="cover"
        />
        <Text
          style={[
            styles.text,
            { position: "absolute", right: 4, bottom: 0, fontSize: 14 },
          ]}
        >
          {slot.amount}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};
