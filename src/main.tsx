import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App";
import "./styles/typography.css";
import { theme } from "./styles/theme";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/runlog-sw.js", { scope: "/" }).catch((error) => {
      console.warn("Le service worker RunLog n'a pas pu être enregistré.", error);
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: theme.colors.card,
            color: theme.colors.text,
            border: `1px solid ${theme.colors.borderStrong}`,
            borderRadius: "14px",
            fontWeight: 600,
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
