import { theme } from "../../styles/theme";

type RecordSectionProps = {
  title: string;
  icon: string;
  children: React.ReactNode;
};

export default function RecordSection({
  title,
  icon,
  children,
}: RecordSectionProps) {
  return (
    <section
      style={{
        maxWidth: "950px",
        margin: "0 auto 35px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <span
          style={{
            fontSize: "28px",
          }}
        >
          {icon}
        </span>

        <h2
          style={{
            margin: 0,
            color: theme.colors.primary,
            fontSize: "28px",
          }}
        >
          {title}
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {children}
      </div>
    </section>
  );
}