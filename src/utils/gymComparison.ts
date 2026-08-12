import type { GymExercise } from "../types/Gym/GymExercise";

export type ExerciseComparison = {
  name: string;
  previousSets: GymExercise["sets"];
  currentSets: GymExercise["sets"];
  evolution: string[];
  verdict: string;
  verdictColor: string;
  advice: string;
};

function totalReps(exercise: GymExercise) {
  return exercise.sets.reduce((total, set) => {
    const reps = typeof set.reps === "number" && Number.isFinite(set.reps) ? set.reps : 0;
    return total + reps;
  }, 0);
}

function averageWeight(exercise: GymExercise) {
  const weights = exercise.sets
    .map((set) => set.weight)
    .filter(
      (weight): weight is number =>
        typeof weight === "number" && Number.isFinite(weight) && weight > 0
    );

  return weights.length > 0
    ? weights.reduce((total, weight) => total + weight, 0) / weights.length
    : 0;
}

/**
 * Le moteur de verdict historique. La sélection des occurrences est désormais
 * réalisée en amont par l'identité canonique ; ce moteur ne rapproche aucun nom.
 */
export function compareExerciseOccurrences(
  previousExercise: GymExercise,
  currentExercise: GymExercise
): ExerciseComparison {
  const previousReps = totalReps(previousExercise);
  const currentReps = totalReps(currentExercise);
  const previousWeight = averageWeight(previousExercise);
  const currentWeight = averageWeight(currentExercise);
  const repsDiff = currentReps - previousReps;
  const weightDiff = currentWeight - previousWeight;
  const evolution: string[] = [];

  if (repsDiff > 0) {
    evolution.push(`+${repsDiff} répétition${repsDiff > 1 ? "s" : ""}`);
  } else if (repsDiff < 0) {
    evolution.push(`${repsDiff} répétition${Math.abs(repsDiff) > 1 ? "s" : ""}`);
  }

  if (weightDiff > 0) {
    evolution.push(`+${weightDiff.toFixed(1)} kg`);
  } else if (weightDiff < 0) {
    evolution.push(`${weightDiff.toFixed(1)} kg`);
  }

  if (evolution.length === 0) evolution.push("Aucun changement");

  let verdict = "Consolidation";
  let verdictColor = "#3B82F6";
  let advice = "Continue cette charge jusqu'à stabiliser toutes les séries.";

  if (weightDiff > 0 && repsDiff > 0) {
    verdict = "Progression exceptionnelle";
    verdictColor = "#22C55E";
    advice = "Excellent ! Tu progresses simultanément en charge et en répétitions.";
  } else if (weightDiff > 0) {
    verdict = "Charge augmentée";
    verdictColor = "#22C55E";
    advice = "Bonne augmentation de charge. Stabilise-la avant de chercher davantage de répétitions.";
  } else if (weightDiff < 0) {
    verdict = "Charge réduite";
    verdictColor = "#F97316";
    advice = "La charge est plus faible. Vérifie si c'est volontaire (fatigue, reprise ou technique).";
  } else if (repsDiff >= 5) {
    verdict = "Excellente progression";
    verdictColor = "#22C55E";
    advice = "Tu peux envisager une légère augmentation de charge.";
  } else if (repsDiff >= 2) {
    verdict = "Bonne progression";
    verdictColor = "#22C55E";
    advice = "Très bonne progression. Continue encore une ou deux séances avant d'augmenter la charge.";
  } else if (repsDiff === 1) {
    verdict = "Légère progression";
    verdictColor = "#22C55E";
    advice = "Petit progrès, reste régulier.";
  } else if (repsDiff < 0) {
    verdict = "Léger recul";
    verdictColor = "#FACC15";
    advice = "Ce n'est pas inquiétant. Analyse le sommeil, la récupération et la fatigue.";
  }

  return {
    name: currentExercise.name,
    previousSets: previousExercise.sets,
    currentSets: currentExercise.sets,
    evolution,
    verdict,
    verdictColor,
    advice,
  };
}
