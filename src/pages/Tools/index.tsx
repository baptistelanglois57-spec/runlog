import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import AppContainer from "../../components/Layout/AppContainer";
import CompactCard from "../../components/Layout/CompactCard";

import { theme } from "../../styles/theme";

import {
  Trophy,
  CalendarDays,
  User,
  Target,
  NotebookPen,
  ChartLine,
  ChevronRight,
  Dumbbell,
} from "lucide-react";
export default function Tools() {
  const navigate = useNavigate();

const cards = [
  {
    icon: Trophy,
    title: "Records",
    subtitle: "Consulter vos records personnels",
    path: "/records",
  },
  {
    icon: CalendarDays,
    title: "Agenda",
    subtitle: "Entraînements et compétitions",
    path: "/agenda",
  },
  {
    icon: User,
    title: "Fiche sportif",
    subtitle:
      "Informations personnelles et performances",
    path: "/athlete-profile",
  },
  {
    icon: Target,
    title: "Discipline",
    subtitle:
      "Analyse du respect de votre planning",
    path: "/discipline",
  },
  {
    icon: NotebookPen,
    title: "Pense-bête",
    subtitle:
      "Notes, idées et rappels importants",
    path: "/notes",
  },
  {
    icon: ChartLine,
    title: "Prévisions",
    subtitle:
      "Estimer vos performances",
    path: "/forecast",
  },
  {
    icon: ChartLine,
    title: "Comparaison",
    subtitle:
      "Comparer deux séances de musculation",
    path: "/gym-comparison",
  },
  {
  icon: Dumbbell,
  title: "Exercices",
  subtitle:
    "Bibliothèque des exercices",
  path: "/exercise-library",
},
];

  return (
    <AppContainer>
      <Header
        title="Outils"
        subtitle=""
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <CompactCard key={card.title}>
              <button
                onClick={() =>
                  navigate(card.path)
                }
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",

                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",

                  color: theme.colors.text,

                  padding: "2px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,

                      background:
                        "rgba(212,175,55,.10)",

                      display: "flex",
                      justifyContent:
                        "center",
                      alignItems: "center",

                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      size={24}
                      color={
                        theme.colors.primary
                      }
                      strokeWidth={2.2}
                    />
                  </div>

                  <div
                    style={{
                      flex: 1,
                      textAlign: "left",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        marginBottom: 3,
                        color:
                          theme.colors.text,
                      }}
                    >
                      {card.title}
                    </div>

                    <div
                      style={{
                        color:
                          theme.colors
                            .textSecondary,
                        fontSize: 13,
                        lineHeight: 1.35,
                      }}
                    >
                      {card.subtitle}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  size={20}
                  color={
                    theme.colors
                      .textSecondary
                  }
                />
              </button>
            </CompactCard>
          );
        })}
      </div>
    </AppContainer>
  );
}