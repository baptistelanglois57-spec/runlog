import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Download, Gauge, Heart, Mountain, Share2, Trophy, X } from "lucide-react";

import type { Run } from "../../types/Run";
import {
  createRunShareImage,
  getRunSharePresentation,
} from "../../utils/runShare";

import "./RunShareModal.css";

type RunShareModalProps = {
  run: Run;
  onClose: () => void;
};

function canShareFile(file: File) {
  if (typeof navigator.share !== "function" || typeof navigator.canShare !== "function") {
    return false;
  }

  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

export default function RunShareModal({ run, onClose }: RunShareModalProps) {
  const data = useMemo(() => getRunSharePresentation(run), [run]);
  const [shareFile, setShareFile] = useState<File | null>(null);
  const [preparationError, setPreparationError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    let active = true;

    createRunShareImage(run)
      .then((blob) => {
        if (!active) return;
        setShareFile(
          new File([blob], `runlog-${run.date}.png`, { type: "image/png" })
        );
      })
      .catch((error: unknown) => {
        if (!active) return;
        setPreparationError(
          error instanceof Error
            ? error.message
            : "La carte de partage n'a pas pu être préparée."
        );
      });

    return () => {
      active = false;
    };
  }, [run]);

  const nativeShareAvailable = shareFile ? canShareFile(shareFile) : false;

  async function handleShare() {
    if (!shareFile) return;

    setFeedback("");

    if (nativeShareAvailable) {
      try {
        await navigator.share({
          files: [shareFile],
          title: `RunLog — ${data.activity}`,
        });
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFeedback("Le partage n'a pas pu être ouvert.");
      }
      return;
    }

    const downloadUrl = URL.createObjectURL(shareFile);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = shareFile.name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    setFeedback("Carte enregistrée.");
  }

  return createPortal(
    <div className="run-share-modal" role="presentation" onClick={onClose}>
      <section
        className="run-share-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="run-share-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="run-share-modal__header">
          <div>
            <span aria-hidden="true"><Share2 size={18} strokeWidth={2.25} /></span>
            <h2 id="run-share-title">Partager la sortie</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer">
            <X size={19} strokeWidth={2.25} />
          </button>
        </header>

        <div className="run-share-modal__scroll">
          <article className="run-share-card" aria-label="Prévisualisation de la carte de partage">
            <header className="run-share-card__brand">
              <div>
                <img src="/favicon.png" alt="" aria-hidden="true" />
                <span>RunLog</span>
              </div>
              <span>{data.activityKind}</span>
            </header>

            <section className="run-share-card__hero">
              <span>Distance</span>
              <strong>{data.distance}<small>km</small></strong>
            </section>

            <section className="run-share-card__main-metrics">
              <div>
                <span>Durée</span>
                <strong>{data.duration}</strong>
              </div>
              <div>
                <span>Allure moyenne</span>
                <strong>{data.pace}</strong>
              </div>
            </section>

            {(data.heartRate || data.elevation) && (
              <section className="run-share-card__secondary-metrics">
                {data.heartRate && (
                  <div>
                    <Heart size={16} strokeWidth={2.2} />
                    <span><small>FC moyenne</small><strong>{data.heartRate}</strong></span>
                  </div>
                )}
                {data.elevation && (
                  <div>
                    <Mountain size={16} strokeWidth={2.2} />
                    <span><small>Dénivelé +</small><strong>{data.elevation}</strong></span>
                  </div>
                )}
              </section>
            )}

            {(data.competitionName || data.ranking) && (
              <section className="run-share-card__competition">
                <Trophy size={17} strokeWidth={2.2} />
                <div>
                  <small>Compétition</small>
                  {data.competitionName && <strong>{data.competitionName}</strong>}
                </div>
                {data.ranking && <span>{data.ranking}</span>}
              </section>
            )}

            <footer className="run-share-card__footer">
              <div>
                <Gauge size={17} strokeWidth={2.2} />
                <strong>{data.activity}</strong>
              </div>
              <div className="run-share-card__footer-meta">
                <time>{data.date}</time>
                {data.surface && <span>{data.surface}</span>}
              </div>
            </footer>
          </article>
        </div>

        <footer className="run-share-modal__actions">
          {(preparationError || feedback) && (
            <p role="status" aria-live="polite">
              {preparationError || feedback}
            </p>
          )}
          <button
            type="button"
            className="run-share-modal__primary"
            disabled={!shareFile}
            onClick={handleShare}
          >
            {nativeShareAvailable ? <Share2 size={18} /> : <Download size={18} />}
            {!shareFile
              ? "Préparation…"
              : nativeShareAvailable
                ? "Partager"
                : "Enregistrer l’image"}
          </button>
        </footer>
      </section>
    </div>,
    document.body
  );
}
