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
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "22px",
        padding: "35px",
        marginBottom: "35px",
        boxShadow: theme.shadow.card,
        textAlign: "center",
      }}
    >
      <h1
        style={{
          margin: 0,
          color: theme.colors.primary,
          fontSize: "40px",
          fontWeight: 700,
        }}
      >
        {isEditing
          ? "✏️ Modifier une sortie"
          : "🏃 Nouvelle sortie"}
      </h1>

      <p
        style={{
          marginTop: "15px",
          color: theme.colors.textSecondary,
          fontSize: "18px",
          lineHeight: 1.5,
        }}
      >
        {isEditing
          ? "Modifie les informations de ta sortie."
          : "Enregistre un entraînement ou une compétition."}
      </p>
    </div>
  );
}