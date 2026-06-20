import Input from "../UI/Input";

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

export default function CompetitionFields({
  competitionName,
  setCompetitionName,

  location,
  setLocation,

  position,
  setPosition,

  participants,
  setParticipants,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "22px",
        marginTop: "30px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          margin: 0,
          fontSize: "24px",
        }}
      >
        🏁 Informations compétition
      </h2>

      <Input
        label="Nom de la compétition"
        placeholder="Ex : Semi-marathon de Paris"
        value={competitionName}
        onChange={(e) =>
          setCompetitionName(e.target.value)
        }
      />

      <Input
        label="Lieu"
        placeholder="Ex : Paris"
        value={location}
        onChange={(e) =>
          setLocation(e.target.value)
        }
      />

      <Input
        label="Classement"
        type="number"
        placeholder="25"
        value={position}
        onChange={(e) =>
          setPosition(e.target.value)
        }
      />

      <Input
        label="Nombre de participants"
        type="number"
        placeholder="1200"
        value={participants}
        onChange={(e) =>
          setParticipants(e.target.value)
        }
      />
    </div>
  );
}