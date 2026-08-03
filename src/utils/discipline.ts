import type { Event } from "../types/Event";
import type { Run } from "../types/Run";
import type { GymSession } from "../types/GymSession";

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

function calculateStats(
  planned: number,
  completed: number,
  pending: number
): DisciplineStats {
  const missed = Math.max(
    planned - completed - pending,
    0
  );

  const played =
    completed + missed;

  const percentage =
    played === 0
      ? 0
      : Math.round(
          (completed / played) * 100
        );

  return {
    planned,
    completed,
    pending,
    missed,
    percentage,
  };
}

export function getDisciplineData(
  events: Event[],
  runs: Run[],
  gymSessions: GymSession[]
): DisciplineData {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  function isFuture(date: string) {
    return new Date(date) > today;
  }

  const trainingEvents =
    events.filter(
      (event) =>
        event.type === "training"
    );

  const gymEvents =
    events.filter(
      (event) =>
        event.type === "gym"
    );

  const raceEvents =
    events.filter(
      (event) =>
        event.type === "race"
    );

  const completedTraining =
    trainingEvents.filter(
      (event) =>
        runs.some(
          (run) =>
            run.date === event.date
        )
    ).length;

  const completedGym =
    gymEvents.filter(
      (event) =>
        gymSessions.some(
          (session) =>
            session.date === event.date
        )
    ).length;

  const completedRace =
    raceEvents.filter(
      (event) =>
        runs.some(
          (run) =>
            run.date === event.date &&
            run.type === "race"
        )
    ).length;

  const pendingTraining =
    trainingEvents.filter(
      (event) =>
        isFuture(event.date)
    ).length;

  const pendingGym =
    gymEvents.filter(
      (event) =>
        isFuture(event.date)
    ).length;

  const pendingRace =
    raceEvents.filter(
      (event) =>
        isFuture(event.date)
    ).length;

  const training =
    calculateStats(
      trainingEvents.length,
      completedTraining,
      pendingTraining
    );

  const gym =
    calculateStats(
      gymEvents.length,
      completedGym,
      pendingGym
    );

  const race =
    calculateStats(
      raceEvents.length,
      completedRace,
      pendingRace
    );

  const overall =
    calculateStats(
      training.planned +
        gym.planned +
        race.planned,

      training.completed +
        gym.completed +
        race.completed,

      training.pending +
        gym.pending +
        race.pending
    );

  return {
    overall,
    training,
    gym,
    race,
  };
}