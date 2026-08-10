import { useNavigate } from "react-router-dom";
import { CalendarDays, Dumbbell, Eye, Pencil, Trash2 } from "lucide-react";

import type { GymSession } from "../../types/GymSession";

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
  const totalSets = session.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );

  return (
    <article className="muscu-session-card">
      <header className="muscu-session-card__header">
        <div className="muscu-session-card__identity">
          <span className="muscu-session-card__type-icon" aria-hidden="true">
            <Dumbbell size={16} strokeWidth={2.25} />
          </span>
          <div className="muscu-session-card__copy">
            <h3>{session.name}</h3>
            <time className="muscu-session-card__date">
              <CalendarDays size={13} strokeWidth={2.15} />
              {new Date(session.date).toLocaleDateString("fr-FR")}
            </time>
          </div>
        </div>

        <div className="muscu-session-card__exercise-count">
          <strong>{session.exercises.length}</strong>
          <span>exercices</span>
        </div>
      </header>

      <div className="muscu-session-card__metrics">
        <Metric icon={<Dumbbell size={15} strokeWidth={2.2} />} label="Exercices" value={session.exercises.length} />
        <Metric icon={<Dumbbell size={15} strokeWidth={2.2} />} label="Séries" value={totalSets} />
      </div>

      <footer className="muscu-session-card__footer">
        <div className="muscu-session-card__actions">
          <button
            onClick={() => onView(session)}
            className="muscu-session-card__action muscu-session-card__action--view"
            aria-label="Consulter cette séance"
            title="Consulter"
          >
            <Eye size={17} />
          </button>

          <button
            onClick={() => navigate(`/muscu/edit/${session.id}`)}
            className="muscu-session-card__action muscu-session-card__action--edit"
            aria-label="Modifier cette séance"
            title="Modifier"
          >
            <Pencil size={17} />
          </button>

          <button
            onClick={() => onDelete(session.id)}
            className="muscu-session-card__action muscu-session-card__action--delete"
            aria-label="Supprimer cette séance"
            title="Supprimer"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </footer>
    </article>
  );
}

type MetricProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
};

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="muscu-session-metric">
      <span className="muscu-session-metric__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="muscu-session-metric__copy">
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </div>
  );
}
