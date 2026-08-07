type Props = {
  bestPace: string;
  hr130: string;
  hr140: string;
  hr150: string;
  hr160: string;
};

export default function PaceRecordCard({
  bestPace,
  hr130,
  hr140,
  hr150,
  hr160,
}: Props) {
  return (
    <div className="pace-record-card">
      {/* RECORD */}

      <div className="pace-record-card__highlight">
        <div className="pace-record-card__title">
          Meilleure allure
        </div>

        <div className="pace-record-card__value">
          {bestPace}
        </div>
      </div>

      <Row
        icon="❤️"
        label="≤130 bpm"
        value={hr130}
      />

      <Row
        icon="💚"
        label="131-140 bpm"
        value={hr140}
      />

      <Row
        icon="💛"
        label="141-150 bpm"
        value={hr150}
      />

      <Row
        icon="🧡"
        label="151-160 bpm"
        value={hr160}
        last
      />
    </div>
  );
}

type RowProps = {
  icon: string;
  label: string;
  value: string;
  last?: boolean;
};

function Row({
  icon,
  label,
  value,
  last,
}: RowProps) {
  return (
    <div className={`pace-record-card__row${last ? " pace-record-card__row--last" : ""}`}>
      <div>
        <span>
          {icon}
        </span>

        <span>
          {label}
        </span>
      </div>

      <span className={value === "🔒" ? "pace-record-card__locked" : ""}>
        {value}
      </span>
    </div>
  );
}
