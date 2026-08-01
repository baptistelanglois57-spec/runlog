import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PageCard from "./Layout/PageCard";
import ExerciseCard from "./Muscu/ExerciseCard";

import { theme } from "../styles/theme";
import { saveGymSession } from "../services/gymService";

import type { GymSession } from "../types/GymSession";
import type { GymExercise } from "../types/Gym/GymExercise";
import SaveButton from "./RunForm/SaveButton";

export default function GymForm() {
  const navigate = useNavigate();

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [name, setName] = useState("");

  const [comment, setComment] = useState("");

  const [exercises, setExercises] = useState<GymExercise[]>([
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
    padding: "16px",
    borderRadius: "16px",
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
    color: theme.colors.text,
    fontSize: "17px",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontWeight: 700,
    marginBottom: "8px",
    color: theme.colors.text,
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
    if (exercises.length === 1) return;

    const copy = [...exercises];

    copy.splice(index, 1);

    setExercises(copy);
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
      id: crypto.randomUUID(),
      date,
      name,
      exercises,
      comment,
    };

    await saveGymSession(session);

    toast.success("Séance enregistrée !");

    navigate("/muscu");
  }
    return (
    <PageCard maxWidth="700px">
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 16,
    alignItems: "end",
    marginBottom: 22,
  }}
>
  <div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
        color: theme.colors.primary,
        fontSize: 17,
        fontWeight: 700,
      }}
    >
      💪 Nom de la séance
    </div>

    <input
      type="text"
      placeholder=""
      value={name}
      onChange={(e) => setName(e.target.value)}
      style={{
        width: "100%",
        height: 56,
        padding: "0 16px",
        borderRadius: 16,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.background,
        color: theme.colors.text,
        fontSize: 16,
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  </div>

  <SaveButton
  isEditing={false}
  onClick={() => {
    const form = document.getElementById("gym-form") as HTMLFormElement;

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
          gap: "22px",
          paddingBottom: "120px",
        }}
      >
        <div>
          <div style={labelStyle}>
            📅 Date
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={index}
            onExerciseNameChange={updateExerciseName}
            onSetChange={updateSet}
            onAddSet={addSet}
            onDeleteSet={deleteSet}
            onDeleteExercise={deleteExercise}
          />
        ))}

        <button
          type="button"
          onClick={addExercise}
          style={{
            width: "240px",
            padding: "14px",
            border: "none",
            borderRadius: "14px",
            background: "#ffffff",
            color: "#050404",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            alignSelf: "center",
          }}
        >
          ➕ Ajouter un exercice
        </button>

        <div>
               </div>

        <div>
          <div style={labelStyle}>
            📝 Commentaire
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder=""
            style={{
              ...inputStyle,
              minHeight: "140px",
              resize: "vertical",
              fontFamily: "inherit",
              lineHeight: 1.6,
            }}
          />
        </div>
      </form>
    </PageCard>
  );
}