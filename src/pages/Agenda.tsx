import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  CalendarDays,
} from "lucide-react";

import { theme } from "../styles/theme";
import { UI } from "../styles/ui";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";

import MonthNavigation from "../components/Calendar/MonthNavigation";
import Calendar from "../components/Calendar/Calendar";

export default function Agenda() {
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] =
    useState(new Date());

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
      <Section marginTop={8}>
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 26,
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

              background: theme.colors.card,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              cursor: "pointer",
            }}
          >
            <ChevronLeft
              size={22}
              color={theme.colors.primary}
            />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <CalendarDays
              size={24}
              color={theme.colors.primary}
            />

            <h1
              style={{
                margin: 0,
                color: theme.colors.primary,
                fontSize: UI.FONT_H1,
              }}
            >
              Agenda
            </h1>
          </div>

          <div
            style={{
              width: 44,
            }}
          />
        </div>

        {/* MOIS */}

        <MonthNavigation
          month={currentMonth}
          onPrevious={previousMonth}
          onNext={nextMonth}
        />

        {/* CALENDRIER */}

        <Calendar
          month={currentMonth}
        />
      </Section>
    </AppContainer>
  );
}