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
        minHeight: "100dvh",

        background: theme.colors.background,
        color: theme.colors.text,

        width: "100%",
        maxWidth: "100vw",

        overflowX: "hidden",

        display: "flex",
        justifyContent: "center",

        paddingTop:
          "calc(20px + env(safe-area-inset-top))",

        paddingRight: "16px",

        paddingBottom:
          "calc(110px + env(safe-area-inset-bottom))",

        paddingLeft: "16px",

        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",

          margin: "0 auto",

          minWidth: 0,

          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </main>
  );
}