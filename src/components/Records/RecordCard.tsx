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

        border: `1px solid ${
          color ?? theme.colors.border
        }`,

        borderRadius: 20,

        padding: 18,

        display: "flex",

        flexDirection: "column",

        transition: ".18s",

        boxShadow: theme.shadow.card,
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            color: theme.colors.primary,

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        <h3
          style={{
            margin: 0,

            color: theme.colors.text,

            fontSize: 14,

            fontWeight: 700,

            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>
      </div>

      {/* RECORD */}

      <div
        style={{
          marginTop: 18,

          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 34,

            fontWeight: 800,

            color: theme.colors.primary,

            lineHeight: 1.05,

            whiteSpace: "nowrap",
          }}
        >
          {value}
        </div>

        {subtitle && (
          <div
            style={{
              marginTop: 8,

              color: theme.colors.textSecondary,

              fontSize: 13,

              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* DETAILS */}

      {details && details.length > 0 && (
        <div
          style={{
            marginTop: 18,

            paddingTop: 16,

            borderTop: `1px solid ${theme.colors.border}`,

            display: "flex",

            flexDirection: "column",

            gap: 10,
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

                  gap: 8,

                  color: theme.colors.textSecondary,

                  fontSize: 13,

                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 18,

                    textAlign: "center",
                  }}
                >
                  {detail.icon}
                </span>

                {detail.label}
              </div>

              <span
                style={{
                  color: theme.colors.text,

                  fontWeight: 700,

                  fontSize: 14,
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