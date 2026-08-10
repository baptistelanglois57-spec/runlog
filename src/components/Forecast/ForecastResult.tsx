import {
  Activity,
  CheckCircle2,
  Clock3,
  Gauge,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";

import type { ForecastResult as ForecastResultType } from "../../types/Forecast";
import "./ForecastResult.css";

type Props = {
  result: ForecastResultType;
};

function formatTime(minutes: number | null) {
  if (minutes === null || !Number.isFinite(minutes) || minutes <= 0) {
    return "--";
  }

  const totalSeconds = Math.round(minutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return hours > 0
    ? [hours, mins, seconds]
        .map((part) => part.toString().padStart(2, "0"))
        .join(":")
    : [mins, seconds]
        .map((part) => part.toString().padStart(2, "0"))
        .join(":");
}

function formatPace(pace: number | null) {
  if (pace === null || !Number.isFinite(pace) || pace <= 0) return "--";

  const totalSeconds = Math.round(pace * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}'${seconds.toString().padStart(2, "0")}"/km`;
}

export default function ForecastResult({ result }: Props) {
  if (result.status !== "ok") {
    return (
      <section className="forecast-result forecast-result--empty">
        <ShieldCheck size={24} aria-hidden="true" />
        <h2>Prévision indisponible</h2>
        <p>{result.reasons[0]}</p>
      </section>
    );
  }

  const modelLabel =
    result.modelLevel === "rich"
      ? "Modèle personnalisé complet"
      : result.modelLevel === "medium"
        ? "Modèle personnalisé simplifié"
        : "Estimation prudente";

  return (
    <section className="forecast-result">
      <header className="forecast-result__hero">
        <div>
          <span>Temps estimé</span>
          <strong>{formatTime(result.estimatedTime)}</strong>
        </div>
        <Clock3 size={24} aria-hidden="true" />
      </header>

      <div className="forecast-result__range">
        <span>Plage plausible</span>
        <strong>
          {formatTime(result.plausibleTimeMin)} – {formatTime(result.plausibleTimeMax)}
        </strong>
      </div>

      <div className="forecast-result__metrics">
        <Metric
          icon={<Gauge size={17} />}
          label="Allure estimée"
          value={formatPace(result.estimatedPace)}
        />
        <Metric
          icon={<ShieldCheck size={17} />}
          label="Confiance"
          value={`${result.confidence} %`}
        />
        {result.estimatedHeartRate !== null && (
          <Metric
            icon={<HeartPulse size={17} />}
            label="FC estimée"
            value={`${result.estimatedHeartRate} bpm`}
          />
        )}
        <Metric
          icon={<Activity size={17} />}
          label="Données utilisées"
          value={`${result.usedRuns} sorties`}
        />
      </div>

      <div className="forecast-result__model">
        <div>
          <span>Niveau du modèle</span>
          <strong>{modelLabel}</strong>
        </div>
        {result.backtest.sampleSize > 0 && (
          <div>
            <span>Backtesting</span>
            <strong>
              {result.backtest.sampleSize} tests · erreur moyenne{" "}
              {result.backtest.meanAbsolutePercentageError?.toFixed(1)} %
            </strong>
          </div>
        )}
      </div>

      <div className="forecast-result__reasons">
        <h3>Pourquoi cette estimation</h3>
        {result.reasons.map((reason) => (
          <div key={reason}>
            <CheckCircle2 size={15} aria-hidden="true" />
            <span>{reason}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

type MetricProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="forecast-result__metric">
      <span aria-hidden="true">{icon}</span>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}
