type Props = {
  count: number;
  onClick: () => void;
};

export default function NotificationBell({
  count,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        cursor: "pointer",
        fontSize: 28,
      }}
    >
      🔔

      {count > 0 && (
        <div
          style={{
            position: "absolute",
            top: -6,
            right: -8,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#E53935",
            color: "#fff",
            fontSize: 11,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          {count}
        </div>
      )}
    </div>
  );
}