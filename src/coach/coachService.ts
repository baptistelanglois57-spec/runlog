import { buildCoachContext } from "../services/coachContext";
import { buildPrompt } from "./coachPrompt";
import { detectCommand } from "./coachCommands";

import {
  analyseWeek,
  analyseLastRun,
  analyseRecords,
  prepareHalf,
  prepareTraining,
} from "./coachTools";

export async function askCoach(question: string) {
  const context = await buildCoachContext();

  const prompt = buildPrompt(context, question);

  const command = detectCommand(question);

  switch (command) {
  case "analyse_week":
    return analyseWeek(context);

  case "analyse_last_run":
    return analyseLastRun();

  case "analyse_records":
    return analyseRecords();

  case "prepare_half":
    return prepareHalf();

  case "prepare_training":
    return prepareTraining();

  default:
    const prompt = buildPrompt(context, question);

    console.log(prompt);

    return `
🤖 Réponse IA

"${question}"

(En attente du branchement OpenAI.)
`;
}

  console.log("===== PROMPT ENVOYÉ AU COACH =====");
  console.log(prompt);

  return `
🤖 Réponse simulée

J'ai bien reçu ta question :

"${question}"

Je dispose maintenant de toutes tes données RunLog.

(La prochaine étape sera de remplacer cette réponse par GPT.)
`;
}