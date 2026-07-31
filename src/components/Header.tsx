import { UI } from "../styles/ui";
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        gap: 4,

        marginBottom: UI.SECTION_GAP,

        textAlign: "center",
      }}
    >
      <h1
        style={{
          margin: 0,

          color: theme.colors.text,

          fontSize: UI.FONT_HERO,

          fontWeight: 800,

          letterSpacing: "-1.5px",

          lineHeight: 1,
        }}
      >
        {title}
      </h1>

      <p
        style={{
          margin: 0,

          color: theme.colors.textSecondary,

          fontSize: UI.FONT_SMALL,

          fontWeight: 500,

          lineHeight: 1.2,
        }}
      >
        {subtitle}
      </p>
    </header>
  );
}