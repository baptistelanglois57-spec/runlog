import assert from "node:assert/strict";
import test from "node:test";

import {
  createExerciseHistoryIndex,
  estimateOneRepMax,
  getBestExercisePerformance,
  getExerciseHistory,
  getExerciseSessionVolume,
  getPreviousExerciseOccurrence,
  resolveExerciseIdentity,
} from "../src/utils/gymExerciseHistory.ts";
import type { ExerciseLibrary } from "../src/types/Gym/ExerciseLibrary.ts";
import type { GymExercise } from "../src/types/Gym/GymExercise.ts";
import type { GymSession } from "../src/types/GymSession.ts";

const library: ExerciseLibrary[] = [
  { id: "incline-dumbbell", name: "Développé incliné haltères", muscleGroup: "Pectoraux", createdAt: "2026-01-01" },
  { id: "incline-machine", name: "Développé incliné machine", muscleGroup: "Pectoraux", createdAt: "2026-01-01" },
  { id: "pull-up", name: "Tractions", muscleGroup: "Dos", createdAt: "2026-01-01" },
];

function exercise(
  id: string,
  name: string,
  sets: GymExercise["sets"],
  libraryExerciseId?: string
): GymExercise {
  return { id, name, sets, libraryExerciseId };
}

function session(id: string, date: string, name: string, exercises: GymExercise[]): GymSession {
  return { id, date, name, exercises, comment: "" };
}

test("l'identifiant canonique sépare deux exercices aux noms similaires", () => {
  const sessions = [
    session("s1", "2026-08-10", "Pecs", [
      exercise("o1", "Même nom affiché", [{ reps: 10, weight: 28 }], "incline-dumbbell"),
      exercise("o2", "Même nom affiché", [{ reps: 10, weight: 55 }], "incline-machine"),
    ]),
  ];
  const index = createExerciseHistoryIndex(sessions, library);
  assert.equal(getExerciseHistory("incline-dumbbell", index).length, 1);
  assert.equal(getExerciseHistory("incline-machine", index).length, 1);
});

test("une occurrence legacy n'est reliée que par nom exact et unique", () => {
  const exact = exercise("legacy-1", "  DÉVELOPPÉ INCLINÉ HALTÈRES ", []);
  const approximate = exercise("legacy-2", "Développé incliné", []);
  assert.deepEqual(resolveExerciseIdentity(exact, library), {
    exerciseId: "incline-dumbbell",
    source: "legacy-exact",
  });
  assert.equal(resolveExerciseIdentity(approximate, library).source, "unresolved");
});

test("un nom legacy ambigu n'est jamais rapproché", () => {
  const duplicateLibrary = [
    ...library,
    { ...library[0], id: "duplicate" },
  ];
  const resolution = resolveExerciseIdentity(
    exercise("legacy", "Développé incliné haltères", []),
    duplicateLibrary
  );
  assert.equal(resolution.source, "unresolved");
  assert.equal(resolution.reason, "ambiguous");
});

test("l'historique complet est trié et la comparaison choisit la précédente date", () => {
  const sessions = [
    session("latest", "2026-08-10", "Pecs / Épaules", [exercise("a", "Renommé", [], "incline-dumbbell")]),
    session("oldest", "2026-07-27", "Push", [exercise("b", "Ancien nom", [], "incline-dumbbell")]),
    session("previous", "2026-08-03", "Haut du corps", [exercise("c", "Nom différent", [], "incline-dumbbell")]),
  ];
  const index = createExerciseHistoryIndex(sessions, library);
  const history = getExerciseHistory("incline-dumbbell", index);
  assert.deepEqual(history.map((entry) => entry.sessionId), ["latest", "previous", "oldest"]);
  assert.equal(getPreviousExerciseOccurrence(history[0], history)?.sessionId, "previous");
});

test("une seule occurrence ne produit aucune précédente et zéro occurrence reste vide", () => {
  const index = createExerciseHistoryIndex([
    session("only", "2026-08-10", "Unique", [exercise("a", "Tractions", [{ reps: 8, weight: 0 }], "pull-up")]),
  ], library);
  const history = getExerciseHistory("pull-up", index);
  assert.equal(history.length, 1);
  assert.equal(getPreviousExerciseOccurrence(history[0], history), null);
  assert.deepEqual(getExerciseHistory("incline-machine", index), []);
});

test("la meilleure série chargée utilise Epley plutôt que la charge ou le volume seuls", () => {
  const sessions = [session("s1", "2026-08-10", "Pecs", [
    exercise("a", "Développé incliné haltères", [
      { reps: 3, weight: 32 },
      { reps: 10, weight: 28 },
      { reps: 20, weight: 20 },
    ], "incline-dumbbell"),
  ])];
  const history = getExerciseHistory("incline-dumbbell", createExerciseHistoryIndex(sessions, library));
  const best = getBestExercisePerformance(history);
  assert.equal(best?.set.weight, 28);
  assert.equal(best?.set.reps, 10);
  assert.equal(best?.estimatedOneRepMax, estimateOneRepMax({ reps: 10, weight: 28 }));
});

test("le volume additionne uniquement les séries complètes", () => {
  assert.equal(getExerciseSessionVolume([
    { reps: 10, weight: 28 },
    { reps: 9, weight: 28 },
    { reps: undefined, weight: 28 },
  ]), 532);
  assert.equal(getExerciseSessionVolume([{ reps: 10 }, { weight: 28 }]), null);
});

test("un exercice au poids du corps se classe par répétitions sans faux 1RM", () => {
  const sessions = [session("s1", "2026-08-10", "Dos", [
    exercise("a", "Tractions", [{ reps: 8, weight: 0 }, { reps: 12 }], "pull-up"),
  ])];
  const history = getExerciseHistory("pull-up", createExerciseHistoryIndex(sessions, library));
  const best = getBestExercisePerformance(history);
  assert.equal(best?.mode, "repetitions");
  assert.equal(best?.set.reps, 12);
  assert.equal(best?.estimatedOneRepMax, null);
});

test("un exercice renommé reste relié grâce à son identifiant", () => {
  const renamedLibrary = library.map((item) =>
    item.id === "incline-dumbbell" ? { ...item, name: "Développé incliné DB" } : item
  );
  const resolution = resolveExerciseIdentity(
    exercise("a", "Ancien libellé", [], "incline-dumbbell"),
    renamedLibrary
  );
  assert.equal(resolution.exerciseId, "incline-dumbbell");
  assert.equal(resolution.source, "canonical");
});
