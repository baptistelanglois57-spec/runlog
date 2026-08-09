import { CalendarDays, Pencil, Trash2, X } from "lucide-react";

import type { Note } from "../../types/Note";

type Props = {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function NoteDetailsModal({
  isOpen,
  note,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  if (!isOpen || !note) {
    return null;
  }

  return (
    <div className="notes-modal" role="presentation">
      <div
        className="notes-modal__panel notes-modal__panel--details"
        role="dialog"
        aria-modal="true"
      >
        <div className="notes-modal__header">
          <h2>{note.title}</h2>
          <button
            className="notes-modal__close-button"
            type="button"
            aria-label="Fermer"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>

        {note.importantDate && (
          <div className="note-details__date">
            <CalendarDays size={16} strokeWidth={2.2} />
            <span>Date importante : {note.importantDate}</span>
          </div>
        )}

        <div className="note-details__content">{note.content}</div>

        <footer className="note-details__footer">
          <span className="note-details__created-at">
            Créé le {new Date(note.createdAt).toLocaleDateString("fr-FR")}
          </span>

          <span className="note-details__actions">
            <button
              className="note-details__action-button"
              type="button"
              aria-label="Modifier"
              onClick={onEdit}
            >
              <Pencil size={18} />
            </button>
            <button
              className="note-details__action-button note-details__action-button--delete"
              type="button"
              aria-label="Supprimer"
              onClick={onDelete}
            >
              <Trash2 size={18} />
            </button>
          </span>
        </footer>
      </div>
    </div>
  );
}
