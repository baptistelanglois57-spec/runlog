import type { ReactNode } from "react";

type RecordSectionProps = {
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
  variant?: "grid" | "list";
};

export default function RecordSection({
  title,
  children,
  fullWidth = false,
  variant = "grid",
}: RecordSectionProps) {
  return (
    <section
      className={`records-section${
        fullWidth ? " records-section--full-width" : ""
      }${variant === "list" ? " records-section--list" : ""}`}
    >
      {/* Titre */}

      <h2>
        {title}
      </h2>

      {/* Cartes */}

      <div className="records-section__grid">
        {children}
      </div>
    </section>
  );
}
