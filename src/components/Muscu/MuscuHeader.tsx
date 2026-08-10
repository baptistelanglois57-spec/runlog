import { Dumbbell } from "lucide-react";

type Props = {
  totalSessions: number;
};

export default function MuscuHeader({ totalSessions }: Props) {
  return (
    <header className="muscu-header">
      <h1>Muscu</h1>

      <article className="muscu-summary-card">
        <span className="muscu-summary-card__icon" aria-hidden="true">
          <Dumbbell size={18} strokeWidth={2.2} />
        </span>
        <div className="muscu-summary-card__copy">
          <span>Séances</span>
          <strong>
            {totalSessions} <small>enregistrée{totalSessions > 1 ? "s" : ""}</small>
          </strong>
        </div>
      </article>
    </header>
  );
}
