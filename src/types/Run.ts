export type Run = {
  id: string;

  name: string;

  date: string;

  distance: number;

  duration: string;

  elevation: number;

  averageHeartRate?: number;

  type: "training" | "race" | "gym";

  competitionName?: string;

  location?: string;

  position?: number;

  participants?: number;
};