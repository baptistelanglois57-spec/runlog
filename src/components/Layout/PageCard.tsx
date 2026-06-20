import type { ReactNode } from "react";
import { theme } from "../../styles/theme";

type Props = {
  children: ReactNode;
  maxWidth?: string;
};

export default function PageCard({
  children,
  maxWidth = "650px",
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "22px",
        padding: "30px",
        boxShadow: "none",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}