import {
  Calendar,
  Dumbbell,
  MessageSquare,
  X,
} from "lucide-react";

import Button from "../UI/Button";

import type { GymSession } from "../../types/GymSession";

import { theme } from "../../styles/theme";

type Props = {
  session: GymSession | null;
  onClose: () => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "fr-FR"
  );
}

export default function GymSessionModal({
  session,
  onClose,
}: Props) {
  if (!session) return null;

  return (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 18,
      zIndex: 9999,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxWidth: 520,
        maxHeight: "90vh",
        overflowY: "auto",

        background: theme.colors.card,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: 22,

        padding: 18,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: theme.colors.textSecondary,
              fontSize: 13,
              marginBottom: 6,
            }}
          >
            <Calendar
              size={14}
              color={theme.colors.primary}
            />

            {formatDate(session.date)}
          </div>

          <h2
            style={{
              margin: 0,
              color: theme.colors.text,
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            {session.name}
          </h2>
        </div>

        <button
          onClick={onClose}
          style={{
            width: 38,
            height: 38,
            border: "none",
            background: "transparent",
            color: theme.colors.primary,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <X size={22} />
        </button>
      </div>

      {/* Exercices */}

      {session.exercises.map((exercise) => (
        <div
          key={exercise.id}
          style={{
            marginBottom: 14,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 16,
            padding: 14,
            background: theme.colors.background,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <Dumbbell
              size={17}
              color={theme.colors.primary}
            />

            <h3
              style={{
                margin: 0,
                color: theme.colors.primary,
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              {exercise.name}
            </h3>
          </div>

          {exercise.sets.map((set, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr auto",
                alignItems: "center",

                padding: "11px 0",

                borderTop:
                  index === 0
                    ? "none"
                    : `1px solid ${theme.colors.border}`,
              }}
            >
              <span
                style={{
                  color: theme.colors.primary,
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                S{index + 1}
              </span>

              <span
                style={{
                  textAlign: "center",
                  color: theme.colors.textSecondary,
                  fontSize: 15,
                }}
              >
                {set.reps} reps
              </span>

              <span
                style={{
                  color: theme.colors.text,
                  fontWeight: 700,
                  fontSize: 17,
                }}
              >
                {set.weight} kg
              </span>
            </div>
          ))}
        </div>
      ))}

      {/* Commentaire */}

      {session.comment && (
        <div
          style={{
            marginTop: 8,
            padding: 16,
            borderRadius: 16,
            background: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <MessageSquare
              size={17}
              color={theme.colors.primary}
            />

            <span
              style={{
                color: theme.colors.primary,
                fontWeight: 700,
              }}
            >
              Commentaire
            </span>
          </div>

          <div
            style={{
              whiteSpace: "pre-wrap",
              color: theme.colors.text,
              lineHeight: 1.6,
              fontSize: 14,
            }}
          >
            {session.comment}
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 20,
        }}
      >
        <Button
          variant="primary"
          fullWidth
          onClick={onClose}
        >
          Fermer
        </Button>
      </div>
    </div>
  </div>
);
}