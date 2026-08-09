import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  title: string;
  defaultTitle?: string;
  defaultContent?: string;
  defaultImportantDate?: string;
  onClose: () => void;
  onSave: (title: string, content: string, importantDate: string) => void;
};

export default function NoteModal({
  isOpen,
  title,
  defaultTitle = "",
  defaultContent = "",
  defaultImportantDate = "",
  onClose,
  onSave,
}: Props) {
  const [noteTitle, setNoteTitle] = useState("");
  const [content, setContent] = useState("");
  const [importantDate, setImportantDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNoteTitle(defaultTitle);
      setContent(defaultContent);
      setImportantDate(defaultImportantDate);
    }
  }, [isOpen, defaultTitle, defaultContent, defaultImportantDate]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="notes-modal" role="presentation">
      <div className="notes-modal__panel" role="dialog" aria-modal="true">
        <div className="notes-modal__header">
          <h2>{title}</h2>
          <button
            className="notes-modal__close-button"
            type="button"
            aria-label="Fermer"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>

        <div className="notes-modal__fields">
          <input
            className="notes-modal__input"
            value={noteTitle}
            onChange={(event) => setNoteTitle(event.target.value)}
            placeholder="Titre"
          />

          <input
            className="notes-modal__input"
            type="date"
            value={importantDate}
            onChange={(event) => setImportantDate(event.target.value)}
          />

          <textarea
            className="notes-modal__textarea"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Votre note..."
            rows={8}
          />
        </div>

        <div className="notes-modal__actions">
          <button
            className="notes-modal__secondary-button"
            type="button"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="notes-modal__primary-button"
            type="button"
            onClick={() => onSave(noteTitle, content, importantDate)}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
