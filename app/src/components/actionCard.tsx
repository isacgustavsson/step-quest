import { RecipeModal } from "@/components/recipeModal";
import { playerLevelAtom } from "@/state/player";
import { RESOURCE_ICONS } from "@/state/resourceIcons";
import { colors, styles } from "@/styles/main";
import { Image, ImageSource } from "expo-image";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export type Recipe = {
  label: string;
  description?: string;
  actionLabel: string;
  image?: ImageSource | number;
  icon?: ImageSource | number;
  levelUnlocked: number;
  xpYield: number;
  resourceKey?: string;
  cost?: Record<string, number>;
};

export type Activity = {
  label: string;
  image: ImageSource | number;
  icon: ImageSource | number;
  onAction: (recipe: Recipe, times: number) => void;
  recipes: Recipe[];
};

export const getRecipeIcon = (recipe: Recipe) =>
  recipe.icon ?? RESOURCE_ICONS[recipe.resourceKey ?? recipe.label];

export type ActionCardProps = {
  title: string;
  activities: Activity[];
};

export const ActionCard = ({ title, activities }: ActionCardProps) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);

  const playerLevel = useAtomValue(playerLevelAtom);

  const category = activities[selectedCategory];

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
          <Text style={[styles.text, { marginBottom: 16 }]}>Activities</Text>
          <View style={[styles.row, { width: "100%", gap: 12 }]}>
            {activities.map((activity, index) => (
              <View key={activity.label}>
                <Pressable
                  style={[
                    styles.button,
                    index === selectedCategory && styles.buttonSelected,
                  ]}
                  onPress={() => setSelectedCategory(index)}
                >
                  <Image
                    source={activity.icon}
                    style={{
                      width: 32,
                      height: 32,
                      borderColor: colors.cardBorder,
                      flex: 1,
                    }}
                    contentFit="cover"
                  ></Image>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={{ width: "100%" }}>
          <Text style={[styles.text, { marginBottom: 16 }]}>Recipes</Text>
          <ListDivider />
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              alignSelf: "flex-start",
              paddingVertical: 12,
            }}
          >
            {category.recipes.map((recipe) => (
              <RecipeTile
                key={recipe.label}
                recipe={recipe}
                locked={playerLevel < recipe.levelUnlocked}
                onPress={() => setOpenRecipe(recipe)}
              />
            ))}
          </View>
        </View>
      </View>

      <RecipeModal
        recipe={openRecipe}
        onAction={category.onAction}
        onClose={() => setOpenRecipe(null)}
      />
    </>
  );
};

type RecipeTileProps = {
  recipe: Recipe;
  locked: boolean;
  onPress: () => void;
};

const RecipeTile = ({ recipe, locked, onPress }: RecipeTileProps) => {
  const icon = getRecipeIcon(recipe);

  return (
    <Pressable
      disabled={locked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { gap: 4, borderColor: colors.cardBorder },
        pressed && styles.buttonSelected,
      ]}
    >
      <View style={{ width: 42, height: 42, opacity: locked ? 0.3 : 1 }}>
        {icon && (
          <Image
            source={icon}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        )}
      </View>

      <Text
        style={[
          styles.text,
          { fontSize: 14, color: locked ? colors.textFaint : colors.text },
        ]}
        numberOfLines={1}
      >
        {recipe.label}
      </Text>

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
