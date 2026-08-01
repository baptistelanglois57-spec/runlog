import type { ReactNode } from "react";

import { theme } from "../../styles/theme";

type RecordSectionProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
};

export default function RecordSection({
  title,
  icon,
  children,
}: RecordSectionProps) {
  return (
    <section
      style={{
        maxWidth: "100%",
        margin: "0 auto 30px",
      }}
    >
      {/* Titre */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            color: theme.colors.primary,
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </div>

        <h2
          style={{
            margin: 0,
            color: theme.colors.primary,
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          {title}
        </h2>

        <div
          style={{
            flex: 1,
            height: 1,
            background: theme.colors.border,
            marginLeft: 6,
          }}
        />
      </div>

      {/* Cartes */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: 16,
        }}
      >
        {children}
      </div>
    </section>
  );
}