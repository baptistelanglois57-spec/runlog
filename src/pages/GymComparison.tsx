import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Share2 } from "lucide-react";
import toast from "react-hot-toast";

import AppContainer from "../components/Layout/AppContainer";
import GymComparisonResult from "../components/Muscu/GymComparisonResult";
import { getExercises } from "../services/exerciseLibraryService";
import { getGymSessions } from "../services/gymService";
import type { ExerciseLibrary } from "../types/Gym/ExerciseLibrary";
import type { GymSession } from "../types/GymSession";
import { getGymExerciseComparisonContext } from "../utils/gymComparison";
import {
  createExerciseHistoryIndex,
  formatGymDate,
} from "../utils/gymExerciseHistory";
import {
  buildGymComparisonShareText,
  shareGymComparisonText,
} from "../utils/gymComparisonShare";

import "./GymComparison.css";

export default function GymComparison() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<GymSession[]>([]);
  const [library, setLibrary] = useState<ExerciseLibrary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedExerciseOccurrenceId, setSelectedExerciseOccurrenceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

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
  const selectedComparison = useMemo(
    () =>
      selectedSession && selectedExerciseIndex >= 0
        ? getGymExerciseComparisonContext(
            selectedSession,
            selectedExerciseIndex,
            library,
            historyIndex
          )
        : null,
    [historyIndex, library, selectedExerciseIndex, selectedSession]
  );

  function handleSessionChange(sessionId: string) {
    const session = sessions.find((item) => item.id === sessionId);
    setSelectedSessionId(sessionId);
    setSelectedExerciseOccurrenceId(session?.exercises[0]?.id ?? "");
  }

  async function handleShare() {
    if (!selectedSession || selectedSession.exercises.length === 0 || sharing) return;

    const text = buildGymComparisonShareText({
      session: selectedSession,
      library,
      historyIndex,
    });

    setSharing(true);
    try {
      const result = await shareGymComparisonText(
        text,
        `RunLog — Comparaison ${selectedSession.name}`
      );
      if (result === "copied") toast.success("Comparaison copiée");
    } catch (error) {
      console.error(error);
      toast.error("Impossible de partager la comparaison.");
    } finally {
      setSharing(false);
    }
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
              <div className="gym-comparison-selector__heading">
                <label htmlFor="comparison-session">Séance analysée</label>
                <button
                  type="button"
                  className="gym-comparison-selector__share"
                  aria-label="Partager la comparaison complète de la séance"
                  disabled={sharing || !selectedSession || selectedSession.exercises.length === 0}
                  onClick={handleShare}
                >
                  <Share2 size={17} strokeWidth={2.2} />
                  {sharing ? "Partage…" : "Partager"}
                </button>
              </div>
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
                currentEntry={selectedComparison?.currentEntry ?? null}
                previousEntry={selectedComparison?.previousEntry ?? null}
                comparison={selectedComparison?.comparison ?? null}
                reliableHistoryAvailable={Boolean(selectedComparison?.resolution.exerciseId)}
              />
            ) : null}
          </>
        )}
      </div>
    </AppContainer>
  );
}
