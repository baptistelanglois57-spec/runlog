import { theme } from "../../styles/theme";

import type { EventType } from "../../types/Event";

import {
  Dumbbell,
  PersonStanding,
} from "lucide-react";

type Props = {
  title?: string;
  date?: string;
  type?: EventType;
};

export default function NextTrainingCard({
  title = "Aucun entraînement",
  date = "Non planifié",
  type = "training",
}: Props) {
  const Icon =
    type === "gym"
      ? Dumbbell
      : PersonStanding;

  return (
    <div className="home-upcoming-card">
      {/* Header */}

      <div className="home-upcoming-card__header">
        <div className="home-upcoming-card__label">
          <div className="home-upcoming-card__icon">
            <Icon
              size={18}
              color={theme.colors.primary}
              strokeWidth={2.3}
            />
          </div>

          <span className="home-upcoming-card__type">
            Séance
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
