import { theme } from "../styles/theme";
import { UI } from "../styles/ui";

import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
}: StatsCardProps) {
  const parts = value.split(" ");

  const number = parts[0];

  const unit = parts.slice(1).join(" ");

  return (
    <div
      style={{
        width: "100%",

        minHeight: 112,

        background: theme.colors.card,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: UI.RADIUS,

        padding: 14,

        boxSizing: "border-box",

        display: "flex",

        flexDirection: "column",

        justifyContent: "space-between",

        transition: UI.TRANSITION,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: 8,
        }}
      >
        <div
          style={{
            width: 34,

            height: 34,

            borderRadius: 10,

            background:
              "rgba(212,175,55,.10)",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            flexShrink: 0,
          }}
        >
          <Icon
            size={18}
            color={theme.colors.primary}
            strokeWidth={2.3}
          />
        </div>

        <span
          style={{
            color: theme.colors.text,

            fontWeight: 700,

            fontSize: 14,

            lineHeight: 1.15,
          }}
        >
          {title}
        </span>
      </div>

      {/* Valeur */}

      <div
        style={{
          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          alignItems: "center",

          flex: 1,

          marginTop: 4,
        }}
      >
        <div
          style={{
            fontSize: 30,

            fontWeight: 800,

            color: theme.colors.text,

            lineHeight: 1,
          }}
        >
          {number}
        </div>

        {unit && (
          <div
            style={{
              marginTop: 2,

              color: theme.colors.primary,

              fontWeight: 700,

              fontSize: 13,
            }}
          >
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}