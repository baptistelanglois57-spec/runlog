import { ArrowLeft, Bell } from "lucide-react";
import { createPortal } from "react-dom";

import type { Notification } from "../../types/Notification";
import NotificationCard from "./NotificationCard";
import "./Notifications.css";

type Props = {
  open: boolean;
  notifications: Notification[];
  onClose: () => void;
  onReadAll: () => void;
};

export default function NotificationModal({
  open,
  notifications,
  onClose,
  onReadAll,
}: Props) {
  if (!open) return null;

  return createPortal(
    <div className="notifications-sheet" role="presentation" onClick={onClose}>
      <section
        className="notifications-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        onClick={(event) => event.stopPropagation()}
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
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </div>

        <button
          className="notifications-sheet__read-all"
          type="button"
          onClick={onReadAll}
        >
          Tout marquer comme lu
        </button>
      </section>
    </div>,
    document.body
  );
}
