import { getEntry } from "@/data/entries";
import { ITEMS } from "@/data/items";
import { RESOURCES } from "@/data/resources";
import type { Icon } from "@/data/types";
import { atom } from "jotai";
import { inventoryAtom } from "./crafting";
import { layoutSlots } from "./inventoryLayout";
import { resourcesAtom } from "./resources";
import { persistedAtom } from "./save";

export const INVENTORY_COLUMNS = 5;
const MIN_ROWS = 4;

export type InventorySlot = {
  id: string;
  label: string;
  icon: Icon;
  amount: number;
} | null;

// plats i griden → id, eller null för en tom ruta. Antalen ligger kvar i
// resourcesAtom och inventoryAtom; här sparas bara var saker ligger
export const inventorySlotsAtom = persistedAtom<(string | null)[]>(
  "inventorySlots",
  [],
  (stored) =>
    Array.isArray(stored)
      ? stored.map((id) => (typeof id === "string" ? id : null))
      : [],
);

// fast ordning för nya id:n: resurser, sedan föremål, som i data/
const ENTRY_ORDER = [...Object.keys(RESOURCES), ...Object.keys(ITEMS)];

const amountsAtom = atom((get) => ({
  ...get(resourcesAtom),
  ...get(inventoryAtom),
}));

// räknas fram när den läses, så att nya saker får en plats utan att
// något behöver skrivas
const layoutAtom = atom((get) => {
  const amounts = get(amountsAtom);
  const owned = ENTRY_ORDER.filter((id) => (amounts[id] ?? 0) > 0);
  return layoutSlots(get(inventorySlotsAtom), owned, INVENTORY_COLUMNS, MIN_ROWS);
});

export const inventoryGridAtom = atom((get): InventorySlot[] => {
  const amounts = get(amountsAtom);

  return get(layoutAtom).map((id) => {
    const entry = id ? getEntry(id) : undefined;
    return entry
      ? { id: entry.id, label: entry.label, icon: entry.icon, amount: amounts[entry.id] }
      : null;
  });
});

// slänger allt av en resurs eller ett föremål. Rutan blir tom av sig
// själv, eftersom layouten bara visar det spelaren äger
export const dropEntryAtom = atom(null, (get, set, id: string) => {
  const kind = getEntry(id)?.kind;
  if (!kind) return;

  const target = kind === "resource" ? resourcesAtom : inventoryAtom;
  const { [id]: _dropped, ...rest } = get(target);
  set(target, rest);
});

// flyttar det som ligger på from till to. Ligger något på to byter de plats
export const moveSlotAtom = atom(null, (get, set, from: number, to: number) => {
  const slots = [...get(layoutAtom)];
  if (from === to || !slots[from] || to < 0 || to >= slots.length) return;

  [slots[from], slots[to]] = [slots[to], slots[from]];

  // tomma rutor i slutet behöver inte sparas
  while (slots.length > 0 && slots.at(-1) === null) slots.pop();
  set(inventorySlotsAtom, slots);
});
