import { theme } from "../../styles/theme";

type Props = {
  isEditing: boolean;
  onClick: () => void;
};

export default function SaveButton({
  isEditing,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        padding: "20px",
        marginTop: "15px",
        border: "none",
        borderRadius: "18px",
        cursor: "pointer",
        background: theme.colors.primary,
        color: "#111",
        fontSize: "20px",
        fontWeight: 700,
        transition: "0.25s",
        boxShadow: theme.shadow.card,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0)";
      }}
    >
      {isEditing
        ? "✏️ Mettre à jour la sortie"
        : "💾 Enregistrer la sortie"}
    </button>
  );
}