import { theme } from "../styles/theme";

type HeaderProps = {
  title: string;
  subtitle: string;
};

export default function Header({
  title,
  subtitle,
}: HeaderProps) {
  return (
    <header
      style={{
        marginBottom: "clamp(28px, 5vw, 40px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        textAlign: "center",
        width: "100%",
      }}
    >
      <h1
        style={{
          margin: 0,
          color: theme.colors.text,
          fontSize: "clamp(34px, 8vw, 42px)",
          fontWeight: 800,
          letterSpacing: "-1px",
          lineHeight: 1.1,
          wordBreak: "break-word",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          margin: 0,
          color: theme.colors.textSecondary,
          fontSize: "clamp(15px, 4vw, 18px)",
          fontWeight: 500,
          lineHeight: 1.4,
          maxWidth: "500px",
        }}
      >
        {subtitle}
      </p>
    </header>
  );
}