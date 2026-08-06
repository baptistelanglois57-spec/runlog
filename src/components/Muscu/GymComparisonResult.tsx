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
        gap: 18,
      }}
    >
      {comparison.map((exercise, index) => (
        <div
          key={index}
          style={{
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 20,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* HEADER */}

          <div
            style={{
              color: theme.colors.primary,
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            💪 {exercise.name}
          </div>

          {/* AVANT / APRÈS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr auto 1fr",
              alignItems: "stretch",
              gap: 14,
            }}
          >
            {/* AVANT */}

            <div
              style={{
                background:
                  theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: 16,
                padding: 16,
              }}
            >
              <div
                style={{
                  color:
                    theme.colors.textSecondary,
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                🏋️ Avant
              </div>

              <div
                style={{
                  color:
                    theme.colors.text,
                  fontWeight: 700,
                  fontSize: 17,
                  lineHeight: 1.5,
                }}
              >
                {exercise.previousResult}
              </div>
            </div>
                        {/* FLÈCHE */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.primary,
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              →
            </div>

            {/* APRÈS */}

            <div
              style={{
                background:
                  theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: 16,
                padding: 16,
              }}
            >
              <div
                style={{
                  color:
                    theme.colors.textSecondary,
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                🏋️ Après
              </div>

              <div
                style={{
                  color:
                    theme.colors.text,
                  fontWeight: 700,
                  fontSize: 17,
                  lineHeight: 1.5,
                }}
              >
                {exercise.currentResult}
              </div>
            </div>
          </div>

          {/* BADGE */}

          <div
            style={{
              borderTop: `1px solid ${theme.colors.border}`,
              paddingTop: 18,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                background: `${exercise.verdictColor}20`,
                color: exercise.verdictColor,
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {exercise.verdict}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}