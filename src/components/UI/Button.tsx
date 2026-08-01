import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { theme } from "../../styles/theme";

type Variant =
  | "primary"
  | "success"
  | "danger"
  | "secondary";

type Props =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: Variant;
    fullWidth?: boolean;
  };

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  style,
  ...props
}: Props) {
  const colors = {
    primary: theme.colors.primary,
    success: theme.colors.primary,
    danger: "#ef4444",
    secondary: theme.colors.card,
  };

  return (
    <button
      {...props}
      style={{
        background: colors[variant],

        color:
          variant === "secondary"
            ? theme.colors.text
            : "#000",

        border:
          variant === "secondary"
            ? `1px solid ${theme.colors.border}`
            : "none",

        borderRadius: "14px",

        padding: "14px 22px",

        fontSize: "16px",

        fontWeight: 700,

        cursor: "pointer",

        transition: "all .2s ease",

        width: fullWidth
          ? "100%"
          : undefined,

        boxShadow: theme.shadow.card,

        ...style,
      }}
    >
      {children}
    </button>
  );
}