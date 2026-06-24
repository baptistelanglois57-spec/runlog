import type { CoachContext } from "./coachTypes";

export function buildPrompt(
  context: CoachContext,
  question: string
) {
  return `
Tu es Coach RunLog.

Tu coaches ${context.athlete.name}.

Tu réponds toujours en français.

Tu es un entraîneur expert en course à pied et préparation physique.

Question :

${question}
`;
}