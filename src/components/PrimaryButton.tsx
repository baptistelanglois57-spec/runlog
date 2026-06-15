import { useNavigate } from "react-router-dom";

type Props = {
  text: string;
  to: string;
};

export default function PrimaryButton({ text, to }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      style={{
        background: "#22c55e",
        color: "white",
        border: "none",
        padding: "16px 30px",
        borderRadius: "12px",
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );
}