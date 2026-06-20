import type {
  SelectHTMLAttributes,
} from "react";

import { theme } from "../../styles/theme";

type Props =
  SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    children: React.ReactNode;
  };

export default function Select({
  label,
  children,
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
          }}
        >
          {label}
        </label>
      )}

      <select
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

          ...style,
        }}
      >
        {children}
      </select>
    </div>
  );
}