import { theme } from "../../styles/theme";
import {
  Trophy,
  CalendarDays,
} from "lucide-react";

type Props = {
  title?: string;
  date?: string;
};

export default function NextRaceCard({
  title = "Aucune compétition",
  date = "Non planifiée",
}: Props) {
  return (
    <div
      style={{
        background: theme.colors.card,
        border: "1px solid rgba(212,175,55,.18)",
        borderRadius: 24,
        padding: 22,
        minHeight: 165,
        display: "flex",
        flexDirection: "column",
        transition: ".25s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: "rgba(212,175,55,.10)",
              border: "1px solid rgba(212,175,55,.15)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Trophy
              size={22}
              color={theme.colors.primary}
            />
          </div>

          <span
            style={{
              color: theme.colors.text,
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Prochaine compétition
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 10px",
            borderRadius: 10,
            background: "rgba(212,175,55,.08)",
            border: "1px solid rgba(212,175,55,.15)",
            color: theme.colors.textSecondary,
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          <CalendarDays
            size={17}
            color={theme.colors.primary}
          />
          {date}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: theme.colors.text,
            maxWidth: 220,
            lineHeight: 1.35,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}