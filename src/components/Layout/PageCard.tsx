import type { ReactNode } from "react";
import { theme } from "../../styles/theme";

type Props = {
  children: ReactNode;
  maxWidth?: string;
};

export default function PageCard({
  children,
  
}: Props) {
  return (
    <div
      style={{
        maxWidth: "660px",
width: "100%",
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