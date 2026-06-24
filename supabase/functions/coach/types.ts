export type CoachRequest = {
  question: string;
  context?: unknown;
};

export type CoachResponse = {
  answer: string;
};