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

        borderRadius: 14,

        background: theme.colors.background,

        border: `2px solid ${
          isSelected
            ? theme.colors.primary
            : isToday
            ? theme.colors.primary
            : theme.colors.border
        }`,

        boxShadow: isSelected
          ? "0 0 14px rgba(212,175,55,.28)"
          : "none",

        cursor: "pointer",

        transition: ".18s",

        position: "relative",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        color: isCurrentMonth
          ? theme.colors.text
          : "#666",

        fontSize: 18,

        fontWeight: 700,

        transform: isSelected
          ? "scale(1.02)"
          : "scale(1)",
      }}
    >
      {day}

      {eventType === "training" && (
        <Footprints
          size={13}
          strokeWidth={2.3}
          color={theme.colors.primary}
          style={{
            position: "absolute",
            top: 5,
            right: 5,
          }}
        />
      )}

      {eventType === "race" && (
        <Flag
          size={13}
          strokeWidth={2.3}
          color={theme.colors.primary}
          style={{
            position: "absolute",
            top: 5,
            right: 5,
          }}
        />
      )}

      {eventType === "gym" && (
        <Dumbbell
          size={13}
          strokeWidth={2.3}
          color={theme.colors.primary}
          style={{
            position: "absolute",
            top: 5,
            right: 5,
          }}
        />
      )}
    </button>
  );
}