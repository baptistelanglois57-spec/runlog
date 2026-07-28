import { theme } from "../../styles/theme";
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
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
    color: theme.colors.text,
    textAlign: "center",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  return (
    <tr>
      <td
        style={{
          textAlign: "center",
          padding: "10px",
          color: theme.colors.text,
          fontWeight: 700,
        }}
      >
        {index + 1}
      </td>

      <td style={{ padding: "8px" }}>
        <input
          type="number"
          min={0}
          value={set.reps}
          onChange={(e) =>
            onChange(
              index,
              "reps",
              Number(e.target.value)
            )
          }
          style={inputStyle}
        />
      </td>

      <td style={{ padding: "8px" }}>
  <input
    type="number"
    min={0}
    step="0.1"
    value={set.weight}
    onChange={(e) =>
      onChange(
        index,
        "weight",
        e.target.value === ""
          ? 0
          : Number(e.target.value.replace(",", "."))
      )
    }
    style={inputStyle}
  />
</td>

      <td
        style={{
          width: "60px",
          textAlign: "center",
        }}
      >
        <button
          type="button"
          onClick={() => onDelete(index)}
          style={{
            width: "34px",
            height: "34px",
            border: "none",
            borderRadius: "10px",
            background: theme.colors.danger,
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
          }}
        >
          🗑
        </button>
      </td>
    </tr>
  );
}