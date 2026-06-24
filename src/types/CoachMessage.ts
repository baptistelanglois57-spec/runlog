export type CoachMessage = {
  id: string;
  sender: "user" | "coach";
  text: string;
};