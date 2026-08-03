import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Trophy,
} from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";

import { theme } from "../styles/theme";
import { UI } from "../styles/ui";

import {
  loadDiscipline,
  type DisciplinePageData,
} from "../services/disciplineService";

import DisciplineAccordion from "../components/Discipline/DisciplineAccordion";

export default function Discipline() {
  const navigate = useNavigate();

  const [data, setData] =
    useState<DisciplinePageData | null>(
      null
    );

  useEffect(() => {
    async function load() {
      const stats =
        await loadDiscipline();

      setData(stats);
    }

    load();
  }, []);

  if (!data) {
    return (
      <AppContainer>
        <Section>
          Chargement...
        </Section>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Section marginTop={8}>
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            marginBottom: 30,
          }}
        >
          <button
            onClick={() =>
              navigate("/tools")
            }
            style={{
              width: 44,
              height: 44,

              border: `1px solid ${theme.colors.border}`,
              borderRadius: 14,

              background:
                theme.colors.card,

              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",

              cursor: "pointer",
            }}
          >
            <ChevronLeft
              size={22}
              color={
                theme.colors.primary
              }
            />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Trophy
              size={24}
              color={
                theme.colors.primary
              }
            />

            <h1
              style={{
                margin: 0,
                color:
                  theme.colors.primary,
                fontSize:
                  UI.FONT_H1,
              }}
            >
              Discipline
            </h1>
          </div>

          <div
            style={{
              width: 44,
            }}
          />
        </div>
                <DisciplineCard
          title="🏆 Discipline globale"
          stats={data.overall}
        />

        <DisciplineAccordion
          title="🏃 Entraînements"
          months={data.monthlyTraining}
        />

        <DisciplineAccordion
          title="💪 Salle"
          months={data.monthlyGym}
        />

        <DisciplineAccordion
          title="🏁 Compétitions"
          months={data.monthlyRace}
        />
      </Section>
    </AppContainer>
  );
}

type CardProps = {
  title: string;
  stats: {
    planned: number;
    completed: number;
    pending: number;
    missed: number;
    percentage: number;
  };
};

function DisciplineCard({
  title,
  stats,
}: CardProps) {
  let percentageColor = "#EF4444";

  if (stats.percentage >= 85) {
    percentageColor = "#22C55E";
  } else if (stats.percentage >= 70) {
    percentageColor = "#FACC15";
  } else if (stats.percentage >= 50) {
    percentageColor = "#F97316";
  }

  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: 20,
        padding: 22,
        marginBottom: 20,
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 18,
          color: theme.colors.primary,
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span>Prévues</span>
        <strong>{stats.planned}</strong>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
          color: "#22C55E",
        }}
      >
        <span>Réalisées</span>
        <strong>{stats.completed}</strong>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
          color: "#3B82F6",
        }}
      >
        <span>En attente</span>
        <strong>{stats.pending}</strong>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 18,
          color: "#EF4444",
        }}
      >
        <span>Manquées</span>
        <strong>{stats.missed}</strong>
      </div>

      <div
        style={{
          borderTop: `1px solid ${theme.colors.border}`,
          paddingTop: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            color: theme.colors.primary,
          }}
        >
          Respect
        </span>

        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: percentageColor,
          }}
        >
          {stats.percentage}%
        </span>
      </div>
    </div>
  );
}