import { useState } from "react";

import { theme } from "../../styles/theme";
import { formatDateKey } from "../../utils/dateKey";

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

  const displayDate = date.toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          color: theme.colors.primary,
          marginTop: 0,
          marginBottom: "8px",
        }}
      >
        {isEditing
          ? type === "training"
            ? "✏️ Modifier l'entraînement"
            : "✏️ Modifier la course"
          : type === "training"
          ? "🏃 Nouvel entraînement"
          : "🏁 Nouvelle course"}
      </h2>

      <p
        style={{
          textAlign: "center",
          color: theme.colors.textSecondary,
          marginBottom: "28px",
        }}
      >
        📅 {displayDate}
      </p>

      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: 600,
        }}
      >
        Nom
      </label>

      <input
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder={
          type === "training"
            ? "Ex : Sortie EF"
            : "Ex : Semi de Paris"
        }
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: `1px solid ${theme.colors.border}`,
          background: theme.colors.background,
          color: theme.colors.text,
          marginBottom: "22px",
          boxSizing: "border-box",
          fontSize: "16px",
        }}
      />

      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: 600,
        }}
      >
        Notes
      </label>

      <textarea
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
        rows={5}
        placeholder="Ajouter une note..."
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: `1px solid ${theme.colors.border}`,
          background: theme.colors.background,
          color: theme.colors.text,
          resize: "none",
          marginBottom: "28px",
          boxSizing: "border-box",
          fontSize: "15px",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "12px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "12px",
            border: `1px solid ${theme.colors.border}`,
            background: "transparent",
            color: theme.colors.text,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ← Retour
        </button>

        <button
          onClick={handleSave}
          style={{
            flex: 2,
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: theme.colors.primary,
            color: "#000",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          {isEditing
            ? "💾 Enregistrer"
            : "Créer"}
        </button>
      </div>
    </div>
  );
}