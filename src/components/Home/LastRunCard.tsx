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
import { formatDate } from "../../utils/date";
import { getAveragePace } from "../../utils/stats";

import type { Run } from "../../types/Run";

type Props = {
  run: Run | null;
};

export default function LastRunCard({ run }: Props) {
  if (!run) {
    return (
      <PageCard>
        <h2
          style={{
            color: theme.colors.text,
            marginBottom: 25,
            fontSize: "clamp(24px,6vw,28px)",
            textAlign: "center",
          }}
        >
          Dernière sortie
        </h2>

        <p
          style={{
            textAlign: "center",
            color: theme.colors.text,
            padding: 30,
            margin: 0,
          }}
        >
          Aucune sortie enregistrée.
        </p>
      </PageCard>
    );
  }

  const cards = [
    {
      icon: <CalendarDays size={20} color={theme.colors.primary} />,
      label: "Date",
      value: formatDate(run.date),
    },
    {
      icon: <Route size={20} color={theme.colors.primary} />,
      label: "Distance",
      value: `${run.distance} km`,
    },
    {
      icon: <Clock3 size={20} color={theme.colors.primary} />,
      label: "Temps",
      value: run.duration,
    },
    {
      icon: <Gauge size={20} color={theme.colors.primary} />,
      label: "Allure",
      value: getAveragePace(run.distance, run.duration),
    },
    {
      icon: <Mountain size={20} color={theme.colors.primary} />,
      label: "Dénivelé",
      value: `${run.elevation} m`,
    },
    {
      icon: <HeartPulse size={20} color={theme.colors.primary} />,
      label: "BPM",
      value: run.averageHeartRate
        ? `${run.averageHeartRate} bpm`
        : "-",
    },
  ];

  return (
    <PageCard>
      <h2
        style={{
          color: theme.colors.text,
          marginBottom: 25,
          fontSize: "clamp(24px,6vw,28px)",
          textAlign: "center",
        }}
      >
        Dernière sortie
      </h2>

      <h3
        style={{
          fontSize: "clamp(24px,6vw,30px)",
          fontWeight: 800,
          textAlign: "center",
          color: theme.colors.text,
          marginBottom: 35,
        }}
      >
        {run.name}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(min(180px,100%),1fr))",
          gap: 18,
        }}
      >
        {cards.map((item) => (
          <div
            key={item.label}
            style={{
              background: "rgba(255,255,255,.02)",
              border: "1px solid rgba(212,175,55,.12)",
              borderRadius: 18,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            {item.icon}

            <span
              style={{
                color: theme.colors.textSecondary,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {item.label}
            </span>

            <strong
              style={{
                color: theme.colors.text,
                fontSize: 20,
                textAlign: "center",
              }}
            >
              {item.value}
            </strong>
          </div>
        ))}
      </div>

      {run.type === "race" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(min(220px,100%),1fr))",
            gap: 18,
            marginTop: 20,
          }}
        >
          {run.location && (
            <div
              style={{
                background: "rgba(255,255,255,.02)",
                border: "1px solid rgba(212,175,55,.12)",
                borderRadius: 18,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <MapPin size={20} color={theme.colors.primary} />
              <span style={{ color: theme.colors.textSecondary }}>
                Lieu
              </span>
              <strong>{run.location}</strong>
            </div>
          )}

          {run.position !== undefined &&
            run.participants !== undefined && (
              <div
                style={{
                  background: "rgba(255,255,255,.02)",
                  border: "1px solid rgba(212,175,55,.12)",
                  borderRadius: 18,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Trophy
                  size={20}
                  color={theme.colors.primary}
                />
                <span style={{ color: theme.colors.textSecondary }}>
                  Classement
                </span>
                <strong>
                  {run.position} / {run.participants}
                </strong>
              </div>
            )}
        </div>
      )}
    </PageCard>
  );
}