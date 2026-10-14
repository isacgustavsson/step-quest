import { getRecipeIcon, Recipe } from "@/components/actionCard";
import { RESOURCE_ICONS } from "@/state/resourceIcons";
import {
  GATHER_GAIN,
  GATHER_STEP_COST,
  resourcesAtom,
} from "@/state/resources";
import { bankedStepsAtom } from "@/state/stepbank";
import { colors, styles } from "@/styles/main";
import { Image, ImageSource } from "expo-image";
import { useAtomValue } from "jotai";
import { useState } from "react";
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

type RecipeModalProps = {
  recipe: Recipe | null;
  onAction: (recipe: Recipe, times: number) => void;
  onClose: () => void;
};

export const RecipeModal = ({
  recipe,
  onAction,
  onClose,
}: RecipeModalProps) => (
  <Modal
    visible={recipe !== null}
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
        {recipe && (
          <RecipeContent
            key={recipe.label}
            recipe={recipe}
            onAction={onAction}
            onClose={onClose}
          />
        )}
      </Pressable>
    </KeyboardAvoidingView>
  </Modal>
);

type RecipeContentProps = {
  recipe: Recipe;
  onAction: (recipe: Recipe, times: number) => void;
  onClose: () => void;
};

const RecipeContent = ({ recipe, onAction, onClose }: RecipeContentProps) => {
  const [input, setInput] = useState("1");
  const resources = useAtomValue(resourcesAtom);
  const bankedSteps = useAtomValue(bankedStepsAtom);

  const icon = getRecipeIcon(recipe);
  const isGathering = recipe.resourceKey !== undefined;

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
        <Text style={[styles.text, { fontSize: 32 }]}>{recipe.label}</Text>
        <Pressable onPress={onClose}>
          <Text style={[styles.text, { color: colors.textMuted }]}>x</Text>
        </Pressable>
      </View>

      {icon && (
        <Image
          source={icon}
          style={{ width: 96, height: 96 }}
          contentFit="cover"
        />
      )}

      {recipe.description && (
        <Text
          style={[
            styles.text,
            { color: colors.textMuted, textAlign: "center" },
          ]}
        >
          {recipe.description}
        </Text>
      )}

      <View style={{ width: "100%", gap: 8 }}>
        <Text style={styles.text}>cost</Text>
        {isGathering && (
          <CostRow
            label="steps"
            have={bankedSteps}
            need={GATHER_STEP_COST * count}
          />
        )}
        {Object.entries(recipe.cost ?? {}).map(([key, amount]) => (
          <CostRow
            key={key}
            label={key}
            icon={RESOURCE_ICONS[key]}
            have={resources[key] ?? 0}
            need={amount * count}
          />
        ))}
      </View>

      <View style={{ width: "100%", gap: 8 }}>
        <Text style={styles.text}>yield</Text>
        {isGathering && (
          <Text style={[styles.text, { color: colors.textMuted }]}>
            {recipe.label} +{GATHER_GAIN * count}
          </Text>
        )}
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
  icon?: ImageSource | number;
  have: number;
  need: number;
};

const CostRow = ({ label, icon, have, need }: CostRowProps) => (
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
