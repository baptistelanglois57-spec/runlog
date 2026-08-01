import { useNavigate } from "react-router-dom";

import {
  ChevronLeft,
  Trophy,
} from "lucide-react";

import PageCard from "../Layout/PageCard";

import { theme } from "../../styles/theme";

export default function RecordsHeader() {
  const navigate = useNavigate();

  return (
    <PageCard maxWidth="100%">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr 40px",
          alignItems: "center",
        }}
      >
        <button
          onClick={() =>
            navigate("/tools")
          }
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: theme.colors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <ChevronLeft size={24} />
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Trophy
            size={30}
            color={theme.colors.primary}
          />

          <h1
            style={{
              margin: 0,
              color: theme.colors.primary,
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            Records
          </h1>
        </div>

        {/* espace pour centrer le titre */}
        <div />
      </div>
    </PageCard>
  );
}