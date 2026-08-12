import { CalendarDays, Dumbbell, Lightbulb, TrendingUp } from "lucide-react";
import type { CSSProperties } from "react";

import type { ExerciseComparison } from "../../utils/gymComparison";
import {
  formatGymDate,
  formatGymNumber,
  type ExerciseHistoryEntry,
} from "../../utils/gymExerciseHistory";
import type { GymSet } from "../../types/Gym/GymSet";

type Props = {
  exerciseName: string;
  currentEntry: ExerciseHistoryEntry | null;
  previousEntry: ExerciseHistoryEntry | null;
  comparison: ExerciseComparison | null;
  reliableHistoryAvailable: boolean;
};

function formatSet(set: GymSet) {
  const reps = typeof set.reps === "number" && Number.isFinite(set.reps) ? set.reps : null;
  const weight = typeof set.weight === "number" && Number.isFinite(set.weight) ? set.weight : null;

  if (reps !== null && weight !== null) return `${formatGymNumber(reps)} × ${formatGymNumber(weight)} kg`;
  if (reps !== null) return `${formatGymNumber(reps)} reps`;
  if (weight !== null) return `${formatGymNumber(weight)} kg`;
  return "—";
}

function OccurrenceCard({ label, entry }: { label: string; entry: ExerciseHistoryEntry }) {
  return (
    <section className="gym-comparison-occurrence">
      <header>
        <div>
          <span>{label}</span>
          <strong>{formatGymDate(entry.sessionDate)}</strong>
        </div>
        <CalendarDays size={17} strokeWidth={2.2} />
      </header>
      <small>{entry.sessionName}</small>
      <div className="gym-comparison-occurrence__sets">
        {entry.sets.map((set, index) => (
          <div key={index}>
            <span>Série {index + 1}</span>
            <strong>{formatSet(set)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function GymComparisonResult({
  exerciseName,
  currentEntry,
  previousEntry,
  comparison,
  reliableHistoryAvailable,
}: Props) {
  return (
    <div className="gym-comparison-result">
      <div className="gym-comparison-result__title">
        <span><Dumbbell size={19} /></span>
        <div>
          <small>Exercice sélectionné</small>
          <h2>{exerciseName}</h2>
        </div>
      </div>

      {!reliableHistoryAvailable || !currentEntry ? (
        <div className="gym-comparison-result__empty">
          <strong>Historique fiable indisponible</strong>
          <p>Cette ancienne entrée ne correspond pas exactement à un exercice unique de la bibliothèque.</p>
        </div>
      ) : (
        <>
          <OccurrenceCard label="Séance actuelle" entry={currentEntry} />

          {previousEntry ? (
            <OccurrenceCard label="Séance précédente" entry={previousEntry} />
          ) : (
            <div className="gym-comparison-result__empty">
              <strong>Première séance enregistrée</strong>
              <p>Aucune performance précédente n’est disponible pour cet exercice.</p>
            </div>
          )}

          {comparison && (
            <>
              <section className="gym-comparison-evolution">
                <header><TrendingUp size={18} /> <h3>Évolution</h3></header>
                <div>
                  {comparison.evolution.map((item) => <span key={item}>{item}</span>)}
                </div>
              </section>

              <section
                className="gym-comparison-advice"
                style={{ "--verdict-color": comparison.verdictColor } as CSSProperties}
              >
                <header><Lightbulb size={18} /> <span>Conseil RunLog</span></header>
                <strong>{comparison.verdict}</strong>
                <p>{comparison.advice}</p>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
