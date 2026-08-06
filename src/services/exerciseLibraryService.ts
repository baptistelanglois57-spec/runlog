import { supabase } from "../lib/supabase";

import type {
  ExerciseLibrary,
  MuscleGroup,
} from "../types/Gym/ExerciseLibrary";

const TABLE = "exercise_library";

export async function getExercises(): Promise<
  ExerciseLibrary[]
> {
  const { data, error } =
    await supabase
      .from(TABLE)
      .select("*")
      .order("name");

  if (error) {
    console.error(
      "Erreur getExercises :",
      error
    );

    return [];
  }

  return (data ?? []).map(
    (exercise: any) => ({
      id: exercise.id,
      name: exercise.name,
      muscleGroup:
        exercise.muscle_group,
      createdAt:
        exercise.created_at,
    })
  );
}

export async function getExerciseNames(): Promise<
  string[]
> {
  const exercises =
    await getExercises();

  return exercises.map(
    (exercise) => exercise.name
  );
}
export async function addExercise(
  name: string,
  muscleGroup: MuscleGroup
): Promise<void> {
  const cleanName =
    name.trim();

  if (!cleanName) {
    return;
  }

  const { data: existing } =
    await supabase
      .from(TABLE)
      .select("id")
      .ilike("name", cleanName)
      .maybeSingle();

  if (existing) {
    return;
  }

  const { error } =
    await supabase
      .from(TABLE)
      .insert({
        name: cleanName,
        muscle_group:
          muscleGroup,
      });

  if (error) {
    console.error(
      "Erreur addExercise :",
      error
    );
  }
}

export async function updateExercise(
  id: string,
  name: string,
  muscleGroup: MuscleGroup
): Promise<void> {
  const { error } =
    await supabase
      .from(TABLE)
      .update({
        name: name.trim(),
        muscle_group:
          muscleGroup,
      })
      .eq("id", id);

  if (error) {
    console.error(
      "Erreur updateExercise :",
      error
    );
  }
}

export async function deleteExercise(
  id: string
): Promise<void> {
  const { error } =
    await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "Erreur deleteExercise :",
      error
    );
  }
}