import type { ButtonHTMLAttributes } from "react";
import { theme } from "../../styles/theme";

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
        fontSize: 16,
        cursor: "pointer",
        ...props.style,
      }}
    />
  );
}