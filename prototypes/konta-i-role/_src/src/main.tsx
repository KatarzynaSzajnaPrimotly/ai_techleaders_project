import { createRoot } from "react-dom/client";
import "./engine/comments.js";
import "./engine/prototype.js";
import "./styles.css";
import { App } from "./App";
import { resolve, visit, type ScreenId } from "./store";

// Navigation from the review bar goes through the same access rules as the product (silent redirects, G06).
// Registered before the engine's own click handler, so it can stop it.
document.addEventListener(
  "click",
  (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(".screen-nav a");
    if (!link) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    visit(link.getAttribute("href")!.slice(1) as ScreenId);
  },
  true,
);

// A hash typed by hand bypasses the click handler; redirect after landing.
document.addEventListener("prototype:screen-change", (event) => {
  const id = (event as CustomEvent<ScreenId>).detail;
  const target = resolve(id);
  if (target !== id) visit(target);
});

createRoot(document.getElementById("root")!).render(<App />);
