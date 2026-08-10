import { Flag, MapPin, Trophy, UsersRound } from "lucide-react";

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
    <section className="run-form-card run-form-card--competition">
      <div className="run-form-fields__section-title">
        <span aria-hidden="true"><Flag size={16} /></span>
        <h2>Compétition</h2>
      </div>

      <div className="run-form-competition__fields">
        <label className="run-form-field">
          <span className="run-form-field__label">
            <Trophy size={15} aria-hidden="true" />
            Nom
          </span>
          <input
            type="text"
            value={competitionName}
            onChange={(event) => setCompetitionName(event.target.value)}
          />
        </label>

        <label className="run-form-field">
          <span className="run-form-field__label">
            <MapPin size={15} aria-hidden="true" />
            Lieu
          </span>
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </label>

        <div className="run-form-competition__metrics">
          <label className="run-form-field">
            <span className="run-form-field__label">
              <Trophy size={15} aria-hidden="true" />
              Classement
            </span>
            <input
              type="number"
              inputMode="numeric"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
          </label>

          <label className="run-form-field">
            <span className="run-form-field__label">
              <UsersRound size={15} aria-hidden="true" />
              Participants
            </span>
            <input
              type="number"
              inputMode="numeric"
              value={participants}
              onChange={(event) => setParticipants(event.target.value)}
            />
          </label>
        </div>
      </div>
    </section>
  );
}
