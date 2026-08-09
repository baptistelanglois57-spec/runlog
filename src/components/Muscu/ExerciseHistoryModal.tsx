import { History, Lightbulb, X } from "lucide-react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { getGymProgressAdvice } from "../../utils/gymProgress";
import type { GymSession } from "../../types/GymSession";

type Props = {
  isOpen: boolean;

  onClose: () => void;

  exerciseName: string;

  sessions: GymSession[];
};
function normalizeExerciseName(name: string) {
  return (
    name
      // minuscules
      .toLowerCase()

      // enlève les accents
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

      // remplace toute ponctuation par un espace
      .replace(/[^a-z0-9\s]/g, " ")

      // supprime les petits mots inutiles
      .replace(/\b(de|du|des|la|le|les|a|au|aux|avec|sur|en|et)\b/g, " ")

      // espaces
      .replace(/\s+/g, " ")
      .trim()
.split(" ")
.map((word) => {
  // transforme automatiquement les pluriels en singulier
  if (
    word.length > 3 &&
    word.endsWith("s")
  ) {
    return word.slice(0, -1);
  }

  return word;
})
.join(" ")
      // trie les mots
      .split(" ")
      .sort()
      .join(" ")
  );
}
export default function ExerciseHistoryModal({
  isOpen,
  onClose,
  exerciseName,
  sessions,
}: Props) {
  if (!isOpen) return null;

  const history = sessions
    .flatMap((session) =>
      session.exercises
        .filter(
          (exercise) =>
            normalizeExerciseName(exercise.name) ===
            normalizeExerciseName(exerciseName)
        )
        .map((exercise) => ({
          date: session.date,
          sets: exercise.sets,
        }))
    )
    .slice(0, 2);
const advice =
  history.length > 0
    ? getGymProgressAdvice(
        history[0].sets
      )
    : null;
  return createPortal(
    <div onClick={onClose} className="exercise-history-modal">
      <div onClick={(event) => event.stopPropagation()} className="exercise-history-modal__panel">
        <header>
          <div><History size={19} /><h2>Historique</h2></div>
          <button type="button" onClick={onClose} aria-label="Fermer"><X size={19} /></button>
        </header>
        <div className="exercise-history-modal__content">
          <div className="exercise-history-modal__name">{exerciseName}</div>

          {history.length === 0 ? (
            <div className="exercise-history-modal__empty">
              Aucun historique.
            </div>
          ) : (
            history.map(
              (session, index) => (
                <div key={index} className="exercise-history-modal__session">
                  <div className="exercise-history-modal__date">
                    {new Date(
                      session.date
                    ).toLocaleDateString(
                      "fr-FR"
                    )}
                  </div>

                  <div className="exercise-history-modal__sets-header">
                    <div></div>

                    <div>
                      Répétitions
                    </div>

                    <div>
                      Poids
                    </div>
                  </div>

                  {session.sets.map(
                    (set, i) => (
                      <div key={i} className="exercise-history-modal__set">
                        <div>
                          S{i + 1}
                        </div>

                        <div>
                          {set.reps ?? "-"}
                        </div>

                        <div>
                          {set.weight ??
                            "-"}{" "}
                          kg
                        </div>
                      </div>
                    )
                  )}

                </div>
              )
            )
          )}
          {advice && (
            <div
              className="exercise-history-modal__advice"
              style={{ "--advice-color": advice.type === "success" ? "#22c55e" : advice.type === "warning" ? "#f59e0b" : "#ef4444" } as CSSProperties}
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
    </div>
    ,
    document.body
  );
}
