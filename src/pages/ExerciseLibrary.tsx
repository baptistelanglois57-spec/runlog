import { useEffect, useState } from "react";
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

import type { ExerciseLibrary } from "../types/Gym/ExerciseLibrary";

import {
  getExercises,
  addExercise,
  updateExercise,
  deleteExercise,
} from "../services/exerciseLibraryService";

export default function ExerciseLibrary() {
  const navigate = useNavigate();

  const [exercises, setExercises] =
    useState<ExerciseLibrary[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [editingExercise, setEditingExercise] =
    useState<ExerciseLibrary | null>(null);

  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    const data =
      await getExercises();

    setExercises(data);
  }

  async function handleSave(
    value: string
  ) {
    if (editingExercise) {
      await updateExercise(
        editingExercise.id,
        value
      );
    } else {
      await addExercise(value);
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
              marginBottom: 28,
            }}
          >
            <button
              onClick={() =>
                navigate("/tools")
              }
              style={{
                width: 44,
                height: 44,
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
                width: 44,
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
              borderRadius: 14,
              background: theme.colors.primary,
              color: "#000",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              marginBottom: 24,
            }}
          >
            <Plus size={18} />
            Ajouter un exercice
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {exercises.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color:
                    theme.colors.textSecondary,
                  padding: "30px 0",
                }}
              >
                Aucun exercice enregistré.
              </div>
            ) : (
              exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    padding: 18,
                    borderRadius: 16,
                    background:
                      theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <div
                    style={{
                      color:
                        theme.colors.text,
                      fontWeight: 700,
                      fontSize: 17,
                    }}
                  >
                    {exercise.name}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
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
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        border: `1px solid ${theme.colors.border}`,
                        background:
                          theme.colors.card,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent:
                          "center",
                        alignItems: "center",
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
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        border: "none",
                        background:
                          "#C0392B",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent:
                          "center",
                        alignItems: "center",
                      }}
                    >
                      <Trash2
                        size={18}
                        color="#fff"
                      />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

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