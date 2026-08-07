import type { GymExercise } from "../types/Gym/GymExercise";

export type ExerciseComparison = {
  name: string;

  previousSets: {
    reps?: number;
    weight?: number;
  }[];

  currentSets: {
    reps?: number;
    weight?: number;
  }[];

  evolution: string[];

  verdict: string;

  verdictColor: string;

  advice: string;
};

export function normalizeExerciseName(
  name: string
) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-z0-9\s]/g,
      " "
    )
    .replace(
      /\b(de|du|des|la|le|les|a|au|aux|avec|sur|en|et)\b/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => {
      if (
        word.length > 3 &&
        word.endsWith("s")
      ) {
        return word.slice(0, -1);
      }

      return word;
    })
    .sort()
    .join(" ");
}

function totalReps(
  exercise: GymExercise
) {
  return exercise.sets.reduce(
    (total, set) =>
      total + (set.reps ?? 0),
    0
  );
}

function averageWeight(
  exercise: GymExercise
) {
  const weights = exercise.sets
    .map((s) => s.weight ?? 0)
    .filter((w) => w > 0);

  if (weights.length === 0) {
    return 0;
  }

  return (
    weights.reduce(
      (a, b) => a + b,
      0
    ) / weights.length
  );
}
export function compareExercises(
  previousExercises: GymExercise[],
  currentExercises: GymExercise[]
): ExerciseComparison[] {
  return currentExercises.map(
    (currentExercise) => {
      const previousExercise =
        previousExercises.find(
          (exercise) =>
            normalizeExerciseName(
              exercise.name
            ) ===
            normalizeExerciseName(
              currentExercise.name
            )
        );

      //
      // Nouvel exercice
      //

      if (!previousExercise) {
        return {
          name: currentExercise.name,

          previousSets: [],

          currentSets:
            currentExercise.sets,

          evolution: [
            "🆕 Nouvel exercice",
          ],

          verdict:
            "🆕 Nouvel exercice",

          verdictColor:
            "#3B82F6",

          advice:
            "Conservez cette charge pendant plusieurs séances afin d'établir une base de progression.",
        };
      }

      const previousReps =
        totalReps(previousExercise);

      const currentReps =
        totalReps(currentExercise);

      const previousWeight =
        averageWeight(
          previousExercise
        );

      const currentWeight =
        averageWeight(
          currentExercise
        );

      const repsDiff =
        currentReps -
        previousReps;

      const weightDiff =
        currentWeight -
        previousWeight;

      const evolution: string[] =
        [];

      if (repsDiff > 0) {
        evolution.push(
          `+${repsDiff} répétition${
            repsDiff > 1 ? "s" : ""
          }`
        );
      }

      if (repsDiff < 0) {
        evolution.push(
          `${repsDiff} répétition${
            Math.abs(repsDiff) > 1
              ? "s"
              : ""
          }`
        );
      }

      if (weightDiff > 0) {
        evolution.push(
          `+${weightDiff.toFixed(
            1
          )} kg`
        );
      }

      if (weightDiff < 0) {
        evolution.push(
          `${weightDiff.toFixed(
            1
          )} kg`
        );
      }

      if (
        evolution.length === 0
      ) {
        evolution.push(
          "Aucun changement"
        );
      }

      let verdict =
        "🔵 Consolidation";

      let verdictColor =
        "#3B82F6";

      let advice =
        "Continue cette charge jusqu'à stabiliser toutes les séries.";

      //
      // Progression exceptionnelle
      //

      if (
        weightDiff > 0 &&
        repsDiff > 0
      ) {
        verdict =
          "⭐ Progression exceptionnelle";

        verdictColor =
          "#22C55E";

        advice =
          "Excellent ! Tu progresses simultanément en charge et en répétitions.";
      }

      //
      // Charge augmentée
      //

      else if (
        weightDiff > 0
      ) {
        verdict =
          "🟢 Charge augmentée";

        verdictColor =
          "#22C55E";

        advice =
          "Bonne augmentation de charge. Stabilise-la avant de chercher davantage de répétitions.";
      }

      //
      // Charge réduite
      //

      else if (
        weightDiff < 0
      ) {
        verdict =
          "🟠 Charge réduite";

        verdictColor =
          "#F97316";

        advice =
          "La charge est plus faible. Vérifie si c'est volontaire (fatigue, reprise ou technique).";
      }

      //
      // Même charge
      //

      else if (
        repsDiff >= 5
      ) {
        verdict =
          "🟢 Excellente progression";

        verdictColor =
          "#22C55E";

        advice =
          "Tu peux envisager une légère augmentation de charge.";
      }

      else if (
        repsDiff >= 2
      ) {
        verdict =
          "🟢 Bonne progression";

        verdictColor =
          "#22C55E";

        advice =
          "Très bonne progression. Continue encore une ou deux séances avant d'augmenter la charge.";
      }

      else if (
        repsDiff === 1
      ) {
        verdict =
          "🟢 Légère progression";

        verdictColor =
          "#22C55E";

        advice =
          "Petit progrès, reste régulier.";
      }

      else if (
        repsDiff < 0
      ) {
        verdict =
          "🟡 Léger recul";

        verdictColor =
          "#FACC15";

        advice =
          "Ce n'est pas inquiétant. Analyse le sommeil, la récupération et la fatigue.";
      }

      return {
        name:
          currentExercise.name,

        previousSets:
          previousExercise.sets,

        currentSets:
          currentExercise.sets,

        evolution,

        verdict,

        verdictColor,

        advice,
      };
    }
  );
}