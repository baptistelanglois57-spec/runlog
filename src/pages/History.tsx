import { useState } from "react";
import { getRuns, deleteRun } from "../services/storage";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/date";
import { getAveragePace } from "../utils/stats";

export default function History() {
  const [runs, setRuns] = useState(getRuns());

  const [selectedTab, setSelectedTab] = useState<
    "training" | "race"
  >("training");

  const navigate = useNavigate();

  const filteredRuns = runs.filter(
    (run) => run.type === selectedTab
  );

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
          marginBottom: "30px",
        }}
      >
        📖 Historique
      </h1>

      <div
        style={{
          display: "flex",
          gap: "15px",
          maxWidth: "500px",
          margin: "0 auto 35px",
        }}
      >
        <button
          onClick={() => setSelectedTab("training")}
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            background:
              selectedTab === "training"
                ? "#22c55e"
                : "#24324d",
            color: "white",
          }}
        >
          🏃 Entraînements
        </button>

        <button
          onClick={() => setSelectedTab("race")}
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            background:
              selectedTab === "race"
                ? "#3b82f6"
                : "#24324d",
            color: "white",
          }}
        >
          🏅 Compétitions
        </button>
      </div>

      {filteredRuns.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          Aucune sortie trouvée.
        </p>
      ) : (
        filteredRuns.map((run) => (
          <div
            key={run.id}
            style={{
              background: "#13213a",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <h2>{run.name}</h2>

            <p>📅 {formatDate(run.date)}</p>

            <p>📏 {run.distance} km</p>

            <p>⏱ {run.duration}</p>

            <p>⏱ {getAveragePace(run.distance, run.duration)}</p>

            <p>⛰ {run.elevation} m</p>

            {run.type === "race" && (
              <>
                
                {run.location && (
                  <p>📍 {run.location}</p>
                )}

                {run.position !== undefined &&
  run.participants !== undefined && (
    <p>
      🏆 {run.position} / {run.participants}
    </p>
)}
              </>
            )}

            <button
              onClick={() =>
                navigate(`/edit/${run.id}`)
              }
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