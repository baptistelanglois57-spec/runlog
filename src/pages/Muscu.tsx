import { useEffect, useMemo, useState } from "react";
import { Dumbbell } from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import MuscuHeader from "../components/Muscu/MuscuHeader";
import MonthGymAccordion from "../components/Muscu/MonthGymAccordion";
import GymSessionModal from "../components/Muscu/GymSessionModal";

import type { GymSession } from "../types/GymSession";
import { deleteGymSession, getGymSessions } from "../services/gymService";
import { deleteGymRecordNotificationsForSession } from "../services/notificationService";

import "./Muscu.css";

export default function Muscu() {
  const [sessions, setSessions] = useState<GymSession[]>([]);
  const [openedMonth, setOpenedMonth] = useState("");
  const [selectedSession, setSelectedSession] = useState<GymSession | null>(null);

  async function loadSessions() {
    const data = await getGymSessions();
    setSessions(data);
  }

  useEffect(() => {
    // La synchronisation initiale doit mettre à jour l'état après le chargement Supabase.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSessions();
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer cette séance ?")) {
      return;
    }

    const deleted = await deleteGymSession(id);
    if (!deleted) {
      return;
    }

    await deleteGymRecordNotificationsForSession(id);
    await loadSessions();
  }

  const groupedSessions = useMemo(() => {
    const groups: Record<string, GymSession[]> = {};

    sessions.forEach((session) => {
      const date = new Date(session.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(session);
    });

    return groups;
  }, [sessions]);

  return (
    <AppContainer>
      <main className="muscu-page">
        <MuscuHeader totalSessions={sessions.length} />

        <section className="muscu-content">
          {Object.entries(groupedSessions).length === 0 ? (
            <div className="muscu-empty-state">
              <span className="muscu-empty-state__icon" aria-hidden="true">
                <Dumbbell size={22} strokeWidth={2} />
              </span>
              <h2>Aucune séance</h2>
              <p>Commence par ajouter ta première séance 💪</p>
            </div>
          ) : (
            <div className="muscu-month-list">
              {Object.entries(groupedSessions).map(([key, monthSessions]) => {
                const first = new Date(monthSessions[0].date);
                const monthLabel = first.toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                });

                return (
                  <MonthGymAccordion
                    key={key}
                    monthLabel={monthLabel}
                    sessions={monthSessions}
                    isOpen={openedMonth === key}
                    onToggle={() =>
                      setOpenedMonth(openedMonth === key ? "" : key)
                    }
                    onView={setSelectedSession}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      <GymSessionModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </AppContainer>
  );
}
