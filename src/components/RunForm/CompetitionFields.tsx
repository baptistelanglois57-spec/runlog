import Input from "../UI/Input";

import { UI } from "../../styles/ui";
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
        gap: 18,
        marginTop: 10,
      }}
    >
      <h2
        style={{
          margin: 0,

          textAlign: "center",

          color: theme.colors.primary,

          fontSize: UI.FONT_H3,

          fontWeight: 800,
        }}
      >
        🏁 Compétition
      </h2>

      <Input
        label="Nom"
        placeholder=""
        value={competitionName}
        onChange={(e) =>
          setCompetitionName(e.target.value)
        }
      />

      <Input
        label="Lieu"
        placeholder=""
        value={location}
        onChange={(e) =>
          setLocation(e.target.value)
        }
      />

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(2,1fr)",

          gap: 14,
        }}
      >
        <Input
          label="Classement"
          type="number"
          inputMode="numeric"
          placeholder=""
          value={position}
          onChange={(e) =>
            setPosition(e.target.value)
          }
        />

        <Input
          label="Participants"
          type="number"
          inputMode="numeric"
          placeholder=""
          value={participants}
          onChange={(e) =>
            setParticipants(e.target.value)
          }
        />
      </div>
    </div>
  );
}