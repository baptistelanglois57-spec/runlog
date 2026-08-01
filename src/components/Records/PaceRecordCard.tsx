import { theme } from "../../styles/theme";

type Props = {
  bestPace: string;
  hr130: string;
  hr140: string;
  hr150: string;
  hr160: string;
};

export default function PaceRecordCard({
  bestPace,
  hr130,
  hr140,
  hr150,
  hr160,
}: Props) {
  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: theme.shadow.card,
      }}
    >
      {/* RECORD */}

      <div
        style={{
          padding: "34px 20px 28px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: theme.colors.primary,
            fontSize: 42,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {bestPace}
        </div>

        <div
          style={{
            marginTop: 10,
            color: theme.colors.textSecondary,
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          ⭐ Meilleure allure
        </div>
      </div>

      <Row
        icon="❤️"
        label="≤130 bpm"
        value={hr130}
      />

      <Row
        icon="💚"
        label="131-140 bpm"
        value={hr140}
      />

      <Row
        icon="💛"
        label="141-150 bpm"
        value={hr150}
      />

      <Row
        icon="🧡"
        label="151-160 bpm"
        value={hr160}
        last
      />
    </div>
  );
}

type RowProps = {
  icon: string;
  label: string;
  value: string;
  last?: boolean;
};

function Row({
  icon,
  label,
  value,
  last,
}: RowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 22px",
        borderTop: `1px solid ${theme.colors.border}`,
        borderBottom: last
          ? "none"
          : `1px solid transparent`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            fontSize: 22,
          }}
        >
          {icon}
        </span>

        <span
          style={{
            color: theme.colors.text,
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          {label}
        </span>
      </div>

      <span
        style={{
          color:
            value === "🔒"
              ? theme.colors.textSecondary
              : theme.colors.primary,
          fontWeight: 700,
          fontSize: 20,
        }}
      >
        {value}
      </span>
    </div>
  );
}