import type { ReactNode } from "react";


import { UI } from "../../styles/ui";

type Props = {
  children: ReactNode;
};

export default function IconBox({
  children,
}: Props) {
  return (
    <div
      style={{
        width: UI.ICON_BOX,
        height: UI.ICON_BOX,

        borderRadius: UI.RADIUS_SMALL,

        background: "rgba(125,35,53,.10)",

        border: "1px solid rgba(125,35,53,.18)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}
