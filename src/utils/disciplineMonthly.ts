import type { Event } from "../types/Event";
import type { Run } from "../types/Run";
import type { GymSession } from "../types/GymSession";

import type { DisciplineStats } from "./discipline";

export interface MonthlyDisciplineStats {
  monthKey: string;
  monthLabel: string;
  stats: DisciplineStats;
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

  return {
    planned,
    completed,
    pending,
    missed,
    percentage:
      played === 0
        ? 0
        : Math.round(
            (completed / played) * 100
          ),
  };
}

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export function getMonthlyDiscipline(
  type: "training" | "gym" | "race",
  events: Event[],
  runs: Run[],
  gymSessions: GymSession[]
): MonthlyDisciplineStats[] {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const filteredEvents =
    events.filter(
      (event) => event.type === type
    );

  const groups = new Map<
    string,
    Event[]
  >();

  filteredEvents.forEach((event) => {
    const date = new Date(event.date);

    const key =
      `${date.getFullYear()}-${date.getMonth()}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key)!.push(event);
  });

  const result: MonthlyDisciplineStats[] =
    [];

  Array.from(groups.entries())
    .sort((a, b) =>
      b[0].localeCompare(a[0])
    )
    .forEach(([key, monthEvents]) => {
      let completed = 0;

      let pending = 0;

      monthEvents.forEach((event) => {
        const date = new Date(
          event.date
        );

        if (date > today) {
          pending++;
          return;
        }

        if (type === "gym") {
          if (
            gymSessions.some(
              (session) =>
                session.date ===
                event.date
            )
          ) {
            completed++;
          }

          return;
        }

        if (
          runs.some(
            (run) =>
              run.date ===
                event.date &&
              (type !== "race" ||
                run.type === "race")
          )
        ) {
          completed++;
        }
      });

      const first =
        new Date(
          monthEvents[0].date
        );

      result.push({
        monthKey: key,

        monthLabel: `${
          MONTHS[first.getMonth()]
        } ${first.getFullYear()}`,

        stats: calculateStats(
          monthEvents.length,
          completed,
          pending
        ),
      });
    });

  return result;
}