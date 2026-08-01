import type { CSSProperties } from "react";

import { Trash2 } from "lucide-react";

import { theme } from "../../styles/theme";
import { UI } from "../../styles/ui";

import type { GymSet } from "../../types/Gym/GymSet";

type Props = {
  index: number;
  set: GymSet;
  onChange: (
    index: number,
    field: "reps" | "weight",
    value: number
  ) => void;

  onDelete: (index: number) => void;
};

export default function SetRow({
  index,
  set,
  onChange,
  onDelete,
}: Props) {
  const inputStyle: CSSProperties = {
    width: "100%",

    height: 46,

    borderRadius: 12,

    border: `1px solid ${theme.colors.border}`,

    background: theme.colors.background,

    color: theme.colors.text,

    textAlign: "center",

    fontSize: UI.FONT_BODY,

    fontWeight: 600,

    boxSizing: "border-box",

    outline: "none",
  };

  return (
    <tr>
      <td
        style={{
          textAlign: "center",
          fontWeight: 700,
          color: theme.colors.primary,
          padding: "10px 6px",
          width: 45,
        }}
      >
        {index + 1}
      </td>

      <td
        style={{
          padding: "6px",
        }}
      >
        <input
          type="number"
          min={0}
          value={set.reps ?? ""}
          placeholder="-"
          onChange={(e) =>
            onChange(
              index,
              "reps",
              e.target.value === ""
                ? undefined!
                : Number(
                    e.target.value
                  )
            )
          }
          style={inputStyle}
        />
      </td>

      <td
        style={{
          padding: "6px",
        }}
      >
        <input
          type="number"
          min={0}
          step="0.5"
          value={set.weight ?? ""}
          placeholder="-"
          onChange={(e) =>
            onChange(
              index,
              "weight",
              e.target.value === ""
                ? undefined!
                : Number(
                    e.target.value.replace(
                      ",",
                      "."
                    )
                  )
            )
          }
          style={inputStyle}
        />
      </td>

      <td
        style={{
          width: 46,
          textAlign: "center",
        }}
      >
        <button
          type="button"
          onClick={() =>
            onDelete(index)
          }
          style={{
            background: "transparent",

            border: "none",

            cursor: "pointer",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            margin: "auto",

            color: theme.colors.danger,
          }}
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}