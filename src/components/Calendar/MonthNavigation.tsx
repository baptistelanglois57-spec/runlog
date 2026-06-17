import { theme } from "../../styles/theme";

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
  const monthName = month.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "35px",
      }}
    >
      <button
        onClick={onPrevious}
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "50%",
          border: `1px solid ${theme.colors.primary}`,
          background: theme.colors.card,
          color: theme.colors.primary,
          fontSize: "22px",
          cursor: "pointer",
        }}
      >
        ←
      </button>

      <h2
        style={{
          margin: 0,
          color: theme.colors.text,
          fontSize: "32px",
          textTransform: "capitalize",
        }}
      >
        {monthName}
      </h2>

      <button
        onClick={onNext}
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "50%",
          border: `1px solid ${theme.colors.primary}`,
          background: theme.colors.card,
          color: theme.colors.primary,
          fontSize: "22px",
          cursor: "pointer",
        }}
      >
        →
      </button>
    </div>
  );
}