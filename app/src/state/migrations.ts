// sparfilens format och hur gamla format uppgraderas. Ändras formen på en
// sparad atom höjs SAVE_VERSION och en migrering läggs till i MIGRATIONS

export type SaveFile = {
  version: number;
  data: Record<string, unknown>;
};

export const SAVE_VERSION = 1;

// nycklarna från innan allt sparades under en nyckel (version 0)
export const LEGACY_KEYS = [
  "stepBank:balance",
  "resources:all",
  "crafting:inventory",
  "player:xp",
  "map:position",
  "map:nodes",
];

// namnen som användes som id i version 0. Ligger här i stället för att
// läsas från data/, så att migreringen fungerar även om etiketterna ändras
const V0_IDS: Record<string, string> = {
  "pine branch": "pine_branch",
  "birch log": "birch_log",
  "willow log": "willow_log",
  "maple log": "maple_log",
  "oak log": "oak_log",
  stone: "stone",
  "copper ore": "copper_ore",
  coal: "coal",
  "iron ore": "iron_ore",
  "tin ore": "tin_ore",
  "stone spade": "stone_spade",
  "stone axe": "stone_axe",
  "stone pickaxe": "stone_pickaxe",
  "copper dagger": "copper_dagger",
  "iron helmet": "iron_helmet",
  "bronze sword": "bronze_sword",
  campfire: "campfire",
  "wood skull": "wood_skull",
  "wood shield": "wood_shield",
  "willow bow": "willow_bow",
  "maple chest": "maple_chest",
  "oak staff": "oak_staff",
};

// byter nycklar från namn till id. Namn som inte finns längre (t.ex. "wood")
// tas bort, och nollor behålls inte
const renameKeys = (record: Record<string, number>) =>
  Object.fromEntries(
    Object.entries(record).flatMap(([label, amount]) =>
      V0_IDS[label] && amount > 0 ? [[V0_IDS[label], amount]] : [],
    ),
  );

type V0 = {
  "stepBank:balance"?: number;
  "resources:all"?: Record<string, number>;
  "crafting:inventory"?: Record<string, { amount: number }>;
  "player:xp"?: number;
  "map:position"?: { x: number; y: number };
  "map:nodes"?: Record<string, number>;
};

// MIGRATIONS[n] uppgraderar data från version n till n + 1
const MIGRATIONS: Record<number, (data: any) => Record<string, unknown>> = {
  // en nyckel per atom → en sparfil. Id i stället för namn, och ingen ikon
  // i inventariet
  0: (data: V0) => {
    const inventory = Object.fromEntries(
      Object.entries(data["crafting:inventory"] ?? {}).map(
        ([label, entry]) => [label, entry.amount],
      ),
    );

    return {
      steps: data["stepBank:balance"],
      resources: renameKeys(data["resources:all"] ?? {}),
      inventory: renameKeys(inventory),
      xp: data["player:xp"],
      position: data["map:position"],
      depletedNodes: data["map:nodes"],
    };
  },
};

export const migrate = (save: SaveFile): SaveFile => {
  if (save.version > SAVE_VERSION) {
    throw new Error(`save version ${save.version} is newer than the app`);
  }

  let { version, data } = save;
  while (version < SAVE_VERSION) {
    data = MIGRATIONS[version](data);
    version++;
  }

  return { version, data };
};
