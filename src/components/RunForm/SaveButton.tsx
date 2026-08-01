import { Save } from "lucide-react";

import Button from "../UI/Button";

import { UI } from "../../styles/ui";

type Props = {
  isEditing: boolean;
  onClick: () => void;
};

export default function SaveButton({
  isEditing,
  onClick,
}: Props) {
  return (
    <Button
      variant="success"
      fullWidth
      onClick={onClick}
      style={{
  height: 56,

  borderRadius: UI.INPUT_RADIUS,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,

  color: "#000",

  fontSize: UI.FONT_SMALL,

  fontWeight: 700,

  whiteSpace: "nowrap",
}}
    >
      <Save size={18} />

      {isEditing
        ? "Mettre à jour"
        : "Enregistrer"}
    </Button>
  );
}