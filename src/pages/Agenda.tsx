import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { theme } from "../styles/theme";

import MonthNavigation from "../components/Calendar/MonthNavigation";
import Calendar from "../components/Calendar/Calendar";

export default function Agenda() {
  const navigate = useNavigate();

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
      <div
        style={{
          position: "relative",
          maxWidth: "900px",
          margin: "0 auto 40px",
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "22px",
          padding: "35px",
          boxShadow: theme.shadow.card,
          textAlign: "center",
        }}
      >
        <button
          onClick={() => navigate("/tools")}
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            width: "42px",
            height: "42px",
            border: "none",
            background: "transparent",
            color: theme.colors.primary,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={34} />
        </button>

        <h1
          style={{
            margin: 0,
            color: theme.colors.primary,
            fontSize: "40px",
            fontWeight: 700,
          }}
        >
          📅 Agenda
        </h1>
      </div>

      <MonthNavigation
        month={currentMonth}
        onPrevious={previousMonth}
        onNext={nextMonth}
      />

      <Calendar month={currentMonth} />
    </main>
  );
}