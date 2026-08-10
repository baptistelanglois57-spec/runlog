import { Save } from "lucide-react";

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
      className="run-form-save"
      type="button"
      onClick={onClick}
      aria-label={
        isEditing
          ? "Enregistrer les modifications"
          : "Enregistrer la sortie"
      }
    >
      <Save size={16} aria-hidden="true" />
      <span>Enregistrer</span>
    </button>
  );
}
