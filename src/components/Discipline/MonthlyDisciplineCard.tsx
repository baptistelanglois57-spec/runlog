import { theme } from "../../styles/theme";

import type {
  MonthlyDisciplineStats,
} from "../../utils/disciplineMonthly";

type Props = {
  data: MonthlyDisciplineStats;
};

export default function MonthlyDisciplineCard({
  data,
}: Props) {
  const { stats } = data;

  let percentageColor =
    "#EF4444";

  if (stats.percentage >= 85) {
    percentageColor = "#22C55E";
  } else if (
    stats.percentage >= 70
  ) {
    percentageColor = "#FACC15";
  } else if (
    stats.percentage >= 50
  ) {
    percentageColor = "#F97316";
  }

  return (
    <div
      style={{
        background:
          "rgba(255,255,255,.02)",

        border: `1px solid ${theme.colors.border}`,

        borderRadius: 16,

        padding: 16,
      }}
    >
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontWeight: 700,

            fontSize: 17,

            color:
              theme.colors.primary,
          }}
        >
          {data.monthLabel}
        </div>

        <div
          style={{
            fontWeight: 800,

            fontSize: 22,

            color: percentageColor,
          }}
        >
          {stats.percentage}%
        </div>
      </div>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(2,1fr)",

          gap: 10,
        }}
      >
        <Stat
          label="Prévues"
          value={stats.planned}
        />

        <Stat
          label="Réalisées"
          value={stats.completed}
          color="#22C55E"
        />

        <Stat
          label="En attente"
          value={stats.pending}
          color="#3B82F6"
        />

        <Stat
          label="Manquées"
          value={stats.missed}
          color="#EF4444"
        />
      </div>
    </div>
  );
}

type StatProps = {
  label: string;
  value: number;
  color?: string;
};

function Stat({
  label,
  value,
  color = theme.colors.text,
}: StatProps) {
  return (
    <div
      style={{
        background:
          "rgba(255,255,255,.03)",

        borderRadius: 12,

        padding: 12,

        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 12,

          color:
            theme.colors.textSecondary,

          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 20,

          fontWeight: 700,

          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}