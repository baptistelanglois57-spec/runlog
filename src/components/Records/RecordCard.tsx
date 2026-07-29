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
            fontSize: "36px",
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
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
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {details.map((detail) => (
            <div
              key={detail.label}
              style={{
                display: "grid",
                gridTemplateColumns: "190px 100px",
                justifyContent: "center",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: theme.colors.textSecondary,
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 24,
                    textAlign: "center",
                    fontSize: "18px",
                  }}
                >
                  {detail.icon}
                </span>

                <span>{detail.label}</span>
              </div>

              <span
                style={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "17px",
                  textAlign: "right",
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