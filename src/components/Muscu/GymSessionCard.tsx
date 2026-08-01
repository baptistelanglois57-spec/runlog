import { useNavigate } from "react-router-dom";

import {
  Calendar,
  Dumbbell,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import type { GymSession } from "../../types/GymSession";

import PageCard from "../Layout/PageCard";

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
    return new Date(date).toLocaleDateString(
      "fr-FR"
    );
  }

  const totalSets =
    session.exercises.reduce(
      (total, exercise) =>
        total + exercise.sets.length,
      0
    );

  return (
    <PageCard maxWidth="100%">
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 14,
          gap: 12,
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
              color:
                theme.colors.textSecondary,
              fontSize: 13,
              marginBottom: 6,
            }}
          >
            <Calendar
              size={14}
              color={
                theme.colors.primary
              }
            />

            {formatDate(session.date)}
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 19,
              fontWeight: 800,
              color:
                theme.colors.text,
            }}
          >
            {session.name}
          </h2>
        </div>

        <div
          style={{
            textAlign: "right",
          }}
        >
          <div
            style={{
              color:
                theme.colors.primary,
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            {session.exercises.length}
          </div>

          <div
            style={{
              color:
                theme.colors.textSecondary,
              fontSize: 12,
            }}
          >
            exercices
          </div>
        </div>
      </div>

      {/* Stats */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2,1fr)",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: 12,
            borderRadius: 14,
            background:
              "rgba(255,255,255,.02)",
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <Dumbbell
            size={18}
            color={
              theme.colors.primary
            }
          />

          <div>
            <div
              style={{
                fontSize: 12,
                color:
                  theme.colors.textSecondary,
              }}
            >
              Exercices
            </div>

            <div
              style={{
                fontWeight: 700,
              }}
            >
              {session.exercises.length}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: 12,
            borderRadius: 14,
            background:
              "rgba(255,255,255,.02)",
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <Dumbbell
            size={18}
            color={
              theme.colors.primary
            }
          />

          <div>
            <div
              style={{
                fontSize: 12,
                color:
                  theme.colors.textSecondary,
              }}
            >
              Séries
            </div>

            <div
              style={{
                fontWeight: 700,
              }}
            >
              {totalSets}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 16,
        }}
      >
        <button
          onClick={() =>
            onView(session)
          }
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color:
              theme.colors.primary,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Eye size={18} />
        </button>

        <button
          onClick={() =>
            navigate(
              `/muscu/edit/${session.id}`
            )
          }
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color:
              theme.colors.primary,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() =>
            onDelete(session.id)
          }
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color:
              theme.colors.danger,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </PageCard>
  );
}