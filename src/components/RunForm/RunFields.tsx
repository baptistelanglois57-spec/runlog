import {
  Activity,
  CalendarDays,
  Clock3,
  HeartPulse,
  Map,
  Mountain,
  Route,
} from "lucide-react";
import type { ReactNode } from "react";

type SessionProps = {
  type: "training" | "race" | "gym";
  setType: (value: "training" | "race" | "gym") => void;
  surface: "road" | "trail";
  setSurface: (value: "road" | "trail") => void;
  date: string;
  setDate: (value: string) => void;
};

type Props = {
  distance: string;
  setDistance: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
  elevation: string;
  setElevation: (value: string) => void;
  averageHeartRate: string;
  setAverageHeartRate: (value: string) => void;
};

function getTimeParts(duration: string) {
  const parts = duration.split(":");

  return parts.length === 3 ? parts : ["", "", ""];
}

function limitDigits(value: string, max: number) {
  const numericValue = value.replace(/\D/g, "");

  if (numericValue === "") return "";

  return Math.min(Number(numericValue), max).toString();
}

type FieldLabelProps = {
  icon: ReactNode;
  children: ReactNode;
};

function FieldLabel({ icon, children }: FieldLabelProps) {
  return (
    <span className="run-form-field__label">
      {icon}
      {children}
    </span>
  );
}

export function RunSessionFields({
  type,
  setType,
  surface,
  setSurface,
  date,
  setDate,
}: SessionProps) {
  return (
    <div className="run-form-fields__session-grid">
      <label className="run-form-field">
        <FieldLabel icon={<Activity size={15} aria-hidden="true" />}>
          Activité
        </FieldLabel>
        <select
          value={type}
          onChange={(event) =>
            setType(event.target.value as "training" | "race" | "gym")
          }
        >
          <option value="training">Course</option>
          <option value="race">Compétition</option>
          <option value="gym">Musculation</option>
        </select>
      </label>

      <label className="run-form-field">
        <FieldLabel icon={<Map size={15} aria-hidden="true" />}>
          Terrain
        </FieldLabel>
        <select
          value={surface}
          onChange={(event) => setSurface(event.target.value as "road" | "trail")}
        >
          <option value="road">Route</option>
          <option value="trail">Trail</option>
        </select>
      </label>

      <label className="run-form-field run-form-fields__date">
        <FieldLabel icon={<CalendarDays size={15} aria-hidden="true" />}>
          Date
        </FieldLabel>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>
    </div>
  );
}

export default function RunFields({
  distance,
  setDistance,
  duration,
  setDuration,
  elevation,
  setElevation,
  averageHeartRate,
  setAverageHeartRate,
}: Props) {
  const [hours, minutes, seconds] = getTimeParts(duration);

  function setTimePart(index: number, value: string, max: number) {
    const parts = getTimeParts(duration);
    parts[index] = limitDigits(value, max);

    setDuration(
      parts
        .map((part) => (part || "0").padStart(2, "0"))
        .join(":")
    );
  }

  return (
    <section className="run-form-card run-form-card--performance">
        <div className="run-form-fields__section-title">
          <span aria-hidden="true"><Route size={16} /></span>
          <h2>Performance</h2>
        </div>

        <div className="run-form-fields__metrics-grid">
          <label className="run-form-field">
            <FieldLabel icon={<Route size={15} aria-hidden="true" />}>
              Distance
            </FieldLabel>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
            />
          </label>

          <label className="run-form-field">
            <FieldLabel icon={<HeartPulse size={15} aria-hidden="true" />}>
              BPM
            </FieldLabel>
            <input
              type="number"
              inputMode="numeric"
              value={averageHeartRate}
              onChange={(event) => setAverageHeartRate(event.target.value)}
            />
          </label>

          <label className="run-form-field">
            <FieldLabel icon={<Mountain size={15} aria-hidden="true" />}>
              D+
            </FieldLabel>
            <input
              type="number"
              inputMode="numeric"
              value={elevation}
              onChange={(event) => setElevation(event.target.value)}
            />
          </label>
        </div>

        <div className="run-form-fields__time-heading">
          <Clock3 size={16} aria-hidden="true" />
          <span>Temps</span>
        </div>

        <div className="run-form-fields__time-grid">
          <label className="run-form-time-field">
            <span>Heures</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={99}
              value={hours}
              onChange={(event) => setTimePart(0, event.target.value, 99)}
            />
          </label>

          <label className="run-form-time-field">
            <span>Minutes</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={59}
              value={minutes}
              onChange={(event) => setTimePart(1, event.target.value, 59)}
            />
          </label>

          <label className="run-form-time-field">
            <span>Secondes</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={59}
              value={seconds}
              onChange={(event) => setTimePart(2, event.target.value, 59)}
            />
          </label>
        </div>
    </section>
  );
}
