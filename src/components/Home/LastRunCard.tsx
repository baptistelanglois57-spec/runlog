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
        Aucune sortie enregistrée.
      </PageCard>
    );
  }

  return <HomeRunCard run={run} />;
}