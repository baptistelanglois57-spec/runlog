export interface ForecastInput {
  distance: number;

  elevation: number;

  surface: "road" | "trail";

  objective: "training" | "race";
}

export type ForecastStatus = "ok" | "insufficient" | "invalid";

export type ForecastModelLevel = "rich" | "medium" | "limited" | "none";

export interface ForecastBacktest {
  sampleSize: number;
  meanAbsoluteErrorMinutes: number | null;
  meanAbsolutePercentageError: number | null;
}

export interface ForecastResult {
  status: ForecastStatus;

  estimatedTime: number | null;

  estimatedPace: number | null;

  estimatedHeartRate: number | null;

  plausibleTimeMin: number | null;

  plausibleTimeMax: number | null;

  confidence: number;

  usedRuns: number;

  usedRaces: number;

  reliableRuns: number;

  excludedRuns: number;

  modelLevel: ForecastModelLevel;

  reasons: string[];

  backtest: ForecastBacktest;
}
