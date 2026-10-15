import type { CraftActivity } from "./types";

export const CRAFT_ACTIVITIES: CraftActivity[] = [
  {
    id: "blacksmithing",
    label: "blacksmithing",
    image: require("@assets/img/blacksmith.png"),
    icon: require("@assets/icons/anvil.png"),
    recipes: [
      {
        item: "stone_spade",
        actionLabel: "craft",
        levelUnlocked: 1,
        xpYield: 10,
        cost: { pine_branch: 15, stone: 20 },
      },
      {
        item: "stone_axe",
        actionLabel: "craft",
        levelUnlocked: 2,
        xpYield: 10,
        cost: { pine_branch: 20, stone: 30 },
      },
      {
        item: "stone_pickaxe",
        actionLabel: "craft",
        levelUnlocked: 2,
        xpYield: 10,
        cost: { pine_branch: 20, stone: 30 },
      },
      {
        item: "copper_dagger",
        actionLabel: "craft",
        levelUnlocked: 3,
        xpYield: 40,
        cost: { copper_ore: 40, birch_log: 20 },
      },
      {
        item: "iron_helmet",
        actionLabel: "craft",
        levelUnlocked: 4,
        xpYield: 60,
        cost: { iron_ore: 60, coal: 30 },
      },
      {
        item: "bronze_sword",
        actionLabel: "craft",
        levelUnlocked: 5,
        xpYield: 90,
        cost: { copper_ore: 60, tin_ore: 60, coal: 40 },
      },
    ],
  },
  {
    id: "carpentry",
    label: "carpentry",
    image: require("@assets/img/carpentry.png"),
    icon: require("@assets/icons/wood.png"),
    recipes: [
      {
        item: "campfire",
        actionLabel: "craft",
        levelUnlocked: 0,
        xpYield: 8,
        cost: { pine_branch: 30, stone: 10 },
      },
      {
        item: "wood_skull",
        actionLabel: "craft",
        levelUnlocked: 1,
        xpYield: 20,
        cost: { pine_branch: 50 },
      },
      {
        item: "wood_shield",
        actionLabel: "craft",
        levelUnlocked: 2,
        xpYield: 30,
        cost: { birch_log: 100, stone: 50 },
      },
      {
        item: "willow_bow",
        actionLabel: "craft",
        levelUnlocked: 3,
        xpYield: 45,
        cost: { willow_log: 60, pine_branch: 20 },
      },
      {
        item: "maple_chest",
        actionLabel: "craft",
        levelUnlocked: 4,
        xpYield: 60,
        cost: { maple_log: 80, copper_ore: 20 },
      },
      {
        item: "oak_staff",
        actionLabel: "craft",
        levelUnlocked: 5,
        xpYield: 80,
        cost: { oak_log: 100, coal: 20 },
      },
    ],
  },
];
