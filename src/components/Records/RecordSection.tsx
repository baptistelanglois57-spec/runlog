import type { ReactNode } from "react";

import { theme } from "../../styles/theme";

type RecordSectionProps = {
  title: string;
  children: ReactNode;
};

export default function RecordSection({
  title,
  children,
}: RecordSectionProps) {
  return (
    <section
      style={{
        width: "100%",
        marginBottom: 42,
      }}
    >
      {/* Titre */}

      <h2
        style={{
          margin: "0 0 22px 0",

          color: theme.colors.text,

          fontSize: 28,

          fontWeight: 800,

          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>

      {/* Cartes */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",

          gap: 18,

          width: "100%",
        }}
      >
        {children}
      </div>
    </section>
  );
}