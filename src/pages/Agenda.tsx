import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CircleHelp } from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import AgendaLegendModal from "../components/Calendar/AgendaLegendModal";
import Calendar from "../components/Calendar/Calendar";
import MonthNavigation from "../components/Calendar/MonthNavigation";
import "./Agenda.css";

export default function Agenda() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [legendOpen, setLegendOpen] = useState(false);

  function previousMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  }

  function nextMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  }

  return (
    <AppContainer>
      <div className="agenda-page">
        <Section marginTop={8}>
          <header className="agenda-page__header">
            <button
              className="agenda-page__icon-button"
              type="button"
              aria-label="Retour aux outils"
              onClick={() => navigate("/tools")}
            >
              <ChevronLeft size={22} />
            </button>

            <h1>Agenda</h1>

            <button
              className="agenda-page__icon-button"
              type="button"
              aria-label="Afficher la légende"
              onClick={() => setLegendOpen(true)}
            >
              <CircleHelp size={21} />
            </button>
          </header>

          <MonthNavigation
            month={currentMonth}
            onPrevious={previousMonth}
            onNext={nextMonth}
          />

          <Calendar month={currentMonth} />

          <AgendaLegendModal
            isOpen={legendOpen}
            onClose={() => setLegendOpen(false)}
          />
        </Section>
      </div>
    </AppContainer>
  );
}
