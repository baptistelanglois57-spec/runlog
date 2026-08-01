import { useEffect, useMemo, useState } from "react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import PageCard from "../components/Layout/PageCard";

import MuscuHeader from "../components/Muscu/MuscuHeader";
import MonthGymAccordion from "../components/Muscu/MonthGymAccordion";
import GymSessionModal from "../components/Muscu/GymSessionModal";

import type { GymSession } from "../types/GymSession";

import {
  getGymSessions,
  deleteGymSession,
} from "../services/gymService";

export default function Muscu() {
  const [sessions, setSessions] = useState<GymSession[]>([]);
  const [openedMonth, setOpenedMonth] = useState("");
  const [selectedSession, setSelectedSession] =
    useState<GymSession | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    const data = await getGymSessions();
    setSessions(data);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer cette séance ?")) {
      return;
    }

    await deleteGymSession(id);
    await loadSessions();
  }

  const groupedSessions = useMemo(() => {
    const groups: Record<string, GymSession[]> = {};

    sessions.forEach((session) => {
      const date = new Date(session.date);

      const key =
        `${date.getFullYear()}-${date.getMonth()}`;

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(session);
    });

    return groups;
  }, [sessions]);

  return (
    <AppContainer>
      <Section>
        <MuscuHeader
          totalSessions={sessions.length}
        />
      </Section>

      <Section>
        {Object.entries(groupedSessions).length === 0 ? (
          <PageCard>
            <h2
              style={{
                marginTop: 0,
                textAlign: "center",
              }}
            >
              Aucune séance
            </h2>

            <p
              style={{
                textAlign: "center",
                opacity: 0.7,
                marginBottom: 0,
              }}
            >
              Commence par ajouter ta première séance 💪
            </p>
          </PageCard>
        ) : (
          
          Object.entries(groupedSessions).map(
            ([key, monthSessions]) => {
              const first =
                new Date(monthSessions[0].date);

              const monthLabel =
                first.toLocaleDateString(
                  "fr-FR",
                  {
                    month: "long",
                    year: "numeric",
                  }
                );

              return (
                <MonthGymAccordion
                  key={key}
                  monthLabel={monthLabel}
                  sessions={monthSessions}
                  isOpen={
                    openedMonth === key
                  }
                  onToggle={() =>
                    setOpenedMonth(
                      openedMonth === key
                        ? ""
                        : key
                    )
                  }
                  onView={setSelectedSession}
                  onDelete={handleDelete}
                />
              );
            }
          )
        )}
      </Section>

      <GymSessionModal
        session={selectedSession}
        onClose={() =>
          setSelectedSession(null)
        }
      />
    </AppContainer>
  );
}