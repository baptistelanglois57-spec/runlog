import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { theme } from "../../styles/theme";

import type {
  MonthlyDisciplineStats,
} from "../../utils/disciplineMonthly";

import MonthlyDisciplineCard from "./MonthlyDisciplineCard";

type Props = {
  title: string;
  months: MonthlyDisciplineStats[];
};

export default function DisciplineAccordion({
  title,
  months,
}: Props) {
  const [open, setOpen] =
    useState(false);

  return (
    <div
      style={{
        background:
          theme.colors.card,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: 20,

        overflow: "hidden",

        marginBottom: 18,
      }}
    >
      <button
        onClick={() =>
          setOpen(!open)
        }
        style={{
          width: "100%",

          padding: 18,

          border: "none",

          background: "transparent",

          cursor: "pointer",

          display: "flex",

          alignItems: "center",

          justifyContent:
            "space-between",

          color:
            theme.colors.text,
        }}
      >
        <span
          style={{
            fontWeight: 700,

            fontSize: 18,

            color:
              theme.colors.primary,
          }}
        >
          {title}
        </span>

        {open ? (
          <ChevronDown
            color={
              theme.colors.primary
            }
          />
        ) : (
          <ChevronRight
            color={
              theme.colors.primary
            }
          />
        )}
      </button>

      {open && (
        <div
          style={{
            padding: 18,

            paddingTop: 0,

            display: "flex",

            flexDirection:
              "column",

            gap: 14,
          }}
        >
          {months.length === 0 ? (
            <div
              style={{
                color:
                  theme.colors.textSecondary,

                textAlign: "center",

                padding: 20,
              }}
            >
              Aucune donnée.
            </div>
          ) : (
            months.map((month) => (
              <MonthlyDisciplineCard
                key={month.monthKey}
                data={month}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}