import { theme } from "../styles/theme";

type StatsCardProps = {
  title: string;
  value: string;
  icon: string;
};

export default function StatsCard({
  title,
  value,
  icon,
}: StatsCardProps) {
  const parts = value.split(" ");
  const number = parts[0];
  const unit = parts.slice(1).join(" ");

  return (
  <div
    style={{
      background: theme.colors.card,
      border: `1px solid ${theme.colors.primary}`,
      borderRadius: theme.radius.large,
      boxShadow: theme.shadow.card,
      padding: "22px",
      minHeight: "185px",

      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Ligne du haut */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: "rgba(212,175,55,.12)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
        }}
      >
        {icon}
      </div>

      <span
        style={{
          fontSize: "19px",
          fontWeight: 700,
          color: theme.colors.text,
        }}
      >
        {title}
      </span>
    </div>

    {/* Centre */}
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: "48px",
          fontWeight: 700,
          color: theme.colors.text,
          lineHeight: 1,
        }}
      >
        {number}
      </div>

      {unit && (
        <div
          style={{
            marginTop: "8px",
            color: theme.colors.primary,
            fontWeight: 700,
            fontSize: "22px",
          }}
        >
          {unit}
        </div>
      )}
    </div>
  </div>
);
}
