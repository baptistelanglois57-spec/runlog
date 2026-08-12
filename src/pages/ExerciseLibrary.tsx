import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import PageCard from "../components/Layout/PageCard";

import ExerciseLibraryModal from "../components/Muscu/ExerciseLibraryModal";

import { theme } from "../styles/theme";
import { Typography } from "../styles/ui";

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
import "./Tools/ToolSubpages.css";

const muscleGroups: (
  | "Tous"
  | MuscleGroup
)[] = [
  "Tous",
  "Course à pied",
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
  "Course à pied": "#06B6D4",

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

  const [groupMenuOpen, setGroupMenuOpen] =
    useState(false);

  const groupFilterRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] =
    useState(false);

  const [editingExercise, setEditingExercise] =
    useState<ExerciseLibrary | null>(
      null
    );

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    function closeGroupMenu(event: MouseEvent) {
      if (
        groupFilterRef.current &&
        !groupFilterRef.current.contains(event.target as Node)
      ) {
        setGroupMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeGroupMenu);

    return () =>
      document.removeEventListener("mousedown", closeGroupMenu);
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
      <div className="tools-subpage"><Section>
        <div className="tools-subpage__panel"><PageCard>
          <div className="tools-subpage__header"
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
                  theme.colors.text,
                fontSize: Typography.pageTitle,
              }}
            >
          

              Exercices
            </h1>

            <div
              style={{
                width: 46,
              }}
            />
          </div>

          <button
            className="tools-subpage__primary"
            onClick={() => {
              setEditingExercise(null);

              setShowModal(true);
            }}
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: 16,
              background: theme.colors.primary,
              color: theme.colors.text,
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
            ref={groupFilterRef}
            className={`exercise-library__filter${
              groupMenuOpen
                ? " exercise-library__filter--open"
                : ""
            }`}
          >
            <button
              type="button"
              className="exercise-library__filter-trigger"
              onClick={() =>
                setGroupMenuOpen((open) => !open)
              }
              aria-haspopup="listbox"
              aria-expanded={groupMenuOpen}
            >
              <span>{selectedGroup}</span>

              <ChevronDown
                className="exercise-library__filter-chevron"
                size={19}
                aria-hidden="true"
              />
            </button>

            {groupMenuOpen && (
              <div
                className="exercise-library__filter-menu"
                role="listbox"
                aria-label="Groupes musculaires"
              >
                {muscleGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    role="option"
                    aria-selected={selectedGroup === group}
                    className={
                      selectedGroup === group
                        ? "exercise-library__filter-option exercise-library__filter-option--active"
                        : "exercise-library__filter-option"
                    }
                    onClick={() => {
                      setSelectedGroup(group);
                      setGroupMenuOpen(false);
                    }}
                  >
                    {group}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredExercises.length === 0 ? (
            <div className="tools-subpage__empty exercise-library__empty">
              Aucun exercice trouvé.
            </div>
          ) : (
            <div className="tools-subpage__list exercise-library__list">
              {filteredExercises.map((exercise) => (
                <article key={exercise.id} className="exercise-library__item">
                  <button
                    type="button"
                    className="exercise-library__open"
                    onClick={() => navigate(`/exercise-library/${exercise.id}`)}
                    aria-label={`Ouvrir l'historique de ${exercise.name}`}
                  >
                    <span className="exercise-library__identity">
                      <strong>{exercise.name}</strong>
                      <span
                        className="exercise-library__badge"
                        style={{ "--exercise-badge-color": getBadgeColor(exercise.muscleGroup) } as CSSProperties}
                      >
                        {exercise.muscleGroup}
                      </span>
                    </span>
                    <ChevronRight size={19} aria-hidden="true" />
                  </button>

                  <div className="exercise-library__actions">
                    <button
                      type="button"
                      className="exercise-library__action exercise-library__action--edit"
                      onClick={() => {
                        setEditingExercise(exercise);
                        setShowModal(true);
                      }}
                      aria-label={`Modifier ${exercise.name}`}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      type="button"
                      className="exercise-library__action exercise-library__action--delete"
                      onClick={() => handleDelete(exercise.id)}
                      aria-label={`Supprimer ${exercise.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
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
  "Course à pied"
}
            onClose={() => {
              setShowModal(false);

              setEditingExercise(null);
            }}
            onSave={handleSave}
          />
        </PageCard></div>
      </Section></div>
    </AppContainer>
  );
}
