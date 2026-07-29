import { useEffect, useState } from "react";

import Header from "../components/Header";
import StatsCard from "../components/StatsCard";

import UpcomingSection from "../components/Home/UpcomingSection";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import PageCard from "../components/Layout/PageCard";

import { getRuns } from "../services/runService";
import { getEvents } from "../services/eventService";

import type { Run } from "../types/Run";
import type { Event } from "../types/Event";
import {
  CalendarDays,
  Route,
  Clock3,
  Gauge,
  Mountain,
  HeartPulse,
  MapPin,
  Trophy,
  CalendarRange,
  Calendar,
} from "lucide-react";
import {
  getWeekDistance,
  getMonthDistance,
  getYearDistance,
  getTotalRuns,
  getLastRun,
  getAveragePace,
} from "../utils/stats";
import { Bell } from "lucide-react";
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

import { formatDate } from "../utils/date";
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

setNotifications(notificationData);
      setRuns(runData);
      setEvents(eventData);
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
            "repeat(2, minmax(320px,360px))",
          justifyContent: "center",
          gap: "18px",
          maxWidth: "760px",
          margin: "45px auto",
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
  <PageCard>

    <h2
  style={{
    color: theme.colors.text,
    marginBottom: "25px",
    fontSize: "28px",
    textAlign: "center",
    fontWeight: 700,
  }}
>
  Dernière sortie
</h2>

    {lastRun ? (
  <>
    <h3
      style={{
        fontSize: 28,
        fontWeight: 800,
        textAlign: "center",
        color: theme.colors.text,
        marginBottom: 35,
      }}
    >
      {lastRun.name}
    </h3>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 18,
      }}
    >
      {[
        {
          icon: <CalendarDays size={20} color={theme.colors.primary} />,
          label: "Date",
          value: formatDate(lastRun.date),
        },
        {
          icon: <Route size={20} color={theme.colors.primary} />,
          label: "Distance",
          value: `${lastRun.distance} km`,
        },
        {
          icon: <Clock3 size={20} color={theme.colors.primary} />,
          label: "Temps",
          value: lastRun.duration,
        },
        {
          icon: <Gauge size={20} color={theme.colors.primary} />,
          label: "Allure",
          value: getAveragePace(
            lastRun.distance,
            lastRun.duration
          ),
        },
        {
          icon: <Mountain size={20} color={theme.colors.primary} />,
          label: "Dénivelé",
          value: `${lastRun.elevation} m`,
        },
        {
          icon: <HeartPulse size={20} color={theme.colors.primary} />,
          label: "BPM",
          value: lastRun.averageHeartRate
            ? `${lastRun.averageHeartRate} bpm`
            : "-",
        },
      ].map((item) => (
        <div
          key={item.label}
          style={{
            background: "rgba(255,255,255,.02)",
            border: "1px solid rgba(212,175,55,.12)",
            borderRadius: 18,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          {item.icon}

          <span
            style={{
              color: theme.colors.textSecondary,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {item.label}
          </span>

          <strong
            style={{
              color: theme.colors.text,
              fontSize: 20,
              textAlign: "center",
            }}
          >
            {item.value}
          </strong>
        </div>
      ))}
    </div>

    {lastRun.type === "race" && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 18,
          marginTop: 20,
        }}
      >
        {lastRun.location && (
          <div
            style={{
              background: "rgba(255,255,255,.02)",
              border: "1px solid rgba(212,175,55,.12)",
              borderRadius: 18,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <MapPin
              size={20}
              color={theme.colors.primary}
            />

            <span
              style={{
                color: theme.colors.textSecondary,
              }}
            >
              Lieu
            </span>

            <strong>{lastRun.location}</strong>
          </div>
        )}

        {lastRun.position !== undefined &&
          lastRun.participants !== undefined && (
            <div
              style={{
                background: "rgba(255,255,255,.02)",
                border: "1px solid rgba(212,175,55,.12)",
                borderRadius: 18,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Trophy
                size={20}
                color={theme.colors.primary}
              />

              <span
                style={{
                  color: theme.colors.textSecondary,
                }}
              >
                Classement
              </span>

              <strong>
                {lastRun.position} / {lastRun.participants}
              </strong>
            </div>
          )}
      </div>
    )}
  </>
) : (
  <p
    style={{
      textAlign: "center",
      color: theme.colors.text,
      padding: 30,
    }}
  >
    Aucune sortie enregistrée.
  </p>
)}
  </PageCard>
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