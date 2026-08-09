import { useState } from "react";
import { Activity, CalendarDays, Dumbbell, Flag } from "lucide-react";

import { formatDateKey } from "../../utils/dateKey";
import type { Event, EventType } from "../../types/Event";
import FormLabel from "../UI/FormLabel";
import InputField from "../UI/InputField";
import PrimaryButton from "../UI/PrimaryButton";
import SecondaryButton from "../UI/SecondaryButton";
import TextareaField from "../UI/TextareaField";

type EventFormProps = {
  type: EventType;
  date: Date;
  event?: Event;
  onBack: () => void;
  onSave: (event: Event) => void;
};

function getEventPresentation(type: EventType) {
  if (type === "training") return { label: "Entraînement", Icon: Activity };
  if (type === "gym") return { label: "Salle", Icon: Dumbbell };
  return { label: "Course", Icon: Flag };
}

export default function EventForm({
  type,
  date,
  event,
  onBack,
  onSave,
}: EventFormProps) {
  const [name, setName] = useState(event?.name ?? "");
  const [notes, setNotes] = useState(event?.notes ?? "");
  const isEditing = !!event;
  const { label, Icon } = getEventPresentation(type);

  function handleSave() {
    if (!name.trim()) {
      return;
    }

    onSave({
      id: event?.id ?? crypto.randomUUID(),
      date: formatDateKey(date),
      type,
      name: name.trim(),
      notes: notes.trim(),
    });
  }

  const displayDate = date
    ? date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="agenda-event-form">
      <header className="agenda-event-form__header">
        <span className={`agenda-event-form__type agenda-event-form__type--${type}`}>
          <Icon size={19} />
        </span>
        <div>
          <h2>{label}</h2>
          <p>
            <CalendarDays size={14} />
            {displayDate}
          </p>
        </div>
      </header>

      <div className="agenda-event-form__fields">
        <div>
          <FormLabel>Nom</FormLabel>
          <InputField
            value={name}
            onChange={(input) => setName(input.target.value)}
            placeholder={
              type === "training"
                ? "Ex : Sortie EF"
                : type === "gym"
                  ? "Ex : Haut du corps"
                  : "Ex : Semi de Paris"
            }
          />
        </div>

        <div>
          <FormLabel>Notes</FormLabel>
          <TextareaField
            value={notes}
            onChange={(input) => setNotes(input.target.value)}
            placeholder="Ajouter une note..."
            rows={6}
          />
        </div>
      </div>

      <div className="agenda-event-form__actions">
        <SecondaryButton onClick={onBack}>Retour</SecondaryButton>
        <PrimaryButton onClick={handleSave}>
          {isEditing ? "Enregistrer" : "Créer"}
        </PrimaryButton>
      </div>
    </div>
  );
}
