import { theme } from "../../styles/theme";
import type { Notification } from "../../types/Notification";
import NotificationCard from "./NotificationCard";
import { ArrowLeft } from "lucide-react";

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

  return (
    <>
      <style>
  {`
    .notification-scroll::-webkit-scrollbar {
      width: 8px;
    }

    .notification-scroll::-webkit-scrollbar-track {
      background: transparent;
    }

    .notification-scroll::-webkit-scrollbar-thumb {
      background: #0B0B0B;
      border-radius: 999px;
      border: 2px solid transparent;
    }

    .notification-scroll::-webkit-scrollbar-thumb:hover {
      background: #1A1A1A;
    }

    .notification-scroll {
      scrollbar-width: thin;
      scrollbar-color: #0B0B0B transparent;
    }
  `}
</style>

      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.75)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "95%",
            maxWidth: 500,
            background: theme.colors.card,
            borderRadius: 20,
            padding: 24,
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <button
              onClick={onClose}
              aria-label="Retour"
              style={{
                position: "absolute",
                left: 0,
                width: 42,
                height: 42,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: 12,
                background: theme.colors.card,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              <ArrowLeft
                size={22}
                color={theme.colors.primary}
                strokeWidth={2.5}
              />
            </button>

            <h2
              style={{
                margin: 0,
                color: theme.colors.primary,
                fontSize: 26,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>🔔</span>
              <span>Notifications</span>
            </h2>
          </div>

          <div
            className="notification-scroll"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              overflowY: "auto",
              flex: 1,
              paddingRight: 8,
            }}
          >
            {notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
              />
            ))}
          </div>

          <button
            onClick={onReadAll}
            style={{
              marginTop: 20,
              width: "100%",
              padding: 12,
              border: "none",
              borderRadius: 12,
              background: theme.colors.primary,
              color: "#000",
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>
    </>
  );
}