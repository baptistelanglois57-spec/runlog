import { useState } from "react";

import { theme } from "../../styles/theme";

import ExerciseHistoryModal from "./ExerciseHistoryModal";
import ExerciseLibraryModal from "./ExerciseLibraryModal";
import SetRow from "./SetRow";

import type { GymSession } from "../../types/GymSession";
import type { GymExercise } from "../../types/Gym/GymExercise";

import { addExercise } from "../../services/exerciseLibraryService";

type Props = {
  exercise: GymExercise;

  historySessions: GymSession[];

  exerciseNames: string[];

  refreshExercises: () => Promise<void>;

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

  onAddSet: (
    exerciseIndex: number
  ) => void;

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
  historySessions,
  exerciseNames,
  refreshExercises,
  index,
  onExerciseNameChange,
  onSetChange,
  onAddSet,
  onDeleteSet,
  onDeleteExercise,
}: Props) {
  const [showHistory, setShowHistory] =
    useState(false);

  const [showLibraryModal, setShowLibraryModal] =
    useState(false);

  async function handleCreateExercise(
    value: string
  ) {
    await addExercise(value);

    await refreshExercises();

    onExerciseNameChange(
      index,
      value
    );

    setShowLibraryModal(false);
  }

  return (
    <>
      <div
        style={{
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <h3
            style={{
              margin: 0,
              color:
                theme.colors.text,
              fontSize: 20,
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
              width: 34,
              height: 34,
              border: "none",
              borderRadius: 9,
              background: "#C0392B",
              color: "#fff",
              display: "flex",
              justifyContent:
                "center",
              alignItems: "center",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            🗑️
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              flex: 1,
            }}
          >
            <select
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
                borderRadius: 10,
                border: `1px solid ${theme.colors.border}`,
                background:
                  theme.colors.background,
                color:
                  theme.colors.text,
                fontSize: 15,
                boxSizing: "border-box",
              }}
            >
              <option value="">
                Choisir un exercice
              </option>

              {exerciseNames.map((name) => (
                <option
                  key={name}
                  value={name}
                >
                  {name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() =>
                setShowLibraryModal(true)
              }
              style={{
                marginTop: 8,
                border: "none",
                background: "transparent",
                color:
                  theme.colors.primary,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
                padding: 0,
              }}
            >
              ➕ Nouvel exercice
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowHistory(true)
            }
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              border: "none",
              background:
                theme.colors.primary,
              color: "#000",
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🕒
          </button>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  paddingBottom: 6,
                  fontSize: 13,
                }}
              >
                Série
              </th>

              <th
                style={{
                  paddingBottom: 6,
                  fontSize: 13,
                }}
              >
                Répétitions
              </th>

              <th
                style={{
                  paddingBottom: 6,
                  fontSize: 13,
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
            justifyContent:
              "center",
            marginTop: 14,
          }}
        >
          <button
            type="button"
            onClick={() =>
              onAddSet(index)
            }
            style={{
              width: 220,
              padding: "11px 14px",
              border: "none",
              borderRadius: 10,
              background:
                theme.colors.primary,
              color: "#000",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ➕ Ajouter une série
          </button>
        </div>
      </div>

      <ExerciseHistoryModal
        isOpen={showHistory}
        onClose={() =>
          setShowHistory(false)
        }
        exerciseName={exercise.name}
        sessions={historySessions}
      />

      <ExerciseLibraryModal
        isOpen={showLibraryModal}
        title="Nouvel exercice"
        onClose={() =>
          setShowLibraryModal(false)
        }
        onSave={handleCreateExercise}
      />
    </>
  );
}