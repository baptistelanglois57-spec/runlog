import assert from "node:assert/strict";
import test from "node:test";

import type { ExerciseLibrary } from "../src/types/Gym/ExerciseLibrary.ts";
import type { GymExercise } from "../src/types/Gym/GymExercise.ts";
import type { GymSession } from "../src/types/GymSession.ts";
import { getGymExerciseRecordCandidates } from "../src/utils/gymRecordNotifications.ts";

const library: ExerciseLibrary[] = [
  { id: "pec-fly", name: "Pec Fly", muscleGroup: "Pectoraux", createdAt: "2026-01-01" },
  { id: "curl", name: "Curl Marteau", muscleGroup: "Biceps", createdAt: "2026-01-01" },
  { id: "pull-up", name: "Tractions", muscleGroup: "Dos", createdAt: "2026-01-01" },
  { id: "pec-fly-machine", name: "Pec Fly machine", muscleGroup: "Pectoraux", createdAt: "2026-01-01" },
];

function exercise(
  id: string,
  libraryExerciseId: string,
  sets: GymExercise["sets"],
  name = library.find((item) => item.id === libraryExerciseId)?.name ?? "Exercice"
): GymExercise {
  return { id, libraryExerciseId, name, sets };
}

function session(
  id: string,
  date: string,
  exercises: GymExercise[]
): GymSession {
  return { id, date, name: "Séance test", exercises, comment: "" };
}

function detect(previousSessions: GymSession[], savedSession: GymSession, isEditing = false) {
  return getGymExerciseRecordCandidates({
    previousSessions,
    savedSession,
    library,
    isEditing,
  });
}

test("une hausse de performance chargée crée un seul record", () => {
  const previous = session("old", "2026-08-03", [
    exercise("old-pec", "pec-fly", [{ reps: 10, weight: 90 }]),
  ]);
  const saved = session("new", "2026-08-10", [
    exercise("new-pec", "pec-fly", [{ reps: 10, weight: 92 }]),
  ]);
  const candidates = detect([previous], saved);

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].exerciseId, "pec-fly");
  assert.equal(candidates[0].current.set.weight, 92);
});

test("plusieurs séries meilleures d'un exercice produisent une seule notification", () => {
  const previous = session("old", "2026-08-03", [
    exercise("old-pec", "pec-fly", [{ reps: 10, weight: 90 }]),
  ]);
  const saved = session("new", "2026-08-10", [
    exercise("new-pec", "pec-fly", [
      { reps: 10, weight: 92 },
      { reps: 10, weight: 94 },
      { reps: 10, weight: 96 },
    ]),
  ]);
  const candidates = detect([previous], saved);

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].current.set.weight, 96);
});

test("une performance inférieure ou identique ne crée aucun record", () => {
  const previous = session("old", "2026-08-03", [
    exercise("old-pec", "pec-fly", [{ reps: 10, weight: 90 }]),
  ]);

  assert.equal(detect([previous], session("lower", "2026-08-10", [
    exercise("lower-pec", "pec-fly", [{ reps: 10, weight: 88 }]),
  ])).length, 0);
  assert.equal(detect([previous], session("equal", "2026-08-10", [
    exercise("equal-pec", "pec-fly", [{ reps: 10, weight: 90 }]),
  ])).length, 0);
});

test("la première occurrence et les exercices aux IDs distincts ne créent pas de faux record", () => {
  const first = session("first", "2026-08-10", [
    exercise("first-pec", "pec-fly", [{ reps: 12, weight: 93 }]),
  ]);
  const otherExercise = session("new", "2026-08-10", [
    exercise("machine", "pec-fly-machine", [{ reps: 20, weight: 100 }]),
  ]);
  const previous = session("old", "2026-08-03", [
    exercise("old-pec", "pec-fly", [{ reps: 10, weight: 90 }]),
  ]);

  assert.equal(detect([], first).length, 0);
  assert.equal(detect([previous], otherExercise).length, 0);
});

test("deux exercices améliorés dans la même séance créent deux notifications", () => {
  const previous = session("old", "2026-08-03", [
    exercise("old-pec", "pec-fly", [{ reps: 10, weight: 90 }]),
    exercise("old-curl", "curl", [{ reps: 12, weight: 16 }]),
  ]);
  const saved = session("new", "2026-08-10", [
    exercise("new-pec", "pec-fly", [{ reps: 10, weight: 92 }]),
    exercise("new-curl", "curl", [{ reps: 10, weight: 18 }]),
  ]);

  assert.deepEqual(
    detect([previous], saved).map((candidate) => candidate.exerciseId).sort(),
    ["curl", "pec-fly"]
  );
});

test("une séance existante sauvegardée à l'identique ne recrée pas de record", () => {
  const older = session("old", "2026-08-03", [
    exercise("old-pec", "pec-fly", [{ reps: 10, weight: 90 }]),
  ]);
  const persisted = session("current", "2026-08-10", [
    exercise("current-pec", "pec-fly", [{ reps: 10, weight: 92 }]),
  ]);

  assert.equal(detect([older, persisted], persisted, true).length, 0);
});

test("une modification récente qui améliore réellement une série peut créer un record", () => {
  const older = session("old", "2026-08-03", [
    exercise("old-pec", "pec-fly", [{ reps: 10, weight: 90 }]),
  ]);
  const persisted = session("current", "2026-08-10", [
    exercise("current-pec", "pec-fly", [{ reps: 10, weight: 91 }]),
  ]);
  const edited = session("current", "2026-08-10", [
    exercise("current-pec", "pec-fly", [{ reps: 10, weight: 93 }]),
  ]);
  const candidates = detect([older, persisted], edited, true);

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].current.set.weight, 93);
});

test("un exercice au poids du corps compare les répétitions sans NaN", () => {
  const previous = session("old", "2026-08-03", [
    exercise("old-pull-up", "pull-up", [{ reps: 10, weight: 0 }]),
  ]);
  const saved = session("new", "2026-08-10", [
    exercise("new-pull-up", "pull-up", [{ reps: 12, weight: 0 }]),
  ]);
  const candidates = detect([previous], saved);

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].current.mode, "repetitions");
  assert.equal(JSON.stringify(candidates).includes("NaN"), false);
});

test("une séance rétroactive ne génère pas de record historique", () => {
  const existingLatest = session("latest", "2026-08-10", [
    exercise("latest-pec", "pec-fly", [{ reps: 10, weight: 90 }]),
  ]);
  const backdated = session("backdated", "2026-08-05", [
    exercise("backdated-pec", "pec-fly", [{ reps: 10, weight: 96 }]),
  ]);

  assert.equal(detect([existingLatest], backdated).length, 0);
});
