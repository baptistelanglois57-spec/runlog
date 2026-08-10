import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import NameField from "../components/RunForm/NameField";
import RunFormHeader from "../components/RunForm/RunFormHeader";
import RunFields, {
  RunSessionFields,
} from "../components/RunForm/RunFields";
import CompetitionFields from "../components/RunForm/CompetitionFields";
import SaveButton from "../components/RunForm/SaveButton";

import GymForm from "./GymForm";

import toast from "react-hot-toast";

import {
  saveRun,
  updateRun,
  getRunById,
  getRuns,
} from "../services/runService";

import { syncRunRecords } from "../services/recordEngine";
import "./RunForm.css";

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

      setSurface(run.surface);

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

    // L'état précédent est nécessaire pour ne notifier que les records créés
    // par cette sauvegarde, jamais les records historiques recalculés.
    const previousRuns = await getRuns();

    if (isEditing) {
      await updateRun(run);

      await syncRunRecords({
        previousRuns,
        changedRunId: run.id,
      });

      toast.success("Sortie mise à jour !");
    } else {
      await saveRun(run);

      await syncRunRecords({
        previousRuns,
        changedRunId: run.id,
      });

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
      <Section marginTop={0}>
        <div className="run-form-page">
          <RunFormHeader
            isEditing={isEditing}
            onBack={() => navigate(-1)}
          >
            <SaveButton
              isEditing={isEditing}
              onClick={handleSave}
            />
          </RunFormHeader>

          <div className="run-form-page__sections">
            <section className="run-form-card">
              <div className="run-form-card__heading">
                <h2>Séance</h2>
              </div>

              <NameField name={name} setName={setName} />

              <RunSessionFields
                type={type}
                setType={setType}
                surface={surface}
                setSurface={setSurface}
                date={date}
                setDate={setDate}
              />
            </section>

            <RunFields
              distance={distance}
              setDistance={setDistance}
              duration={duration}
              setDuration={setDuration}
              elevation={elevation}
              setElevation={setElevation}
              averageHeartRate={averageHeartRate}
              setAverageHeartRate={setAverageHeartRate}
            />

            {type === "race" && (
              <CompetitionFields
                competitionName={competitionName}
                setCompetitionName={setCompetitionName}
                location={location}
                setLocation={setLocation}
                position={position}
                setPosition={setPosition}
                participants={participants}
                setParticipants={setParticipants}
              />
            )}
          </div>
        </div>
      </Section>
    </AppContainer>
  );
}
