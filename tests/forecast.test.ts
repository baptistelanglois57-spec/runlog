import assert from "node:assert/strict";
import test from "node:test";

import { calculateForecast } from "../src/utils/forecast.ts";
import type { ForecastInput } from "../src/types/Forecast.ts";
import type { Run } from "../src/types/Run.ts";

const referenceDate = "2026-08-10";

function run(
  id: string,
  distance: number,
  duration: string,
  date: string,
  overrides: Partial<Run> = {}
): Run {
  return {
    id,
    name: id,
    date,
    distance,
    duration,
    elevation: 0,
    type: "training",
    surface: "road",
    ...overrides,
  };
}

function forecast(input: ForecastInput, runs: Run[]) {
  return calculateForecast(input, runs, null, [], [], { referenceDate });
}

const routeRuns = [
  run("route-5", 5, "00:25:00", "2026-02-01", { type: "race", averageHeartRate: 168 }),
  run("route-8", 8, "00:42:00", "2026-03-10", { averageHeartRate: 154 }),
  run("route-10", 10, "00:52:00", "2026-04-12", { type: "race", averageHeartRate: 171 }),
  run("route-12", 12, "01:05:00", "2026-05-20", { averageHeartRate: 158 }),
  run("route-15", 15, "01:22:00", "2026-06-15", { type: "race", averageHeartRate: 172 }),
  run("route-18", 18, "01:41:00", "2026-07-25", { averageHeartRate: 160 }),
];

const hillyTrailRuns = [
  run("hill-1", 6, "00:38:00", "2026-03-01", { surface: "trail", elevation: 160 }),
  run("hill-2", 8, "00:49:00", "2026-04-01", { surface: "trail", elevation: 220 }),
  run("hill-3", 10, "01:00:00", "2026-05-01", { surface: "trail", elevation: 280 }),
  run("hill-4", 12, "01:14:00", "2026-06-01", { surface: "trail", elevation: 350 }),
  run("hill-5", 14, "01:28:00", "2026-07-01", { surface: "trail", elevation: 420 }),
  run("hill-6", 16, "01:42:00", "2026-08-01", { surface: "trail", elevation: 480 }),
];

test("route: une distance plus longue produit un temps supérieur", () => {
  const tenKm = forecast(
    { distance: 10, elevation: 0, surface: "road", objective: "race" },
    routeRuns
  );
  const twentyKm = forecast(
    { distance: 20, elevation: 0, surface: "road", objective: "race" },
    routeRuns
  );

  assert.equal(tenKm.status, "ok");
  assert.equal(twentyKm.status, "ok");
  assert.ok((twentyKm.estimatedTime ?? 0) > (tenKm.estimatedTime ?? Infinity));
});

test("trail: beaucoup plus de D+ ne peut pas améliorer le chrono", () => {
  const trailRuns = [
    run("trail-1", 10, "01:00:00", "2026-01-10", { surface: "trail", elevation: 100 }),
    run("trail-2", 10, "01:18:00", "2026-02-18", { surface: "trail", elevation: 550 }),
    run("trail-3", 14, "01:32:00", "2026-03-22", { surface: "trail", elevation: 250 }),
    run("trail-4", 14, "02:00:00", "2026-05-03", { surface: "trail", elevation: 900 }),
    run("trail-5", 18, "02:35:00", "2026-06-12", { surface: "trail", elevation: 1_100 }),
    run("trail-6", 20, "02:30:00", "2026-07-20", { surface: "trail", elevation: 500 }),
  ];
  const lowElevation = forecast(
    { distance: 15, elevation: 150, surface: "trail", objective: "race" },
    trailRuns
  );
  const highElevation = forecast(
    { distance: 15, elevation: 1_200, surface: "trail", objective: "race" },
    trailRuns
  );

  assert.equal(lowElevation.status, "ok");
  assert.equal(highElevation.status, "ok");
  assert.ok(
    (highElevation.estimatedTime ?? 0) > (lowElevation.estimatedTime ?? Infinity)
  );

  const steepShort = forecast(
    { distance: 10, elevation: 4_000, surface: "trail", objective: "race" },
    trailRuns
  );
  const steepLong = forecast(
    { distance: 20, elevation: 4_000, surface: "trail", objective: "race" },
    trailRuns
  );

  assert.ok(
    (steepLong.estimatedTime ?? 0) > (steepShort.estimatedTime ?? Infinity)
  );
});

test("route et trail: les historiques restent séparés quand la surface existe", () => {
  const input: ForecastInput = {
    distance: 10,
    elevation: 0,
    surface: "road",
    objective: "race",
  };
  const routeOnly = forecast(input, routeRuns);
  const withUnrelatedTrail = forecast(input, [
    ...routeRuns,
    run("trail-unrelated", 10, "04:00:00", "2026-08-01", {
      surface: "trail",
      elevation: 2_000,
    }),
  ]);

  assert.equal(routeOnly.estimatedTime, withUnrelatedTrail.estimatedTime);
  assert.equal(routeOnly.usedRuns, withUnrelatedTrail.usedRuns);
});

test("trail à faible D+ hors historique: régularisé avec les données route", () => {
  const result = forecast(
    { distance: 10, elevation: 0, surface: "trail", objective: "race" },
    [...routeRuns, ...hillyTrailRuns]
  );

  assert.equal(result.status, "ok");
  assert.ok(
    result.reasons.some((reason) => reason.includes("régularisée par le modèle route"))
  );
  assert.ok(result.usedRuns > hillyTrailRuns.length);
  assert.ok(result.confidence < 48);
});

test("trail limité: courbe distance stable malgré un exposant brut optimiste", () => {
  const distances = [5, 10, 15, 21.1];
  const results = distances.map((distance) =>
    forecast(
      { distance, elevation: 0, surface: "trail", objective: "race" },
      [...routeRuns, ...hillyTrailRuns]
    )
  );
  const times = results.map((result) => result.estimatedTime ?? 0);
  const paces = times.map((time, index) => time / distances[index]);

  assert.ok(times.every((time, index) => index === 0 || time > times[index - 1]));
  assert.ok(
    paces.every((pace, index) => index === 0 || pace >= paces[index - 1] * 0.99)
  );
});

test("historique limité: fallback fini avec confiance plafonnée", () => {
  const result = forecast(
    { distance: 15, elevation: 0, surface: "road", objective: "training" },
    [run("only", 10, "01:00:00", "2026-07-01")]
  );

  assert.equal(result.status, "ok");
  assert.equal(result.modelLevel, "limited");
  assert.ok(Number.isFinite(result.estimatedTime));
  assert.ok(result.confidence <= 48);
});

test("FC absente: aucune fréquence cardiaque artificielle", () => {
  const withoutHeartRate = routeRuns.map((item) => ({
    ...item,
    averageHeartRate: undefined,
  }));
  const result = forecast(
    { distance: 10, elevation: 0, surface: "road", objective: "race" },
    withoutHeartRate
  );

  assert.equal(result.status, "ok");
  assert.equal(result.estimatedHeartRate, null);
});

test("entrée invalide: distance zéro sans NaN ni Infinity", () => {
  const result = forecast(
    { distance: 0, elevation: 0, surface: "road", objective: "race" },
    routeRuns
  );

  assert.equal(result.status, "invalid");
  assert.equal(result.estimatedTime, null);
  assert.equal(result.estimatedPace, null);
});

test("de meilleures performances récentes améliorent la prévision", () => {
  const oldRuns = [
    run("old-1", 8, "00:56:00", "2024-01-01"),
    run("old-2", 10, "01:10:00", "2024-02-01"),
    run("old-3", 12, "01:25:00", "2024-03-01"),
  ];
  const recentRuns = [
    run("recent-1", 8, "00:40:00", "2026-05-01"),
    run("recent-2", 10, "00:50:00", "2026-06-01"),
    run("recent-3", 12, "01:01:00", "2026-07-01"),
  ];
  const input: ForecastInput = {
    distance: 10,
    elevation: 0,
    surface: "road",
    objective: "race",
  };
  const oldForecast = forecast(input, oldRuns);
  const improvedForecast = forecast(input, [...oldRuns, ...recentRuns]);

  assert.ok(
    (improvedForecast.estimatedTime ?? Infinity) <
      (oldForecast.estimatedTime ?? 0)
  );
});

test("backtesting: la cible ne peut pas se prédire elle-même", () => {
  const chronologicalRuns = [
    run("b1", 5, "00:30:00", "2025-01-01"),
    run("b2", 8, "00:48:00", "2025-03-01"),
    run("b3", 10, "00:40:00", "2025-05-01", { type: "race" }),
  ];
  const result = forecast(
    { distance: 10, elevation: 0, surface: "road", objective: "race" },
    chronologicalRuns
  );

  assert.equal(result.backtest.sampleSize, 1);
  assert.ok(Number.isFinite(result.backtest.meanAbsoluteErrorMinutes));
  assert.ok((result.backtest.meanAbsoluteErrorMinutes ?? 0) > 15);
  assert.ok((result.backtest.meanAbsolutePercentageError ?? 0) > 40);
});

test("sorties aberrantes ou invalides: filtrées sans contaminer le résultat", () => {
  const result = forecast(
    { distance: 10, elevation: 0, surface: "road", objective: "training" },
    [
      ...routeRuns,
      run("zero", 0, "00:00:00", "2026-07-01"),
      run("impossible", 10, "00:05:00", "2026-07-02"),
      run("gym", 0, "00:30:00", "2026-07-03", { type: "gym" }),
    ]
  );

  assert.equal(result.status, "ok");
  assert.ok(result.excludedRuns >= 3);
  assert.ok(Number.isFinite(result.estimatedTime));
});
