import type { ReactNode } from "react";

import { useNavigate } from "react-router-dom";

import {
  Calendar,
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
    <div className="home-last-run">
      {/* HEADER */}

      <div className="home-last-run__header">
        <div className="home-last-run__identity">
          <div className="home-last-run__name">
            <span>
              {run.type === "training"
                ? "🏃"
                : "🏁"}
            </span>

            <span className="home-last-run__name-text">
              {run.name}
            </span>
          </div>

          <div className="home-last-run__date">
            <Calendar
              size={15}
              color={theme.colors.primary}
            />

            {formatDate(run.date)}
          </div>
        </div>

        <div className="home-last-run__distance">
          {run.distance.toFixed(1)} km
        </div>
      </div>

      {/* STATS */}

      <div className="home-last-run__metrics">
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
        <div className="home-last-run__race-metrics">
          {run.location && (
            <MiniStat
              icon="📍"
              value={run.location}
            />
          )}

          {run.position !== undefined &&
            run.participants !== undefined && (
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
        <div className="home-last-run__actions">
          <button
            onClick={() =>
              navigate(`/edit/${run.id}`)
            }
            className="home-last-run__action home-last-run__action--edit"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() =>
              onDelete(run.id)
            }
            className="home-last-run__action home-last-run__action--delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
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
    <div className="home-mini-stat">
      {typeof icon === "string" ? (
        <span className="home-mini-stat__emoji">
          {icon}
        </span>
      ) : (
        icon
      )}

      <span className="home-mini-stat__value">
        {value}
      </span>
    </div>
  );
}
