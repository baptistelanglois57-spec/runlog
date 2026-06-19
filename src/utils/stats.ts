import type { Run } from "../types/Run";

/* ===========================
   DISTANCE SEMAINE
   Lundi -> Dimanche
=========================== */

export function getWeekDistance(runs: Run[]) {
  const today = new Date();

  const monday = new Date(today);

  const day =
    monday.getDay() === 0
      ? 7
      : monday.getDay();

  monday.setDate(monday.getDate() - day + 1);

  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);

  sunday.setDate(monday.getDate() + 6);

  sunday.setHours(23, 59, 59, 999);

  return runs
    .filter((run) => {
      const runDate = new Date(run.date);

      return runDate >= monday && runDate <= sunday;
    })
    .reduce(
      (total, run) => total + run.distance,
      0
    );
}

/* ===========================
   DISTANCE MOIS
=========================== */

export function getMonthDistance(runs: Run[]) {
  const today = new Date();

  return runs
    .filter((run) => {
      const runDate = new Date(run.date);

      return (
        runDate.getMonth() ===
          today.getMonth() &&
        runDate.getFullYear() ===
          today.getFullYear()
      );
    })
    .reduce(
      (total, run) => total + run.distance,
      0
    );
}

/* ===========================
   DISTANCE ANNEE
=========================== */

export function getYearDistance(runs: Run[]) {
  const year = new Date().getFullYear();

  return runs
    .filter(
      (run) =>
        new Date(run.date).getFullYear() ===
        year
    )
    .reduce(
      (total, run) => total + run.distance,
      0
    );
}

/* ===========================
   TOTAL SORTIES
=========================== */

export function getTotalRuns(runs: Run[]) {
  return runs.length;
}

/* ===========================
   DISTANCE TOTALE
=========================== */

export function getTotalDistance(
  runs: Run[]
) {
  return runs.reduce(
    (total, run) => total + run.distance,
    0
  );
}

/* ===========================
   DENIVELE
=========================== */

export function getTotalElevation(
  runs: Run[]
) {
  return runs.reduce(
    (total, run) => total + run.elevation,
    0
  );
}

/* ===========================
   TEMPS TOTAL
=========================== */

export function getTotalTime(runs: Run[]) {
  return runs.reduce((total, run) => {
    const parts = run.duration
      .split(":")
      .map(Number);

    if (parts.length !== 2)
      return total;

    const [hours, minutes] = parts;

    return total + hours * 60 + minutes;
  }, 0);
}

/* ===========================
   FORMAT TEMPS
=========================== */

export function formatMinutes(
  totalMinutes: number
) {
  const hours = Math.floor(
    totalMinutes / 60
  );

  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}min`;
}

/* ===========================
   DERNIERE SORTIE
=========================== */

export function getLastRun(
  runs: Run[]
) {
  if (!runs.length) return null;

  return [...runs].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  )[0];
}

/* ===========================
   RYTHME MOYEN
=========================== */

export function getAveragePace(
  distance: number,
  duration: string
) {
  if (!distance) return "--";

  const parts = duration
    .split(":")
    .map(Number);

  if (parts.length !== 2)
    return "--";

  const [hours, minutes] = parts;

  const totalMinutes =
    hours * 60 + minutes;

  const pace =
    totalMinutes / distance;

  const min = Math.floor(pace);

  const sec = Math.round(
    (pace - min) * 60
  );

  return `${min}'${sec
    .toString()
    .padStart(2, "0")}" /km`;
}