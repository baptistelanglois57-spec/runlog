import PageCard from "../Layout/PageCard";
import { theme } from "../../styles/theme";
import { Typography, UI } from "../../styles/ui";

type Props = {
  totalSessions: number;
};

export default function MuscuHeader({
  totalSessions,
}: Props) {
  return (
    <PageCard maxWidth="100%">
      <div
        style={{
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: Typography.pageTitle,
            color: theme.colors.text,
          }}
        >
          Musculation
        </h1>

       

        <div
          style={{
            marginTop: "22px",
            fontSize: UI.FONT_NUMBER,
            fontWeight: 700,
            color: theme.colors.text,
          }}
        >
          {totalSessions}
        </div>

        <div
          style={{
            marginTop: "8px",
            color: theme.colors.textSecondary,
            fontSize: UI.FONT_SMALL,
          }}
        >
          Séances enregistrées
        </div>
      </div>
    </PageCard>
  );
}
