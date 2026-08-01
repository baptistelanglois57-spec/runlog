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
        gridTemplateColumns: "48px 1fr 48px",

        alignItems: "center",

        gap: 12,

        width: "100%",

        marginBottom: 18,
      }}
    >
      <button
        onClick={onPrevious}
        style={{
          width: 48,
          height: 48,

          border: `1px solid ${theme.colors.border}`,

          borderRadius: 14,

          background: theme.colors.card,

          color: theme.colors.primary,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          cursor: "pointer",

          transition: UI.TRANSITION,
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <h2
        style={{
          margin: 0,

          textAlign: "center",

          color: theme.colors.text,

          fontSize: 24,

          fontWeight: 800,

          textTransform: "capitalize",

          whiteSpace: "nowrap",
        }}
      >
        {monthName}
      </h2>

      <button
        onClick={onNext}
        style={{
          width: 48,
          height: 48,

          border: `1px solid ${theme.colors.border}`,

          borderRadius: 14,

          background: theme.colors.card,

          color: theme.colors.primary,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          cursor: "pointer",

          transition: UI.TRANSITION,
        }}
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}