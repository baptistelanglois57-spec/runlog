import PageCard from "../Layout/PageCard";
import HomeRunCard from "./HomeRunCard";

import type { Run } from "../../types/Run";

type Props = {
  run: Run | null;
};

export default function LastRunCard({
  run,
}: Props) {
  if (!run) {
    return (
      <PageCard>
        <div className="home-last-run__empty">
        Aucune sortie enregistrée.
        </div>
      </PageCard>
    );
  }

  return <HomeRunCard run={run} />;
}
