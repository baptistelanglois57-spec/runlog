import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, CalendarDays, ChevronLeft, ChevronRight, Heart, History, Pencil, Ruler, Scale, UserRound, Zap } from "lucide-react";
import EditAthleteModal from "../components/Athlete/EditAthleteModal";
import WeightHistoryModal from "../components/Athlete/WeightHistoryModal";
import Vo2HistoryModal from "../components/Athlete/Vo2historyModal";
import { getProfile, saveProfile, getCurrentWeight, getCurrentVo2, addWeight, addVo2, getWeightHistory, getVo2History } from "../services/athleteService";
import type { AthleteProfile as AthleteProfileData } from "../types/AthleteProfile";
import type { WeightEntry } from "../types/WeightEntry";
import type { Vo2Entry } from "../types/V02Entry";
import "./AthleteProfile.css";

type EditableField = "height" | "gender" | "birthDate" | "maxHeartRate" | "restingHeartRate" | "weight" | "vo2max";

type MetricCardProps = { label: string; value: string; detail: string; icon: ReactNode; emphasis?: boolean; onClick?: () => void; onHistory?: () => void };
function MetricCard({ label, value, detail, icon, emphasis = false, onClick, onHistory }: MetricCardProps) { return <article className={`athlete-metric-card${emphasis ? " athlete-metric-card--emphasis" : ""}`} onClick={onClick}><div className="athlete-metric-card__top"><span className="athlete-metric-card__icon">{icon}</span>{onHistory && <button onClick={(event) => { event.stopPropagation(); onHistory(); }} aria-label={`Voir l’historique : ${label}`}><History size={15} /></button>}</div><strong>{value}</strong><span>{label}</span><small>{detail}</small></article>; }

type ProfileRowProps = { icon: ReactNode; label: string; value: string; onClick: () => void; accent?: boolean };
function ProfileRow({ icon, label, value, onClick, accent = false }: ProfileRowProps) { return <button className={`athlete-profile-row${accent ? " athlete-profile-row--accent" : ""}`} onClick={onClick}><span className="athlete-profile-row__icon">{icon}</span><span className="athlete-profile-row__copy"><small>{label}</small><strong>{value}</strong></span><span className="athlete-profile-row__action"><Pencil size={14} /><ChevronRight size={15} /></span></button>; }

export default function AthleteProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AthleteProfileData | null>(null);
  const [weight, setWeight] = useState(0);
  const [vo2max, setVo2max] = useState(0);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [vo2History, setVo2History] = useState<Vo2Entry[]>([]);
  const [showWeightHistory, setShowWeightHistory] = useState(false);
  const [showVo2History, setShowVo2History] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [athlete, currentWeight, currentVo2, weightData, vo2Data] = await Promise.all([getProfile(), getCurrentWeight(), getCurrentVo2(), getWeightHistory(), getVo2History()]);
    if (athlete) { setProfile(athlete); } else { setProfile({ id: "profile", height: 0, gender: "male", birthDate: "", maxHeartRate: 0, restingHeartRate: 0 }); }
    setWeight(currentWeight); setVo2max(currentVo2); setWeightHistory(weightData); setVo2History(vo2Data);
  }

  async function saveField(value: string) {
    if (!editingField) return;
    if (editingField === "weight") { await addWeight(Number(value)); await loadData(); setEditingField(null); return; }
    if (editingField === "vo2max") { await addVo2(Number(value)); await loadData(); setEditingField(null); return; }
    if (!profile) return;
    const updated = { ...profile, [editingField]: editingField === "gender" || editingField === "birthDate" ? value : Number(value) };
    await saveProfile(updated); setProfile(updated); setEditingField(null);
  }

  if (!profile) return <main className="athlete-page"><div className="athlete-page__content athlete-page__loading"><span className="athlete-loading-orb" /><p>Préparation de votre profil…</p></div></main>;

  const gender = profile.gender === "male" ? "Homme" : "Femme";
  return <main className="athlete-page"><div className="athlete-page__content">
    <header className="athlete-page__header"><button className="athlete-icon-button" onClick={() => navigate("/tools")} aria-label="Retour aux outils"><ChevronLeft size={21} /></button><div><h1>Mon athlète.</h1><p>Vos repères pour progresser avec précision.</p></div><span className="athlete-header-mark" aria-hidden="true"><UserRound size={19} /></span></header>

    <section className="athlete-hero"><div className="athlete-hero__avatar" aria-hidden="true"><UserRound size={38} /></div><div className="athlete-hero__copy"><p>Profil RunLog</p><h2>Athlète en progression</h2><span>Données physiologiques personnelles</span></div><div className="athlete-hero__status"><span /><small>Profil actif</small></div></section>

    <section className="athlete-section"><div className="athlete-section__heading"><div><p>Essentiels</p><h2>Vos repères</h2></div><span>Modifier à tout moment</span></div><div className="athlete-metric-grid"><MetricCard label="Taille" value={`${profile.height} cm`} detail="Morphologie" icon={<Ruler size={17} />} onClick={() => setEditingField("height")} /><MetricCard label="Poids" value={`${weight} kg`} detail="Mesure actuelle" icon={<Scale size={17} />} emphasis onClick={() => setEditingField("weight")} onHistory={() => setShowWeightHistory(true)} /><MetricCard label="VO₂ Max" value={`${vo2max}`} detail="Capacité aérobie" icon={<Zap size={17} />} emphasis onClick={() => setEditingField("vo2max")} onHistory={() => setShowVo2History(true)} /><MetricCard label="Sexe" value={gender} detail="Profil personnel" icon={<UserRound size={17} />} onClick={() => setEditingField("gender")} /></div></section>

    <section className="athlete-section"><div className="athlete-section__heading"><div><p>Performances</p><h2>Cardio & endurance</h2></div><span>Vos seuils personnels</span></div><div className="athlete-performance"><MetricCard label="VO₂ Max" value={`${vo2max}`} detail="Historique disponible" icon={<Activity size={17} />} emphasis onClick={() => setEditingField("vo2max")} onHistory={() => setShowVo2History(true)} /><MetricCard label="FC repos" value={`${profile.restingHeartRate} bpm`} detail="Fréquence au calme" icon={<Heart size={17} />} onClick={() => setEditingField("restingHeartRate")} /><MetricCard label="FC max" value={`${profile.maxHeartRate} bpm`} detail="Seuil de référence" icon={<Heart size={17} />} onClick={() => setEditingField("maxHeartRate")} /></div></section>

    <section className="athlete-section athlete-section--profile"><div className="athlete-section__heading"><div><p>Informations</p><h2>Fiche personnelle</h2></div><span>Appuyez pour modifier</span></div><div className="athlete-profile-list"><ProfileRow icon={<UserRound size={17} />} label="Sexe" value={gender} onClick={() => setEditingField("gender")} /><ProfileRow icon={<CalendarDays size={17} />} label="Date de naissance" value={profile.birthDate || "Non renseignée"} onClick={() => setEditingField("birthDate")} /><ProfileRow icon={<Ruler size={17} />} label="Taille" value={`${profile.height} cm`} onClick={() => setEditingField("height")} /><ProfileRow icon={<Scale size={17} />} label="Poids" value={`${weight} kg`} onClick={() => setEditingField("weight")} accent /></div></section>

    <section className="athlete-history"><div><span className="athlete-history__icon"><History size={18} /></span><div><p>Historique disponible</p><strong>Consultez vos évolutions physiologiques</strong></div></div><button onClick={() => setShowWeightHistory(true)}>Poids <ChevronRight size={16} /></button></section>

    <EditAthleteModal isOpen={editingField !== null} title={editingField ? { height: "Taille", weight: "Poids", gender: "Sexe", birthDate: "Date de naissance", vo2max: "VO₂max", maxHeartRate: "Fréquence cardiaque maximale", restingHeartRate: "Fréquence cardiaque au repos" }[editingField] : ""} value={editingField === "weight" ? String(weight) : editingField === "vo2max" ? String(vo2max) : editingField ? String(profile[editingField as keyof AthleteProfileData]) : ""} onClose={() => setEditingField(null)} onSave={saveField} />
    <WeightHistoryModal isOpen={showWeightHistory} history={weightHistory} onClose={() => setShowWeightHistory(false)} />
    <Vo2HistoryModal isOpen={showVo2History} history={vo2History} onClose={() => setShowVo2History(false)} />
  </div></main>;
}
