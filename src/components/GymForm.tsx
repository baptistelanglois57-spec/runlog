import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ExerciseCard from "./Muscu/ExerciseCard";
import SaveButton from "./RunForm/SaveButton";

import { theme } from "../styles/theme";
import { UI } from "../styles/ui";

import {
  getGymSessions,
  saveGymSession,
  updateGymSession,
  getGymSessionById,
} from "../services/gymService";

import { getExerciseNames } from "../services/exerciseLibraryService";

import type { GymSession } from "../types/GymSession";
import type { GymExercise } from "../types/Gym/GymExercise";

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

  const [exerciseNames, setExerciseNames] =
    useState<string[]>([]);

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

  const inputStyle = {
    width: "100%",
    height: 56,
    padding: "0 16px",
    borderRadius: UI.INPUT_RADIUS,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
    color: theme.colors.text,
    fontSize: UI.FONT_BODY,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: UI.FONT_SMALL,
    color: theme.colors.text,
    marginBottom: 8,
  };

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [sessions, names] =
      await Promise.all([
        getGymSessions(),
        getExerciseNames(),
      ]);

    setHistorySessions(sessions);

    setExerciseNames(names);

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
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr auto",
          gap: 16,
          alignItems: "end",
          marginBottom: 22,
        }}
      >
        <div>
          <div style={labelStyle}>
            💪 Nom de la séance
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            style={inputStyle}
          />
        </div>

        <SaveButton
          isEditing={isEditing}
          onClick={() => {
            const form =
              document.getElementById(
                "gym-form"
              ) as HTMLFormElement;

            form?.requestSubmit();
          }}
        />
      </div>
            <form
        id="gym-form"
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
          paddingBottom: 120,
        }}
      >
        <div>
          <div style={labelStyle}>
            📅 Date
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            style={{
              ...inputStyle,
              textAlign: "center",
              fontWeight: 700,
            }}
          />
        </div>

        {exercises.map(
          (exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              historySessions={
                historySessions
              }
              exerciseNames={
                exerciseNames
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

        <button
          type="button"
          onClick={addExercise}
          style={{
            alignSelf: "center",
            width: "100%",
            maxWidth: 260,
            height: 52,
            border: "none",
            borderRadius: 16,
            background:
              theme.colors.primary,
            color: "#000",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            transition:
              "transform .15s ease",
          }}
        >
          ➕ Ajouter un exercice
        </button>
                <div>
          <div style={labelStyle}>
            📝 Commentaire
          </div>

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(
                e.target.value
              )
            }
            placeholder="Notes sur la séance, ressenti, progression..."
            style={{
              width: "100%",
              minHeight: 150,
              padding: 16,
              borderRadius:
                UI.INPUT_RADIUS,
              border: `1px solid ${theme.colors.border}`,
              background:
                theme.colors.background,
              color:
                theme.colors.text,
              fontSize:
                UI.FONT_BODY,
              fontFamily:
                "inherit",
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
              boxSizing:
                "border-box",
            }}
          />
        </div>
      </form>
    </>
  );
}