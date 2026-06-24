export type CoachRole = "user" | "assistant";

export type CoachMessage = {
  id: string;
  role: CoachRole;
  content: string;
  createdAt: string;
};

export type CoachContext = {
  athlete: {
    name: string;
  };

  runs: any[];

  events: any[];

  stats: {
    totalRuns: number;
    totalDistance: number;

    longestRun: any;
    fastestRun: any;
    highestElevation: any;

    biggestWeek: number;
    biggestMonth: number;
    biggestYear: number;

    bestRacePosition: any;
  };

  upcoming: {
    nextTraining: any;
    nextRace: any;
  };
};