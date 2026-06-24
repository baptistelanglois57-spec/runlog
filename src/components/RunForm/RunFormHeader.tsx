import { theme } from "../../styles/theme";

type RunFormHeaderProps = {
  isEditing: boolean;
};

export default function RunFormHeader({
  isEditing,
}: RunFormHeaderProps) {
  return (
    <div
      style={{
        marginBottom: "20px",
      }}
    >
      <h1
        style={{
          margin: 0,
          color: theme.colors.primary,
          fontSize: "26px",
          fontWeight: 700,
        }}
      >
        {isEditing
          ? "✏️ Modifier une sortie"
          : "🏃 Nouvelle sortie"}
      </h1>
    </div>
  );
}