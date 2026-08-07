import { theme } from "../../styles/theme";

import {
  Trophy,
} from "lucide-react";

type Props = {
  title?: string;
  date?: string;
};

export default function NextRaceCard({
  title = "Aucune compétition",
  date = "Non planifiée",
}: Props) {
  return (
    <div className="home-upcoming-card home-upcoming-card--race">
      {/* Header */}

      <div className="home-upcoming-card__header">
        <div className="home-upcoming-card__label">
          <div className="home-upcoming-card__icon">
            <Trophy
              size={18}
              color={theme.colors.primary}
              strokeWidth={2.3}
            />
          </div>

          <span className="home-upcoming-card__type">
            Course
          </span>
        </div>

        <div className="home-upcoming-card__date">
          

          {date}
        </div>
      </div>

      {/* Contenu */}

      <div className="home-upcoming-card__content">
        <div className="home-upcoming-card__name">
          {title}
        </div>
      </div>
    </div>
  );
}
