import { theme } from "../../styles/theme";
import type { Notification } from "../../types/Notification";

type Props = {
  notification: Notification;
};

export default function NotificationCard({
  notification,
}: Props) {
  const hideDate = [
    "biggest_week",
    "biggest_month",
    "biggest_year",
  ].includes(notification.entityId);

  const date = new Date(
    notification.createdAt
  ).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 16,
        border: `1px solid ${
          notification.read
            ? theme.colors.border
            : theme.colors.primary
        }`,
        background: notification.read
          ? theme.colors.card
          : "rgba(212,175,55,.08)",
        transition: "0.2s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "rgba(212,175,55,.10)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            fontSize: 22,
          }}
        >
          {notification.icon}
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div
              style={{
                color: theme.colors.text,
                fontWeight: 700,
                fontSize: 16,
                lineHeight: 1.2,
              }}
            >
              {notification.title}
            </div>

            {!hideDate && (
              <span
                style={{
                  color:
                    theme.colors.textSecondary,
                  fontSize: 12,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {date}
              </span>
            )}
          </div>

          <div
            style={{
              marginTop: 6,
              color:
                theme.colors.textSecondary,
              fontSize: 14,
              lineHeight: 1.35,
            }}
          >
            {notification.message}
          </div>
        </div>
      </div>
    </div>
  );
}