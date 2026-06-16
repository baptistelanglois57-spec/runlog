import type { Run } from "../types/Run";

export function getLongestRun(runs: Run[]) {
  if (runs.length === 0) return null;

  return runs.reduce((longest, run) =>
    run.distance > longest.distance ? run : longest
  );
}

export function getHighestElevation(runs: Run[]) {
  if (runs.length === 0) return null;

  return runs.reduce((highest, run) =>
    run.elevation > highest.elevation ? run : highest
  );
}

export function getBestPace(runs: Run[]) {
  if (runs.length === 0) return null;

  function pace(run: Run) {
    const parts = run.duration.split(":").map(Number);

    let totalMinutes = 0;

    if (parts.length === 2) {
      totalMinutes = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      totalMinutes =
        parts[0] * 60 +
        parts[1] +
        parts[2] / 60;
    }

    return totalMinutes / run.distance;
  }

  return runs.reduce((best, run) =>
    pace(run) < pace(best) ? run : best
  );
}
export function getBestDistanceRecord(
  runs: Run[],
  targetDistance: number
) {
  const candidates = runs.filter(
    (run) =>
      Math.abs(run.distance - targetDistance) <= 0.3
  );

  if (candidates.length === 0) {
    return null;
  }

  function totalSeconds(duration: string) {
    const parts = duration.split(":").map(Number);

    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }

    return (
      parts[0] * 3600 +
      parts[1] * 60 +
      parts[2]
    );
  }

  return candidates.reduce((best, run) =>
    totalSeconds(run.duration) <
    totalSeconds(best.duration)
      ? run
      : best
  );
}