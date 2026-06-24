import { theme } from "../../styles/theme";
import { SendHorizontal } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
};

export default function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = "Pose une question à ton coach...",
}: Props) {
  return (
    <div
      style={{
        position: "relative",
        marginTop: "25px",
      }}
    >
      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSend();
          }
        }}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "18px 70px 18px 20px",
          borderRadius: "18px",
          border: `1px solid ${theme.colors.border}`,
          background: theme.colors.background,
          color: theme.colors.text,
          fontSize: "16px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={onSend}
        style={{
          position: "absolute",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          border: "none",
          background: theme.colors.primary,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <SendHorizontal
          color="#000"
          size={20}
        />
      </button>
    </div>
  );
}