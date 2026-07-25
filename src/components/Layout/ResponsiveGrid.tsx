import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ResponsiveGrid({
  children,
}: Props) {
  return (
    <div
      style={{
        display: "grid",

        gridTemplateColumns:
          "repeat(auto-fit,minmax(280px,1fr))",

        gap: "18px",

        width: "100%",

        maxWidth: "760px",

        margin: "40px auto",
      }}
    >
      {children}
    </div>
  );
}