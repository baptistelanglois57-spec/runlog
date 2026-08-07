import type { ReactNode } from "react";
import "./AppShell.css";

type Props = {
  children: ReactNode;
};

export default function AppContainer({
  children,
}: Props) {
  return (
    <main className="app-container">
      <div className="app-container__content">
        {children}
      </div>
    </main>
  );
}
