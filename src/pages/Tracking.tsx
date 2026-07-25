import { useEffect, useState } from "react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import PageCard from "../components/Layout/PageCard";

import { theme } from "../styles/theme";

import {
  getWeights,
  saveWeight,
  deleteWeight,
} from "../services/weightService";

import type { Weight } from "../types/Weight";

export default function Tracking() {
  const [entries, setEntries] =
    useState<Weight[]>([]);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [weight, setWeight] =
    useState("");

  useEffect(() => {
    loadWeights();
  }, []);

  async function loadWeights() {
    const data = await getWeights();

    data.sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

    setEntries(data);
  }

  async function addEntry() {
    if (!weight) return;

    await saveWeight({
      id: crypto.randomUUID(),
      date,
      weight: Number(weight),
    });

    setWeight("");

    await loadWeights();
  }

  async function handleDelete(
    id: string
  ) {
    if (
      !window.confirm(
        "Supprimer cette pesée ?"
      )
    ) {
      return;
    }

    await deleteWeight(id);

    await loadWeights();
  }

  return (
    <AppContainer>
      <Section>
        <PageCard>
          <h2
            style={{
              color: theme.colors.primary,
              textAlign: "center",
              marginTop: 0,
            }}
          >
            ⚖️ Suivi du poids
          </h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "25px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: `1px solid ${theme.colors.border}`,
                background:
                  theme.colors.card,
                color:
                  theme.colors.text,
              }}
            />

            <input
              type="number"
              step="0.1"
              placeholder="Poids (kg)"
              value={weight}
              onChange={(e) =>
                setWeight(e.target.value)
              }
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "12px",
                border: `1px solid ${theme.colors.border}`,
                background:
                  theme.colors.card,
                color:
                  theme.colors.text,
              }}
            />

            <button
              onClick={addEntry}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "none",
                background:
                  theme.colors.primary,
                color: "#000",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Ajouter
            </button>
          </div>
        </PageCard>
      </Section>

      <Section>
        <PageCard>
          <h2
            style={{
              color: theme.colors.primary,
              marginTop: 0,
            }}
          >
            Historique
          </h2>
                    {entries.length === 0 ? (
            <p
              style={{
                color: theme.colors.textSecondary,
                textAlign: "center",
                marginBottom: 0,
              }}
            >
              Aucune pesée enregistrée.
            </p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      paddingBottom: "12px",
                      color: theme.colors.primary,
                    }}
                  >
                    Date
                  </th>

                  <th
                    style={{
                      textAlign: "center",
                      paddingBottom: "12px",
                      color: theme.colors.primary,
                    }}
                  >
                    Poids
                  </th>

                  <th
                    style={{
                      textAlign: "right",
                      paddingBottom: "12px",
                      color: theme.colors.primary,
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td
                      style={{
                        padding: "14px 0",
                        borderTop: `1px solid ${theme.colors.border}`,
                      }}
                    >
                      {new Date(
                        entry.date
                      ).toLocaleDateString("fr-FR")}
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                        borderTop: `1px solid ${theme.colors.border}`,
                        fontWeight: 700,
                      }}
                    >
                      {entry.weight.toFixed(1)} kg
                    </td>

                    <td
                      style={{
                        textAlign: "right",
                        borderTop: `1px solid ${theme.colors.border}`,
                      }}
                    >
                      <button
                        onClick={() =>
                          handleDelete(entry.id)
                        }
                        style={{
                          background: "#EF4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </PageCard>
      </Section>
    </AppContainer>
  );
}