import { useEffect, useMemo, useState } from "react";

import HistoryHeader from "../components/History/HistoryHeader";
import HistoryFilters from "../components/History/HistoryFilters";
import MonthAccordion from "../components/History/MonthAccordion";

import {
  getRuns,
  deleteRun,
} from "../services/runService";

import type { Run } from "../types/Run";

import { getTotalDistance } from "../utils/stats";
import { exportRunsToCSV } from "../utils/exportCsv";

import { theme } from "../styles/theme";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import PageCard from "../components/Layout/PageCard";
import { syncRunRecords } from "../services/recordEngine";

type Filter =
  | "all"
  | "training"
  | "race";

export default function History() {
  const [runs, setRuns] =
    useState<Run[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState<Filter>("all");

  // Tous les mois fermés au démarrage
  const [openedMonth, setOpenedMonth] =
    useState<string>("");

  useEffect(() => {
    loadRuns();
  }, []);

  async function loadRuns() {
    setLoading(true);

    const data = await getRuns();

    data.sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

    setRuns(data);

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (
      !window.confirm(
        "Supprimer cette sortie ?"
      )
    ) {
      return;
    }

    await deleteRun(id);

await syncRunRecords();

await loadRuns();
  }

  const filteredRuns = useMemo(() => {
    if (filter === "all") {
      return runs;
    }

    return runs.filter(
      (run) => run.type === filter
    );
  }, [runs, filter]);

  const groupedRuns = useMemo(() => {
    const groups: Record<
      string,
      Run[]
    > = {};

    filteredRuns.forEach((run) => {
      const date = new Date(run.date);

      const key =
        `${date.getFullYear()}-${date.getMonth()}`;

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
        <Section>
          <PageCard>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 180,
fontSize: 18,
fontWeight: 600,
                color: theme.colors.text,
              }}
            >
              Chargement...
            </div>
          </PageCard>
        </Section>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Section>
        <HistoryHeader
          totalRuns={runs.length}
          totalDistance={getTotalDistance(runs)}
        />
      </Section>

      <Section>
        <HistoryFilters
          selected={filter}
          onChange={setFilter}
        />
      </Section>

      <Section>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "14px",
          }}
        >
          <button
            onClick={() =>
              exportRunsToCSV(
                filteredRuns,
                "RunLog_Historique.csv"
              )
            }
            style={{
  background: theme.colors.card,

  color: theme.colors.primary,

  border: `1px solid ${theme.colors.border}`,

  borderRadius: 14,

  padding: "10px 16px",

  fontWeight: 700,

  fontSize: 14,

  cursor: "pointer",

  transition: ".2s",
}}
          >
             Export CSV
          </button>
        </div>

        {Object.entries(groupedRuns).length === 0 ? (
          <PageCard>
            <h2
              style={{
                marginTop: 0,
                color: theme.colors.primary,
              }}
            >
              Aucune sortie
            </h2>

            <p
              style={{
                color:
                  theme.colors.textSecondary,
                marginBottom: 0,
              }}
            >
              Aucune sortie ne correspond au filtre sélectionné.
            </p>
          </PageCard>
        ) : (
          Object.entries(groupedRuns).map(
            ([monthKey, monthRuns]) => (
              <MonthAccordion
                key={monthKey}
                runs={monthRuns}
                isOpen={
                  openedMonth === monthKey
                }
                onToggle={() =>
                  setOpenedMonth(
                    openedMonth === monthKey
                      ? ""
                      : monthKey
                  )
                }
                onDelete={handleDelete}
              />
            )
          )
        )}
      </Section>
    </AppContainer>
  );
}