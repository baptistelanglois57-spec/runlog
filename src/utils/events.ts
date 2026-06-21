import type { Event } from "../types/Event";

export function getNextTraining(events: Event[]) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return events.find((event) => {
    const date = new Date(event.date);

    date.setHours(0, 0, 0, 0);

    return (
      (event.type === "training" ||
        event.type === "gym") &&
      date >= today
    );
  });
}

export function getNextRace(events: Event[]) {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return events.find((event) => {
    const date = new Date(event.date);

    date.setHours(0, 0, 0, 0);

    return (
      event.type === "race" &&
      date >= today
    );
  });
}