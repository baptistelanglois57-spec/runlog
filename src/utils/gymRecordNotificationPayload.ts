const GYM_RECORD_NOTIFICATION_PREFIX = "runlog-gym-record:v1:";

export type GymRecordNotificationPayload = {
  exerciseName: string;
  value: string;
  previousValue: string;
};

export function serializeGymRecordNotificationPayload(
  payload: GymRecordNotificationPayload
) {
  return `${GYM_RECORD_NOTIFICATION_PREFIX}${JSON.stringify(payload)}`;
}

export function parseGymRecordNotificationPayload(
  message: string
): GymRecordNotificationPayload | null {
  if (!message.startsWith(GYM_RECORD_NOTIFICATION_PREFIX)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      message.slice(GYM_RECORD_NOTIFICATION_PREFIX.length)
    ) as Partial<GymRecordNotificationPayload>;

    if (
      typeof parsed.exerciseName !== "string" ||
      typeof parsed.value !== "string" ||
      typeof parsed.previousValue !== "string"
    ) {
      return null;
    }

    return {
      exerciseName: parsed.exerciseName,
      value: parsed.value,
      previousValue: parsed.previousValue,
    };
  } catch {
    return null;
  }
}
