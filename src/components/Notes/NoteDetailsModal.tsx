import { X, Pencil, Trash2 } from "lucide-react";

import { theme } from "../../styles/theme";

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
    <div
      style={{
        position: "fixed",
        inset: 0,

        background: "rgba(0,0,0,.70)",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        padding: 20,

        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 650,

          maxHeight: "85vh",

          overflowY: "auto",

          background: theme.colors.card,

          border: `1px solid ${theme.colors.border}`,

          borderRadius: 22,

          padding: 26,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            marginBottom: 24,
          }}
        >
          <h2
            style={{
              margin: 0,

              color: theme.colors.text,

              fontSize: 28,
            }}
          >
            {note.title}
          </h2>

          <button
            onClick={onClose}
            style={{
              background: "none",

              border: "none",

              cursor: "pointer",
            }}
          >
            <X
              size={24}
              color={theme.colors.text}
            />
          </button>
        </div>

        {note.importantDate && (
          <div
            style={{
              marginBottom: 18,

              color: theme.colors.text,

              fontWeight: 700,

              fontSize: 15,
            }}
          >
            📅 Date importante :{" "}
            {note.importantDate}
          </div>
        )}

        <div
          style={{
            color: theme.colors.text,

            whiteSpace: "pre-wrap",

            lineHeight: 1.8,

            fontSize: 16,

            marginBottom: 30,
          }}
        >
          {note.content}
        </div>

        <div
          style={{
            paddingTop: 20,

            borderTop: `1px solid ${theme.colors.border}`,

            display: "flex",

            justifyContent: "space-between",

            alignItems: "center",
          }}
        >
          <div
            style={{
              color: theme.colors.text,

              fontSize: 13,
            }}
          >
            Créé le{" "}
            {new Date(
              note.createdAt
            ).toLocaleDateString(
              "fr-FR"
            )}
          </div>

          <div
            style={{
              display: "flex",

              gap: 12,
            }}
          >
            <button
              onClick={onEdit}
              style={{
                display: "flex",

                alignItems: "center",

                gap: 8,

                border: "none",

                cursor: "pointer",

                borderRadius: 12,

                padding:
                  "12px 18px",

                background:
                  "#0000003f",

                color: "#fff",

                fontWeight: 700,
              }}
            >
              <Pencil size={18} />

              
            </button>

            <button
              onClick={onDelete}
              style={{
                display: "flex",

                alignItems: "center",

                gap: 8,

                border: "none",

                cursor: "pointer",

                borderRadius: 12,

                padding:
                  "12px 18px",

                background:
                  "#0000003f",

                color: "#fff",

                fontWeight: 700,
              }}
            >
              <Trash2 size={18} />

              
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}