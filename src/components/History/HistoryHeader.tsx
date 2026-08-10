import { Route, Trophy } from "lucide-react";

type HistoryHeaderProps = {
  totalRuns: number;
  totalDistance: number;
};

export default function HistoryHeader({
  totalRuns,
  totalDistance,
}: HistoryHeaderProps) {
  return (
    <header className="history-header">
      <h1>Historique</h1>

      <div className="history-header__summary">
        <article className="history-summary-card">
          <span className="history-summary-card__icon" aria-hidden="true">
            <Route size={18} strokeWidth={2.2} />
          </span>
          <div className="history-summary-card__copy">
            <span>Distance</span>
            <strong>
              {totalDistance.toFixed(1)} <small>km</small>
            </strong>
          </div>
        </article>

        <article className="history-summary-card">
          <span className="history-summary-card__icon" aria-hidden="true">
            <Trophy size={18} strokeWidth={2.2} />
          </span>
          <div className="history-summary-card__copy">
            <span>Sorties</span>
            <strong>
              {totalRuns} <small>séance{totalRuns > 1 ? "s" : ""}</small>
            </strong>
          </div>
        </article>
      </div>
    </header>
  );
}
