import type {
  SelectHTMLAttributes,
} from "react";

import { theme } from "../../styles/theme";
import { Typography } from "../../styles/ui";

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
            fontSize: Typography.bodySecondary,
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
          fontSize: Typography.input,
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
