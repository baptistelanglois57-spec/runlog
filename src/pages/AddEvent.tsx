import { theme } from "../styles/theme";

export default function AddEvent() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        color: theme.colors.text,
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: theme.colors.primary,
          marginBottom: "40px",
        }}
      >
        📅 Ajouter un événement
      </h1>

      <p
        style={{
          textAlign: "center",
          color: theme.colors.textSecondary,
        }}
      >
        Cette page est en cours de création...
      </p>
    </main>
  );
}