import { useEffect, useState } from "react";
import { theme } from "../../styles/theme";

type Props = {
  name: string;
  setName: (value: string) => void;

  type: "training" | "race";
  setType: (
    value: "training" | "race"
  ) => void;

  date: string;
  setDate: (value: string) => void;

  distance: string;
  setDistance: (value: string) => void;

  duration: string;
  setDuration: (value: string) => void;

  elevation: string;
  setElevation: (value: string) => void;

  averageHeartRate: string;
  setAverageHeartRate: (
    value: string
  ) => void;
};

export default function RunFields({
  name,
  setName,
  type,
  setType,
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
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  useEffect(() => {
    if (!duration) return;

    const parts = duration.split(":");

    if (parts.length === 3) {
      setHours(parts[0]);
      setMinutes(parts[1]);
      setSeconds(parts[2]);
    }
  }, []);

  useEffect(() => {
    setDuration(
      `${hours.padStart(2, "0")}:${minutes.padStart(
        2,
        "0"
      )}:${seconds.padStart(2, "0")}`
    );
  }, [hours, minutes, seconds]);

  const inputStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
    color: theme.colors.text,
    fontSize: "17px",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontWeight: 700,
    marginBottom: "8px",
    color: theme.colors.text,
  };

  const timeInputStyle = {
    flex: 1,
    padding: "18px",
    borderRadius: "16px",
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
    color: theme.colors.text,
    fontSize: "26px",
    textAlign: "center" as const,
    outline: "none",
  };

  function formatTime(value: string, max: number) {
    let number = value.replace(/\D/g, "");

    if (number === "") return "00";

    let parsed = Math.min(Number(number), max);

    return parsed.toString().padStart(2, "0");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "22px",
      }}
    >
      <div>
  <div style={labelStyle}>
    🏷️ Nom 
  </div>

  <input
    type="text"
    placeholder="Ex : Sortie EF"
    value={name}
    onChange={(e) =>
      setName(e.target.value)
    }
    style={inputStyle}
  />
</div>

<div>
  <div style={labelStyle}>
    🏃 Type de sortie
  </div>

  <select
    value={type}
    onChange={(e) =>
      setType(
        e.target.value as
          | "training"
          | "race"
      )
    }
    style={inputStyle}
  >
    <option value="training">
      Entraînement
    </option>

    <option value="race">
      Compétition
    </option>
  </select>
</div>
      <div>
        <div style={labelStyle}>📅 Date</div>

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          style={inputStyle}
        />
      </div>

      <div>
        <div style={labelStyle}>
          📏 Distance (km)
        </div>

        <input
          type="number"
          step="0.01"
          placeholder="Ex : 12.50"
          value={distance}
          onChange={(e) =>
            setDistance(e.target.value)
          }
          style={inputStyle}
        />
      </div>

      <div>
        <div style={labelStyle}>
          ⏱ Temps
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
          }}
        >
          <input
            type="number"
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
            style={timeInputStyle}
          />

          <input
            type="number"
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
            style={timeInputStyle}
          />

          <input
            type="number"
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
            style={timeInputStyle}
          />
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "10px",
            color: "#9ca3af",
            fontSize: "13px",
          }}
        >
          <div
            style={{
              flex: 1,
              textAlign: "center",
            }}
          >
            Heures
          </div>

          <div
            style={{
              flex: 1,
              textAlign: "center",
            }}
          >
            Minutes
          </div>

          <div
            style={{
              flex: 1,
              textAlign: "center",
            }}
          >
            Secondes
          </div>
        </div>
      </div>

      <div>
        <div style={labelStyle}>
          ⛰ Dénivelé positif (m)
        </div>

        <input
          type="number"
          placeholder="Ex : 250"
          value={elevation}
          onChange={(e) =>
            setElevation(e.target.value)
          }
          style={inputStyle}
        />
      </div>

      <div>
        <div style={labelStyle}>
          ❤️ BPM moyen
        </div>

        <input
          type="number"
          placeholder="Ex : 152"
          value={averageHeartRate}
          onChange={(e) =>
            setAverageHeartRate(
              e.target.value
            )
          }
          style={inputStyle}
        />
      </div>
    </div>
  );
}