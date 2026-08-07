import type { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";
import "./Layout/AppShell.css";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="app-shell">
      {children}
      <BottomNavigation />
    </div>
  );
}
