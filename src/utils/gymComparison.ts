import type { GymExercise } from "../types/Gym/GymExercise";

export function normalizeExerciseName(
  name: string
) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
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

function getTotalReps(
  exercise: GymExercise
) {
  return exercise.sets.reduce(
    (total, set) =>
      total + (set.reps ?? 0),
    0
  );
}

function getTotalVolume(
  exercise: GymExercise
) {
  return exercise.sets.reduce(
    (total, set) =>
      total +
      (set.reps ?? 0) *
        (set.weight ?? 0),
    0
  );
}

function getAverageWeight(
  exercise: GymExercise
) {
  const weights = exercise.sets
    .map((set) => set.weight ?? 0)
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

function getResultText(
  exercise: GymExercise
) {
  const reps = exercise.sets
    .map((set) => set.reps ?? "-")
    .join(" / ");

  const weight =
    exercise.sets[0]?.weight ?? 0;

  return `${reps} × ${weight} kg`;
}

export function compareExercises(
  previousExercises: GymExercise[],
  currentExercises: GymExercise[]
) {
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

      if (!previousExercise) {
        return {
          name: currentExercise.name,

          status: "new",

          result:
            getResultText(
              currentExercise
            ),

          comparison:
            "🆕 Nouvel exercice",

          verdict: "🔵 Nouveau",

          verdictColor:
            "#3B82F6",

          currentSets:
            currentExercise.sets,
        };
      }

      const previousReps =
        getTotalReps(
          previousExercise
        );

      const currentReps =
        getTotalReps(
          currentExercise
        );

      const previousVolume =
        getTotalVolume(
          previousExercise
        );

      const currentVolume =
        getTotalVolume(
          currentExercise
        );

      const previousWeight =
        getAverageWeight(
          previousExercise
        );

      const currentWeight =
        getAverageWeight(
          currentExercise
        );

      const repsDiff =
        currentReps -
        previousReps;

      const volumeDiff =
        currentVolume -
        previousVolume;

      const weightDiff =
        currentWeight -
        previousWeight;

      let comparison = "➖ Stable";
let verdict = "🟢 Consolidation";
let verdictColor = "#22C55E";

// Double progression
if (weightDiff > 0 && repsDiff > 0) {
  comparison = `⬆️ +${weightDiff.toFixed(
    0
  )} kg et +${repsDiff} répétitions`;

  verdict = "⭐ Progression exceptionnelle";
  verdictColor = "#22C55E";
}

// Charge augmentée
else if (weightDiff > 0) {
  comparison = `⬆️ +${weightDiff.toFixed(
    0
  )} kg (${previousWeight.toFixed(
    0
  )} → ${currentWeight.toFixed(0)} kg)`;

  verdict = "🟢 Charge augmentée";
  verdictColor = "#22C55E";
}

// Charge diminuée
else if (weightDiff < 0) {
  comparison = `⬇️ ${Math.abs(
    weightDiff
  ).toFixed(0)} kg`;

  verdict = "🟠 Charge réduite";
  verdictColor = "#F97316";
}

// Même charge
else {
  if (repsDiff > 0) {
    comparison = `⬆️ +${repsDiff} répétitions`;

    verdict = "🟢 Excellente progression";
    verdictColor = "#22C55E";
  }

  else if (repsDiff < 0) {
    comparison = `⬇️ ${Math.abs(
      repsDiff
    )} répétitions`;

    verdict = "🟡 Léger recul";
    verdictColor = "#FACC15";
  }

  else {
    comparison = "➖ Stable";

    verdict = "🟢 Consolidation";
    verdictColor = "#22C55E";
  }
}

      return {
        name: currentExercise.name,

        status: "matched",

        result:
          getResultText(
            currentExercise
          ),

        comparison,

        verdict,

        verdictColor,

        previousReps,

        currentReps,

        repsDiff,

        previousVolume:
          Math.round(
            previousVolume
          ),

        currentVolume:
          Math.round(
            currentVolume
          ),

        volumeDiff:
          Math.round(
            volumeDiff
          ),

        previousWeight:
          Number(
            previousWeight.toFixed(1)
          ),

        currentWeight:
          Number(
            currentWeight.toFixed(1)
          ),

        weightDiff:
          Number(
            weightDiff.toFixed(1)
          ),

        currentSets:
          currentExercise.sets,
      };
    }
  );
}