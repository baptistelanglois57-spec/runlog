import { Circle, CircleHelp, X } from "lucide-react";
import { theme } from "../../styles/theme";

type AgendaLegendModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const legendItems = [
  { color: "#3B82F6", title: "Entraînement" },
  { color: "#F59E0B", title: "Salle" },
  { color: theme.colors.primaryLight, title: "Course" },
  { color: "#4CAF50", title: "Séance réalisée" },
  { color: "#EF4444", title: "Séance non réalisée" },
];

export default function AgendaLegendModal({
  isOpen,
  onClose,
}: AgendaLegendModalProps) {
  if (!isOpen) return null;

  return (
    <div className="agenda-legend-modal" role="presentation" onClick={onClose}>
      <div
        className="agenda-legend-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Légende du calendrier"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="agenda-legend-modal__header">
          <span className="agenda-legend-modal__icon" aria-hidden="true">
            <CircleHelp size={19} />
          </span>
          <h2>Légende</h2>
          <button type="button" aria-label="Fermer" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <div className="agenda-legend-modal__list">
          {legendItems.slice(0, 3).map((item) => (
            <LegendItem key={item.title} {...item} />
          ))}
        </div>

        <hr />

        <div className="agenda-legend-modal__list">
          {legendItems.slice(3).map((item) => (
            <LegendItem key={item.title} {...item} />
          ))}
        </div>

        <p>
          Les couleurs évoluent automatiquement selon les séances réalisées et
          enregistrées dans RunLog.
        </p>
      </div>
    </div>
  );
}

function LegendItem({ color, title }: { color: string; title: string }) {
  return (
    <div className="agenda-legend-modal__item">
      <Circle size={13} fill={color} color={color} />
      <span>{title}</span>
    </div>
  );
}
