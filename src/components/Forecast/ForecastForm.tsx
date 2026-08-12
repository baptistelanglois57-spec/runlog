import { theme } from "../../styles/theme";

import type {
  ForecastInput,
} from "../../types/Forecast";

type Props = {
  value: ForecastInput;

  onChange: (
    value: ForecastInput
  ) => void;

  onCalculate: () => void;
};

export default function ForecastForm({
  value,
  onChange,
  onCalculate,
}: Props) {
  return (
    <div
      style={{
        background: theme.colors.card,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: 20,

        padding: 22,

        display: "flex",

        flexDirection: "column",

        gap: 18,
      }}
    >
      {/* Distance */}

      <div>
        <div
          style={{
            color: theme.colors.primary,

            marginBottom: 8,

            fontWeight: 700,
          }}
        >
          Distance (km)
        </div>

        <input
          type="number"

          value={
  value.distance === 0
    ? ""
    : value.distance
}

          onChange={(e) =>
            onChange({
              ...value,

              distance: Number(
                e.target.value
              ),
            })
          }

          style={{
            width: "100%",

            padding: 14,

            borderRadius: 14,

            border: `1px solid ${theme.colors.border}`,

            background:
              theme.colors.background,

            color:
              theme.colors.text,

            fontSize: 16,

            boxSizing:
              "border-box",
          }}
        />
      </div>

      {/* D+ */}

      <div>
        <div
          style={{
            color: theme.colors.primary,

            marginBottom: 8,

            fontWeight: 700,
          }}
        >
          Dénivelé positif (m)
        </div>

        <input
          type="number"
value={
  value.elevation === 0
    ? ""
    : value.elevation
}

          onChange={(e) =>
            onChange({
              ...value,

              elevation: Number(
                e.target.value
              ),
            })
          }

          style={{
            width: "100%",

            padding: 14,

            borderRadius: 14,

            border: `1px solid ${theme.colors.border}`,

            background:
              theme.colors.background,

            color:
              theme.colors.text,

            fontSize: 16,

            boxSizing:
              "border-box",
          }}
        />
      </div>

      {/* Surface */}

      <div>
        <div
          style={{
            color: theme.colors.primary,

            marginBottom: 10,

            fontWeight: 700,
          }}
        >
          Surface
        </div>

        <select
          value={value.surface}

          onChange={(e) =>
            onChange({
              ...value,

              surface:
                e.target
                  .value as
                  | "road"
                  | "trail",
            })
          }

          style={{
            width: "100%",

            padding: 14,

            borderRadius: 14,

            border: `1px solid ${theme.colors.border}`,

            background:
              theme.colors.background,

            color:
              theme.colors.text,

            fontSize: 16,
          }}
        >
          <option value="road">
            Route
          </option>

          <option value="trail">
            Trail
          </option>
        </select>
      </div>

      {/* Objectif */}

      <div>
        <div
          style={{
            color: theme.colors.primary,

            marginBottom: 10,

            fontWeight: 700,
          }}
        >
          Objectif
        </div>

        <select
          value={value.objective}

          onChange={(e) =>
            onChange({
              ...value,

              objective:
                e.target
                  .value as
                  | "training"
                  | "race",
            })
          }

          style={{
            width: "100%",

            padding: 14,

            borderRadius: 14,

            border: `1px solid ${theme.colors.border}`,

            background:
              theme.colors.background,

            color:
              theme.colors.text,

            fontSize: 16,
          }}
        >
          <option value="training">
            Entraînement
          </option>

          <option value="race">
            Compétition
          </option>
        </select>
      </div>

      <button
        onClick={onCalculate}
        style={{
          marginTop: 8,

          background:
            theme.colors.primary,

          color: theme.colors.text,

          border: "none",

          borderRadius: 16,

          padding: 16,

          cursor: "pointer",

          fontWeight: 700,

          fontSize: 16,
        }}
      >
        Estimer mon temps
      </button>
    </div>
  );
}
