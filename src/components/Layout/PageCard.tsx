import type { ReactNode } from "react";
import { theme } from "../../styles/theme";

type Props = {
  children: ReactNode;
  maxWidth?: string;
};

export default function PageCard({
  children,
  maxWidth = "660px",
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

        padding: "clamp(18px, 4vw, 30px)",

        boxShadow: "none",

        boxSizing: "border-box",

        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}