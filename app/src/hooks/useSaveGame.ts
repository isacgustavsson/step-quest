// hooks/useSaveGame.ts
import { hydratedAtom, loadSaveAtom, subscribeSave } from "@/state/save";
import { useAtomValue, useSetAtom, useStore } from "jotai";
import { useEffect } from "react";

// alla filer med sparade atomer. De måste vara inlästa innan sparfilen
// läses, annars finns deras atomer inte i registret och sparas inte
import "@/state/crafting";
import "@/state/inventory";
import "@/state/map";
import "@/state/nodes";
import "@/state/player";
import "@/state/resources";
import "@/state/stepbank";

// läser in sparfilen och sparar sedan varje ändring. Returnerar om
// sparfilen är inläst
export const useSaveGame = () => {
  const store = useStore();
  const hydrated = useAtomValue(hydratedAtom);
  const load = useSetAtom(loadSaveAtom);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(
    () => (hydrated ? subscribeSave(store) : undefined),
    [hydrated, store],
  );

  return hydrated;
};
