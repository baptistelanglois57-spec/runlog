import { getRuns } from "../services/storage";

import {
  getLongestRun,
  getHighestElevation,
  getBestPace,
  getBestDistanceRecord,
} from "../utils/records";

import { getAveragePace } from "../utils/stats";
import { formatDate } from "../utils/date";
import { theme } from "../styles/theme";


export default function Records() {
  const runs = getRuns();

  const longestRun = getLongestRun(runs);
  const highestElevation = getHighestElevation(runs);
  const bestPace = getBestPace(runs);

  const best5k = getBestDistanceRecord(runs, 5);

  const best10k = getBestDistanceRecord(runs, 10);

  const bestSemi = getBestDistanceRecord(runs, 21.1);

  const bestMarathon = getBestDistanceRecord(runs, 42.2);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        color: theme.colors.text,
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: theme.colors.primary,
          marginBottom: "40px",
          fontSize: "42px",
        }}
      >
        🏆 Records
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "24px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Plus longue sortie */}

        <RecordCard
          icon="🔥"
          title="Plus longue sortie"
          value={
            longestRun
              ? `${longestRun.distance} km`
              : "-"
          }
          subtitle={
            longestRun
              ? formatDate(longestRun.date)
              : ""
          }
        />

        {/* Dénivelé */}

        <RecordCard
          icon="⛰"
          title="Plus gros dénivelé"
          value={
            highestElevation
              ? `${highestElevation.elevation} m`
              : "-"
          }
          subtitle={
            highestElevation
              ? highestElevation.name
              : ""
          }
        />

        {/* Rythme */}

        <RecordCard
          icon="⚡"
          title="Meilleur rythme"
          value={
            bestPace
              ? getAveragePace(
                  bestPace.distance,
                  bestPace.duration
                )
              : "-"
          }
          subtitle={
            bestPace
              ? bestPace.name
              : ""
          }
        />
        <RecordCard
  icon="🏃"
  title="Record 5 km"
  value={best5k ? best5k.duration : "Aucun"}
  subtitle={best5k ? best5k.name : ""}
/>

<RecordCard
  icon="🏃"
  title="Record 10 km"
  value={best10k ? best10k.duration : "Aucun"}
  subtitle={best10k ? best10k.name : ""}
/>

<RecordCard
  icon="🏃"
  title="Semi-marathon"
  value={bestSemi ? bestSemi.duration : "Aucun"}
  subtitle={bestSemi ? bestSemi.name : ""}
/>

<RecordCard
  icon="🏃"
  title="Marathon"
  value={bestMarathon ? bestMarathon.duration : "Aucun"}
  subtitle={bestMarathon ? bestMarathon.name : ""}
/>
      </div>
    </main>
  );
}

type RecordCardProps = {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
};

function RecordCard({
  icon,
  title,
  value,
  subtitle,
}: RecordCardProps) {
  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.primary}`,
        borderRadius: "20px",
        padding: "25px",
        boxShadow: theme.shadow.card,
      }}
    >
      <div
        style={{
          fontSize: "34px",
          marginBottom: "15px",
        }}
      >
        {icon}
      </div>

      <h2
        style={{
          margin: 0,
          marginBottom: "15px",
          color: theme.colors.text,
        }}
      >
        {title}
      </h2>

      <div
        style={{
          fontSize: "42px",
          fontWeight: "bold",
          color: theme.colors.primary,
        }}
      >
        {value}
      </div>

      <p
        style={{
          marginTop: "15px",
          color: theme.colors.textSecondary,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}