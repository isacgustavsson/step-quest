import type { ImageSource } from "expo-image";

export type Icon = ImageSource | number;

// id:n är stabila och sparas i sparfilen och i Tiled. Etiketten är bara
// det som visas, och får ändras fritt
export type ResourceId = string;
export type ItemId = string;

export type Resource = {
  id: ResourceId;
  label: string;
  description?: string;
  icon: Icon;
};

export type Item = {
  id: ItemId;
  label: string;
  description?: string;
  icon: Icon;
};

// det som är gemensamt för allt som låses upp med nivå och ger xp
type Unlockable = {
  actionLabel: string;
  levelUnlocked: number;
  xpYield: number;
};

export type CraftRecipe = Unlockable & {
  item: ItemId;
  cost: Record<ResourceId, number>;
};

export type GatherRecipe = Unlockable & {
  resource: ResourceId;
  // steg som dras och resurser som ges vid varje insamling
  stepCost: number;
  gain: number;
  // hur länge ett uttömt objekt på kartan tar på sig att växa tillbaka
  respawnSeconds: number;
};

export type CraftActivity = {
  id: string;
  label: string;
  image: Icon;
  icon: Icon;
  recipes: CraftRecipe[];
};
