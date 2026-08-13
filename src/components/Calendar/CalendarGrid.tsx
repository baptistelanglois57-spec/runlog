import { useEffect, useState } from "react";

import CalendarDay from "./CalendarDay";
import EventModal from "./EventModal";
import type { AgendaDayStatus } from "../../utils/agenda";
import { getEvents, saveEvent, updateEvent, deleteEvent } from "../../services/eventService";
import { syncEventReminders } from "../../services/eventReminderService";
import { getRuns } from "../../services/runService";
import { getGymSessions } from "../../services/gymService";
import { getAgendaDayStatus } from "../../utils/agenda";
import { formatDateKey } from "../../utils/dateKey";
import type { Event } from "../../types/Event";
import type { Run } from "../../types/Run";
import type { GymSession } from "../../types/GymSession";

type CalendarGridProps = {
  month: Date;
};

type Day = {
  day: number;
  currentMonth: boolean;
  isToday?: boolean;
};

const weekDays = ["LU", "MA", "ME", "JE", "VE", "SA", "DI"];

export default function CalendarGrid({ month }: CalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [gymSessions, setGymSessions] = useState<GymSession[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);

    const [eventData, runData, gymData] = await Promise.all([
      getEvents(),
      getRuns(),
      getGymSessions(),
    ]);

    setEvents(eventData);
    setRuns(runData);
    setGymSessions(gymData);
    setLoading(false);
    void syncEventReminders(eventData);
  }

  useEffect(() => {
    // Chargement asynchrone initial ; les mises à jour ont lieu après la requête.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();
  let startDay = firstDay.getDay() - 1;

  if (startDay === -1) {
    startDay = 6;
  }

  const previousMonthLastDay = new Date(year, monthIndex, 0).getDate();
  const days: Day[] = [];

  for (let index = startDay; index > 0; index--) {
    days.push({
      day: previousMonthLastDay - index + 1,
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const today = new Date();

    days.push({
      day,
      currentMonth: true,
      isToday:
        day === today.getDate() &&
        monthIndex === today.getMonth() &&
        year === today.getFullYear(),
    });
  }

  let nextDay = 1;

  while (days.length < 42) {
    days.push({ day: nextDay, currentMonth: false });
    nextDay++;
  }

  function handleDayClick(day: Day) {
    if (!day.currentMonth) return;

    setSelectedDate(new Date(year, monthIndex, day.day));
    setIsModalOpen(true);
  }

  async function handleCreate(event: Event) {
    await saveEvent(event);
    await loadData();
    setIsModalOpen(false);
    setSelectedDate(null);
  }

  async function handleUpdate(event: Event) {
    await updateEvent(event);
    await loadData();
    setIsModalOpen(false);
    setSelectedDate(null);
  }

  async function handleDelete(id: string) {
    await deleteEvent(id);
    await loadData();
    setIsModalOpen(false);
    setSelectedDate(null);
  }

  if (loading) {
    return <div className="agenda-calendar__loading">Chargement...</div>;
  }

  return (
    <>
      <section className="agenda-calendar" aria-label="Calendrier mensuel">
        <div className="agenda-calendar__weekdays" aria-hidden="true">
          {weekDays.map((dayName) => (
            <span key={dayName}>{dayName}</span>
          ))}
        </div>

        <div className="agenda-calendar__grid">
          {days.map((day, index) => {
            let status: AgendaDayStatus = { type: "none", completed: false };

            if (day.currentMonth) {
              const dateKey = formatDateKey(new Date(year, monthIndex, day.day));
              status = getAgendaDayStatus(dateKey, events, runs, gymSessions);
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
                status={status}
                onClick={() => handleDayClick(day)}
              />
            );
          })}
        </div>
      </section>

      <EventModal
        isOpen={isModalOpen}
        selectedDate={selectedDate}
        event={
          selectedDate
            ? events.find((event) => event.date === formatDateKey(selectedDate))
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
