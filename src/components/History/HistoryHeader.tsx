import { theme } from "../../styles/theme";
import { UI } from "../../styles/ui";

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
        margin: "0 auto",

        background: theme.colors.card,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: UI.RADIUS,

        padding: 18,

        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          margin: 0,

          textAlign: "center",

          color: theme.colors.text,

          fontSize: "38px",

          fontWeight: 800,
        }}
      >
        Historique
      </h1>

      <div
        style={{
          display: "grid",

          gridTemplateColumns: "repeat(2,1fr)",

          gap: 14,

          marginTop: 18,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,.02)",

            border: `1px solid ${theme.colors.border}`,

            borderRadius: 14,

            padding: 14,

            textAlign: "center",
          }}
        >
          <div
            style={{
              color: theme.colors.textSecondary,

              fontSize: 12,

              fontWeight: 600,

              marginBottom: 6,
            }}
          >
            Distance
          </div>

          <div
            style={{
              color: theme.colors.text,

              fontSize: 26,

              fontWeight: 800,

              lineHeight: 1,
            }}
          >
            {totalDistance.toFixed(1)}
          </div>

          <div
            style={{
              color: theme.colors.primary,

              fontSize: 13,

              fontWeight: 700,

              marginTop: 4,
            }}
          >
            km
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,.02)",

            border: `1px solid ${theme.colors.border}`,

            borderRadius: 14,

            padding: 14,

            textAlign: "center",
          }}
        >
          <div
            style={{
              color: theme.colors.textSecondary,

              fontSize: 12,

              fontWeight: 600,

              marginBottom: 6,
            }}
          >
            Sorties
          </div>

          <div
            style={{
              color: theme.colors.text,

              fontSize: 26,

              fontWeight: 800,

              lineHeight: 1,
            }}
          >
            {totalRuns}
          </div>

          <div
            style={{
              color: theme.colors.primary,

              fontSize: 13,

              fontWeight: 700,

              marginTop: 4,
            }}
          >
            séance{totalRuns > 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}