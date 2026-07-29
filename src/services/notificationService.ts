import { supabase } from "../lib/supabase";
import type { Notification } from "../types/Notification";

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