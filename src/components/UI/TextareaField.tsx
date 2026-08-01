import { theme } from "../../styles/theme";

type Props =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextareaField(
  props: Props
) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",

        minHeight: 130,

        padding: 16,

        borderRadius: 14,

        border: `1px solid ${theme.colors.border}`,

        background: theme.colors.background,

        color: theme.colors.text,

        resize: "vertical",

        fontSize: 15,

        outline: "none",

        boxSizing: "border-box",

        ...props.style,
      }}
    />
  );
}