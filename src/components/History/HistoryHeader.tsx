import { theme } from "../../styles/theme";

type HistoryHeaderProps = {
  totalRuns: number;
  totalDistance: number;
};

export default function HistoryHeader({
  totalRuns,
  totalDistance,
}: HistoryHeaderProps) {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto 35px",
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "22px",
        padding: "28px",
        boxShadow: theme.shadow.card,
        textAlign: "center",
      }}
    >
      <h1
        style={{
          margin: 0,
          color: theme.colors.primary,
          fontSize: "38px",
        }}
      >
        📖 Historique
      </h1>

      <p
        style={{
          marginTop: "18px",
          color: theme.colors.textSecondary,
          fontSize: "18px",
        }}
      >
        {totalRuns} sortie
        {totalRuns > 1 ? "s" : ""}
      </p>

      <h2
        style={{
          marginTop: "10px",
          marginBottom: 0,
          color: theme.colors.text,
          fontSize: "34px",
        }}
      >
        {totalDistance.toFixed(1)} km
      </h2>

      <p
        style={{
          marginTop: "8px",
          color: theme.colors.textSecondary,
        }}
      >
        Distance totale parcourue
      </p>
    </div>
  );
}