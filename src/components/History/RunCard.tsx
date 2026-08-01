import type { ReactNode } from "react";

import { useNavigate } from "react-router-dom";

import {
  Clock3,
  Gauge,
  Mountain,
  Heart,
  Pencil,
  Trash2,
} from "lucide-react";

import { formatDate } from "../../utils/date";
import { getAveragePace } from "../../utils/stats";

import type { Run } from "../../types/Run";

import PageCard from "../Layout/PageCard";

import { theme } from "../../styles/theme";

type RunCardProps = {
  run: Run;
  onDelete?: (id: string) => void;
  showActions?: boolean;
};

export default function RunCard({
  run,
  onDelete,
  showActions = true,
}: RunCardProps) {
  const navigate = useNavigate();

  return (
    <PageCard maxWidth="100%">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: theme.colors.textSecondary,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {formatDate(run.date)}
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: 800,
            color: theme.colors.text,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {run.type === "training"
            ? "🏃"
            : "🏁"}{" "}
          {run.name}
        </div>

        <div
          style={{
            textAlign: "right",
            color: theme.colors.primary,
            fontWeight: 800,
            fontSize: 22,
            whiteSpace: "nowrap",
          }}
        >
          {run.distance.toFixed(1)} km
        </div>
      </div>
      <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(4,minmax(0,1fr))",
    gap: 10,
    marginTop: 6,
  }}
>
  <MiniStat
    icon={
      <Clock3
        size={16}
        color={theme.colors.primary}
      />
    }
    value={run.duration}
  />

  <MiniStat
    icon={
      <Gauge
        size={16}
        color={theme.colors.primary}
      />
    }
    value={getAveragePace(
      run.distance,
      run.duration
    )}
  />

  <MiniStat
    icon={
      <Mountain
        size={16}
        color={theme.colors.primary}
      />
    }
    value={`${run.elevation} m`}
  />

  <MiniStat
    icon={
      <Heart
        size={16}
        color="#ef4444"
      />
    }
    value={
      run.averageHeartRate
        ? `${run.averageHeartRate}`
        : "--"
    }
  />
</div>

{run.type === "race" && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit,minmax(180px,1fr))",
      gap: 10,
      marginTop: 14,
    }}
  >
    {run.location && (
      <MiniStat
        icon="📍"
        value={run.location}
      />
    )}

    {run.position !== undefined &&
      run.participants !==
        undefined && (
        <MiniStat
          icon="🏆"
          value={`${run.position} / ${run.participants}`}
        />
      )}

    {run.competitionName && (
      <MiniStat
        icon="🏁"
        value={run.competitionName}
      />
    )}
  </div>
)}
{showActions && onDelete && (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 10,
      marginTop: 14,
    }}
  >
    <button
      onClick={() =>
        navigate(`/edit/${run.id}`)
      }
      style={{
        background: "transparent",
        border: "none",
        padding: 4,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        color: theme.colors.primary,
      }}
    >
      <Pencil size={18} />
    </button>

    <button
      onClick={() =>
        onDelete(run.id)
      }
      style={{
        background: "transparent",
        border: "none",
        padding: 4,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        color: "#ef4444",
      }}
    >
      <Trash2 size={18} />
    </button>
  </div>
)}

    </PageCard>
  );
}

type MiniStatProps = {
  icon: ReactNode | string;
  value: string;
};

function MiniStat({
  icon,
  value,
}: MiniStatProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        gap: 8,

        minHeight: 82,

        padding: "12px 8px",

        background:
          theme.colors.background,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: 14,
      }}
    >
      {typeof icon === "string" ? (
        <span
          style={{
            fontSize: 18,
          }}
        >
          {icon}
        </span>
      ) : (
        icon
      )}

      <span
        style={{
          color: theme.colors.text,

          fontSize: 15,

          fontWeight: 700,

          textAlign: "center",

          lineHeight: 1.2,

          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );
}