import { createClient } from "jsr:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";
import {
  buildDailyScheduleMessage,
  getDailyScheduleDedupeKey,
  getParisDateTime,
  type DailyScheduleEvent,
} from "../_shared/dailySchedule.ts";

type ReminderPayload = {
  title?: string;
  message?: string;
  icon?: string;
};

type ScheduledReminder = {
  id: string;
  event_id: string;
  reminder_type: "training" | "race";
  dedupe_key: string;
  payload: ReminderPayload;
};

type PushSubscriptionRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

type PushBatchResult = {
  sent: number;
  failures: number;
  providerStatusCodes: number[];
};

const jsonHeaders = { "content-type": "application/json" };

function hasSchedulerAccess(request: Request) {
  const secret = Deno.env.get("SCHEDULER_SECRET");
  return Boolean(secret) && request.headers.get("x-scheduler-secret") === secret;
}

async function deliverPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: { title: string; message: string }
) {
  const publicKey = Deno.env.get("VAPID_PUBLIC_KEY");
  const privateKey = Deno.env.get("VAPID_PRIVATE_KEY");
  const subject = Deno.env.get("VAPID_SUBJECT");

  if (!publicKey || !privateKey || !subject) {
    return { status: "not-configured" as const, statusCode: null };
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  const response = await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: { p256dh: subscription.p256dh, auth: subscription.auth },
    },
    JSON.stringify({ ...payload, url: "/agenda" })
  );
  return { status: "sent" as const, statusCode: response.statusCode };
}

async function deliverPushBatch(
  supabase: ReturnType<typeof createClient>,
  subscriptions: PushSubscriptionRow[],
  payload: { title: string; message: string; url?: string }
): Promise<PushBatchResult> {
  const result: PushBatchResult = { sent: 0, failures: 0, providerStatusCodes: [] };

  for (const subscription of subscriptions) {
    try {
      const delivery = await deliverPush(subscription, payload);
      if (delivery.status === "sent") result.sent += 1;
      if (delivery.statusCode) result.providerStatusCodes.push(delivery.statusCode);
    } catch (error) {
      result.failures += 1;
      const statusCode = error instanceof Error && "statusCode" in error
        ? Number((error as { statusCode?: number }).statusCode)
        : 0;
      if (statusCode) result.providerStatusCodes.push(statusCode);
      console.error("web-push", {
        statusCode,
        message: error instanceof Error ? error.message : "Erreur Web Push inconnue",
      });
      if (statusCode === 404 || statusCode === 410) {
        await supabase.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint);
      }
    }
  }

  return result;
}

async function loadDailyScheduleEvents(
  supabase: ReturnType<typeof createClient>,
  dateKey: string
) {
  const { data, error } = await supabase
    .from("events")
    .select("id, date, time, type, name")
    .eq("date", dateKey)
    .in("type", ["training", "race", "gym"])
    .order("time", { ascending: true, nullsFirst: false });

  return {
    events: (data ?? []) as DailyScheduleEvent[],
    error: error?.message ?? null,
  };
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  if (!hasSchedulerAccess(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Configuration Supabase manquante." }), {
      status: 500,
      headers: jsonHeaders,
    });
  }

  const supabase = createClient(url, serviceRoleKey);
  const requestBody = await request.json().catch(() => ({})) as {
    mode?: string;
    date?: string;
  };
  const { data: subscriptions, error: subscriptionsError } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("enabled", true);

  if (subscriptionsError) {
    console.error("push_subscriptions", subscriptionsError);
    return new Response(JSON.stringify({ error: "Lecture des abonnements Push impossible." }), {
      status: 500,
      headers: jsonHeaders,
    });
  }

  const activeSubscriptions = (subscriptions ?? []) as PushSubscriptionRow[];

  if (requestBody.mode === "test") {
    const push = await deliverPushBatch(supabase, activeSubscriptions, {
      title: "Test RunLog",
      message: "Les notifications sont correctement activées.",
    });

    return new Response(JSON.stringify({
      mode: "test",
      subscriptionsFound: activeSubscriptions.length,
      pushSent: push.sent,
      pushFailures: push.failures,
      providerStatusCodes: push.providerStatusCodes,
    }), { headers: jsonHeaders });
  }

  const parisNow = getParisDateTime();
  const isDailyTest = requestBody.mode === "daily-schedule-test";
  const requestedTestDate = isDailyTest && /^\d{4}-\d{2}-\d{2}$/.test(requestBody.date ?? "")
    ? requestBody.date!
    : parisNow.dateKey;
  let dailySchedule: Record<string, unknown> = {
    processed: false,
    date: requestedTestDate,
    reason: "pending",
  };

  if (isDailyTest) {
    const { events, error: eventError } = await loadDailyScheduleEvents(supabase, requestedTestDate);
    if (eventError) {
      console.error("daily-schedule-test events", { date: requestedTestDate, error: eventError });
      dailySchedule = { processed: false, test: true, date: requestedTestDate, error: eventError };
    } else if (events.length === 0) {
      dailySchedule = {
        processed: true,
        test: true,
        date: requestedTestDate,
        eventCount: 0,
        pushSent: 0,
        reason: "no-events",
      };
    } else {
      const push = await deliverPushBatch(supabase, activeSubscriptions, {
        title: "Programme du jour",
        message: buildDailyScheduleMessage(events),
      });
      dailySchedule = {
        processed: true,
        test: true,
        date: requestedTestDate,
        eventCount: events.length,
        subscriptionsFound: activeSubscriptions.length,
        pushSent: push.sent,
        pushFailures: push.failures,
        providerStatusCodes: push.providerStatusCodes,
      };
    }
  } else {
    // Chaque passage du cron tente la journée locale. La réclamation atomique
    // rend le rattrapage robuste, même si le passage de 00:00 a été manqué.
    const { data: claimed, error: claimError } = await supabase
      .rpc("claim_daily_schedule", { target_date: requestedTestDate });

    if (claimError) {
      console.error("daily-schedule claim", { date: requestedTestDate, error: claimError.message });
      dailySchedule = { processed: false, date: requestedTestDate, error: claimError.message };
    } else if (!claimed) {
      dailySchedule = {
        processed: false,
        date: requestedTestDate,
        reason: "already-processed",
      };
    } else {
      const { events, error: eventError } = await loadDailyScheduleEvents(supabase, requestedTestDate);
      if (eventError) {
        await supabase.from("daily_schedule_deliveries").update({
          status: "failed",
          last_error: eventError,
          updated_at: new Date().toISOString(),
        }).eq("schedule_date", requestedTestDate);
        console.error("daily-schedule events", { date: requestedTestDate, error: eventError });
        dailySchedule = { processed: false, date: requestedTestDate, error: eventError };
      } else if (events.length === 0) {
        await supabase.from("daily_schedule_deliveries").update({
          status: "no-events",
          event_ids: [],
          updated_at: new Date().toISOString(),
        }).eq("schedule_date", requestedTestDate);
        dailySchedule = {
          processed: true,
          date: requestedTestDate,
          eventCount: 0,
          reason: "no-events",
        };
        console.info("daily-schedule", dailySchedule);
      } else {
        const entityId = getDailyScheduleDedupeKey(requestedTestDate);
        let notificationId = crypto.randomUUID();
        let shouldSendPush = true;
        let canDeliver = true;
        const { error: notificationError } = await supabase.from("notifications").insert({
          id: notificationId,
          type: "daily_schedule",
          action: "open-agenda",
          entity: "daily-schedule",
          entityId,
          icon: "calendar-days",
          title: "Programme du jour",
          message: buildDailyScheduleMessage(events),
          createdAt: new Date().toISOString(),
          read: false,
        });

        if (notificationError?.code === "23505") {
          const { data: existingNotification, error: existingNotificationError } = await supabase
            .from("notifications")
            .select("id")
            .eq("entity", "daily-schedule")
            .eq("entityId", entityId)
            .maybeSingle();
          if (existingNotificationError || !existingNotification) {
            const error = existingNotificationError?.message ?? notificationError.message;
            await supabase.from("daily_schedule_deliveries").update({
              status: "failed",
              last_error: error,
              updated_at: new Date().toISOString(),
            }).eq("schedule_date", requestedTestDate);
            dailySchedule = { processed: false, date: requestedTestDate, error };
            canDeliver = false;
          } else {
            notificationId = existingNotification.id;
            shouldSendPush = false;
          }
        } else if (notificationError) {
          await supabase.from("daily_schedule_deliveries").update({
            status: "failed",
            last_error: notificationError.message,
            updated_at: new Date().toISOString(),
          }).eq("schedule_date", requestedTestDate);
          dailySchedule = { processed: false, date: requestedTestDate, error: notificationError.message };
          canDeliver = false;
        }

        if (canDeliver) {
          const push = shouldSendPush
            ? await deliverPushBatch(supabase, activeSubscriptions, {
              title: "Programme du jour",
              message: buildDailyScheduleMessage(events),
            })
            : { sent: 0, failures: 0, providerStatusCodes: [] };
          const pushStatus = push.sent > 0
            ? "sent"
            : push.failures > 0
              ? "failed"
              : "not-configured";

          await supabase.from("daily_schedule_deliveries").update({
            status: "sent",
            notification_id: notificationId,
            event_ids: events.map((event) => event.id),
            push_status: pushStatus,
            updated_at: new Date().toISOString(),
          }).eq("schedule_date", requestedTestDate);
          dailySchedule = {
            processed: true,
            date: requestedTestDate,
            eventCount: events.length,
            subscriptionsFound: activeSubscriptions.length,
            pushSent: push.sent,
            pushFailures: push.failures,
            providerStatusCodes: push.providerStatusCodes,
            notificationId,
          };
          console.info("daily-schedule", dailySchedule);
        }
      }
    }
  }

  // Le mode de validation envoie le vrai Push mais ne réclame aucun rappel H-1/J-1.
  // Il ne crée pas non plus d'entrée persistante, afin de laisser la production intacte.
  if (isDailyTest) {
    return new Response(JSON.stringify({ dailySchedule }), { headers: jsonHeaders });
  }

  const { data, error } = await supabase.rpc("claim_due_event_reminders", { batch_size: 100 });
  if (error) {
    console.error("claim_due_event_reminders", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: jsonHeaders });
  }

  const reminders = (data ?? []) as ScheduledReminder[];
  let delivered = 0;
  let pushFailures = 0;
  let pushSent = 0;
  const providerStatusCodes: number[] = [];

  for (const reminder of reminders) {
    // Une suppression Agenda peut intervenir pendant qu'un cron a réclamé le lot.
    // Recontrôler l'existence protège ce cas de course avant toute livraison.
    const { data: stillScheduled } = await supabase
      .from("scheduled_event_reminders")
      .select("id")
      .eq("id", reminder.id)
      .eq("status", "processing")
      .maybeSingle();
    if (!stillScheduled) continue;

    const title = reminder.payload.title ?? "RunLog";
    const message = reminder.payload.message ?? "Un événement approche.";
    const notificationId = crypto.randomUUID();
    const { error: notificationError } = await supabase.from("notifications").insert({
      id: notificationId,
      type: reminder.reminder_type,
      action: "event-reminder",
      entity: "event-reminder",
      entityId: reminder.dedupe_key,
      icon: reminder.payload.icon ?? "calendar",
      title,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    });

    // 23505 = l'échéance a déjà été écrite dans le centre lors d'un précédent passage.
    if (notificationError && notificationError.code !== "23505") {
      await supabase.from("scheduled_event_reminders").update({
        status: "failed",
        last_error: notificationError.message,
        updated_at: new Date().toISOString(),
      }).eq("id", reminder.id);
      continue;
    }

    let reminderPushSent = 0;
    let reminderPushFailures = 0;
    for (const subscription of activeSubscriptions) {
      try {
        const result = await deliverPush(subscription, { title, message });
        if (result.status === "sent") {
          reminderPushSent += 1;
          pushSent += 1;
        }
        if (result.statusCode) providerStatusCodes.push(result.statusCode);
      } catch (error) {
        pushFailures += 1;
        reminderPushFailures += 1;
        const statusCode = error instanceof Error && "statusCode" in error
          ? Number((error as { statusCode?: number }).statusCode)
          : 0;
        if (statusCode) providerStatusCodes.push(statusCode);
        console.error("web-push reminder", {
          reminderId: reminder.id,
          statusCode,
          message: error instanceof Error ? error.message : "Erreur Web Push inconnue",
        });
        if (statusCode === 404 || statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint);
        }
      }
    }

    const pushStatus = reminderPushSent > 0
      ? "sent"
      : reminderPushFailures > 0
        ? "failed"
        : "not-configured";

    await supabase.from("scheduled_event_reminders").update({
      status: "sent",
      sent_at: new Date().toISOString(),
      notification_id: notificationId,
      push_status: pushStatus,
      updated_at: new Date().toISOString(),
    }).eq("id", reminder.id);
    delivered += 1;
  }

  return new Response(JSON.stringify({
    claimed: reminders.length,
    delivered,
    subscriptionsFound: activeSubscriptions.length,
    pushSent,
    pushFailures,
    providerStatusCodes,
    dailySchedule,
  }), {
    headers: jsonHeaders,
  });
});
