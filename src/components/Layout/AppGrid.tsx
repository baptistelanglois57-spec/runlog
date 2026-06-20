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
        gridTemplateColumns: `repeat(${columns}, minmax(280px,1fr))`,
        gap,
        width: "100%",
        maxWidth,
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}