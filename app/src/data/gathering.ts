import type { Recipe } from "@/components/actionCard";

export type GatherRecipe = Recipe & {
  resourceKey: string;
  // steg som dras och resurser som ges vid varje insamling
  stepCost: number;
  gain: number;
  // hur länge ett uttömt objekt på kartan tar på sig att växa tillbaka
  respawnSeconds: number;
};

const recipes: GatherRecipe[] = [
  {
    label: "pine branch",
    resourceKey: "pine branch",
    stepCost: 10,
    gain: 2,
    actionLabel: "gather",
    levelUnlocked: 0,
    xpYield: 5,
    respawnSeconds: 30,
  },
  {
    label: "birch log",
    resourceKey: "birch log",
    stepCost: 20,
    gain: 3,
    actionLabel: "chop tree",
    levelUnlocked: 2,
    xpYield: 15,
    respawnSeconds: 60,
  },
  {
    label: "willow log",
    resourceKey: "willow log",
    stepCost: 30,
    gain: 3,
    actionLabel: "chop tree",
    levelUnlocked: 3,
    xpYield: 20,
    respawnSeconds: 90,
  },
  {
    label: "maple log",
    resourceKey: "maple log",
    stepCost: 40,
    gain: 4,
    actionLabel: "chop tree",
    levelUnlocked: 4,
    xpYield: 22,
    respawnSeconds: 120,
  },
  {
    label: "oak log",
    resourceKey: "oak log",
    stepCost: 50,
    gain: 4,
    actionLabel: "log tree",
    levelUnlocked: 5,
    xpYield: 25,
    respawnSeconds: 180,
  },
  {
    label: "stone",
    resourceKey: "stone",
    stepCost: 10,
    gain: 2,
    actionLabel: "gather",
    levelUnlocked: 0,
    xpYield: 5,
    respawnSeconds: 30,
  },
  {
    label: "copper ore",
    resourceKey: "copper ore",
    stepCost: 20,
    gain: 3,
    actionLabel: "mine",
    levelUnlocked: 2,
    xpYield: 15,
    respawnSeconds: 60,
  },
  {
    label: "coal",
    resourceKey: "coal",
    stepCost: 30,
    gain: 3,
    actionLabel: "mine",
    levelUnlocked: 3,
    xpYield: 20,
    respawnSeconds: 90,
  },
  {
    label: "iron ore",
    resourceKey: "iron ore",
    stepCost: 40,
    gain: 4,
    actionLabel: "mine",
    levelUnlocked: 4,
    xpYield: 22,
    respawnSeconds: 120,
  },
  {
    label: "tin ore",
    resourceKey: "tin ore",
    stepCost: 50,
    gain: 4,
    actionLabel: "mine",
    levelUnlocked: 5,
    xpYield: 25,
    respawnSeconds: 180,
  },
];

// objekten på kartan pekar ut sitt recept med property `resource` i Tiled
export const GATHER_RECIPES: Record<string, GatherRecipe> = Object.fromEntries(
  recipes.map((recipe) => [recipe.resourceKey, recipe]),
);
