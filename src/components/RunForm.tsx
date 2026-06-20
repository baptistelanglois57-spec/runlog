import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import PageCard from "../components/Layout/PageCard";

import RunFormHeader from "../components/RunForm/RunFormHeader";
import RunFields from "../components/RunForm/RunFields";
import CompetitionFields from "../components/RunForm/CompetitionFields";
import RunPreview from "../components/RunForm/RunPreview";
import SaveButton from "../components/RunForm/SaveButton";

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
        "Merci de remplir tous les champs obligatoires."
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
        type === "race" &&
        position !== ""
          ? Number(position)
          : undefined,

      participants:
        type === "race" &&
        participants !== ""
          ? Number(participants)
          : undefined,
    };

    if (isEditing) {
      await updateRun(run);

      alert(
        "✅ Sortie mise à jour !"
      );
    } else {
      await saveRun(run);

      alert(
        "✅ Sortie enregistrée !"
      );
    }

    navigate("/history");
  }
    return (
    <AppContainer>
      <Section>
        <PageCard>

          <RunFormHeader
            isEditing={isEditing}
          />

          <RunFields
            name={name}
            setName={setName}
            type={type}
            setType={setType}
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
            <CompetitionFields
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
            location={location}
            position={position}
            participants={participants}
          />

          <SaveButton
            isEditing={isEditing}
            onClick={handleSave}
          />

        </PageCard>
      </Section>
    </AppContainer>
  );
}