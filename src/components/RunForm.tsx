import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { theme } from "../styles/theme";
import RunFormHeader from "./RunForm/RunFormHeader";
import RunTypeSelector from "./RunForm/RunTypeSelector";
import NameField from "./RunForm/NameField";
import RunFields from "./RunForm/RunFields";
import RaceFields from "./RunForm/RaceFields";
import RunPreview from "./RunForm/RunPreview";
import SaveButton from "./RunForm/SaveButton";


import {
  saveRun,
  updateRun,
  getRunById,
} from "../services/runService";

import { formatDate } from "../utils/date";

export default function RunForm() {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEditing = Boolean(id);

  const [name, setName] = useState("");

  const [type, setType] = useState<
    "training" | "race"
  >("training");

  const [date, setDate] = useState("");

  const [distance, setDistance] =
    useState("");

  const [duration, setDuration] =
    useState("");

  const [elevation, setElevation] =
    useState("");

  const [
    competitionName,
    setCompetitionName,
  ] = useState("");

  const [location, setLocation] =
    useState("");

  const [position, setPosition] =
    useState("");

  const [participants, setParticipants] =
    useState("");

  useEffect(() => {
    async function loadRun() {
      if (!isEditing || !id) return;

      const run = await getRunById(id);

      if (!run) return;

      setName(run.name);

      setType(run.type);

      setDate(formatDate(run.date));

      setDistance(run.distance.toString());

      setDuration(run.duration);

      setElevation(run.elevation.toString());

      setCompetitionName(
        run.competitionName || ""
      );

      setLocation(run.location || "");

      setPosition(
        run.position?.toString() || ""
      );

      setParticipants(
        run.participants?.toString() || ""
      );
    }

    loadRun();
  }, [id, isEditing]);

  async function handleSave() {
    if (
      !name ||
      !date ||
      !distance ||
      !duration
    ) {
      alert(
        "Merci de remplir tous les champs."
      );
      return;
    }

    const run = {
      id: isEditing
        ? id!
        : crypto.randomUUID(),

      name,

      type,

      date,

      distance: Number(distance),

      duration,

      elevation: Number(elevation),

      competitionName:
        type === "race"
          ? competitionName
          : undefined,

      location:
        type === "race"
          ? location
          : undefined,

      position:
        type === "race"
          ? Number(position)
          : undefined,

      participants:
        type === "race"
          ? Number(participants)
          : undefined,
    };

    if (isEditing) {
      await updateRun(run);

      alert("✅ Sortie mise à jour !");
    } else {
      await saveRun(run);

      alert("✅ Sortie enregistrée !");
    }

    navigate("/history");
  }

  return (
  <main
    style={{
      minHeight: "100vh",
      background: theme.colors.background,
      padding: "40px 20px",
    }}
  >
    <div
      style={{
        maxWidth: "850px",
        margin: "0 auto",
      }}
    >
      <RunFormHeader isEditing={isEditing} />

      <div
        style={{
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "22px",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          boxShadow: theme.shadow.card,
        }}
      >
        <NameField
          name={name}
          setName={setName}
        />

        <RunTypeSelector
          type={type}
          onChange={setType}
        />

        <RunFields
          date={date}
          setDate={setDate}
          distance={distance}
          setDistance={setDistance}
          duration={duration}
          setDuration={setDuration}
          elevation={elevation}
          setElevation={setElevation}
        />

        {type === "race" && (
          <RaceFields
            competitionName={competitionName}
            setCompetitionName={
              setCompetitionName
            }
            location={location}
            setLocation={setLocation}
            position={position}
            setPosition={setPosition}
            participants={participants}
            setParticipants={
              setParticipants
            }
          />
        )}

        <RunPreview
          name={name}
          type={type}
          date={date}
          distance={distance}
          duration={duration}
          elevation={elevation}
          competitionName={
            competitionName
          }
        />

        <SaveButton
          isEditing={isEditing}
          onClick={handleSave}
        />
      </div>
    </div>
  </main>
)}