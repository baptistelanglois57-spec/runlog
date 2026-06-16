import type { Run } from "../types/Run";

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
    .filter((run) => new Date(run.date).getFullYear() === year)
    .reduce((total, run) => total + run.distance, 0);
}

export function getTotalRuns(runs: Run[]) {
  return runs.length;
}

export function getTotalDistance(runs: Run[]) {
  return runs.reduce((total, run) => total + run.distance, 0);
}

export function getTotalElevation(runs: Run[]) {
  return runs.reduce((total, run) => total + run.elevation, 0);
}

export function getTotalTime(runs: Run[]) {
  return runs.reduce((total, run) => {
    const [hours, minutes] = run.duration.split(":").map(Number);

    return total + hours * 60 + minutes;
  }, 0);
}

export function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}min`;
}

export function getLastRun(runs: Run[]) {
  if (runs.length === 0) {
    return null;
  }

  return [...runs].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  )[0];
}
export function getAveragePace(
  distance: number,
  duration: string
) {
  const [hours, minutes] = duration.split(":").map(Number);

  const totalMinutes = hours * 60 + minutes;

  const pace = totalMinutes / distance;

  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60);

  return `${min}'${sec.toString().padStart(2, "0")}"/km`;
}