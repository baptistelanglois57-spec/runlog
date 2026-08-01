import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChevronLeft, Scale } from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import PageCard from "../components/Layout/PageCard";

import { theme } from "../styles/theme";
import { UI } from "../styles/ui";

import {
  getWeights,
  saveWeight,
  deleteWeight,
} from "../services/weightService";

import type { Weight } from "../types/Weight";

export default function Tracking() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState<Weight[]>([]);

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
    )
      return;

    await deleteWeight(id);

    await loadWeights();
  }

  return (
    <AppContainer>
      <Section>

        {/* HEADER */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            marginBottom: 30,
          }}
        >
          <button
            onClick={() =>
              navigate("/tools")
            }
            style={{
              width: 42,
              height: 42,

              border: "none",

              borderRadius: 12,

              background:
                theme.colors.card,

              color:
                theme.colors.primary,

              display: "flex",

              alignItems: "center",

              justifyContent:
                "center",

              cursor: "pointer",
            }}
          >
            <ChevronLeft
              size={22}
            />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Scale
              size={24}
              color={
                theme.colors.primary
              }
            />

            <h1
              style={{
                margin: 0,

                fontSize:
                  UI.FONT_H1,

                color:
                  theme.colors
                    .primary,

                fontWeight: 800,
              }}
            >
              Suivi
            </h1>
          </div>

          <div
            style={{
              width: 42,
            }}
          />
        </div>

        {/* AJOUT */}

        <PageCard>
          <h2
            style={{
              marginTop: 0,
              marginBottom: 24,

              textAlign: "center",

              color:
                theme.colors.text,

              fontSize: 24,
            }}
          >
            Ajouter une pesée
          </h2>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",

              gap: 14,
            }}
          >
            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
              style={{
                height: 52,

                padding:
                  "0 16px",

                borderRadius: 14,

                border: `1px solid ${theme.colors.border}`,

                background:
                  theme.colors
                    .background,

                color:
                  theme.colors.text,

                fontSize: 15,

                boxSizing:
                  "border-box",
              }}
            />

            <input
              type="number"
              step="0.1"
              placeholder="Poids (kg)"
              value={weight}
              onChange={(e) =>
                setWeight(
                  e.target.value
                )
              }
              style={{
                height: 52,

                padding:
                  "0 16px",

                borderRadius: 14,

                border: `1px solid ${theme.colors.border}`,

                background:
                  theme.colors
                    .background,

                color:
                  theme.colors.text,

                fontSize: 15,

                boxSizing:
                  "border-box",
              }}
            />

            <button
              onClick={addEntry}
              style={{
                height: 52,

                border: "none",

                borderRadius: 14,

                background:
                  theme.colors
                    .primary,

                color: "#000",

                fontWeight: 700,

                fontSize: 16,

                cursor: "pointer",
              }}
            >
              Ajouter
            </button>
          </div>
        </PageCard>

          {/* HISTORIQUE */}

        <Section marginTop={24}>
          <PageCard>
            <h2
              style={{
                marginTop: 0,
                marginBottom: 24,

                color: theme.colors.text,

                fontSize: 24,
              }}
            >
              Historique
            </h2>

            {entries.length === 0 ? (
              <div
                style={{
                  textAlign: "center",

                  color:
                    theme.colors.textSecondary,

                  padding: "24px 0",
                }}
              >
                Aucune pesée enregistrée.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {entries.map(
                  (entry, index) => {
                    const previous =
                      entries[index + 1];

                    const diff =
                      previous
                        ? (
                            entry.weight -
                            previous.weight
                          ).toFixed(1)
                        : null;

                    const color =
                      diff === null
                        ? theme.colors.textSecondary
                        : Number(diff) > 0
                        ? "#ef4444"
                        : Number(diff) < 0
                        ? "#22c55e"
                        : theme.colors.textSecondary;

                    const arrow =
                      diff === null
                        ? ""
                        : Number(diff) > 0
                        ? "↗"
                        : Number(diff) < 0
                        ? "↘"
                        : "→";

                    return (
                      <div
                        key={entry.id}
                        style={{
                          background:
                            theme.colors.background,

                          border: `1px solid ${theme.colors.border}`,

                          borderRadius: 18,

                          padding: 18,

                          display: "flex",

                          justifyContent:
                            "space-between",

                          alignItems: "center",

                          gap: 20,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,

                              marginBottom: 6,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 22,
                              }}
                            >
                              ⚖️
                            </span>

                            <span
                              style={{
                                fontSize: 24,

                                fontWeight: 800,

                                color:
                                  theme.colors.primary,
                              }}
                            >
                              {entry.weight.toFixed(
                                1
                              )}{" "}
                              kg
                            </span>

                            {diff && (
                              <span
                                style={{
                                  color,

                                  fontWeight: 700,

                                  fontSize: 14,
                                }}
                              >
                                {arrow}{" "}
                                {diff > "0"
                                  ? "+"
                                  : ""}
                                {diff} kg
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              color:
                                theme.colors.textSecondary,

                              fontSize: 13,
                            }}
                          >
                            {new Date(
                              entry.date
                            ).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleDelete(
                              entry.id
                            )
                          }
                          style={{
                            width: 42,
                            height: 42,

                            border: "none",

                            borderRadius: 12,

                            background:
                              "#d14334",

                            color: "#fff",

                            fontSize: 18,

                            cursor: "pointer",
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </PageCard>
        </Section>
      </Section>
    </AppContainer>
  );
}