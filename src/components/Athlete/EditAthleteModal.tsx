import { useEffect, useState } from "react";

import { theme } from "../../styles/theme";
import { Typography } from "../../styles/ui";

type Props = {
  isOpen: boolean;

  title: string;

  value: string;

  onClose: () => void;

  onSave: (value: string) => void;
};

export default function EditAthleteModal({
  isOpen,
  title,
  value,
  onClose,
  onSave,
}: Props) {
  const [input, setInput] =
    useState(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",

        inset: 0,

        background:
          "rgba(0,0,0,.65)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: 20,

        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "100%",

          maxWidth: 420,

          background:
            theme.colors.card,

          border: `1px solid ${theme.colors.border}`,

          borderRadius: 20,

          padding: 22,
        }}
      >
        <h2
          style={{
            marginTop: 0,

            marginBottom: 20,

            color:
              theme.colors.primary,
          }}
        >
          Modifier
        </h2>

        <div
          style={{
            color:
              theme.colors.textSecondary,

            marginBottom: 10,
          }}
        >
          {title}
        </div>

        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          style={{
            width: "100%",

            boxSizing:
              "border-box",

            padding: 14,

            borderRadius: 14,

            border: `1px solid ${theme.colors.border}`,

            background:
              "#111",

            color:
              theme.colors.text,

            fontSize: Typography.input,

            marginBottom: 24,
          }}
        />

        <div
          style={{
            display: "flex",

            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,

              padding: 14,

              borderRadius: 14,

              border: `1px solid ${theme.colors.border}`,

              background:
                theme.colors.card,

              color:
                theme.colors.text,

              cursor: "pointer",
            }}
          >
            Annuler
          </button>

          <button
            onClick={() =>
              onSave(input)
            }
            style={{
              flex: 1,

              padding: 14,

              border: "none",

              borderRadius: 14,

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
