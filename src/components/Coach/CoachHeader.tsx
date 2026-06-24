import { theme } from "../../styles/theme";

export default function CoachHeader() {
  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: "35px",
      }}
    >
      <h1
        style={{
          margin: 0,
          color: theme.colors.primary,
          fontSize: "38px",
          fontWeight: 700,
        }}
      >
        Coach RunLog
      </h1>
    </div>
  );
}