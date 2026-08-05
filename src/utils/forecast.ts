import type { Run } from "../types/Run";
import type { AthleteProfile } from "../types/AthleteProfile";
import type {
  ForecastInput,
  ForecastResult,
} from "../types/Forecast";

function durationToMinutes(
  duration: string
) {
  const parts = duration
    .split(":")
    .map(Number);

  if (parts.length === 3) {
    return (
      parts[0] * 60 +
      parts[1] +
      parts[2] / 60
    );
  }

  return (
    parts[0] +
    parts[1] / 60
  );
}

export function calculateForecast(
  input: ForecastInput,
  runs: Run[],
  _profile: AthleteProfile | null,
  currentWeight: number,
  currentVo2: number
): ForecastResult {
  //
  // Km effort demandé
  //

  const requestedEffort =
    input.distance +
    input.elevation / 100;

  //
// Sélection des sorties
//

let usableRuns: Run[] = [];

//
// Prévision Route
//

if (input.surface === "road") {
  usableRuns = runs.filter(
    (run) =>
      run.type !== "gym" &&
      run.surface === "road"
  );
}

//
// Prévision Trail
//

else {
  usableRuns = runs.filter(
    (run) => run.type !== "gym"
  );
}

  const analysedRuns =
    usableRuns.filter(
      (run) =>
        run.type === "training"
    ).length;

  const analysedRaces =
    usableRuns.filter(
      (run) =>
        run.type === "race"
    ).length;

  if (
    usableRuns.length === 0
  ) {
    return {
      estimatedTime: 0,
      estimatedPace: 0,
      estimatedHeartRate: 0,
      confidence: 0,
      analysedRuns,
      analysedRaces,
    };
  }

  //
  // Préparation des sorties
  //

  const comparableRuns =
    usableRuns
      .map((run) => {
        const effort =
          run.distance +
          run.elevation / 100;

        const minutes =
          durationToMinutes(
            run.duration
          );

        return {
          ...run,

          effort,

          minutes,

          pace:
            minutes /
            run.distance,

          difference:
            Math.abs(
              effort -
                requestedEffort
            ),
        };
      })

      //
      // Les plus proches
      //

      .sort(
        (a, b) =>
          a.difference -
          b.difference
      )

      //
      // On garde les 10
      //

      .slice(0, 10);
        //
  // Pondération
  //

  let totalWeight = 0;

  let paceSum = 0;

  let heartRateSum = 0;

  comparableRuns.forEach(
    (run, index) => {
        let weight = 1;
  //
// Même surface = priorité
//

if (
  run.surface === input.surface
) {
  weight *= 1.5;
}

//
// En prévision trail,
// les sorties route
// gardent une petite influence.
//

if (
  input.surface === "trail" &&
  run.surface === "road"
) {
  weight *= 0.35;
}

//
// Plus la sortie est proche,
// plus elle devient importante.
//

if (run.difference <= 0.30) {
  weight *= 10;
} else if (
  run.difference <= 0.75
) {
  weight *= 7;
} else if (
  run.difference <= 1.5
) {
  weight *= 5;
} else if (
  run.difference <= 3
) {
  weight *= 3;
}

      //
      // Les compétitions
      // comptent davantage
      //

      if (
        run.type === "race"
      ) {
        weight *= 2;
      }

      //
      // Les sorties récentes
      // comptent un peu plus
      //

      weight +=
        (10 - index) * 0.15;

      totalWeight += weight;

      paceSum +=
        run.pace * weight;

      heartRateSum +=
        (run.averageHeartRate ??
          150) * weight;
    });

  //
  // Allure de référence
  //

  let estimatedPace =
    paceSum / totalWeight;

  //
  // FC de référence
  //

  let estimatedHeartRate =
    heartRateSum /
    totalWeight;
      //
  // Correction VO₂max
  //

  if (currentVo2 > 0) {
    estimatedPace -=
      (currentVo2 - 40) *
      0.025;
  }

  //
  // Correction poids
  //

  if (currentWeight > 0) {
    estimatedPace +=
      (currentWeight - 70) *
      0.012;
  }

  //
  // Objectif
  //

  if (
    input.objective ===
    "race"
  ) {
    estimatedPace -= 0.05;

    estimatedHeartRate += 6;
  }

  //
  // Ajustement du dénivelé
  //
  // Il influence seulement l'allure,
  // pas la distance.
  //

  estimatedPace +=
    (input.elevation / 100) *
    0.18;

  //
  // Le trail est légèrement
  // plus lent que la route
  //

  if (
    input.surface ===
    "trail"
  ) {
    estimatedPace += 0.12;
  }

  //
  // Temps final
  // (distance réelle)
  //

  const estimatedTime =
    estimatedPace *
    input.distance;

  //
  // Allure finale
  //

  estimatedPace =
    estimatedTime /
    input.distance;

  //
  // FC estimée
  //

  estimatedHeartRate =
    Math.round(
      estimatedHeartRate
    );

  estimatedHeartRate =
    Math.max(
      120,
      Math.min(
        190,
        estimatedHeartRate
      )
    );
      //
  // Confiance
  //

  let confidence = 35;

  //
  // Nombre de sorties comparables
  //

  confidence += Math.min(
    comparableRuns.length * 4,
    40
  );

  //
  // Les compétitions
  //

  confidence += Math.min(
    analysedRaces * 3,
    12
  );

  //
  // VO₂ renseignée
  //

  if (currentVo2 > 0) {
    confidence += 5;
  }

  //
  // Poids renseigné
  //

  if (currentWeight > 0) {
    confidence += 5;
  }

  //
  // Qualité des sorties trouvées
  //

  const averageDifference =
    comparableRuns.reduce(
      (sum, run) =>
        sum + run.difference,
      0
    ) / comparableRuns.length;

  if (averageDifference <= 0.5) {
    confidence += 12;
  } else if (
    averageDifference <= 1
  ) {
    confidence += 8;
  } else if (
    averageDifference <= 2
  ) {
    confidence += 5;
  }

  confidence = Math.min(
    Math.round(confidence),
    99
  );

  //
  // Résultat
  //

  return {
    estimatedTime,

    estimatedPace,

    estimatedHeartRate,

    confidence,

    analysedRuns,

    analysedRaces,
  };
}