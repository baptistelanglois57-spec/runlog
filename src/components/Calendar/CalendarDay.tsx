import { theme } from "../../styles/theme";

import type { AgendaDayStatus } from "../../utils/agenda";

type CalendarDayProps = {
  day: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isSelected?: boolean;

  status?: AgendaDayStatus;

  onClick?: () => void;
};

export default function CalendarDay({
  day,
  isCurrentMonth,
  isToday: _isToday = false,
  isSelected = false,
  status = {
    type: "none",
    completed: false,
  },
  onClick,
}: CalendarDayProps) {
  let borderColor = theme.colors.border;

  if (status.completed) {
    borderColor = "#4CAF50";
  } else {
    switch (status.type) {
      case "training":
        borderColor = "#3B82F6";
        break;

      case "gym":
        borderColor = "#F59E0B";
        break;

      case "race":
        borderColor = "#FFFFFF";
        break;

      case "missed":
        borderColor = "#EF4444";
        break;

      default:
        borderColor = theme.colors.border;
    }
  }

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
            : borderColor
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
    </button>
  );
}