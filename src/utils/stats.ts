import type { Run } from "../types/Run";

export function getTotalDistance(runs: Run[]) {
  return runs.reduce((total, run) => total + run.distance, 0);
}

export function getTotalElevation(runs: Run[]) {
  return runs.reduce((total, run) => total + run.elevation, 0);
}
export function getWeekDistance(runs: Run[]) {
  const today = new Date();

  return runs
    .filter((run) => {
      const runDate = new Date(run.date);

      const diff =
        (today.getTime() - runDate.getTime()) /
        (1000 * 60 * 60 * 24);

      return diff <= 7 && diff >= 0;
    })
    .reduce((total, run) => total + run.distance, 0);
}
export function getMonthDistance(runs: Run[]) {
  const today = new Date();

  return runs
    .filter((run) => {
      const runDate = new Date(run.date);

      return (
        runDate.getMonth() === today.getMonth() &&
        runDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((total, run) => total + run.distance, 0);
}
export function getYearDistance(runs: Run[]) {
  const year = new Date().getFullYear();

  return runs
    .filter((run) => {
      return new Date(run.date).getFullYear() === year;
    })
    .reduce((total, run) => total + run.distance, 0);
}
