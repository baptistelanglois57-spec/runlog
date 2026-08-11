import { useMemo } from "react";
import {
  ChevronDown,
  Download,
  Flag,
  Mountain,
  PersonStanding,
  Route,
} from "lucide-react";

import { exportRunsToCSV } from "../../utils/exportCsv";
import type { Run } from "../../types/Run";
import RunCard from "./RunCard";

type MonthAccordionProps = {
  runs: Run[];
  isOpen: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
  onShare: (run: Run) => void;
};

export default function MonthAccordion({
  runs,
  isOpen,
  onToggle,
  onDelete,
  onShare,
}: MonthAccordionProps) {
  const stats = useMemo(() => {
    const firstDate = new Date(runs[0].date);
    const elevation = runs.reduce((sum, run) => sum + run.elevation, 0);
    const distance = runs.reduce((sum, run) => sum + run.distance, 0);
    const trainings = runs.filter((run) => run.type === "training").length;
    const races = runs.filter((run) => run.type === "race").length;

    return {
      monthLabel: firstDate.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      }),
      distance,
      elevation,
      trainings,
      races,
    };
  }, [runs]);

  return (
    <article className={`history-month${isOpen ? " history-month--open" : ""}`}>
      <div className="history-month__header">
        <button className="history-month__toggle" onClick={onToggle}>
          <span className="history-month__copy">
            <span className="history-month__title">{stats.monthLabel}</span>
            <span className="history-month__metrics">
              <span className="history-month__metric history-month__metric--accent">
                <Route size={13} strokeWidth={2.2} />
                {stats.distance.toFixed(1)} km
              </span>
              <span className="history-month__metric">
                <Mountain size={13} strokeWidth={2.2} />
                {stats.elevation} m
              </span>
              <span className="history-month__metric">
                <PersonStanding size={13} strokeWidth={2.2} />
                {stats.trainings}
              </span>
              <span className="history-month__metric">
                <Flag size={13} strokeWidth={2.2} />
                {stats.races}
              </span>
            </span>
          </span>
          <ChevronDown className="history-month__chevron" size={18} strokeWidth={2.2} />
        </button>

        <button
          className="history-month__export"
          onClick={() =>
            exportRunsToCSV(
              runs,
              `RunLog_${stats.monthLabel.replace(/\s+/g, "_")}.csv`
            )
          }
          title="Exporter en CSV"
          aria-label={`Exporter ${stats.monthLabel} en CSV`}
        >
          <Download size={17} strokeWidth={2.2} />
        </button>
      </div>

      {isOpen && (
        <div className="history-month__runs">
          {runs.map((run) => (
            <RunCard
              key={run.id}
              run={run}
              onDelete={onDelete}
              onShare={onShare}
            />
          ))}
        </div>
      )}
    </article>
  );
}
