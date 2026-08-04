import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { theme } from "../../styles/theme";

type Props = {
  isOpen: boolean;

  title: string;

  defaultTitle?: string;

  defaultContent?: string;

  defaultImportantDate?: string;

  onClose: () => void;

  onSave: (
    title: string,
    content: string,
    importantDate: string
  ) => void;
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
  const [noteTitle, setNoteTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [
    importantDate,
    setImportantDate,
  ] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNoteTitle(defaultTitle);

      setContent(defaultContent);

      setImportantDate(
        defaultImportantDate
      );
    }
  }, [
    isOpen,
    defaultTitle,
    defaultContent,
    defaultImportantDate,
  ]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",

        inset: 0,

        background:
          "rgba(0,0,0,.70)",

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

          maxWidth: 550,

          background:
            theme.colors.card,

          border: `1px solid ${theme.colors.border}`,

          borderRadius: 22,

          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            marginBottom: 24,
          }}
        >
          <h2
            style={{
              margin: 0,

              color:
                theme.colors.primary,
            }}
          >
            {title}
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
              color={
                theme.colors.text
              }
            />
          </button>
        </div>

        <input
          value={noteTitle}
          onChange={(e) =>
            setNoteTitle(
              e.target.value
            )
          }
          placeholder="Titre"

          style={{
            width: "100%",

            marginBottom: 18,

            padding: 14,

            borderRadius: 14,

            border: `1px solid ${theme.colors.border}`,

            background:
              theme.colors.background,

            color:
              theme.colors.text,

            fontSize: 16,

            boxSizing:
              "border-box",
          }}
        />

        <input
          type="date"

          value={importantDate}

          onChange={(e) =>
            setImportantDate(
              e.target.value
            )
          }

          style={{
            width: "100%",

            marginBottom: 18,

            padding: 14,

            borderRadius: 14,

            border: `1px solid ${theme.colors.border}`,

            background:
              theme.colors.background,

            color:
              theme.colors.text,

            fontSize: 16,

            boxSizing:
              "border-box",
          }}
        />

        <textarea
          value={content}

          onChange={(e) =>
            setContent(
              e.target.value
            )
          }

          placeholder="Votre note..."

          rows={8}

          style={{
            width: "100%",

            resize: "none",

            padding: 14,

            borderRadius: 14,

            border: `1px solid ${theme.colors.border}`,

            background:
              theme.colors.background,

            color:
              theme.colors.text,

            fontSize: 16,

            boxSizing:
              "border-box",
          }}
        />

        <div
          style={{
            display: "flex",

            justifyContent:
              "flex-end",

            gap: 12,

            marginTop: 24,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding:
                "12px 20px",

              borderRadius: 12,

              border: `1px solid ${theme.colors.border}`,

              background:
                "transparent",

              color:
                theme.colors.text,

              cursor: "pointer",
            }}
          >
            Annuler
          </button>

          <button
            onClick={() =>
              onSave(
                noteTitle,
                content,
                importantDate
              )
            }
            style={{
              padding:
                "12px 20px",

              border: "none",

              borderRadius: 12,

              background:
                theme.colors.primary,

              color: "#000",

              fontWeight: 700,

              cursor: "pointer",
            }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}