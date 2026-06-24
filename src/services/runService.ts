import { supabase } from "../lib/supabase";
import type { Run } from "../types/Run";

const TABLE = "runs";

export async function getRuns(): Promise<Run[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Erreur getRuns :", error);
    return [];
  }

  return (
    data?.map((run) => ({
      ...run,
      averageHeartRate:
        run.average_heart_rate,
    })) ?? []
  ) as Run[];
}

export async function saveRun(
  run: Run
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .insert({
      id: run.id,
      name: run.name,
      date: run.date,
      distance: run.distance,
      duration: run.duration,
      elevation: run.elevation,

      average_heart_rate:
        run.averageHeartRate,

      type: run.type,

      competitionName:
        run.competitionName,

      location: run.location,

      position: run.position,

      participants:
        run.participants,
    });

  if (error) {
    console.error(
      "Erreur saveRun :",
      error
    );

    alert(JSON.stringify(error));
  }
}

export async function updateRun(
  run: Run
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({
      name: run.name,
      date: run.date,
      distance: run.distance,
      duration: run.duration,
      elevation: run.elevation,

      average_heart_rate:
        run.averageHeartRate,

      type: run.type,

      competitionName:
        run.competitionName,

      location: run.location,

      position: run.position,

      participants:
        run.participants,
    })
    .eq("id", run.id);

  if (error) {
    console.error(
      "Erreur updateRun :",
      error
    );

    alert(JSON.stringify(error));
  }
}

export async function deleteRun(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Erreur deleteRun :",
      error
    );
  }
}

export async function getRunById(
  id: string
): Promise<Run | undefined> {
  const runs = await getRuns();

  return runs.find(
    (run) => run.id === id
  );
}