import { atom } from "jotai";
import { persistedAtom } from "./save";

type WithDrawResult =
  | { ok: false; reason: string }
  | { ok: true; newBalance: number };

export const isAvailableAtom = atom(false);

export const bankedStepsAtom = persistedAtom("steps", 0);

export const depositAtom = atom(null, (get, set, delta: number) => {
  if (delta <= 0) return;

  set(bankedStepsAtom, get(bankedStepsAtom) + delta);
});

export const withdrawAtom = atom(
  null,
  (get, set, amount: number): WithDrawResult => {
    const current = get(bankedStepsAtom);

    if (amount > current)
      return {
        ok: false,
        reason: "you don't have enough steps in the bank..",
      };

    const next = current - amount;
    set(bankedStepsAtom, next);

    return { ok: true, newBalance: next };
  },
);
