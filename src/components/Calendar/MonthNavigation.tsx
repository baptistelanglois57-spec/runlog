import { ChevronLeft, ChevronRight } from "lucide-react";

type MonthNavigationProps = {
  month: Date;
  onPrevious: () => void;
  onNext: () => void;
};

export default function MonthNavigation({
  month,
  onPrevious,
  onNext,
}: MonthNavigationProps) {
  const monthName = month.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <nav className="agenda-month-navigation" aria-label="Navigation mensuelle">
      <button
        className="agenda-month-navigation__button"
        type="button"
        aria-label="Mois précédent"
        onClick={onPrevious}
      >
        <ChevronLeft size={20} />
      </button>

      <h2>{monthName}</h2>

      <button
        className="agenda-month-navigation__button"
        type="button"
        aria-label="Mois suivant"
        onClick={onNext}
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
}
