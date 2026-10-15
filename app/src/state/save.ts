import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom, PrimitiveAtom } from "jotai";
import type { Store } from "jotai/vanilla";
import { LEGACY_KEYS, migrate, SAVE_VERSION, SaveFile } from "./migrations";

// hela spelets sparade tillstånd ligger under en nyckel, så att en
// handling som ändrar flera atomer sparas på en gång
export const SAVE_KEY = "save";

type Field<T> = {
  atom: PrimitiveAtom<T>;
  initial: T;
  // kontrollerar ett sparat värde, t.ex. att en position finns på kartan
  restore?: (stored: unknown) => T;
};

const fields = new Map<string, Field<any>>();

// en atom som sparas automatiskt. key är namnet i sparfilen och får inte
// ändras utan en migrering i migrations.ts
export const persistedAtom = <T>(
  key: string,
  initial: T,
  restore?: (stored: unknown) => T,
) => {
  if (fields.has(key)) throw new Error(`save key "${key}" is used twice`);

  const value = atom(initial);
  fields.set(key, { atom: value, initial, restore });
  return value;
};

// sant när sparfilen har lästs in. Spelet visas inte innan dess, så att
// en handling inte hinner skriva över sparfilen med startvärden
export const hydratedAtom = atom(false);

const snapshot = (get: Store["get"]): SaveFile => ({
  version: SAVE_VERSION,
  data: Object.fromEntries(
    [...fields].map(([key, field]) => [key, get(field.atom)]),
  ),
});

const write = (get: Store["get"]) =>
  AsyncStorage.setItem(SAVE_KEY, JSON.stringify(snapshot(get)));

const readSave = async (): Promise<SaveFile | null> => {
  const stored = await AsyncStorage.getItem(SAVE_KEY);
  if (stored) return JSON.parse(stored);

  // sparfiler från innan allt låg under en nyckel
  const legacy = await AsyncStorage.multiGet(LEGACY_KEYS);
  if (legacy.every(([, value]) => value === null)) return null;

  return {
    version: 0,
    data: Object.fromEntries(
      legacy.map(([key, value]) => [key, value && JSON.parse(value)]),
    ),
  };
};

export const loadSaveAtom = atom(null, async (get, set) => {
  let save: SaveFile | null = null;
  try {
    const stored = await readSave();
    save = stored && migrate(stored);
  } catch (error) {
    // sparfilen behålls under en annan nyckel, så att den inte skrivs över
    // av ett nytt spel och kan räddas för hand
    console.warn("could not read save, starting over", error);
    const broken = await AsyncStorage.getItem(SAVE_KEY);
    if (broken) await AsyncStorage.setItem(`${SAVE_KEY}:broken`, broken);
  }

  for (const [key, field] of fields) {
    const stored = save?.data[key];
    if (stored === undefined || stored === null) continue;
    set(field.atom, field.restore ? field.restore(stored) : stored);
  }

  set(hydratedAtom, true);

  // en migrerad sparfil skrivs i det nya formatet, och de gamla nycklarna
  // tas bort först när den nya finns
  await write(get);
  await AsyncStorage.multiRemove(LEGACY_KEYS);
});

// sparar vid varje ändring av en sparad atom. Flera ändringar i samma
// handling (t.ex. steg, resurser och xp vid insamling) blir en skrivning
export const subscribeSave = (store: Store) => {
  let queued = false;

  const flush = () => {
    queued = false;
    write(store.get);
  };

  const unsubscribes = [...fields.values()].map((field) =>
    store.sub(field.atom, () => {
      if (queued) return;
      queued = true;
      queueMicrotask(flush);
    }),
  );

  return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
};

export const resetProgressAtom = atom(null, async (get, set) => {
  for (const field of fields.values()) set(field.atom, field.initial);
  await write(get);
});
