import Header from "../components/Header";
import StatsCard from "../components/StatsCard";

import { getRuns } from "../services/storage";

import {
  getWeekDistance,
  getMonthDistance,
  getYearDistance,
  getTotalRuns,
  getLastRun,
} from "../utils/stats";

export default function Home() {
  const runs = getRuns();

  const weekDistance = getWeekDistance(runs);
  const monthDistance = getMonthDistance(runs);
  const yearDistance = getYearDistance(runs);
  const totalRuns = getTotalRuns(runs);
  const lastRun = getLastRun(runs);
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#081120",
        color: "white",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Header
        title="🏃 RunLog"
        subtitle="Bonjour Baptiste 👋"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          maxWidth: "900px",
          margin: "40px auto",
        }}
      >
        <StatsCard
          title="Cette semaine"
          value={`${weekDistance.toFixed(2)} km`}
          icon="🏃"
        />

        <StatsCard
          title="Ce mois"
          value={`${monthDistance.toFixed(2)} km`}
          icon="📅"
        />

        <StatsCard
          title="Cette année"
          value={`${yearDistance.toFixed(2)} km`}
          icon="🗓️"
        />

        <StatsCard
  title="Sorties"
  value={`${totalRuns}`}
  icon="🏅"
/>
      </div>
      {lastRun && (
  <div
    style={{
      maxWidth: "900px",
      margin: "20px auto",
      background: "#13213a",
      borderRadius: "16px",
      padding: "25px",
    }}
  >
    <h2
      style={{
        marginBottom: "20px",
      }}
    >
      🔥 Dernière sortie
    </h2>

    <h3>{lastRun.name}</h3>

    <p>📅 {lastRun.date}</p>

    <p>📏 {lastRun.distance} km</p>

    <p>⏱ {lastRun.duration}</p>

    <p>⛰ {lastRun.elevation} m</p>
  </div>
)}
    </main>
  );
}