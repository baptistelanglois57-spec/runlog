import { useState } from "react";

import { theme } from "../styles/theme";

import MonthNavigation from "../components/Calendar/MonthNavigation";
import Calendar from "../components/Calendar/Calendar";

export default function Agenda() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        color: theme.colors.text,
        padding: "40px",
      }}
    >
      <MonthNavigation
        month={currentMonth}
        onPrevious={previousMonth}
        onNext={nextMonth}
      />

      <Calendar month={currentMonth} />
    </main>
  );
}