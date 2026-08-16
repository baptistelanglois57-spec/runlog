import assert from "node:assert/strict";
import test from "node:test";

import type { ExerciseLibrary } from "../src/types/Gym/ExerciseLibrary.ts";
import type { GymExercise } from "../src/types/Gym/GymExercise.ts";
import type { GymSession } from "../src/types/GymSession.ts";
import { createExerciseHistoryIndex } from "../src/utils/gymExerciseHistory.ts";
import {
  buildGymComparisonShareText,
  formatGymComparisonShareSet,
  shareGymComparisonText,
} from "../src/utils/gymComparisonShare.ts";

const library: ExerciseLibrary[] = [
  { id: "pull-over", name: "Pull Over", muscleGroup: "Dos", createdAt: "2026-01-01" },
  { id: "curl-marteau", name: "Curl Marteau", muscleGroup: "Biceps", createdAt: "2026-01-01" },
  { id: "curl-machine", name: "Curl Marteau Machine", muscleGroup: "Biceps", createdAt: "2026-01-01" },
];

function exercise(
  id: string,
  name: string,
  libraryExerciseId: string,
  sets: GymExercise["sets"]
): GymExercise {
  return { id, name, libraryExerciseId, sets };
}

function session(
  id: string,
  date: string,
  name: string,
  exercises: GymExercise[]
): GymSession {
  return { id, date, name, exercises, comment: "" };
}

const previous = session("previous", "2026-08-05", "Haut du corps", [
  exercise("old-pull", "Pull Over", "pull-over", [
    { reps: 12, weight: 42 },
    { reps: 10, weight: 42 },
  ]),
  exercise("old-machine", "Curl Marteau Machine", "curl-machine", [
    { reps: 8, weight: 35 },
  ]),
]);

const current = session("current", "2026-08-12", "Dos Biceps Triceps", [
  exercise("current-pull", "Pull Over", "pull-over", [
    { reps: 12, weight: 45 },
    { reps: 11, weight: 45 },
    { reps: 10, weight: 45 },
    { reps: 9, weight: 45 },
  ]),
  exercise("current-curl", "Curl Marteau", "curl-marteau", [
    { reps: 10, weight: 16 },
    { reps: 9, weight: 16 },
    { reps: 8 },
  ]),
]);

test("l'export respecte l'ordre, toutes les séries, le groupe canonique et le verdict existant", () => {
  const historyIndex = createExerciseHistoryIndex([current, previous], library);
  const text = buildGymComparisonShareText({ session: current, library, historyIndex });

  assert.ok(text.indexOf("EXERCICE 1 — Pull Over") < text.indexOf("EXERCICE 2 — Curl Marteau"));
  assert.match(text, /Groupe musculaire : Dos/);
  assert.match(text, /S4 : 9 reps × 45 kg/);
  assert.match(text, /Séance précédente — 5 août 2026/);
  assert.match(text, /Verdict RunLog :\nProgression exceptionnelle/);
  assert.match(text, /EXERCICE 2 — Curl Marteau[\s\S]*Groupe musculaire : Biceps/);
  assert.match(text, /S3 : 8 reps/);
  assert.doesNotMatch(text, /undefined|NaN|null kg/);
});

test("une première occurrence est exportée sans performance artificielle", () => {
  const historyIndex = createExerciseHistoryIndex([current, previous], library);
  const text = buildGymComparisonShareText({ session: current, library, historyIndex });
  const curlBlock = text.slice(text.indexOf("EXERCICE 2 — Curl Marteau"));

  assert.match(curlBlock, /Aucune performance précédente enregistrée\./);
  assert.match(curlBlock, /Verdict RunLog :\nPremière occurrence/);
  assert.doesNotMatch(curlBlock, /35 kg/);
});

test("deux noms proches restent séparés par leur identifiant canonique", () => {
  const historyIndex = createExerciseHistoryIndex([current, previous], library);
  const text = buildGymComparisonShareText({ session: current, library, historyIndex });
  const curlBlock = text.slice(text.indexOf("EXERCICE 2 — Curl Marteau"));

  assert.doesNotMatch(curlBlock, /Séance précédente — 5 août 2026/);
});

test("les séries incomplètes ont un format sûr", () => {
  assert.equal(formatGymComparisonShareSet({ reps: 10, weight: 0 }, 0), "S1 : 10 reps");
  assert.equal(formatGymComparisonShareSet({ weight: 18 }, 1), "S2 : 18 kg");
  assert.equal(formatGymComparisonShareSet({}, 2), "S3 : Données non renseignées");
});

test("le partage natif reçoit le texte complet", async () => {
  let received: ShareData | undefined;
  const result = await shareGymComparisonText("Texte complet × éà", "RunLog", {
    share: async (data) => {
      received = data;
    },
  });

  assert.equal(result, "shared");
  assert.deepEqual(received, { title: "RunLog", text: "Texte complet × éà" });
});

test("le fallback copie le texte quand le partage natif est absent", async () => {
  let copied = "";
  const result = await shareGymComparisonText("Comparaison complète", "RunLog", {
    clipboard: {
      writeText: async (text) => {
        copied = text;
      },
    },
  });

  assert.equal(result, "copied");
  assert.equal(copied, "Comparaison complète");
});
