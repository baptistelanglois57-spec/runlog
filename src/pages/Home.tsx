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
  cleanupNotifications,
} from "../services/notificationService";

import { theme } from "../styles/theme";
import { UI } from "../styles/ui";
import { value } from "../styles/responsive";

export default function Home() {
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
      {/* Header */}

      <div
        style={{
          position: "relative",

          maxWidth: value(
            UI.PAGE_MAX_WIDTH,
            "760px"
          ),

          margin: `0 auto ${UI.HEADER_MARGIN}px`,
        }}
      >
        <button
          onClick={() =>
            setNotificationOpen(true)
          }
          style={{
            position: "absolute",

            right: 0,
            top: 0,

            width: 42,
            height: 42,

            borderRadius:
              UI.BUTTON_RADIUS,

            border: `1px solid ${theme.colors.border}`,

            background:
              theme.colors.card,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            cursor: "pointer",

            transition:
              UI.TRANSITION,
          }}
        >
          <div
  style={{
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Bell
    size={20}
    color={theme.colors.primary}
  />

  {hasUnreadNotifications && (
    <div
      style={{
        position: "absolute",
        top: -1,
        right: -1,

        width: 8,
        height: 8,

        borderRadius: "50%",

        background: "#EF4444",

        border: `2px solid ${theme.colors.card}`,
      }}
    />
  )}
</div>
        </button>

        <Header
          title="RunLog"
          subtitle=""
        />
      </div>

      {/* Stats */}
            <div
        style={{
          display: "grid",

          gridTemplateColumns: "repeat(2,minmax(0,1fr))",

          gap: UI.GRID_GAP,

          width: "100%",

          maxWidth: value(
            UI.PAGE_MAX_WIDTH,
            "760px"
          ),

          margin: "0 auto",

          boxSizing: "border-box",
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
      />
    </AppContainer>
  );
}