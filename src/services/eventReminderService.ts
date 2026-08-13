import { supabase } from "../lib/supabase";
import type { Event } from "../types/Event";
import { getEventReminderPlan, isFutureEventReminder } from "../utils/eventReminders";

const TABLE = "scheduled_event_reminders";

/**
 * Synchronise la planification côté serveur après chaque écriture Agenda.
 * En cas de migration non encore appliquée, l'événement lui-même reste enregistré :
 * le rappel est une amélioration non bloquante et l'erreur est documentée en console.
 */
export async function syncEventReminder(event: Event): Promise<void> {
  const plan = getEventReminderPlan(event);

  if (!plan || !isFutureEventReminder(plan)) {
    await cancelEventReminder(event.id);
    return;
  }

  const { data: existing, error: existingError } = await supabase
    .from(TABLE)
    .select("dedupe_key, status")
    .eq("event_id", plan.eventId)
    .eq("reminder_type", plan.reminderType)
    .maybeSingle();

  if (existingError) {
    console.error("Erreur lecture syncEventReminder :", existingError);
    return;
  }

  // Une échéance déjà envoyée reste définitive : un simple rechargement Agenda
  // ne peut jamais la remettre en file ni produire un second Push.
  if (existing?.dedupe_key === plan.dedupeKey && existing.status === "sent") {
    return;
  }

  if (existing?.dedupe_key === plan.dedupeKey && existing.status === "scheduled") {
    return;
  }

  const { error } = await supabase
    .from(TABLE)
    .upsert(
      {
        event_id: plan.eventId,
        reminder_type: plan.reminderType,
        scheduled_at: plan.scheduledAt.toISOString(),
        dedupe_key: plan.dedupeKey,
        payload: {
          title: plan.title,
          message: plan.message,
          icon: plan.icon,
          eventDate: event.date,
          eventTime: event.time ?? null,
        },
        status: "scheduled",
        sent_at: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "event_id,reminder_type" }
    );

  if (error) {
    console.error("Erreur syncEventReminder :", error);
  }
}

export async function cancelEventReminder(eventId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("event_id", eventId)
    .in("status", ["scheduled", "processing", "failed"]);

  if (error) {
    console.error("Erreur cancelEventReminder :", error);
  }
}

export async function syncEventReminders(events: Event[]): Promise<void> {
  await Promise.all(events.map((event) => syncEventReminder(event)));
}
