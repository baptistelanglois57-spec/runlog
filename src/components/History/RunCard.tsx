import { useNavigate } from "react-router-dom";

import { formatDate } from "../../utils/date";
import { getAveragePace } from "../../utils/stats";

import type { Run } from "../../types/Run";

import PageCard from "../Layout/PageCard";

import Button from "../UI/Button";
import Stat from "../UI/Stat";

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
    <PageCard maxWidth="100%">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
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
              opacity: 0.7,
            }}
          >
            📅 {formatDate(run.date)}
          </p>
        </div>

        <h2
          style={{
            margin: 0,
          }}
        >
          {run.distance.toFixed(2)} km
        </h2>
      </div>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "12px",
    marginTop: "10px",
  }}
>
  <Stat
    icon="⏱"
    title="Temps"
    value={run.duration}
  />

  <Stat
    icon="⚡"
    title="Allure"
    value={getAveragePace(
      run.distance,
      run.duration
    )}
  />

  <Stat
    icon="⛰"
    title="D+"
    value={`${run.elevation} m`}
  />

  {run.averageHeartRate && (
    <Stat
      icon="❤️"
      title="BPM"
      value={`${run.averageHeartRate} bpm`}
    />
  )}

  {run.type === "race" && (
    <>
      {run.location && (
        <Stat
          icon="📍"
          title="Lieu"
          value={run.location}
        />
      )}

      {run.position !== undefined &&
        run.participants !==
          undefined && (
          <Stat
            icon="🏆"
            title="Classement"
            value={`${run.position} / ${run.participants}`}
          />
        )}

      {run.competitionName && (
        <Stat
          icon="🏁"
          title="Compétition"
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
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  }}
>
  <Button
    variant="primary"
    onClick={() =>
      navigate(`/edit/${run.id}`)
    }
  >
    ✏ Modifier
  </Button>

  <Button
    variant="danger"
    onClick={() =>
      onDelete(run.id)
    }
  >
    🗑 Supprimer
  </Button>
</div>
    </PageCard>
  );
}