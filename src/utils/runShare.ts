import type { Run } from "../types/Run";
import { theme } from "../styles/theme";
import { getAveragePace } from "./stats";

export type RunSharePresentation = {
  distance: string;
  duration: string;
  pace: string;
  elevation: string | null;
  heartRate: string | null;
  activity: string;
  activityKind: string;
  surface: string | null;
  date: string;
  competitionName: string | null;
  ranking: string | null;
};

function formatLongDate(value: string) {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly ? new Date(`${value}T12:00:00`) : new Date(value);

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function cleanActivityName(value: string) {
  return value.replace(/^[^\p{L}\p{N}]+\s*/u, "").trim();
}

export function getRunSharePresentation(run: Run): RunSharePresentation {
  const ranking =
    run.position !== undefined && run.participants !== undefined
      ? `${run.position} / ${run.participants}`
      : run.position !== undefined
        ? `${run.position}`
        : run.participants !== undefined
          ? `${run.participants} participants`
          : null;

  return {
    distance: run.distance.toFixed(2),
    duration: run.duration,
    pace: getAveragePace(run.distance, run.duration).replace(" /km", "/km"),
    elevation: Number.isFinite(run.elevation) ? `${run.elevation} m` : null,
    heartRate: run.averageHeartRate ? `${run.averageHeartRate} bpm` : null,
    activity: cleanActivityName(run.name),
    activityKind: run.type === "race" ? "Compétition" : "Entraînement",
    surface: run.surface === "road" ? "Route" : run.surface === "trail" ? "Trail" : null,
    date: formatLongDate(run.date),
    competitionName: run.type === "race" && run.competitionName ? run.competitionName : null,
    ranking: run.type === "race" ? ranking : null,
  };
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function drawFittedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number
) {
  if (context.measureText(text).width <= maxWidth) {
    context.fillText(text, x, y);
    return;
  }

  let shortened = text;
  while (shortened.length > 1 && context.measureText(`${shortened}…`).width > maxWidth) {
    shortened = shortened.slice(0, -1);
  }
  context.fillText(`${shortened}…`, x, y);
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Le logo RunLog n'a pas pu être chargé."));
    image.src = source;
  });
}

export async function createRunShareImage(run: Run) {
  const data = getRunSharePresentation(run);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("La carte de partage ne peut pas être générée sur cet appareil.");
  }

  context.fillStyle = theme.colors.background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  roundedRect(context, 48, 48, 984, 1254, 64);
  context.fillStyle = theme.colors.card;
  context.fill();
  context.strokeStyle = theme.colors.border;
  context.lineWidth = 2;
  context.stroke();

  const logo = await loadImage("/favicon.png");
  context.drawImage(logo, 76, 76, 100, 100);

  context.textBaseline = "middle";
  context.fillStyle = theme.colors.text;
  context.font = "750 42px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText("RunLog", 185, 126);

  context.font = "700 25px -apple-system, BlinkMacSystemFont, sans-serif";
  const kindWidth = context.measureText(data.activityKind).width + 54;
  roundedRect(context, 956 - kindWidth, 92, kindWidth, 68, 34);
  context.fillStyle = "rgba(125, 35, 53, 0.12)";
  context.fill();
  context.fillStyle = theme.colors.primary;
  context.textAlign = "center";
  context.fillText(data.activityKind, 956 - kindWidth / 2, 127);
  context.textAlign = "left";

  context.fillStyle = theme.colors.textSecondary;
  context.font = "700 26px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText("DISTANCE", 84, 270);

  context.fillStyle = theme.colors.text;
  context.font = "780 132px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText(data.distance, 80, 374);
  const distanceWidth = context.measureText(data.distance).width;
  context.fillStyle = theme.colors.primary;
  context.font = "750 38px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText("KM", Math.min(904, 94 + distanceWidth), 399);

  context.fillStyle = theme.colors.border;
  context.fillRect(84, 480, 912, 2);

  const metricColumns = [84, 554];
  const metricLabels = ["DURÉE", "ALLURE MOYENNE"];
  const metricValues = [data.duration, data.pace];
  for (let index = 0; index < metricColumns.length; index += 1) {
    context.fillStyle = theme.colors.textSecondary;
    context.font = "700 24px -apple-system, BlinkMacSystemFont, sans-serif";
    context.fillText(metricLabels[index], metricColumns[index], 558);
    context.fillStyle = theme.colors.text;
    context.font = "750 58px -apple-system, BlinkMacSystemFont, sans-serif";
    drawFittedText(context, metricValues[index], metricColumns[index], 628, 410);
  }

  const secondaryMetrics = [
    data.heartRate ? { label: "FC MOYENNE", value: data.heartRate, accent: "#ef6464" } : null,
    data.elevation ? { label: "DÉNIVELÉ +", value: data.elevation, accent: theme.colors.primary } : null,
  ].filter((metric): metric is { label: string; value: string; accent: string } => metric !== null);

  secondaryMetrics.forEach((metric, index) => {
    const cardWidth = secondaryMetrics.length === 1 ? 912 : 444;
    const x = 84 + index * 468;
    roundedRect(context, x, 715, cardWidth, 142, 28);
    context.fillStyle = theme.colors.surfaceSecondary;
    context.fill();
    context.strokeStyle = theme.colors.border;
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = metric.accent;
    context.font = "700 22px -apple-system, BlinkMacSystemFont, sans-serif";
    context.fillText(metric.label, x + 30, 760);
    context.fillStyle = theme.colors.text;
    context.font = "750 38px -apple-system, BlinkMacSystemFont, sans-serif";
    context.fillText(metric.value, x + 30, 815);
  });

  if (data.competitionName || data.ranking) {
    roundedRect(context, 84, 895, 912, 122, 27);
    context.fillStyle = "rgba(125, 35, 53, 0.08)";
    context.fill();
    context.strokeStyle = "rgba(125, 35, 53, 0.25)";
    context.stroke();
    context.fillStyle = theme.colors.primary;
    context.font = "700 22px -apple-system, BlinkMacSystemFont, sans-serif";
    context.fillText("COMPÉTITION", 114, 933);
    context.fillStyle = theme.colors.text;
    context.font = "750 31px -apple-system, BlinkMacSystemFont, sans-serif";
    drawFittedText(context, data.competitionName ?? data.activity, 114, 978, 590);
    if (data.ranking) {
      context.textAlign = "right";
      context.fillText(data.ranking, 964, 978);
      context.textAlign = "left";
    }
  }

  const footerY = data.competitionName || data.ranking ? 1110 : 1018;
  context.fillStyle = theme.colors.text;
  context.font = "750 42px -apple-system, BlinkMacSystemFont, sans-serif";
  drawFittedText(context, data.activity, 84, footerY, 850);
  context.fillStyle = theme.colors.textSecondary;
  context.font = "600 28px -apple-system, BlinkMacSystemFont, sans-serif";
  context.fillText(data.date, 84, footerY + 62);
  if (data.surface) {
    context.textAlign = "right";
    context.fillText(data.surface, 996, footerY + 62);
    context.textAlign = "left";
  }

  context.fillStyle = theme.colors.primary;
  roundedRect(context, 84, 1230, 110, 8, 4);
  context.fill();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("La carte de partage n'a pas pu être créée."));
    }, "image/png");
  });
}
