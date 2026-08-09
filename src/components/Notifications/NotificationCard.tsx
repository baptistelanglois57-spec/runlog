import type { Notification } from "../../types/Notification";

type Props = {
  notification: Notification;
};

export default function NotificationCard({ notification }: Props) {
  const hideDate = ["biggest_week", "biggest_month", "biggest_year"].includes(
    notification.entityId
  );
  const date = new Date(notification.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });

  return (
    <article
      className={`notification-card${notification.read ? "" : " notification-card--unread"}`}
    >
      <span className="notification-card__icon" aria-hidden="true">
        {notification.icon}
      </span>

      <div className="notification-card__content">
        <div className="notification-card__topline">
          <strong>{notification.title}</strong>
          {!hideDate && <time>{date}</time>}
        </div>
        <p>{notification.message}</p>
      </div>
    </article>
  );
}
