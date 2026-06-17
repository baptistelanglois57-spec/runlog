import { useState } from "react";

import { theme } from "../../styles/theme";
import { formatDateKey } from "../../utils/dateKey";

type EventFormProps = {
  type: "training" | "race";
  date: Date;

  onBack: () => void;

  onSave: (event: {
    id: number;
    date: string;
    type: "training" | "race";
    name: string;
    notes: string;
  }) => void;
};

export default function EventForm({
  type,
  date,
  onBack,
  onSave,
}: EventFormProps) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  function handleSave() {
    if (!name.trim()) return;

    onSave({
      id: Date.now(),

      date: formatDateKey(date),

      type,

      name: name.trim(),

      notes: notes.trim(),
    });
  }

  const displayDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          color: theme.colors.primary,
          marginTop: 0,
          marginBottom: "10px",
        }}
      >
        {type === "training"
          ? "🏃 Nouvel entraînement"
          : "🏁 Nouvelle course"}
      </h2>

      <p
        style={{
          textAlign: "center",
          color: theme.colors.textSecondary,
          marginBottom: "30px",
        }}
      >
        📅 {displayDate}
      </p>

      {/* Nom */}

      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: theme.colors.text,
          fontWeight: 600,
        }}
      >
        Nom
      </label>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={
          type === "training"
            ? "Ex : Footing EF"
            : "Ex : Trail des Vosges"
        }
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: `1px solid ${theme.colors.border}`,
          background: theme.colors.background,
          color: theme.colors.text,
          marginBottom: "20px",
          fontSize: "16px",
          boxSizing: "border-box",
        }}
      />

      {/* Notes */}

      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: theme.colors.text,
          fontWeight: 600,
        }}
      >
        Notes
      </label>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Ajouter une note..."
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: `1px solid ${theme.colors.border}`,
          background: theme.colors.background,
          color: theme.colors.text,
          resize: "none",
          marginBottom: "25px",
          fontSize: "15px",
          boxSizing: "border-box",
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
          }}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}