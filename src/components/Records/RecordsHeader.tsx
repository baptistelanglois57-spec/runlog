import { theme } from "../../styles/theme";

export default function RecordsHeader() {
  return (
    <div
      style={{
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
        NEVER GIVE UP
      </p>
    </div>
  );
}