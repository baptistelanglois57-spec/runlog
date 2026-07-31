import { useEffect, useState } from "react";

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

import {
  CalendarDays,
  Trophy,
  CalendarRange,
  Calendar,
  Bell,
} from "lucide-react";

import {
  getWeekDistance,
  getMonthDistance,
  getYearDistance,
  getTotalRuns,
  getLastRun,
} from "../utils/stats";

import NotificationModal from "../components/Notifications/NotificationModal";

import {
  getNotifications,
  markAllAsRead,
} from "../services/notificationService";

import type { Notification } from "../types/Notification";

import {
  getNextTraining,
  getNextRace,
} from "../utils/events";

import { theme } from "../styles/theme";

export default function Home() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const runData = await getRuns();
      const eventData = await getEvents();
      const notificationData = await getNotifications();

      setRuns(runData);
      setEvents(eventData);
      setNotifications(notificationData);
    }

    loadData();
  }, []);

  const weekDistance = getWeekDistance(runs);
  const monthDistance = getMonthDistance(runs);
  const yearDistance = getYearDistance(runs);
  const totalRuns = getTotalRuns(runs);

  const lastRun = getLastRun(runs);

  const nextTraining = getNextTraining(events);
  const nextRace = getNextRace(events);

  return (
    <AppContainer>
      <div
        style={{
          position: "relative",
          marginBottom: 30,
        }}
      >
        <button
          onClick={() => setNotificationOpen(true)}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 46,
            height: 46,
            borderRadius: 14,
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.card,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Bell
            size={22}
            color={theme.colors.primary}
          />
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Header
            title=" RunLog"
            subtitle="Bonjour Baptiste 👋"
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(300px,100%),1fr))",
          gap: "20px",
          width: "100%",
          maxWidth: "760px",
          margin: "40px auto",
        }}
      >
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
        <LastRunCard run={lastRun} />
      </Section>

      <NotificationModal
        open={notificationOpen}
        notifications={notifications}
        onClose={() => setNotificationOpen(false)}
        onReadAll={async () => {
          await markAllAsRead();

          const updated = await getNotifications();
          setNotifications(updated);
        }}
      />
    </AppContainer>
  );
}