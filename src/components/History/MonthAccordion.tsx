import { useMemo } from "react";

import { theme } from "../../styles/theme";

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
        onClick={onToggle}
        style={{
          cursor: "pointer",
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "20px",
          padding: "22px",
          boxShadow: theme.shadow.card,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
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
            fontSize: "26px",
            color: theme.colors.primary,
            fontWeight: 700,
          }}
        >
          {isOpen ? "▼" : "▶"}
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