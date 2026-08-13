export type EventType =
  | "training"
  | "race"
  | "gym";

export interface Event {
  id: string;

  date: string;
  // Format ISO : YYYY-MM-DD

  /**
   * Heure locale facultative, au format HH:mm.
   * Les événements historiques sans heure restent pleinement compatibles.
   */
  time?: string;

  type: EventType;

  name: string;

  notes: string;
}
