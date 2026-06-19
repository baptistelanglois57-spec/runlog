import { theme } from "../../styles/theme";

type Props = {
  competitionName: string;
  setCompetitionName: (value: string) => void;

  location: string;
  setLocation: (value: string) => void;

  position: string;
  setPosition: (value: string) => void;

  participants: string;
  setParticipants: (value: string) => void;
};

export default function RaceFields({
  competitionName,
  setCompetitionName,
  location,
  setLocation,
  position,
  setPosition,
  participants,
  setParticipants,
}: Props) {
  const inputStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.background,
    color: theme.colors.text,
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "20px",
        padding: "25px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        boxShadow: theme.shadow.card,
      }}
    >
      <h2
        style={{
          margin: 0,
          color: theme.colors.primary,
          textAlign: "center",
          fontSize: "24px",
        }}
      >
        🏁 Informations compétition
      </h2>

      <input
        type="text"
        placeholder="🏆 Nom de la compétition"
        value={competitionName}
        onChange={(e) =>
          setCompetitionName(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type="text"
        placeholder="📍 Lieu"
        value={location}
        onChange={(e) =>
          setLocation(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="🥇 Classement"
        value={position}
        onChange={(e) =>
          setPosition(e.target.value)
        }
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="👥 Nombre de participants"
        value={participants}
        onChange={(e) =>
          setParticipants(e.target.value)
        }
        style={inputStyle}
      />
    </div>
  );
}