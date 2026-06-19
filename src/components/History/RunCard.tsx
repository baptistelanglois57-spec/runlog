import { useNavigate } from "react-router-dom";

import { theme } from "../../styles/theme";

import { formatDate } from "../../utils/date";
import { getAveragePace } from "../../utils/stats";

import type { Run } from "../../types/Run";

type RunCardProps = {
  run: Run;
  onDelete: (id: string) => void;
};

export default function RunCard({
  run,
  onDelete,
}: RunCardProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "22px",
        padding: "24px",
        boxShadow: theme.shadow.card,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "22px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: theme.colors.text,
            }}
          >
            {run.type === "training"
              ? "🏃"
              : "🏁"}{" "}
            {run.name}
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: theme.colors.textSecondary,
            }}
          >
            📅 {formatDate(run.date)}
          </p>
        </div>

        <div
          style={{
            color: theme.colors.primary,
            fontWeight: 700,
            fontSize: "22px",
          }}
        >
          {run.distance.toFixed(2)} km
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: "18px",
        }}
      >
        <Info
          title="⏱ Temps"
          value={run.duration}
        />

        <Info
          title="⚡ Allure"
          value={getAveragePace(
            run.distance,
            run.duration
          )}
        />

        <Info
          title="⛰ D+"
          value={`${run.elevation} m`}
        />

        {run.type === "race" && (
          <>
            {run.location && (
              <Info
                title="📍 Lieu"
                value={run.location}
              />
            )}

            {run.position !== undefined &&
              run.participants !==
                undefined && (
                <Info
                  title="🏆 Classement"
                  value={`${run.position} / ${run.participants}`}
                />
              )}

            {run.competitionName && (
              <Info
                title="🏁 Compétition"
                value={run.competitionName}
              />
            )}
          </>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginTop: "26px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() =>
            navigate(`/edit/${run.id}`)
          }
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          ✏ Modifier
        </button>

        <button
          onClick={() => onDelete(run.id)}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          🗑 Supprimer
        </button>
      </div>
    </div>
  );
}

type InfoProps = {
  title: string;
  value: string;
};

function Info({
  title,
  value,
}: InfoProps) {
  return (
    <div>
      <p
        style={{
          color: theme.colors.textSecondary,
          marginBottom: "6px",
        }}
      >
        {title}
      </p>

      <strong>{value}</strong>
    </div>
  );
}