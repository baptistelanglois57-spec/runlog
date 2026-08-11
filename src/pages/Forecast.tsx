import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChartLine,
} from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";

import ForecastForm from "../components/Forecast/ForecastForm";
import ForecastResult from "../components/Forecast/ForecastResult";

import { theme } from "../styles/theme";
import { Typography } from "../styles/ui";
import "./Tools/ToolSubpages.css";

import {
  getForecast,
} from "../services/forecastService";

import type {
  ForecastInput,
  ForecastResult as ForecastResultType,
} from "../types/Forecast";

export default function Forecast() {
  const navigate = useNavigate();

 const [input, setInput] =
  useState<ForecastInput>({
    distance: 0,

    elevation: 0,

    surface: "road",

    objective: "race",
  });
  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<ForecastResultType | null>(
      null
    );

  async function calculate() {
    setLoading(true);

    const forecast =
      await getForecast(input);

    setResult(forecast);

    setLoading(false);
  }

  return (
    <AppContainer>
      <div className="tools-subpage"><Section marginTop={8}>
        {/* HEADER */}

        <div className="tools-subpage__header"
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            marginBottom: 30,
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

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: 10,
            }}
          >
            <ChartLine
              size={24}
              color={
                theme.colors.primary
              }
            />

            <h1
              style={{
                margin: 0,

                color:
                  theme.colors.text,

                fontSize: Typography.pageTitle,
              }}
            >
              Prévisions
            </h1>
          </div>

          <div className="tools-subpage__notice"
            style={{
              width: 44,
            }}
          />
        </div>

        <ForecastForm
          value={input}
          onChange={setInput}
          onCalculate={calculate}
        />
                {loading && (
          <div
            style={{
              marginTop: 30,

              background:
                theme.colors.card,

              border: `1px solid ${theme.colors.border}`,

              borderRadius: 20,

              padding: 30,

              textAlign: "center",

              color:
                theme.colors.primary,

              fontWeight: 700,

              fontSize: Typography.cardTitle,
            }}
          >
            Calcul des prévisions...
          </div>
        )}

        {!loading &&
          result && (
            <ForecastResult
              result={result}
            />
          )}

        {!loading &&
          !result && (
            <div className="tools-subpage__notice"
              style={{
                marginTop: 28,

                background:
                  theme.colors.card,

                border: `1px solid ${theme.colors.border}`,

                borderRadius: 20,

                padding: 30,

                textAlign: "center",
              }}
            >
              <h2
                style={{
                  marginTop: 0,

                  color:
                    theme.colors.primary,
                }}
              >
                📈 Prévision
              </h2>

              <p
                style={{
                  marginBottom: 0,

                  color:
                    theme.colors.textSecondary,

                  lineHeight: 1.7,
                }}
              >
                Renseigne la distance,
                le dénivelé et le type
                de parcours puis lance
                le calcul.

                <br />
                <br />

                RunLog analysera ton
                historique ainsi que
                les informations de ta
                fiche sportif afin
                d'estimer ton temps.
              </p>
            </div>
          )}
      </Section></div>
    </AppContainer>
  );
}
