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
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.card,
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2.2fr 2fr 2fr 1.5fr",
          background: "#222",
          color: "#fff",
          fontWeight: 700,
          padding: "16px 18px",
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div>Exercice</div>

        <div style={{ textAlign: "center" }}>
          Résultat
        </div>

        <div style={{ textAlign: "center" }}>
          Comparaison
        </div>

        <div style={{ textAlign: "center" }}>
          Verdict
        </div>
      </div>

      {comparison.map((exercise, index) => (
        <div
          key={index}
          style={{
            display: "grid",
            gridTemplateColumns:
              "2.2fr 2fr 2fr 1.5fr",
            alignItems: "center",
            padding: "18px",
            borderBottom:
              index === comparison.length - 1
                ? "none"
                : `1px solid ${theme.colors.border}`,
            background:
              index % 2 === 0
                ? theme.colors.card
                : theme.colors.background,
          }}
        >
          {/* Exercice */}

          <div
            style={{
              color: theme.colors.primary,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {exercise.name}
          </div>

          {/* Résultat */}

          <div
            style={{
              textAlign: "center",
              color: theme.colors.text,
              fontWeight: 600,
            }}
          >
            {exercise.result}
          </div>

          {/* Comparaison */}

          <div
            style={{
              textAlign: "center",
              color: theme.colors.text,
              fontWeight: 600,
            }}
          >
            {exercise.comparison}
          </div>

          {/* Verdict */}

          <div
            style={{
              textAlign: "center",
              color: exercise.verdictColor,
              fontWeight: 700,
            }}
          >
            {exercise.verdict}
          </div>
        </div>
      ))}
    </div>
  );
}