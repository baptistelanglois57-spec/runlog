import assert from "node:assert/strict";
import test from "node:test";

import type { GymExercise } from "../src/types/Gym/GymExercise.ts";
import { compareExerciseOccurrences } from "../src/utils/gymComparison.ts";

function occurrence(sets: GymExercise["sets"]): GymExercise {
  return { id: crypto.randomUUID(), name: "Développé incliné", sets };
}

test("une hausse de charge avec répétitions maintenues conserve le verdict existant", () => {
  const result = compareExerciseOccurrences(
    occurrence([{ reps: 10, weight: 26 }, { reps: 10, weight: 26 }]),
    occurrence([{ reps: 10, weight: 28 }, { reps: 10, weight: 28 }])
  );
  assert.equal(result.verdict, "Charge augmentée");
  assert.deepEqual(result.evolution, ["+2.0 kg"]);
});

test("une progression de répétitions est détectée malgré un nombre de séries différent", () => {
  const result = compareExerciseOccurrences(
    occurrence([{ reps: 10, weight: 28 }, { reps: 9, weight: 28 }]),
    occurrence([{ reps: 10, weight: 28 }, { reps: 10, weight: 28 }, { reps: 2, weight: 28 }])
  );
  assert.equal(result.verdict, "Bonne progression");
  assert.deepEqual(result.evolution, ["+3 répétitions"]);
});

test("un recul de répétitions ne produit ni NaN ni verdict artificiel", () => {
  const result = compareExerciseOccurrences(
    occurrence([{ reps: 12, weight: 20 }, { reps: 12, weight: 20 }]),
    occurrence([{ reps: 9, weight: 20 }, { reps: 10, weight: 20 }])
  );
  assert.equal(result.verdict, "Léger recul");
  assert.deepEqual(result.evolution, ["-5 répétitions"]);
  assert.equal(JSON.stringify(result).includes("NaN"), false);
});

test("les séries incomplètes sont ignorées prudemment dans les agrégats", () => {
  const result = compareExerciseOccurrences(
    occurrence([{ reps: undefined, weight: undefined }, { reps: 8, weight: 0 }]),
    occurrence([{ reps: 10, weight: 0 }, { reps: undefined, weight: undefined }])
  );
  assert.equal(result.verdict, "Bonne progression");
  assert.deepEqual(result.evolution, ["+2 répétitions"]);
  assert.equal(JSON.stringify(result).includes("undefined"), false);
});
