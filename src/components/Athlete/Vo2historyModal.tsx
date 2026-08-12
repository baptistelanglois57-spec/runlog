import { X } from "lucide-react";

import { theme } from "../../styles/theme";
import { Typography } from "../../styles/ui";

import type { Vo2Entry } from "../../types/V02Entry";

type Props = {
  isOpen: boolean;
  history: Vo2Entry[];
  onClose: () => void;
};

export default function Vo2HistoryModal({
  isOpen,
  history,
  onClose,
}: Props) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,

        background: "rgba(12,11,11,.65)",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        padding: 20,

        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,

          background: theme.colors.card,

          border: `1px solid ${theme.colors.border}`,

          borderRadius: 22,

          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: theme.colors.primary,
            }}
          >
            ❤️ Historique VO₂max
          </h2>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X
              size={24}
              color={theme.colors.text}
            />
          </button>
        </div>

        {history.length === 0 ? (
          <p
            style={{
              color:
                theme.colors.textSecondary,
            }}
          >
            Aucun historique.
          </p>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",

                padding: "14px 0",

                borderBottom: `1px solid ${theme.colors.border}`,
              }}
            >
              <span
                style={{
                  color:
                    theme.colors.textSecondary,
                }}
              >
                {entry.date}
              </span>

              <span
                style={{
                  color:
                    theme.colors.text,

                  fontWeight: 700,

                  fontSize: Typography.cardTitle,
                }}
              >
                {entry.vo2max}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
