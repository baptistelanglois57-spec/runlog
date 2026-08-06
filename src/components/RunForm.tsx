import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import PageCard from "../components/Layout/PageCard";
import { syncLongestRunNotification } from "../services/recordNotificationService";
import NameField from "../components/RunForm/NameField";
import RunFormHeader from "../components/RunForm/RunFormHeader";
import RunFields from "../components/RunForm/RunFields";
import CompetitionFields from "../components/RunForm/CompetitionFields";
import SaveButton from "../components/RunForm/SaveButton";

import GymForm from "./GymForm";

import toast from "react-hot-toast";

import {
  saveRun,
  updateRun,
  getRunById,
} from "../services/runService";

import { syncRunRecords } from "../services/recordEngine";

export default function RunForm() {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEditing = Boolean(id);

  const [name, setName] = useState("");

  const [type, setType] = useState<
    "training" | "race" | "gym"
  >("training");

  const [surface, setSurface] =
  useState<"road" | "trail">(
    "road"
  );

  const [date, setDate] = useState("");

  const [distance, setDistance] =
    useState("");

  const [duration, setDuration] =
    useState("");

  const [elevation, setElevation] =
    useState("");

  const [
    averageHeartRate,
    setAverageHeartRate,
  ] = useState("");

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

      setType(
        run.type as
          | "training"
          | "race"
          | "gym"
      );

      setDate(run.date);

      setDistance(
        run.distance.toString()
      );

      setDuration(run.duration);

      setElevation(
        run.elevation.toString()
      );

      setAverageHeartRate(
        run.averageHeartRate?.toString() ||
          ""
      );

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
      toast.error(
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

      surface,

      date,

      distance: Number(distance),

      duration,

      elevation: Number(elevation),

      averageHeartRate:
        averageHeartRate !== ""
          ? Number(averageHeartRate)
          : undefined,

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

      await syncRunRecords();

      await syncLongestRunNotification();

      toast.success("Sortie mise à jour !");
    } else {
      await saveRun(run);

      await syncRunRecords();

      await syncLongestRunNotification();

      toast.success("Sortie enregistrée !");
    }

    navigate("/history");
  }

if (type === "gym") {
  return (
    <AppContainer>
      <Section>
        <GymForm />
      </Section>
    </AppContainer>
  );
}
    return (
    <AppContainer>
      <Section>
        <PageCard>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
           <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 16,
    alignItems: "end",
    marginBottom: 20,
  }}
>
<div>
  <RunFormHeader
    isEditing={isEditing}
  />

  <NameField
    name={name}
    setName={setName}
  />
</div>

  <div
    style={{
      width: 175,
    }}
  >
    <SaveButton
      isEditing={isEditing}
      onClick={handleSave}
    />
  </div>
</div>

<RunFields
  type={type}
  setType={setType}

  surface={surface}
  setSurface={setSurface}

  date={date}
  setDate={setDate}

  distance={distance}
  setDistance={setDistance}

  duration={duration}
  setDuration={setDuration}

  elevation={elevation}
  setElevation={setElevation}

  averageHeartRate={averageHeartRate}
  setAverageHeartRate={
    setAverageHeartRate
  }
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
          </div>
        </PageCard>
      </Section>
    </AppContainer>
  );
}