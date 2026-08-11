import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, ChartLine, ChevronRight, Dumbbell, NotebookPen, Scale, Target, Trophy, UserRound } from "lucide-react";
import "./Tools.css";

type Tool = { icon: LucideIcon; title: string; path: string; category: "performance" | "organisation" | "athlete" | "gym"; featured?: boolean };

const tools: Tool[] = [
  { icon: Trophy, title: "Records", path: "/records", category: "performance", featured: true },
  { icon: Target, title: "Régularité", path: "/discipline", category: "performance", featured: true },
  { icon: ChartLine, title: "Prévisions", path: "/forecast", category: "performance" },
  { icon: CalendarDays, title: "Agenda", path: "/agenda", category: "organisation", featured: true },
  { icon: NotebookPen, title: "Note", path: "/notes", category: "organisation" },
  { icon: UserRound, title: "Profil", path: "/athlete-profile", category: "athlete", featured: true },
  { icon: Scale, title: "Comparaison", path: "/gym-comparison", category: "gym" },
  { icon: Dumbbell, title: "Exercices", path: "/exercise-library", category: "gym" },
];

type ToolCardProps = { tool: Tool; onOpen: () => void; compact?: boolean };
function ToolCard({ tool, onOpen, compact = false }: ToolCardProps) {
  const Icon = tool.icon;
  return <button className={`tools-card${tool.featured ? " tools-card--featured" : ""}${compact ? " tools-card--compact" : ""}`} onClick={onOpen}><span className="tools-card__icon"><Icon size={22} strokeWidth={2.1} /></span><span className="tools-card__copy"><strong>{tool.title}</strong></span><ChevronRight className="tools-card__chevron" size={18} /></button>;
}

export default function Tools() {
  const navigate = useNavigate();
  const performance = tools.filter((tool) => tool.category === "performance");
  const organisation = tools.filter((tool) => tool.category === "organisation");
  const athlete = tools.filter((tool) => tool.category === "athlete");
  const gym = tools.filter((tool) => tool.category === "gym");
  const openTool = (tool: Tool) => navigate(tool.path);

  return <main className="tools-page"><div className="tools-page__content">
    <header className="tools-page__header"><h1>Outils</h1></header>

    <section className="tools-section"><div className="tools-section__heading"><h2>Performance</h2></div><div className="tools-performance-grid">{performance.map((tool) => <ToolCard key={tool.path} tool={tool} onOpen={() => openTool(tool)} />)}</div></section>

    <section className="tools-section"><div className="tools-section__heading"><h2>Organisation</h2></div><div className="tools-organisation-grid">{organisation.map((tool) => <ToolCard key={tool.path} tool={tool} onOpen={() => openTool(tool)} />)}</div></section>

    <section className="tools-section"><div className="tools-section__heading"><h2>Profil</h2></div>{athlete.map((tool) => <ToolCard key={tool.path} tool={tool} onOpen={() => openTool(tool)} />)}</section>

    <section className="tools-section tools-section--gym"><div className="tools-section__heading"><h2>Musculation</h2></div><div className="tools-gym-grid">{gym.map((tool) => <ToolCard key={tool.path} tool={tool} onOpen={() => openTool(tool)} compact />)}</div></section>
  </div></main>;
}
