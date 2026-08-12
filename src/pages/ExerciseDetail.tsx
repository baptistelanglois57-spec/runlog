import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, ChevronLeft, Dumbbell, Layers3, Trophy } from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import { getExercises } from "../services/exerciseLibraryService";
import { getGymSessions } from "../services/gymService";
import type { ExerciseLibrary } from "../types/Gym/ExerciseLibrary";
import type { GymSet } from "../types/Gym/GymSet";
import type { GymSession } from "../types/GymSession";
import {
  createExerciseHistoryIndex,
  formatGymDate,
  formatGymNumber,
  getBestExercisePerformance,
  getExerciseHistory,
  getExerciseSessionVolume,
} from "../utils/gymExerciseHistory";

import "./ExerciseDetail.css";

function displaySet(set: GymSet) {
  const reps = typeof set.reps === "number" && Number.isFinite(set.reps) ? set.reps : null;
  const weight = typeof set.weight === "number" && Number.isFinite(set.weight) ? set.weight : null;
  return {
    reps: reps === null ? "—" : formatGymNumber(reps),
    weight: weight === null ? "—" : `${formatGymNumber(weight)} kg`,
  };
}

export default function ExerciseDetail() {
  const navigate = useNavigate();
  const { exerciseId = "" } = useParams();
  const [library, setLibrary] = useState<ExerciseLibrary[]>([]);
  const [sessions, setSessions] = useState<GymSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([getExercises(), getGymSessions()]).then(([libraryData, sessionData]) => {
      if (!active) return;
      setLibrary(libraryData);
      setSessions(sessionData);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const exercise = useMemo(
    () => library.find((item) => item.id === exerciseId) ?? null,
    [exerciseId, library]
  );
  const historyIndex = useMemo(
    () => createExerciseHistoryIndex(sessions, library),
    [library, sessions]
  );
  const history = useMemo(
    () => (exercise ? getExerciseHistory(exercise.id, historyIndex) : []),
    [exercise, historyIndex]
  );
  const bestPerformance = useMemo(
    () => getBestExercisePerformance(history),
    [history]
  );

  return (
    <AppContainer>
      <div className="exercise-detail-page">
        <header className="exercise-detail-page__header">
          <button
            type="button"
            onClick={() => navigate("/exercise-library")}
            aria-label="Retour à la bibliothèque"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1>{exercise?.name ?? (loading ? "Exercice" : "Introuvable")}</h1>
            {exercise && <p>{exercise.muscleGroup}</p>}
          </div>
          <span aria-hidden="true" />
        </header>

        {loading ? (
          <div className="exercise-detail-page__state">Chargement…</div>
        ) : !exercise ? (
          <div className="exercise-detail-page__state">
            <strong>Exercice introuvable</strong>
            <p>Cet exercice n’existe plus dans la bibliothèque.</p>
          </div>
        ) : history.length === 0 ? (
          <div className="exercise-detail-page__state exercise-detail-page__state--empty">
            <span><Dumbbell size={22} /></span>
            <strong>Aucune séance enregistrée</strong>
            <p>Cet exercice apparaîtra ici après sa première utilisation dans une séance.</p>
          </div>
        ) : (
          <>
            {bestPerformance && (
              <section className="exercise-best-performance">
                <header>
                  <span><Trophy size={19} /></span>
                  <h2>Meilleure performance</h2>
                </header>

                <strong className="exercise-best-performance__value">
                  {bestPerformance.mode === "weighted"
                    ? `${formatGymNumber(bestPerformance.set.reps ?? 0)} × ${formatGymNumber(bestPerformance.set.weight ?? 0)} kg`
                    : `${formatGymNumber(bestPerformance.set.reps ?? 0)} répétitions`}
                </strong>

                <div className="exercise-best-performance__details">
                  <span><CalendarDays size={15} /> {formatGymDate(bestPerformance.entry.sessionDate)}</span>
                  {bestPerformance.estimatedOneRepMax !== null && (
                    <span>Performance estimée : {formatGymNumber(bestPerformance.estimatedOneRepMax)} kg</span>
                  )}
                  {bestPerformance.setVolume !== null && (
                    <span>Volume de la série : {formatGymNumber(bestPerformance.setVolume)} kg</span>
                  )}
                </div>
              </section>
            )}

            <section className="exercise-detail-history">
              <div className="exercise-detail-history__heading">
                <div>
                  <h2>Historique</h2>
                  <p>{history.length} séance{history.length > 1 ? "s" : ""}</p>
                </div>
                <Layers3 size={19} />
              </div>

              <div className="exercise-detail-history__list">
                {history.map((entry) => {
                  const volume = getExerciseSessionVolume(entry.sets);

                  return (
                    <article
                      key={`${entry.sessionId}-${entry.exerciseIndex}`}
                      className="exercise-history-card"
                    >
                      <header>
                        <div>
                          <time>{formatGymDate(entry.sessionDate)}</time>
                          <span>{entry.sessionName}</span>
                        </div>
                        <CalendarDays size={16} />
                      </header>

                      <div className="exercise-history-card__sets">
                        <div className="exercise-history-card__sets-header">
                          <span>Série</span>
                          <span>Répétitions</span>
                          <span>Poids</span>
                        </div>
                        {entry.sets.map((set, index) => {
                          const displayed = displaySet(set);
                          return (
                            <div key={index} className="exercise-history-card__set">
                              <span>{index + 1}</span>
                              <strong>{displayed.reps}</strong>
                              <strong>{displayed.weight}</strong>
                            </div>
                          );
                        })}
                      </div>

                      {volume !== null && (
                        <footer>
                          <span>Volume</span>
                          <strong>{formatGymNumber(volume)} kg</strong>
                        </footer>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </AppContainer>
  );
}
