import type { GymSet } from "./GymSet";

export type GymExercise = {
  id: string;
  name: string;
  sets: GymSet[];
};