import { Pencil } from "lucide-react";

import { theme } from "../../styles/theme";

type AthleteFieldProps = {
  label: string;
  value: string;
  icon: string;
  onEdit: () => void;
  onHistory?: () => void;
};

export default function AthleteField({
  label,
  value,
  icon,
  onEdit,
  onHistory,
}: AthleteFieldProps) {
  return (
    <div
      style={{
        background: theme.colors.card,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: 18,

        padding: 18,

        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
            }}
          >
            {icon}
          </div>

          <div>
            <div
              style={{
                color:
                  theme.colors.textSecondary,

                fontSize: 13,

                marginBottom: 4,
              }}
            >
              {label}
            </div>

            <div
              style={{
                color: theme.colors.text,

                fontSize: 20,

                fontWeight: 700,
              }}
            >
              {value}
            </div>

            {onHistory && (
              <button
                onClick={onHistory}
                style={{
                  marginTop: 8,

                  border: "none",

                  background:
                    "transparent",

                  padding: 0,

                  cursor: "pointer",

                  color:
                    theme.colors.primary,

                  fontWeight: 600,

                  fontSize: 13,
                }}
              >
                Voir l'historique →
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onEdit}
          style={{
            width: 42,
            height: 42,

            borderRadius: 12,

            border: `1px solid ${theme.colors.border}`,

            background:
              "rgba(212,175,55,.08)",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            cursor: "pointer",
          }}
        >
          <Pencil
            size={18}
            color={theme.colors.primary}
          />
        </button>
      </div>
    </div>
  );
}