import type { Run } from "../types/Run";

const STORAGE_KEY = "runlog_runs";

export function getRuns(): Run[] {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export function saveRun(run: Run) {
  const runs = getRuns();

  runs.push(run);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(runs)
  );
}

export function updateRun(updatedRun: Run) {
  const runs = getRuns();

  const updatedRuns = runs.map((run) =>
    run.id === updatedRun.id ? updatedRun : run
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedRuns)
  );
}

export function deleteRun(id: number) {
  const runs = getRuns();

  const filteredRuns = runs.filter(
    (run) => run.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filteredRuns)
  );
}

export function getRunById(id: number): Run | undefined {
  return getRuns().find((run) => run.id === id);
}