import type {
  InputHTMLAttributes,
} from "react";

import { theme } from "../../styles/theme";
import { Typography } from "../../styles/ui";

type Props =
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
  };

export default function Input({
  label,
  style,
  ...props
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
      }}
    >
      {label && (
        <label
          style={{
            color: theme.colors.text,
            fontWeight: 600,
            fontSize: Typography.bodySecondary,
          }}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        style={{
          width: "100%",
          minHeight: "54px",

          padding: "14px 16px",

          borderRadius: "16px",

          border: `1px solid ${theme.colors.border}`,

          background: theme.colors.background,

          color: theme.colors.text,

          fontSize: Typography.input,

          outline: "none",

          boxSizing: "border-box",

          transition: "0.2s",

          WebkitAppearance: "none",

          MozAppearance: "textfield",

          ...style,
        }}
      />
    </div>
  );
}
