import { useEffect, useState } from "react";

import { theme } from "../../styles/theme";

import EventForm from "./EventForm";
import EventDetails from "./EventDetails";

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

type View =
  | "select"
  | "create"
  | "details"
  | "edit";

export default function EventModal({
  isOpen,
  selectedDate,
  event,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: EventModalProps) {
  const [view, setView] =
    useState<View>("select");

  const [selectedType, setSelectedType] =
    useState<EventType>("training");

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

  const displayDate =
    selectedDate.toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

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
          borderRadius: "22px",
          border: `2px solid ${theme.colors.primary}`,
          padding: "28px",
          boxShadow: theme.shadow.card,
        }}
      >
        {/* DETAILS */}

        {view === "details" && event && (
          <EventDetails
            event={event}
            onClose={onClose}
            onDelete={() => onDelete(event.id)}
            onEdit={() => setView("edit")}
          />
        )}

        {/* CHOIX */}

        {view === "select" && (
          <>
            <h2
              style={{
                textAlign: "center",
                color: theme.colors.primary,
                marginTop: 0,
              }}
            >
               {displayDate}
            </h2>

            <p
              style={{
                textAlign: "center",
                marginBottom: "30px",
              }}
            >
              Que souhaites-tu ajouter ?
            </p>

            <button
              onClick={() => {
                setSelectedType("training");
                setView("create");
              }}
              style={{
                width: "100%",
                padding: "15px",
                border: "none",
                borderRadius: "14px",
                marginBottom: "15px",
                background:
                  theme.colors.primary,
                color: "#000",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🏃 Entraînement
            </button>

            <button
              onClick={() => {
                setSelectedType("race");
                setView("create");
              }}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "14px",
                border: `2px solid ${theme.colors.primary}`,
                background:
                  theme.colors.background,
                color: theme.colors.primary,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🏁 Course
            </button>

            <button
              onClick={onClose}
              style={{
                width: "100%",
                marginTop: "18px",
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
        )}

        {/* CREATION */}

        {view === "create" && (
          <EventForm
            type={selectedType}
            date={selectedDate}
            onBack={() => setView("select")}
            onSave={onCreate}
          />
        )}

        {/* MODIFICATION */}

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