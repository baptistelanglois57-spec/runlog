type StatsCardProps = {
  title: string;
  value: string;
  icon: string;
};

export default function StatsCard({
  title,
  value,
  icon,
}: StatsCardProps) {
  return (
    <div
      style={{
        background: "#172554",
        borderRadius: "18px",
        padding: "20px",
        width: "220px",
        marginTop: "20px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
      }}
    >
      <h3
        style={{
          margin: 0,
          color: "#94A3B8",
        }}
      >
        {icon} {title}
      </h3>

      <h2
        style={{
          marginTop: "15px",
          marginBottom: "5px",
          fontSize: "32px",
        }}
      >
        {value}
      </h2>
    </div>
  );
}