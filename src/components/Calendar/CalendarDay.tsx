import type { CSSProperties } from "react";

import type { AgendaDayStatus } from "../../utils/agenda";
import { theme } from "../../styles/theme";

type CalendarDayProps = {
  day: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  status?: AgendaDayStatus;
  onClick?: () => void;
};

function getStatusColor(status: AgendaDayStatus) {
  if (status.completed) return "#4CAF50";

  switch (status.type) {
    case "training":
      return "#3B82F6";
    case "gym":
      return "#F59E0B";
    case "race":
      return theme.colors.primaryLight;
    case "missed":
      return "#EF4444";
    default:
      return undefined;
  }
}

export default function CalendarDay({
  day,
  isCurrentMonth,
  isToday = false,
  isSelected = false,
  status = { type: "none", completed: false },
  onClick,
}: CalendarDayProps) {
  const statusColor = getStatusColor(status);
  const hasEvent = status.type !== "none" || status.completed;
  const style = statusColor
    ? ({ "--agenda-event-color": statusColor } as CSSProperties)
    : undefined;

  return (
    <button
      className={[
        "agenda-calendar-day",
        !isCurrentMonth && "agenda-calendar-day--outside",
        isToday && "agenda-calendar-day--today",
        isSelected && "agenda-calendar-day--selected",
        hasEvent && "agenda-calendar-day--event",
      ]
        .filter(Boolean)
        .join(" ")}
      type="button"
      style={style}
      onClick={onClick}
    >
      <span>{day}</span>
      {hasEvent && <i className="agenda-calendar-day__indicator" aria-hidden="true" />}
    </button>
  );
}
