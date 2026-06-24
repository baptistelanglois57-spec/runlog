import { theme } from "../../styles/theme";

type Props = {
  message: string;
  sender: "coach" | "user";
};

export default function MessageBubble({
  message,
  sender,
}: Props) {
  const isCoach = sender === "coach";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isCoach
          ? "flex-start"
          : "flex-end",
        marginBottom: "18px",
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          background: theme.colors.background,
color: theme.colors.text,
border: `1px solid ${theme.colors.border}`,
          borderRadius: "22px",
          padding: "16px 18px",
          lineHeight: 1.6,
          fontSize: "16px",
          boxShadow: theme.shadow.card,
          whiteSpace: "pre-wrap",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            marginBottom: "8px",
            color: theme.colors.primary,
          }}
        >
          {isCoach ? " Coach" : " Toi"}
        </div>

        <div>{message}</div>
      </div>
    </div>
  );
}