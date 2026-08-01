import type { InputHTMLAttributes } from "react";
import { theme } from "../../styles/theme";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function InputField(
  props: Props
) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        height: 54,
        padding: "0 16px",
        borderRadius: 14,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.background,
        color: theme.colors.text,
        fontSize: 16,
        outline: "none",
        boxSizing: "border-box",
        ...props.style,
      }}
    />
  );
}