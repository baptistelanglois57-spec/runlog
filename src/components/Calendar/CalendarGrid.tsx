import { useState } from "react";

import CalendarDay from "./CalendarDay";
import EventModal from "./EventModal";

import { theme } from "../../styles/theme";

import { getEvents } from "../../services/eventStorage";
import { formatDateKey } from "../../utils/dateKey";

type CalendarGridProps = {
  month: Date;
};

type Day = {
  day: number;
  currentMonth: boolean;
  isToday?: boolean;
};

export default function CalendarGrid({
  month,
}: CalendarGridProps) {
  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [, setRefresh] = useState(0);

  const events = getEvents();

  const weekDays = [
    "LU",
    "MA",
    "ME",
    "JE",
    "VE",
    "SA",
    "DI",
  ];

  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDay = new Date(year, monthIndex, 1);

  const lastDay = new Date(
    year,
    monthIndex + 1,
    0
  );

  const daysInMonth = lastDay.getDate();

  let startDay = firstDay.getDay() - 1;

  if (startDay === -1) {
    startDay = 6;
  }

  const previousMonthLastDay = new Date(
    year,
    monthIndex,
    0
  ).getDate();

  const days: Day[] = [];

  // Mois précédent

  for (let i = startDay; i > 0; i--) {
    days.push({
      day: previousMonthLastDay - i + 1,
      currentMonth: false,
    });
  }

  // Mois actuel

  for (let i = 1; i <= daysInMonth; i++) {
    const today = new Date();

    days.push({
      day: i,
      currentMonth: true,
      isToday:
        i === today.getDate() &&
        monthIndex === today.getMonth() &&
        year === today.getFullYear(),
    });
  }

  // Complète jusqu'à 42 cases

  let nextDay = 1;

  while (days.length < 42) {
    days.push({
      day: nextDay,
      currentMonth: false,
    });

    nextDay++;
  }

  function handleDayClick(day: Day) {
    if (!day.currentMonth) return;

    setSelectedDate(
      new Date(
        year,
        monthIndex,
        day.day
      )
    );

    setIsModalOpen(true);
  }
    return (
    <>
      <div
        style={{
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "22px",
          padding: "25px",
          maxWidth: "920px",
          margin: "0 auto",
          boxShadow: theme.shadow.card,
        }}
      >
        {/* Jours de la semaine */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            marginBottom: "18px",
            textAlign: "center",
            color: theme.colors.primary,
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          {weekDays.map((dayName) => (
            <div key={dayName}>{dayName}</div>
          ))}
        </div>

        {/* Calendrier */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: "10px",
          }}
        >
          {days.map((day, index) => {
            let eventType: "training" | "race" | undefined;

            if (day.currentMonth) {
              const dateKey = formatDateKey(
                new Date(year, monthIndex, day.day)
              );

              const event = events.find(
                (e) => e.date === dateKey
              );

              eventType = event?.type;
            }

            return (
              <CalendarDay
                key={index}
                day={day.day}
                isCurrentMonth={day.currentMonth}
                isToday={day.isToday}
                isSelected={
                  selectedDate !== null &&
                  selectedDate.getDate() === day.day &&
                  selectedDate.getMonth() === monthIndex &&
                  selectedDate.getFullYear() === year
                }
                eventType={eventType}
                onClick={() => handleDayClick(day)}
              />
            );
          })}
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        selectedDate={selectedDate}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDate(null);
        }}
        onSave={() => {
          setRefresh((value) => value + 1);
        }}
      />
    </>
  );
}