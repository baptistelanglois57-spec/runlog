import { theme } from "../../styles/theme";

import type { Event } from "../../types/Event";

import PrimaryButton from "../UI/PrimaryButton";
import SecondaryButton from "../UI/SecondaryButton";

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
      {/* HEADER */}

      <div
        style={{
          textAlign: "center",
          marginBottom: 18,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: theme.colors.text,
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          {icon} {title}
        </h2>

        <div
          style={{
            marginTop: 6,
            color: theme.colors.textSecondary,
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          📅 {displayDate}
        </div>
      </div>

      {/* NOM */}

      <div
        style={{
          background: theme.colors.background,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 16,
          padding: 16,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            color: theme.colors.primary,
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Nom
        </div>

        <div
          style={{
            color: theme.colors.text,
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          {event.name}
        </div>
      </div>

      {/* NOTES */}

      <div
        style={{
          background: theme.colors.background,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            color: theme.colors.primary,
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Notes
        </div>

        <div
          style={{
            color: theme.colors.text,
            lineHeight: 1.5,
            minHeight: 40,
            whiteSpace: "pre-wrap",
          }}
        >
          {event.notes?.trim()
            ? event.notes
            : "Aucune note"}
        </div>
      </div>

      {/* ACTIONS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <PrimaryButton onClick={onEdit}>
          Modifier
        </PrimaryButton>

        <button
          onClick={onDelete}
          style={{
            height: 52,

            border: "none",

            borderRadius: 14,

            background: "#d14334",

            color: "#fff",

            fontWeight: 700,

            fontSize: 16,

            cursor: "pointer",
          }}
        >
          Supprimer
        </button>
      </div>

      <SecondaryButton
        onClick={onClose}
        style={{
          width: "100%",
        }}
      >
        Fermer
      </SecondaryButton>
    </div>
  );
}