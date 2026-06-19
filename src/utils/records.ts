import type { Run } from "../types/Run";

export function getLongestRun(runs: Run[]) {
  if (runs.length === 0) return null;

  return runs.reduce((longest, run) =>
    run.distance > longest.distance ? run : longest
  );
}

export function getFastestAveragePace(runs: Run[]) {
  if (runs.length === 0) return null;

  function pace(run: Run) {
    const [hours, minutes] = run.duration
      .split(":")
      .map(Number);

    const totalMinutes = hours * 60 + minutes;

    return totalMinutes / run.distance;
  }

  return runs.reduce((fastest, run) =>
    pace(run) < pace(fastest) ? run : fastest
  );
}

export function getHighestElevation(runs: Run[]) {
  if (runs.length === 0) return null;

  return runs.reduce((highest, run) =>
    run.elevation > highest.elevation
      ? run
      : highest
  );
}
export function getBiggestWeek(runs: Run[]) {
  if (runs.length === 0) return 0;

  let maxDistance = 0;

  runs.forEach((run) => {
    const current = new Date(run.date);

    const start = new Date(current);
    start.setDate(current.getDate() - current.getDay() + 1);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const total = runs
      .filter((r) => {
        const d = new Date(r.date);
        return d >= start && d <= end;
      })
      .reduce((sum, r) => sum + r.distance, 0);

    if (total > maxDistance) {
      maxDistance = total;
    }
  });

  return maxDistance;
}

export function getBiggestMonth(runs: Run[]) {
  const months: Record<string, number> = {};

  runs.forEach((run) => {
    const date = new Date(run.date);

    const key =
      `${date.getFullYear()}-${date.getMonth()}`;

    months[key] =
      (months[key] ?? 0) + run.distance;
  });

  return Math.max(...Object.values(months), 0);
}

export function getBiggestYear(runs: Run[]) {
  const years: Record<number, number> = {};

  runs.forEach((run) => {
    const year = new Date(run.date).getFullYear();

    years[year] =
      (years[year] ?? 0) + run.distance;
  });

  return Math.max(...Object.values(years), 0);
}

export function getMostRunsInMonth(
  runs: Run[]
) {
  const months: Record<string, number> = {};

  runs.forEach((run) => {
    const date = new Date(run.date);

    const key =
      `${date.getFullYear()}-${date.getMonth()}`;

    months[key] =
      (months[key] ?? 0) + 1;
  });

  return Math.max(...Object.values(months), 0);
}
export function getBestPosition(runs: Run[]) {
  const races = runs.filter(
    (run) =>
      run.type === "race" &&
      run.position !== undefined
  );

  if (races.length === 0) return null;

  return races.reduce((best, run) =>
    run.position! < best.position!
      ? run
      : best
  );
}

export function getWins(runs: Run[]) {
  return runs.filter(
    (run) =>
      run.type === "race" &&
      run.position === 1
  ).length;
}

export function getPodiums(runs: Run[]) {
  return runs.filter(
    (run) =>
      run.type === "race" &&
      run.position !== undefined &&
      run.position <= 3
  ).length;
}

export function getTop10(runs: Run[]) {
  return runs.filter(
    (run) =>
      run.type === "race" &&
      run.position !== undefined &&
      run.position <= 10
  ).length;
}
export function getRaceRecord(
  runs: Run[],
  distance: number
) {
  const races = runs.filter(
    (run) =>
      run.type === "race" &&
      Math.abs(run.distance - distance) < 0.2
  );

  if (races.length === 0) {
    return null;
  }

  function totalMinutes(run: Run) {
    const [hours, minutes] =
      run.duration.split(":").map(Number);

    return hours * 60 + minutes;
  }

  return races.reduce((best, run) =>
    totalMinutes(run) <
    totalMinutes(best)
      ? run
      : best
  );
}