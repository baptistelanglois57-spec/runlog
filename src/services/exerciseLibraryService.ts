import type { ExerciseLibrary } from "../types/Gym/ExerciseLibrary";

const STORAGE_KEY = "runlog_exercise_library";

export async function getExercises() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data) as ExerciseLibrary[];
}

export async function saveExercises(
  exercises: ExerciseLibrary[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(exercises)
  );
}

export async function addExercise(
  name: string
) {
  const exercises =
    await getExercises();

  const exists = exercises.some(
    (exercise) =>
      exercise.name
        .trim()
        .toLowerCase() ===
      name.trim().toLowerCase()
  );

  if (exists) {
    return;
  }

  exercises.push({
    id: crypto.randomUUID(),

    name: name.trim(),

    createdAt:
      new Date().toISOString(),
  });

  exercises.sort((a, b) =>
    a.name.localeCompare(
      b.name,
      "fr"
    )
  );

  await saveExercises(exercises);
}

export async function updateExercise(
  id: string,
  name: string
) {
  const exercises =
    await getExercises();

  const exercise =
    exercises.find(
      (e) => e.id === id
    );

  if (!exercise) {
    return;
  }

  exercise.name = name.trim();

  exercises.sort((a, b) =>
    a.name.localeCompare(
      b.name,
      "fr"
    )
  );

  await saveExercises(exercises);
}

export async function deleteExercise(
  id: string
) {
  const exercises =
    await getExercises();

  await saveExercises(
    exercises.filter(
      (e) => e.id !== id
    )
  );
}
export async function getExerciseNames() {
  const exercises = await getExercises();

  return exercises.map(
    (exercise) => exercise.name
  );
}