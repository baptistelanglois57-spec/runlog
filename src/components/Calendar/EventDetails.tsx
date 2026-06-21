import { theme } from "../../styles/theme";

import type { Event } from "../../types/Event";

type EventDetailsProps = {
  event: Event;

  onEdit: () => void;

  onDelete: () => void;

  onClose: () => void;
};

export default function EventDetails({
  event,
  onEdit,
  onDelete,
  onClose,
}: EventDetailsProps) {
  const displayDate = new Date(event.date).toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const icon =
  event.type === "training"
    ? "🏃"
    : event.type === "gym"
    ? "💪"
    : "🏁";

const title =
  event.type === "training"
    ? "Entraînement"
    : event.type === "gym"
    ? "Salle"
    : "Course";

  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          marginTop: 0,
          marginBottom: "10px",
          color: theme.colors.primary,
          fontSize: "28px",
        }}
      >
        {icon} {title}
      </h2>

      <p
        style={{
          textAlign: "center",
          color: theme.colors.textSecondary,
          marginBottom: "28px",
        }}
      >
        📅 {displayDate}
      </p>

      {/* Carte */}

      <div
        style={{
          background: theme.colors.background,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            color: theme.colors.primary,
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          🏷️ Nom
        </div>

        <div
          style={{
            fontSize: "18px",
            marginBottom: "20px",
          }}
        >
          {event.name}
        </div>

        <div
          style={{
            color: theme.colors.primary,
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          📝 Notes
        </div>

        <div
          style={{
            minHeight: "90px",
            whiteSpace: "pre-wrap",
            color: theme.colors.text,
            lineHeight: 1.5,
          }}
        >
          {event.notes || "Aucune note"}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
        }}
      >
        <button
          onClick={onEdit}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: theme.colors.primary,
            color: "#000",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ✏️ Modifier
        </button>

        <button
          onClick={onDelete}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "#c0392b",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          🗑️ Supprimer
        </button>
      </div>

      <button
        onClick={onClose}
        style={{
          width: "100%",
          marginTop: "15px",
          padding: "12px",
          borderRadius: "12px",
          border: `1px solid ${theme.colors.border}`,
          background: "transparent",
          color: theme.colors.text,
          cursor: "pointer",
        }}
      >
        Fermer
      </button>
    </div>
  );
}