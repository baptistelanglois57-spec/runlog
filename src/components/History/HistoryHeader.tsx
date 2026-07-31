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
        width: "100%",
        maxWidth: "660px",
        margin: "0 auto clamp(24px, 5vw, 35px)",

        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "22px",

        padding: "clamp(20px, 5vw, 28px)",

        boxShadow: theme.shadow.card,
        boxSizing: "border-box",

        textAlign: "center",
      }}
    >
      <h1
        style={{
          margin: 0,
          color: theme.colors.primary,
          fontSize: "clamp(30px, 7vw, 38px)",
          lineHeight: 1.2,
        }}
      >
        📖 Historique
      </h1>

      <p
        style={{
          marginTop: "16px",
          color: theme.colors.textSecondary,
          fontSize: "clamp(15px, 4vw, 18px)",
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
          fontSize: "clamp(28px, 6vw, 34px)",
          lineHeight: 1.1,
        }}
      >
        {totalDistance.toFixed(1)} km
      </h2>

      <p
        style={{
          marginTop: "8px",
          marginBottom: 0,
          color: theme.colors.textSecondary,
          fontSize: "clamp(14px, 3.8vw, 16px)",
        }}
      >
        Distance totale parcourue
      </p>
    </div>
  );
}