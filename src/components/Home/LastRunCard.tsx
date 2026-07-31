import {
  CalendarDays,
  Route,
  Clock3,
  Gauge,
  Mountain,
  HeartPulse,
  MapPin,
  Trophy,
} from "lucide-react";

import PageCard from "../Layout/PageCard";

import { theme } from "../../styles/theme";
import { UI } from "../../styles/ui";

import { formatDate } from "../../utils/date";
import { getAveragePace } from "../../utils/stats";

import type { Run } from "../../types/Run";

type Props = {
  run: Run | null;
};

export default function LastRunCard({
  run,
}: Props) {
  if (!run) {
    return (
      <PageCard>
        <h2
          style={{
            margin: 0,
            marginBottom: 18,
            textAlign: "center",
            fontSize: UI.FONT_H2,
            color: theme.colors.text,
          }}
        >
          Dernière sortie
        </h2>

        <p
          style={{
            margin: 0,
            textAlign: "center",
            color: theme.colors.textSecondary,
          }}
        >
          Aucune sortie enregistrée.
        </p>
      </PageCard>
    );
  }

  const cards = [
    {
      icon: CalendarDays,
      label: "Date",
      value: formatDate(run.date),
    },
    {
      icon: Route,
      label: "Distance",
      value: `${run.distance} km`,
    },
    {
      icon: Clock3,
      label: "Temps",
      value: run.duration,
    },
    {
      icon: Gauge,
      label: "Allure",
      value: getAveragePace(
        run.distance,
        run.duration
      ),
    },
    {
      icon: Mountain,
      label: "D+",
      value: `${run.elevation} m`,
    },
    {
      icon: HeartPulse,
      label: "BPM",
      value: run.averageHeartRate
        ? `${run.averageHeartRate}`
        : "-",
    },
  ];

  return (
    <PageCard>
      <h2
        style={{
          margin: 0,
          textAlign: "center",
          color: theme.colors.text,
          fontSize: UI.FONT_H2,
        }}
      >
        Dernière sortie
      </h2>

      <h3
        style={{
          marginTop: 10,
          marginBottom: 20,

          textAlign: "center",

          color: theme.colors.primary,

          fontSize: UI.FONT_H3,

          fontWeight: 700,
        }}
      >
        {run.name}
      </h3>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(2,1fr)",

          gap: 12,
        }}
      >
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              style={{
                background:
                  "rgba(255,255,255,.02)",

                border: `1px solid ${theme.colors.border}`,

                borderRadius: 14,

                padding: 12,

                display: "flex",

                flexDirection: "column",

                alignItems: "center",

                justifyContent: "center",

                gap: 6,

                minHeight: 88,
              }}
            >
              <Icon
                size={18}
                color={theme.colors.primary}
              />

              <span
                style={{
                  color:
                    theme.colors.textSecondary,

                  fontSize: 12,

                  fontWeight: 600,
                }}
              >
                {item.label}
              </span>

              <strong
                style={{
                  color: theme.colors.text,

                  fontSize: 15,

                  textAlign: "center",
                }}
              >
                {item.value}
              </strong>
            </div>
          );
        })}
      </div>

      {run.type === "race" && (
        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(2,1fr)",

            gap: 12,

            marginTop: 12,
          }}
        >
          {run.location && (
            <div
              style={{
                background:
                  "rgba(255,255,255,.02)",

                border: `1px solid ${theme.colors.border}`,

                borderRadius: 14,

                padding: 12,

                display: "flex",

                flexDirection: "column",

                alignItems: "center",

                justifyContent: "center",

                gap: 6,

                minHeight: 88,
              }}
            >
              <MapPin
                size={18}
                color={theme.colors.primary}
              />

              <span
                style={{
                  color:
                    theme.colors.textSecondary,

                  fontSize: 12,
                }}
              >
                Lieu
              </span>

              <strong
                style={{
                  textAlign: "center",

                  fontSize: 15,
                }}
              >
                {run.location}
              </strong>
            </div>
          )}

          {run.position !== undefined &&
            run.participants !== undefined && (
              <div
                style={{
                  background:
                    "rgba(255,255,255,.02)",

                  border: `1px solid ${theme.colors.border}`,

                  borderRadius: 14,

                  padding: 12,

                  display: "flex",

                  flexDirection: "column",

                  alignItems: "center",

                  justifyContent: "center",

                  gap: 6,

                  minHeight: 88,
                }}
              >
                <Trophy
                  size={18}
                  color={theme.colors.primary}
                />

                <span
                  style={{
                    color:
                      theme.colors.textSecondary,

                    fontSize: 12,
                  }}
                >
                  Classement
                </span>

                <strong
                  style={{
                    fontSize: 15,
                  }}
                >
                  {run.position} / {run.participants}
                </strong>
              </div>
            )}
        </div>
      )}
    </PageCard>
  );
}