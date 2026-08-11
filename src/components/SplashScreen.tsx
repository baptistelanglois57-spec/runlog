import { useEffect, useState } from "react";
import "./SplashScreen.css";

type SplashScreenProps = {
  onComplete: () => void;
};

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const displayDuration = reducedMotion ? 420 : 820;
    const fadeDuration = reducedMotion ? 120 : 260;

    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, displayDuration);
    const completeTimer = window.setTimeout(
      onComplete,
      displayDuration + fadeDuration
    );

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`splash-screen${isExiting ? " splash-screen--exiting" : ""}`}
      role="status"
      aria-label="Chargement de RunLog"
    >
      <div className="splash-screen__identity">
        <span className="splash-screen__logo-wrap" aria-hidden="true">
          <img
            className="splash-screen__logo"
            src="/favicon.png"
            alt=""
            width="112"
            height="112"
          />
        </span>
      </div>
    </div>
  );
}
