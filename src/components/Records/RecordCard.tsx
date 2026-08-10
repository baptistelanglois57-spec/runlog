import type { ReactNode } from "react";

type Detail = {
  icon: string;
  label: string;
  value: string;
};

type RecordCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
  details?: Detail[];
  layout?: "default" | "horizontal";
  locked?: boolean;
};

export default function RecordCard({
  icon,
  title,
  value,
  subtitle,
  color,
  details,
  layout = "default",
  locked = false,
}: RecordCardProps) {
  const isLocked = locked || value === "🔒";

  return (
    <div
      className={`record-card${color ? " record-card--accent" : ""}${isLocked ? " record-card--locked" : ""}${layout === "horizontal" ? " record-card--horizontal" : ""}`}
      style={color ? { borderColor: color } : undefined}
    >
      {/* HEADER */}

      <div className="record-card__header">
        <div className="record-card__icon">
          {icon}
        </div>

        <h3>
          {title}
        </h3>
      </div>

      {/* RECORD */}

      <div className="record-card__value-wrap">
        <div className="record-card__value">
          {value}
        </div>

        {subtitle && (
          <div className="record-card__subtitle">
            {subtitle}
          </div>
        )}
      </div>

      {/* DETAILS */}

      {details && details.length > 0 && (
        <div className="record-card__details">
          {details.map((detail) => (
            <div key={detail.label} className="record-card__detail">
              <div>
                <span>
                  {detail.icon}
                </span>

                {detail.label}
              </div>

              <span>
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
