import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDailyScheduleMessage,
  getDailyScheduleDedupeKey,
  getParisDateTime,
  type DailyScheduleEvent,
} from "../supabase/functions/_shared/dailySchedule.ts";

function event(overrides: Partial<DailyScheduleEvent> = {}): DailyScheduleEvent {
  return {
    id: crypto.randomUUID(),
    date: "2026-08-14",
    time: "18:00",
    type: "training",
    name: "EF 7 km",
    ...overrides,
  };
}

test("Europe/Paris : le même jour local est calculé à 00:02 comme à 00:12", () => {
  const at0002 = new Date("2026-08-13T22:02:00.000Z");
  const at0012 = new Date("2026-08-13T22:12:00.000Z");
  const lateMorning = new Date("2026-08-14T09:30:00.000Z");

  assert.deepEqual(getParisDateTime(at0002), {
    dateKey: "2026-08-14",
    hour: 0,
    minute: 2,
  });
  assert.deepEqual(getParisDateTime(at0012), {
    dateKey: "2026-08-14",
    hour: 0,
    minute: 12,
  });
  assert.deepEqual(getParisDateTime(lateMorning), {
    dateKey: "2026-08-14",
    hour: 11,
    minute: 30,
  });
});

test("Europe/Paris : minuit hiver tient compte du changement d'heure", () => {
  const now = new Date("2026-12-10T23:04:00.000Z");
  assert.deepEqual(getParisDateTime(now), {
    dateKey: "2026-12-11",
    hour: 0,
    minute: 4,
  });
});

test("les événements sont classés par heure puis les heures absentes", () => {
  const message = buildDailyScheduleMessage([
    event({ name: "Musculation", type: "gym", time: "20:00" }),
    event({ name: "Sans heure", time: null }),
    event({ name: "Course EF", time: "08:00" }),
  ]);

  assert.equal(
    message,
    "Course EF — 08:00\nMusculation — 20:00\nSans heure — heure non renseignée"
  );
});

test("une compétition est identifiable sans emoji ni donnée inventée", () => {
  assert.equal(
    buildDailyScheduleMessage([event({ type: "race", name: "Trail de Nancy", time: "09:00" })]),
    "Compétition · Trail de Nancy — 09:00"
  );
});

test("une heure SQL est normalisée sans secondes et une heure absente reste explicite", () => {
  const message = buildDailyScheduleMessage([
    { id: "1", date: "2026-08-14", time: "18:30:00", type: "training", name: "EF" },
    { id: "2", date: "2026-08-14", time: null, type: "gym", name: "Musculation" },
  ]);

  assert.equal(message, "EF — 18:30\nMusculation — heure non renseignée");
});

test("la clé quotidienne est stable et prête pour une future authentification", () => {
  assert.equal(
    getDailyScheduleDedupeKey("2026-08-14"),
    "daily-schedule:2026-08-14:anonymous"
  );
  assert.equal(
    getDailyScheduleDedupeKey("2026-08-14", "athlete-1"),
    "daily-schedule:2026-08-14:athlete-1"
  );
});
