import { getEvents } from "./eventService";
import { getRuns } from "./runService";
import { getGymSessions } from "./gymService";

import {
  getDisciplineData,
  type DisciplineData,
} from "../utils/discipline";

import {
  getMonthlyDiscipline,
} from "../utils/disciplineMonthly";

export interface DisciplinePageData
  extends DisciplineData {
  monthlyTraining: ReturnType<
    typeof getMonthlyDiscipline
  >;

  monthlyGym: ReturnType<
    typeof getMonthlyDiscipline
  >;

  monthlyRace: ReturnType<
    typeof getMonthlyDiscipline
  >;
}

export async function loadDiscipline(): Promise<DisciplinePageData> {
  const [events, runs, gymSessions] =
    await Promise.all([
      getEvents(),
      getRuns(),
      getGymSessions(),
    ]);

  const discipline =
    getDisciplineData(
      events,
      runs,
      gymSessions
    );

  return {
    ...discipline,

    monthlyTraining:
      getMonthlyDiscipline(
        "training",
        events,
        runs,
        gymSessions
      ),

    monthlyGym:
      getMonthlyDiscipline(
        "gym",
        events,
        runs,
        gymSessions
      ),

    monthlyRace:
      getMonthlyDiscipline(
        "race",
        events,
        runs,
        gymSessions
      ),
  };
}