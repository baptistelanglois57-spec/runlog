import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

type RunFormHeaderProps = {
  isEditing: boolean;
  onBack: () => void;
  children: ReactNode;
};

export default function RunFormHeader(
  { isEditing, onBack, children }: RunFormHeaderProps
) {
  return (
    <header className="run-form-header">
      <button
        className="run-form-header__back"
        type="button"
        onClick={onBack}
        aria-label="Retour"
      >
        <ChevronLeft size={21} aria-hidden="true" />
      </button>

      <h1>{isEditing ? "Modifier la sortie" : "Nouvelle sortie"}</h1>

      <div className="run-form-header__save">{children}</div>
    </header>
  );
}
