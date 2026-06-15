import { useState } from "react";
import { getRuns, deleteRun } from "../services/storage";
import { useNavigate } from "react-router-dom";
export default function History() {
  const [runs, setRuns] = useState(getRuns());
  const navigate = useNavigate();

  function handleDelete(id: number) {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette sortie ?"
    );

    if (!confirmDelete) return;

    deleteRun(id);

    setRuns(getRuns());
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#081120",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        📖 Historique
      </h1>

      {runs.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          Aucune sortie enregistrée.
        </p>
      ) : (
        runs.map((run) => (
          <div
            key={run.id}
            style={{
              background: "#13213a",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <h2>{run.name}</h2>

            <p>📅 {run.date}</p>

            <p>📏 {run.distance} km</p>

            <p>⏱ {run.duration}</p>

            <p>⛰ {run.elevation} m</p>
<button
  onClick={() => navigate(`/edit/${run.id}`)}
  style={{
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "10px",
  }}
>
  ✏️ Modifier
</button>
            <button
              onClick={() => handleDelete(run.id)}
              style={{
                marginTop: "15px",
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🗑️ Supprimer
            </button>
          </div>
        ))
      )}
    </main>
  );
}
