export interface AthleteProfile {
  id: string;

  height: number;

  gender: "male" | "female";

  birthDate: string;

  maxHeartRate: number;

  restingHeartRate: number;
}