import type { Resource, ResourceId } from "./types";

const resources: Resource[] = [
  {
    id: "pine_branch",
    label: "pine branch",
    description: "A sticky branch that smells of resin. Burns fast.",
    icon: require("@assets/icons/pine_branch.png"),
  },
  {
    id: "birch_log",
    label: "birch log",
    description: "Pale and light, easy to split.",
    icon: require("@assets/icons/birch_log.png"),
  },
  {
    id: "willow_log",
    label: "willow log",
    description: "Soft and bendy wood from a tree by the water.",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/birch_log.png"),
  },
  {
    id: "maple_log",
    label: "maple log",
    description: "Hard, fine-grained wood. Good for furniture.",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/oak_log.png"),
  },
  {
    id: "oak_log",
    label: "oak log",
    description: "Heavy and strong. Takes a while to chop.",
    icon: require("@assets/icons/oak_log.png"),
  },
  {
    id: "stone",
    label: "stone",
    description: "A plain grey stone. There is a lot of it around.",
    icon: require("@assets/icons/stone.png"),
  },
  {
    id: "copper_ore",
    label: "copper ore",
    description: "Rock with green and orange streaks of copper.",
    icon: require("@assets/icons/copper_ore.png"),
  },
  {
    id: "coal",
    label: "coal",
    description: "Black and dusty. Keeps a forge burning.",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/stone.png"),
  },
  {
    id: "iron_ore",
    label: "iron ore",
    description: "Dark, heavy ore with flecks of rust.",
    // platshållare tills riktig ikon finns
    icon: require("@assets/icons/tin_ore.png"),
  },
  {
    id: "tin_ore",
    label: "tin ore",
    description: "Dull grey ore. Mixed with copper it makes bronze.",
    icon: require("@assets/icons/tin_ore.png"),
  },
];

export const RESOURCES: Record<ResourceId, Resource> = Object.fromEntries(
  resources.map((resource) => [resource.id, resource]),
);
