import { theme } from "../../styles/theme";

type Filter = "all" | "training" | "race";

type HistoryFiltersProps = {
  selected: Filter;
  onChange: (filter: Filter) => void;
};

export default function HistoryFilters({
  selected,
  onChange,
}: HistoryFiltersProps) {
  const buttons = [
    {
      value: "all" as const,
      label: "Tous",
      activeColor: theme.colors.primary,
      activeText: "#000",
    },
    {
      value: "training" as const,
      label: "🏃 Entraînements",
      activeColor: "#002473",
      activeText: "#fff",
    },
    {
      value: "race" as const,
      label: "🏁 Compétitions",
      activeColor: "#4a0101",
      activeText: "#fff",
    },
  ];

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto 30px",
        display: "flex",
        gap: "14px",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {buttons.map((button) => {
        const active = selected === button.value;

        return (
          <button
            key={button.value}
            onClick={() => onChange(button.value)}
            style={{
              minWidth: "180px",
              padding: "15px 22px",
              borderRadius: "16px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "16px",
              transition: "0.2s",
              background: active
                ? button.activeColor
                : theme.colors.card,
              color: active
                ? button.activeText
                : theme.colors.text,
              boxShadow: theme.shadow.card,
            }}
          >
            {button.label}
          </button>
        );
      })}
    </div>
  );
}