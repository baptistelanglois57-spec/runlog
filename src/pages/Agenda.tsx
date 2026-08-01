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
import PageCard from "../components/Layout/PageCard";

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
      <Section>
        <PageCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <button
              onClick={() =>
                navigate("/tools")
              }
              style={{
                width: 42,
                height: 42,

                border: "none",

                borderRadius: 12,

                background:
                  theme.colors.background,

                color: theme.colors.primary,

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                cursor: "pointer",
              }}
            >
              <ChevronLeft size={22} />
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
                  fontSize: UI.FONT_H1,
                  color:
                    theme.colors.primary,
                }}
              >
                Agenda
              </h1>
            </div>

            <div
              style={{
                width: 42,
              }}
            />
          </div>

          <MonthNavigation
            month={currentMonth}
            onPrevious={previousMonth}
            onNext={nextMonth}
          />

          <Calendar
            month={currentMonth}
          />
        </PageCard>
      </Section>
    </AppContainer>
  );
}