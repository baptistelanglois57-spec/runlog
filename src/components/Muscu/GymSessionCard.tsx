import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";

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
          alignItems: "center",
          gap: "18px",
        }}
      >
        <Eye
          size={22}
          color="#ffffff"
          strokeWidth={2.2}
          style={{ cursor: "pointer" }}
          onClick={() => onView(session)}
        />

        <Pencil
          size={22}
          color="#ffffff"
          strokeWidth={2.2}
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate(`/muscu/edit/${session.id}`)
          }
        />

        <Trash2
          size={22}
          color="#ffffff"
          strokeWidth={2.2}
          style={{ cursor: "pointer" }}
          onClick={() => onDelete(session.id)}
        />
      </div>
    </div>
  );
}