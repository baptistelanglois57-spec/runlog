import { useEffect, useState } from "react";

import { getRuns } from "../services/runService";

import type { Run } from "../types/Run";

import { theme } from "../styles/theme";

import RecordsHeader from "../components/Records/RecordsHeader";
import RecordSection from "../components/Records/RecordSection";
import RecordCard from "../components/Records/RecordCard";

import {
  getLongestRun,
  getFastestAveragePace,
  getHighestElevation,
  getBiggestWeek,
  getBiggestMonth,
  getBiggestYear,
  getMostRunsInMonth,
  getBestPosition,
  getWins,
  getPodiums,
  getTop10,
  getRaceRecord,
  getBestPaceHeartRateZone,
} from "../utils/records";

import { getAveragePace } from "../utils/stats";

export default function Records() {
  const [runs, setRuns] = useState<Run[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRuns();
  }, []);

  async function loadRuns() {
    const data = await getRuns();

    setRuns(data);

    setLoading(false);
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: theme.colors.background,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: theme.colors.text,
          fontSize: "22px",
        }}
      >
        Chargement...
      </main>
    );
  }

  const longestRun = getLongestRun(runs);

  const fastestRun = getFastestAveragePace(runs);

  const hr130 = getBestPaceHeartRateZone(
    runs,
    0,
    130
  );

  const hr140 = getBestPaceHeartRateZone(
    runs,
    131,
    140
  );

  const hr150 = getBestPaceHeartRateZone(
    runs,
    141,
    150
  );

  const hr160 = getBestPaceHeartRateZone(
    runs,
    151,
    160
  );

  const highestElevation =
    getHighestElevation(runs);

  const record5 =
    getRaceRecord(runs, 5);

  const record10 =
    getRaceRecord(runs, 10);

  const record15 =
    getRaceRecord(runs, 15);

  const recordSemi =
    getRaceRecord(runs, 21.097);

  const recordMarathon =
    getRaceRecord(runs, 42.195);

  const biggestWeek =
    getBiggestWeek(runs);

  const biggestMonth =
    getBiggestMonth(runs);

  const biggestYear =
    getBiggestYear(runs);

  const mostRunsMonth =
    getMostRunsInMonth(runs);

  const bestPosition =
    getBestPosition(runs);

  const wins =
    getWins(runs);

  const podiums =
    getPodiums(runs);

  const top10 =
    getTop10(runs);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          theme.colors.background,
        padding: "40px",
      }}
    >
      <RecordsHeader />

      {/* DISTANCES */}

      <RecordSection
  title="Distances"
  icon="🏃"
>
              <RecordCard
          icon="📏"
          title="Plus longue sortie"
          value={
            longestRun
              ? `${longestRun.distance.toFixed(2)} km`
              : "--"
          }
          subtitle={
            longestRun
              ? longestRun.name
              : "Aucune sortie"
          }
        />

        <RecordCard
          icon="🥇"
          title="5 km"
          value={
            record5
              ? record5.duration
              : "🔒"
          }
          subtitle={
            record5
              ? `${record5.name} • ${record5.date}`
              : "Effectue une sortie de 5 km"
          }
        />

        <RecordCard
          icon="🥇"
          title="10 km"
          value={
            record10
              ? record10.duration
              : "🔒"
          }
          subtitle={
            record10
              ? `${record10.name} • ${record10.date}`
              : "Effectue une sortie de 10 km"
          }
        />

        <RecordCard
          icon="🥇"
          title="15 km"
          value={
            record15
              ? record15.duration
              : "🔒"
          }
          subtitle={
            record15
              ? `${record15.name} • ${record15.date}`
              : "Effectue une sortie de 15 km"
          }
        />

        <RecordCard
          icon="🥇"
          title="Semi-marathon"
          value={
            recordSemi
              ? recordSemi.duration
              : "🔒"
          }
          subtitle={
            recordSemi
              ? `${recordSemi.name} • ${recordSemi.date}`
              : "Effectue une sortie de 21,1 km"
          }
        />

        <RecordCard
          icon="🥇"
          title="Marathon"
          value={
            recordMarathon
              ? recordMarathon.duration
              : "🔒"
          }
          subtitle={
            recordMarathon
              ? `${recordMarathon.name} • ${recordMarathon.date}`
              : "Effectue une sortie de 42,2 km"
          }
        />
      </RecordSection>

      {/* ALLURES */}

      <RecordSection
        title="Allures"
        icon="⚡"
      >
        <RecordCard
          icon="⚡"
          title="Allure moyenne la plus rapide"
          value={
            fastestRun
              ? getAveragePace(
                  fastestRun.distance,
                  fastestRun.duration
                )
              : "--"
          }
          subtitle={
            fastestRun
              ? fastestRun.name
              : "Aucune sortie"
          }
          details={[
           {
  icon: "❤️",
  label: "≤130 bpm",
  value: hr130
    ? getAveragePace(
        hr130.distance,
        hr130.duration
      )
    : "🔒",
},
{
  icon: "💚",
  label: "131-140 bpm",
  value: hr140
    ? getAveragePace(
        hr140.distance,
        hr140.duration
      )
    : "🔒",
},
{
  icon: "💛",
  label: "141-150 bpm",
  value: hr150
    ? getAveragePace(
        hr150.distance,
        hr150.duration
      )
    : "🔒",
},
{
  icon: "🧡",
  label: "151-160 bpm",
  value: hr160
    ? getAveragePace(
        hr160.distance,
        hr160.duration
      )
    : "🔒",
},
          ]}
        />
      </RecordSection>
            {/* DÉNIVELÉ */}

      <RecordSection
        title="Dénivelé"
        icon="⛰"
      >
        <RecordCard
          icon="⛰"
          title="Plus gros D+"
          value={
            highestElevation
              ? `${highestElevation.elevation} m`
              : "--"
          }
          subtitle={
            highestElevation
              ? highestElevation.name
              : "Aucune sortie"
          }
        />
      </RecordSection>

      {/* VOLUMES */}

      <RecordSection
        title="Volumes"
        icon="🔥"
      >
        <RecordCard
  icon="📅"
  title="Plus grosse semaine"
  value={
    biggestWeek
      ? `${biggestWeek.total.toFixed(2)} km`
      : "--"
  }
    subtitle={
    biggestWeek
      ? biggestWeek.date
      : "Aucune donnée"
  }
/>

<RecordCard
  icon="📆"
  title="Plus gros mois"
  value={
    biggestMonth
      ? `${biggestMonth.total.toFixed(2)} km`
      : "--"
  }
  subtitle={
    biggestMonth
      ? biggestMonth.date
      : "Aucune donnée"
  }
/>

<RecordCard
  icon="🗓️"
  title="Plus grosse année"
  value={
    biggestYear
      ? `${biggestYear.total.toFixed(2)} km`
      : "--"
  }
  subtitle={
    biggestYear
      ? biggestYear.date
      : "Aucune donnée"
  }
/>

        <RecordCard
          icon="🏃"
          title="Plus de sorties sur un mois"
          value={`${mostRunsMonth}`}
          subtitle={
            mostRunsMonth > 1
              ? "sorties"
              : "sortie"
          }
        />
      </RecordSection>

      {/* COMPÉTITIONS */}

      <RecordSection
  title="Compétitions"
  icon="🏁"
>
              <RecordCard
          icon="🏆"
          title="Meilleure place"
          value={
            bestPosition
              ? `${bestPosition.position}ᵉ`
              : "🔒"
          }
          subtitle={
            bestPosition
              ? bestPosition.name
              : "Aucune compétition"
          }
        />

        <RecordCard
          icon="🥇"
          title="Victoires"
          value={`${wins}`}
          subtitle="1ʳᵉ place"
        />

        <RecordCard
          icon="🥈"
          title="Podiums"
          value={`${podiums}`}
          subtitle="Top 3"
        />

        <RecordCard
          icon="🔟"
          title="Top 10"
          value={`${top10}`}
          subtitle="Top 10"
        />
      </RecordSection>
    </main>
  );
}