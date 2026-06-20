import { theme } from "../../styles/theme";

type Props = {
  name: string;

  type: "training" | "race";

  date: string;

  distance: string;

  duration: string;

  elevation: string;

  competitionName: string;

  location: string;

  position: string;

  participants: string;
};

function calculatePace(
  distance: string,
  duration: string
) {
  if (!distance || !duration) return "--";

  const parts = duration.split(":");

  if (parts.length !== 3) return "--";

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  const seconds = Number(parts[2]);

  const totalSeconds =
    hours * 3600 +
    minutes * 60 +
    seconds;

  const km = Number(distance);

  if (!km || totalSeconds <= 0) return "--";

  const secondsPerKm = totalSeconds / km;

  const min = Math.floor(
    secondsPerKm / 60
  );

  const sec = Math.round(
    secondsPerKm % 60
  );

  return `${min}'${sec
    .toString()
    .padStart(2, "0")}" /km`;
}

export default function RunPreview({
  name,
  type,
  date,
  distance,
  duration,
  elevation,
  competitionName,
  location,
  position,
  participants,
}: Props) {

  const pace = calculatePace(
    distance,
    duration
  );
  {type === "race" && (
  <>
    <Info
      icon="🏁"
      title="Compétition"
      value={competitionName || "À compléter"}
    />

    <Info
      icon="📍"
      title="Lieu"
      value={location || "--"}
    />

    <Info
      icon="🏆"
      title="Classement"
      value={
        position && participants
          ? `${position} / ${participants}`
          : "--"
      }
    />
  </>
)}

  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "22px",
        padding: "28px",
        boxShadow: theme.shadow.card,
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "25px",
          color: theme.colors.primary,
          textAlign: "center",
          fontSize: "28px",
        }}
      >
        👀 Aperçu de la sortie
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "18px",
        }}
      >
        <Info
          icon="🏃"
          title="Nom"
          value={
            name || "Nouvelle sortie"
          }
        />

        <Info
          icon="📅"
          title="Date"
          value={date || "--"}
        />

        <Info
          icon="📏"
          title="Distance"
          value={
            distance
              ? `${distance} km`
              : "-- km"
          }
        />

        <Info
          icon="⏱"
          title="Temps"
          value={
            duration || "--:--:--"
          }
        />

        <Info
          icon="⚡"
          title="Allure"
          value={pace}
        />

        <Info
          icon="⛰"
          title="D+"
          value={
            elevation
              ? `${elevation} m`
              : "-- m"
          }
        />

        <Info
          icon="🏷"
          title="Type"
          value={
            type === "training"
              ? "Entraînement"
              : "Compétition"
          }
        />

        {type === "race" && (
          <Info
            icon="🏁"
            title="Compétition"
            value={
              competitionName ||
              "À compléter"
            }
          />
        )}
      </div>
    </div>
  );
}

type InfoProps = {
  icon: string;
  title: string;
  value: string;
};

function Info({
  icon,
  title,
  value,
}: InfoProps) {
  return (
    <div
      style={{
        background:
          theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "16px",
        padding: "18px",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color:
            theme.colors.textSecondary,
          marginBottom: "8px",
          fontWeight: 600,
        }}
      >
        {icon} {title}
      </div>

      <div
        style={{
          fontSize: "18px",
          fontWeight: 700,
          color: theme.colors.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}