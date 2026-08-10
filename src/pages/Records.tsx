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
  LockKeyhole,
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

import { getAveragePace, getTotalElevation } from "../utils/stats";
import PaceRecordCard from "../components/Records/PaceRecordCard";
import "./Records.css";

export default function Records() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] =
    useState(true);

  async function loadRuns() {
    const data = await getRuns();

    setRuns(data);

    setLoading(false);
  }

  useEffect(() => {
    // La synchronisation initiale doit mettre à jour l'état après le chargement Supabase.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRuns();
  }, []);

  if (loading) {
    return (
      <main className="records-page records-page--loading"
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

  const totalElevation =
    getTotalElevation(runs);

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
    <main className="records-page">
      <RecordsHeader />

      <section className="records-hero">
        <div className="records-hero__primary">
          <Route size={22} aria-hidden="true" />
          <span>Plus longue sortie</span>
          <strong>
            {longestRun
              ? `${longestRun.distance.toFixed(2)} km`
              : "--"}
          </strong>
          <small>
            {longestRun
              ? `${longestRun.name} • ${longestRun.date}`
              : "Aucune sortie"}
          </small>
        </div>

        <div className="records-hero__secondary">
          <div>
            <Gauge size={17} aria-hidden="true" />
            <span>Meilleure allure</span>
            <strong>
              {fastestRun
                ? getAveragePace(
                    fastestRun.distance,
                    fastestRun.duration
                  )
                : "--"}
            </strong>
          </div>
          <div>
            <Mountain size={17} aria-hidden="true" />
            <span>Plus gros D+</span>
            <strong>
              {highestElevation
                ? `${highestElevation.elevation} m`
                : "--"}
            </strong>
          </div>
        </div>
      </section>

    <RecordSection title="Distances" variant="list">
      <RecordCard
        icon={
          record5 ? <Trophy
            size={18}
            color={theme.colors.primary}
          /> : <LockKeyhole size={18} color={theme.colors.primary} />
        }
        title="5 km"
        value={record5 ? record5.duration : ""}
        subtitle={
          record5
            ? `${record5.name} • ${record5.date}`
            : "Effectue une sortie de 5 km"
        }
        locked={!record5}
        layout="horizontal"
      />

      <RecordCard
        icon={
          record10 ? <Trophy
            size={18}
            color={theme.colors.primary}
          /> : <LockKeyhole size={18} color={theme.colors.primary} />
        }
        title="10 km"
        value={record10 ? record10.duration : ""}
        subtitle={
          record10
            ? `${record10.name} • ${record10.date}`
            : "Effectue une sortie de 10 km"
        }
        locked={!record10}
        layout="horizontal"
      />

      <RecordCard
        icon={
          record15 ? <Trophy
            size={18}
            color={theme.colors.primary}
          /> : <LockKeyhole size={18} color={theme.colors.primary} />
        }
        title="15 km"
        value={record15 ? record15.duration : ""}
        subtitle={
          record15
            ? `${record15.name} • ${record15.date}`
            : "Effectue une sortie de 15 km"
        }
        locked={!record15}
        layout="horizontal"
      />

      <RecordCard
        icon={
          recordSemi ? <Trophy
            size={18}
            color={theme.colors.primary}
          /> : <LockKeyhole size={18} color={theme.colors.primary} />
        }
        title="Semi-marathon"
        value={recordSemi ? recordSemi.duration : ""}
        subtitle={
          recordSemi
            ? `${recordSemi.name} • ${recordSemi.date}`
            : "Effectue une sortie de 21,1 km"
        }
        locked={!recordSemi}
        layout="horizontal"
      />

      <RecordCard
        icon={
          recordMarathon ? <Trophy
            size={18}
            color={theme.colors.primary}
          /> : <LockKeyhole size={18} color={theme.colors.primary} />
        }
        title="Marathon"
        value={recordMarathon ? recordMarathon.duration : ""}
        subtitle={
          recordMarathon
            ? `${recordMarathon.name} • ${recordMarathon.date}`
            : "Effectue une sortie de 42,2 km"
        }
        locked={!recordMarathon}
        layout="horizontal"
      />
    </RecordSection>
        {/* ALLURES */}

<RecordSection title="Allures" fullWidth>
  <PaceRecordCard
    bestPace={
      fastestRun
        ? getAveragePace(
            fastestRun.distance,
            fastestRun.duration
          )
        : "--"
    }
    hr130={
      hr130
        ? getAveragePace(
            hr130.distance,
            hr130.duration
          )
        : "🔒"
    }
    hr140={
      hr140
        ? getAveragePace(
            hr140.distance,
            hr140.duration
          )
        : "🔒"
    }
    hr150={
      hr150
        ? getAveragePace(
            hr150.distance,
            hr150.duration
          )
        : "🔒"
    }
    hr160={
      hr160
        ? getAveragePace(
            hr160.distance,
            hr160.duration
          )
        : "🔒"
    }
  />
</RecordSection>

    {/* VOLUMES */}

    <RecordSection title="Volumes" variant="list">
      <RecordCard
  icon={
    <Mountain
      size={18}
      color={theme.colors.primary}
    />
  }
  title="Dénivelé total"
  value={`${totalElevation.toLocaleString("fr-FR")} m`}
  subtitle="Depuis le début"
  layout="horizontal"
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
        layout="horizontal"
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
        layout="horizontal"
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
        layout="horizontal"
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
        layout="horizontal"
      />
    </RecordSection>

    {/* COMPÉTITIONS */}

    <RecordSection title="Compétitions" variant="list">
      <RecordCard
        icon={
          bestPosition ? (
            <Trophy
              size={18}
              color={theme.colors.primary}
            />
          ) : (
            <LockKeyhole
              size={18}
              color={theme.colors.primary}
            />
          )
        }
        title="Meilleure place"
        value={
          bestPosition
            ? `${bestPosition.position}ᵉ`
            : ""
        }
        subtitle={
          bestPosition
            ? bestPosition.name
            : "Aucune compétition"
        }
        locked={!bestPosition}
        layout="horizontal"
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
        layout="horizontal"
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
        layout="horizontal"
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
        layout="horizontal"
      />
    </RecordSection>
  </main>
);
}
