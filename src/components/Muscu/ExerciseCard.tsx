import { theme } from "../../styles/theme";
import type { GymExercise } from "../../types/Gym/GymExercise";
import SetRow from "./SetRow";

type Props = {
  exercise: GymExercise;
  index: number;

  onExerciseNameChange: (
    exerciseIndex: number,
    value: string
  ) => void;

  onSetChange: (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: number
  ) => void;

  onAddSet: (exerciseIndex: number) => void;

  onDeleteSet: (
    exerciseIndex: number,
    setIndex: number
  ) => void;

  onDeleteExercise: (
    exerciseIndex: number
  ) => void;
};

export default function ExerciseCard({
  exercise,
  index,
  onExerciseNameChange,
  onSetChange,
  onAddSet,
  onDeleteSet,
  onDeleteExercise,
}: Props) {
  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "16px",
        padding: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: theme.colors.primary,
            fontSize: "20px",
          }}
        >
          🏋️ Exercice {index + 1}
        </h3>

        <button
          type="button"
          onClick={() =>
            onDeleteExercise(index)
          }
          style={{
            width: "34px",
            height: "34px",
            border: "none",
            borderRadius: "9px",
            background: "#C0392B",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          🗑️
        </button>
      </div>
            <input
        type="text"
        placeholder="Nom de l'exercice"
        value={exercise.name}
        onChange={(e) =>
          onExerciseNameChange(
            index,
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "10px 12px",
          marginBottom: "14px",
          borderRadius: "10px",
          border: `1px solid ${theme.colors.border}`,
          background: theme.colors.background,
          color: theme.colors.text,
          fontSize: "15px",
          boxSizing: "border-box",
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                paddingBottom: "6px",
                fontSize: "13px",
              }}
            >
              Série
            </th>

            <th
              style={{
                paddingBottom: "6px",
                fontSize: "13px",
              }}
            >
              Répétitions
            </th>

            <th
              style={{
                paddingBottom: "6px",
                fontSize: "13px",
              }}
            >
              Poids
            </th>

            <th></th>
          </tr>
        </thead>

        <tbody>
          {exercise.sets.map(
            (set, setIndex) => (
              <SetRow
                key={setIndex}
                index={setIndex}
                set={set}
                onChange={(
                  row,
                  field,
                  value
                ) =>
                  onSetChange(
                    index,
                    row,
                    field,
                    value
                  )
                }
                onDelete={(row) =>
                  onDeleteSet(
                    index,
                    row
                  )
                }
              />
            )
          )}
        </tbody>
      </table>
            <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "14px",
        }}
      >
        <button
          type="button"
          onClick={() => onAddSet(index)}
          style={{
            width: "220px",
            padding: "11px 14px",
            border: "none",
            borderRadius: "10px",
            background: theme.colors.primary,
            color: "#000",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            transition: "0.2s ease",
          }}
        >
          ➕ Ajouter une série
        </button>
      </div>
    </div>
  );
}