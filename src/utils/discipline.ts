import type { Event } from "../types/Event";
import type { Run } from "../types/Run";
import type { GymSession } from "../types/GymSession";

import {
  getMonthlyDiscipline,
} from "./disciplineMonthly";

export interface DisciplineStats {
  planned: number;
  completed: number;
  pending: number;
  missed: number;
  percentage: number;
}

export interface DisciplineData {
  overall: DisciplineStats;

  training: DisciplineStats;

  gym: DisciplineStats;

  race: DisciplineStats;
}

function mergeMonthlyStats(
  months: ReturnType<
    typeof getMonthlyDiscipline
  >
): DisciplineStats {
  const planned =
    months.reduce(
      (sum, month) =>
        sum + month.stats.planned,
      0
    );

  const completed =
    months.reduce(
      (sum, month) =>
        sum +
        month.stats.completed,
      0
    );

  const pending =
    months.reduce(
      (sum, month) =>
        sum + month.stats.pending,
      0
    );

  const missed =
    months.reduce(
      (sum, month) =>
        sum + month.stats.missed,
      0
    );

  const played =
    completed + missed;

  return {
    planned,

    completed,

    pending,

    missed,

    percentage:
      played === 0
        ? 0
        : Math.round(
            (completed /
              played) *
              100
          ),
  };
}
export function getDisciplineData(
  events: Event[],
  runs: Run[],
  gymSessions: GymSession[]
): DisciplineData {
  const monthlyTraining =
    getMonthlyDiscipline(
      "training",
      events,
      runs,
      gymSessions
    );

  const monthlyGym =
    getMonthlyDiscipline(
      "gym",
      events,
      runs,
      gymSessions
    );

  const monthlyRace =
    getMonthlyDiscipline(
      "race",
      events,
      runs,
      gymSessions
    );

  const training =
    mergeMonthlyStats(
      monthlyTraining
    );

  const gym =
    mergeMonthlyStats(
      monthlyGym
    );

  const race =
    mergeMonthlyStats(
      monthlyRace
    );

  const overall =
    mergeMonthlyStats([
      ...monthlyTraining,
      ...monthlyGym,
      ...monthlyRace,
    ]);

  return {
    overall,
    training,
    gym,
    race,
  };
}