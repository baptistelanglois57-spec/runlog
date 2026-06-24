import {
  House,
  Plus,
  BookOpen,
  ChartColumn,
  Handshake,
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
    {
      label: "Coach",
      icon: Handshake,
      path: "/coach",
    },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,

        height: "88px",
        paddingBottom:
          "env(safe-area-inset-bottom)",

        background: theme.colors.card,

        borderTop: `1px solid ${theme.colors.border}`,

        boxShadow:
          "0 -8px 24px rgba(0,0,0,0.35)",

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

              gap: "8px",

              color: active
                ? theme.colors.primary
                : "#c9d1d9",

              transition: "0.2s",

              flex: 1,
              maxWidth: "90px",

              height: "100%",
            }}
          >
            <Icon
              size={28}
              strokeWidth={2.4}
            />

            <span
              style={{
                fontSize: "13px",

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