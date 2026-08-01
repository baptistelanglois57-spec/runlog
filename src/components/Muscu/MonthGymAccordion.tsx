import { useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Dumbbell,
} from "lucide-react";

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
  const total = useMemo(
    () => sessions.length,
    [sessions]
  );

  return (
    <div
      style={{
        maxWidth: "100%",
        margin: "0 auto 18px",
      }}
    >
      <div
        onClick={onToggle}
        style={{
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 18,
          padding: 18,
          boxShadow: theme.shadow.card,
          cursor: "pointer",
          transition: ".2s",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                textTransform: "capitalize",
                fontSize: 22,
                fontWeight: 800,
                color: theme.colors.text,
              }}
            >
              {monthLabel}
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 8,
                color:
                  theme.colors.textSecondary,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <Dumbbell
                size={15}
                color={theme.colors.primary}
              />

              {total} séance
              {total > 1 ? "s" : ""}
            </div>
          </div>

          {isOpen ? (
            <ChevronUp
              size={22}
              color={theme.colors.primary}
            />
          ) : (
            <ChevronDown
              size={22}
              color={theme.colors.primary}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexDirection: "column",
            gap: 14,
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