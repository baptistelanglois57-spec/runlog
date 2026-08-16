import type { ExerciseLibrary } from "../types/Gym/ExerciseLibrary";
import type { GymSet } from "../types/Gym/GymSet";
import type { GymSession } from "../types/GymSession";
import { getGymExerciseComparisonContext } from "./gymComparison.ts";
import {
  formatGymDate,
  formatGymNumber,
  type ExerciseHistoryIndex,
} from "./gymExerciseHistory.ts";

type ShareTarget = {
  share?: (data: ShareData) => Promise<void>;
  clipboard?: {
    writeText: (text: string) => Promise<void>;
  };
};

export type GymComparisonShareResult = "shared" | "copied" | "cancelled";

function finitePositive(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : null;
}

export function formatGymComparisonShareSet(set: GymSet, index: number) {
  const reps = finitePositive(set.reps);
  const weight = finitePositive(set.weight);
  const prefix = `S${index + 1} :`;

  if (reps !== null && weight !== null) {
    return `${prefix} ${formatGymNumber(reps)} reps × ${formatGymNumber(weight)} kg`;
  }
  if (reps !== null) return `${prefix} ${formatGymNumber(reps)} reps`;
  if (weight !== null) return `${prefix} ${formatGymNumber(weight)} kg`;
  return `${prefix} Données non renseignées`;
}

function formatSets(sets: GymSet[]) {
  return sets.length > 0
    ? sets.map(formatGymComparisonShareSet).join("\n")
    : "Aucune série enregistrée.";
}

export function buildGymComparisonShareText({
  session,
  library,
  historyIndex,
}: {
  session: GymSession;
  library: ExerciseLibrary[];
  historyIndex: ExerciseHistoryIndex;
}) {
  const exerciseBlocks = session.exercises.map((exercise, exerciseIndex) => {
    const context = getGymExerciseComparisonContext(
      session,
      exerciseIndex,
      library,
      historyIndex
    );
    const exerciseName = exercise.name.trim() || "Exercice sans nom";
    const muscleGroup = context?.libraryExercise?.muscleGroup ?? "Non disponible";
    const current = [
      `Séance actuelle — ${formatGymDate(session.date)}`,
      formatSets(exercise.sets),
    ].join("\n");

    let previous: string;
    let verdict: string;

    if (!context?.resolution.exerciseId || !context.currentEntry) {
      previous = [
        "Séance précédente :",
        "Historique fiable indisponible pour cette ancienne entrée.",
      ].join("\n");
      verdict = "Historique fiable indisponible";
    } else if (!context.previousEntry) {
      previous = [
        "Séance précédente :",
        "Aucune performance précédente enregistrée.",
      ].join("\n");
      verdict = "Première occurrence";
    } else {
      previous = [
        `Séance précédente — ${formatGymDate(context.previousEntry.sessionDate)}`,
        formatSets(context.previousEntry.sets),
      ].join("\n");
      verdict = context.comparison?.verdict ?? "Première occurrence";
    }

    return [
      `EXERCICE ${exerciseIndex + 1} — ${exerciseName}`,
      `Groupe musculaire : ${muscleGroup}`,
      "",
      current,
      "",
      previous,
      "",
      "Verdict RunLog :",
      verdict,
    ].join("\n");
  });

  return [
    "RUNLOG — COMPARAISON MUSCULATION",
    "",
    `Séance : ${session.name.trim() || "Séance sans nom"}`,
    `Date : ${formatGymDate(session.date)}`,
    ...exerciseBlocks.flatMap((block) => ["", "", block]),
  ].join("\n");
}

export async function shareGymComparisonText(
  text: string,
  title: string,
  target: ShareTarget = navigator
): Promise<GymComparisonShareResult> {
  if (typeof target.share === "function") {
    try {
      await target.share({ title, text });
      return "shared";
    } catch (error: unknown) {
      if ((error as { name?: string })?.name === "AbortError") return "cancelled";
    }
  }

  if (typeof target.clipboard?.writeText !== "function") {
    throw new Error("Le partage et le presse-papiers ne sont pas disponibles.");
  }

  await target.clipboard.writeText(text);
  return "copied";
}
