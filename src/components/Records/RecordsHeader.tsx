import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { theme } from "../../styles/theme";

export default function RecordsHeader() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        maxWidth: "900px",
        margin: "0 auto 40px",
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "22px",
        padding: "35px",
        boxShadow: theme.shadow.card,
        textAlign: "center",
      }}
    >
      <button
        onClick={() => navigate("/tools")}
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          width: "42px",
          height: "42px",
          border: "none",
          background: "transparent",
          color: theme.colors.primary,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ChevronLeft size={34} />
      </button>

      <h1
        style={{
          margin: 0,
          color: theme.colors.primary,
          fontSize: "40px",
          fontWeight: 700,
        }}
      >
        🏆 Records
      </h1>

      <p
        style={{
          marginTop: "18px",
          marginBottom: "8px",
          color: "white",
          fontSize: "18px",
          fontWeight: 700,
          letterSpacing: "2px",
        }}
      >
      </p>
    </div>
  );
}