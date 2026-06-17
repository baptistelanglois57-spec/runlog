import type { Event } from "../types/Event";

const STORAGE_KEY = "runlog_events";

export function getEvents(): Event[] {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export function saveEvent(event: Event) {
  const events = getEvents();

  events.push(event);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(events)
  );
}

export function updateEvent(updatedEvent: Event) {
  const events = getEvents();

  const updatedEvents = events.map((event) =>
    event.id === updatedEvent.id ? updatedEvent : event
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedEvents)
  );
}

export function deleteEvent(id: number) {
  const events = getEvents();

  const filteredEvents = events.filter(
    (event) => event.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filteredEvents)
  );
}

export function getEventById(id: number): Event | undefined {
  return getEvents().find(
    (event) => event.id === id
  );
}

export function getEventByDate(date: string): Event | undefined {
  return getEvents().find(
    (event) => event.date === date
  );
}