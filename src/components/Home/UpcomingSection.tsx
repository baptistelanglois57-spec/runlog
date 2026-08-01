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
        maxWidth: value(UI.PAGE_MAX_WIDTH, "760px"),
        margin: "0 auto",

        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",

        gap: value(10, 12),

        alignItems: "stretch",

        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          minWidth: 0,
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
      </div>

      <div
        style={{
          width: "100%",
          minWidth: 0,
        }}
      >
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