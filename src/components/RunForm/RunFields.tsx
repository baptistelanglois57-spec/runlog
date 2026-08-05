import { useEffect, useState } from "react";

import {
  Calendar,
  Route,
  HeartPulse,
  Mountain,
  Clock3,
  Activity,
} from "lucide-react";

import { theme } from "../../styles/theme";
import { UI } from "../../styles/ui";

type Props = {
  type: "training" | "race" | "gym";

  setType: (
    value: "training" | "race" | "gym"
  ) => void;

  surface: "road" | "trail";

  setSurface: (
    value: "road" | "trail"
  ) => void;

  date: string;

  setDate: (
    value: string
  ) => void;

  distance: string;

  setDistance: (
    value: string
  ) => void;

  duration: string;

  setDuration: (
    value: string
  ) => void;

  elevation: string;

  setElevation: (
    value: string
  ) => void;

  averageHeartRate: string;

  setAverageHeartRate: (
    value: string
  ) => void;
};

export default function RunFields({
  type,
  setType,

  surface,
  setSurface,

  date,
  setDate,

  distance,
  setDistance,

  duration,
  setDuration,

  elevation,
  setElevation,

  averageHeartRate,
  setAverageHeartRate,
}: Props) {
  const [hours, setHours] =
    useState("");

  const [minutes, setMinutes] =
    useState("");

  const [seconds, setSeconds] =
    useState("");

  useEffect(() => {
    if (!duration) return;

    const parts =
      duration.split(":");

    if (parts.length === 3) {
      setHours(parts[0]);
      setMinutes(parts[1]);
      setSeconds(parts[2]);
    }
  }, []);

  useEffect(() => {
    setDuration(
      `${(hours || "0").padStart(
        2,
        "0"
      )}:${(minutes || "0").padStart(
        2,
        "0"
      )}:${(seconds || "0").padStart(
        2,
        "0"
      )}`
    );
  }, [
    hours,
    minutes,
    seconds,
  ]);

  function formatTime(
    value: string,
    max: number
  ) {
    const number =
      value.replace(/\D/g, "");

    if (number === "")
      return "";

    return Math.min(
      Number(number),
      max
    ).toString();
  }

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    gap: 6,

    fontSize:
      UI.FONT_SMALL,

    fontWeight: 700,

    color:
      theme.colors.text,

    marginBottom: 8,
  };

  const inputStyle = {
    width: "100%",

    height: 56,

    padding: "0 14px",

    borderRadius:
      UI.INPUT_RADIUS,

    border: `1px solid ${theme.colors.border}`,

    background:
      theme.colors.background,

    color:
      theme.colors.text,

    fontSize:
      UI.FONT_BODY,

    outline: "none",

    boxSizing:
      "border-box" as const,

    WebkitAppearance:
      "none" as const,
  };

  const timeInputStyle = {
    flex: 1,

    height: 56,

    borderRadius:
      UI.INPUT_RADIUS,

    border: `1px solid ${theme.colors.border}`,

    background:
      theme.colors.background,

    color:
      theme.colors.text,

    fontSize: 22,

    fontWeight: 700,

    textAlign:
      "center" as const,

    outline: "none",

    boxSizing:
      "border-box" as const,

    WebkitAppearance:
      "none" as const,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Activité / Terrain / Date */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr 1fr",
          gap: 14,
        }}
      >
        {/* Activité */}

        <div>
          <div style={labelStyle}>
            <Activity
              size={16}
              color={
                theme.colors
                  .primary
              }
            />
            Activité
          </div>

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target
                  .value as
                  | "training"
                  | "race"
                  | "gym"
              )
            }
            style={{
              ...inputStyle,
              textAlign:
                "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            <option value="training">
              🏃 
            </option>

            <option value="race">
              🏁 
            </option>

            <option value="gym">
              💪 
            </option>
          </select>
        </div>

        {/* Terrain */}

        <div>
          <div style={labelStyle}>
            <Mountain
              size={16}
              color={
                theme.colors
                  .primary
              }
            />
            Terrain
          </div>

          <select
            value={surface}
            onChange={(e) =>
              setSurface(
                e.target
                  .value as
                  | "road"
                  | "trail"
              )
            }
            style={{
              ...inputStyle,
              textAlign:
                "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            <option value="road">
              🛣️ 
            </option>

            <option value="trail">
              🥾 
            </option>
          </select>
        </div>

        {/* Date */}

        <div>
          <div style={labelStyle}>
            <Calendar
              size={16}
              color={
                theme.colors
                  .primary
              }
            />
            Date
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
            style={{
              ...inputStyle,
              textAlign:
                "center",
              fontSize: 17,
              fontWeight: 700,
            }}
          />
        </div>
      </div>
            {/* Distance / BPM / D+ */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3,minmax(0,1fr))",
          gap: 12,
        }}
      >
        <div>
          <div style={labelStyle}>
            <Route
              size={16}
              color={
                theme.colors.primary
              }
            />
            Distance
          </div>

          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={distance}
            onChange={(e) =>
              setDistance(
                e.target.value
              )
            }
            style={{
              ...inputStyle,
              MozAppearance:
                "textfield",
              textAlign: "center",
              fontSize: 18,
              fontWeight: 700,
            }}
          />
        </div>

        <div>
          <div style={labelStyle}>
            <HeartPulse
              size={16}
              color={
                theme.colors.primary
              }
            />
            BPM
          </div>

          <input
            type="number"
            inputMode="numeric"
            value={
              averageHeartRate
            }
            onChange={(e) =>
              setAverageHeartRate(
                e.target.value
              )
            }
            style={{
              ...inputStyle,
              MozAppearance:
                "textfield",
              textAlign: "center",
              fontSize: 18,
              fontWeight: 700,
            }}
          />
        </div>

        <div>
          <div style={labelStyle}>
            <Mountain
              size={16}
              color={
                theme.colors.primary
              }
            />
            D+
          </div>

          <input
            type="number"
            inputMode="numeric"
            value={elevation}
            onChange={(e) =>
              setElevation(
                e.target.value
              )
            }
            style={{
              ...inputStyle,
              MozAppearance:
                "textfield",
              textAlign: "center",
              fontSize: 18,
              fontWeight: 700,
            }}
          />
        </div>
      </div>

      {/* Temps */}

      <div>
        <div style={labelStyle}>
          <Clock3
            size={16}
            color={
              theme.colors.primary
            }
          />
          Temps
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3,minmax(0,1fr))",
            gap: 12,
          }}
        >
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={99}
            value={hours}
            onChange={(e) =>
              setHours(
                formatTime(
                  e.target.value,
                  99
                )
              )
            }
            style={{
              ...timeInputStyle,
              MozAppearance:
                "textfield",
            }}
          />

          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) =>
              setMinutes(
                formatTime(
                  e.target.value,
                  59
                )
              )
            }
            style={{
              ...timeInputStyle,
              MozAppearance:
                "textfield",
            }}
          />

          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            value={seconds}
            onChange={(e) =>
              setSeconds(
                formatTime(
                  e.target.value,
                  59
                )
              )
            }
            style={{
              ...timeInputStyle,
              MozAppearance:
                "textfield",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3,minmax(0,1fr))",
            gap: 12,
            marginTop: 6,
            color:
              theme.colors
                .textSecondary,
            fontSize:
              UI.FONT_TINY,
            textAlign: "center",
          }}
        >
          <span>Heures</span>

          <span>Minutes</span>

          <span>Secondes</span>
        </div>
      </div>
    </div>
  );
}