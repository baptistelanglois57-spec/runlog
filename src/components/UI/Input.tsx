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
        gap: "8px",
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
          padding: "16px",
          borderRadius: "14px",
          border: `1px solid ${theme.colors.border}`,
          background: "#13213a",
          color: theme.colors.text,
          fontSize: "16px",
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          transition: "0.2s",

          ...style,
        }}
      />
    </div>
  );
}