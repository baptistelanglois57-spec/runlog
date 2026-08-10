import { supabase } from "../lib/supabase";
import type { Notification } from "../types/Notification";
import {
  findLegacyRecordNotificationDuplicateIds,
} from "../utils/recordNotificationPayload";

const TABLE = "notifications";

export async function getNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Erreur getNotifications :", error);
    return [];
  }

  return (data ?? []) as Notification[];
}

export async function addNotification(
  notification: Notification
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .insert(notification);

  if (error) {
    console.error("Erreur addNotification :", error);
  }
}

export async function deleteNotification(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur deleteNotification :", error);
  }
}

export async function deleteNotificationsByEntity(
  entity: string,
  entityId: string
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("entity", entity)
    .eq("entityId", entityId);

  if (error) {
    console.error(
      "Erreur deleteNotificationsByEntity :",
      error
    );
  }
}

export async function deleteRecordNotificationsForRun(
  runId: string
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("type", "record")
    .eq("runId", runId);

  if (error) {
    console.error(
      "Erreur deleteRecordNotificationsForRun :",
      error
    );
  }
}

export async function deleteObsoleteRecordNotificationsForRun(
  runId: string,
  validEntityIds: string[]
): Promise<void> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, entityId")
    .eq("type", "record")
    .eq("runId", runId);

  if (error) {
    console.error(
      "Erreur getRecordNotificationsForRun :",
      error
    );
    return;
  }

  const obsoleteIds = (data ?? [])
    .filter((notification) => !validEntityIds.includes(notification.entityId))
    .map((notification) => notification.id);

  if (obsoleteIds.length === 0) {
    return;
  }

  const { error: deleteError } = await supabase
    .from(TABLE)
    .delete()
    .in("id", obsoleteIds);

  if (deleteError) {
    console.error(
      "Erreur deleteObsoleteRecordNotificationsForRun :",
      deleteError
    );
  }
}

export async function cleanupLegacyRecordNotificationDuplicates(): Promise<number> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, runId, message")
    .eq("type", "record");

  if (error) {
    console.error(
      "Erreur cleanupLegacyRecordNotificationDuplicates :",
      error
    );
    return 0;
  }

  const duplicateLegacyIds = findLegacyRecordNotificationDuplicateIds(
    data ?? []
  );

  if (duplicateLegacyIds.length === 0) {
    return 0;
  }

  const { error: deleteError } = await supabase
    .from(TABLE)
    .delete()
    .in("id", duplicateLegacyIds);

  if (deleteError) {
    console.error(
      "Erreur deleteLegacyRecordNotificationDuplicates :",
      deleteError
    );
    return 0;
  }

  return duplicateLegacyIds.length;
}

export async function markNotificationAsRead(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({
      read: true,
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Erreur markNotificationAsRead :",
      error
    );
  }
}

export async function markAllAsRead(): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({
      read: true,
    })
    .eq("read", false);

  if (error) {
    console.error(
      "Erreur markAllAsRead :",
      error
    );
  }
}

export async function notificationExists(
  entity: string,
  entityId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id")
    .eq("entity", entity)
    .eq("entityId", entityId)
    .maybeSingle();

  if (error) {
    return false;
  }

  return !!data;
}

/**
 * Retourne la notification liée à un record,
 * un objectif, une course...
 */
export async function getNotificationByEntity(
  entity: string,
  entityId: string
): Promise<Notification | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("entity", entity)
    .eq("entityId", entityId)
    .limit(1)
    .maybeSingle();

  if (error) {
    return null;
  }

  return (data as Notification) ?? null;
}

/**
 * Remplace une notification existante.
 */
export async function replaceNotification(
  notification: Notification
): Promise<void> {
  await deleteNotificationsByEntity(
    notification.entity,
    notification.entityId
  );

  await addNotification(notification);
}
export async function upsertNotification(
  notification: Notification
): Promise<void> {
  const existing =
    await getNotificationByEntity(
      notification.entity,
      notification.entityId
    );

  // La notification n'existe pas
  if (!existing) {
    await addNotification(notification);
    return;
  }

  const changed =
    existing.title !== notification.title ||
    existing.message !== notification.message ||
    existing.icon !== notification.icon ||
    existing.runId !== notification.runId;

  // Rien n'a changé
  if (!changed) {
    return;
  }

  const { error } = await supabase
    .from(TABLE)
    .update({
      title: notification.title,
      message: notification.message,
      icon: notification.icon,
      runId: notification.runId,
      createdAt: notification.createdAt,

      // Nouveau record → notification non lue
      read: false,
    })
    .eq("id", existing.id);

  if (error) {
    console.error(
      "Erreur upsertNotification :",
      error
    );
  }
}
export async function cleanupNotifications(): Promise<void> {
  const limit = new Date(
    Date.now() - 48 * 60 * 60 * 1000
  ).toISOString();

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("read", true)
    .neq("type", "record")
    .lt("createdAt", limit);

  if (error) {
    console.error(
      "Erreur cleanupNotifications :",
      error
    );
  }
}
