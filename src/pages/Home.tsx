import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Header from "../components/Header";
import StatsCard from "../components/StatsCard";

import UpcomingSection from "../components/Home/UpcomingSection";
import LastRunCard from "../components/Home/LastRunCard";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";

import { getRuns } from "../services/runService";
import { getEvents } from "../services/eventService";

import type { Run } from "../types/Run";
import type { Event } from "../types/Event";
import type { Notification } from "../types/Notification";

import {
  CalendarDays,
  CalendarRange,
  Calendar,
  Trophy,
  Bell,
} from "lucide-react";

import {
  getWeekDistance,
  getMonthDistance,
  getYearDistance,
  getTotalRuns,
  getLastRun,
} from "../utils/stats";

import {
  getNextTraining,
  getNextRace,
} from "../utils/events";

import NotificationModal from "../components/Notifications/NotificationModal";

import {
  getNotifications,
  markAllAsRead,
  markNotificationAsRead,
  cleanupNotifications,
  cleanupLegacyRecordNotificationDuplicates,
  deleteNotification,
} from "../services/notificationService";

import { theme } from "../styles/theme";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<Run[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] =
    useState<Notification[]>([]);
  const [notificationOpen, setNotificationOpen] =
    useState(false);

  useEffect(() => {
    async function loadData() {
      const runData = await getRuns();
      const eventData = await getEvents();
      await cleanupNotifications();
      await cleanupLegacyRecordNotificationDuplicates();

const notificationData =
  await getNotifications();    
      setRuns(runData);
      setEvents(eventData);
      setNotifications(notificationData);
    }

    loadData();
  }, []);

  const weekDistance =
    getWeekDistance(runs);

  const monthDistance =
    getMonthDistance(runs);

  const yearDistance =
    getYearDistance(runs);

  const totalRuns =
    getTotalRuns(runs);

  const lastRun =
    getLastRun(runs);

  const nextTraining =
    getNextTraining(events);

  const nextRace =
    getNextRace(events);
const hasUnreadNotifications =
  notifications.some(
    (notification) => !notification.read
  );
  return (
    <AppContainer>
      <div className="home-page">
      {/* Header */}

      <div
        className="home-page__header"
      >
        <button
          type="button"
          aria-label="Ouvrir les notifications"
          onClick={() =>
            setNotificationOpen(true)
          }
          className="home-page__notification"
        >
          <div className="home-page__notification-icon">
  <Bell
    size={20}
    color={theme.colors.primary}
  />

  {hasUnreadNotifications && (
            <div className="home-page__notification-dot" />
  )}
</div>
        </button>

        <Header
          title="RunLog"
          subtitle=""
        />
      </div>

      {/* Stats */}
      <div className="home-page__stats">
        <StatsCard
          title="Cette semaine"
          value={`${weekDistance.toFixed(1)} km`}
          icon={CalendarDays}
        />

        <StatsCard
          title="Ce mois"
          value={`${monthDistance.toFixed(1)} km`}
          icon={CalendarRange}
        />

        <StatsCard
          title="Cette année"
          value={`${yearDistance.toFixed(1)} km`}
          icon={Calendar}
        />

        <StatsCard
          title="Sorties"
          value={`${totalRuns}`}
          icon={Trophy}
        />
      </div>

      <Section>
        <UpcomingSection
          nextTraining={nextTraining}
          nextRace={nextRace}
        />
      </Section>

      <Section>
        <LastRunCard
          run={lastRun}
        />
      </Section>

      <NotificationModal
        open={notificationOpen}
        notifications={notifications}
        onClose={() =>
          setNotificationOpen(false)
        }
        onReadAll={async () => {
          await markAllAsRead();

          const updated =
            await getNotifications();

          setNotifications(updated);
        }}
        onOpenNotification={async (notification) => {
          const gymRecordExerciseId = notification.action.startsWith("gym_record:")
            ? notification.action.slice("gym_record:".length)
            : null;
          const isAgendaReminder = notification.entity === "event-reminder"
            || notification.entity === "daily-schedule";

          if (!isAgendaReminder && !gymRecordExerciseId) return;
          if (!notification.read) {
            await markNotificationAsRead(notification.id);
            setNotifications((current) => current.map((item) =>
              item.id === notification.id ? { ...item, read: true } : item
            ));
          }
          setNotificationOpen(false);
          navigate(gymRecordExerciseId
            ? `/exercise-library/${gymRecordExerciseId}`
            : "/agenda");
        }}
        onDeleteNotification={async (notification) => {
          setNotifications((current) => current.filter((item) => item.id !== notification.id));
          const deleted = await deleteNotification(notification.id);
          if (deleted) {
            toast.success("Notification supprimée");
            return;
          }

          setNotifications((current) =>
            [...current, notification].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          );
          toast.error("La notification n’a pas pu être supprimée");
        }}
      />
      </div>
    </AppContainer>
  );
}
