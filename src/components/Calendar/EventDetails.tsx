import { Activity, CalendarDays, Dumbbell, Flag, X } from "lucide-react";

import type { Event } from "../../types/Event";
import PrimaryButton from "../UI/PrimaryButton";
import SecondaryButton from "../UI/SecondaryButton";
import {
  PremiumPanelFooter,
  PremiumPanelHeader,
} from "../UI/PremiumPanel";

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
      <PremiumPanelHeader
        title={label}
        subtitle={
          <>
            <CalendarDays size={14} />
            {displayDate}{event.time ? ` · ${event.time}` : ""}
          </>
        }
        leading={
          <span className={`agenda-event-details__type agenda-event-details__type--${event.type}`}>
            <Icon size={19} />
          </span>
        }
        trailing={
          <button
            className="premium-panel__icon-button"
            type="button"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={19} />
          </button>
        }
      />

      <div className="agenda-event-details__content">
        <div className="agenda-event-details__card">
          <span>Nom</span>
          <strong>{event.name}</strong>
        </div>

        <div className="agenda-event-details__card">
          <span>Notes</span>
          <p>{event.notes?.trim() ? event.notes : "Aucune note"}</p>
        </div>
      </div>

      <PremiumPanelFooter className="agenda-event-details__actions">
        <PrimaryButton onClick={onEdit}>Modifier</PrimaryButton>
        <button
          className="agenda-event-details__delete"
          type="button"
          onClick={onDelete}
        >
          Supprimer
        </button>
        <SecondaryButton onClick={onClose}>Fermer</SecondaryButton>
      </PremiumPanelFooter>
    </div>
  );
}
