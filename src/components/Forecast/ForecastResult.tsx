import { theme } from "../../styles/theme";

import type {
  ForecastResult,
} from "../../types/Forecast";

type Props = {
  result: ForecastResult;
};

function formatTime(
  minutes: number
) {
  const h = Math.floor(
    minutes / 60
  );

  const min = Math.round(
    minutes % 60
  );

  if (h === 0) {
    return `${min} min`;
  }

  return `${h} h ${min} min`;
}

function formatPace(
  pace: number
) {
  const min = Math.floor(pace);

  const sec = Math.round(
    (pace - min) * 60
  );

  return `${min}'${sec
    .toString()
    .padStart(2, "0")}/km`;
}

export default function ForecastResult({
  result,
}: Props) {
  return (
    <div
      style={{
        background:
          theme.colors.card,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: 20,

        padding: 24,

        marginTop: 24,
      }}
    >
      <h2
        style={{
          marginTop: 0,

          marginBottom: 24,

          color:
            theme.colors.primary,

          textAlign: "center",
        }}
      >
        📈 Résultat
      </h2>

      <ResultRow
        label="Temps estimé"
        value={formatTime(
          result.estimatedTime
        )}
      />

      <ResultRow
        label="Allure estimée"
        value={formatPace(
          result.estimatedPace
        )}
      />

      <ResultRow
        label="FC moyenne"
        value={`${result.estimatedHeartRate} bpm`}
      />

      <ResultRow
        label="Confiance"
        value={`${result.confidence}%`}
      />

      <div
        style={{
          marginTop: 30,

          paddingTop: 20,

          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div
          style={{
            color:
              theme.colors.primary,

            fontWeight: 700,

            marginBottom: 12,
          }}
        >
          Données utilisées
        </div>

        <div
          style={{
            color:
              theme.colors.textSecondary,

            lineHeight: 1.8,
          }}
        >
          ✓ {result.analysedRuns} sorties
          analysées
          <br />
          ✓ {result.analysedRaces} compétitions
          analysées
        </div>
      </div>
    </div>
  );
}

type RowProps = {
  label: string;

  value: string;
};

function ResultRow({
  label,
  value,
}: RowProps) {
  return (
    <div
      style={{
        display: "flex",

        justifyContent:
          "space-between",

        alignItems: "center",

        marginBottom: 18,
      }}
    >
      <span
        style={{
          color:
            theme.colors.textSecondary,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color:
            theme.colors.primary,

          fontWeight: 700,

          fontSize: 17,
        }}
      >
        {value}
      </span>
    </div>
  );
}