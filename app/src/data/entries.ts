import { ITEMS } from "./items";
import { RESOURCES } from "./resources";
import type { Icon } from "./types";

// en resurs eller ett föremål, för det som visar båda på samma sätt
export type Entry = {
  id: string;
  kind: "resource" | "item";
  label: string;
  description?: string;
  icon: Icon;
};

// id:n är unika för både resurser och föremål
export const getEntry = (id: string): Entry | undefined => {
  const resource = RESOURCES[id];
  if (resource) return { ...resource, kind: "resource" };

  const item = ITEMS[id];
  if (item) return { ...item, kind: "item" };

  return undefined;
};
