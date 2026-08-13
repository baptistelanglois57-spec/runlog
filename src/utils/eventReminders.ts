import type { Event } from "../types/Event";

/** Délai V1 centralisé avant une séance programmée. */
export const TRAINING_REMINDER_LEAD_MS = 60 * 60 * 1000;

/** Délai V1 centralisé avant une compétition programmée. */
export const RACE_REMINDER_LEAD_MS = 24 * 60 * 60 * 1000;

/**
 * Les événements Agenda historiques ne possèdent pas d'heure. Cette heure locale
 * sert uniquement à calculer l'échéance technique et n'est jamais affichée comme
 * si elle avait été renseignée par l'athlète.
 */
export const ALL_DAY_EVENT_REMINDER_HOUR = 9;

export type EventReminderType = "training" | "race";

export type EventReminderPlan = {
  eventId: string;
  reminderType: EventReminderType;
  eventAt: Date;
  scheduledAt: Date;
  dedupeKey: string;
  title: string;
  message: string;
  icon: "calendar" | "flag";
  hasExplicitTime: boolean;
};

function parseLocalEventDate(event: Event) {
  const [year, month, day] = event.date.split("-").map(Number);
  if (!year || !month || !day) return null;

  const hasExplicitTime = /^([01]\d|2[0-3]):[0-5]\d$/.test(event.time ?? "");
  const [hours, minutes] = hasExplicitTime
    ? (event.time ?? "00:00").split(":").map(Number)
    : [ALL_DAY_EVENT_REMINDER_HOUR, 0];

  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return Number.isNaN(date.getTime()) ? null : { date, hasExplicitTime };
}

function formatEventDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Produit une seule échéance stable par événement Agenda compatible.
 * Les séances Salle ne font volontairement pas partie de la V1 demandée.
 */
export function getEventReminderPlan(event: Event): EventReminderPlan | null {
  if (event.type !== "training" && event.type !== "race") return null;

  const parsedDate = parseLocalEventDate(event);
  if (!parsedDate) return null;

  const reminderType = event.type;
  const leadMs = reminderType === "training"
    ? TRAINING_REMINDER_LEAD_MS
    : RACE_REMINDER_LEAD_MS;
  const scheduledAt = new Date(parsedDate.date.getTime() - leadMs);
  const name = event.name.trim();
  const label = name || (reminderType === "training" ? "Votre séance programmée" : "Votre compétition");
  const explicitTimeSuffix = parsedDate.hasExplicitTime
    ? ` commence à ${event.time}.`
    : " commence bientôt.";

  const title = reminderType === "training"
    ? parsedDate.hasExplicitTime ? "Séance dans 1 h" : "Séance à venir"
    : "Compétition demain";
  const message = reminderType === "race" && !parsedDate.hasExplicitTime
    ? `${label} — ${formatEventDate(parsedDate.date)}`
    : `${label}${explicitTimeSuffix}`;

  return {
    eventId: event.id,
    reminderType,
    eventAt: parsedDate.date,
    scheduledAt,
    dedupeKey: `event-reminder:${event.id}:${reminderType}:${scheduledAt.toISOString()}`,
    title,
    message,
    icon: reminderType === "training" ? "calendar" : "flag",
    hasExplicitTime: parsedDate.hasExplicitTime,
  };
}

export function isFutureEventReminder(plan: EventReminderPlan, now = new Date()) {
  return plan.eventAt.getTime() > now.getTime();
}

export function getReminderEventId(notificationEntityId: string) {
  const match = /^event-reminder:([^:]+):(training|race):/.exec(notificationEntityId);
  return match?.[1] ?? null;
}
