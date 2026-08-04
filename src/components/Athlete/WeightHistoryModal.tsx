import { X } from "lucide-react";

import { theme } from "../../styles/theme";

import type { WeightEntry } from "../../types/WeightEntry";

type Props = {
  isOpen: boolean;
  history: WeightEntry[];
  onClose: () => void;
};

export default function WeightHistoryModal({
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

        background: "rgba(0,0,0,.65)",

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
            justifyContent:
              "space-between",

            alignItems: "center",

            marginBottom: 22,
          }}
        >
          <h2
            style={{
              margin: 0,

              color:
                theme.colors.primary,
            }}
          >
            ⚖️ Historique du poids
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

                  fontSize: 18,
                }}
              >
                {entry.weight} kg
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}