import { useEffect, useMemo, useState } from "react";
import { CalendarX2, Download } from "lucide-react";

import HistoryHeader from "../components/History/HistoryHeader";
import HistoryFilters from "../components/History/HistoryFilters";
import MonthAccordion from "../components/History/MonthAccordion";
import AppContainer from "../components/Layout/AppContainer";

import { deleteRun, getRuns } from "../services/runService";
import { deleteRecordNotificationsForRun } from "../services/notificationService";
import { syncRunRecords } from "../services/recordEngine";
import type { Run } from "../types/Run";
import { exportRunsToCSV } from "../utils/exportCsv";
import { getTotalDistance } from "../utils/stats";

import "./History.css";

type Filter = "all" | "training" | "race";

export default function History() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [openedMonth, setOpenedMonth] = useState<string>("");

  async function loadRuns() {
    setLoading(true);

    const data = await getRuns();

    data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setRuns(data);
    setLoading(false);
  }

  useEffect(() => {
    // La synchronisation initiale doit mettre à jour l'état après le chargement Supabase.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRuns();
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer cette sortie ?")) {
      return;
    }

    await deleteRun(id);
    await deleteRecordNotificationsForRun(id);
    await syncRunRecords();
    await loadRuns();
  }

  const filteredRuns = useMemo(() => {
    if (filter === "all") {
      return runs;
    }

    return runs.filter((run) => run.type === filter);
  }, [runs, filter]);

  const groupedRuns = useMemo(() => {
    const groups: Record<string, Run[]> = {};

    filteredRuns.forEach((run) => {
      const date = new Date(run.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(run);
    });

    return groups;
  }, [filteredRuns]);

  if (loading) {
    return (
      <AppContainer>
        <main className="history-page history-page--loading">
          <div className="history-loading">Chargement...</div>
        </main>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <main className="history-page">
        <HistoryHeader
          totalRuns={runs.length}
          totalDistance={getTotalDistance(runs)}
        />

        <HistoryFilters selected={filter} onChange={setFilter} />

        <section className="history-content">
          <div className="history-content__toolbar">
            <button
              className="history-export-button"
              onClick={() =>
                exportRunsToCSV(filteredRuns, "RunLog_Historique.csv")
              }
            >
              <Download size={16} strokeWidth={2.2} />
              Export CSV
            </button>
          </div>

          {Object.entries(groupedRuns).length === 0 ? (
            <div className="history-empty-state">
              <span className="history-empty-state__icon" aria-hidden="true">
                <CalendarX2 size={22} strokeWidth={2} />
              </span>
              <h2>Aucune sortie</h2>
              <p>Aucune sortie ne correspond au filtre sélectionné.</p>
            </div>
          ) : (
            <div className="history-month-list">
              {Object.entries(groupedRuns).map(([monthKey, monthRuns]) => (
                <MonthAccordion
                  key={monthKey}
                  runs={monthRuns}
                  isOpen={openedMonth === monthKey}
                  onToggle={() =>
                    setOpenedMonth(openedMonth === monthKey ? "" : monthKey)
                  }
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </AppContainer>
  );
}
