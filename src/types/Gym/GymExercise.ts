import type { GymSet } from "./GymSet";

export type GymExercise = {
  /** Identifiant de l'occurrence dans la séance. */
  id: string;

  /** Identifiant canonique de l'exercice dans exercise_library. */
  libraryExerciseId?: string;

  name: string;
  sets: GymSet[];
};
