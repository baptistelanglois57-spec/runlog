import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  User,
} from "lucide-react";

import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";

import AthleteField from "../components/Athlete/AthleteField";
import EditAthleteModal from "../components/Athlete/EditAthleteModal";
import WeightHistoryModal from "../components/Athlete/WeightHistoryModal";
import Vo2HistoryModal from "../components/Athlete/Vo2historyModal";

import { theme } from "../styles/theme";
import { UI } from "../styles/ui";

import {
  getProfile,
  saveProfile,
  getCurrentWeight,
  getCurrentVo2,
  addWeight,
  addVo2,
  getWeightHistory,
  getVo2History,
} from "../services/athleteService";

import type { AthleteProfile } from "../types/AthleteProfile";
import type { WeightEntry } from "../types/WeightEntry";
import type { Vo2Entry } from "../types/V02Entry";

type EditableField =
  | "height"
  | "gender"
  | "birthDate"
  | "maxHeartRate"
  | "restingHeartRate"
  | "weight"
  | "vo2max";

export default function AthleteProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<AthleteProfile | null>(null);

  const [weight, setWeight] =
    useState(0);

  const [vo2max, setVo2max] =
    useState(0);

  const [editingField, setEditingField] =
    useState<EditableField | null>(null);

  const [weightHistory, setWeightHistory] =
    useState<WeightEntry[]>([]);

  const [vo2History, setVo2History] =
    useState<Vo2Entry[]>([]);

  const [showWeightHistory, setShowWeightHistory] =
    useState(false);

  const [showVo2History, setShowVo2History] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [
      athlete,
      currentWeight,
      currentVo2,
      weightData,
      vo2Data,
    ] = await Promise.all([
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

  async function saveField(
    value: string
  ) {
    if (!editingField) {
      return;
    }

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

    if (!profile) {
      return;
    }

    const updated = {
      ...profile,

      [editingField]:
        editingField === "gender" ||
        editingField === "birthDate"
          ? value
          : Number(value),
    };

    await saveProfile(updated);

    setProfile(updated);

    setEditingField(null);
  }

  if (!profile) {
    return (
      <AppContainer>
        <Section>
          Chargement...
        </Section>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Section marginTop={8}>
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <button
            onClick={() =>
              navigate("/tools")
            }
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              border: `1px solid ${theme.colors.border}`,
              background:
                theme.colors.card,
              display: "flex",
              justifyContent:
                "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <ChevronLeft
              size={22}
              color={
                theme.colors.primary
              }
            />
          </button>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <User
              size={24}
              color={
                theme.colors.primary
              }
            />

            <h1
              style={{
                margin: 0,
                color:
                  theme.colors.primary,
                fontSize:
                  UI.FONT_H1,
              }}
            >
              Fiche sportif
            </h1>
          </div>

          <div style={{ width: 44 }} />
        </div>
                {/* ===================== */}
        {/* INFORMATIONS PERSONNELLES */}
        {/* ===================== */}

        <div
          style={{
            marginBottom: 30,
          }}
        >
          <h2
            style={{
              color: theme.colors.primary,
              marginBottom: 16,
            }}
          >
            👤 Informations personnelles
          </h2>

          <AthleteField
            icon="📏"
            label="Taille"
            value={`${profile.height} cm`}
            onEdit={() =>
              setEditingField("height")
            }
          />

          <AthleteField
            icon="🚻"
            label="Sexe"
            value={
              profile.gender === "male"
                ? "Homme"
                : "Femme"
            }
            onEdit={() =>
              setEditingField("gender")
            }
          />

          <AthleteField
            icon="🎂"
            label="Date de naissance"
            value={
              profile.birthDate || "-"
            }
            onEdit={() =>
              setEditingField(
                "birthDate"
              )
            }
          />
        </div>

        {/* ===================== */}
        {/* PERFORMANCES */}
        {/* ===================== */}

        <div
          style={{
            marginBottom: 30,
          }}
        >
          <h2
            style={{
              color: theme.colors.primary,
              marginBottom: 16,
            }}
          >
            📈 Performances
          </h2>

          <AthleteField
            icon="⚖️"
            label="Poids"
            value={`${weight} kg`}
            onEdit={() =>
              setEditingField("weight")
            }
            onHistory={() =>
              setShowWeightHistory(true)
            }
          />

          <AthleteField
            icon="🫀"
            label="VO₂max"
            value={`${vo2max}`}
            onEdit={() =>
              setEditingField("vo2max")
            }
            onHistory={() =>
              setShowVo2History(true)
            }
          />
        </div>

        {/* ===================== */}
        {/* CARDIO */}
        {/* ===================== */}

        <div
          style={{
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              color: theme.colors.primary,
              marginBottom: 16,
            }}
          >
            ❤️ Cardio
          </h2>

          <AthleteField
            icon="❤️"
            label="FC maximale"
            value={`${profile.maxHeartRate} bpm`}
            onEdit={() =>
              setEditingField(
                "maxHeartRate"
              )
            }
          />

          <AthleteField
            icon="💙"
            label="FC repos"
            value={`${profile.restingHeartRate} bpm`}
            onEdit={() =>
              setEditingField(
                "restingHeartRate"
              )
            }
          />
        </div>

        <EditAthleteModal
          isOpen={
            editingField !== null
          }
          title={
            editingField
              ? {
                  height:
                    "Taille",

                  weight:
                    "Poids",

                  gender:
                    "Sexe",

                  birthDate:
                    "Date de naissance",

                  vo2max:
                    "VO₂max",

                  maxHeartRate:
                    "Fréquence cardiaque maximale",

                  restingHeartRate:
                    "Fréquence cardiaque au repos",
                }[
                  editingField
                ]
              : ""
          }
          value={
            editingField ===
            "weight"
              ? String(weight)
              : editingField ===
                "vo2max"
              ? String(vo2max)
              : editingField
              ? String(
                  profile[
                    editingField as keyof AthleteProfile
                  ]
                )
              : ""
          }
          onClose={() =>
            setEditingField(null)
          }
          onSave={saveField}
        />

        <WeightHistoryModal
          isOpen={
            showWeightHistory
          }
          history={weightHistory}
          onClose={() =>
            setShowWeightHistory(
              false
            )
          }
        />

        <Vo2HistoryModal
          isOpen={
            showVo2History
          }
          history={vo2History}
          onClose={() =>
            setShowVo2History(
              false
            )
          }
        />
      </Section>
    </AppContainer>
  );
}