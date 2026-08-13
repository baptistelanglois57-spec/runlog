import { ArrowLeft, Bell } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

import type { Notification } from "../../types/Notification";
import NotificationCard from "./NotificationCard";
import PushNotificationToggle from "./PushNotificationToggle";
import "./Notifications.css";

type Props = {
  open: boolean;
  notifications: Notification[];
  onClose: () => void;
  onReadAll: () => void;
  onOpenNotification?: (notification: Notification) => void;
  onDeleteNotification: (notification: Notification) => void;
};

export default function NotificationModal({
  open,
  notifications,
  onClose,
  onReadAll,
  onOpenNotification,
  onDeleteNotification,
}: Props) {
  const [openSwipeId, setOpenSwipeId] = useState<string | null>(null);
  if (!open) return null;

  return createPortal(
    <div className="notifications-sheet" role="presentation" onClick={onClose}>
      <section
        className="notifications-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => {
          const target = event.target as Element;
          const touchedNotificationId = target
            .closest<HTMLElement>(".notification-swipe")
            ?.dataset.notificationId;
          if (openSwipeId && touchedNotificationId !== openSwipeId) {
            setOpenSwipeId(null);
          }
        }}
      >
        <header className="notifications-sheet__header">
          <button type="button" aria-label="Retour" onClick={onClose}>
            <ArrowLeft size={20} strokeWidth={2.4} />
          </button>
          <h2>Notifications</h2>
        </header>

        <div className="notifications-sheet__scroll">
          {notifications.length === 0 ? (
            <div className="notifications-sheet__empty">
              <span aria-hidden="true">
                <Bell size={24} />
              </span>
              <h3>Aucune notification</h3>
              <p>Vos nouvelles notifications apparaîtront ici.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onOpen={onOpenNotification}
                onDelete={(item) => {
                  setOpenSwipeId(null);
                  onDeleteNotification(item);
                }}
                isSwipeOpen={openSwipeId === notification.id}
                onSwipeOpen={() => setOpenSwipeId(notification.id)}
                onSwipeClose={() => setOpenSwipeId(null)}
              />
            ))
          )}
        </div>

        <footer className="notifications-sheet__footer">
          <PushNotificationToggle />
          <button
            className="notifications-sheet__read-all"
            type="button"
            onClick={onReadAll}
          >
            Tout marquer comme lu
          </button>
        </footer>
      </section>
    </div>,
    document.body
  );
}
