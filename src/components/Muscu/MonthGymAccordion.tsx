import { useMemo } from "react";
import { ChevronDown, Dumbbell } from "lucide-react";

import type { GymSession } from "../../types/GymSession";
import GymSessionCard from "./GymSessionCard";

type Props = {
  monthLabel: string;
  sessions: GymSession[];
  isOpen: boolean;
  onToggle: () => void;
  onView: (session: GymSession) => void;
  onDelete: (id: string) => void;
};

export default function MonthGymAccordion({
  monthLabel,
  sessions,
  isOpen,
  onToggle,
  onView,
  onDelete,
}: Props) {
  const total = useMemo(() => sessions.length, [sessions]);

  return (
    <article className={`muscu-month${isOpen ? " muscu-month--open" : ""}`}>
      <button className="muscu-month__toggle" onClick={onToggle}>
        <span className="muscu-month__copy">
          <span className="muscu-month__title">{monthLabel}</span>
          <span className="muscu-month__metric">
            <Dumbbell size={14} strokeWidth={2.2} />
            {total} séance{total > 1 ? "s" : ""}
          </span>
        </span>
        <ChevronDown className="muscu-month__chevron" size={18} strokeWidth={2.2} />
      </button>

      {isOpen && (
        <div className="muscu-month__sessions">
          {sessions.map((session) => (
            <GymSessionCard
              key={session.id}
              session={session}
              onView={onView}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </article>
  );
}
