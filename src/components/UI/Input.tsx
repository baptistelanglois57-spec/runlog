import type {
  InputHTMLAttributes,
} from "react";

import { theme } from "../../styles/theme";

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
            fontSize: "15px",
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

          fontSize: "16px",

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