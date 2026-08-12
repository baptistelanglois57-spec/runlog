import { supabase } from "../lib/supabase";

import type {
  ExerciseLibrary,
  MuscleGroup,
} from "../types/Gym/ExerciseLibrary";

const TABLE = "exercise_library";

type ExerciseLibraryRow = {
  id: string;
  name: string;
  muscle_group: MuscleGroup;
  created_at: string;
};

function mapExercise(exercise: ExerciseLibraryRow): ExerciseLibrary {
  return {
    id: exercise.id,
    name: exercise.name,
    muscleGroup: exercise.muscle_group,
    createdAt: exercise.created_at,
  };
}

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

  return (data ?? []).map(mapExercise);
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
): Promise<ExerciseLibrary | null> {
  const cleanName =
    name.trim();

  if (!cleanName) {
    return null;
  }

  const { data: existing } =
    await supabase
      .from(TABLE)
      .select("*")
      .ilike("name", cleanName)
      .maybeSingle();

  if (existing) {
    return mapExercise(existing);
  }

  const { data, error } =
    await supabase
      .from(TABLE)
      .insert({
        name: cleanName,
        muscle_group:
          muscleGroup,
      })
      .select("*")
      .single();

  if (error) {
    console.error(
      "Erreur addExercise :",
      error
    );

    return null;
  }

  return data ? mapExercise(data) : null;
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
