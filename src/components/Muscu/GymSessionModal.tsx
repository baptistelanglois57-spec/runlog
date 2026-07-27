import type { GymSession } from "../../types/GymSession";
import { theme } from "../../styles/theme";

type Props = {
  session: GymSession | null;
  onClose: () => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR");
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
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "88vh",
          overflowY: "auto",
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "18px",
          padding: "22px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: theme.colors.primary,
                fontSize: "24px",
              }}
            >
              💪 {session.name}
            </h2>

            <p
              style={{
                marginTop: "6px",
                color: theme.colors.textSecondary,
                fontSize: "14px",
              }}
            >
              📅 {formatDate(session.date)}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: "38px",
              height: "38px",
              border: "none",
              borderRadius: "10px",
              background: theme.colors.primary,
              color: "#000",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            ✕
          </button>
        </div>

        {session.exercises.map((exercise) => (
  <div
    key={exercise.id}
    style={{
      marginBottom: "18px",
      border: `1px solid ${theme.colors.border}`,
      borderRadius: "14px",
      padding: "14px",
      background: theme.colors.background,
    }}
  >
    <h3
      style={{
        margin: 0,
        marginBottom: "12px",
        color: theme.colors.primary,
        fontSize: "18px",
      }}
    >
      🏋️ {exercise.name}
    </h3>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
{exercise.sets.map((set, index) => (
  <div
    key={index}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 12px",
      borderRadius: "10px",
      background: theme.colors.card,
      border: `1px solid ${theme.colors.border}`,
    }}
  >
    <div
      style={{
        fontWeight: 700,
        color: theme.colors.primary,
        minWidth: "38px",
      }}
    >
      S{index + 1}
    </div>

    <div
      style={{
        flex: 1,
        textAlign: "center",
        color: theme.colors.text,
        fontWeight: 500,
      }}
    >
      {set.reps} reps
    </div>

    <div
      style={{
        minWidth: "70px",
        textAlign: "right",
        color: theme.colors.text,
        fontWeight: 700,
      }}
    >
      {set.weight} kg
    </div>
  </div>
))}
    </div>
  </div>
))}
        {session.comment && (
          <div
            style={{
              marginTop: "22px",
              padding: "16px",
              background: theme.colors.background,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "14px",
            }}
          >
            <div
              style={{
                color: theme.colors.primary,
                fontWeight: 700,
                marginBottom: "10px",
                fontSize: "16px",
              }}
            >
              📝 Commentaire
            </div>

            <div
              style={{
                whiteSpace: "pre-wrap",
                color: theme.colors.text,
                lineHeight: 1.5,
                fontSize: "15px",
              }}
            >
              {session.comment}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "22px",
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            background: theme.colors.primary,
            color: "#000",
            fontWeight: 700,
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}