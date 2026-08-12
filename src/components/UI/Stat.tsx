import { theme } from "../../styles/theme";
import { Typography, UI } from "../../styles/ui";

type Props = {
  icon?: string;
  title: string;
  value: string | number;
};

export default function Stat({
  icon,
  title,
  value,
}: Props) {
  return (
    <div
      style={{
        background: "rgba(231,217,196,.02)",

        border: `1px solid ${theme.colors.border}`,

        borderRadius: UI.RADIUS_SMALL,

        padding: 14,

        minHeight: 88,

        display: "flex",

        flexDirection: "column",

        justifyContent: "center",

        alignItems: "center",

        textAlign: "center",

        gap: 6,

        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          color: theme.colors.primary,
          fontSize: Typography.cardTitle,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: theme.colors.textSecondary,
          fontSize: UI.FONT_TINY,
          fontWeight: 600,
        }}
      >
        {title}
      </div>

      <strong
        style={{
          color: theme.colors.text,
          fontSize: Typography.cardTitle,
          lineHeight: 1.2,
        }}
      >
        {value}
      </strong>
    </div>
  );
}
