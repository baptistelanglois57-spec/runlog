export type EventType = "training" | "race";

export interface Event {
  id: string;

  date: string;
  // Format ISO : YYYY-MM-DD

  type: EventType;

  name: string;

  notes: string;
}