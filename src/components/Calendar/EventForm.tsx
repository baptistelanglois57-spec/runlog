import { useState } from "react";

import { theme } from "../../styles/theme";
import { formatDateKey } from "../../utils/dateKey";

import FormLabel from "../UI/FormLabel";
import InputField from "../UI/InputField";
import TextareaField from "../UI/TextareaField";
import PrimaryButton from "../UI/PrimaryButton";
import SecondaryButton from "../UI/SecondaryButton";

import type { Event, EventType } from "../../types/Event";

type EventFormProps = {
  type: EventType;

  date: Date;

  event?: Event;

  onBack: () => void;

  onSave: (event: Event) => void;
};

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

  function handleSave() {
    if (!name.trim()) {
      return;
    }

    const newEvent: Event = {
      id: event?.id ?? crypto.randomUUID(),

      date: formatDateKey(date),

      type,

      name: name.trim(),

      notes: notes.trim(),
    };

    onSave(newEvent);
  }

  const displayDate = date
  ? date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  : "";

  return (
  <div>
    <h2
      style={{
        textAlign: "center",
        marginTop: 0,
        marginBottom: 8,
        color: theme.colors.text,
        fontSize: 30,
        fontWeight: 700,
      }}
    >
      {type === "training"
        ? "🏃 Entraînement"
        : type === "gym"
        ? "💪 Salle"
        : "🏁 Course"}
    </h2>

    <p
      style={{
        textAlign: "center",
        color: theme.colors.textSecondary,
        marginBottom: 28,
        fontSize: 16,
      }}
    >
      📅 {displayDate}
    </p>

    <FormLabel>Nom</FormLabel>

    <InputField
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder={
        type === "training"
          ? "Ex : Sortie EF"
          : type === "gym"
          ? "Ex : Haut du corps"
          : "Ex : Semi de Paris"
      }
      style={{
        marginBottom: 24,
      }}
    />

    <FormLabel>Notes</FormLabel>

    <TextareaField
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Ajouter une note..."
      rows={6}
      style={{
        marginBottom: 28,
      }}
    />

    <div
      style={{
        display: "flex",
        gap: 12,
      }}
    >
      <SecondaryButton
        onClick={onBack}
        style={{
          flex: 1,
        }}
      >
        Retour
      </SecondaryButton>

      <PrimaryButton
        onClick={handleSave}
        style={{
          flex: 2,
        }}
      >
        {isEditing ? "Enregistrer" : "Créer"}
      </PrimaryButton>
    </div>
  </div>
);
}