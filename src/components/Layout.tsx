import type { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      {children}
      <BottomNavigation />
    </>
  );
}