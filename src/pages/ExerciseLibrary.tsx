import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ChevronLeft,
  Dumbbell,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import PageCard from "../components/Layout/PageCard";

import ExerciseLibraryModal from "../components/Muscu/ExerciseLibraryModal";

import { theme } from "../styles/theme";
import { UI } from "../styles/ui";

import type {
  ExerciseLibrary,
  MuscleGroup,
} from "../types/Gym/ExerciseLibrary";

import {
  getExercises,
  addExercise,
  updateExercise,
  deleteExercise,
} from "../services/exerciseLibraryService";

const muscleGroups: (
  | "Tous"
  | MuscleGroup
)[] = [
  "Tous",
  "Pectoraux",
  "Dos",
  "Épaules",
  "Biceps",
  "Triceps",
  "Avant-bras",
  "Jambes",
  "Abdos",
];

const badgeColors: Record<
  MuscleGroup,
  string
> = {
  Pectoraux: "#EF4444",
  Dos: "#3B82F6",
  Épaules: "#FACC15",
  Biceps: "#22C55E",
  Triceps: "#10B981",
  "Avant-bras": "#8B5CF6",
  Jambes: "#A16207",
  Abdos: "#F97316",
};

export default function ExerciseLibrary() {
  const navigate = useNavigate();

  const [exercises, setExercises] =
    useState<ExerciseLibrary[]>([]);

  const [selectedGroup, setSelectedGroup] =
    useState<
      "Tous" | MuscleGroup
    >("Tous");

  const [showModal, setShowModal] =
    useState(false);

  const [editingExercise, setEditingExercise] =
    useState<ExerciseLibrary | null>(
      null
    );

  useEffect(() => {
    loadExercises();
  }, []);
    async function loadExercises() {
    const data =
      await getExercises();

    setExercises(data);
  }

  const filteredExercises =
    useMemo(() => {
      if (
        selectedGroup === "Tous"
      ) {
        return exercises;
      }

      return exercises.filter(
        (exercise) =>
          exercise.muscleGroup ===
          selectedGroup
      );
    }, [
      exercises,
      selectedGroup,
    ]);

  async function handleSave(
    value: string,
    muscleGroup: MuscleGroup
  ) {
    if (editingExercise) {
      await updateExercise(
        editingExercise.id,
        value,
        muscleGroup
      );
    } else {
      await addExercise(
        value,
        muscleGroup
      );
    }

    await loadExercises();

    setEditingExercise(null);

    setShowModal(false);
  }

  async function handleDelete(
    id: string
  ) {
    if (
      !window.confirm(
        "Supprimer cet exercice ?"
      )
    ) {
      return;
    }

    await deleteExercise(id);

    await loadExercises();
  }

  function getBadgeColor(
    group: MuscleGroup
  ) {
    return badgeColors[group];
  }

  return (
        <AppContainer>
      <Section>
        <PageCard>
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <button
              onClick={() =>
                navigate("/tools")
              }
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                border: `1px solid ${theme.colors.border}`,
                background:
                  theme.colors.card,
                display: "flex",
                justifyContent:
                  "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <ChevronLeft
                size={22}
                color={
                  theme.colors.primary
                }
              />
            </button>

            <h1
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 10,
                color:
                  theme.colors.primary,
                fontSize:
                  UI.FONT_H1,
              }}
            >
              <Dumbbell size={24} />

              Exercices
            </h1>

            <div
              style={{
                width: 46,
              }}
            />
          </div>

          <button
            onClick={() => {
              setEditingExercise(null);

              setShowModal(true);
            }}
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: 16,
              background:
                theme.colors.primary,
              color: "#000",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Plus size={18} />

              Ajouter un exercice
            </div>
          </button>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 10,
              marginBottom: 28,
            }}
          >
            {muscleGroups.map(
              (group) => (
                <button
                  key={group}
                  onClick={() =>
                    setSelectedGroup(
                      group
                    )
                  }
                  style={{
                    padding:
                      "10px 16px",
                    borderRadius: 999,
                    border:
                      selectedGroup ===
                      group
                        ? "none"
                        : `1px solid ${theme.colors.border}`,
                    background:
                      selectedGroup ===
                      group
                        ? "#FFFFFF"
                        : "transparent",
                    color:
                      selectedGroup ===
                      group
                        ? "#000"
                        : "#FFF",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    transition:
                      ".2s",
                  }}
                >
                  {group}
                </button>
              )
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          ></div>
                      {filteredExercises.length ===
            0 ? (
              <div
                style={{
                  textAlign: "center",
                  color:
                    theme.colors.textSecondary,
                  padding:
                    "40px 0",
                  fontSize: 15,
                }}
              >
                Aucun exercice
                trouvé.
              </div>
            ) : (
              filteredExercises.map(
                (exercise) => (
                  <div
                    key={exercise.id}
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      padding: 14,
                      borderRadius: 16,
                      background:
                        theme.colors.background,
                      border: `1px solid ${theme.colors.border}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection:
                          "column",
                        gap: 10,
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          color:
                            theme.colors.text,
                          fontWeight: 700,
                          fontSize: 17,
                          lineHeight: 1.3,
                        }}
                      >
                        {exercise.name}
                      </div>

                      <div
                        style={{
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          gap: 8,
                          width:
                            "fit-content",
                          padding:
                            "4px 10px",
                          borderRadius: 999,
                          background:
                            getBadgeColor(
                              exercise.muscleGroup
                            ),
                          color:
                            "#FFF",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {
                          exercise.muscleGroup
                        }
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginLeft: 20,
                      }}
                    >
                      <button
                        onClick={() => {
                          setEditingExercise(
                            exercise
                          );

                          setShowModal(
                            true
                          );
                        }}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          border: `1px solid ${theme.colors.border}`,
                          background:
                            theme.colors.card,
                          cursor:
                            "pointer",
                          display:
                            "flex",
                          justifyContent:
                            "center",
                          alignItems:
                            "center",
                        }}
                      >
                        <Pencil
                          size={18}
                          color={
                            theme.colors.primary
                          }
                        />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            exercise.id
                          )
                        }
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          border: "none",
                          background:
                            "#C0392B",
                          cursor:
                            "pointer",
                          display:
                            "flex",
                          justifyContent:
                            "center",
                          alignItems:
                            "center",
                        }}
                      >
                        <Trash2
                          size={18}
                          color="#FFF"
                        />
                      </button>
                    </div>
                  </div>
                )
              )
            )}

          <ExerciseLibraryModal
            isOpen={showModal}
            title={
              editingExercise
                ? "Modifier l'exercice"
                : "Nouvel exercice"
            }
            initialValue={
              editingExercise?.name ?? ""
            }
            initialMuscleGroup={
              editingExercise?.muscleGroup ??
              "Pectoraux"
            }
            onClose={() => {
              setShowModal(false);

              setEditingExercise(null);
            }}
            onSave={handleSave}
          />
        </PageCard>
      </Section>
    </AppContainer>
  );
}