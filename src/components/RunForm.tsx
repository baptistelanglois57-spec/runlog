import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
        background: "#081120",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "35px",
            fontSize: "42px",
          }}
        >
          {isEditing
            ? "✏️ Modifier une sortie"
            : "➕ Ajouter une sortie"}
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Nom de la sortie"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={{
              padding: "16px",
              borderRadius: "12px",
              border:
                "1px solid #24324d",
              background: "#13213a",
              color: "white",
              fontSize: "16px",
            }}
          />
                    <div>
            <p
              style={{
                marginBottom: "10px",
                fontWeight: "bold",
                fontSize: "17px",
              }}
            >
              🏷️ Type de sortie
            </p>

            <div
              style={{
                display: "flex",
                gap: "15px",
              }}
            >
              <button
                type="button"
                onClick={() => setType("training")}
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "17px",
                  transition: "0.2s",
                  background:
                    type === "training"
                      ? "#22c55e"
                      : "#24324d",
                  color: "white",
                }}
              >
                🏃 Entraînement
              </button>

              <button
                type="button"
                onClick={() => setType("race")}
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "17px",
                  transition: "0.2s",
                  background:
                    type === "race"
                      ? "#3b82f6"
                      : "#24324d",
                  color: "white",
                }}
              >
                🏅 Compétition
              </button>
            </div>
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #24324d",
              background: "#13213a",
              color: "white",
              fontSize: "16px",
            }}
          />

          <input
            type="number"
            placeholder="Distance (km)"
            value={distance}
            onChange={(e) =>
              setDistance(e.target.value)
            }
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #24324d",
              background: "#13213a",
              color: "white",
              fontSize: "16px",
            }}
          />

          <input
            type="text"
            placeholder="Temps (hh:mm)"
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #24324d",
              background: "#13213a",
              color: "white",
              fontSize: "16px",
            }}
          />

          <input
            type="number"
            placeholder="Dénivelé positif (m)"
            value={elevation}
            onChange={(e) =>
              setElevation(e.target.value)
            }
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #24324d",
              background: "#13213a",
              color: "white",
              fontSize: "16px",
            }}
          />

          {type === "race" && (
            <div
              style={{
                background: "#13213a",
                padding: "20px",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  textAlign: "center",
                }}
              >
                🏅 Informations compétition
              </h3>

              <input
                type="text"
                placeholder="Nom de la compétition"
                value={competitionName}
                onChange={(e) =>
                  setCompetitionName(
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Lieu"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #24324d",
                  background: "#081120",
                  color: "white",
                  fontSize: "16px",
                }}
              />

              <input
                type="number"
                placeholder="Classement"
                value={position}
                onChange={(e) =>
                  setPosition(e.target.value)
                }
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #24324d",
                  background: "#081120",
                  color: "white",
                  fontSize: "16px",
                }}
              />

              <input
                type="number"
                placeholder="Nombre de participants"
                value={participants}
                onChange={(e) =>
                  setParticipants(
                    e.target.value
                  )
                }
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #24324d",
                  background: "#081120",
                  color: "white",
                  fontSize: "16px",
                }}
              />
            </div>
          )}
                    <button
            type="button"
            onClick={handleSave}
            style={{
              background: "#22c55e",
              color: "white",
              border: "none",
              padding: "18px",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {isEditing
              ? "💾 Mettre à jour la sortie"
              : "💾 Enregistrer la sortie"}
          </button>
        </div>
      </div>
    </main>
  );
}