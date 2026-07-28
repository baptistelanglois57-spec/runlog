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
    const [hours, minutes, seconds] =
      run.duration.split(":").map(Number);

    const totalSeconds =
      hours * 3600 +
      minutes * 60 +
      seconds;

    return totalSeconds / run.distance;
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
  const matchingRuns = runs.filter(
    (run) => run.distance >= distance
  );

  if (matchingRuns.length === 0) {
    return null;
  }

  function estimatedSeconds(run: Run) {
    const [hours, minutes, seconds] =
      run.duration.split(":").map(Number);

    const totalSeconds =
      hours * 3600 +
      minutes * 60 +
      seconds;

    const pace =
      totalSeconds / run.distance;

    return pace * distance;
  }

  function formatDuration(
    totalSeconds: number
  ) {
    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const seconds = Math.round(
      totalSeconds % 60
    );

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  }

  const bestRun = matchingRuns.reduce(
    (best, run) =>
      estimatedSeconds(run) <
      estimatedSeconds(best)
        ? run
        : best
  );

  return {
    ...bestRun,
    duration: formatDuration(
      estimatedSeconds(bestRun)
    ),
    estimated: bestRun.distance > distance,
  };
}
export function getBestPaceHeartRateZone(
  runs: Run[],
  minHeartRate: number,
  maxHeartRate: number
) {
  const matchingRuns = runs.filter(
    (run) =>
      run.averageHeartRate !== undefined &&
      run.averageHeartRate >= minHeartRate &&
      run.averageHeartRate <= maxHeartRate &&
      run.distance > 0
  );

  if (matchingRuns.length === 0) {
    return null;
  }

  function pace(run: Run) {
    const [hours, minutes, seconds] =
      run.duration.split(":").map(Number);

    const totalSeconds =
      hours * 3600 +
      minutes * 60 +
      seconds;

    return totalSeconds / run.distance;
  }

  return matchingRuns.reduce((best, run) =>
    pace(run) < pace(best) ? run : best
  );
}