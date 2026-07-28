import { theme } from "../../styles/theme";
import type { ReactNode } from "react";

type Detail = {
  icon: string;
  label: string;
  value: string;
};

type RecordCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
  details?: Detail[];
};

export default function RecordCard({
  icon,
  title,
  value,
  subtitle,
  color,
  details,
}: RecordCardProps) {
  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${color ?? theme.colors.border}`,
        borderRadius: "20px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
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
          marginTop: "14px",
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

      {details && details.length > 0 && (
        <div
          style={{
            marginTop: "22px",
            borderTop: `1px solid ${theme.colors.border}`,
            paddingTop: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {details.map((detail) => (
            <div
              key={detail.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: theme.colors.textSecondary,
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <span>{detail.icon}</span>
                <span>{detail.label}</span>
              </div>

              <span
                style={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}