import type { ExerciseLibrary } from "../types/Gym/ExerciseLibrary";
import type { GymExercise } from "../types/Gym/GymExercise";
import type { GymSet } from "../types/Gym/GymSet";
import type { GymSession } from "../types/GymSession";

export type ExerciseResolutionSource =
  | "canonical"
  | "legacy-exact"
  | "unresolved";

export type ExerciseResolution = {
  exerciseId: string | null;
  source: ExerciseResolutionSource;
  reason?: "missing" | "ambiguous" | "unknown-id";
};

export type ExerciseHistoryEntry = {
  exerciseId: string;
  resolutionSource: Exclude<ExerciseResolutionSource, "unresolved">;
  sessionId: string;
  sessionDate: string;
  sessionName: string;
  exerciseIndex: number;
  exercise: GymExercise;
  sets: GymSet[];
};

export type ExerciseHistoryIndex = {
  byExerciseId: ReadonlyMap<string, ExerciseHistoryEntry[]>;
  unresolved: ReadonlyArray<{
    sessionId: string;
    exerciseIndex: number;
    exercise: GymExercise;
    reason: ExerciseResolution["reason"];
  }>;
};

export type BestExercisePerformance = {
  mode: "weighted" | "repetitions";
  entry: ExerciseHistoryEntry;
  set: GymSet;
  setIndex: number;
  estimatedOneRepMax: number | null;
  setVolume: number | null;
};

/**
 * Tolérance utilisée pour les comparaisons d'1RM estimé : elle évite qu'un
 * écart de flottant imperceptible soit interprété comme un nouveau record.
 */
export const EXERCISE_PERFORMANCE_EPSILON = 0.01;

type LegacyGymExercise = GymExercise & {
  exerciseId?: string;
  exercise_id?: string;
  library_exercise_id?: string;
};

function finitePositive(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : null;
}

/**
 * Normalisation volontairement stricte pour les anciennes données : casse,
 * forme Unicode et espaces seulement. Aucun mot n'est retiré et aucun fuzzy
 * matching n'est effectué.
 */
export function normalizeExactExerciseName(name: string) {
  return name.normalize("NFC").trim().replace(/\s+/g, " ").toLocaleLowerCase("fr-FR");
}

function getEmbeddedLibraryId(exercise: GymExercise) {
  const legacy = exercise as LegacyGymExercise;
  return (
    exercise.libraryExerciseId ??
    legacy.exerciseId ??
    legacy.exercise_id ??
    legacy.library_exercise_id ??
    null
  );
}

function createLibraryLookup(library: ExerciseLibrary[]) {
  const byId = new Map(library.map((exercise) => [exercise.id, exercise]));
  const idsByExactName = new Map<string, string[]>();

  library.forEach((exercise) => {
    const key = normalizeExactExerciseName(exercise.name);
    idsByExactName.set(key, [...(idsByExactName.get(key) ?? []), exercise.id]);
  });

  return { byId, idsByExactName };
}

export function resolveExerciseIdentity(
  exercise: GymExercise,
  library: ExerciseLibrary[]
): ExerciseResolution {
  const lookup = createLibraryLookup(library);
  return resolveExerciseIdentityWithLookup(exercise, lookup);
}

function resolveExerciseIdentityWithLookup(
  exercise: GymExercise,
  lookup: ReturnType<typeof createLibraryLookup>
): ExerciseResolution {
  const embeddedId = getEmbeddedLibraryId(exercise);

  if (embeddedId) {
    return lookup.byId.has(embeddedId)
      ? { exerciseId: embeddedId, source: "canonical" }
      : { exerciseId: null, source: "unresolved", reason: "unknown-id" };
  }

  // Certaines versions peuvent avoir enregistré directement l'ID canonique
  // dans `id`. Il n'est fiable que s'il existe réellement dans la bibliothèque.
  if (lookup.byId.has(exercise.id)) {
    return { exerciseId: exercise.id, source: "canonical" };
  }

  const matches = lookup.idsByExactName.get(normalizeExactExerciseName(exercise.name)) ?? [];

  if (matches.length === 1) {
    return { exerciseId: matches[0], source: "legacy-exact" };
  }

  return {
    exerciseId: null,
    source: "unresolved",
    reason: matches.length > 1 ? "ambiguous" : "missing",
  };
}

export function createExerciseHistoryIndex(
  sessions: GymSession[],
  library: ExerciseLibrary[]
): ExerciseHistoryIndex {
  const lookup = createLibraryLookup(library);
  const byExerciseId = new Map<string, ExerciseHistoryEntry[]>();
  const unresolved: Array<{
    sessionId: string;
    exerciseIndex: number;
    exercise: GymExercise;
    reason: ExerciseResolution["reason"];
  }> = [];

  sessions.forEach((session) => {
    session.exercises.forEach((exercise, exerciseIndex) => {
      const resolution = resolveExerciseIdentityWithLookup(exercise, lookup);

      if (!resolution.exerciseId || resolution.source === "unresolved") {
        unresolved.push({
          sessionId: session.id,
          exerciseIndex,
          exercise,
          reason: resolution.reason,
        });
        return;
      }

      const entry: ExerciseHistoryEntry = {
        exerciseId: resolution.exerciseId,
        resolutionSource: resolution.source,
        sessionId: session.id,
        sessionDate: session.date,
        sessionName: session.name,
        exerciseIndex,
        exercise,
        sets: exercise.sets,
      };

      byExerciseId.set(resolution.exerciseId, [
        ...(byExerciseId.get(resolution.exerciseId) ?? []),
        entry,
      ]);
    });
  });

  byExerciseId.forEach((entries) => {
    entries.sort((a, b) => {
      const dateDifference = new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime();
      if (dateDifference !== 0) return dateDifference;
      const sessionDifference = b.sessionId.localeCompare(a.sessionId);
      return sessionDifference !== 0 ? sessionDifference : a.exerciseIndex - b.exerciseIndex;
    });
  });

  return { byExerciseId, unresolved };
}

export function getExerciseHistory(
  exerciseId: string,
  index: ExerciseHistoryIndex
) {
  return index.byExerciseId.get(exerciseId) ?? [];
}

export function getPreviousExerciseOccurrence(
  current: ExerciseHistoryEntry,
  history: ExerciseHistoryEntry[]
) {
  const currentDate = new Date(current.sessionDate).getTime();
  return history.find(
    (entry) =>
      entry.sessionId !== current.sessionId &&
      new Date(entry.sessionDate).getTime() < currentDate
  ) ?? null;
}

export function getSetVolume(set: GymSet) {
  const reps = finitePositive(set.reps);
  const weight = finitePositive(set.weight);
  return reps !== null && weight !== null ? reps * weight : null;
}

export function getExerciseSessionVolume(sets: GymSet[]) {
  const volumes = sets.map(getSetVolume).filter((value): value is number => value !== null);
  return volumes.length > 0 ? volumes.reduce((total, value) => total + value, 0) : null;
}

/** Formule d'Epley, utilisée uniquement pour classer les séries chargées. */
export function estimateOneRepMax(set: GymSet) {
  const reps = finitePositive(set.reps);
  const weight = finitePositive(set.weight);
  return reps !== null && weight !== null ? weight * (1 + reps / 30) : null;
}

export function getBestExercisePerformance(
  history: ExerciseHistoryEntry[]
): BestExercisePerformance | null {
  const candidates = history.flatMap((entry) =>
    entry.sets.map((set, setIndex) => ({
      entry,
      set,
      setIndex,
      reps: finitePositive(set.reps),
      estimatedOneRepMax: estimateOneRepMax(set),
      setVolume: getSetVolume(set),
    }))
  );

  const weighted = candidates
    .filter((candidate) => candidate.estimatedOneRepMax !== null)
    .sort((a, b) =>
      (b.estimatedOneRepMax ?? 0) - (a.estimatedOneRepMax ?? 0) ||
      (b.setVolume ?? 0) - (a.setVolume ?? 0) ||
      new Date(b.entry.sessionDate).getTime() - new Date(a.entry.sessionDate).getTime()
    )[0];

  if (weighted) {
    return {
      mode: "weighted",
      entry: weighted.entry,
      set: weighted.set,
      setIndex: weighted.setIndex,
      estimatedOneRepMax: weighted.estimatedOneRepMax,
      setVolume: weighted.setVolume,
    };
  }

  const repetitionBased = candidates
    .filter((candidate) => candidate.reps !== null)
    .sort((a, b) =>
      (b.reps ?? 0) - (a.reps ?? 0) ||
      new Date(b.entry.sessionDate).getTime() - new Date(a.entry.sessionDate).getTime()
    )[0];

  return repetitionBased
    ? {
        mode: "repetitions",
        entry: repetitionBased.entry,
        set: repetitionBased.set,
        setIndex: repetitionBased.setIndex,
        estimatedOneRepMax: null,
        setVolume: repetitionBased.setVolume,
      }
    : null;
}

/**
 * Retourne le score déjà utilisé par getBestExercisePerformance. Les séries
 * chargées sont comparées par 1RM Epley estimé, les séries sans charge par
 * répétitions. Les deux modes ne sont volontairement pas mélangés.
 */
export function getExercisePerformanceScore(
  performance: BestExercisePerformance
) {
  if (performance.mode === "weighted") {
    return performance.estimatedOneRepMax;
  }

  return finitePositive(performance.set.reps);
}

/**
 * Une égalité, y compris due à l'arrondi flottant de la formule d'Epley,
 * n'est pas une amélioration. Un exercice qui change de mode reste
 * volontairement non comparable afin de ne jamais fabriquer un record.
 */
export function isExercisePerformanceImprovement(
  current: BestExercisePerformance,
  previous: BestExercisePerformance
) {
  if (current.mode !== previous.mode) {
    return false;
  }

  const currentScore = getExercisePerformanceScore(current);
  const previousScore = getExercisePerformanceScore(previous);

  if (currentScore === null || previousScore === null) {
    return false;
  }

  const tolerance = current.mode === "weighted"
    ? EXERCISE_PERFORMANCE_EPSILON
    : 0;

  return currentScore > previousScore + tolerance;
}

export function formatGymNumber(value: number) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 1,
  }).format(value);
}

export function formatGymDate(value: string) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
