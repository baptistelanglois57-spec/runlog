import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { MonthlyDisciplineStats } from "../../utils/disciplineMonthly";
import MonthlyDisciplineCard from "./MonthlyDisciplineCard";

type Props = { title: string; months: MonthlyDisciplineStats[] };

export default function DisciplineAccordion({ title, months }: Props) {
  const [open, setOpen] = useState(false);
  return <article className={`discipline-accordion${open ? " discipline-accordion--open" : ""}`}><button onClick={() => setOpen(!open)} aria-expanded={open}><span><strong>{title}</strong><small>{months.length} mois enregistré{months.length > 1 ? "s" : ""}</small></span><ChevronDown size={19} /></button>{open && <div className="discipline-accordion__content">{months.length === 0 ? <div className="discipline-accordion__empty">Aucune donnée pour le moment.</div> : months.map((month) => <MonthlyDisciplineCard key={month.monthKey} data={month} />)}</div>}</article>;
}
