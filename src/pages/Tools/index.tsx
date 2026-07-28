import { useNavigate } from "react-router-dom";

import AppContainer from "../../components/Layout/AppContainer";
import PageCard from "../../components/Layout/PageCard";
import Header from "../../components/Header";

import { theme } from "../../styles/theme";

export default function Tools() {
  const navigate = useNavigate();

  const cards = [
    {
      emoji: "🏆",
      title: "Records",
      subtitle: "Consulter vos records personnels",
      path: "/records",
    },
    {
      emoji: "📅",
      title: "Agenda",
      subtitle: "Entraînements et compétitions",
      path: "/agenda",
    },
    {
      emoji: "⚖️",
      title: "Suivi",
      subtitle: "Poids et évolution",
      path: "/tracking",
    },
  ];

  return (
    <AppContainer>
      <Header
        title=" Outils"
        subtitle=""
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {cards.map((card) => (
          <PageCard key={card.title}>
            <button
  onClick={() => navigate(card.path)}
  style={{
    width: "100%",
    background: "transparent",
    border: "none",
    cursor: "pointer",

    color: theme.colors.text,

    display: "flex",
    flexDirection: "column",

    justifyContent: "center",
    alignItems: "center",

    padding: "22px 12px",
  }}
>
  <div
    style={{
      fontSize: "52px",
      marginBottom: "14px",
      lineHeight: 1,
    }}
  >
    {card.emoji}
  </div>

  <div
    style={{
      fontSize: "22px",
      fontWeight: 700,
      textAlign: "center",
      marginBottom: "8px",
    }}
  >
    {card.title}
  </div>

  <div
    style={{
      color: theme.colors.textSecondary,
      fontSize: "14px",
      textAlign: "center",
      lineHeight: 1.4,
      maxWidth: "230px",
    }}
  >
    {card.subtitle}
  </div>
</button>
          </PageCard>
        ))}
      </div>
    </AppContainer>
  );
}