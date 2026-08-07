import { theme } from "../../styles/theme";

type Props = {
  comparison: any[];
};

export default function GymComparisonResult({
  comparison,
}: Props) {
  return (
    <div
      style={{
        marginTop: 28,
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
      {comparison.map((exercise, index) => (
        <div
          key={index}
          style={{
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 22,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {/* TITRE */}

          <div
            style={{
              color: theme.colors.primary,
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            💪 {exercise.name}
          </div>

          {/* TABLEAU COMPARATIF */}

          <div
            style={{
              background: theme.colors.background,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Header */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "80px 1fr 1fr",
                padding: "14px 16px",
                borderBottom: `1px solid ${theme.colors.border}`,
                background:
                  "rgba(255,255,255,.02)",
                fontWeight: 700,
                color: theme.colors.primary,
                fontSize: 14,
              }}
            >
              <div></div>

              <div
                style={{
                  textAlign: "center",
                }}
              >
                Séance A
              </div>

              <div
                style={{
                  textAlign: "center",
                }}
              >
                Séance B
              </div>
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

              const regressed =
                currentWeight <
                  previousWeight ||
                (currentWeight ===
                  previousWeight &&
                  currentReps <
                    previousReps);

              let currentColor =
                theme.colors.text;

              if (improved) {
                currentColor =
                  "#22C55E";
              } else if (
                regressed
              ) {
                currentColor =
                  "#FACC15";
              }

              return (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "80px 1fr 1fr",
                    padding:
                      "14px 16px",
                    borderBottom:
                      i !==
                      Math.max(
                        exercise
                          .previousSets
                          .length,
                        exercise
                          .currentSets
                          .length
                      ) -
                        1
                        ? `1px solid ${theme.colors.border}`
                        : "none",
                    alignItems:
                      "center",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color:
                        theme.colors.textSecondary,
                    }}
                  >
                    S{i + 1}
                  </div>

                  <div
                    style={{
                      textAlign:
                        "center",
                      color:
                        theme.colors.text,
                      fontWeight: 700,
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {previous
                      ? `${previous.reps ?? "-"} × ${
                          previous.weight ??
                          "-"
                        }`
                      : "—"}
                  </div>

                  <div
                    style={{
                      textAlign:
                        "center",
                      color:
                        currentColor,
                      fontWeight: 700,
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {current
                      ? `${current.reps ?? "-"} × ${
                          current.weight ??
                          "-"
                        }`
                      : "—"}
                  </div>
                </div>
              );
            })}
          </div>
                    {/* ÉVOLUTION */}

          <div
            style={{
              background: theme.colors.background,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 16,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                color: theme.colors.primary,
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              📈 Évolution
            </div>

            {exercise.evolution.map(
              (
                item: string,
                i: number
              ) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color:
                      theme.colors.text,
                    fontSize: 15,
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      color:
                        theme.colors.primary,
                    }}
                  >
                    •
                  </span>

                  <span>{item}</span>
                </div>
              )
            )}
          </div>

          {/* CONSEIL */}

          <div
            style={{
              background:
                `${exercise.verdictColor}18`,
              border: `1px solid ${exercise.verdictColor}`,
              borderRadius: 16,
              padding: 18,
            }}
          >
            <div
              style={{
                color:
                  exercise.verdictColor,
                fontWeight: 800,
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              {exercise.verdict}
            </div>

            <div
              style={{
                color:
                  theme.colors.text,
                lineHeight: 1.7,
                fontSize: 15,
              }}
            >
              {exercise.advice}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}