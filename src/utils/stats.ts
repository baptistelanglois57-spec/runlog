import type { Run } from "../types/Run";

export type TerrainVolumePeriod = "month" | "year" | "total";

export type TerrainVolume = {
  count: number;
  distance: number;
  elevation: number;
};

export type TerrainVolumes = {
  road: TerrainVolume;
  trail: TerrainVolume;
  unknown: TerrainVolume;
  total: TerrainVolume;
};

const EMPTY_TERRAIN_VOLUME: TerrainVolume = {
  count: 0,
  distance: 0,
  elevation: 0,
};

function isInTerrainVolumePeriod(
  run: Run,
  period: TerrainVolumePeriod,
  referenceDate: Date
) {
  if (period === "total") return true;
  const date = new Date(run.date);
  if (Number.isNaN(date.getTime())) return false;

  if (period === "year") {
    return date.getFullYear() === referenceDate.getFullYear();
  }

  return date.getFullYear() === referenceDate.getFullYear()
    && date.getMonth() === referenceDate.getMonth();
}

/**
 * Répartition centralisée des sorties running par terrain réel. Les anciennes
 * données sans terrain sont volontairement comptées à part, jamais forcées en Route.
 */
export function getTerrainVolumes(
  runs: Run[],
  period: TerrainVolumePeriod = "total",
  referenceDate = new Date()
): TerrainVolumes {
  const volumes: TerrainVolumes = {
    road: { ...EMPTY_TERRAIN_VOLUME },
    trail: { ...EMPTY_TERRAIN_VOLUME },
    unknown: { ...EMPTY_TERRAIN_VOLUME },
    total: { ...EMPTY_TERRAIN_VOLUME },
  };

  runs.forEach((run) => {
    if (run.type === "gym" || !isInTerrainVolumePeriod(run, period, referenceDate)) {
      return;
    }

    const distance = Number(run.distance);
    const elevation = Number(run.elevation);
    const safeDistance = Number.isFinite(distance) && distance > 0 ? distance : 0;
    const safeElevation = Number.isFinite(elevation) && elevation > 0 ? elevation : 0;
    const surface = (run as Partial<Run>).surface;
    const target = surface === "road" ? volumes.road
      : surface === "trail" ? volumes.trail
        : volumes.unknown;

    target.count += 1;
    target.distance += safeDistance;
    target.elevation += safeElevation;
    volumes.total.count += 1;
    volumes.total.distance += safeDistance;
    volumes.total.elevation += safeElevation;
  });

  return volumes;
}

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
    (total, run) => {
      const elevation = Number(run.elevation);

      return total + (Number.isFinite(elevation) ? elevation : 0);
    },
    0
  );
}

/* ===========================
   TEMPS TOTAL
=========================== */

export function getTotalTime(
  runs: Run[]
) {
  return runs.reduce((total, run) => {
    const parts = run.duration
      .split(":")
      .map(Number);

    if (parts.length !== 3)
      return total;

    const [hours, minutes, seconds] =
      parts;

    return (
      total +
      hours * 3600 +
      minutes * 60 +
      seconds
    );
  }, 0);
}

/* ===========================
   FORMAT TEMPS
=========================== */

export function formatMinutes(
  totalSeconds: number
) {
  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  return `${hours}h ${minutes}min ${seconds}s`;
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
  if (!distance || !duration) return "--";

  const parts = duration
    .split(":")
    .map(Number);

  if (parts.length !== 3)
    return "--";

  const [hours, minutes, seconds] =
    parts;

  const totalSeconds =
    hours * 3600 +
    minutes * 60 +
    seconds;

  const secondsPerKm =
    totalSeconds / distance;

  const paceMinutes = Math.floor(
    secondsPerKm / 60
  );

  const paceSeconds = Math.round(
    secondsPerKm % 60
  );

  return `${paceMinutes}'${paceSeconds
    .toString()
    .padStart(2, "0")}" /km`;
}
