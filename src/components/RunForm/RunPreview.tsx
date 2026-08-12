import { theme } from "../../styles/theme";
import { UI } from "../../styles/ui";

type Props = {
  name: string;

  type: "training" | "race" | "gym";

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

  if (!km || totalSeconds <= 0)
    return "--";

  const secondsPerKm =
    totalSeconds / km;

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
}: Props){
  const pace = calculatePace(
    distance,
    duration
  );

  return (
    <div
      style={{
        background: theme.colors.card,

        border: `1px solid ${theme.colors.border}`,

        borderRadius: UI.RADIUS_LARGE,

        padding: 22,

        boxShadow: theme.shadow.card,
      }}
    >
      <h2
        style={{
          margin: "0 0 22px",

          textAlign: "center",

          color: theme.colors.primary,

          fontSize: UI.FONT_H2,

          fontWeight: 800,
        }}
      >
        👀 Aperçu
      </h2>

      <div
        style={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "flex-start",

          marginBottom: 16,

          gap: 16,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,

              color: theme.colors.text,

              fontSize: 30,

              fontWeight: 700,
            }}
          >
            {type === "training"
              ? "🏃"
              : type === "race"
              ? "🏁"
              : "💪"}{" "}
            {name || "Nouvelle sortie"}
          </h3>

          <div
            style={{
              marginTop: 8,

              color:
                theme.colors.textSecondary,

              fontSize: UI.FONT_SMALL,
            }}
          >
            📅 {date || "--"}
          </div>
        </div>

        <div
          style={{
            color: theme.colors.text,

            fontWeight: 800,

            fontSize: 32,

            whiteSpace: "nowrap",
          }}
        >
          {distance
            ? `${distance} km`
            : "-- km"}
        </div>
      </div>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(2,1fr)",

          gap: 14,
        }}
      >
                <Info
          icon="⏱"
          title="Temps"
          value={duration || "--:--:--"}
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
              : type === "race"
              ? "Compétition"
              : "Musculation"
          }
        />

        {type === "race" && (
          <>
            <Info
              icon="🏁"
              title="Compétition"
              value={
                competitionName ||
                "À compléter"
              }
            />

            <Info
              icon="📍"
              title="Lieu"
              value={
                location ||
                "À compléter"
              }
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
        background: "rgba(231,217,196,.02)",

        border: `1px solid ${theme.colors.border}`,

        borderRadius: UI.RADIUS,

        padding: 16,

        display: "flex",

        flexDirection: "column",

        justifyContent: "center",

        gap: 6,

        minHeight: 88,
      }}
    >
      <span
        style={{
          color:
            theme.colors.textSecondary,

          fontSize: UI.FONT_TINY,

          fontWeight: 600,
        }}
      >
        {icon} {title}
      </span>

      <strong
        style={{
          color: theme.colors.text,

          fontSize: UI.FONT_BODY,

          lineHeight: 1.25,

          wordBreak: "break-word",
        }}
      >
        {value}
      </strong>
    </div>
  );
}
