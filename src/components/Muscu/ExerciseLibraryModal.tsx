import { useEffect, useState } from "react";

import { theme } from "../../styles/theme";

type Props = {
  isOpen: boolean;

  title: string;

  initialValue?: string;

  onClose: () => void;

  onSave: (value: string) => void;
};

export default function ExerciseLibraryModal({
  isOpen,
  title,
  initialValue = "",
  onClose,
  onSave,
}: Props) {
  const [value, setValue] =
    useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        style={{
          width: "min(92vw,420px)",
          background:
            theme.colors.card,
          borderRadius: 20,
          border: `1px solid ${theme.colors.border}`,
          padding: 22,
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 20,
            color:
              theme.colors.primary,
            textAlign: "center",
          }}
        >
          {title}
        </h2>

        <input
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          placeholder="Nom de l'exercice"
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 14,
            border: `1px solid ${theme.colors.border}`,
            background:
              theme.colors.background,
            color:
              theme.colors.text,
            fontSize: 16,
            boxSizing: "border-box",
            marginBottom: 22,
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
              fontWeight: 700,
            }}
          >
            Annuler
          </button>

          <button
            onClick={() => {
              if (!value.trim()) {
                return;
              }

              onSave(value.trim());

              onClose();
            }}
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 14,
              border: "none",
              background:
                theme.colors.primary,
              color: "#000",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}