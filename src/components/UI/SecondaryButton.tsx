import { theme } from "../../styles/theme";
import { Typography } from "../../styles/ui";

type Props =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function SecondaryButton(
  props: Props
) {
  return (
    <button
      {...props}
      style={{
        height: 52,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: 14,

        background: theme.colors.card,

        color: theme.colors.text,

        fontWeight: 600,

        fontSize: Typography.button,

        cursor: "pointer",

        ...props.style,
      }}
    />
  );
}
