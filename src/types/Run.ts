export type Run = {
  id: string;

  name: string;

  date: string;

  distance: number;

  duration: string;

  elevation: number;

  type: "training" | "race";

  competitionName?: string;

  location?: string;

  position?: number;

  participants?: number;
};