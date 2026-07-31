import type { ReactNode } from "react";

import { theme } from "../../styles/theme";
import { UI } from "../../styles/ui";

type Props = {
  children: ReactNode;
  padding?: number;
  radius?: number;
  style?: React.CSSProperties;
};

export default function Card({
  children,
  padding = UI.CARD_PADDING,
  radius = UI.RADIUS,
  style,
}: Props) {
  return (
    <div
      style={{
        background: theme.colors.card,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: radius,

        padding,

        width: "100%",

        boxSizing: "border-box",

        transition: UI.TRANSITION,

        ...style,
      }}
    >
      {children}
    </div>
  );
}