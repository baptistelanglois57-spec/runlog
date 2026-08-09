import { CalendarDays, ChevronRight } from "lucide-react";

import type { Note } from "../../types/Note";

type Props = {
  note: Note;
  onClick: () => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NoteCard({ note, onClick }: Props) {
  return (
    <button className="note-card" type="button" onClick={onClick}>
      <span className="note-card__content">
        <span className="note-card__title">{note.title}</span>

        {note.importantDate && (
          <span className="note-card__date">
            <CalendarDays size={15} strokeWidth={2} />
            {formatDate(note.importantDate)}
          </span>
        )}

        <span className="note-card__excerpt">{note.content}</span>
      </span>

      <span className="note-card__chevron" aria-hidden="true">
        <ChevronRight size={20} strokeWidth={2.25} />
      </span>
    </button>
  );
}
