import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ExerciseCard from "./Muscu/ExerciseCard";

import { theme } from "../styles/theme";
import { UI } from "../styles/ui";
import { getGymSessions } from "../services/gymService";
import type { GymSession } from "../types/GymSession";
import { saveGymSession } from "../services/gymService";
import type { GymExercise } from "../types/Gym/GymExercise";

import SaveButton from "./RunForm/SaveButton";

export default function GymForm() {
  const navigate = useNavigate();

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [name, setName] = useState("");

  const [comment, setComment] = useState("");
  const [historySessions, setHistorySessions] =
  useState<GymSession[]>([]);

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

  function updateExerciseName(
    exerciseIndex: number,
    value: string
  ) {
    const copy = [...exercises];

    copy[exerciseIndex].name = value;

    setExercises(copy);
  }

  function updateSet(
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: number
  ) {
    const copy = [...exercises];

    copy[exerciseIndex].sets[setIndex][field] =
      value;

    setExercises(copy);
  }

  function addSet(exerciseIndex: number) {
    const copy = [...exercises];

    copy[exerciseIndex].sets.push({
      reps: undefined,
      weight: undefined,
    });

    setExercises(copy);
  }

  function deleteSet(
    exerciseIndex: number,
    setIndex: number
  ) {
    const copy = [...exercises];

    if (
      copy[exerciseIndex].sets.length === 1
    )
      return;

    copy[exerciseIndex].sets.splice(
      setIndex,
      1
    );

    setExercises(copy);
  }

  function addExercise() {
    setExercises([
      ...exercises,
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

  function deleteExercise(index: number) {
    if (exercises.length === 1)
      return;

    const copy = [...exercises];

    copy.splice(index, 1);

    setExercises(copy);
  }
useEffect(() => {
  async function loadHistory() {
    const sessions =
      await getGymSessions();

    setHistorySessions(sessions);
  }

  loadHistory();
}, []);
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
      id: crypto.randomUUID(),

      date,

      name,

      exercises,

      comment,
    };

    await saveGymSession(session);

    toast.success(
      "Séance enregistrée !"
    );

    navigate("/muscu");
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
              setName(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <SaveButton
          isEditing={false}
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
  index={index}
  historySessions={historySessions}
  onExerciseNameChange={updateExerciseName}
  onSetChange={updateSet}
  onAddSet={addSet}
  onDeleteSet={deleteSet}
  onDeleteExercise={deleteExercise}
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