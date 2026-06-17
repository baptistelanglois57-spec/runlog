import { theme } from "../../styles/theme";

type CalendarDayProps = {
  day: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  eventType?: "training" | "race";
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
  const icon =
    eventType === "training"
      ? "🏃"
      : eventType === "race"
      ? "🏁"
      : null;

  return (
    <div
      onClick={onClick}
      style={{
        height: "78px",
        borderRadius: "14px",

        background: theme.colors.background,

        border: `2px solid ${
          isSelected
            ? "#FFD700"
            : isToday
            ? theme.colors.primary
            : theme.colors.border
        }`,

        boxShadow: isSelected
          ? "0 0 18px rgba(212,175,55,.35)"
          : "none",

        cursor: "pointer",

        transition: "all .18s ease",

        position: "relative",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        color: isCurrentMonth
          ? theme.colors.text
          : "#666",

        fontSize: "20px",
        fontWeight: 700,

        transform: isSelected
          ? "scale(1.03)"
          : "scale(1)",
      }}
    >
      {day}

      {icon && (
        <span
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            fontSize: "18px",
            lineHeight: 1,
          }}
        >
          {icon}
        </span>
      )}
    </div>
  );
}