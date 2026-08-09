import type { InputHTMLAttributes } from "react";
import { theme } from "../../styles/theme";
import { Typography } from "../../styles/ui";

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
        fontSize: Typography.input,
        outline: "none",
        boxSizing: "border-box",
        ...props.style,
      }}
    />
  );
}
