import { supabase } from "../lib/supabase";

import type { AthleteProfile } from "../types/AthleteProfile";
import type { WeightEntry } from "../types/WeightEntry";
import type { Vo2Entry } from "../types/V02Entry";

const PROFILE_TABLE = "athlete_profile";
const WEIGHT_TABLE = "weight_history";
const VO2_TABLE = "vo2_history";

//
// PROFIL
//

export async function getProfile(): Promise<AthleteProfile | null> {
  const { data, error } = await supabase
    .from(PROFILE_TABLE)
    .select("*")
    .eq("id", "profile")
    .maybeSingle();

  if (error) {
    console.error(
      "Erreur getProfile :",
      error
    );
    return null;
  }

  return data;
}

export async function saveProfile(
  profile: AthleteProfile
): Promise<void> {
  const { error } = await supabase
    .from(PROFILE_TABLE)
    .upsert(
      {
        ...profile,
        id: "profile",
      },
      {
        onConflict: "id",
      }
    );

  if (error) {
    console.error(
      "Erreur saveProfile :",
      error
    );
  }
}

//
// POIDS
//

export async function getCurrentWeight(): Promise<number> {
  const { data, error } = await supabase
    .from(WEIGHT_TABLE)
    .select("weight")
    .order("date", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return 0;
  }

  return data.weight;
}

export async function getWeightHistory(): Promise<
  WeightEntry[]
> {
  const { data, error } = await supabase
    .from(WEIGHT_TABLE)
    .select("*")
    .order("date", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Erreur getWeightHistory :",
      error
    );
    return [];
  }

  return data;
}

export async function addWeight(
  weight: number
): Promise<void> {
  const { error } = await supabase
    .from(WEIGHT_TABLE)
    .insert({
      date: new Date()
        .toISOString()
        .slice(0, 10),

      weight,
    });

  if (error) {
    console.error(
      "Erreur addWeight :",
      error
    );
  }
}

//
// VO2MAX
//

export async function getCurrentVo2(): Promise<number> {
  const { data, error } = await supabase
    .from(VO2_TABLE)
    .select("vo2max")
    .order("date", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return 0;
  }

  return data.vo2max;
}

export async function getVo2History(): Promise<
  Vo2Entry[]
> {
  const { data, error } = await supabase
    .from(VO2_TABLE)
    .select("*")
    .order("date", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Erreur getVo2History :",
      error
    );
    return [];
  }

  return data;
}

export async function addVo2(
  vo2max: number
): Promise<void> {
  const { error } = await supabase
    .from(VO2_TABLE)
    .insert({
      date: new Date()
        .toISOString()
        .slice(0, 10),

      vo2max,
    });

  if (error) {
    console.error(
      "Erreur addVo2 :",
      error
    );
  }
}