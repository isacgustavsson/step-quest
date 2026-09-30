import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

export const BANK_KEY = "stepBank:balance";

type WithDrawResult =
  | { ok: false; reason: string }
  | { ok: true; newBalance: number };

export const bankedStepsAtom = atom(0);

export const depositAtom = atom(null, (get, set, delta: number) => {
  if (delta <= 0) return;

  const current = get(bankedStepsAtom);
  const next = current + delta;

  set(bankedStepsAtom, next);
  AsyncStorage.setItem(BANK_KEY, String(next));
});

export const withdrawAtom = atom(
  null,
  (get, set, amount: number): WithDrawResult => {
    const current = get(bankedStepsAtom);

    if (amount > current)
      return {
        ok: false,
        reason:
          "you don't have enough steps in the bank to make a withdrawal..",
      };

    const next = current - amount;
    set(bankedStepsAtom, next);
    AsyncStorage.setItem(BANK_KEY, String(next));

    return { ok: true, newBalance: next };
  },
);
