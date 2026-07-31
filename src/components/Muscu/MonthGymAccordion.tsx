import { useMemo } from "react";
import type { GymSession } from "../../types/GymSession";
import GymSessionCard from "./GymSessionCard";
import { theme } from "../../styles/theme";

type Props = {
  monthLabel: string;
  sessions: GymSession[];
  isOpen: boolean;
  onToggle: () => void;
  onView: (session: GymSession) => void;
  onDelete: (id: string) => void;
};

export default function MonthGymAccordion({
  monthLabel,
  sessions,
  isOpen,
  onToggle,
  onView,
  onDelete,
}: Props) {
  const total = useMemo(() => sessions.length, [sessions]);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto 22px",
      }}
    >
      <div
        onClick={onToggle}
        style={{
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "20px",
          padding: "22px",
          boxShadow: theme.shadow.card,
          cursor: "pointer",
          transition: "0.2s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
            }}
          >
            <h2
              style={{
                margin: 0,
                textTransform: "capitalize",
              }}
            >
              {monthLabel}
            </h2>

            <p
              style={{
                marginTop: 10,
                color: theme.colors.textSecondary,
              }}
            >
              💪 {total} séance{total > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {sessions.map((session) => (
            <GymSessionCard
              key={session.id}
              session={session}
              onView={onView}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}