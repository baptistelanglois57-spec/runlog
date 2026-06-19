import { theme } from "../../styles/theme";

type RecordCardProps = {
  icon: string;
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
};

export default function RecordCard({
  icon,
  title,
  value,
  subtitle,
  color,
}: RecordCardProps) {
  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${
          color ?? theme.colors.border
        }`,
        borderRadius: "20px",
        padding: "22px",
        boxShadow: theme.shadow.card,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <span
          style={{
            fontSize: "28px",
          }}
        >
          {icon}
        </span>

        <h3
          style={{
            margin: 0,
            color: theme.colors.text,
            fontSize: "22px",
          }}
        >
          {title}
        </h3>
      </div>

      <div
        style={{
          fontSize: "34px",
          fontWeight: 700,
          color:
            color ?? theme.colors.primary,
          marginBottom: "10px",
        }}
      >
        {value}
      </div>

      {subtitle && (
        <p
          style={{
            margin: 0,
            color: theme.colors.textSecondary,
            fontSize: "15px",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}