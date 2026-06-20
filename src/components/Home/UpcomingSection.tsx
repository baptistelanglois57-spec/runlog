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
        maxWidth: "650px",
        margin: "30px auto",
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(280px,1fr))",
        gap: "20px",
      }}
    >
      <NextTrainingCard
  title={nextTraining?.name}
  date={
    nextTraining
      ? formatDate(nextTraining.date)
      : undefined
  }
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