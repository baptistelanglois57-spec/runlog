import { useState } from "react";

import { theme } from "../../styles/theme";
import EventForm from "./EventForm";

import { saveEvent } from "../../services/eventStorage";

type EventModalProps = {
  isOpen: boolean;
  selectedDate: Date | null;

  onClose: () => void;
  onSave: () => void;
};

export default function EventModal({
  isOpen,
  selectedDate,
  onClose,
  onSave,
}: EventModalProps) {
  const [selectedType, setSelectedType] = useState<
    "training" | "race" | null
  >(null);

  if (!isOpen || !selectedDate) return null;

  const displayDate = selectedDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.65)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "430px",
          background: theme.colors.card,
          border: `2px solid ${theme.colors.primary}`,
          borderRadius: "22px",
          padding: "30px",
          boxShadow: theme.shadow.card,
        }}
      >
        {!selectedType ? (
          <>
            <h2
              style={{
                textAlign: "center",
                marginTop: 0,
                color: theme.colors.primary,
              }}
            >
              📅 {displayDate}
            </h2>

            <p
              style={{
                textAlign: "center",
                color: theme.colors.textSecondary,
                marginBottom: "30px",
              }}
            >
              Que souhaites-tu ajouter ?
            </p>

            <button
              onClick={() => setSelectedType("training")}
              style={{
                width: "100%",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "14px",
                border: "none",
                background: theme.colors.primary,
                color: "#000",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              🏃 Entraînement
            </button>

            <button
              onClick={() => setSelectedType("race")}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "14px",
                border: `2px solid ${theme.colors.primary}`,
                background: theme.colors.background,
                color: theme.colors.primary,
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              🏁 Course
            </button>

            <button
              onClick={() => {
                setSelectedType(null);
                onClose();
              }}
              style={{
                width: "100%",
                marginTop: "25px",
                padding: "12px",
                borderRadius: "12px",
                border: `1px solid ${theme.colors.border}`,
                background: "transparent",
                color: theme.colors.text,
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
          </>
        ) : (
          <EventForm
            type={selectedType}
            date={selectedDate}
            onBack={() => setSelectedType(null)}
            onSave={(event) => {
              saveEvent(event);

              setSelectedType(null);

              onClose();

              onSave();
            }}
          />
        )}
      </div>
    </div>
  );
}