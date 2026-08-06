import { useEffect, useState } from "react";

import { theme } from "../../styles/theme";

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
    <select
      value={name}
      onChange={(e) =>
        setName(e.target.value)
      }
      style={{
        width: "100%",
        height: 56,
        padding: "0 16px",
        borderRadius: 16,
        border: `1px solid ${theme.colors.border}`,
        background:
          theme.colors.background,
        color: theme.colors.text,
        fontSize: 16,
        outline: "none",
        boxSizing: "border-box",
      }}
    >
      <option value="">
        Choisir une séance
      </option>

      {exerciseNames.map(
        (exerciseName) => (
          <option
            key={exerciseName}
            value={exerciseName}
          >
            {exerciseName}
          </option>
        )
      )}
    </select>
  );
}