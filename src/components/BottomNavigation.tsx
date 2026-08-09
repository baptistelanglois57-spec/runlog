import { BookOpen, Dumbbell, House, Plus, Wrench } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const items = [
    { label: "Accueil", icon: House, path: "/" },
    { label: "Ajouter", icon: Plus, path: "/add" },
    { label: "Historique", icon: BookOpen, path: "/history" },
    { label: "Muscu", icon: Dumbbell, path: "/muscu" },
    { label: "Outils", icon: Wrench, path: "/tools" },
  ];

  return (
    <nav className="bottom-navigation" aria-label="Navigation principale">
      {items.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path;

        return (
          <button
            key={item.path}
            className={`bottom-navigation__item${active ? " bottom-navigation__item--active" : ""}`}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => navigate(item.path)}
          >
            <Icon size={28} strokeWidth={active ? 2.7 : 2.3} />
            <span className="bottom-navigation__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
