import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Dumbbell,
  Flag,
  Gauge,
  Heart,
  MapPin,
  Mountain,
  Pencil,
  PersonStanding,
  Route,
  Trash2,
  Trophy,
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
  const TypeIcon = run.type === "race" ? Flag : run.type === "gym" ? Dumbbell : PersonStanding;
  const isTrail = run.surface ? run.surface === "trail" : run.elevation >= 100;

  return (
    <article className={`history-run-card history-run-card--${run.type}`}>
      <header className="history-run-card__header">
        <div className="history-run-card__identity">
          <span className="history-run-card__type-icon" aria-hidden="true">
            <TypeIcon size={16} strokeWidth={2.25} />
          </span>
          <div className="history-run-card__copy">
            <h3>{run.name.replace(/^[^\p{L}\p{N}]+\s*/u, "")}</h3>
            <time className="history-run-card__date">
              <CalendarDays size={13} strokeWidth={2.15} />
              {formatDate(run.date)}
            </time>
          </div>
        </div>

        <div className="history-run-card__distance">
          <strong>{run.distance.toFixed(1)}</strong>
          <span>km</span>
        </div>
      </header>

      <div className="history-run-card__metrics">
        <MiniStat icon={<Clock3 size={15} color={theme.colors.primary} />} value={run.duration} />
        <MiniStat
          icon={<Gauge size={15} color={theme.colors.primary} />}
          value={getAveragePace(run.distance, run.duration)}
        />
        <MiniStat icon={<Mountain size={15} color={theme.colors.primary} />} value={`${run.elevation} m`} />
        <MiniStat
          icon={<Heart size={15} color="#ef4444" />}
          value={run.averageHeartRate ? `${run.averageHeartRate}` : "--"}
        />
      </div>

      {run.type === "race" && (
        <div className="history-run-card__race-metrics">
          {run.location && <MiniStat icon={<MapPin size={15} color={theme.colors.primary} />} value={run.location} />}
          {run.position !== undefined && run.participants !== undefined && (
            <MiniStat icon={<Trophy size={15} color={theme.colors.primary} />} value={`${run.position} / ${run.participants}`} />
          )}
          {run.competitionName && <MiniStat icon={<Flag size={15} color={theme.colors.primary} />} value={run.competitionName} />}
        </div>
      )}

      {showActions && onDelete && (
        <footer className="history-run-card__footer">
          <span className="history-run-card__surface">
            <Route size={15} strokeWidth={2.2} />
            {isTrail ? "Trail" : "Route"}
          </span>

          <div className="history-run-card__actions">
            <button
              onClick={() => navigate(`/edit/${run.id}`)}
              className="history-run-card__action history-run-card__action--edit"
              aria-label="Modifier cette sortie"
              title="Modifier"
            >
              <Pencil size={17} />
            </button>

            <button
              onClick={() => onDelete(run.id)}
              className="history-run-card__action history-run-card__action--delete"
              aria-label="Supprimer cette sortie"
              title="Supprimer"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </footer>
      )}
    </article>
  );
}

type MiniStatProps = {
  icon: ReactNode;
  value: string;
};

function MiniStat({ icon, value }: MiniStatProps) {
  return (
    <div className="history-mini-stat">
      <span className="history-mini-stat__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="history-mini-stat__value">{value}</span>
    </div>
  );
}
