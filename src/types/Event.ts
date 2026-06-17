export type Event = {
  id: number;

  date: string;

  type: "training" | "race";

  name: string;

  notes: string;
};