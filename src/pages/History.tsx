import { useEffect, useMemo, useState } from "react";

import HistoryHeader from "../components/History/HistoryHeader";
import HistoryFilters from "../components/History/HistoryFilters";
import MonthAccordion from "../components/History/MonthAccordion";

import { getRuns, deleteRun } from "../services/runService";

import type { Run } from "../types/Run";

import { getTotalDistance } from "../utils/stats";

import { theme } from "../styles/theme";

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

  const [openedMonth, setOpenedMonth] =
    useState("");

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

    if (data.length) {
      const first = new Date(data[0].date);

      setOpenedMonth(
        `${first.getFullYear()}-${first.getMonth()}`
      );
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (
      !window.confirm(
        "Supprimer cette sortie ?"
      )
    )
      return;

    await deleteRun(id);

    await loadRuns();
  }

  const filteredRuns = useMemo(() => {
    if (filter === "all")
      return runs;

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
      <main
        style={{
          minHeight: "100vh",
          background:
            theme.colors.background,
          color: theme.colors.text,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
        }}
      >
        Chargement...
      </main>
    );
  }
    return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        padding: "40px",
      }}
    >
      <HistoryHeader
        totalRuns={runs.length}
        totalDistance={getTotalDistance(runs)}
      />

      <HistoryFilters
        selected={filter}
        onChange={setFilter}
      />

      {Object.entries(groupedRuns).length === 0 ? (
        <div
          style={{
            maxWidth: "900px",
            margin: "40px auto",
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            boxShadow: theme.shadow.card,
          }}
        >
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
              color: theme.colors.textSecondary,
              marginBottom: 0,
            }}
          >
            Aucune sortie ne correspond au filtre sélectionné.
          </p>
        </div>
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
    </main>
  );
}