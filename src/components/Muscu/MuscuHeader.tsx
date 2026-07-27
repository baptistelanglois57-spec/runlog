import PageCard from "../Layout/PageCard";
import { theme } from "../../styles/theme";

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
            fontSize: "38px",
            color: theme.colors.primary,
          }}
        >
          Musculation
        </h1>

       

        <div
          style={{
            marginTop: "22px",
            fontSize: "44px",
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
            fontSize: "17px",
          }}
        >
          Séances enregistrées
        </div>
      </div>
    </PageCard>
  );
}