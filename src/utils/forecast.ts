import type { AthleteProfile } from "../types/AthleteProfile";
import type {
  ForecastBacktest,
  ForecastInput,
  ForecastModelLevel,
  ForecastResult,
} from "../types/Forecast";
import type { Run } from "../types/Run";
import type { Vo2Entry } from "../types/V02Entry";
import type { WeightEntry } from "../types/WeightEntry";

const DAY_MS = 86_400_000;
const RECENCY_HALF_LIFE_DAYS = 180;
const MAX_MODEL_RUNS = 20;
const MAX_BACKTEST_TARGETS = 8;

type PreparedRun = Run & {
  timestamp: number;
  minutes: number;
  pace: number;
  elevationDensity: number;
};

type WeightedRun = {
  run: PreparedRun;
  weight: number;
  distanceSimilarity: number;
  elevationSimilarity: number;
  recency: number;
};

type CorePrediction = {
  time: number;
  heartRate: number | null;
  used: WeightedRun[];
  distanceModel: DistanceExponentModel;
  distanceRegularization: TrailExponentRegularization | null;
  distanceSimilarity: number;
  elevationSimilarity: number;
  recencyScore: number;
  dispersion: number;
  modelLevel: ForecastModelLevel;
  usedFallback: boolean;
  elevationCalibrated: boolean;
  reasons: string[];
};

type DistanceExponentModel = {
  rawExponent: number;
  exponent: number;
  personalized: boolean;
  effectiveSampleSize: number;
  logDistanceVariance: number;
  slopeInformation: number;
  distanceTerrainIndependence: number;
};

type TrailExponentRegularization = {
  rawExponent: number;
  regularizedExponent: number;
  trailWeight: number;
  referenceExponent: number;
};

type TrailRegularization = {
  roadPrediction: CorePrediction;
  trailInfluence: number;
  reason: string;
};

type TrendAdjustment = {
  multiplier: number;
  reasons: string[];
};

export type ForecastOptions = {
  referenceDate?: string | Date;
  skipBacktest?: boolean;
};

type CorePredictionOptions = {
  distanceExponentOverride?: number;
  distanceRegularization?: TrailExponentRegularization | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isFinitePositive(value: number) {
  return Number.isFinite(value) && value > 0;
}

function parseDurationMinutes(duration: string): number | null {
  const parts = duration.split(":").map(Number);

  if (
    (parts.length !== 2 && parts.length !== 3) ||
    parts.some((part) => !Number.isFinite(part) || part < 0) ||
    (parts.length === 3 && (parts[1] >= 60 || parts[2] >= 60)) ||
    (parts.length === 2 && parts[1] >= 60)
  ) {
    return null;
  }

  const minutes =
    parts.length === 3
      ? parts[0] * 60 + parts[1] + parts[2] / 60
      : parts[0] + parts[1] / 60;

  return isFinitePositive(minutes) ? minutes : null;
}

function median(values: number[]) {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function weightedMean(values: number[], weights: number[]) {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  if (!isFinitePositive(totalWeight)) return 0;

  return values.reduce(
    (sum, value, index) => sum + value * weights[index],
    0
  ) / totalWeight;
}

function weightedCorrelation(
  first: number[],
  second: number[],
  weights: number[]
) {
  if (
    first.length < 2 ||
    first.length !== second.length ||
    first.length !== weights.length
  ) {
    return 0;
  }

  const firstMean = weightedMean(first, weights);
  const secondMean = weightedMean(second, weights);
  let covariance = 0;
  let firstVariance = 0;
  let secondVariance = 0;

  for (let index = 0; index < first.length; index += 1) {
    const firstDelta = first[index] - firstMean;
    const secondDelta = second[index] - secondMean;

    covariance += weights[index] * firstDelta * secondDelta;
    firstVariance += weights[index] * firstDelta ** 2;
    secondVariance += weights[index] * secondDelta ** 2;
  }

  if (!isFinitePositive(firstVariance) || !isFinitePositive(secondVariance)) {
    return 0;
  }

  return clamp(
    covariance / Math.sqrt(firstVariance * secondVariance),
    -1,
    1
  );
}

function weightedMedian(values: number[], weights: number[]) {
  if (values.length === 0) return 0;

  const pairs = values
    .map((value, index) => ({ value, weight: weights[index] }))
    .sort((a, b) => a.value - b.value);
  const halfWeight = pairs.reduce((sum, pair) => sum + pair.weight, 0) / 2;
  let cumulative = 0;

  for (const pair of pairs) {
    cumulative += pair.weight;
    if (cumulative >= halfWeight) return pair.value;
  }

  return pairs[pairs.length - 1].value;
}

function effectiveSampleSize(weightedRuns: WeightedRun[]) {
  const totalWeight = weightedRuns.reduce((sum, { weight }) => sum + weight, 0);
  const squaredWeightSum = weightedRuns.reduce(
    (sum, { weight }) => sum + weight ** 2,
    0
  );

  if (!isFinitePositive(totalWeight) || !isFinitePositive(squaredWeightSum)) {
    return 0;
  }

  return totalWeight ** 2 / squaredWeightSum;
}

function weightedLinearRegression(
  x: number[],
  y: number[],
  weights: number[]
): { intercept: number; slope: number } | null {
  if (x.length < 2 || x.length !== y.length || x.length !== weights.length) {
    return null;
  }

  const meanX = weightedMean(x, weights);
  const meanY = weightedMean(y, weights);
  let numerator = 0;
  let denominator = 0;

  for (let index = 0; index < x.length; index += 1) {
    numerator += weights[index] * (x[index] - meanX) * (y[index] - meanY);
    denominator += weights[index] * (x[index] - meanX) ** 2;
  }

  if (!isFinitePositive(denominator)) return null;

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  return Number.isFinite(slope) && Number.isFinite(intercept)
    ? { intercept, slope }
    : null;
}

function prepareReliableRuns(runs: Run[]) {
  const initiallyValid: PreparedRun[] = [];

  for (const run of runs) {
    const minutes = parseDurationMinutes(run.duration);
    const timestamp = new Date(run.date).getTime();
    const distance = Number(run.distance);
    const elevation = Number(run.elevation);

    if (
      run.type === "gym" ||
      !minutes ||
      !Number.isFinite(timestamp) ||
      !isFinitePositive(distance) ||
      distance > 500 ||
      minutes > 14 * 24 * 60 ||
      !Number.isFinite(elevation) ||
      elevation < 0 ||
      elevation > 50_000
    ) {
      continue;
    }

    const pace = minutes / distance;
    const elevationDensity = elevation / distance;

    // Bornes sanitaires très larges : elles écartent les erreurs de saisie,
    // pas les performances atypiques ou les ultras réellement possibles.
    if (
      pace < 1.5 ||
      pace > 40 ||
      elevationDensity > 1_500 ||
      !Number.isFinite(pace)
    ) {
      continue;
    }

    initiallyValid.push({
      ...run,
      distance,
      elevation,
      averageHeartRate:
        typeof run.averageHeartRate === "number" &&
        run.averageHeartRate >= 40 &&
        run.averageHeartRate <= 230
          ? run.averageHeartRate
          : undefined,
      timestamp,
      minutes,
      pace,
      elevationDensity,
    });
  }

  const reliable = initiallyValid.filter((run) => {
    const surfaceRuns = initiallyValid.filter(
      (candidate) => candidate.surface === run.surface
    );

    if (surfaceRuns.length < 8) return true;

    const surfacePaces = surfaceRuns.map((candidate) => candidate.pace);
    const paceMedian = median(surfacePaces);
    const mad = median(surfacePaces.map((pace) => Math.abs(pace - paceMedian)));

    if (mad <= 0) return true;

    const robustDeviation = Math.abs(run.pace - paceMedian) / (1.4826 * mad);
    const paceRatio = run.pace / paceMedian;

    // Une sortie n'est exclue que si deux signaux prudents concordent :
    // écart robuste extrême ET ratio physiologiquement très éloigné du groupe.
    return !(robustDeviation > 8 && (paceRatio < 0.3 || paceRatio > 3.5));
  });

  return {
    runs: reliable,
    excluded: runs.length - reliable.length,
  };
}

function getReferenceTimestamp(referenceDate?: string | Date) {
  if (!referenceDate) return Date.now();

  const timestamp = new Date(referenceDate).getTime();
  return Number.isFinite(timestamp) ? timestamp : Date.now();
}

function recencyWeight(runTimestamp: number, referenceTimestamp: number) {
  const ageDays = Math.max(0, (referenceTimestamp - runTimestamp) / DAY_MS);

  return Math.exp((-Math.LN2 * ageDays) / RECENCY_HALF_LIFE_DAYS);
}

function getIntensityScores(runs: PreparedRun[], profile: AthleteProfile | null) {
  const realHeartRates = runs
    .map((run) => run.averageHeartRate)
    .filter(
      (heartRate): heartRate is number =>
        typeof heartRate === "number" &&
        Number.isFinite(heartRate) &&
        heartRate > 0
    );

  if (realHeartRates.length === 0) return new Map<string, number>();

  const sortedHeartRates = [...realHeartRates].sort((a, b) => a - b);
  const scores = new Map<string, number>();

  for (const run of runs) {
    const heartRate = run.averageHeartRate;
    if (!heartRate || !Number.isFinite(heartRate)) continue;

    const score =
      profile &&
      profile.maxHeartRate > profile.restingHeartRate &&
      profile.restingHeartRate > 0
        ? clamp(
          (heartRate - profile.restingHeartRate) /
            (profile.maxHeartRate - profile.restingHeartRate),
          0,
          1
        )
        : sortedHeartRates.findIndex((value) => value >= heartRate) /
          Math.max(1, sortedHeartRates.length - 1);

    scores.set(run.id, score);
  }

  return scores;
}

function buildWeightedRuns(
  input: ForecastInput,
  candidates: PreparedRun[],
  profile: AthleteProfile | null,
  referenceTimestamp: number
) {
  const intensityScores = getIntensityScores(candidates, profile);
  const targetDensity = input.elevation / input.distance;

  return candidates
    .map((run): WeightedRun => {
      const distanceSimilarity = Math.exp(
        -Math.abs(Math.log(run.distance / input.distance))
      );
      const densityScale = Math.max(30, targetDensity, run.elevationDensity);
      const elevationSimilarity = Math.exp(
        -Math.abs(run.elevationDensity - targetDensity) / densityScale
      );
      const recency = recencyWeight(run.timestamp, referenceTimestamp);
      const competitionReliability = run.type === "race" ? 1.45 : 1;
      const objectiveRelevance =
        input.objective === "race"
          ? run.type === "race"
            ? 1.3
            : intensityScores.has(run.id)
              ? 0.75 + 0.5 * (intensityScores.get(run.id) ?? 0.5)
              : 0.85
          : run.type === "training"
            ? 1.15
            : 1;
      const terrainSimilarity = input.surface === "trail" ? elevationSimilarity : 1;
      const weight =
        recency *
        distanceSimilarity *
        terrainSimilarity *
        competitionReliability *
        objectiveRelevance;

      return {
        run,
        weight,
        distanceSimilarity,
        elevationSimilarity,
        recency,
      };
    })
    .filter((weightedRun) => weightedRun.weight > 0.01)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, MAX_MODEL_RUNS);
}

function estimateDistanceExponent(weightedRuns: WeightedRun[]) {
  const distinctDistances = new Set(
    weightedRuns.map(({ run }) => run.distance.toFixed(2))
  ).size;
  const effectiveRuns = effectiveSampleSize(weightedRuns);
  const logDistances = weightedRuns.map(({ run }) => Math.log(run.distance));
  const weights = weightedRuns.map(({ weight }) => weight);
  const meanLogDistance = weightedMean(logDistances, weights);
  const logDistanceVariance = weightedMean(
    logDistances.map((value) => (value - meanLogDistance) ** 2),
    weights
  );
  const densityValues = weightedRuns.map(
    ({ run }) => run.elevationDensity / 100
  );
  const distanceTerrainIndependence = 1 -
    weightedCorrelation(logDistances, densityValues, weights) ** 2;

  if (weightedRuns.length < 3 || distinctDistances < 3) {
    return {
      rawExponent: 1.06,
      exponent: 1.06,
      personalized: false,
      effectiveSampleSize: effectiveRuns,
      logDistanceVariance,
      slopeInformation: 0,
      distanceTerrainIndependence,
    };
  }

  const regression = weightedLinearRegression(
    logDistances,
    weightedRuns.map(({ run }) => Math.log(run.minutes)),
    weights
  );

  if (!regression) {
    return {
      rawExponent: 1.06,
      exponent: 1.06,
      personalized: false,
      effectiveSampleSize: effectiveRuns,
      logDistanceVariance,
      slopeInformation: 0,
      distanceTerrainIndependence,
    };
  }

  const rawExponent = clamp(regression.slope, 0.85, 1.45);
  const residualVariance = weightedMean(
    weightedRuns.map(
      ({ run }) =>
        (Math.log(run.minutes) -
          (regression.intercept + regression.slope * Math.log(run.distance))) **
        2
    ),
    weights
  );
  const correctedResidualVariance =
    residualVariance *
    (effectiveRuns / Math.max(1, effectiveRuns - 2));
  const slopeInformation = isFinitePositive(correctedResidualVariance)
    ? (effectiveRuns * logDistanceVariance * distanceTerrainIndependence) /
      correctedResidualVariance
    : 0;

  return {
    rawExponent,
    exponent: rawExponent,
    personalized: true,
    effectiveSampleSize: effectiveRuns,
    logDistanceVariance,
    slopeInformation,
    distanceTerrainIndependence,
  };
}

function regularizeTrailDistanceExponent(
  trailPrediction: CorePrediction,
  roadPrediction: CorePrediction
): TrailExponentRegularization | null {
  const trailModel = trailPrediction.distanceModel;
  const roadModel = roadPrediction.distanceModel;

  if (!trailModel.personalized || !roadModel.personalized) return null;

  // L'information d'une pente dépend à la fois de la diversité des distances
  // et du nombre effectif de sorties après pondération, pas du simple volume.
  const trailInformation =
    trailModel.slopeInformation *
    (trailPrediction.elevationCalibrated
      ? 1
      : trailPrediction.elevationSimilarity);
  const roadInformation = roadModel.slopeInformation;

  if (
    !Number.isFinite(trailInformation) ||
    !isFinitePositive(roadInformation) ||
    trailInformation < 0
  ) {
    return null;
  }

  const trailWeight = trailInformation / (trailInformation + roadInformation);
  let regularizedExponent =
    trailModel.rawExponent * trailWeight +
    roadModel.rawExponent * (1 - trailWeight);

  // Un modèle Trail encore en fallback, avec moins d'information que Route,
  // ne peut pas conclure à une endurance meilleure (alpha < 1). Alpha = 1
  // est la référence neutre : allure constante, sans pénalité ajoutée.
  if (
    trailPrediction.usedFallback &&
    trailInformation < roadInformation &&
    trailModel.rawExponent < 1
  ) {
    regularizedExponent = Math.max(1, regularizedExponent);
  }

  return {
    rawExponent: trailModel.rawExponent,
    regularizedExponent,
    trailWeight,
    referenceExponent: roadModel.rawExponent,
  };
}

function estimatePersonalElevationEffect(
  weightedRuns: WeightedRun[],
  distanceExponent: number
) {
  const densityValues = weightedRuns.map(
    ({ run }) => run.elevationDensity / 100
  );
  const densityRange = Math.max(...densityValues) - Math.min(...densityValues);

  if (weightedRuns.length < 5 || densityRange < 0.35) {
    return { coefficient: 0, personalized: false };
  }

  const regression = weightedLinearRegression(
    densityValues,
    weightedRuns.map(
      ({ run }) => Math.log(run.minutes) - distanceExponent * Math.log(run.distance)
    ),
    weightedRuns.map(({ weight }) => weight)
  );

  if (!regression || regression.slope <= 0) {
    return { coefficient: 0, personalized: false };
  }

  return {
    coefficient: clamp(regression.slope, 0, 0.55),
    personalized: true,
  };
}

function estimateHeartRate(weightedRuns: WeightedRun[]) {
  const withHeartRate = weightedRuns.filter(
    ({ run }) =>
      run.averageHeartRate !== undefined &&
      Number.isFinite(run.averageHeartRate) &&
      run.averageHeartRate > 0
  );

  if (withHeartRate.length < 3) return null;

  return Math.round(
    weightedMean(
      withHeartRate.map(({ run }) => run.averageHeartRate as number),
      withHeartRate.map(({ weight }) => weight)
    )
  );
}

function createCorePrediction(
  input: ForecastInput,
  reliableRuns: PreparedRun[],
  profile: AthleteProfile | null,
  referenceTimestamp: number,
  options: CorePredictionOptions = {}
): CorePrediction | null {
  const sameSurfaceRuns = reliableRuns.filter(
    (run) => run.surface === input.surface && run.timestamp <= referenceTimestamp
  );
  let candidates = sameSurfaceRuns;
  let usedFallback = false;
  const reasons: string[] = [];

  if (candidates.length === 0) {
    candidates = reliableRuns.filter((run) => run.timestamp <= referenceTimestamp);
    usedFallback = true;

    if (candidates.length > 0) {
      reasons.push(
        input.surface === "trail"
          ? "Aucune sortie trail disponible : estimation prudente depuis vos sorties route"
          : "Aucune sortie route disponible : estimation prudente depuis votre historique running"
      );
    }
  }

  if (candidates.length === 0) return null;

  const weightedRuns = buildWeightedRuns(
    input,
    candidates,
    profile,
    referenceTimestamp
  );

  if (weightedRuns.length === 0) return null;

  const estimatedDistanceModel = estimateDistanceExponent(weightedRuns);
  const distanceModel: DistanceExponentModel = {
    ...estimatedDistanceModel,
    exponent:
      options.distanceExponentOverride ?? estimatedDistanceModel.exponent,
  };
  const elevationModel = estimatePersonalElevationEffect(
    weightedRuns,
    distanceModel.exponent
  );
  const targetDensity = input.elevation / input.distance / 100;
  const individualTimes = weightedRuns.map(({ run }) => {
    if (elevationModel.personalized) {
      const runDensity = run.elevationDensity / 100;
      // La densité ne doit jamais compenser plus que l'effet de la distance.
      // Cette borne conserve une prévision croissante à D+ identique, y compris
      // sur un parcours exceptionnellement raide.
      const monotonicDensityLimit =
        distanceModel.exponent / elevationModel.coefficient;
      const boundedTargetDensity = Math.min(
        targetDensity,
        monotonicDensityLimit
      );
      const boundedRunDensity = Math.min(runDensity, monotonicDensityLimit);

      return (
        run.minutes *
        (input.distance / run.distance) ** distanceModel.exponent *
        Math.exp(
          elevationModel.coefficient *
            (boundedTargetDensity - boundedRunDensity)
        )
      );
    }

    if (input.surface === "trail" || usedFallback) {
      const targetEffortDistance = input.distance + input.elevation / 100;
      const runEffortDistance = run.distance + run.elevation / 100;

      return (
        run.minutes *
        (targetEffortDistance / runEffortDistance) ** distanceModel.exponent
      );
    }

    return run.minutes * (input.distance / run.distance) ** distanceModel.exponent;
  });
  const weights = weightedRuns.map(({ weight }) => weight);
  const time = weightedMedian(individualTimes, weights);

  if (!isFinitePositive(time)) return null;

  const relativeErrors = individualTimes.map((value) => Math.abs(value / time - 1));
  const dispersion = weightedMean(relativeErrors, weights);
  const recentComparableRuns = weightedRuns.filter(
    ({ run, distanceSimilarity }) =>
      referenceTimestamp - run.timestamp <= 365 * DAY_MS &&
      distanceSimilarity >= 0.5
  ).length;
  const usedRaces = weightedRuns.filter(({ run }) => run.type === "race").length;

  if (recentComparableRuns > 0) {
    reasons.push(
      `${recentComparableRuns} sortie${recentComparableRuns > 1 ? "s" : ""} ${
        input.surface === "trail" ? "trail" : "route"
      } récente${recentComparableRuns > 1 ? "s" : ""} comparable${
        recentComparableRuns > 1 ? "s" : ""
      }`
    );
  }

  if (usedRaces > 0) {
    reasons.push(
      `${usedRaces} compétition${usedRaces > 1 ? "s" : ""} utilisée${
        usedRaces > 1 ? "s" : ""
      }`
    );
  }

  const distanceSimilarity = weightedMean(
    weightedRuns.map((run) => run.distanceSimilarity),
    weights
  );
  const elevationSimilarity = weightedMean(
    weightedRuns.map((run) => run.elevationSimilarity),
    weights
  );

  reasons.push(
    distanceSimilarity >= 0.65
      ? "Distance proche de vos performances enregistrées"
      : "Distance éloignée de vos performances habituelles"
  );

  if (input.surface === "trail") {
    if (elevationModel.personalized) {
      reasons.push("Impact du dénivelé calibré sur vos sorties trail");
    } else {
      reasons.push("Peu de données trail variées : dénivelé estimé avec un fallback prudent");
      usedFallback = true;
    }
  }

  const modelLevel: ForecastModelLevel =
    usedFallback
      ? "limited"
      : weightedRuns.length >= 8 && distanceModel.personalized
      ? "rich"
      : weightedRuns.length >= 3
        ? "medium"
        : "limited";

  return {
    time,
    heartRate: estimateHeartRate(weightedRuns),
    used: weightedRuns,
    distanceModel,
    distanceRegularization: options.distanceRegularization ?? null,
    distanceSimilarity,
    elevationSimilarity,
    recencyScore: weightedMean(
      weightedRuns.map((run) => run.recency),
      weights
    ),
    dispersion,
    modelLevel,
    usedFallback,
    elevationCalibrated: elevationModel.personalized,
    reasons,
  };
}

function createForecastPrediction(
  input: ForecastInput,
  reliableRuns: PreparedRun[],
  profile: AthleteProfile | null,
  referenceTimestamp: number
) {
  const initialPrediction = createCorePrediction(
    input,
    reliableRuns,
    profile,
    referenceTimestamp
  );

  if (!initialPrediction || input.surface !== "trail") {
    return initialPrediction;
  }

  const roadPrediction = createCorePrediction(
    { ...input, surface: "road" },
    reliableRuns,
    profile,
    referenceTimestamp
  );

  if (!roadPrediction) return initialPrediction;

  const regularization = regularizeTrailDistanceExponent(
    initialPrediction,
    roadPrediction
  );

  if (!regularization) return initialPrediction;

  return createCorePrediction(
    input,
    reliableRuns,
    profile,
    referenceTimestamp,
    {
      distanceExponentOverride: regularization.regularizedExponent,
      distanceRegularization: regularization,
    }
  );
}

function getTrailLowElevationRegularization(
  input: ForecastInput,
  trailPrediction: CorePrediction,
  reliableRuns: PreparedRun[],
  profile: AthleteProfile | null,
  referenceTimestamp: number
): TrailRegularization | null {
  if (input.surface !== "trail" || trailPrediction.used.length === 0) {
    return null;
  }

  const trailDensities = trailPrediction.used.map(
    ({ run }) => run.elevationDensity
  );
  const minimumTrailDensity = Math.min(...trailDensities);
  const targetDensity = input.elevation / input.distance;

  // Le modèle route sert uniquement d'ancre lorsqu'on extrapole sous le D+
  // réellement observé en trail. Il ne constitue pas une pénalité trail.
  if (targetDensity >= minimumTrailDensity) return null;

  const roadPrediction = createCorePrediction(
    { ...input, surface: "road" },
    reliableRuns,
    profile,
    referenceTimestamp
  );

  if (!roadPrediction) return null;

  const sampleEvidence = 1 - Math.exp(-effectiveSampleSize(trailPrediction.used) / 6);
  const terrainEvidence = clamp(trailPrediction.elevationSimilarity, 0, 1);
  const calibrationEvidence = trailPrediction.elevationCalibrated ? 1 : 0.5;
  const trailInfluence = clamp(
    sampleEvidence * terrainEvidence * calibrationEvidence,
    0,
    0.9
  );

  return {
    roadPrediction,
    trailInfluence,
    reason: `Aucune sortie trail sous ${Math.round(
      minimumTrailDensity
    )} m D+/km : estimation régularisée par le modèle route`,
  };
}

function getRelativeHistoryTrend<T extends { date: string }>(
  entries: T[],
  valueOf: (entry: T) => number,
  referenceTimestamp: number
) {
  const available = entries
    .filter((entry) => {
      const timestamp = new Date(entry.date).getTime();
      return Number.isFinite(timestamp) && timestamp <= referenceTimestamp;
    })
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  if (available.length < 2) return null;

  const recent = available.filter(
    (entry) => referenceTimestamp - new Date(entry.date).getTime() <= 365 * DAY_MS
  );
  const sample = recent.length >= 2 ? recent : available.slice(-2);
  const firstValue = valueOf(sample[0]);
  const lastValue = valueOf(sample[sample.length - 1]);

  if (!isFinitePositive(firstValue) || !isFinitePositive(lastValue)) return null;

  return clamp(lastValue / firstValue - 1, -0.2, 0.2);
}

function getTrendAdjustment(
  weightHistory: WeightEntry[],
  vo2History: Vo2Entry[],
  referenceTimestamp: number
): TrendAdjustment {
  const vo2Trend = getRelativeHistoryTrend(
    vo2History,
    (entry) => entry.vo2max,
    referenceTimestamp
  );
  const weightTrend = getRelativeHistoryTrend(
    weightHistory,
    (entry) => entry.weight,
    referenceTimestamp
  );
  let relativeAdjustment = 0;
  const reasons: string[] = [];

  if (vo2Trend !== null && Math.abs(vo2Trend) >= 0.005) {
    relativeAdjustment -= vo2Trend * 0.35;
    reasons.push("Tendance de votre VO₂ Max prise en compte");
  }

  if (weightTrend !== null && Math.abs(weightTrend) >= 0.005) {
    relativeAdjustment += weightTrend * 0.2;
    reasons.push("Évolution de votre poids prise en compte");
  }

  return {
    multiplier: 1 + clamp(relativeAdjustment, -0.06, 0.06),
    reasons,
  };
}

function runBacktest(
  surface: ForecastInput["surface"],
  allRuns: Run[],
  profile: AthleteProfile | null,
  weightHistory: WeightEntry[],
  vo2History: Vo2Entry[],
  referenceTimestamp: number
): ForecastBacktest {
  const preparedTargets = prepareReliableRuns(allRuns).runs
    .filter(
      (run) => run.surface === surface && run.timestamp <= referenceTimestamp
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, MAX_BACKTEST_TARGETS);
  const absoluteErrors: number[] = [];
  const percentageErrors: number[] = [];

  for (const target of preparedTargets) {
    // Toutes les observations du modèle sont strictement antérieures à la
    // cible : elle ne peut donc ni se prédire elle-même, ni voir le futur.
    const historicalRuns = allRuns.filter(
      (run) => new Date(run.date).getTime() < target.timestamp
    );
    const historicalPrepared = prepareReliableRuns(historicalRuns).runs;

    if (historicalPrepared.length < 2) continue;

    const prediction = createForecastPrediction(
      {
        distance: target.distance,
        elevation: target.elevation,
        surface: target.surface,
        objective: target.type === "race" ? "race" : "training",
      },
      historicalPrepared,
      profile,
      target.timestamp
    );

    if (!prediction) continue;

    const trailRegularization = getTrailLowElevationRegularization(
      {
        distance: target.distance,
        elevation: target.elevation,
        surface: target.surface,
        objective: target.type === "race" ? "race" : "training",
      },
      prediction,
      historicalPrepared,
      profile,
      target.timestamp
    );
    const baseTime = trailRegularization
      ? prediction.time * trailRegularization.trailInfluence +
        trailRegularization.roadPrediction.time *
          (1 - trailRegularization.trailInfluence)
      : prediction.time;

    const trend = getTrendAdjustment(
      weightHistory,
      vo2History,
      target.timestamp
    );
    const predictedTime = baseTime * trend.multiplier;
    const absoluteError = Math.abs(predictedTime - target.minutes);

    absoluteErrors.push(absoluteError);
    percentageErrors.push((absoluteError / target.minutes) * 100);
  }

  return {
    sampleSize: absoluteErrors.length,
    meanAbsoluteErrorMinutes:
      absoluteErrors.length > 0
        ? absoluteErrors.reduce((sum, value) => sum + value, 0) /
          absoluteErrors.length
        : null,
    meanAbsolutePercentageError:
      percentageErrors.length > 0
        ? percentageErrors.reduce((sum, value) => sum + value, 0) /
          percentageErrors.length
        : null,
  };
}

function calculateConfidence(
  prediction: CorePrediction,
  backtest: ForecastBacktest
) {
  const usedRuns = prediction.used.length;
  const raceCount = prediction.used.filter(({ run }) => run.type === "race").length;
  const countScore = 1 - Math.exp(-usedRuns / 6);
  const raceScore = 1 - Math.exp(-raceCount / 2);
  const terrainScore =
    prediction.used[0]?.run.surface === "trail"
      ? prediction.elevationSimilarity
      : prediction.distanceSimilarity;
  const proximityScore = (prediction.distanceSimilarity + terrainScore) / 2;
  const dispersionScore = 1 - clamp(prediction.dispersion / 0.3, 0, 1);
  const backtestScore =
    backtest.meanAbsolutePercentageError === null
      ? 0
      : 1 - clamp(backtest.meanAbsolutePercentageError / 35, 0, 1);
  const backtestCoverage = clamp(backtest.sampleSize / 5, 0, 1);
  const measurableScore =
    countScore * 0.2 +
    raceScore * 0.1 +
    proximityScore * 0.2 +
    prediction.recencyScore * 0.15 +
    dispersionScore * 0.15 +
    backtestScore * backtestCoverage * 0.2;
  const levelCap =
    prediction.modelLevel === "rich"
      ? 95
      : prediction.modelLevel === "medium"
        ? 78
        : 48;

  return Math.min(levelCap, Math.round(measurableScore * 100));
}

function emptyResult(
  status: ForecastResult["status"],
  reliableRuns: number,
  excludedRuns: number,
  reason: string
): ForecastResult {
  return {
    status,
    estimatedTime: null,
    estimatedPace: null,
    estimatedHeartRate: null,
    plausibleTimeMin: null,
    plausibleTimeMax: null,
    confidence: 0,
    usedRuns: 0,
    usedRaces: 0,
    reliableRuns,
    excludedRuns,
    modelLevel: "none",
    reasons: [reason],
    backtest: {
      sampleSize: 0,
      meanAbsoluteErrorMinutes: null,
      meanAbsolutePercentageError: null,
    },
  };
}

export function calculateForecast(
  input: ForecastInput,
  runs: Run[],
  profile: AthleteProfile | null,
  weightHistory: WeightEntry[],
  vo2History: Vo2Entry[],
  options: ForecastOptions = {}
): ForecastResult {
  const distance = Number(input.distance);
  const elevation = Number(input.elevation);

  if (
    !isFinitePositive(distance) ||
    distance > 500 ||
    !Number.isFinite(elevation) ||
    elevation < 0 ||
    elevation > 50_000
  ) {
    return emptyResult(
      "invalid",
      0,
      0,
      "Distance ou dénivelé invalide : aucune prévision n'a été calculée"
    );
  }

  const normalizedInput: ForecastInput = { ...input, distance, elevation };
  const prepared = prepareReliableRuns(runs);

  if (prepared.runs.length === 0) {
    return emptyResult(
      "insufficient",
      0,
      prepared.excluded,
      "Aucune sortie running fiable n'est disponible pour cette prévision"
    );
  }

  const referenceTimestamp = getReferenceTimestamp(options.referenceDate);
  const prediction = createForecastPrediction(
    normalizedInput,
    prepared.runs,
    profile,
    referenceTimestamp
  );

  if (!prediction) {
    return emptyResult(
      "insufficient",
      prepared.runs.length,
      prepared.excluded,
      "Historique insuffisant pour produire une estimation fiable"
    );
  }

  const trend = getTrendAdjustment(
    weightHistory,
    vo2History,
    referenceTimestamp
  );
  const trailRegularization = getTrailLowElevationRegularization(
    normalizedInput,
    prediction,
    prepared.runs,
    profile,
    referenceTimestamp
  );
  const baseTime = trailRegularization
    ? prediction.time * trailRegularization.trailInfluence +
      trailRegularization.roadPrediction.time *
        (1 - trailRegularization.trailInfluence)
    : prediction.time;
  const estimatedTime = baseTime * trend.multiplier;
  const estimatedPace = estimatedTime / normalizedInput.distance;

  if (!isFinitePositive(estimatedTime) || !isFinitePositive(estimatedPace)) {
    return emptyResult(
      "insufficient",
      prepared.runs.length,
      prepared.excluded,
      "Les données disponibles ne permettent pas de produire un chrono cohérent"
    );
  }

  const backtest = options.skipBacktest
    ? {
        sampleSize: 0,
        meanAbsoluteErrorMinutes: null,
        meanAbsolutePercentageError: null,
      }
    : runBacktest(
        normalizedInput.surface,
        runs,
        profile,
        weightHistory,
        vo2History,
        referenceTimestamp
      );
  const baseConfidence = calculateConfidence(prediction, backtest);
  const confidence = trailRegularization
    ? Math.round(
        baseConfidence * (0.5 + trailRegularization.trailInfluence / 2)
      )
    : baseConfidence;
  const backtestUncertainty =
    backtest.meanAbsolutePercentageError === null
      ? 0
      : backtest.meanAbsolutePercentageError / 100;
  const levelFloor =
    prediction.modelLevel === "rich"
      ? 0.08
      : prediction.modelLevel === "medium"
        ? 0.15
        : 0.25;
  const relativeUncertainty = clamp(
    Math.max(
      levelFloor,
      prediction.dispersion,
      backtestUncertainty,
      trailRegularization
        ? Math.abs(prediction.time - trailRegularization.roadPrediction.time) /
            baseTime
        : 0
    ),
    levelFloor,
    0.45
  );
  const allUsedRuns = trailRegularization
    ? [...prediction.used, ...trailRegularization.roadPrediction.used]
    : prediction.used;
  const uniqueUsedRuns = Array.from(
    new Map(allUsedRuns.map((weightedRun) => [weightedRun.run.id, weightedRun])).values()
  );
  const estimatedHeartRate = trailRegularization
    ? prediction.heartRate !== null &&
      trailRegularization.roadPrediction.heartRate !== null
      ? Math.round(
          prediction.heartRate * trailRegularization.trailInfluence +
            trailRegularization.roadPrediction.heartRate *
              (1 - trailRegularization.trailInfluence)
        )
      : prediction.heartRate ?? trailRegularization.roadPrediction.heartRate
    : prediction.heartRate;

  return {
    status: "ok",
    estimatedTime,
    estimatedPace,
    estimatedHeartRate,
    plausibleTimeMin: estimatedTime * (1 - relativeUncertainty),
    plausibleTimeMax: estimatedTime * (1 + relativeUncertainty),
    confidence,
    usedRuns: uniqueUsedRuns.length,
    usedRaces: uniqueUsedRuns.filter(({ run }) => run.type === "race").length,
    reliableRuns: prepared.runs.length,
    excludedRuns: prepared.excluded,
    modelLevel: prediction.modelLevel,
    reasons: [
      ...prediction.reasons,
      ...(trailRegularization ? [trailRegularization.reason] : []),
      ...trend.reasons,
    ].slice(0, 5),
    backtest,
  };
}
