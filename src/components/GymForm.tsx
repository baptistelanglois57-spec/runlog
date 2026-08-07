import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CalendarDays, ChevronLeft, NotebookPen, Plus, Save } from "lucide-react";

import ExerciseCard from "./Muscu/ExerciseCard";

import {
  getGymSessions,
  saveGymSession,
  updateGymSession,
  getGymSessionById,
} from "../services/gymService";

import {
  getExercises,
} from "../services/exerciseLibraryService";

import type { GymSession } from "../types/GymSession";
import type { GymExercise } from "../types/Gym/GymExercise";
import type {
  ExerciseLibrary,
} from "../types/Gym/ExerciseLibrary";
import "./GymForm.css";

export default function GymForm() {
  const navigate = useNavigate();
const { id } = useParams();

const editingId = id;

const isEditing = !!editingId;

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [name, setName] = useState("");

  const [comment, setComment] = useState("");

  const [historySessions, setHistorySessions] =
    useState<GymSession[]>([]);
const [
  exerciseLibrary,
  setExerciseLibrary,
] = useState<
  ExerciseLibrary[]
>([]);

  const [loading, setLoading] =
    useState(true);

  const [exercises, setExercises] =
    useState<GymExercise[]>([
      {
        id: crypto.randomUUID(),

        name: "",

        sets: [
          {
            reps: undefined,
            weight: undefined,
          },
          {
            reps: undefined,
            weight: undefined,
          },
          {
            reps: undefined,
            weight: undefined,
          },
        ],
      },
    ]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
 const [sessions, exercises] =
  await Promise.all([
    getGymSessions(),
    getExercises(),
  ]);

setHistorySessions(sessions);

setExerciseLibrary(
  exercises.filter(
    (exercise) =>
      exercise.muscleGroup !==
      "Course à pied"
  )
);
    if (editingId) {
      const session =
        await getGymSessionById(
          editingId
        );

      if (session) {
        setDate(session.date);
        setName(session.name);
        setComment(
          session.comment ?? ""
        );
        setExercises(
          session.exercises
        );
      }
    }

    setLoading(false);
  }
    if (loading) {
    return null;
  }

  function updateExerciseName(
    exerciseIndex: number,
    value: string
  ) {
    setExercises((prev) =>
      prev.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              name: value,
            }
          : exercise
      )
    );
  }

  function updateSet(
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: number
  ) {
    setExercises((prev) =>
      prev.map((exercise, index) => {
        if (index !== exerciseIndex)
          return exercise;

        return {
          ...exercise,
          sets: exercise.sets.map(
            (set, row) =>
              row === setIndex
                ? {
                    ...set,
                    [field]: value,
                  }
                : set
          ),
        };
      })
    );
  }

  function addSet(
    exerciseIndex: number
  ) {
    setExercises((prev) =>
      prev.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  reps: undefined,
                  weight: undefined,
                },
              ],
            }
          : exercise
      )
    );
  }

  function deleteSet(
    exerciseIndex: number,
    setIndex: number
  ) {
    setExercises((prev) =>
      prev.map((exercise, index) => {
        if (index !== exerciseIndex)
          return exercise;

        if (
          exercise.sets.length === 1
        )
          return exercise;

        return {
          ...exercise,
          sets: exercise.sets.filter(
            (_, row) =>
              row !== setIndex
          ),
        };
      })
    );
  }

  function addExercise() {
    setExercises((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        sets: [
          {
            reps: undefined,
            weight: undefined,
          },
          {
            reps: undefined,
            weight: undefined,
          },
          {
            reps: undefined,
            weight: undefined,
          },
        ],
      },
    ]);
  }

  function deleteExercise(
    exerciseIndex: number
  ) {
    if (exercises.length === 1)
      return;

    setExercises((prev) =>
      prev.filter(
        (_, index) =>
          index !== exerciseIndex
      )
    );
  }
    async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(
        "Merci de renseigner le nom de la séance."
      );
      return;
    }

    const session: GymSession = {
      id:
        editingId ??
        crypto.randomUUID(),

      date,

      name,

      exercises,

      comment,
    };

    try {
      if (isEditing) {
        await updateGymSession(
          session
        );

        toast.success(
          "Séance modifiée !"
        );
      } else {
        await saveGymSession(
          session
        );

        toast.success(
          "Séance enregistrée !"
        );
      }

      navigate("/muscu");
    } catch (error) {
      console.error(error);

      toast.error(
        "Impossible d'enregistrer la séance."
      );
    }
  }

  return (
    <div className="gym-form-page">
      <header className="gym-form-page__header">
        <button type="button" onClick={() => navigate("/muscu")} aria-label="Retour aux séances">
          <ChevronLeft size={22} />
        </button>
        <h1>{isEditing ? "Modifier la séance" : "Nouvelle séance"}</h1>
        <button
          type="button"
          className="gym-form-page__save"
          onClick={() => {
            const form = document.getElementById("gym-form") as HTMLFormElement;
            form?.requestSubmit();
          }}
        >
          <Save size={17} />
          {isEditing ? "Modifier" : "Enregistrer"}
        </button>
      </header>

      <form id="gym-form" onSubmit={handleSubmit} className="gym-form-page__form">
        <section className="gym-form-page__details">
          <label>
            <span>Nom de la séance</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label>
            <span><CalendarDays size={15} /> Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        </section>

        {exercises.map(
          (exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              historySessions={
                historySessions
              }
             exerciseLibrary={
  exerciseLibrary
}
              refreshExercises={
                loadData
              }
              index={index}
              onExerciseNameChange={
                updateExerciseName
              }
              onSetChange={updateSet}
              onAddSet={addSet}
              onDeleteSet={
                deleteSet
              }
              onDeleteExercise={
                deleteExercise
              }
            />
          )
        )}

        <button type="button" onClick={addExercise} className="gym-form-page__add-exercise">
          <Plus size={18} /> Ajouter un exercice
        </button>
        <label className="gym-form-page__comment">
          <span><NotebookPen size={15} /> Commentaire</span>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Notes sur la séance, ressenti, progression..."
          />
        </label>
      </form>
    </div>
  );
}
