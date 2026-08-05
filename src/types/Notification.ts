export type NotificationType =
  | "record"
  | "heartRate"
  | "training"
  | "race"
  | "goal"
  | "gym"
  | "stats"
  | "note";
export type Notification = {
  id: string;

  runId?: string;

  // Catégorie
  type: NotificationType;

  // Sous-catégorie
  action: string;

  // Élément concerné
  entity: string;

  // Identifiant unique de l'élément
  entityId: string;

  // Affichage
  icon: string;
  title: string;
  message: string;

  // Date de création
  createdAt: string;

  // Lecture
  read: boolean;
};