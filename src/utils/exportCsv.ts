function calculatePace(
  duration: string,
  distance: number
) {
  if (!duration || !distance) return "";

  const parts = duration.split(":").map(Number);

  let totalSeconds = 0;

  if (parts.length === 3) {
    totalSeconds =
      parts[0] * 3600 +
      parts[1] * 60 +
      parts[2];
  } else {
    totalSeconds =
      parts[0] * 60 +
      parts[1];
  }

  const pace = totalSeconds / distance;

  const minutes = Math.floor(pace / 60);
  const seconds = Math.round(pace % 60);

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}/km`;
}
export function exportRunsToCSV(runs: any[], fileName: string) {
  const headers = [
    "Date",
    "Nom",
    "Type",
    "Distance (km)",
    "Temps",
    "Allure",
    "Dénivelé (m)",
    "BPM",
    "Lieu",
    "Position",
    "Participants",
  ];

  const rows = runs.map((run) => [
    run.date ?? "",
    run.name ?? "",
    run.type ?? "",
    run.distance ?? "",
    run.duration ?? "",
   calculatePace(
  run.duration,
  run.distance
),
    run.elevation ?? "",
    run.averageHeartRate ?? "",
    run.location ?? "",
    run.position ?? "",
    run.participants ?? "",
  ]);

  const csv = [
    headers.join(";"),
    ...rows.map((row) => row.join(";")),
  ].join("\n");

  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = fileName;

  link.click();

  URL.revokeObjectURL(url);
}