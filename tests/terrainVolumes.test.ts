import assert from "node:assert/strict";
import test from "node:test";

import type { Run } from "../src/types/Run.ts";
import { getTerrainVolumes } from "../src/utils/stats.ts";

function run(id: string, surface: "road" | "trail", date: string, distance: number, elevation: number): Run {
  return {
    id,
    name: id,
    date,
    distance,
    duration: "01:00:00",
    elevation,
    type: "training",
    surface,
  };
}

test("les volumes Route et Trail reposent sur le terrain réel", () => {
  const runs = [
    run("road", "road", "2026-08-02", 10, 80),
    run("trail", "trail", "2026-08-03", 8.5, 420),
    { ...run("legacy", "road", "2026-08-04", 6, 0), surface: undefined } as unknown as Run,
  ];
  const volumes = getTerrainVolumes(runs, "total", new Date("2026-08-10"));

  assert.deepEqual(volumes.road, { count: 1, distance: 10, elevation: 80 });
  assert.deepEqual(volumes.trail, { count: 1, distance: 8.5, elevation: 420 });
  assert.deepEqual(volumes.unknown, { count: 1, distance: 6, elevation: 0 });
  assert.deepEqual(volumes.total, { count: 3, distance: 24.5, elevation: 500 });
});

test("les périodes mois et année ne recalculent pas des totaux incompatibles", () => {
  const runs = [
    run("current", "road", "2026-08-02", 10, 80),
    run("year", "trail", "2026-02-02", 8, 300),
    run("past", "trail", "2025-08-02", 12, 500),
  ];
  const reference = new Date("2026-08-10T12:00:00");

  assert.equal(getTerrainVolumes(runs, "month", reference).total.count, 1);
  assert.equal(getTerrainVolumes(runs, "year", reference).total.count, 2);
  assert.equal(getTerrainVolumes(runs, "total", reference).total.count, 3);
});
