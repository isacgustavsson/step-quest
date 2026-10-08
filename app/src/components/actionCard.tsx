import { playerLevelAtom } from "@/state/player";
import { colors, styles } from "@/styles/main";
import { Image, ImageSource } from "expo-image";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export type Recipe = {
  label: string;
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

export type ActionCardProps = {
  title: string;
  activities: Activity[];
};

export const ActionCard = ({ title, activities }: ActionCardProps) => {
  const [count, setCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(0);

  const [isExpanded, setIsExpanded] = useState(false);
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

        <View
          style={[
            isExpanded ? styles.card : null,
            {
              borderColor: isExpanded ? colors.cardBorder : "null",
            },
          ]}
        >
          <View>
            <Pressable
              style={[styles.rowBetween]}
              onPress={() => setIsExpanded((prev) => !prev)}
            >
              <View
                style={[
                  styles.rowBetween,
                  {
                    marginBottom: isExpanded ? 12 : 8,
                    marginTop: isExpanded ? 12 : 8,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      color: isExpanded ? colors.text : colors.textMuted,
                      fontSize: 28,
                    },
                  ]}
                >
                  Recipes
                </Text>

                <Text
                  style={[
                    styles.text,
                    {
                      fontSize: 12,
                      color: isExpanded ? colors.text : colors.textMuted,
                    },
                  ]}
                >
                  {isExpanded ? "▲" : "▼"}
                </Text>
              </View>
            </Pressable>
            <ListDivider mt={0} />
          </View>

          <View>
            {isExpanded && (
              <View style={{ marginTop: 12, marginBottom: 12 }}>
                {category.recipes.map((item, index) => {
                  const isSelected = index === selectedRecipe;

                  return (
                    <View key={item.label}>
                      {playerLevel < item.levelUnlocked ? (
                        <Text
                          style={[styles.text, { color: colors.textMuted }]}
                        >
                          locked
                        </Text>
                      ) : (
                        <View style={styles.rowBetween}>
                          <Text
                            style={[
                              styles.text,
                              {
                                color: isSelected
                                  ? colors.text
                                  : colors.textMuted,
                              },
                            ]}
                          >
                            {item.label}
                          </Text>

                          {playerLevel < item.levelUnlocked ? (
                            <Text style={styles.text}>
                              required level: {item.levelUnlocked}
                            </Text>
                          ) : isSelected ? (
                            <View style={[styles.row, { gap: 24 }]}>
                              <View style={styles.row}>
                                <Pressable
                                  style={styles.square}
                                  onPress={() =>
                                    setCount((prev) => Math.max(1, prev - 1))
                                  }
                                >
                                  <Text style={styles.text}>-</Text>
                                </Pressable>

                                <View style={styles.square}>
                                  <Text style={styles.text}>{count}</Text>
                                </View>

                                <Pressable
                                  style={styles.square}
                                  onPress={() => setCount((prev) => prev + 1)}
                                >
                                  <Text style={styles.text}>+</Text>
                                </Pressable>
                              </View>

                              {/***********************  HÄR  ***********************/}

                              <Pressable
                                style={styles.button}
                                onPress={() => category.onAction(item, count)}
                              >
                                <Text style={styles.text}>
                                  {item.actionLabel}
                                </Text>
                              </Pressable>
                            </View>
                          ) : (
                            <Pressable
                              style={styles.button}
                              onPress={() => {
                                setSelectedRecipe(index);
                                setCount(1);
                              }}
                            >
                              <Text
                                style={[
                                  styles.text,
                                  { color: colors.textMuted },
                                ]}
                              >
                                select
                              </Text>
                            </Pressable>
                          )}
                        </View>
                      )}

                      {index < category.recipes.length - 1 && (
                        <ListDivider mt={32} mb={32} />
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    </>
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
