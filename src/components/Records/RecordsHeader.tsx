import { useNavigate } from "react-router-dom";

import {
  ChevronLeft,
  Trophy,
} from "lucide-react";

import { theme } from "../../styles/theme";
import { UI } from "../../styles/ui";

export default function RecordsHeader() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        marginBottom: 34,
      }}
    >
      <button
        onClick={() => navigate("/tools")}
        style={{
          width: 42,
          height: 42,

          border: "none",

          borderRadius: 12,

          background: theme.colors.card,

          color: theme.colors.primary,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          cursor: "pointer",
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Trophy
          size={24}
          color={theme.colors.primary}
        />

        <h1
          style={{
            margin: 0,

            fontSize: UI.FONT_H1,

            color: theme.colors.primary,

            fontWeight: 800,
          }}
        >
          Records
        </h1>
      </div>

      <div
        style={{
          width: 42,
        }}
      />
    </div>
  );
}