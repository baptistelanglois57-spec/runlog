import { Activity, CalendarDays, Dumbbell, Flag } from "lucide-react";

import type { Event } from "../../types/Event";
import PrimaryButton from "../UI/PrimaryButton";
import SecondaryButton from "../UI/SecondaryButton";

type EventDetailsProps = {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

function getEventPresentation(type: Event["type"]) {
  if (type === "training") return { label: "Entraînement", Icon: Activity };
  if (type === "gym") return { label: "Salle", Icon: Dumbbell };
  return { label: "Course", Icon: Flag };
}

export default function EventDetails({
  event,
  onEdit,
  onDelete,
  onClose,
}: EventDetailsProps) {
  const displayDate = new Date(event.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const { label, Icon } = getEventPresentation(event.type);

  return (
    <div className="agenda-event-details">
      <header className="agenda-event-details__header">
        <span className={`agenda-event-details__type agenda-event-details__type--${event.type}`}>
          <Icon size={19} />
        </span>
        <div>
          <h2>{label}</h2>
          <p>
            <CalendarDays size={14} />
            {displayDate}{event.time ? ` · ${event.time}` : ""}
          </p>
        </div>
      </header>

      <div className="agenda-event-details__card">
        <span>Nom</span>
        <strong>{event.name}</strong>
      </div>

      <div className="agenda-event-details__card">
        <span>Notes</span>
        <p>{event.notes?.trim() ? event.notes : "Aucune note"}</p>
      </div>

      <div className="agenda-event-details__actions">
        <PrimaryButton onClick={onEdit}>Modifier</PrimaryButton>
        <button
          className="agenda-event-details__delete"
          type="button"
          onClick={onDelete}
        >
          Supprimer
        </button>
      </div>

      <SecondaryButton onClick={onClose} style={{ width: "100%" }}>
        Fermer
      </SecondaryButton>
    </div>
  );
}
