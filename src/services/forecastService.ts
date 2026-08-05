import {
  getRuns,
} from "./runService";

import {
  getProfile,
  getCurrentWeight,
  getCurrentVo2,
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
    weight,
    vo2,
  ] = await Promise.all([
    getRuns(),
    getProfile(),
    getCurrentWeight(),
    getCurrentVo2(),
  ]);

  return calculateForecast(
    input,
    runs,
    profile,
    weight,
    vo2
  );
}