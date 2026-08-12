import {
  Pencil,
  History,
} from "lucide-react";

import { theme } from "../../styles/theme";

type AthleteFieldProps = {
  label: string;
  value: string;
  icon: string;

  onEdit: () => void;

  onHistory?: () => void;
};

export default function AthleteField({
  label,
  value,
  icon,
  onEdit,
  onHistory,
}: AthleteFieldProps) {
  return (
    <div
      onClick={onEdit}
      style={{
        position: "relative",

        background: theme.colors.card,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: 18,

        padding: 16,

        cursor: "pointer",

        minHeight: 135,

        display: "flex",

        flexDirection: "column",

        justifyContent: "space-between",

        transition: ".2s",
      }}
    >
      {onHistory && (
        <button
          onClick={(e) => {
            e.stopPropagation();

            onHistory();
          }}
          style={{
            position: "absolute",

            top: 10,

            right: 10,

            width: 30,

            height: 30,

            borderRadius: 8,

            border: "none",

            background:
              "rgba(125,35,53,.10)",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            cursor: "pointer",
          }}
        >
          <History
            size={15}
            color={theme.colors.primary}
          />
        </button>
      )}

      <div
        style={{
          fontSize: 28,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            color:
              theme.colors.textSecondary,

            fontSize: 13,

            marginBottom: 6,
          }}
        >
          {label}
        </div>

        <div
          style={{
            color: theme.colors.text,

            fontSize: 20,

            fontWeight: 700,

            lineHeight: 1.2,
          }}
        >
          {value}
        </div>
      </div>
            <button
        onClick={(e) => {
          e.stopPropagation();

          onEdit();
        }}
        style={{
          position: "absolute",

          bottom: 10,

          right: 10,

          width: 34,

          height: 34,

          borderRadius: 10,

          border: `1px solid ${theme.colors.border}`,

          background:
            "rgba(125,35,53,.08)",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          cursor: "pointer",
        }}
      >
        <Pencil
          size={16}
          color={theme.colors.primary}
        />
      </button>
    </div>
  );
}
