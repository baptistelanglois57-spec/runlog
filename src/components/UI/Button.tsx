import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { theme } from "../../styles/theme";
import { Typography } from "../../styles/ui";

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
    danger: theme.colors.danger,
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
            : theme.colors.text,

        border:
          variant === "secondary"
            ? `1px solid ${theme.colors.border}`
            : "none",

        borderRadius: "14px",

        padding: "14px 22px",

        fontSize: Typography.button,

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
