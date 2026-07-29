import { theme } from "../styles/theme";
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
        background: theme.colors.card,
        border: "1px solid rgba(212,175,55,.18)",
        borderRadius: 24,
        padding: 18,
        minHeight: 140,
        display: "flex",
        flexDirection: "column",
        transition: ".25s",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 6,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "rgba(212,175,55,.10)",
            border: "1px solid rgba(212,175,55,.15)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            size={19}
            color={theme.colors.primary}
            strokeWidth={2.2}
          />
        </div>

        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: theme.colors.text,
          }}
        >
          {title}
        </span>
      </div>

      {/* Valeur */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: -8,
        }}
      >
        <div
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: "#FFF",
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
              fontSize: 17,
            }}
          >
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}