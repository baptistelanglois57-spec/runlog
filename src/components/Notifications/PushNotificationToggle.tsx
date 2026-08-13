import { useEffect, useState } from "react";
import { BellRing, CheckCircle2 } from "lucide-react";

import {
  enablePushNotifications,
  getPushActivationState,
  type PushActivationState,
} from "../../services/pushSubscriptionService";

export default function PushNotificationToggle() {
  const [status, setStatus] = useState<PushActivationState | "checking">("checking");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    getPushActivationState()
      .then((nextStatus) => {
        if (active) setStatus(nextStatus);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setStatus("subscription-missing");
        setFeedback(error instanceof Error ? error.message : "L'abonnement Push n'a pas pu être vérifié.");
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "unsupported" || status === "checking") {
    return null;
  }

  async function handleEnable() {
    setLoading(true);
    setFeedback("");
    try {
      await enablePushNotifications();
      setStatus("active");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Les alertes n'ont pas pu être activées.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="notifications-sheet__push">
      {status === "active" ? (
        <p className="notifications-sheet__push-status">
          <CheckCircle2 size={15} />
          Alertes activées
        </p>
      ) : status === "permission-denied" ? (
        <p>Les alertes sont bloquées dans les réglages de l’appareil.</p>
      ) : (
        <button type="button" onClick={handleEnable} disabled={loading}>
          <BellRing size={16} />
          {loading
            ? "Activation…"
            : status === "subscription-missing"
              ? "Finaliser l’activation"
              : "Activer les alertes"}
        </button>
      )}
      {feedback && <p role="status">{feedback}</p>}
    </div>
  );
}
