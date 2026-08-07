import type { ReactNode } from "react";

type RecordSectionProps = {
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
};

export default function RecordSection({
  title,
  children,
  fullWidth = false,
}: RecordSectionProps) {
  return (
    <section
      className={`records-section${
        fullWidth ? " records-section--full-width" : ""
      }`}
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
