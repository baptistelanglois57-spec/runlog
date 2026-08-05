import { theme } from "../../styles/theme";

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

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,

        background: "rgba(0,0,0,.78)",

        backdropFilter: "blur(8px)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        style={{
          width: "min(92vw,460px)",

          background:
            theme.colors.card,

          borderRadius: 22,

          border: `1px solid ${theme.colors.border}`,

          padding: 22,

          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            marginTop: 0,

            textAlign: "center",

            color:
              theme.colors.primary,
          }}
        >
          📖 Historique
        </h2>

        <div
          style={{
            textAlign: "center",

            color: theme.colors.text,

            fontWeight: 700,

            marginBottom: 24,

            fontSize: 18,
          }}
        >
          {exerciseName}
        </div>

        {history.length === 0 ? (
          <div
            style={{
              textAlign: "center",

              color:
                theme.colors.textSecondary,

              padding: "30px 0",
            }}
          >
            Aucun historique.
          </div>
        ) : (
          history.map(
            (session, index) => (
              <div
                key={index}
                style={{
                  marginBottom:
                    index ===
                    history.length - 1
                      ? 0
                      : 26,
                }}
              >
                <div
                  style={{
                    color:
                      theme.colors.primary,

                    fontWeight: 700,

                    marginBottom: 14,
                  }}
                >
                  {new Date(
                    session.date
                  ).toLocaleDateString(
                    "fr-FR"
                  )}
                </div>

                <div
                  style={{
                    display: "grid",

                    gridTemplateColumns:
                      "70px 1fr 1fr",

                    marginBottom: 10,

                    color:
                      theme.colors
                        .textSecondary,

                    fontWeight: 700,

                    fontSize: 13,
                  }}
                >
                  <div></div>

                  <div
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    Répétitions
                  </div>

                  <div
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    Poids
                  </div>
                </div>

                {session.sets.map(
                  (set, i) => (
                    <div
                      key={i}
                      style={{
                        display: "grid",

                        gridTemplateColumns:
                          "70px 1fr 1fr",

                        padding:
                          "6px 0",

                        alignItems:
                          "center",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                        }}
                      >
                        S{i + 1}
                      </div>

                      <div
                        style={{
                          textAlign:
                            "center",
                        }}
                      >
                        {set.reps ?? "-"}
                      </div>

                      <div
                        style={{
                          textAlign:
                            "center",

                          fontWeight: 700,
                        }}
                      >
                        {set.weight ??
                          "-"}{" "}
                        kg
                      </div>
                    </div>
                  )
                )}

                {index !==
                  history.length -
                    1 && (
                  <hr
                    style={{
                      marginTop: 18,

                      border: "none",

                      borderTop: `1px solid ${theme.colors.border}`,
                    }}
                  />
                )}
              </div>
            )
          )
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: 26,

            width: "100%",

            padding: "16px",

            border: "none",

            borderRadius: 14,

            background:
              theme.colors.primary,

            color: "#000",

            fontWeight: 700,

            cursor: "pointer",
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}