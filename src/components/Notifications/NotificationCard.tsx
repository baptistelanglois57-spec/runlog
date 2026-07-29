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

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        border: `1px solid ${theme.colors.border}`,
        background: notification.read
          ? theme.colors.card
          : "#2A2410",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 28 }}>
          {notification.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              color: theme.colors.text,
            }}
          >
            {notification.title}
          </div>

          <div
            style={{
              marginTop: 4,
              color: theme.colors.textSecondary,
            }}
          >
            {notification.message}
          </div>

          {!hideDate && (
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#999",
              }}
            >
              {new Date(
                notification.createdAt
              ).toLocaleString("fr-FR")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}