import { Tag } from "lucide-react";

import { theme } from "../../styles/theme";
import { UI } from "../../styles/ui";

type RunFormHeaderProps = {
  isEditing: boolean;
};

export default function RunFormHeader(
  {}: RunFormHeaderProps
) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
      }}
    >
      <Tag
        size={20}
        color={theme.colors.primary}
      />

      <span
        style={{
          color: theme.colors.text,
          fontSize: UI.FONT_H2,
          fontWeight: 700,
        }}
      >
        Nom
      </span>
    </div>
  );
}