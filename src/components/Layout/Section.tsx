import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  marginTop?: number;
};

export default function Section({
  children,
  marginTop = 30,
}: Props) {
  return (
    <section
      style={{
        marginTop,
        width: "100%",
      }}
    >
      {children}
    </section>
  );
}