import type { Resource, ResourceId } from "./types";

const resources: Resource[] = [
  {
    id: "pine_branch",
    label: "pine branch",
    icon: require("@assets/icons/pine_branch.png"),
  },
  {
    id: "birch_log",
    label: "birch log",
    icon: require("@assets/icons/birch_log.png"),
  },
  {
    id: "willow_log",
    label: "willow log",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/birch_log.png"),
  },
  {
    id: "maple_log",
    label: "maple log",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/oak_log.png"),
  },
  {
    id: "oak_log",
    label: "oak log",
    icon: require("@assets/icons/oak_log.png"),
  },
  {
    id: "stone",
    label: "stone",
    icon: require("@assets/icons/stone.png"),
  },
  {
    id: "copper_ore",
    label: "copper ore",
    icon: require("@assets/icons/copper_ore.png"),
  },
  {
    id: "coal",
    label: "coal",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/stone.png"),
  },
  {
    id: "iron_ore",
    label: "iron ore",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/tin_ore.png"),
  },
  {
    id: "tin_ore",
    label: "tin ore",
    icon: require("@assets/icons/tin_ore.png"),
  },
];

export const RESOURCES: Record<ResourceId, Resource> = Object.fromEntries(
  resources.map((resource) => [resource.id, resource]),
);
