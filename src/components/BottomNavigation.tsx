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

        left: "50%",
        bottom: "max(18px, env(safe-area-inset-bottom))",
        transform: "translateX(-50%)",

        width: "min(92%, 620px)",
        height: "76px",

        background: "rgba(23,23,23,.96)",

        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",

        border: `1px solid ${theme.colors.border}`,

        borderRadius: "999px",

        boxShadow: "0 14px 35px rgba(0,0,0,.40)",

        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",

        padding: "0 8px",

        boxSizing: "border-box",

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
  width: active ? 80 : 60,
  height: 60,

  border: "none",

  borderRadius: "999px",

  background: "transparent",

  color: active
    ? theme.colors.primary
    : theme.colors.textSecondary,

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  cursor: "pointer",

  transition: "all .20s ease",

  flexShrink: 0,
}}
          >
            <Icon
              size={28}
              strokeWidth={active ? 2.7 : 2.3}
            />

            <span
              style={{
                marginTop: 4,

                fontSize: 10,

                fontWeight: active ? 700 : 500,

                color: active
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
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