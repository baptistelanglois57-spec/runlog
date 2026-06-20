import { theme } from "../../styles/theme";

type Props = {
  title?: string;
  date?: string;
  subtitle?: string;
};

export default function NextTrainingCard({
  title = "Aucun entraînement",
  date = "Non planifié",
}: Props) {
  return (
    <div
      style={{
        flex: 1,
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "20px",
        padding: "22px",
        boxShadow: theme.shadow.card,
        cursor: "pointer",
        transition: "0.2s",
        minHeight: "145px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "36px",
            marginBottom: "12px",
          }}
        >
          🏃
        </div>

        <h3
          style={{
            margin: 0,
            color: theme.colors.text,
            fontSize: "25px",
          }}
        >
          Prochain Entraînement
        </h3>
      </div>

      <div>
        <h2
          style={{
            margin: "16px 0 8px",
            color: theme.colors.primary,
            fontSize: "22px",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            margin: "16px 0 8px",
            color: theme.colors.text,
            fontWeight: 600,
          }}
        >
          📅 {date}
        </p>

        <p
          style={{
            marginTop: "10px",
            color: theme.colors.textSecondary,
          }}
        >
        </p>
      </div>
    </div>
  );
}