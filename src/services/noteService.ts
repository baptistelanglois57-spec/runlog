import { supabase } from "../lib/supabase";

import type { Note } from "../types/Note";

const TABLE = "notes";

export async function getNotes(): Promise<Note[]> {
  const { data, error } =
    await supabase
      .from(TABLE)
      .select("*")
      .order("createdAt", {
        ascending: false,
      });

  if (error) {
    console.error(error);
    return [];
  }

  return data as Note[];
}

export async function addNote(
  note: Omit<
    Note,
    "id" | "createdAt"
  >
) {
  const { error } =
    await supabase
      .from(TABLE)
      .insert({
        title: note.title,

        content: note.content,

        importantDate:
          note.importantDate,

        createdAt: new Date().toISOString(),
      });

  if (error) {
    console.error(error);
  }
}

export async function updateNote(
  note: Note
) {
  const { error } =
    await supabase
      .from(TABLE)
      .update({
        title: note.title,

        content: note.content,

        importantDate:
          note.importantDate,
      })
      .eq("id", note.id);

  if (error) {
    console.error(error);
  }
}

export async function deleteNote(
  id: string
) {
  const { error } =
    await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);

  if (error) {
    console.error(error);
  }
}