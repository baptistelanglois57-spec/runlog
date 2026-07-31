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

        background: "rgba(212,175,55,.10)",

        border: "1px solid rgba(212,175,55,.15)",

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