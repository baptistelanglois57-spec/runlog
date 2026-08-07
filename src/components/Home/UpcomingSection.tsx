import type { Event } from "../../types/Event";

import { formatDate } from "../../utils/date";

import NextTrainingCard from "./NextTrainingCard";
import NextRaceCard from "./NextRaceCard";

type Props = {
  nextTraining?: Event;
  nextRace?: Event;
};

export default function UpcomingSection({
  nextTraining,
  nextRace,
}: Props) {
  return (
    <section className="home-upcoming">
      <div className="home-upcoming__item">
        <NextTrainingCard
          title={nextTraining?.name}
          date={
            nextTraining
              ? formatDate(nextTraining.date)
              : undefined
          }
          type={nextTraining?.type}
        />
      </div>

      <div className="home-upcoming__item">
        <NextRaceCard
          title={nextRace?.name}
          date={
            nextRace
              ? formatDate(nextRace.date)
              : undefined
          }
        />
      </div>
    </section>
  );
}
