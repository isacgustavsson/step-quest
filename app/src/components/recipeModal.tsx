import { ITEMS } from "@/data/items";
import { RESOURCES } from "@/data/resources";
import type { CraftRecipe, Icon } from "@/data/types";
import { resourcesAtom } from "@/state/resources";
import { colors, styles } from "@/styles/main";
import { Image } from "expo-image";
import { useAtomValue } from "jotai";
import { ReactNode, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type ModalBackdropProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

// mörk bakgrund som stänger modalen vid tryck, delas med GatherModal
export const ModalBackdrop = ({
  visible,
  onClose,
  children,
}: ModalBackdropProps) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Pressable
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 24,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
        onPress={onClose}
      >
        {children}
      </Pressable>
    </KeyboardAvoidingView>
  </Modal>
);

type RecipeModalProps = {
  recipe: CraftRecipe | null;
  onAction: (recipe: CraftRecipe, times: number) => void;
  onClose: () => void;
};

export const RecipeModal = ({
  recipe,
  onAction,
  onClose,
}: RecipeModalProps) => (
  <ModalBackdrop visible={recipe !== null} onClose={onClose}>
    {recipe && (
      <RecipeContent
        key={recipe.item}
        recipe={recipe}
        onAction={onAction}
        onClose={onClose}
      />
    )}
  </ModalBackdrop>
);

type RecipeContentProps = {
  recipe: CraftRecipe;
  onAction: (recipe: CraftRecipe, times: number) => void;
  onClose: () => void;
};

const RecipeContent = ({ recipe, onAction, onClose }: RecipeContentProps) => {
  const [input, setInput] = useState("1");
  const resources = useAtomValue(resourcesAtom);

  const item = ITEMS[recipe.item];

  const parsed = parseInt(input, 10);
  const count = isNaN(parsed) ? 0 : parsed;
  const isValid = count >= 1;

  const handleAction = () => {
    if (!isValid) return;
    Keyboard.dismiss();
    onAction(recipe, count);
  };

  return (
    <Pressable
      style={[styles.card, { alignItems: "center" }]}
      onPress={Keyboard.dismiss}
    >
      <View style={[styles.rowBetween]}>
        <Text style={[styles.text, { fontSize: 32 }]}>{item.label}</Text>
        <Pressable onPress={onClose} hitSlop={20}>
          <Text style={[styles.text, { color: colors.textMuted }]}>x</Text>
        </Pressable>
      </View>

      <Image
        source={item.icon}
        style={{ width: 96, height: 96 }}
        contentFit="cover"
      />

      {item.description && (
        <Text
          style={[
            styles.text,
            { color: colors.textMuted, textAlign: "center" },
          ]}
        >
          {item.description}
        </Text>
      )}

      <View style={{ width: "100%", gap: 8 }}>
        <Text style={styles.text}>cost</Text>
        {Object.entries(recipe.cost).map(([key, amount]) => (
          <CostRow
            key={key}
            label={RESOURCES[key]?.label ?? key}
            icon={RESOURCES[key]?.icon}
            have={resources[key] ?? 0}
            need={amount * count}
          />
        ))}
      </View>

      <View style={{ width: "100%", gap: 8 }}>
        <Text style={styles.text}>yield</Text>
        <Text style={[styles.text, { color: colors.xp }]}>
          xp +{recipe.xpYield * count}
        </Text>
      </View>

      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Pressable
            style={styles.square}
            onPress={() => setInput(String(Math.max(1, count - 1)))}
          >
            <Text style={styles.text}>-</Text>
          </Pressable>

          <TextInput
            style={[
              styles.square,
              styles.text,
              {
                width: undefined,
                minWidth: 48,
                textAlign: "center",
                paddingVertical: 0,
                // lineHeight gör att texten hamnar i botten av TextInput på iOS
                lineHeight: undefined,
                textAlignVertical: "center",
                includeFontPadding: false,
              },
            ]}
            value={input}
            onChangeText={(text) => setInput(text.replace(/[^0-9]/g, ""))}
            onBlur={() => {
              if (!isValid) setInput("1");
            }}
            keyboardType="number-pad"
            maxLength={4}
            selectTextOnFocus
          />

          <Pressable
            style={styles.square}
            onPress={() => setInput(String(Math.max(1, count + 1)))}
          >
            <Text style={styles.text}>+</Text>
          </Pressable>
        </View>

        <Pressable style={styles.button} onPress={handleAction}>
          <Text
            style={[
              styles.text,
              { color: isValid ? colors.text : colors.textMuted },
            ]}
          >
            {recipe.actionLabel}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

type CostRowProps = {
  label: string;
  icon?: Icon;
  have: number;
  need: number;
};

export const CostRow = ({ label, icon, have, need }: CostRowProps) => (
  <View style={[styles.row, { gap: 8 }]}>
    {icon && (
      <Image
        source={icon}
        style={{ width: 24, height: 24 }}
        contentFit="cover"
      />
    )}
    <Text
      style={[
        styles.text,
        { color: have >= need ? colors.text : colors.danger },
      ]}
    >
      {label} {have} / {need}
    </Text>
  </View>
);
