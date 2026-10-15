// var i inventoryts grid varje id ligger. Utan importer, så att den går
// att testa för sig

export type SlotLayout = (string | null)[];

// platserna som visas: sparade platser för det spelaren äger, och nya id:n
// i första lediga ruta. owned ska vara i en fast ordning, så att nya id:n
// alltid hamnar likadant. Griden är hela rader, minst minRows, med en tom
// rad efter den sista som används, så att det finns plats att dra till
export const layoutSlots = (
  stored: readonly (string | null)[],
  owned: readonly string[],
  columns: number,
  minRows: number,
): SlotLayout => {
  const ownedIds = new Set(owned);
  const placed = new Set<string>();

  // det som tagit slut eller ligger dubbelt blir tomt
  const slots: SlotLayout = stored.map((id) => {
    if (id === null || !ownedIds.has(id) || placed.has(id)) return null;
    placed.add(id);
    return id;
  });

  let free = 0;
  for (const id of owned) {
    if (placed.has(id)) continue;
    while (free < slots.length && slots[free] !== null) free++;
    slots[free] = id;
    placed.add(id);
  }

  const lastUsed = slots.findLastIndex((id) => id !== null);
  const usedRows = lastUsed < 0 ? 0 : Math.floor(lastUsed / columns) + 1;
  const length = Math.max(minRows, usedRows + 1) * columns;

  return Array.from({ length }, (_, i) => slots[i] ?? null);
};
