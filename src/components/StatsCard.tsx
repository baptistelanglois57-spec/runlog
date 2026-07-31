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
        width: "100%",
        minHeight: "150px",

        background: theme.colors.card,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: "22px",

        padding: "clamp(18px,4vw,24px)",

        display: "flex",
        flexDirection: "column",

        boxSizing: "border-box",

        transition:
          "transform .2s ease, border-color .2s ease, box-shadow .2s ease",

        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "46px",
            height: "46px",

            borderRadius: "14px",

            background: "rgba(212,175,55,.10)",

            border: "1px solid rgba(212,175,55,.15)",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            flexShrink: 0,
          }}
        >
          <Icon
            size={22}
            color={theme.colors.primary}
            strokeWidth={2.2}
          />
        </div>

        <span
          style={{
            color: theme.colors.text,

            fontWeight: 700,

            fontSize: "clamp(15px,4vw,17px)",

            lineHeight: 1.3,
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          flex: 1,

          display: "flex",
          flexDirection: "column",

          justifyContent: "center",

          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "clamp(34px,9vw,42px)",

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
              marginTop: "6px",

              color: theme.colors.primary,

              fontWeight: 700,

              fontSize: "clamp(15px,4vw,18px)",
            }}
          >
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}