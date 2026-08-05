import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";
import PageCard from "../components/Layout/PageCard";

import GymComparisonResult from "../components/Muscu/GymComparisonResult";

import { theme } from "../styles/theme";
import { UI } from "../styles/ui";

import type { GymSession } from "../types/GymSession";

import { getGymSessions } from "../services/gymService";
import { compareExercises } from "../utils/gymComparison";

export default function GymComparison() {
  const navigate = useNavigate();

  const [sessions, setSessions] =
    useState<GymSession[]>([]);

  const [sessionAId, setSessionAId] =
    useState("");

  const [sessionBId, setSessionBId] =
    useState("");

  const [comparison, setComparison] =
    useState<any[]>([]);

  const [showInfoA, setShowInfoA] =
    useState(false);

  const [showInfoB, setShowInfoB] =
    useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    const data = await getGymSessions();
    setSessions(data);
  }

  function handleCompare() {
    if (!sessionAId || !sessionBId) {
      return;
    }

    const sessionA = sessions.find(
      (s) => s.id === sessionAId
    );

    const sessionB = sessions.find(
      (s) => s.id === sessionBId
    );

    if (!sessionA || !sessionB) {
      return;
    }

    setComparison(
      compareExercises(
        sessionA.exercises,
        sessionB.exercises
      )
    );
  }

  return (
    <AppContainer>
      <Section>
        <PageCard>
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            <button
              onClick={() =>
                navigate("/tools")
              }
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                border: `1px solid ${theme.colors.border}`,
                background:
                  theme.colors.card,
                display: "flex",
                justifyContent:
                  "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <ChevronLeft
                size={22}
                color={
                  theme.colors.primary
                }
              />
            </button>

            <h1
              style={{
                margin: 0,
                color:
                  theme.colors.primary,
                fontSize:
                  UI.FONT_H1,
              }}
            >
              📊 Comparaison
            </h1>

            <div style={{ width: 44 }} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    color:
                      theme.colors.text,
                    fontWeight: 700,
                  }}
                >
                  Séance A
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowInfoA(
                      !showInfoA
                    )
                  }
                  style={{
  width: 22,
  height: 22,
  borderRadius: "50%",
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.card,
  color: theme.colors.text,
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}}
                >
                  ?
                </button>
              </div>

              {showInfoA && (
                <div
                  style={{
                    marginBottom: 12,
                    padding: 12,
                    borderRadius: 12,
                    background:
                      theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                    color:
                      theme.colors.textSecondary,
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  <strong
                    style={{
                      color:
                        theme.colors.text,
                    }}
                  >
                    Séance A
                  </strong>

                  <br />

                  Séance de référence
                  (ancienne séance).
                </div>
              )}

              <select
                value={sessionAId}
                onChange={(e) =>
                  setSessionAId(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: 16,
                  borderRadius: 14,
                  border: `1px solid ${theme.colors.border}`,
                  background:
                    theme.colors.background,
                  color:
                    theme.colors.text,
                  fontSize: 16,
                }}
              >
                <option value="">
                  Sélectionner une séance
                </option>

                {sessions.map(
                  (session) => (
                    <option
                      key={session.id}
                      value={
                        session.id
                      }
                    >
                      {session.name} •{" "}
                      {new Date(
                        session.date
                      ).toLocaleDateString(
                        "fr-FR"
                      )}
                    </option>
                  )
                )}
              </select>
            </div>
                        <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    color: theme.colors.text,
                    fontWeight: 700,
                  }}
                >
                  Séance B
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowInfoB(
                      !showInfoB
                    )
                  }
                  style={{
  width: 22,
  height: 22,
  borderRadius: "50%",
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.card,
  color: theme.colors.text,
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}}
                >
                  ?
                </button>
              </div>

              {showInfoB && (
                <div
                  style={{
                    marginBottom: 12,
                    padding: 12,
                    borderRadius: 12,
                    background:
                      theme.colors.card,
                    border: `1px solid ${theme.colors.border}`,
                    color:
                      theme.colors.textSecondary,
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  <strong
                    style={{
                      color:
                        theme.colors.text,
                    }}
                  >
                    Séance B
                  </strong>

                  <br />

                  Séance analysée
                  (la plus récente).
                </div>
              )}

              <select
                value={sessionBId}
                onChange={(e) =>
                  setSessionBId(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: 16,
                  borderRadius: 14,
                  border: `1px solid ${theme.colors.border}`,
                  background:
                    theme.colors.background,
                  color:
                    theme.colors.text,
                  fontSize: 16,
                }}
              >
                <option value="">
                  Sélectionner une séance
                </option>

                {sessions.map(
                  (session) => (
                    <option
                      key={session.id}
                      value={
                        session.id
                      }
                    >
                      {session.name} •{" "}
                      {new Date(
                        session.date
                      ).toLocaleDateString(
                        "fr-FR"
                      )}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              onClick={handleCompare}
              style={{
                width: "100%",
                padding: 16,
                border: "none",
                borderRadius: 14,
                background:
                  theme.colors.primary,
                color: "#000",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Comparer les séances
            </button>

            {comparison.length > 0 && (
              <GymComparisonResult
                comparison={comparison}
              />
            )}
          </div>
        </PageCard>
      </Section>
    </AppContainer>
  );
}
