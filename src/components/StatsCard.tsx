import type { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
}: StatsCardProps) {
  const parts = value.split(" ");

  const number = parts[0];

  const unit = parts.slice(1).join(" ");

  return (
    <div
      className={`home-stat-card${unit ? "" : " home-stat-card--unitless"}`}
    >
      {/* Header */}

      <div
        className="home-stat-card__header"
      >
        <div
          className="home-stat-card__icon"
        >
          <Icon
            size={18}
            color="#D4AF37"
            strokeWidth={2.3}
          />
        </div>

        <span
          className="home-stat-card__title"
        >
          {title}
        </span>
      </div>

      {/* Valeur */}

      <div
        className="home-stat-card__value"
      >
        <div
          className="home-stat-card__number"
        >
          {number}
        </div>

        {unit && (
          <div
            className="home-stat-card__unit"
          >
            {unit}
          </div>
        )}

        {!unit && <div className="home-stat-card__unit-spacer" aria-hidden="true" />}
      </div>
    </div>
  );
}
