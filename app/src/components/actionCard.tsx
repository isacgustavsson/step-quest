import { RecipeModal } from "@/components/recipeModal";
import { ITEMS } from "@/data/items";
import type { CraftActivity, CraftRecipe } from "@/data/types";
import { playerLevelAtom } from "@/state/player";
import { colors, styles } from "@/styles/main";
import { Image } from "expo-image";
import { useAtomValue } from "jotai";
import { useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const TILE_GAP = 8;
const VISIBLE_TILES = 3;

export type ActionCardProps = {
  title: string;
  activities: CraftActivity[];
  onAction: (recipe: CraftRecipe, times: number) => void;
};

export const ActionCard = ({
  title,
  activities,
  onAction,
}: ActionCardProps) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [openRecipe, setOpenRecipe] = useState<CraftRecipe | null>(null);

  const [rowWidth, setRowWidth] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const playerLevel = useAtomValue(playerLevelAtom);

  const category = activities[selectedCategory];
  const tileSize = (rowWidth - (VISIBLE_TILES - 1) * TILE_GAP) / VISIBLE_TILES;
  const interval = tileSize + TILE_GAP;
  const maxIndex = Math.max(0, category.recipes.length - VISIBLE_TILES);

  const scrollTo = (index: number) => {
    const next = Math.min(maxIndex, Math.max(0, index));
    scrollRef.current?.scrollTo({ x: next * interval, animated: true });
    setScrollIndex(next);
  };

  // uppdatera bara när skrollen har stannat, inte varje frame
  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setScrollIndex(Math.round(e.nativeEvent.contentOffset.x / interval));

  return (
    <>
      <View
        style={[
          styles.card,
          {
            alignItems: "center",
            borderColor: "transparent",
          },
        ]}
      >
        <Text style={styles.text}>{title}</Text>
        <View style={{ width: "100%", height: 200, overflow: "hidden" }}>
          <Image
            source={category?.image}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          ></Image>
        </View>

        <View style={{ width: "100%" }}>
          <Text
            style={[styles.text, { marginBottom: 16, alignSelf: "center" }]}
          >
            Activities
          </Text>
          <View style={[styles.row, { width: "100%", gap: 12 }]}>
            {activities.map((activity, index) => (
              <View key={activity.id}>
                <Pressable
                  style={[
                    styles.button,
                    { width: 48, height: 48, paddingHorizontal: 0 },
                    index === selectedCategory && styles.buttonSelected,
                  ]}
                  onPress={() => {
                    setSelectedCategory(index);
                    setScrollIndex(0);
                  }}
                >
                  <Image
                    source={activity.icon}
                    style={{ width: 36, height: 36 }}
                    contentFit="cover"
                  ></Image>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={{ width: "100%" }}>
          <Text
            style={[styles.text, { marginBottom: 16, alignSelf: "center" }]}
          >
            Recipes
          </Text>
          <View style={[styles.row, { gap: 8 }]}>
            <ScrollArrow
              label="<"
              disabled={scrollIndex <= 0}
              onPress={() => scrollTo(scrollIndex - VISIBLE_TILES)}
            />
            <ScrollView
              key={category.id}
              ref={scrollRef}
              style={{ flex: 1 }}
              onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={interval}
              decelerationRate="fast"
              onScrollEndDrag={handleScrollEnd}
              onMomentumScrollEnd={handleScrollEnd}
              contentContainerStyle={{ gap: TILE_GAP, paddingVertical: 12 }}
            >
              {rowWidth > 0 &&
                category.recipes.map((recipe) => (
                  <RecipeTile
                    key={recipe.item}
                    recipe={recipe}
                    size={tileSize}
                    locked={playerLevel < recipe.levelUnlocked}
                    onPress={() => setOpenRecipe(recipe)}
                  />
                ))}
            </ScrollView>
            <ScrollArrow
              label=">"
              disabled={scrollIndex >= maxIndex}
              onPress={() => scrollTo(scrollIndex + VISIBLE_TILES)}
            />
          </View>
        </View>
      </View>

      <RecipeModal
        recipe={openRecipe}
        onAction={onAction}
        onClose={() => setOpenRecipe(null)}
      />
    </>
  );
};

type ScrollArrowProps = {
  label: string;
  disabled: boolean;
  onPress: () => void;
};

const ScrollArrow = ({ label, disabled, onPress }: ScrollArrowProps) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    hitSlop={8}
    // fast bredd och full höjd ger en stor tryckyta bredvid rutorna
    style={{ width: 36, alignSelf: "stretch", justifyContent: "center" }}
  >
    <Text
      style={[
        styles.text,
        {
          fontSize: 40,
          lineHeight: 40,
          textAlign: "center",
          color: disabled ? colors.textFaint : colors.text,
        },
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

type RecipeTileProps = {
  recipe: CraftRecipe;
  size: number;
  locked: boolean;
  onPress: () => void;
};

const RecipeTile = ({ recipe, size, locked, onPress }: RecipeTileProps) => {
  const item = ITEMS[recipe.item];

  return (
    <Pressable
      disabled={locked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        {
          width: size,
          height: size,
          padding: 6,
          gap: 4,
          borderColor: colors.cardBorder,
        },
        pressed && styles.buttonSelected,
      ]}
    >
      <View
        style={{
          width: 32,
          height: 32,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {locked ? (
          <Text
            style={[styles.text, { fontSize: 14, color: colors.textMuted }]}
          >
            locked
          </Text>
        ) : (
          <Image
            source={item.icon}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        )}
      </View>

      {!locked && (
        <Text style={[styles.text, { fontSize: 14 }]} numberOfLines={1}>
          {item.label}
        </Text>
      )}

      {locked && (
        <Text style={[styles.text, { fontSize: 14, color: colors.textMuted }]}>
          lvl {recipe.levelUnlocked}
        </Text>
      )}
    </Pressable>
  );
};

type ListDividerProps = {
  mt?: number;
  mb?: number;
  color?: string;
};

export const ListDivider = ({
  mt,
  mb,
  color = colors.cardBorder,
}: ListDividerProps) => (
  <View
    style={{
      height: 1,
      backgroundColor: color,
      width: "100%",
      marginTop: mt,
      marginBottom: mb,
    }}
  />
);
