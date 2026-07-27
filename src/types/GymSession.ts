import type { GymExercise } from "./Gym/GymExercise";

export type GymSession = {
  id: string;
  date: string;
  name: string;
  exercises: GymExercise[];
  comment: string;
};