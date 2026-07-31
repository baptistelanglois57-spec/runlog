import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  columns?: number;
  gap?: number;
  maxWidth?: string;
};

export default function AppGrid({
  children,
  columns = 2,
  gap = 20,
  maxWidth = "900px",
}: Props) {
  return (
    <div
      style={{
        display: "grid",

        gridTemplateColumns:
          columns === 1
            ? "1fr"
            : "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",

        gap: `${gap}px`,

        width: "100%",
        maxWidth,
        margin: "0 auto",

        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}