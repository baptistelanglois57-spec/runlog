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

        display: "flex",
        justifyContent: "center",

        padding: `
          calc(20px + env(safe-area-inset-top))
          clamp(16px, 4vw, 24px)
          calc(110px + env(safe-area-inset-bottom))
        `,

        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </main>
  );
}