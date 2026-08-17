import type { ExerciseLibrary } from "../types/Gym/ExerciseLibrary";
import type { GymSession } from "../types/GymSession";
import {
  getNotificationByEntity,
  addNotification,
} from "./notificationService";
import {
  formatGymRecordPerformance,
  getGymExerciseRecordCandidates,
} from "../utils/gymRecordNotifications";
import { serializeGymRecordNotificationPayload } from "../utils/gymRecordNotificationPayload";

type SyncGymRecordNotificationsOptions = {
  previousSessions: GymSession[];
  savedSession: GymSession;
  library: ExerciseLibrary[];
  isEditing: boolean;
};

/**
 * Écrit seulement les achievements provoqués par la sauvegarde courante.
 * Cette fonction n'est jamais appelée au chargement : aucun record historique
 * ne peut donc être ajouté rétroactivement.
 */
export async function syncGymExerciseRecordNotifications({
  previousSessions,
  savedSession,
  library,
  isEditing,
}: SyncGymRecordNotificationsOptions): Promise<void> {
  const candidates = getGymExerciseRecordCandidates({
    previousSessions,
    savedSession,
    library,
    isEditing,
  });

  await Promise.all(candidates.map(async (candidate) => {
    const existing = await getNotificationByEntity(
      "gym-record",
      candidate.entityId
    );

    if (existing) return;

    await addNotification({
      id: crypto.randomUUID(),
      type: "gym_record",
      // L'action transporte la destination sans ajouter une colonne ou une
      // migration : entityId reste réservé à la clé de déduplication.
      action: `gym_record:${candidate.exerciseId}`,
      entity: "gym-record",
      entityId: candidate.entityId,
      // La colonne historique runId sert ici de référence stable de séance,
      // ce qui permet son nettoyage précis lors d'une suppression Gym.
      runId: savedSession.id,
      icon: "trophy",
      title: "Nouveau record",
      message: serializeGymRecordNotificationPayload({
        exerciseName: candidate.exerciseName,
        value: formatGymRecordPerformance(candidate.current),
        previousValue: formatGymRecordPerformance(candidate.previous),
      }),
      createdAt: new Date().toISOString(),
      read: false,
    });
  }));
}
