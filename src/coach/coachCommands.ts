export type CoachCommand =
  | "analyse_week"
  | "analyse_last_run"
  | "analyse_records"
  | "prepare_half"
  | "prepare_training"
  | "unknown";

export function detectCommand(
  question: string
): CoachCommand {
  const q = question.toLowerCase();

  if (
    q.includes("semaine")
  ) {
    return "analyse_week";
  }

  if (
    q.includes("dernière sortie") ||
    q.includes("derniere sortie")
  ) {
    return "analyse_last_run";
  }

  if (
    q.includes("record")
  ) {
    return "analyse_records";
  }

  if (
    q.includes("semi")
  ) {
    return "prepare_half";
  }

  if (
    q.includes("séance") ||
    q.includes("seance")
  ) {
    return "prepare_training";
  }

  return "unknown";
}