import { ArrowRight, Dumbbell, TrendingUp } from "lucide-react";
import type { CSSProperties } from "react";

type Props = {
  comparison: any[];
};

export default function GymComparisonResult({
  comparison,
}: Props) {
  return (
    <div className="gym-comparison-results">
      {comparison.map((exercise, index) => (
        <article key={index} className="gym-comparison-exercise">
          {/* TITRE */}

          <div className="gym-comparison-exercise__title">
            <span><Dumbbell size={19} /></span>
            <h2>{exercise.name}</h2>
          </div>

          <div className="gym-comparison-exercise__sets">
            <div className="gym-comparison-exercise__sets-header">
              <span>Série</span>
              <span>Séance A</span>
              <span aria-hidden="true" />
              <span>Séance B</span>
            </div>
            {Array.from({
              length: Math.max(
                exercise.previousSets.length,
                exercise.currentSets.length
              ),
            }).map((_, i) => {
              const previous =
                exercise.previousSets[i];

              const current =
                exercise.currentSets[i];

              const previousReps =
                previous?.reps ?? 0;

              const currentReps =
                current?.reps ?? 0;

              const previousWeight =
                previous?.weight ?? 0;

              const currentWeight =
                current?.weight ?? 0;

              const improved =
                currentWeight >
                  previousWeight ||
                (currentWeight ===
                  previousWeight &&
                  currentReps >
                    previousReps);

              return (
                <div key={i} className="gym-comparison-exercise__set-row">
                  <span className="gym-comparison-exercise__set-number">S{i + 1}</span>
                  <span className="gym-comparison-exercise__set-value">
                    {previous
                      ? `${previous.reps ?? "-"} × ${
                          previous.weight ??
                          "-"
                        }`
                      : "—"}
                  </span>
                  <ArrowRight size={15} aria-hidden="true" />
                  <span className={`gym-comparison-exercise__set-value${improved ? " gym-comparison-exercise__set-value--improved" : ""}`}>
                    {current
                      ? `${current.reps ?? "-"} × ${
                          current.weight ??
                          "-"
                        }`
                      : "—"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="gym-comparison-exercise__evolution">
            <div><TrendingUp size={17} /> Évolution</div>

            {exercise.evolution.map(
              (
                item: string,
                i: number
              ) => (
                <div key={i}>
                  <span aria-hidden="true" />
                  <span>{item}</span>
                </div>
              )
            )}
          </div>

          <div
            className="gym-comparison-exercise__verdict"
            style={{ "--verdict-color": exercise.verdictColor } as CSSProperties}
          >
            <div>
              {exercise.verdict}
            </div>
            <p>
              {exercise.advice}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
