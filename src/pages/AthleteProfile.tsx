import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
  History,
  Ruler,
  Scale,
  UserRound,
  Zap,
} from "lucide-react";
import EditAthleteModal from "../components/Athlete/EditAthleteModal";
import WeightHistoryModal from "../components/Athlete/WeightHistoryModal";
import Vo2HistoryModal from "../components/Athlete/Vo2historyModal";
import {
  addVo2,
  addWeight,
  getCurrentVo2,
  getCurrentWeight,
  getProfile,
  getVo2History,
  getWeightHistory,
  saveProfile,
} from "../services/athleteService";
import type { AthleteProfile as AthleteProfileData } from "../types/AthleteProfile";
import type { Vo2Entry } from "../types/V02Entry";
import type { WeightEntry } from "../types/WeightEntry";
import "./AthleteProfile.css";

type EditableField =
  | "height"
  | "gender"
  | "birthDate"
  | "maxHeartRate"
  | "restingHeartRate"
  | "weight"
  | "vo2max";

type MetricCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  detail: string;
  icon: ReactNode;
  emphasis?: boolean;
  onClick: () => void;
};

function MetricCard({
  label,
  value,
  unit,
  detail,
  icon,
  emphasis = false,
  onClick,
}: MetricCardProps) {
  return (
    <button
      className={`athlete-metric-card${emphasis ? " athlete-metric-card--emphasis" : ""}`}
      type="button"
      onClick={onClick}
      aria-label={`Modifier ${label}`}
    >
      <span className="athlete-metric-card__icon">{icon}</span>
      <strong>
        {value}
        {unit && <span className="athlete-metric-card__unit">{unit}</span>}
      </strong>
      <span>{label}</span>
      <small>{detail}</small>
    </button>
  );
}

type HistoryLinkProps = {
  label: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
};

function HistoryLink({ label, description, icon, onClick }: HistoryLinkProps) {
  return (
    <button className="athlete-history-link" type="button" onClick={onClick}>
      <span className="athlete-history-link__icon">{icon}</span>
      <span className="athlete-history-link__copy">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <ChevronRight size={17} aria-hidden="true" />
    </button>
  );
}

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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [athlete, currentWeight, currentVo2, weightData, vo2Data] =
      await Promise.all([
        getProfile(),
        getCurrentWeight(),
        getCurrentVo2(),
        getWeightHistory(),
        getVo2History(),
      ]);

    if (athlete) {
      setProfile(athlete);
    } else {
      setProfile({
        id: "profile",
        height: 0,
        gender: "male",
        birthDate: "",
        maxHeartRate: 0,
        restingHeartRate: 0,
      });
    }

    setWeight(currentWeight);
    setVo2max(currentVo2);
    setWeightHistory(weightData);
    setVo2History(vo2Data);
  }

  async function saveField(value: string) {
    if (!editingField) return;

    if (editingField === "weight") {
      await addWeight(Number(value));
      await loadData();
      setEditingField(null);
      return;
    }

    if (editingField === "vo2max") {
      await addVo2(Number(value));
      await loadData();
      setEditingField(null);
      return;
    }

    if (!profile) return;

    const updated = {
      ...profile,
      [editingField]:
        editingField === "gender" || editingField === "birthDate"
          ? value
          : Number(value),
    };

    await saveProfile(updated);
    setProfile(updated);
    setEditingField(null);
  }

  if (!profile) {
    return (
      <main className="athlete-page">
        <div className="athlete-page__content athlete-page__loading">
          <span className="athlete-loading-orb" />
          <p>Préparation de votre profil…</p>
        </div>
      </main>
    );
  }

  const gender = profile.gender === "male" ? "Homme" : "Femme";

  return (
    <main className="athlete-page">
      <div className="athlete-page__content">
        <header className="athlete-page__header">
          <button
            className="athlete-icon-button"
            type="button"
            onClick={() => navigate("/tools")}
            aria-label="Retour aux outils"
          >
            <ChevronLeft size={21} />
          </button>
          <h1>Profil</h1>
          <span className="athlete-header-mark" aria-hidden="true">
            <UserRound size={19} />
          </span>
        </header>

        <section className="athlete-section">
          <div className="athlete-section__heading">
            <h2>Informations</h2>
          </div>
          <div className="athlete-metric-grid">
            <MetricCard
              label="Taille"
              value={profile.height}
              unit="cm"
              detail="Morphologie"
              icon={<Ruler size={17} />}
              onClick={() => setEditingField("height")}
            />
            <MetricCard
              label="Poids"
              value={weight}
              unit="kg"
              detail="Mesure actuelle"
              icon={<Scale size={17} />}
              emphasis
              onClick={() => setEditingField("weight")}
            />
            <MetricCard
              label="Sexe"
              value={gender}
              detail="Profil personnel"
              icon={<UserRound size={17} />}
              onClick={() => setEditingField("gender")}
            />
            <MetricCard
              label="Naissance"
              value={profile.birthDate || "Non renseignée"}
              detail="Date de naissance"
              icon={<CalendarDays size={17} />}
              onClick={() => setEditingField("birthDate")}
            />
          </div>
        </section>

        <section className="athlete-section">
          <div className="athlete-section__heading">
            <h2>Performance</h2>
          </div>
          <div className="athlete-performance">
            <MetricCard
              label="VO₂ Max"
              value={`${vo2max}`}
              detail="Capacité aérobie"
              icon={<Zap size={17} />}
              emphasis
              onClick={() => setEditingField("vo2max")}
            />
            <MetricCard
              label="FC repos"
              value={profile.restingHeartRate}
              unit="bpm"
              detail="Fréquence au calme"
              icon={<Heart size={17} />}
              onClick={() => setEditingField("restingHeartRate")}
            />
            <MetricCard
              label="FC max"
              value={profile.maxHeartRate}
              unit="bpm"
              detail="Seuil de référence"
              icon={<Heart size={17} />}
              onClick={() => setEditingField("maxHeartRate")}
            />
          </div>
        </section>

        <section className="athlete-section athlete-section--history">
          <div className="athlete-section__heading">
            <h2>Historique</h2>
          </div>
          <div className="athlete-history-grid">
            <HistoryLink
              label="Poids"
              description="Consulter l’évolution"
              icon={<Scale size={17} />}
              onClick={() => setShowWeightHistory(true)}
            />
            <HistoryLink
              label="VO₂ Max"
              description="Consulter l’évolution"
              icon={<History size={17} />}
              onClick={() => setShowVo2History(true)}
            />
          </div>
        </section>

        <EditAthleteModal
          isOpen={editingField !== null}
          title={
            editingField
              ? {
                  height: "Taille",
                  weight: "Poids",
                  gender: "Sexe",
                  birthDate: "Date de naissance",
                  vo2max: "VO₂max",
                  maxHeartRate: "Fréquence cardiaque maximale",
                  restingHeartRate: "Fréquence cardiaque au repos",
                }[editingField]
              : ""
          }
          value={
            editingField === "weight"
              ? String(weight)
              : editingField === "vo2max"
                ? String(vo2max)
                : editingField
                  ? String(profile[editingField as keyof AthleteProfileData])
                  : ""
          }
          onClose={() => setEditingField(null)}
          onSave={saveField}
        />
        <WeightHistoryModal
          isOpen={showWeightHistory}
          history={weightHistory}
          onClose={() => setShowWeightHistory(false)}
        />
        <Vo2HistoryModal
          isOpen={showVo2History}
          history={vo2History}
          onClose={() => setShowVo2History(false)}
        />
      </div>
    </main>
  );
}
