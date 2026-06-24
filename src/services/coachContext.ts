import { getRuns } from "./runService";
import { getEvents } from "./eventService";

import {
  getLongestRun,
  getFastestAveragePace,
  getHighestElevation,
  getBiggestWeek,
  getBiggestMonth,
  getBiggestYear,
  getBestPosition,
} from "../utils/records";

import {
  getNextTraining,
  getNextRace,
} from "../utils/events";

export async function buildCoachContext() {
  const runs = await getRuns();
  const events = await getEvents();

  return {
    generatedAt: new Date().toISOString(),

    athlete: {
      name: "Baptiste",
    },

    runs,

    events,

    stats: {
      totalRuns: runs.length,

      totalDistance: runs.reduce(
        (sum, run) => sum + run.distance,
        0
      ),

      longestRun: getLongestRun(runs),

      fastestRun: getFastestAveragePace(runs),

      highestElevation: getHighestElevation(runs),

      biggestWeek: getBiggestWeek(runs),

      biggestMonth: getBiggestMonth(runs),

      biggestYear: getBiggestYear(runs),

      bestRacePosition: getBestPosition(runs),
    },

    upcoming: {
      nextTraining: getNextTraining(events),

      nextRace: getNextRace(events),
    },
  };
}

export function buildCoachSummary(context: any) {
  return `
Tu es le Coach officiel de RunLog.

Tu coaches Baptiste.

Voici son profil actuel.

Nom : ${context.athlete.name}

Sorties enregistrées : ${context.stats.totalRuns}

Distance totale : ${context.stats.totalDistance.toFixed(2)} km

Plus longue sortie :
${
  context.stats.longestRun
    ? `${context.stats.longestRun.distance} km`
    : "Aucune"
}

Plus gros D+ :
${
  context.stats.highestElevation
    ? `${context.stats.highestElevation.elevation} m`
    : "Aucun"
}

Plus grosse semaine :
${context.stats.biggestWeek.toFixed(2)} km

Plus gros mois :
${context.stats.biggestMonth.toFixed(2)} km

Plus grosse année :
${context.stats.biggestYear.toFixed(2)} km

Prochain entraînement :
${
  context.upcoming.nextTraining
    ? context.upcoming.nextTraining.name
    : "Aucun"
}

Prochaine compétition :
${
  context.upcoming.nextRace
    ? context.upcoming.nextRace.name
    : "Aucune"
}

Tu dois répondre comme un véritable entraîneur professionnel.
`;
}