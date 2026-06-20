import Button from "../UI/Button";

type Props = {
  isEditing: boolean;
  onClick: () => void;
};

export default function SaveButton({
  isEditing,
  onClick,
}: Props) {
  return (
    <div
      style={{
        marginTop: "35px",
      }}
    >
      <Button
        variant="success"
        fullWidth
        onClick={onClick}
        style={{
          padding: "18px",
          fontSize: "18px",
        }}
      >
        {isEditing
          ? "💾 Mettre à jour la sortie"
          : "💾 Enregistrer la sortie"}
      </Button>
    </div>
  );
}