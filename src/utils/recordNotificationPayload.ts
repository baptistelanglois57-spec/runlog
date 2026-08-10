const RECORD_NOTIFICATION_PREFIX = "runlog-record:v1:";

export type RecordNotificationPayload = {
  label: string;
  value: string;
  previousValue?: string;
  progression?: string;
};

export function serializeRecordNotificationPayload(
  payload: RecordNotificationPayload
): string {
  return `${RECORD_NOTIFICATION_PREFIX}${JSON.stringify(payload)}`;
}

export function parseRecordNotificationPayload(
  message: string
): RecordNotificationPayload | null {
  if (!message.startsWith(RECORD_NOTIFICATION_PREFIX)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      message.slice(RECORD_NOTIFICATION_PREFIX.length)
    ) as Partial<RecordNotificationPayload>;

    if (typeof payload.label !== "string" || typeof payload.value !== "string") {
      return null;
    }

    return {
      label: payload.label,
      value: payload.value,
      previousValue:
        typeof payload.previousValue === "string"
          ? payload.previousValue
          : undefined,
      progression:
        typeof payload.progression === "string"
          ? payload.progression
          : undefined,
    };
  } catch {
    return null;
  }
}

export function parseLegacyRecordNotificationPayload(
  message: string
): Pick<RecordNotificationPayload, "label" | "value"> | null {
  if (message.startsWith(RECORD_NOTIFICATION_PREFIX)) {
    return null;
  }

  const separatorIndex = message.indexOf(" : ");

  if (separatorIndex <= 0) {
    return null;
  }

  const label = message.slice(0, separatorIndex).trim();
  const value = message.slice(separatorIndex + 3).trim();

  if (!label || !value) {
    return null;
  }

  return { label, value };
}

function normalizeRecordValue(value: string) {
  const compactValue = value.replace(/\s/g, "").replace(",", ".");
  const metricMatch = compactValue.match(/^(-?\d+(?:\.\d+)?)(km|m)$/i);

  if (metricMatch) {
    return `${Number(metricMatch[1])}:${metricMatch[2].toLowerCase()}`;
  }

  return compactValue.toLowerCase();
}

export function recordNotificationPayloadsMatch(
  legacy: Pick<RecordNotificationPayload, "label" | "value">,
  premium: RecordNotificationPayload
) {
  return (
    legacy.label.trim().toLocaleLowerCase("fr-FR") ===
      premium.label.trim().toLocaleLowerCase("fr-FR") &&
    normalizeRecordValue(legacy.value) === normalizeRecordValue(premium.value)
  );
}

type RecordNotificationSnapshot = {
  id: string;
  runId?: string | null;
  message: string;
};

export function findLegacyRecordNotificationDuplicateIds(
  notifications: RecordNotificationSnapshot[]
): string[] {
  const premiumNotifications = notifications.flatMap((notification) => {
    const payload = parseRecordNotificationPayload(notification.message);

    return payload ? [{ ...notification, payload }] : [];
  });

  return notifications.flatMap((notification) => {
    if (!notification.runId) {
      return [];
    }

    const legacyPayload = parseLegacyRecordNotificationPayload(
      notification.message
    );

    if (!legacyPayload) {
      return [];
    }

    const hasPremiumEquivalent = premiumNotifications.some(
      (premiumNotification) =>
        premiumNotification.runId === notification.runId &&
        recordNotificationPayloadsMatch(
          legacyPayload,
          premiumNotification.payload
        )
    );

    return hasPremiumEquivalent ? [notification.id] : [];
  });
}
