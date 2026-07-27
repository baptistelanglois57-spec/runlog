import { useNavigate } from "react-router-dom";
import type { GymSession } from "../../types/GymSession";
import { theme } from "../../styles/theme";

type Props = {
  session: GymSession;
  onView: (session: GymSession) => void;
  onDelete: (id: string) => void;
};

export default function GymSessionCard({
  session,
  onView,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("fr-FR");
  }

  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "20px",
        padding: "22px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div>
        <h3
          style={{
            margin: 0,
            color: theme.colors.text,
            fontSize: "21px",
          }}
        >
          {session.name}
        </h3>

        <p
          style={{
            marginTop: "8px",
            color: theme.colors.textSecondary,
            fontSize: "15px",
          }}
        >
          📅 {formatDate(session.date)}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={() => onView(session)}
          style={buttonStyle(theme.colors.primary, "#000")}
        >
          👀 Voir
        </button>

        <button
          onClick={() =>
            navigate(`/muscu/edit/${session.id}`)
          }
          style={buttonStyle("#2563EB", "#FFF")}
        >
          ✏️ Modifier
        </button>

        <button
          onClick={() => onDelete(session.id)}
          style={buttonStyle(theme.colors.danger, "#FFF")}
        >
          🗑 Supprimer
        </button>
      </div>
    </div>
  );
}

function buttonStyle(
  background: string,
  color: string
): React.CSSProperties {
  return {
    background,
    color,
    border: "none",
    borderRadius: "12px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "14px",
    transition: "0.2s",
  };
}