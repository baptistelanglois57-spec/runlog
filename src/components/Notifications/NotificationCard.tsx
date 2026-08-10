import { Bell, Pin, Trophy } from "lucide-react";

import type { Notification } from "../../types/Notification";
import { parseRecordNotificationPayload } from "../../utils/recordNotificationPayload";

type Props = {
  notification: Notification;
};

export default function NotificationCard({ notification }: Props) {
  const recordPayload =
    notification.type === "record"
      ? parseRecordNotificationPayload(notification.message)
      : null;
  const NotificationIcon =
    notification.type === "record"
      ? Trophy
      : notification.type === "note"
        ? Pin
        : Bell;
  const date = new Date(notification.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });

  return (
    <article
      className={`notification-card${notification.read ? "" : " notification-card--unread"}`}
    >
      <span className="notification-card__icon" aria-hidden="true">
        <NotificationIcon size={19} strokeWidth={2.2} />
      </span>

      <div className="notification-card__content">
        <div className="notification-card__topline">
          <div className="notification-card__title">
            {!notification.read && (
              <span className="notification-card__unread-dot" />
            )}
            <strong>{notification.title}</strong>
          </div>
          <time>{date}</time>
        </div>

        {recordPayload ? (
          <div className="notification-card__record">
            <div className="notification-card__record-main">
              <span>{recordPayload.label}</span>
              <strong>{recordPayload.value}</strong>
            </div>

            {recordPayload.previousValue ? (
              <div className="notification-card__comparison">
                <div>
                  <span>Ancien record</span>
                  <strong>{recordPayload.previousValue}</strong>
                </div>
                {recordPayload.progression && (
                  <div>
                    <span>Progression</span>
                    <strong className="notification-card__progression">
                      {recordPayload.progression}
                    </strong>
                  </div>
                )}
              </div>
            ) : (
              <div className="notification-card__first-record">
                Premier record
              </div>
            )}
          </div>
        ) : (
          <p>{notification.message}</p>
        )}
      </div>
    </article>
  );
}
