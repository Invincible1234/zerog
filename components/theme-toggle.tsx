"use client";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  window.addEventListener("storage", callback);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", callback);
  };
}
const snapshot = () =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, snapshot, () => "dark");
  function toggle() {
    const next = snapshot() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    // Keep the visible frame in sync even if an outside script rewrites <html>.
    const frame = document.getElementById("theme-frame");
    if (frame) frame.dataset.theme = next;
    try {
      localStorage.setItem("zerog-theme", next);
    } catch {}
  }
  return (
    <button
      className="theme-button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Light" : "Dark"}
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
