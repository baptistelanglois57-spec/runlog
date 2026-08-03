import type { Event } from "../types/Event";
import type { Run } from "../types/Run";
import type { GymSession } from "../types/GymSession";

export type AgendaDayType =
  | "none"
  | "training"
  | "gym"
  | "race"
  | "missed";

export interface AgendaDayStatus {
  type: AgendaDayType;
  completed: boolean;
}

export function getAgendaDayStatus(
  date: string,
  events: Event[],
  runs: Run[],
  gymSessions: GymSession[]
): AgendaDayStatus {
  const event = events.find(
    (event) => event.date === date
  );

  if (!event) {
    return {
      type: "none",
      completed: false,
    };
  }

  let completed = false;

  switch (event.type) {
    case "training":
      completed = runs.some(
        (run) => run.date === date
      );
      break;

    case "gym":
      completed = gymSessions.some(
        (session) => session.date === date
      );
      break;

    case "race":
      completed = runs.some(
        (run) =>
          run.date === date &&
          run.type === "race"
      );
      break;
  }

  // Date du jour (sans l'heure)
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(date);

  eventDate.setHours(0, 0, 0, 0);

  // Si la séance est passée et non réalisée → rouge
  if (
    !completed &&
    eventDate < today
  ) {
    return {
      type: "missed",
      completed: false,
    };
  }

  return {
    type: event.type,
    completed,
  };
}

export function getAgendaBorderColor(
  status: AgendaDayStatus
): string {
  if (status.completed) {
    return "#4CAF50";
  }

  switch (status.type) {
    case "training":
      return "#3B82F6";

    case "gym":
      return "#F59E0B";

    case "race":
      return "#FFFFFF";

    case "missed":
      return "#EF4444";

    default:
      return "#2E2E2E";
  }
}