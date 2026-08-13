import assert from "node:assert/strict";
import test from "node:test";

import type { Event } from "../src/types/Event.ts";
import {
  RACE_REMINDER_LEAD_MS,
  TRAINING_REMINDER_LEAD_MS,
  getEventReminderPlan,
  isFutureEventReminder,
} from "../src/utils/eventReminders.ts";

function event(overrides: Partial<Event> = {}): Event {
  return {
    id: "event-1",
    date: "2030-08-10",
    type: "training",
    name: "Allure Semi",
    notes: "",
    ...overrides,
  };
}

test("séance avec heure : rappel une heure avant et clé stable", () => {
  const plan = getEventReminderPlan(event({ time: "18:00" }));
  assert.ok(plan);
  assert.equal(plan.scheduledAt.getTime(), plan.eventAt.getTime() - TRAINING_REMINDER_LEAD_MS);
  assert.equal(plan.title, "Séance dans 1 h");
  assert.equal(plan.message, "Allure Semi commence à 18:00.");
  assert.match(plan.dedupeKey, /^event-reminder:event-1:training:/);
});

test("compétition sans heure : aucune heure fictive n'est affichée", () => {
  const plan = getEventReminderPlan(event({ type: "race", name: "Trail Villey" }));
  assert.ok(plan);
  assert.equal(plan.scheduledAt.getTime(), plan.eventAt.getTime() - RACE_REMINDER_LEAD_MS);
  assert.equal(plan.title, "Compétition demain");
  assert.equal(plan.hasExplicitTime, false);
  assert.match(plan.message, /^Trail Villey — /);
  assert.doesNotMatch(plan.message, /\d{2}:\d{2}/);
});

test("une modification d'heure produit une nouvelle clé, sans doublonner la même échéance", () => {
  const first = getEventReminderPlan(event({ time: "18:00" }));
  const moved = getEventReminderPlan(event({ time: "19:00" }));
  assert.ok(first && moved);
  assert.notEqual(first.dedupeKey, moved.dedupeKey);
});

test("les événements salle et passés ne sont pas planifiés", () => {
  assert.equal(getEventReminderPlan(event({ type: "gym" })), null);
  const past = getEventReminderPlan(event({ date: "2020-01-01", time: "09:00" }));
  assert.ok(past);
  assert.equal(isFutureEventReminder(past, new Date("2026-01-01T00:00:00")), false);
});
