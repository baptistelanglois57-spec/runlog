import type { Event } from "../../types/Event";

import { formatDate } from "../../utils/date";

import NextTrainingCard from "./NextTrainingCard";
import NextRaceCard from "./NextRaceCard";

import { UI } from "../../styles/ui";
import { value } from "../../styles/responsive";

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
        width: "100%",

        maxWidth: value(
          UI.PAGE_MAX_WIDTH,
          "760px"
        ),

        margin: "0 auto",

        display: "grid",

        gridTemplateColumns: "repeat(2, 1fr)",

        gap: 12,

        alignItems: "stretch",

        boxSizing: "border-box",
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