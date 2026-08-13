export const DAILY_SCHEDULE_TIME_ZONE = "Europe/Paris";

export type DailyScheduleEvent = {
  id: string;
  date: string;
  time?: string | null;
  type: "training" | "race" | "gym";
  name: string;
};

export type ParisDateTime = {
  dateKey: string;
  hour: number;
  minute: number;
};

const parisDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  timeZone: DAILY_SCHEDULE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function getParisDateTime(now = new Date()): ParisDateTime {
  const parts = Object.fromEntries(
    parisDateTimeFormatter
      .formatToParts(now)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return {
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

export function isDailyScheduleWindow(now = new Date()) {
  const paris = getParisDateTime(now);
  return paris.hour === 0 && paris.minute < 10;
}

export function getDailyScheduleDedupeKey(dateKey: string, userId?: string | null) {
  return `daily-schedule:${dateKey}:${userId ?? "anonymous"}`;
}

function formatEventTime(time?: string | null) {
  if (!time) return "heure non renseignée";
  const match = /^(\d{2}):(\d{2})/.exec(time);
  return match ? `${match[1]}:${match[2]}` : "heure non renseignée";
}

function eventLabel(event: DailyScheduleEvent) {
  const name = event.name.trim()
    || (event.type === "race" ? "Compétition" : event.type === "gym" ? "Musculation" : "Entraînement");
  const typedName = event.type === "race" ? `Compétition · ${name}` : name;
  return `${typedName} — ${formatEventTime(event.time)}`;
}

export function buildDailyScheduleMessage(events: DailyScheduleEvent[]) {
  return [...events]
    .sort((a, b) => {
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      return a.name.localeCompare(b.name, "fr");
    })
    .map(eventLabel)
    .join("\n");
}
