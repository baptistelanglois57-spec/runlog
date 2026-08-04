import { CalendarDays, ChevronRight } from "lucide-react";

import { theme } from "../../styles/theme";

import type { Note } from "../../types/Note";

type Props = {
  note: Note;
  onClick: () => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

export default function NoteCard({
  note,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",

        border: `1px solid ${theme.colors.border}`,

        borderRadius: 20,

        background: theme.colors.card,

        cursor: "pointer",

        padding: 18,

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        transition: ".2s",

        marginBottom: 14,
      }}
    >
      <div
  style={{
    flex: 1,

    minWidth: 0,

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    textAlign: "center",
  }}
>
        <div
          style={{
            color: theme.colors.text,

            fontSize: 19,

            fontWeight: 700,

            marginBottom: 10,

            overflow: "hidden",

            textOverflow: "ellipsis",

            whiteSpace: "nowrap",
          }}
        >
          {note.title}
        </div>

        {note.importantDate && (
          <div
  style={{
    display: "flex",

    alignItems: "center",

    gap: 8,

    color: theme.colors.text,

    fontWeight: 600,

    fontSize: 14,

    marginBottom: 8,
  }}
>
  <CalendarDays size={16} />

  {formatDate(
    note.importantDate
  )}
</div>
        )}

        <div
          style={{
            color: theme.colors.text,

fontWeight: 600,

            fontSize: 14,

            lineHeight: 1.45,

            overflow: "hidden",

            display: "-webkit-box",

            WebkitLineClamp: 2,

            WebkitBoxOrient:
              "vertical",
          }}
        >
          {note.content}
        </div>
      </div>

      <ChevronRight
        size={22}
        color={
          theme.colors.primary
        }
      />
    </button>
  );
}