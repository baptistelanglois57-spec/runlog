export type MuscleGroup =
  | "Course à pied"
  | "Pectoraux"
  | "Dos"
  | "Épaules"
  | "Biceps"
  | "Triceps"
  | "Avant-bras"
  | "Jambes"
  | "Abdos";

export type ExerciseLibrary = {
  id: string;

  name: string;

  muscleGroup: MuscleGroup;

  createdAt: string;
};