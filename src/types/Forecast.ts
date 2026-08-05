export interface ForecastInput {
  distance: number;

  elevation: number;

  surface: "road" | "trail";

  objective: "training" | "race";
}

export interface ForecastResult {
  estimatedTime: number;

  estimatedPace: number;

  estimatedHeartRate: number;

  confidence: number;

  analysedRuns: number;

  analysedRaces: number;
}