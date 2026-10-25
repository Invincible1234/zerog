"use client";
import { useEffect } from "react";
export function ThemeFrame({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const sync = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("zerog-theme");
      } catch {}
      const theme =
        saved === "light" || saved === "dark"
          ? saved
          : document.documentElement.dataset.theme || "dark";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      const frame = document.getElementById("theme-frame");
      if (frame) frame.dataset.theme = theme;
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return (
    <div id="theme-frame" className="theme-frame" suppressHydrationWarning>
      {children}
    </div>
  );
}
