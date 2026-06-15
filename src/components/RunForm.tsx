import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  saveRun,
  updateRun,
  getRunById,
} from "../services/storage";

export default function RunForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [elevation, setElevation] = useState("");

  useEffect(() => {
    if (!isEditing || !id) return;

    const run = getRunById(Number(id));

    if (!run) return;

    setName(run.name);
    setDate(run.date);
    setDistance(run.distance.toString());
    setDuration(run.duration);
    setElevation(run.elevation.toString());
  }, [id, isEditing]);

  function handleSave() {
    if (!name || !date || !distance || !duration) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    const run = {
      id: isEditing ? Number(id) : Date.now(),
      name,
      date,
      distance: Number(distance),
      duration,
      elevation: Number(elevation),
    };

    if (isEditing) {
      updateRun(run);
      alert("✅ Sortie mise à jour !");
    } else {
      saveRun(run);
      alert("✅ Sortie enregistrée !");
    }

    navigate("/history");
  }

  return (    <main
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
          maxWidth: "550px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "35px",
            fontSize: "48px",
          }}
        >
          {isEditing
            ? "✏️ Modifier la sortie"
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
            onChange={(e) => setName(e.target.value)}
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
            onChange={(e) => setDistance(e.target.value)}
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
            onChange={(e) => setDuration(e.target.value)}
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
            onChange={(e) => setElevation(e.target.value)}
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #24324d",
              background: "#13213a",
              color: "white",
              fontSize: "16px",
            }}
          />

          <button
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

          <div
            style={{
              marginTop: "20px",
              background: "#13213a",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h3>🔍 Aperçu</h3>

            <p>Nom : {name || "-"}</p>
            <p>Date : {date || "-"}</p>
            <p>Distance : {distance || "-"} km</p>
            <p>Temps : {duration || "-"}</p>
            <p>Dénivelé : {elevation || "-"} m</p>
          </div>
        </div>
      </div>
    </main>
  );
}