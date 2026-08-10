import { useEffect, useState } from "react";

import {
  getExercises,
} from "../../services/exerciseLibraryService";

type Props = {
  name: string;

  setName: (
    value: string
  ) => void;
};

export default function NameField({
  name,
  setName,
}: Props) {
  const [exerciseNames, setExerciseNames] =
    useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const exercises =
        await getExercises();

      setExerciseNames(
        exercises
          .filter(
            (exercise) =>
              exercise.muscleGroup ===
              "Course à pied"
          )
          .map(
            (exercise) =>
              exercise.name
          )
      );
    }

    load();
  }, []);

  return (
    <label className="run-form-field run-form-field--name">
      <span>Nom</span>
      <select
        value={name}
        onChange={(e) => setName(e.target.value)}
      >
        <option value="">Choisir une séance</option>

        {exerciseNames.map((exerciseName) => (
          <option key={exerciseName} value={exerciseName}>
            {exerciseName}
          </option>
        ))}
      </select>
    </label>
  );
}
