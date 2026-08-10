import { Flag, ListFilter, PersonStanding } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Filter = "all" | "training" | "race";

type HistoryFiltersProps = {
  selected: Filter;
  onChange: (filter: Filter) => void;
};

const filters: { value: Filter; label: string; icon: LucideIcon }[] = [
  { value: "all", label: "Tous", icon: ListFilter },
  { value: "training", label: "Entraînements", icon: PersonStanding },
  { value: "race", label: "Compétitions", icon: Flag },
];

export default function HistoryFilters({
  selected,
  onChange,
}: HistoryFiltersProps) {
  return (
    <nav className="history-filters" aria-label="Filtrer les sorties">
      {filters.map(({ value, label, icon: Icon }) => {
        const active = selected === value;

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`history-filters__button${active ? " history-filters__button--active" : ""}`}
            aria-pressed={active}
          >
            <Icon size={14} strokeWidth={2.2} aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
