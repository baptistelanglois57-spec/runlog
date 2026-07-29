import { getRuns } from "./runService";

import {
  getNotificationByEntity,
  replaceNotification,
  deleteNotificationsByEntity,
} from "./notificationService";

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

async function syncRecordNotification(
  entityId: string,
  icon: string,
  title: string,
  message: string,
  runId: string,
  createdAt: string
) {
  const entity = "record";

  const existing = await getNotificationByEntity(
    entity,
    entityId
  );

  if (
    existing &&
    existing.title === title &&
    existing.message === message &&
    existing.createdAt === createdAt &&
    existing.icon === icon
  ) {
    return;
  }

  await replaceNotification({
    id: crypto.randomUUID(),

    type: "record",

    action: "record",

    entity,

    entityId,

    runId,

    icon,

    title,

    message,

    createdAt,

    read: false,
  });
}
export async function syncHighestElevationNotification() {
  const runs = await getRuns();

  const highest = getHighestElevation(runs);

  if (!highest) {
    await deleteNotificationsByEntity(
      "record",
      "highest_elevation"
    );
    return;
  }

  await syncRecordNotification(
    "highest_elevation",
    "⛰️",
    "Nouveau record",
    `Plus gros dénivelé : ${highest.elevation} m`,
    highest.id,
    highest.date
  );
}

export async function syncLongestRunNotification() {
  const runs = await getRuns();

  const longestRun = getLongestRun(runs);

  if (!longestRun) {
    await deleteNotificationsByEntity(
      "record",
      "longest_run"
    );
    return;
  }

  await syncRecordNotification(
    "longest_run",
    "🏆",
    "Nouveau record",
    `Plus longue sortie : ${longestRun.distance} km`,
    longestRun.id,
    longestRun.date
  );
}

export async function syncFastestPaceNotification() {
  const runs = await getRuns();

  const fastestRun = getFastestAveragePace(runs);

  if (!fastestRun) {
    await deleteNotificationsByEntity(
      "record",
      "fastest_pace"
    );
    return;
  }

  const [h, m, s] =
    fastestRun.duration
      .split(":")
      .map(Number);

  const totalSeconds =
    h * 3600 +
    m * 60 +
    s;

  const pace =
    totalSeconds /
    fastestRun.distance;

  const minutes =
    Math.floor(pace / 60);

  const seconds =
    Math.round(pace % 60);

  const formatted =
    `${minutes}'${seconds
      .toString()
      .padStart(2, "0")}/km`;

  await syncRecordNotification(
    "fastest_pace",
    "⚡",
    "Nouveau record",
    `Meilleure allure : ${formatted}`,
    fastestRun.id,
    fastestRun.date
  );
}

export async function syncBiggestWeekNotification() {
  const runs = await getRuns();

  const record = getBiggestWeek(runs);

  if (!record) {
    await deleteNotificationsByEntity(
      "record",
      "biggest_week"
    );
    return;
  }

  await syncRecordNotification(
    "biggest_week",
    "📅",
    "Nouveau record",
    `Plus grosse semaine : ${record.total.toFixed(2)} km`,
    "biggest_week",
    record.date
  );
}

export async function syncBiggestMonthNotification() {
  const runs = await getRuns();

  const record = getBiggestMonth(runs);

  if (!record) {
    await deleteNotificationsByEntity(
      "record",
      "biggest_month"
    );
    return;
  }

  await syncRecordNotification(
    "biggest_month",
    "📆",
    "Nouveau record",
    `Plus gros mois : ${record.total.toFixed(2)} km`,
    "biggest_month",
    record.date
  );
}

export async function syncBiggestYearNotification() {
  const runs = await getRuns();

  const record = getBiggestYear(runs);

  if (!record) {
    await deleteNotificationsByEntity(
      "record",
      "biggest_year"
    );
    return;
  }

  await syncRecordNotification(
    "biggest_year",
    "🗓️",
    "Nouveau record",
    `Plus grosse année : ${record.total.toFixed(2)} km`,
    "biggest_year",
    record.date
  );
}
export async function syncRaceRecordNotification(
  distance: number
) {
  const runs = await getRuns();

  const record = getRaceRecord(
    runs,
    distance
  );

  if (!record) {
    await deleteNotificationsByEntity(
      "record",
      `race_${distance}`
    );

    return;
  }

  await syncRecordNotification(
    `race_${distance}`,
    "🥇",
    "Nouveau record",
    `${distance} km : ${record.duration}`,
    record.id,
    record.date
  );
}

export async function syncHeartRateRecordNotification(
  min: number,
  max: number
) {
  const runs = await getRuns();

  const record =
    getBestPaceHeartRateZone(
      runs,
      min,
      max
    );

  if (!record) {
    await deleteNotificationsByEntity(
      "record",
      `bpm_${max}`
    );

    return;
  }

  await syncRecordNotification(
    `bpm_${max}`,
    "❤️",
    "Nouveau record",
    `≤${max} bpm : ${getAveragePace(
      record.distance,
      record.duration
    )}`,
    record.id,
    record.date
  );
}