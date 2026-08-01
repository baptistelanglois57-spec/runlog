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
            width: 6px;
          }

          .notification-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .notification-scroll::-webkit-scrollbar-thumb {
            background: #0B0B0B;
            border-radius: 999px;
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
          background: "rgba(0,0,0,.82)",
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          zIndex: 9999,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 520,
            height: "100dvh",

            background: theme.colors.card,

            display: "flex",
            flexDirection: "column",

            boxSizing: "border-box",

            padding: `
              calc(18px + env(safe-area-inset-top))
              16px
              calc(18px + env(safe-area-inset-bottom))
            `,
          }}
        >
          {/* HEADER */}

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <button
              onClick={onClose}
              aria-label="Retour"
              style={{
                position: "absolute",
                left: 0,

                width: 40,
                height: 40,

                border: `1px solid ${theme.colors.border}`,
                borderRadius: 12,

                background: theme.colors.background,

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                cursor: "pointer",
              }}
            >
              <ArrowLeft
                size={20}
                color={theme.colors.primary}
                strokeWidth={2.4}
              />
            </button>

            <h2
              style={{
                margin: 0,

                display: "flex",
                alignItems: "center",
                gap: 10,

                color: theme.colors.primary,

                fontSize: 22,
                fontWeight: 800,
              }}
            >
              🔔 Notifications
            </h2>
          </div>

          {/* LISTE */}

          <div
            className="notification-scroll"
            style={{
              flex: 1,

              overflowY: "auto",

              display: "flex",
              flexDirection: "column",

              gap: 10,

              paddingBottom: 12,
            }}
          >
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>

          {/* BOUTON */}

          <button
            onClick={onReadAll}
            style={{
              marginTop: 16,

              width: "100%",

              padding: 16,

              border: "none",

              borderRadius: 16,

              background: theme.colors.primary,

              color: "#000",

              fontSize: 17,
              fontWeight: 800,

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