import type { CoachContext } from "./coachTypes";

export function analyseWeek(
  context: CoachContext
) {
  const runs = context.runs;

  if (runs.length === 0) {
    return "Aucune sortie enregistrée.";
  }

  const today = new Date();

  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const weekRuns = runs.filter((run: any) => {
    const date = new Date(run.date);
    return date >= monday;
  });

  const totalKm = weekRuns.reduce(
    (sum: number, run: any) => sum + run.distance,
    0
  );

  const totalElevation = weekRuns.reduce(
    (sum: number, run: any) => sum + run.elevation,
    0
  );

  return `
📈 Analyse de la semaine

🏃 Sorties : ${weekRuns.length}

📏 Kilométrage : ${totalKm.toFixed(2)} km

⛰ Dénivelé : ${totalElevation} m
`;
}

export function analyseLastRun() {
  return "🏃 Analyse de la dernière sortie.";
}

export function analyseRecords() {
  return "🥇 Analyse des records.";
}

export function prepareHalf() {
  return "🏁 Préparation du semi-marathon.";
}

export function prepareTraining() {
  return "📅 Proposition d'une séance.";
}