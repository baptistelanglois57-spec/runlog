import type { ReactNode } from "react";
import { theme } from "../../styles/theme";

type Props = {
  children: ReactNode;
};

export default function AppContainer({
  children,
}: Props) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        color: theme.colors.text,

        width: "100%",

        display: "flex",
        justifyContent: "center",

        padding: "30px 20px 110px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {children}
      </div>
    </main>
  );
}