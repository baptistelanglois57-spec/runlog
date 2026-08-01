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

        borderRadius: 18,

        padding: 16,

        display: "flex",

        flexDirection: "column",

        boxShadow: theme.shadow.card,
      }}
    >
      {/* Header */}

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
          }}
        >
          {icon}
        </div>

        <h3
          style={{
            margin: 0,

            color: theme.colors.text,

            fontSize: 15,

            fontWeight: 700,
          }}
        >
          {title}
        </h3>
      </div>

      {/* Valeur */}

     <div
  style={{
    marginTop: 14,
    textAlign: "center",
  }}
>
  <div
    style={{
      fontSize: 22,
      fontWeight: 800,
      color: theme.colors.primary,
      lineHeight: 1.1,
      whiteSpace: "nowrap",
    }}
  >
    {value}
  </div>

  {subtitle && (
    <div
      style={{
        marginTop: 6,
        color: theme.colors.textSecondary,
        fontSize: 12,
        lineHeight: 1.4,
      }}
    >
      {subtitle}
    </div>
  )}
</div>
            {/* Détails */}

      {details && details.length > 0 && (
        <div
          style={{
            marginTop: 20,

            paddingTop: 18,

            borderTop: `1px solid ${theme.colors.border}`,

            display: "flex",

            flexDirection: "column",

            gap: 12,
          }}
        >
          {details.map((detail) => (
            <div
              key={detail.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color:
                    theme.colors.textSecondary,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 20,
                    textAlign: "center",
                  }}
                >
                  {detail.icon}
                </span>

                <span>{detail.label}</span>
              </div>

              <span
                style={{
                  color: theme.colors.text,
                  fontWeight: 700,
                  fontSize: 15,
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