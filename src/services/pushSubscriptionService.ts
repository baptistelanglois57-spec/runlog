import { supabase } from "../lib/supabase";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

export type PushActivationState =
  | "unsupported"
  | "permission-required"
  | "permission-denied"
  | "subscription-missing"
  | "active";

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const raw = atob(normalized + padding);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

export function isPushConfigured() {
  return Boolean(VAPID_PUBLIC_KEY);
}

export async function getPushPermission() {
  return typeof Notification === "undefined" ? "unsupported" : Notification.permission;
}

function sameApplicationServerKey(subscription: PushSubscription) {
  const currentKey = subscription.options.applicationServerKey;
  if (!currentKey || !VAPID_PUBLIC_KEY) return false;

  const expected = decodeBase64Url(VAPID_PUBLIC_KEY);
  const actual = new Uint8Array(currentKey);
  return actual.length === expected.length
    && actual.every((value, index) => value === expected[index]);
}

async function getRunLogServiceWorkerRegistration() {
  const current = await navigator.serviceWorker.getRegistration("/");
  const currentScript = current?.active?.scriptURL ?? current?.waiting?.scriptURL ?? "";

  if (!current || !currentScript.endsWith("/runlog-sw.js")) {
    await navigator.serviceWorker.register("/runlog-sw.js", { scope: "/" });
  }

  return navigator.serviceWorker.ready;
}

async function savePushSubscription(subscription: PushSubscription) {
  const serialized = subscription.toJSON();

  if (!serialized.endpoint || !serialized.keys?.p256dh || !serialized.keys.auth) {
    throw new Error("L'abonnement Push créé par l'iPhone est incomplet.");
  }

  const timestamp = new Date().toISOString();
  const { error } = await supabase
    .from("push_subscriptions")
    .upsert(
      {
        endpoint: serialized.endpoint,
        p256dh: serialized.keys.p256dh,
        auth: serialized.keys.auth,
        platform: /iPhone|iPad|iPod/i.test(navigator.userAgent) ? "ios" : "web",
        enabled: true,
        updated_at: timestamp,
        last_seen: timestamp,
        subscription: serialized,
      },
      { onConflict: "endpoint" }
    );

  if (error) {
    console.error("Erreur sauvegarde abonnement Push :", error);
    throw new Error(`L'abonnement Push n'a pas pu être enregistré (${error.message}).`);
  }
}

/**
 * Vérifie les trois maillons locaux : permission, worker actif et subscription.
 * Une subscription existante est resynchronisée avec Supabase après chaque ouverture
 * du centre afin de réparer les installations accordées mais jamais persistées.
 */
export async function getPushActivationState(): Promise<PushActivationState> {
  if (!isPushConfigured() || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "denied") return "permission-denied";
  if (Notification.permission !== "granted") return "permission-required";

  const registration = await getRunLogServiceWorkerRegistration();
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return "subscription-missing";

  if (!sameApplicationServerKey(subscription)) {
    await subscription.unsubscribe();
    return "subscription-missing";
  }

  await savePushSubscription(subscription);
  return "active";
}

/**
 * Demande l'autorisation uniquement à l'initiative explicite de l'utilisateur,
 * puis persiste l'abonnement pour la fonction Edge d'envoi.
 */
export async function enablePushNotifications() {
  if (!isPushConfigured() || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Les notifications Push ne sont pas disponibles sur cet appareil.");
  }

  const permission = Notification.permission === "granted"
    ? "granted"
    : await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("L'autorisation des notifications n'a pas été accordée.");
  }

  const registration = await getRunLogServiceWorkerRegistration();
  const existing = await registration.pushManager.getSubscription();
  if (existing && !sameApplicationServerKey(existing)) {
    await existing.unsubscribe();
  }

  const validExisting = await registration.pushManager.getSubscription();
  const subscription = validExisting ?? await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: decodeBase64Url(VAPID_PUBLIC_KEY!) as unknown as BufferSource,
  });

  await savePushSubscription(subscription);
}
