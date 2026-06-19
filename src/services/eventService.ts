import { supabase } from "../lib/supabase";
import type { Event } from "../types/Event";

const TABLE = "events";

export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Erreur getEvents :", error);
    return [];
  }

  return data as Event[];
}

export async function saveEvent(event: Event): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .insert(event);

  if (error) {
    console.error("Erreur saveEvent :", error);
  }
}

export async function updateEvent(event: Event): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({
      date: event.date,
      type: event.type,
      name: event.name,
      notes: event.notes,
    })
    .eq("id", event.id);

  if (error) {
    console.error("Erreur updateEvent :", error);
  }
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur deleteEvent :", error);
  }
}

export async function getEventByDate(
  date: string
): Promise<Event | undefined> {
  const events = await getEvents();

  return events.find((event) => event.date === date);
}

export async function eventExists(
  date: string
): Promise<boolean> {
  const event = await getEventByDate(date);

  return !!event;
}