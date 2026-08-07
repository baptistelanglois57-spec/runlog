import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CircleHelp } from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";

import GymComparisonResult from "../components/Muscu/GymComparisonResult";

import type { GymSession } from "../types/GymSession";

import { getGymSessions } from "../services/gymService";
import { compareExercises } from "../utils/gymComparison";
import "./GymComparison.css";

export default function GymComparison() {
  const navigate = useNavigate();

  const [sessions, setSessions] =
    useState<GymSession[]>([]);

  const [sessionAId, setSessionAId] =
    useState("");

  const [sessionBId, setSessionBId] =
    useState("");

  const [comparison, setComparison] =
    useState<any[]>([]);

  const [showInfoA, setShowInfoA] =
    useState(false);

  const [showInfoB, setShowInfoB] =
    useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    const data = await getGymSessions();
    setSessions(data);
  }

  function handleCompare() {
    if (!sessionAId || !sessionBId) {
      return;
    }

    const sessionA = sessions.find(
      (s) => s.id === sessionAId
    );

    const sessionB = sessions.find(
      (s) => s.id === sessionBId
    );

    if (!sessionA || !sessionB) {
      return;
    }

    setComparison(
      compareExercises(
        sessionA.exercises,
        sessionB.exercises
      )
    );
  }

  return (
    <AppContainer>
      <div className="gym-comparison-page"><Section marginTop={8}>
        <header className="gym-comparison-page__header">
          <button
            className="gym-comparison-page__back"
            onClick={() => navigate("/tools")}
            aria-label="Retour aux outils"
          >
            <ChevronLeft size={22} />
          </button>
          <h1>Comparaison</h1>
          <span aria-hidden="true" />
        </header>

        <div className="gym-comparison-page__form">
          <SessionSelect
            label="Séance A"
            value={sessionAId}
            sessions={sessions}
            showInfo={showInfoA}
            onToggleInfo={() => setShowInfoA(!showInfoA)}
            onChange={setSessionAId}
            info="Séance de référence (ancienne séance)."
          />
          <SessionSelect
            label="Séance B"
            value={sessionBId}
            sessions={sessions}
            showInfo={showInfoB}
            onToggleInfo={() => setShowInfoB(!showInfoB)}
            onChange={setSessionBId}
            info="Séance analysée (la plus récente)."
          />
          <button className="gym-comparison-page__submit" onClick={handleCompare}>
            Comparer les séances
          </button>
        </div>

        {comparison.length > 0 && (
          <GymComparisonResult comparison={comparison} />
        )}
      </Section></div>
    </AppContainer>
  );
}

type SessionSelectProps = {
  label: string;
  value: string;
  sessions: GymSession[];
  showInfo: boolean;
  onToggleInfo: () => void;
  onChange: (value: string) => void;
  info: string;
};

function SessionSelect({
  label,
  value,
  sessions,
  showInfo,
  onToggleInfo,
  onChange,
  info,
}: SessionSelectProps) {
  return (
    <div className="gym-comparison-page__session">
      <div className="gym-comparison-page__session-label">
        <span>{label}</span>
        <button type="button" onClick={onToggleInfo} aria-label={`Informations ${label}`}>
          <CircleHelp size={15} />
        </button>
      </div>
      {showInfo && <p>{info}</p>}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Sélectionner une séance</option>
        {sessions.map((session) => (
          <option key={session.id} value={session.id}>
            {session.name} • {new Date(session.date).toLocaleDateString("fr-FR")}
          </option>
        ))}
      </select>
    </div>
  );
}
