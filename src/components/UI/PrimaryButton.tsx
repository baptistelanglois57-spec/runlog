import type { ButtonHTMLAttributes } from "react";
import { theme } from "../../styles/theme";
import { Typography } from "../../styles/ui";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function PrimaryButton(
  props: Props
) {
  return (
    <button
      {...props}
      style={{
        height: 52,
        border: "none",
        borderRadius: 14,
        background: theme.colors.primary,
        color: "#000",
        fontWeight: 700,
        fontSize: Typography.button,
        cursor: "pointer",
        ...props.style,
      }}
    />
  );
}
