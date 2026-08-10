import {
  getRuns,
} from "./runService";

import {
  getProfile,
  getWeightHistory,
  getVo2History,
} from "./athleteService";

import {
  calculateForecast,
} from "../utils/forecast";

import type {
  ForecastInput,
  ForecastResult,
} from "../types/Forecast";

export async function getForecast(
  input: ForecastInput
): Promise<ForecastResult> {
  const [
    runs,
    profile,
    weightHistory,
    vo2History,
  ] = await Promise.all([
    getRuns(),
    getProfile(),
    getWeightHistory(),
    getVo2History(),
  ]);

  return calculateForecast(
    input,
    runs,
    profile,
    weightHistory,
    vo2History
  );
}
