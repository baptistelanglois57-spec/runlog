import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock, Check, ChevronLeft, Flag, Trophy } from "lucide-react";
import { loadDiscipline, type DisciplinePageData } from "../services/disciplineService";
import DisciplineAccordion from "../components/Discipline/DisciplineAccordion";
import "./Discipline.css";

type DisciplineStats = DisciplinePageData["overall"];

type SummaryCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "gold" | "default" | "muted";
};

function SummaryCard({ label, value, icon, tone = "default" }: SummaryCardProps) {
  return <article className={`discipline-summary-card discipline-summary-card--${tone}`}><span className="discipline-summary-card__icon">{icon}</span><strong>{value}</strong><span>{label}</span></article>;
}

function ActivityScoreCard({ stats }: { stats: DisciplineStats }) {
  return <section className="discipline-score-card" aria-label="Score global de discipline">
    <div className="discipline-score-card__copy"><p>Score global</p><h2>Votre régularité<br />en un regard.</h2><span>{stats.completed} objectifs tenus sur {stats.planned}</span></div>
    <div className="discipline-score-ring" style={{ background: `conic-gradient(var(--rl-accent) ${stats.percentage}%, rgba(var(--rl-ivory-rgb),.09) 0)` }}><div><strong>{stats.percentage}<small>%</small></strong><span>respect</span></div></div>
  </section>;
}

export default function Discipline() {
  const navigate = useNavigate();
  const [data, setData] = useState<DisciplinePageData | null>(null);

  useEffect(() => {
    async function load() {
      const stats = await loadDiscipline();
      setData(stats);
    }
    load();
  }, []);

  if (!data) {
    return <main className="discipline-page"><div className="discipline-page__content discipline-page__loading"><span className="discipline-loading-orb" /><p>Préparation de votre bilan…</p></div></main>;
  }

  return <main className="discipline-page"><div className="discipline-page__content">
    <header className="discipline-page__header"><button className="discipline-icon-button" onClick={() => navigate("/tools")} aria-label="Retour aux outils"><ChevronLeft size={21} /></button><div><h1>Régularité</h1><p>Votre engagement, séance après séance.</p></div><span className="discipline-header-mark" aria-hidden="true"><Trophy size={19} /></span></header>

    <ActivityScoreCard stats={data.overall} />

    <section className="discipline-summary-grid" aria-label="Synthèse de vos objectifs"><SummaryCard label="Réalisées" value={data.overall.completed} icon={<Check size={17} />} tone="gold" /><SummaryCard label="À venir" value={data.overall.pending} icon={<CalendarClock size={17} />} /><SummaryCard label="Manquées" value={data.overall.missed} icon={<Flag size={17} />} tone="muted" /></section>

    <section className="discipline-section discipline-section--history"><div className="discipline-section__heading"><div><p>Historique</p><h2>Déroulé mensuel</h2></div><span>Appuyez pour détailler</span></div><div className="discipline-accordions"><DisciplineAccordion title="Entraînements" months={data.monthlyTraining} /><DisciplineAccordion title="Salle" months={data.monthlyGym} /><DisciplineAccordion title="Compétitions" months={data.monthlyRace} /></div></section>
  </div></main>;
}
