import { useLocation, useNavigate } from "react-router-dom";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      label: "Accueil",
      icon: "🏠",
      path: "/",
    },
    {
      label: "Ajouter",
      icon: "➕",
      path: "/add",
    },
    {
      label: "Historique",
      icon: "📖",
      path: "/history",
    },
    {
      label: "Stats",
      icon: "📊",
      path: "/statistics",
    },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "65px",
        background: "#13213a",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderTop: "1px solid #24324d",
      }}
    >
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            background: "transparent",
            border: "none",
            color:
              location.pathname === item.path
                ? "#22c55e"
                : "white",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "15px",
            fontWeight: "bold",
          }}
        >
          <span style={{ fontSize: "22px" }}>
            {item.icon}
          </span>

          {item.label}
        </button>
      ))}
    </nav>
  );
}
