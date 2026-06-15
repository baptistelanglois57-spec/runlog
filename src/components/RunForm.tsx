import { useState } from "react";
import { saveRun } from "../services/storage";

export default function RunForm() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [elevation, setElevation] = useState("");

  function handleSave() {
    if (!name || !date || !distance || !duration) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    saveRun({
      id: Date.now(),
      name,
      date,
      distance: Number(distance),
      duration,
      elevation: Number(elevation),
    });

    alert("✅ Sortie enregistrée !");
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
          ➕ Ajouter une sortie
        </h1>

        <p style={{ textAlign: "center", color: "#94a3b8" }}>
          Le formulaire revient dans l'étape suivante.
        </p>
      </div>
    </main>
  );
}