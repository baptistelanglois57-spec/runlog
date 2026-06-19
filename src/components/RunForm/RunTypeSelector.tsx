import { theme } from "../../styles/theme";

type Props = {
  type: "training" | "race";
  onChange: (
    type: "training" | "race"
  ) => void;
};

export default function RunTypeSelector({
  type,
  onChange,
}: Props) {
  function Card({
    selected,
    icon,
    title,
    subtitle,
    color,
    onClick,
  }: {
    selected: boolean;
    icon: string;
    title: string;
    subtitle: string;
    color: string;
    onClick: () => void;
  }) {
    return (
      <div
        onClick={onClick}
        style={{
          flex: 1,
          cursor: "pointer",
          background: selected
            ? color
            : theme.colors.card,
          border: selected
            ? `2px solid ${color}`
            : `1px solid ${theme.colors.border}`,
          borderRadius: "18px",
          padding: "25px",
          textAlign: "center",
          transition: "0.25s",
          boxShadow: selected
            ? theme.shadow.card
            : "none",
        }}
      >
        <div
          style={{
            fontSize: "42px",
            marginBottom: "12px",
          }}
        >
          {icon}
        </div>

        <h3
          style={{
            margin: 0,
            color: "white",
            fontSize: "22px",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            marginTop: "10px",
            marginBottom: 0,
            color: "rgba(255,255,255,.85)",
            fontSize: "15px",
          }}
        >
          {subtitle}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
      }}
    >
      <Card
        selected={type === "training"}
        icon="🏃"
        title="Entraînement"
        subtitle="Séance personnelle"
        color="#22c55e"
        onClick={() =>
          onChange("training")
        }
      />

      <Card
        selected={type === "race"}
        icon="🏁"
        title="Compétition"
        subtitle="Course officielle"
        color="#3b82f6"
        onClick={() =>
          onChange("race")
        }
      />
    </div>
  );
}