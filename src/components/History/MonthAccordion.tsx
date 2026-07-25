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
        maxWidth: "900px",
        margin: "0 auto 22px",
      }}
    >
      <div
        style={{
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "20px",
          padding: "22px",
          boxShadow: theme.shadow.card,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div
            onClick={onToggle}
            style={{
              cursor: "pointer",
              flex: 1,
            }}
          >
            <h2
              style={{
                margin: 0,
                textTransform: "capitalize",
              }}
            >
              {stats.monthLabel}
            </h2>

            <p
              style={{
                marginTop: "10px",
                color: theme.colors.textSecondary,
              }}
            >
              📏 {stats.distance.toFixed(1)} km
              {" • "}
              ⛰ {stats.elevation} m
              {" • "}
              🏃 {stats.trainings}
              {" • "}
              🏁 {stats.races}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
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
    width: "42px",
    height: "42px",
    background: theme.colors.primary,
    color: "#000",
    border: "none",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.2s",
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

            <div
              onClick={onToggle}
              style={{
                cursor: "pointer",
                fontSize: "26px",
                color: theme.colors.primary,
                fontWeight: 700,
                userSelect: "none",
              }}
            >
              {isOpen ? "▼" : "▶"}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            marginTop: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
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