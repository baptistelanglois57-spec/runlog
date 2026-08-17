import { supabase } from "../lib/supabase";
import type { GymSession } from "../types/GymSession";

const TABLE = "gym_sessions";

export async function getGymSessions(): Promise<GymSession[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Erreur getGymSessions :", error);
    return [];
  }

  return (data ?? []) as GymSession[];
}

export async function saveGymSession(
  session: GymSession
): Promise<void> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      id: session.id,
      date: session.date,
      name: session.name,
      exercises: session.exercises,
      comment: session.comment,
    })
    .select();

  console.log("INSERT :", data);

  if (error) {
    console.error("Erreur saveGymSession :", error);
    throw error;
  }
}

export async function updateGymSession(
  session: GymSession
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({
      date: session.date,
      name: session.name,
      exercises: session.exercises,
      comment: session.comment,
    })
    .eq("id", session.id);

  if (error) {
    console.error("Erreur updateGymSession :", error);
  }
}

export async function deleteGymSession(
  id: string
): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erreur deleteGymSession :", error);
    return false;
  }

  return true;
}

export async function getGymSessionById(
  id: string
): Promise<GymSession | undefined> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur getGymSessionById :", error);
    return undefined;
  }

  return data as GymSession;
}
