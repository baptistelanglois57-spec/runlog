import {
  House,
  Plus,
  BookOpen,
  ChartColumn,
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
      label: "Stats",
      icon: ChartColumn,
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
        height: "74px",
        background: theme.colors.card,
borderTop: `1px solid ${theme.colors.border}`,
boxShadow: "0 -6px 20px rgba(0,0,0,0.35)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
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
            onClick={() =>
              navigate(item.path)
            }
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              color: active
                ? theme.colors.primary
                : "#c9d1d9",
              transition: "0.2s",
              width: "80px",
            }}
          >
            <Icon
              size={26}
              strokeWidth={2.3}
            />

            <span
              style={{
                fontSize: "12px",
                fontWeight: active
                  ? 700
                  : 500,
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