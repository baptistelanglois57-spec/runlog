import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  getWeekDistance,
  getMonthDistance,
  getYearDistance,
  getTotalRuns,
  getLastRun,
  getAveragePace,
} from "../utils/stats";

import {
  getNextTraining,
  getNextRace,
} from "../utils/events";

import { formatDate } from "../utils/date";
import { theme } from "../styles/theme";

export default function Home() {
  const navigate = useNavigate();

  const [runs, setRuns] = useState<Run[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function loadData() {
      const runData = await getRuns();
      const eventData = await getEvents();

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => navigate("/records")}
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "18px",
            border: `1px solid ${theme.colors.primary}`,
            background: theme.colors.card,
            color: theme.colors.primary,
            fontSize: "30px",
            cursor: "pointer",
            boxShadow: theme.shadow.card,
          }}
        >
          🏆
        </button>

        <Header
          title=" RunLog"
          subtitle="Bonjour Baptiste 👋"
        />

        <button
          onClick={() => navigate("/agenda")}
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "18px",
            border: `1px solid ${theme.colors.primary}`,
            background: theme.colors.card,
            color: theme.colors.primary,
            fontSize: "28px",
            cursor: "pointer",
            boxShadow: theme.shadow.card,
          }}
        >
          📅
        </button>
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
          value={`${weekDistance.toFixed(2)} km`}
          icon="🏃"
        />

        <StatsCard
          title="Ce mois"
          value={`${monthDistance.toFixed(2)} km`}
          icon="📅"
        />

        <StatsCard
          title="Cette année"
          value={`${yearDistance.toFixed(2)} km`}
          icon="🗓️"
        />

        <StatsCard
          title="Total des sorties"
          value={`${totalRuns}`}
          icon="🏅"
        />
      </div>
            <Section>
        <PageCard>

          <h2
            style={{
              color: theme.colors.primary,
              marginBottom: "25px",
              fontSize: "28px",
              textAlign: "center",
            }}
          >
            Dernière sortie
          </h2>

          {lastRun ? (
            <>
              <h3
                style={{
                  fontSize: "26px",
                  marginBottom: "25px",
                  textAlign: "center",
                  color: theme.colors.text,
                }}
              >
                {lastRun.name}
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px,1fr))",
                  gap: "18px",
                }}
              >
                <div>
                  <p
                    style={{
                      color: theme.colors.textSecondary,
                      marginBottom: "6px",
                    }}
                  >
                    📅 Date
                  </p>

                  <strong>
                    {formatDate(lastRun.date)}
                  </strong>
                </div>

                <div>
                  <p
                    style={{
                      color: theme.colors.textSecondary,
                      marginBottom: "6px",
                    }}
                  >
                    📏 Distance
                  </p>

                  <strong>
                    {lastRun.distance} km
                  </strong>
                </div>

                <div>
                  <p
                    style={{
                      color: theme.colors.textSecondary,
                      marginBottom: "6px",
                    }}
                  >
                    ⏱ Temps
                  </p>

                  <strong>
                    {lastRun.duration}
                  </strong>
                </div>

                <div>
                  <p
                    style={{
                      color: theme.colors.textSecondary,
                      marginBottom: "6px",
                    }}
                  >
                    ⚡ Rythme moyen
                  </p>

                  <strong>
                    {getAveragePace(
                      lastRun.distance,
                      lastRun.duration
                    )}
                  </strong>
                </div>

                <div>
                  <p
                    style={{
                      color: theme.colors.textSecondary,
                      marginBottom: "6px",
                    }}
                  >
                    ⛰ Dénivelé
                  </p>

                  <strong>
                    {lastRun.elevation} m
                  </strong>
                </div>

                {lastRun.type === "race" && (
                  <>
                    {lastRun.location && (
                      <div>
                        <p
                          style={{
                            color:
                              theme.colors.textSecondary,
                            marginBottom: "6px",
                          }}
                        >
                          📍 Lieu
                        </p>

                        <strong>
                          {lastRun.location}
                        </strong>
                      </div>
                    )}

                    {lastRun.position !== undefined &&
                      lastRun.participants !==
                        undefined && (
                        <div>
                          <p
                            style={{
                              color:
                                theme.colors.textSecondary,
                              marginBottom: "6px",
                            }}
                          >
                            🏆 Classement
                          </p>

                          <strong>
                            {lastRun.position} /{" "}
                            {lastRun.participants}
                          </strong>
                        </div>
                      )}
                  </>
                )}
              </div>
            </>
          ) : (
            <p
              style={{
                textAlign: "center",
                color: theme.colors.textSecondary,
              }}
            >
              Aucune sortie enregistrée.
            </p>
          )}

        </PageCard>
      </Section>
            <Section>
        <UpcomingSection
          nextTraining={nextTraining}
          nextRace={nextRace}
        />
      </Section>

    </AppContainer>
  );
}