import { getNotes } from "./noteService";
import {
  addNotification,
  getNotificationByEntity,
  deleteNotificationsByEntity,
  deleteObsoleteRecordNotificationsForRun,
  upsertNotification,
} from "./notificationService";
import type { Run } from "../types/Run";
import {
  getHighestElevation,
  getBiggestWeek,
  getBiggestMonth,
  getBiggestYear,
  getLongestRun,
  getFastestAveragePace,
  getRaceRecord,
  getBestPaceHeartRateZone,
} from "../utils/records";
import { getAveragePace } from "../utils/stats";
import { serializeRecordNotificationPayload } from "../utils/recordNotificationPayload";

type RecordMetricKind = "distance" | "duration" | "pace" | "elevation";

type RecordCandidate = {
  entityId: string;
  icon: string;
  label: string;
  value: string;
  metricValue: number;
  metricKind: RecordMetricKind;
  runId: string;
};

type RecordSyncOptions = {
  previousRuns: Run[];
  currentRuns: Run[];
  changedRunId: string;
  checkWeek?: boolean;
  checkMonth?: boolean;
  checkYear?: boolean;
};

function createRecordEntityId(
  category: string,
  runId: string,
  value: string
) {
  return `record:${category}:${runId}:${value}`;
}

function getPaceValue(run: Run) {
  const [hours, minutes, seconds] = run.duration.split(":").map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  return (totalSeconds / run.distance).toFixed(3);
}

function durationToSeconds(duration: string) {
  const [hours, minutes, seconds] = duration.split(":").map(Number);

  return hours * 3600 + minutes * 60 + seconds;
}

function formatDurationDifference(totalSeconds: number) {
  const roundedSeconds = Math.round(totalSeconds);
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const seconds = roundedSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds]
      .map((part) => part.toString().padStart(2, "0"))
      .join(":");
  }

  return [minutes, seconds]
    .map((part) => part.toString().padStart(2, "0"))
    .join(":");
}

function formatProgression(
  previous: RecordCandidate,
  current: RecordCandidate
) {
  if (current.metricKind === "duration") {
    return `−${formatDurationDifference(
      previous.metricValue - current.metricValue
    )}`;
  }

  if (current.metricKind === "pace") {
    return `−${Math.round(
      previous.metricValue - current.metricValue
    )} s/km`;
  }

  if (current.metricKind === "elevation") {
    return `+${Math.round(current.metricValue - previous.metricValue)} m`;
  }

  return `+${(current.metricValue - previous.metricValue).toFixed(2)} km`;
}

function isImprovement(
  previous: RecordCandidate,
  current: RecordCandidate
) {
  if (current.metricKind === "duration" || current.metricKind === "pace") {
    return current.metricValue < previous.metricValue;
  }

  return current.metricValue > previous.metricValue;
}

async function createRecordNotification(
  previous: RecordCandidate | null,
  current: RecordCandidate | null,
  changedRunId: string
) {
  // Un record déjà présent, ou inchangé depuis l'état précédent, ne doit pas
  // être signalé une seconde fois lors d'un nouveau scan.
  if (
    !current ||
    current.runId !== changedRunId ||
    previous?.entityId === current.entityId ||
    (previous !== null && !isImprovement(previous, current))
  ) {
    return;
  }

  const existing = await getNotificationByEntity("record", current.entityId);

  if (existing) {
    return;
  }

  await addNotification({
    id: crypto.randomUUID(),
    type: "record",
    action: "record",
    entity: "record",
    entityId: current.entityId,
    runId: current.runId,
    icon: current.icon,
    title: "Nouveau record",
    message: serializeRecordNotificationPayload({
      label: current.label,
      value: current.value,
      previousValue: previous?.value,
      progression: previous ? formatProgression(previous, current) : undefined,
    }),
    // Cette date est celle de la notification, pas celle de la sortie : elle
    // permet de distinguer une performance historique d'un nouveau record.
    createdAt: new Date().toISOString(),
    read: false,
  });
}

function longestRunCandidate(runs: Run[]): RecordCandidate | null {
  const record = getLongestRun(runs);

  if (!record) {
    return null;
  }

  return {
    entityId: createRecordEntityId(
      "longest-run",
      record.id,
      record.distance.toString()
    ),
    icon: "🏆",
    label: "Plus longue sortie",
    value: `${record.distance.toFixed(2)} km`,
    metricValue: record.distance,
    metricKind: "distance",
    runId: record.id,
  };
}

function fastestPaceCandidate(runs: Run[]): RecordCandidate | null {
  const record = getFastestAveragePace(runs);

  if (!record) {
    return null;
  }

  return {
    entityId: createRecordEntityId(
      "fastest-pace",
      record.id,
      getPaceValue(record)
    ),
    icon: "⚡",
    label: "Meilleure allure",
    value: getAveragePace(record.distance, record.duration),
    metricValue: Number(getPaceValue(record)),
    metricKind: "pace",
    runId: record.id,
  };
}

function highestElevationCandidate(runs: Run[]): RecordCandidate | null {
  const record = getHighestElevation(runs);

  if (!record) {
    return null;
  }

  return {
    entityId: createRecordEntityId(
      "highest-elevation",
      record.id,
      record.elevation.toString()
    ),
    icon: "⛰️",
    label: "Plus gros dénivelé",
    value: `${record.elevation} m`,
    metricValue: record.elevation,
    metricKind: "elevation",
    runId: record.id,
  };
}

function raceCandidate(
  runs: Run[],
  distance: number
): RecordCandidate | null {
  const record = getRaceRecord(runs, distance);

  if (!record) {
    return null;
  }

  return {
    entityId: createRecordEntityId(
      `race-${distance}`,
      record.id,
      record.duration
    ),
    icon: "🥇",
    label: `${distance} km`,
    value: record.duration,
    metricValue: durationToSeconds(record.duration),
    metricKind: "duration",
    runId: record.id,
  };
}

function heartRateCandidate(
  runs: Run[],
  min: number,
  max: number
): RecordCandidate | null {
  const record = getBestPaceHeartRateZone(runs, min, max);

  if (!record) {
    return null;
  }

  return {
    entityId: createRecordEntityId(
      `bpm-${min}-${max}`,
      record.id,
      getPaceValue(record)
    ),
    icon: "❤️",
    label: `≤${max} bpm`,
    value: getAveragePace(record.distance, record.duration),
    metricValue: Number(getPaceValue(record)),
    metricKind: "pace",
    runId: record.id,
  };
}

function volumeCandidate(
  runs: Run[],
  changedRunId: string,
  category: "biggest-week" | "biggest-month" | "biggest-year"
): RecordCandidate | null {
  const record =
    category === "biggest-week"
      ? getBiggestWeek(runs)
      : category === "biggest-month"
        ? getBiggestMonth(runs)
        : getBiggestYear(runs);

  if (!record) {
    return null;
  }

  const label =
    category === "biggest-week"
      ? "Plus grosse semaine"
      : category === "biggest-month"
        ? "Plus gros mois"
        : "Plus grosse année";
  const icon =
    category === "biggest-week"
      ? "📅"
      : category === "biggest-month"
        ? "📆"
        : "🗓️";

  return {
    entityId: createRecordEntityId(
      category,
      changedRunId,
      `${record.date}:${record.total.toFixed(2)}`
    ),
    icon,
    label,
    value: `${record.total.toFixed(2)} km`,
    metricValue: record.total,
    metricKind: "distance",
    runId: changedRunId,
  };
}

function getCurrentRecordEntityIdsForRun(
  runs: Run[],
  runId: string
): string[] {
  const candidates = [
    longestRunCandidate(runs),
    fastestPaceCandidate(runs),
    highestElevationCandidate(runs),
    ...[5, 10, 15, 21.097, 42.195].map((distance) =>
      raceCandidate(runs, distance)
    ),
    ...[
      [0, 130],
      [131, 140],
      [141, 150],
      [151, 160],
    ].map(([min, max]) => heartRateCandidate(runs, min, max)),
    volumeCandidate(runs, runId, "biggest-week"),
    volumeCandidate(runs, runId, "biggest-month"),
    volumeCandidate(runs, runId, "biggest-year"),
  ];

  return candidates
    .filter(
      (candidate): candidate is RecordCandidate =>
        candidate !== null && candidate.runId === runId
    )
    .map((candidate) => candidate.entityId);
}

export async function cleanupObsoleteRunRecordNotifications(
  runId: string,
  currentRuns: Run[]
): Promise<void> {
  await deleteObsoleteRecordNotificationsForRun(
    runId,
    getCurrentRecordEntityIdsForRun(currentRuns, runId)
  );
}

export async function syncRunRecordNotifications({
  previousRuns,
  currentRuns,
  changedRunId,
  checkWeek = false,
  checkMonth = false,
  checkYear = false,
}: RecordSyncOptions): Promise<void> {
  const currentChangedRun = currentRuns.find((run) => run.id === changedRunId);

  // Un calcul sans sortie réellement enregistrée/modifiée ne doit jamais
  // transformer les records historiques en nouvelles notifications.
  if (!currentChangedRun) {
    return;
  }

  await Promise.all([
    createRecordNotification(
      longestRunCandidate(previousRuns),
      longestRunCandidate(currentRuns),
      changedRunId
    ),
    createRecordNotification(
      fastestPaceCandidate(previousRuns),
      fastestPaceCandidate(currentRuns),
      changedRunId
    ),
    createRecordNotification(
      highestElevationCandidate(previousRuns),
      highestElevationCandidate(currentRuns),
      changedRunId
    ),
    ...[5, 10, 15, 21.097, 42.195].map((distance) =>
      createRecordNotification(
        raceCandidate(previousRuns, distance),
        raceCandidate(currentRuns, distance),
        changedRunId
      )
    ),
    ...[
      [0, 130],
      [131, 140],
      [141, 150],
      [151, 160],
    ].map(([min, max]) =>
      createRecordNotification(
        heartRateCandidate(previousRuns, min, max),
        heartRateCandidate(currentRuns, min, max),
        changedRunId
      )
    ),
    ...(checkWeek
      ? [
          createRecordNotification(
            volumeCandidate(previousRuns, changedRunId, "biggest-week"),
            volumeCandidate(currentRuns, changedRunId, "biggest-week"),
            changedRunId
          ),
        ]
      : []),
    ...(checkMonth
      ? [
          createRecordNotification(
            volumeCandidate(previousRuns, changedRunId, "biggest-month"),
            volumeCandidate(currentRuns, changedRunId, "biggest-month"),
            changedRunId
          ),
        ]
      : []),
    ...(checkYear
      ? [
          createRecordNotification(
            volumeCandidate(previousRuns, changedRunId, "biggest-year"),
            volumeCandidate(currentRuns, changedRunId, "biggest-year"),
            changedRunId
          ),
        ]
      : []),
  ]);
}

export async function syncNotesNotifications() {
  const notes = await getNotes();
  const today = new Date().toISOString().split("T")[0];

  for (const note of notes) {
    if (!note.importantDate) {
      continue;
    }

    if (note.importantDate !== today) {
      await deleteNotificationsByEntity("note", note.id);
      continue;
    }

    await upsertNotification({
      id: crypto.randomUUID(),
      type: "note",
      action: "note",
      entity: "note",
      entityId: note.id,
      runId: "",
      icon: "📌",
      title: "Pense-bête",
      message: `${note.title} est prévu aujourd'hui.`,
      createdAt: new Date().toISOString(),
      read: false,
    });
  }
}
