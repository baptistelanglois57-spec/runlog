import {
  House,
  Plus,
  BookOpen,
  Wrench,
  Dumbbell,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { theme } from "../styles/theme";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      label: "Accueil",
      icon: House,
      path: "/",
    },
    {
      label: "Ajouter",
      icon: Plus,
      path: "/add",
    },
    {
      label: "Historique",
      icon: BookOpen,
      path: "/history",
    },
    {
      label: "Muscu",
      icon: Dumbbell,
      path: "/muscu",
    },
    {
      label: "Outils",
      icon: Wrench,
      path: "/tools",
    },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: "18px",
        left: "50%",
        transform: "translateX(-50%)",

        width: "92%",
        maxWidth: "620px",

        height: "74px",

        background: "rgba(23,23,23,0.96)",

        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",

        border: "1px solid #2E2E2E",

        borderRadius: "999px",

        boxShadow:
          "0 15px 40px rgba(0,0,0,.45)",

        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",

        padding: "0 8px",

        zIndex: 1000,
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;

        const active =
          location.pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: active
                ? "#2A2A2A"
                : "transparent",

              border: "none",

              cursor: "pointer",

              width: active
                ? "78px"
                : "58px",

              height: "58px",

              borderRadius: "999px",

              transition: "all .25s ease",

              display: "flex",
              flexDirection: "column",

              alignItems: "center",
              justifyContent: "center",

              color: active
                ? theme.colors.primary
                : "#D0D0D0",

              transform: active
                ? "scale(1.03)"
                : "scale(1)",
            }}
          >
            <Icon
              size={30}
              strokeWidth={
                active
                  ? 2.8
                  : 2.3
              }
            />

            <span
              style={{
                fontSize: "10px",
                marginTop: "4px",

                fontWeight: active
                  ? 700
                  : 500,

                color: active
                  ? theme.colors.primary
                  : "#BEBEBE",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}