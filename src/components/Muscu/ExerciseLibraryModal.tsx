import { useEffect, useState } from "react";

import { theme } from "../../styles/theme";

import type { MuscleGroup } from "../../types/Gym/ExerciseLibrary";

type Props = {
  isOpen: boolean;

  title: string;

  initialValue?: string;

  initialMuscleGroup?: MuscleGroup;

  onClose: () => void;

  onSave: (
    value: string,
    muscleGroup: MuscleGroup
  ) => void;
};

const muscleGroups: MuscleGroup[] = [
  "Pectoraux",
  "Dos",
  "Épaules",
  "Biceps",
  "Triceps",
  "Avant-bras",
  "Jambes",
  "Abdos",
];

export default function ExerciseLibraryModal({
  isOpen,
  title,
  initialValue = "",
  initialMuscleGroup = "Pectoraux",
  onClose,
  onSave,
}: Props) {
  const [value, setValue] =
    useState(initialValue);

  const [
    muscleGroup,
    setMuscleGroup,
  ] = useState<MuscleGroup>(
    initialMuscleGroup
  );

  useEffect(() => {
    setValue(initialValue);

    setMuscleGroup(
      initialMuscleGroup
    );
  }, [
    initialValue,
    initialMuscleGroup,
  ]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        style={{
          width: "100%",
          maxWidth: 430,
          background:
            theme.colors.card,
          borderRadius: 22,
          border: `1px solid ${theme.colors.border}`,
          padding: 24,
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 24,
            color:
              theme.colors.primary,
            textAlign: "center",
            fontSize: 22,
          }}
        >
          {title}
        </h2>

        <div
          style={{
            marginBottom: 18,
          }}
        >
          <div
            style={{
              color:
                theme.colors.text,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Nom de l'exercice
          </div>

          <input
            value={value}
            onChange={(e) =>
              setValue(
                e.target.value
              )
            }
            placeholder="Ex : Développé couché"
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 14,
              border: `1px solid ${theme.colors.border}`,
              background:
                theme.colors.background,
              color:
                theme.colors.text,
              fontSize: 16,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div
          style={{
            marginBottom: 28,
          }}
        >
          <div
            style={{
              color:
                theme.colors.text,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Groupe musculaire
          </div>

          <select
            value={muscleGroup}
            onChange={(e) =>
              setMuscleGroup(
                e.target
                  .value as MuscleGroup
              )
            }
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 14,
              border: `1px solid ${theme.colors.border}`,
              background:
                theme.colors.background,
              color:
                theme.colors.text,
              fontSize: 16,
            }}
          >
            {muscleGroups.map(
              (group) => (
                <option
                  key={group}
                  value={group}
                >
                  {group}
                </option>
              )
            )}
          </select>
        </div>
                <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 15,
              borderRadius: 14,
              border: `1px solid ${theme.colors.border}`,
              background:
                theme.colors.card,
              color:
                theme.colors.text,
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Annuler
          </button>

          <button
            onClick={() => {
              if (!value.trim()) {
                return;
              }

              onSave(
                value.trim(),
                muscleGroup
              );

              onClose();
            }}
            style={{
              flex: 1,
              padding: 15,
              borderRadius: 14,
              border: "none",
              background:
                theme.colors.primary,
              color: "#000",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}