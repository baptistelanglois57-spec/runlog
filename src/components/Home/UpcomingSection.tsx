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
    <section
      style={{
       maxWidth: "760px",
width: "100%",
margin: "35px auto",
        display: "grid",
        gridTemplateColumns: "repeat(2,minmax(320px,1fr))",
        gap: "18px",
      }}
    >
      <NextTrainingCard
        title={nextTraining?.name}
        date={
          nextTraining
            ? formatDate(nextTraining.date)
            : undefined
        }
        type={nextTraining?.type}
      />

      <NextRaceCard
        title={nextRace?.name}
        date={
          nextRace
            ? formatDate(nextRace.date)
            : undefined
        }
      />
    </section>
  );
}