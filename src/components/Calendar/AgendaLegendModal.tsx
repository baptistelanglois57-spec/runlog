import {
  CircleHelp,
  Circle,
  X,
} from "lucide-react";

import { theme } from "../../styles/theme";

type AgendaLegendModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AgendaLegendModal({
  isOpen,
  onClose,
}: AgendaLegendModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.65)",
        backdropFilter: "blur(6px)",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        zIndex: 9999,

        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,

          background: theme.colors.card,

          border: `1px solid ${theme.colors.border}`,
          borderRadius: 24,

          padding: 26,

          boxSizing: "border-box",
        }}
      >
        {/* Header */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <CircleHelp
              size={24}
              color={theme.colors.primary}
            />

            <h2
              style={{
                margin: 0,

                color: theme.colors.primary,

                fontSize: 28,
              }}
            >
              Légende
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",

              border: "none",

              cursor: "pointer",

              padding: 0,
            }}
          >
            <X
              size={26}
              color={theme.colors.text}
            />
          </button>
        </div>

        {/* Légende */}

        <LegendItem
          color="#3B82F6"
          title="Entraînement"
        />

        <LegendItem
          color="#F59E0B"
          title="Salle"
        />

        <LegendItem
          color="#FFFFFF"
          title="Course"
        />

        <div
          style={{
            height: 1,

            background:
              theme.colors.border,

            margin: "24px 0",
          }}
        />

        <LegendItem
          color="#22C55E"
          title="Séance réalisée"
        />

        <LegendItem
          color="#EF4444"
          title="Séance non réalisée"
        />

        <div
          style={{
            marginTop: 28,

            color: "#B7B7B7",

            fontSize: 14,

            lineHeight: 1.6,
          }}
        >
          Les couleurs évoluent automatiquement selon les séances réalisées et enregistrées dans RunLog.
        </div>
      </div>
    </div>
  );
}

type LegendItemProps = {
  color: string;
  title: string;
};

function LegendItem({
  color,
  title,
}: LegendItemProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",

        gap: 16,

        marginBottom: 18,
      }}
    >
      <Circle
        size={18}
        fill={color}
        color={color}
      />

      <span
        style={{
          color: theme.colors.text,

          fontSize: 18,

          fontWeight: 600,
        }}
      >
        {title}
      </span>
    </div>
  );
}