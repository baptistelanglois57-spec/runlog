import { theme } from "../../styles/theme";
import { UI } from "../../styles/ui";

import type { EventType } from "../../types/Event";

import {
  Dumbbell,
  PersonStanding,
  CalendarDays,
} from "lucide-react";

type Props = {
  title?: string;
  date?: string;
  type?: EventType;
};

export default function NextTrainingCard({
  title = "Aucun entraînement",
  date = "Non planifié",
  type = "training",
}: Props) {
  const Icon =
    type === "gym"
      ? Dumbbell
      : PersonStanding;

  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,

        minHeight: 120,

        background: theme.colors.card,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: UI.RADIUS,

        padding: 14,

        boxSizing: "border-box",

        display: "flex",
        flexDirection: "column",

        justifyContent: "space-between",

        overflow: "hidden",

        transition: UI.TRANSITION,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background:
                "rgba(212,175,55,.10)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Icon
              size={18}
              color={theme.colors.primary}
              strokeWidth={2.3}
            />
          </div>

          <span
            style={{
              color: theme.colors.text,
              fontWeight: 700,
              fontSize: 14,
              lineHeight: 1.15,
              whiteSpace: "nowrap",
            }}
          >
            Séance
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,

            color:
              theme.colors.textSecondary,

            fontSize: 11,
            fontWeight: 600,

            flexShrink: 1,
            minWidth: 0,

            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <CalendarDays
            size={13}
            color={theme.colors.primary}
          />

          {date}
        </div>
      </div>

      {/* Contenu */}

      <div
        style={{
          flex: 1,

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          textAlign: "center",

          paddingTop: 8,

          minWidth: 0,
        }}
      >
        <div
          style={{
            color: theme.colors.text,

            fontWeight: 700,

            fontSize: 17,

            lineHeight: 1.25,

            width: "100%",

            overflow: "hidden",

            display: "-webkit-box",

            WebkitLineClamp: 2,

            WebkitBoxOrient: "vertical",

            wordBreak: "break-word",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}