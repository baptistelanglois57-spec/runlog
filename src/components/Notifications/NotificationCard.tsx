import {
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Bell,
  CalendarClock,
  CalendarDays,
  Flag,
  Pin,
  Trash2,
  Trophy,
} from "lucide-react";

import type { Notification } from "../../types/Notification";
import { parseGymRecordNotificationPayload } from "../../utils/gymRecordNotificationPayload";
import { parseRecordNotificationPayload } from "../../utils/recordNotificationPayload";

const SWIPE_WIDTH = 108;
const SWIPE_THRESHOLD = 52;
const DIRECTION_THRESHOLD = 10;

type Props = {
  notification: Notification;
  onOpen?: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
  isSwipeOpen: boolean;
  onSwipeOpen: () => void;
  onSwipeClose: () => void;
};

type GestureDirection = "horizontal" | "vertical" | null;

export default function NotificationCard({
  notification,
  onOpen,
  onDelete,
  isSwipeOpen,
  onSwipeOpen,
  onSwipeClose,
}: Props) {
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const gesture = useRef({
    startX: 0,
    startY: 0,
    startOffset: 0,
    direction: null as GestureDirection,
    moved: false,
  });
  const recordPayload = notification.type === "record"
    ? parseRecordNotificationPayload(notification.message)
    : null;
  const gymRecordPayload = notification.type === "gym_record"
    ? parseGymRecordNotificationPayload(notification.message)
    : null;
  const NotificationIcon = notification.type === "record" || notification.type === "gym_record"
    ? Trophy
    : notification.type === "note"
      ? Pin
      : notification.type === "training"
        ? CalendarClock
        : notification.type === "race"
          ? Flag
          : notification.type === "daily_schedule"
            ? CalendarDays
            : Bell;
  const date = new Date(notification.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
  const isNavigable = notification.entity === "event-reminder"
    || notification.entity === "daily-schedule"
    || notification.entity === "gym-record";
  const translateX = dragOffset ?? (isSwipeOpen ? -SWIPE_WIDTH : 0);
  const cardClassName = `notification-card${gymRecordPayload ? " notification-card--gym-record" : ""}${isNavigable ? " notification-card--action" : ""}${notification.read ? "" : " notification-card--unread"}${dragOffset === null ? "" : " notification-card--dragging"}`;

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    gesture.current = {
      startX: event.clientX,
      startY: event.clientY,
      startOffset: isSwipeOpen ? -SWIPE_WIDTH : 0,
      direction: null,
      moved: false,
    };
    setDragOffset(gesture.current.startOffset);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (dragOffset === null) return;
    const deltaX = event.clientX - gesture.current.startX;
    const deltaY = event.clientY - gesture.current.startY;
    const absoluteX = Math.abs(deltaX);
    const absoluteY = Math.abs(deltaY);

    if (!gesture.current.direction && (absoluteX > DIRECTION_THRESHOLD || absoluteY > DIRECTION_THRESHOLD)) {
      gesture.current.direction = absoluteX > absoluteY * 1.15 ? "horizontal" : "vertical";
    }

    if (gesture.current.direction !== "horizontal") return;
    gesture.current.moved = true;
    const nextOffset = Math.max(-SWIPE_WIDTH, Math.min(0, gesture.current.startOffset + deltaX));
    setDragOffset(nextOffset);
  }

  function finishGesture() {
    if (dragOffset === null) return;
    const shouldOpen = gesture.current.direction === "horizontal"
      && dragOffset <= -SWIPE_THRESHOLD;
    setDragOffset(null);
    if (shouldOpen) onSwipeOpen();
    else onSwipeClose();
  }

  function handleCardClick(event: ReactMouseEvent<HTMLElement>) {
    if (gesture.current.moved) {
      event.preventDefault();
      gesture.current.moved = false;
      return;
    }
    if (isSwipeOpen) {
      onSwipeClose();
      return;
    }
    if (isNavigable) onOpen?.(notification);
  }

  const content = (
    <>
      <span className={`notification-card__icon${gymRecordPayload ? " notification-card__icon--achievement" : ""}`} aria-hidden="true">
        <NotificationIcon size={19} strokeWidth={2.2} />
      </span>

      <div className="notification-card__content">
        <div className="notification-card__topline">
          <div className="notification-card__title">
            {!notification.read && <span className="notification-card__unread-dot" />}
            <strong>{notification.title}</strong>
          </div>
          <time>{date}</time>
        </div>

        {gymRecordPayload ? (
          <div className="notification-card__record notification-card__gym-record">
            <div className="notification-card__record-main">
              <span>{gymRecordPayload.exerciseName}</span>
              <strong>{gymRecordPayload.value}</strong>
            </div>

            <div className="notification-card__comparison">
              <div>
                <span>Ancienne meilleure série</span>
                <strong>{gymRecordPayload.previousValue}</strong>
              </div>
            </div>
          </div>
        ) : recordPayload ? (
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
              <div className="notification-card__first-record">Premier record</div>
            )}
          </div>
        ) : (
          <p>{notification.message}</p>
        )}
      </div>
    </>
  );

  const gestureProps = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: finishGesture,
    onPointerCancel: finishGesture,
    onClick: handleCardClick,
  };

  return (
    <div className="notification-swipe" data-notification-id={notification.id}>
      <button
        className="notification-swipe__delete"
        type="button"
        onClick={() => onDelete(notification)}
        aria-label={`Supprimer ${notification.title}`}
      >
        <Trash2 size={18} strokeWidth={2.2} />
        <span>Supprimer</span>
      </button>

      {isNavigable ? (
        <button
          {...gestureProps}
          className={cardClassName}
          type="button"
          style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
        >
          {content}
        </button>
      ) : (
        <article
          {...gestureProps}
          className={cardClassName}
          style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
        >
          {content}
        </article>
      )}
    </div>
  );
}
