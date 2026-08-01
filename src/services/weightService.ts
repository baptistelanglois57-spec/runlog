import { supabase } from "../lib/supabase";
import type { Weight } from "../types/Weight";

const TABLE = "weights";

export async function getWeights(): Promise<Weight[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error(
      "Erreur getWeights :",
      error
    );

    return [];
  }

  return (data ?? []) as Weight[];
}

export async function saveWeight(
  weight: Weight
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .insert({
      id: weight.id,
      date: weight.date,
      weight: weight.weight,
    });

  if (error) {
    console.error(
      "Erreur saveWeight :",
      error
    );
  }
}

export async function deleteWeight(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Erreur deleteWeight :",
      error
    );
  }
}