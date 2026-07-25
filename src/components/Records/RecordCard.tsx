import { theme } from "../../styles/theme";
import type { ReactNode } from "react";

type RecordCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
};

export default function RecordCard({
  icon,
  title,
  value,
  subtitle,
  color,
}: RecordCardProps) {
  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${
          color ?? theme.colors.border
        }`,
        borderRadius: "20px",
        padding: "22px",
        minHeight: "180px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            color: theme.colors.primary,
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </div>

        <h3
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          {title}
        </h3>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            fontSize: "42px",
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>

        {subtitle && (
          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}