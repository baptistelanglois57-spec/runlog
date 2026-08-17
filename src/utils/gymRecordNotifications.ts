import type { ExerciseLibrary } from "../types/Gym/ExerciseLibrary";
import type { GymSession } from "../types/GymSession";
import {
  createExerciseHistoryIndex,
  formatGymNumber,
  getBestExercisePerformance,
  getExerciseHistory,
  getExercisePerformanceScore,
  isExercisePerformanceImprovement,
  type BestExercisePerformance,
} from "./gymExerciseHistory.ts";

export type GymExerciseRecordCandidate = {
  exerciseId: string;
  exerciseName: string;
  current: BestExercisePerformance;
  previous: BestExercisePerformance;
  entityId: string;
};

type GymRecordDetectionOptions = {
  previousSessions: GymSession[];
  savedSession: GymSession;
  library: ExerciseLibrary[];
  isEditing: boolean;
};

function dateKey(value: string) {
  return value.slice(0, 10);
}

function formatPerformance(performance: BestExercisePerformance) {
  const reps = performance.set.reps;

  if (typeof reps !== "number" || !Number.isFinite(reps)) {
    return "Série enregistrée";
  }

  if (performance.mode === "weighted") {
    const weight = performance.set.weight;
    return typeof weight === "number" && Number.isFinite(weight)
      ? `${formatGymNumber(reps)} reps × ${formatGymNumber(weight)} kg`
      : `${formatGymNumber(reps)} répétitions`;
  }

  return `${formatGymNumber(reps)} répétitions`;
}

function getStablePerformancePart(performance: BestExercisePerformance) {
  const score = getExercisePerformanceScore(performance);
  return score === null ? "unknown" : score.toFixed(6);
}

function createEntityId(
  sessionId: string,
  exerciseId: string,
  performance: BestExercisePerformance
) {
  return `gym-record:${sessionId}:${exerciseId}:${performance.mode}:${getStablePerformancePart(performance)}`;
}

/**
 * Détecte les records apportés par une sauvegarde Gym, sans scanner ni
 * notifier l'historique au chargement. Toutes les comparaisons partent de
 * la même indexation canonique et du même calcul de meilleure série que la
 * fiche Exercice.
 */
export function getGymExerciseRecordCandidates({
  previousSessions,
  savedSession,
  library,
  isEditing,
}: GymRecordDetectionOptions): GymExerciseRecordCandidate[] {
  const sessionsWithoutSaved = previousSessions.filter(
    (session) => session.id !== savedSession.id
  );
  const savedDate = dateKey(savedSession.date);

  // Une séance insérée ou retouchée avant une séance déjà plus récente ne
  // génère pas de record rétroactif. Le record reste visible dans la fiche.
  if (sessionsWithoutSaved.some((session) => dateKey(session.date) > savedDate)) {
    return [];
  }

  const allSessions = [...sessionsWithoutSaved, savedSession];
  const currentIndex = createExerciseHistoryIndex(allSessions, library);
  const previousIndex = createExerciseHistoryIndex(sessionsWithoutSaved, library);
  const existingSession = previousSessions.find(
    (session) => session.id === savedSession.id);
  const existingIndex = existingSession
    ? createExerciseHistoryIndex(previousSessions, library)
    : null;
  const candidates: GymExerciseRecordCandidate[] = [];

  for (const [exerciseId, entries] of currentIndex.byExerciseId) {
    const currentEntries = entries.filter(
      (entry) => entry.sessionId === savedSession.id
    );
    if (currentEntries.length === 0) continue;

    const historicalEntries = getExerciseHistory(exerciseId, previousIndex).filter(
      (entry) => dateKey(entry.sessionDate) < savedDate
    );
    const current = getBestExercisePerformance(currentEntries);
    const previous = getBestExercisePerformance(historicalEntries);

    // Première occurrence ou séries inexploitables : elles deviennent la
    // référence de la fiche mais ne déclenchent pas de notification.
    if (!current || !previous || !isExercisePerformanceImprovement(current, previous)) {
      continue;
    }

    if (isEditing && existingSession && existingIndex) {
      const persistedEntries = getExerciseHistory(exerciseId, existingIndex).filter(
        (entry) => entry.sessionId === savedSession.id
      );
      const persisted = getBestExercisePerformance(persistedEntries);

      // Un clic Enregistrer répété ne peut jamais recréer une notification.
      if (persisted && !isExercisePerformanceImprovement(current, persisted)) {
        continue;
      }
    }

    const exerciseName = library.find((exercise) => exercise.id === exerciseId)?.name
      ?? current.entry.exercise.name;

    candidates.push({
      exerciseId,
      exerciseName,
      current,
      previous,
      entityId: createEntityId(savedSession.id, exerciseId, current),
    });
  }

  return candidates;
}

export function formatGymRecordPerformance(performance: BestExercisePerformance) {
  return formatPerformance(performance);
}
