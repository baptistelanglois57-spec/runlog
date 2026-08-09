import { useEffect, useState } from "react";
import { Activity, Dumbbell, Flag, X } from "lucide-react";

import EventDetails from "./EventDetails";
import EventForm from "./EventForm";
import type { Event, EventType } from "../../types/Event";

type EventModalProps = {
  isOpen: boolean;
  selectedDate: Date | null;
  event?: Event;
  onClose: () => void;
  onCreate: (event: Event) => void;
  onUpdate: (event: Event) => void;
  onDelete: (id: string) => void;
};

type View = "select" | "create" | "details" | "edit";

const eventChoices: { type: EventType; label: string; Icon: typeof Activity }[] = [
  { type: "training", label: "Entraînement", Icon: Activity },
  { type: "gym", label: "Salle", Icon: Dumbbell },
  { type: "race", label: "Course", Icon: Flag },
];

export default function EventModal({
  isOpen,
  selectedDate,
  event,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: EventModalProps) {
  const [view, setView] = useState<View>("select");
  const [selectedType, setSelectedType] = useState<EventType>("training");

  useEffect(() => {
    if (!isOpen) return;

    if (event) {
      setView("details");
      setSelectedType(event.type);
    } else {
      setView("select");
      setSelectedType("training");
    }
  }, [isOpen, event]);

  if (!isOpen || !selectedDate) return null;

  const displayDate = selectedDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="agenda-modal" role="presentation">
      <div className="agenda-modal__panel" role="dialog" aria-modal="true">
        {view === "details" && event && (
          <EventDetails
            event={event}
            onClose={onClose}
            onDelete={() => onDelete(event.id)}
            onEdit={() => setView("edit")}
          />
        )}

        {view === "select" && (
          <div className="agenda-event-select">
            <div className="agenda-modal__heading">
              <p>{displayDate}</p>
              <h2>Nouvel événement</h2>
            </div>

            <div className="agenda-event-select__choices">
              {eventChoices.map(({ type, label, Icon }) => (
                <button
                  key={type}
                  className={`agenda-event-choice agenda-event-choice--${type}`}
                  type="button"
                  onClick={() => {
                    setSelectedType(type);
                    setView("create");
                  }}
                >
                  <span className="agenda-event-choice__icon">
                    <Icon size={19} />
                  </span>
                  {label}
                </button>
              ))}
            </div>

            <button
              className="agenda-modal__dismiss"
              type="button"
              onClick={onClose}
            >
              <X size={18} />
              Annuler
            </button>
          </div>
        )}

        {view === "create" && (
          <EventForm
            type={selectedType}
            date={selectedDate}
            onBack={() => setView("select")}
            onSave={onCreate}
          />
        )}

        {view === "edit" && event && (
          <EventForm
            type={event.type}
            date={selectedDate}
            event={event}
            onBack={() => setView("details")}
            onSave={onUpdate}
          />
        )}
      </div>
    </div>
  );
}
