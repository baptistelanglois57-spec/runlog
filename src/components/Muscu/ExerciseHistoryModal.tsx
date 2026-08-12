import { useMemo } from "react";
import { History, Lightbulb, X } from "lucide-react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";

import { getGymProgressAdvice } from "../../utils/gymProgress";
import {
  createExerciseHistoryIndex,
  formatGymDate,
  getExerciseHistory,
} from "../../utils/gymExerciseHistory";
import type { ExerciseLibrary } from "../../types/Gym/ExerciseLibrary";
import type { GymSession } from "../../types/GymSession";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  exerciseId: string | null;
  exerciseName: string;
  exerciseLibrary: ExerciseLibrary[];
  sessions: GymSession[];
};

export default function ExerciseHistoryModal({
  isOpen,
  onClose,
  exerciseId,
  exerciseName,
  exerciseLibrary,
  sessions,
}: Props) {
  const historyIndex = useMemo(
    () => createExerciseHistoryIndex(sessions, exerciseLibrary),
    [exerciseLibrary, sessions]
  );
  const history = exerciseId
    ? getExerciseHistory(exerciseId, historyIndex).slice(0, 2)
    : [];
  const advice = history.length > 0 ? getGymProgressAdvice(history[0].sets) : null;

  if (!isOpen) return null;

  return createPortal(
    <div onClick={onClose} className="exercise-history-modal">
      <div
        onClick={(event) => event.stopPropagation()}
        className="exercise-history-modal__panel"
      >
        <header>
          <div><History size={19} /><h2>Historique</h2></div>
          <button type="button" onClick={onClose} aria-label="Fermer"><X size={19} /></button>
        </header>

        <div className="exercise-history-modal__content">
          <div className="exercise-history-modal__name">{exerciseName || "Exercice"}</div>

          {!exerciseId ? (
            <div className="exercise-history-modal__empty">
              Historique fiable indisponible pour cette ancienne entrée.
            </div>
          ) : history.length === 0 ? (
            <div className="exercise-history-modal__empty">Aucun historique.</div>
          ) : (
            history.map((entry) => (
              <div
                key={`${entry.sessionId}-${entry.exerciseIndex}`}
                className="exercise-history-modal__session"
              >
                <div className="exercise-history-modal__date">
                  {formatGymDate(entry.sessionDate)}
                </div>

                <div className="exercise-history-modal__sets-header">
                  <div />
                  <div>Répétitions</div>
                  <div>Poids</div>
                </div>

                {entry.sets.map((set, setIndex) => (
                  <div key={setIndex} className="exercise-history-modal__set">
                    <div>S{setIndex + 1}</div>
                    <div>{set.reps ?? "-"}</div>
                    <div>{set.weight ?? "-"} kg</div>
                  </div>
                ))}
              </div>
            ))
          )}

          {advice && (
            <div
              className="exercise-history-modal__advice"
              style={{
                "--advice-color":
                  advice.type === "success"
                    ? "#22c55e"
                    : advice.type === "warning"
                      ? "#f59e0b"
                      : "#ef4444",
              } as CSSProperties}
            >
              <div><Lightbulb size={17} /> Conseil RunLog</div>
              <strong>{advice.title}</strong>
              <p>{advice.message}</p>
            </div>
          )}
        </div>

        <button className="exercise-history-modal__close" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>,
    document.body
  );
}
