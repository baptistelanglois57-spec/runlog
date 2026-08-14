import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import GymComparisonResult from "../components/Muscu/GymComparisonResult";
import { getExercises } from "../services/exerciseLibraryService";
import { getGymSessions } from "../services/gymService";
import type { ExerciseLibrary } from "../types/Gym/ExerciseLibrary";
import type { GymSession } from "../types/GymSession";
import { compareExerciseOccurrences } from "../utils/gymComparison";
import {
  createExerciseHistoryIndex,
  formatGymDate,
  getExerciseHistory,
  getPreviousExerciseOccurrence,
  resolveExerciseIdentity,
} from "../utils/gymExerciseHistory";

import "./GymComparison.css";

export default function GymComparison() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<GymSession[]>([]);
  const [library, setLibrary] = useState<ExerciseLibrary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedExerciseOccurrenceId, setSelectedExerciseOccurrenceId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([getGymSessions(), getExercises()]).then(([sessionData, libraryData]) => {
      if (!active) return;

      const sortedSessions = [...sessionData].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const initialSession = sortedSessions[0];

      setSessions(sortedSessions);
      setLibrary(libraryData);
      setSelectedSessionId(initialSession?.id ?? "");
      setSelectedExerciseOccurrenceId(initialSession?.exercises[0]?.id ?? "");
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const historyIndex = useMemo(
    () => createExerciseHistoryIndex(sessions, library),
    [library, sessions]
  );

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) ?? null,
    [selectedSessionId, sessions]
  );

  const selectedExerciseIndex = selectedSession?.exercises.findIndex(
    (exercise) => exercise.id === selectedExerciseOccurrenceId
  ) ?? -1;
  const selectedExercise =
    selectedExerciseIndex >= 0 ? selectedSession?.exercises[selectedExerciseIndex] ?? null : null;
  const resolution = selectedExercise
    ? resolveExerciseIdentity(selectedExercise, library)
    : null;
  const resolvedExerciseId = resolution?.exerciseId ?? null;

  const currentEntry = useMemo(() => {
    if (!selectedSession || !resolvedExerciseId || selectedExerciseIndex < 0) return null;
    return getExerciseHistory(resolvedExerciseId, historyIndex).find(
      (entry) =>
        entry.sessionId === selectedSession.id &&
        entry.exerciseIndex === selectedExerciseIndex
    ) ?? null;
  }, [historyIndex, resolvedExerciseId, selectedExerciseIndex, selectedSession]);

  const previousEntry = useMemo(() => {
    if (!currentEntry) return null;
    return getPreviousExerciseOccurrence(
      currentEntry,
      getExerciseHistory(currentEntry.exerciseId, historyIndex)
    );
  }, [currentEntry, historyIndex]);

  const comparison = useMemo(
    () =>
      currentEntry && previousEntry
        ? compareExerciseOccurrences(previousEntry.exercise, currentEntry.exercise)
        : null,
    [currentEntry, previousEntry]
  );

  function handleSessionChange(sessionId: string) {
    const session = sessions.find((item) => item.id === sessionId);
    setSelectedSessionId(sessionId);
    setSelectedExerciseOccurrenceId(session?.exercises[0]?.id ?? "");
  }

  return (
    <AppContainer>
      <div className="gym-comparison-page">
        <header className="gym-comparison-page__header">
          <button
            type="button"
            className="gym-comparison-page__back"
            onClick={() => navigate("/tools")}
            aria-label="Retour aux outils"
          >
            <ChevronLeft size={22} />
          </button>
          <h1>Comparaison</h1>
          <span aria-hidden="true" />
        </header>

        {loading ? (
          <div className="gym-comparison-page__state">Chargement…</div>
        ) : sessions.length === 0 ? (
          <div className="gym-comparison-page__state">
            <strong>Aucune séance enregistrée</strong>
            <span>La comparaison sera disponible après votre première séance.</span>
          </div>
        ) : (
          <>
            <section className="gym-comparison-selector">
              <label htmlFor="comparison-session">Séance analysée</label>
              <select
                id="comparison-session"
                value={selectedSessionId}
                onChange={(event) => handleSessionChange(event.target.value)}
              >
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {formatGymDate(session.date)} — {session.name}
                  </option>
                ))}
              </select>

              {selectedSession && selectedSession.exercises.length > 0 && (
                <div className="gym-comparison-selector__exercises" aria-label="Exercices de la séance">
                  {selectedSession.exercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      className={
                        exercise.id === selectedExerciseOccurrenceId
                          ? "gym-comparison-selector__chip gym-comparison-selector__chip--active"
                          : "gym-comparison-selector__chip"
                      }
                      onClick={() => setSelectedExerciseOccurrenceId(exercise.id)}
                    >
                      {exercise.name || "Exercice sans nom"}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {selectedSession?.exercises.length === 0 ? (
              <div className="gym-comparison-page__state">
                <strong>Aucun exercice dans cette séance</strong>
              </div>
            ) : selectedExercise ? (
              <GymComparisonResult
                currentEntry={currentEntry}
                previousEntry={previousEntry}
                comparison={comparison}
                reliableHistoryAvailable={Boolean(resolution?.exerciseId)}
              />
            ) : null}
          </>
        )}
      </div>
    </AppContainer>
  );
}
