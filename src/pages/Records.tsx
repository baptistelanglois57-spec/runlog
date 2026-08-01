import { useEffect, useState } from "react";

import { getRuns } from "../services/runService";

import type { Run } from "../types/Run";

import { theme } from "../styles/theme";

import RecordsHeader from "../components/Records/RecordsHeader";
import RecordSection from "../components/Records/RecordSection";
import RecordCard from "../components/Records/RecordCard";

import {
  Route,
  Gauge,
  Mountain,
  Flame,
  Trophy,
} from "lucide-react";

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
  const [loading, setLoading] =
    useState(true);

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
          background:
            theme.colors.background,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: theme.colors.text,
          fontSize: 22,
        }}
      >
        Chargement...
      </main>
    );
  }

  const longestRun =
    getLongestRun(runs);

  const fastestRun =
    getFastestAveragePace(runs);

  const highestElevation =
    getHighestElevation(runs);

  const hr130 =
    getBestPaceHeartRateZone(
      runs,
      0,
      130
    );

  const hr140 =
    getBestPaceHeartRateZone(
      runs,
      131,
      140
    );

  const hr150 =
    getBestPaceHeartRateZone(
      runs,
      141,
      150
    );

  const hr160 =
    getBestPaceHeartRateZone(
      runs,
      151,
      160
    );

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

  const wins = getWins(runs);

  const podiums =
    getPodiums(runs);

  const top10 = getTop10(runs);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          theme.colors.background,
        padding: "24px 18px 120px",
      }}
    >
      <RecordsHeader />

      {/* À LA UNE */}

      <RecordSection
  title="À la une"
>
              <RecordCard
        icon={
          <Route
            size={20}
            color={theme.colors.primary}
          />
        }
        title="Plus longue sortie"
        value={
          longestRun
            ? `${longestRun.distance.toFixed(
                2
              )} km`
            : "--"
        }
        subtitle={
          longestRun
            ? `${longestRun.name} • ${longestRun.date}`
            : "Aucune sortie"
        }
      />

      <RecordCard
        icon={
          <Gauge
            size={20}
            color={theme.colors.primary}
          />
        }
        title="Meilleure allure"
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
      />

      <RecordCard
        icon={
          <Mountain
            size={20}
            color={theme.colors.primary}
          />
        }
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

    {/* DISTANCES */}

    <RecordSection
  title="Distances"
>
      <RecordCard
        icon={
          <Trophy
            size={18}
            color={theme.colors.primary}
          />
        }
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
        icon={
          <Trophy
            size={18}
            color={theme.colors.primary}
          />
        }
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
        icon={
          <Trophy
            size={18}
            color={theme.colors.primary}
          />
        }
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
        icon={
          <Trophy
            size={18}
            color={theme.colors.primary}
          />
        }
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
        icon={
          <Trophy
            size={18}
            color={theme.colors.primary}
          />
        }
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
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(5,minmax(0,1fr))",
      gap: 14,
      width: "100%",
      gridColumn: "1 / -1",
    }}
  >
    <RecordCard
      icon={
        <Gauge
          size={18}
          color={theme.colors.primary}
        />
      }
      title="Meilleure"
      value={
        fastestRun
          ? getAveragePace(
              fastestRun.distance,
              fastestRun.duration
            )
          : "--"
      }
    />

    <RecordCard
      icon="❤️"
      title="≤130"
      value={
        hr130
          ? getAveragePace(
              hr130.distance,
              hr130.duration
            )
          : "🔒"
      }
    />

    <RecordCard
      icon="💚"
      title="131-140"
      value={
        hr140
          ? getAveragePace(
              hr140.distance,
              hr140.duration
            )
          : "🔒"
      }
    />

    <RecordCard
      icon="💛"
      title="141-150"
      value={
        hr150
          ? getAveragePace(
              hr150.distance,
              hr150.duration
            )
          : "🔒"
      }
    />

    <RecordCard
      icon="🧡"
      title="151-160"
      value={
        hr160
          ? getAveragePace(
              hr160.distance,
              hr160.duration
            )
          : "🔒"
      }
    />
  </div>
</RecordSection>

    {/* VOLUMES */}

    <RecordSection
  title="Volumes"
>
      <RecordCard
  icon={
    <Mountain
      size={18}
      color={theme.colors.primary}
    />
  }
  title="Dénivelé total"
  value="--"
  subtitle="Depuis le début"
/>
      <RecordCard
        icon={
          <Flame
            size={18}
            color={theme.colors.primary}
          />
        }
        title="Plus grosse semaine"
        value={
          biggestWeek
            ? `${biggestWeek.total.toFixed(
                2
              )} km`
            : "--"
        }
        subtitle={
          biggestWeek
            ? biggestWeek.date
            : "Aucune donnée"
        }
      />

      <RecordCard
        icon={
          <Flame
            size={18}
            color={theme.colors.primary}
          />
        }
        title="Plus gros mois"
        value={
          biggestMonth
            ? `${biggestMonth.total.toFixed(
                2
              )} km`
            : "--"
        }
        subtitle={
          biggestMonth
            ? biggestMonth.date
            : "Aucune donnée"
        }
      />

      <RecordCard
        icon={
          <Flame
            size={18}
            color={theme.colors.primary}
          />
        }
        title="Plus grosse année"
        value={
          biggestYear
            ? `${biggestYear.total.toFixed(
                2
              )} km`
            : "--"
        }
        subtitle={
          biggestYear
            ? biggestYear.date
            : "Aucune donnée"
        }
      />

      <RecordCard
        icon={
          <Route
            size={18}
            color={theme.colors.primary}
          />
        }
        title="Sorties sur un mois"
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
>
      <RecordCard
        icon={
          <Trophy
            size={18}
            color={theme.colors.primary}
          />
        }
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
        icon={
          <Trophy
            size={18}
            color={theme.colors.primary}
          />
        }
        title="Victoires"
        value={`${wins}`}
        subtitle="1ʳᵉ place"
      />

      <RecordCard
        icon={
          <Trophy
            size={18}
            color={theme.colors.primary}
          />
        }
        title="Podiums"
        value={`${podiums}`}
        subtitle="Top 3"
      />

      <RecordCard
        icon={
          <Trophy
            size={18}
            color={theme.colors.primary}
          />
        }
        title="Top 10"
        value={`${top10}`}
        subtitle="Top 10"
      />
    </RecordSection>
  </main>
);
}