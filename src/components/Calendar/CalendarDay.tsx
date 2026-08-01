import {
  Footprints,
  Flag,
  Dumbbell,
} from "lucide-react";

import { theme } from "../../styles/theme";

type CalendarDayProps = {
  day: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  eventType?: "training" | "gym" | "race";
  onClick?: () => void;
};

export default function CalendarDay({
  day,
  isCurrentMonth,
  isToday = false,
  isSelected = false,
  eventType,
  onClick,
}: CalendarDayProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        aspectRatio: "1",

        padding: 0,

        border: `2px solid ${
          isSelected
            ? theme.colors.primary
            : isToday
            ? theme.colors.primary
            : theme.colors.border
        }`,

        borderRadius: 18,

        background: isSelected
          ? "rgba(212,175,55,.10)"
          : theme.colors.card,

        boxSizing: "border-box",

        cursor: "pointer",

        position: "relative",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        transition: "all .18s ease",

        color: isCurrentMonth
          ? theme.colors.text
          : "#6B6B6B",

        fontSize: 20,

        fontWeight: 700,

        boxShadow: isSelected
          ? "0 0 14px rgba(212,175,55,.22)"
          : "none",

        transform: isSelected
          ? "scale(1.03)"
          : "scale(1)",
      }}
    >
      {day}

      {eventType === "training" && (
        <Footprints
          size={15}
          strokeWidth={2.3}
          color={theme.colors.primary}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
          }}
        />
      )}

      {eventType === "race" && (
        <Flag
          size={15}
          strokeWidth={2.3}
          color={theme.colors.primary}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
          }}
        />
      )}

      {eventType === "gym" && (
        <Dumbbell
          size={15}
          strokeWidth={2.3}
          color={theme.colors.primary}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
          }}
        />
      )}
    </button>
  );
}