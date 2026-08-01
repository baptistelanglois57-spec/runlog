import PageCard from "../Layout/PageCard";
import RunCard from "../History/RunCard";

import { theme } from "../../styles/theme";
import { UI } from "../../styles/ui";

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
        <h2
          style={{
            margin: 0,
            marginBottom: 18,
            textAlign: "center",
            fontSize: UI.FONT_H2,
            color: theme.colors.text,
          }}
        >
          Dernière sortie
        </h2>

        <p
          style={{
            margin: 0,
            textAlign: "center",
            color: theme.colors.textSecondary,
          }}
        >
          Aucune sortie enregistrée.
        </p>
      </PageCard>
    );
  }

  return (
    <>
      <h2
        style={{
          textAlign: "center",
          marginBottom: 16,
          color: theme.colors.text,
          fontSize: UI.FONT_H2,
        }}
      >
        Dernière sortie
      </h2>

      <RunCard
        run={run}
        showActions={false}
      />
    </>
  );
}