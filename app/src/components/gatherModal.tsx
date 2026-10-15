import { getRecipeIcon } from "@/components/actionCard";
import { CostRow, ModalBackdrop } from "@/components/recipeModal";
import { GatherRecipe } from "@/data/gathering";
import { bankedStepsAtom } from "@/state/stepbank";
import { colors, styles } from "@/styles/main";
import { Image } from "expo-image";
import { useAtomValue } from "jotai";
import { Pressable, Text, View } from "react-native";

type GatherModalProps = {
  recipe: GatherRecipe | null;
  onGather: () => void;
  onClose: () => void;
};

// insamling från ett objekt på kartan: en fast mängd per gång
export const GatherModal = ({
  recipe,
  onGather,
  onClose,
}: GatherModalProps) => (
  <ModalBackdrop visible={recipe !== null} onClose={onClose}>
    {recipe && (
      <GatherContent recipe={recipe} onGather={onGather} onClose={onClose} />
    )}
  </ModalBackdrop>
);

type GatherContentProps = {
  recipe: GatherRecipe;
  onGather: () => void;
  onClose: () => void;
};

const GatherContent = ({ recipe, onGather, onClose }: GatherContentProps) => {
  const bankedSteps = useAtomValue(bankedStepsAtom);
  const canAfford = bankedSteps >= recipe.stepCost;
  const icon = getRecipeIcon(recipe);

  return (
    // fångar trycket så att modalen inte stängs vid tryck på kortet
    <Pressable style={[styles.card, { alignItems: "center" }]}>
      <View style={[styles.rowBetween]}>
        <Text style={[styles.text, { fontSize: 32 }]}>{recipe.label}</Text>
        <Pressable onPress={onClose} hitSlop={20}>
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
        <CostRow label="steps" have={bankedSteps} need={recipe.stepCost} />
      </View>

      <View style={{ width: "100%", gap: 8 }}>
        <Text style={styles.text}>yield</Text>
        <Text style={[styles.text, { color: colors.textMuted }]}>
          {recipe.label} +{recipe.gain}
        </Text>
      </View>

      <View style={[styles.row, { justifyContent: "flex-end", width: "100%" }]}>
        <Pressable style={styles.button} onPress={onGather}>
          <Text
            style={[
              styles.text,
              { color: canAfford ? colors.text : colors.textMuted },
            ]}
          >
            {recipe.actionLabel}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};
