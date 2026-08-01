import { useMemo } from "react";

import { theme } from "../../styles/theme";
import { exportRunsToCSV } from "../../utils/exportCsv";

import type { Run } from "../../types/Run";

import RunCard from "./RunCard";

type MonthAccordionProps = {
  runs: Run[];
  isOpen: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
};

export default function MonthAccordion({
  runs,
  isOpen,
  onToggle,
  onDelete,
}: MonthAccordionProps) {
  const stats = useMemo(() => {
    const firstDate = new Date(runs[0].date);

    const elevation = runs.reduce(
      (sum, run) => sum + run.elevation,
      0
    );

    const monthLabel =
      firstDate.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });

    const distance = runs.reduce(
      (sum, run) => sum + run.distance,
      0
    );

    const trainings = runs.filter(
      (run) => run.type === "training"
    ).length;

    const races = runs.filter(
      (run) => run.type === "race"
    ).length;

    return {
      monthLabel,
      distance,
      elevation,
      trainings,
      races,
    };
  }, [runs]);

  return (
    <div
      style={{
  background: theme.colors.card,

  border: `1px solid ${theme.colors.border}`,

  borderRadius: 18,

  padding: 16,

  cursor: "pointer",

  transition: ".2s",

  boxSizing: "border-box",
}}
    >
      <div
        onClick={onToggle}
        style={{
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "20px",
          padding: "22px",
          boxShadow: theme.shadow.card,
          cursor: "pointer",
          transition: "0.2s ease",
        }}
      >
        <div
  style={{
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: 14,
  }}
>
  <div
    style={{
      flex: 1,
    }}
  >
    <h2
      style={{
        margin: 0,

        textTransform: "capitalize",

        color: theme.colors.text,

        fontSize: 22,

        fontWeight: 800,
      }}
    >
      {stats.monthLabel}
    </h2>

    <div
      style={{
        display: "flex",

        flexWrap: "wrap",

        gap: 8,

        marginTop: 10,
      }}
    >
      <span
        style={{
          color: theme.colors.primary,

          fontSize: 13,

          fontWeight: 700,
        }}
      >
        📏 {stats.distance.toFixed(1)} km
      </span>

      <span
        style={{
          color: theme.colors.textSecondary,

          fontSize: 13,
        }}
      >
        ⛰ {stats.elevation} m
      </span>

      <span
        style={{
          color: theme.colors.textSecondary,

          fontSize: 13,
        }}
      >
        🏃 {stats.trainings}
      </span>

      <span
        style={{
          color: theme.colors.textSecondary,

          fontSize: 13,
        }}
      >
        🏁 {stats.races}
      </span>
    </div>
  </div>

          <button
            onClick={(e) => {
              e.stopPropagation();

              exportRunsToCSV(
                runs,
                `RunLog_${stats.monthLabel.replace(/\s+/g, "_")}.csv`
              );
            }}
            title="Exporter en CSV"
            style={{
  width: 38,

  height: 38,

  background: "transparent",

  color: theme.colors.primary,

  border: `1px solid ${theme.colors.border}`,

  borderRadius: 12,

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  cursor: "pointer",

  flexShrink: 0,
}}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {runs.map((run) => (
            <RunCard
              key={run.id}
              run={run}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}