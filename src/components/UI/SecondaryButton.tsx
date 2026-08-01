import { theme } from "../../styles/theme";

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

        fontSize: 15,

        cursor: "pointer",

        ...props.style,
      }}
    />
  );
}