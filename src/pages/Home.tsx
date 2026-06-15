import Header from "../components/Header";
import StatsCard from "../components/StatsCard";

import { getRuns } from "../services/storage";

import {
  getWeekDistance,
  getMonthDistance,
  getYearDistance,
} from "../utils/stats";

export default function Home() {
  const runs = getRuns();

  const weekDistance = getWeekDistance(runs);
  const monthDistance = getMonthDistance(runs);
  const yearDistance = getYearDistance(runs);

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
      </div>
    </main>
  );
}