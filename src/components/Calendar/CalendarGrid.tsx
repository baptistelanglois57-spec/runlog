import { useEffect, useState } from "react";

import CalendarDay from "./CalendarDay";
import EventModal from "./EventModal";

import { theme } from "../../styles/theme";

import {
  getEvents,
  saveEvent,
  updateEvent,
  deleteEvent,
} from "../../services/eventService";

import { formatDateKey } from "../../utils/dateKey";

import type { Event } from "../../types/Event";

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

  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState(true);

  async function loadEvents() {
    setLoading(true);

    const data = await getEvents();

    setEvents(data);

    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

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

  const firstDay = new Date(
    year,
    monthIndex,
    1
  );

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

  // Compléter jusqu'à 42 cases

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

  async function handleCreate(event: Event) {
    await saveEvent(event);

    await loadEvents();

    setIsModalOpen(false);

    setSelectedDate(null);
  }

  async function handleUpdate(event: Event) {
    await updateEvent(event);

    await loadEvents();

    setIsModalOpen(false);

    setSelectedDate(null);
  }
    async function handleDelete(id: string) {
    await deleteEvent(id);

    await loadEvents();

    setIsModalOpen(false);

    setSelectedDate(null);
  }

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          color: theme.colors.text,
        }}
      >
        Chargement...
      </div>
    );
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
            gridTemplateColumns: "repeat(7, 1fr)",
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
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "10px",
          }}
        >
          {days.map((day, index) => {
            let event: Event | undefined;

            if (day.currentMonth) {
              const dateKey = formatDateKey(
                new Date(year, monthIndex, day.day)
              );

              event = events.find(
                (e) => e.date === dateKey
              );
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
                eventType={event?.type}
                onClick={() => handleDayClick(day)}
              />
            );
          })}
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        selectedDate={selectedDate}
        event={
          selectedDate
            ? events.find(
                (event) =>
                  event.date ===
                  formatDateKey(selectedDate)
              )
            : undefined
        }
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDate(null);
        }}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </>
  );
}