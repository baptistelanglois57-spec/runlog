import { theme } from "../../styles/theme";

type Props = {
  name: string;
  setName: (value: string) => void;
};

export default function NameField({
  name,
  setName,
}: Props) {
  return (
    <div>
      <div
        style={{
          fontWeight: 700,
          marginBottom: "8px",
          color: theme.colors.text,
        }}
      >
        🏃 Nom de la sortie
      </div>

      <input
        type="text"
        placeholder="Ex : Sortie longue"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "16px",
          border: `1px solid ${theme.colors.border}`,
          background: theme.colors.background,
          color: theme.colors.text,
          fontSize: "17px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}