import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { theme } from "../../styles/theme";
import { UI } from "../../styles/ui";

type MonthNavigationProps = {
  month: Date;
  onPrevious: () => void;
  onNext: () => void;
};

export default function MonthNavigation({
  month,
  onPrevious,
  onNext,
}: MonthNavigationProps) {
  const monthName =
    month.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "44px 1fr 44px",
        alignItems: "center",
        gap: 16,
        marginBottom: 22,
      }}
    >
      <button
        onClick={onPrevious}
        style={{
          width: 44,
          height: 44,

          border: "none",

          borderRadius: 12,

          background:
            theme.colors.background,

          color: theme.colors.primary,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          cursor: "pointer",
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <h2
        style={{
          margin: 0,

          textAlign: "center",

          color: theme.colors.text,

          fontSize: UI.FONT_H2,

          fontWeight: 700,

          textTransform: "capitalize",

          whiteSpace: "nowrap",
        }}
      >
        {monthName}
      </h2>

      <button
        onClick={onNext}
        style={{
          width: 44,
          height: 44,

          border: "none",

          borderRadius: 12,

          background:
            theme.colors.background,

          color: theme.colors.primary,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          cursor: "pointer",
        }}
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}