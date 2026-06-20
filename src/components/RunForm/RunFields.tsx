import Input from "../UI/Input";
import RunTypeSelector from "./RunTypeSelector";

type Props = {
  name: string;
  setName: (value: string) => void;

  type: "training" | "race";
  setType: (value: "training" | "race") => void;

  date: string;
  setDate: (value: string) => void;

  distance: string;
  setDistance: (value: string) => void;

  duration: string;
  setDuration: (value: string) => void;

  elevation: string;
  setElevation: (value: string) => void;
};

export default function RunFields({
  name,
  setName,

  type,
  setType,

  date,
  setDate,

  distance,
  setDistance,

  duration,
  setDuration,

  elevation,
  setElevation,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "22px",
      }}
    >
      <Input
        label="Nom de la sortie"
        placeholder="Ex : Sortie longue"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <RunTypeSelector
        type={type}
        onChange={setType}
      />

      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <Input
        label="Distance (km)"
        type="number"
        placeholder="10"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
      />

      <Input
        label="Temps (hh:mm:ss)"
        placeholder="01:15:32"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <Input
        label="Dénivelé positif (m)"
        type="number"
        placeholder="250"
        value={elevation}
        onChange={(e) => setElevation(e.target.value)}
      />
    </div>
  );
}