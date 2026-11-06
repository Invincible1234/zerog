"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

function subscribeEffects(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-effects"],
  });
  return () => observer.disconnect();
}
const effectsSnapshot = () =>
  document.documentElement.dataset.effects !== "off";

export function EffectsToggle() {
  const enabled = useSyncExternalStore(
    subscribeEffects,
    effectsSnapshot,
    () => true,
  );
  const [systemReduced, setSystemReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setSystemReduced(media.matches);
      let saved = "on";
      try {
        saved = localStorage.getItem("zerog-effects") || "on";
      } catch {}
      document.documentElement.dataset.effects =
        media.matches || saved === "off" ? "off" : "on";
    };
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  function toggle() {
    const next = enabled ? "off" : "on";
    document.documentElement.dataset.effects = next;
    try {
      localStorage.setItem("zerog-effects", next);
    } catch {}
  }
  return (
    <button
      className="effects-toggle"
      onClick={toggle}
      disabled={systemReduced}
      aria-pressed={enabled && !systemReduced}
      aria-label={
        systemReduced
          ? "Visual effects disabled by reduced motion preference"
          : enabled
            ? "Pause visual effects"
            : "Resume visual effects"
      }
      title={
        systemReduced
          ? "Your system prefers reduced motion"
          : enabled
            ? "Pause background effects"
            : "Resume background effects"
      }
    >
      <Sparkles size={15} />
      <span>FX</span>
      <i aria-hidden="true" />
    </button>
  );
}

export function CinematicBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0,
      height = 0,
      frame = 0,
      lastDraw = 0,
      light = false,
      enabled = true;
    let pointerX = 0,
      pointerY = 0,
      easedX = 0,
      easedY = 0;
    const seed = (index: number) => {
      const value = Math.sin(index * 127.1 + 31.7) * 43758.5453;
      return value - Math.floor(value);
    };
    const stars = Array.from({ length: 100 }, (_, i) => ({
      x: seed(i),
      y: seed(i + 200),
      size: 0.4 + seed(i + 500) * 1.05,
      depth: 0.25 + seed(i + 800) * 0.75,
    }));
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const count = width < 650 ? 42 : stars.length;
      for (let i = 0; i < count; i++) {
        const star = stars[i];
        const drift =
          enabled && !media.matches ? Math.sin(time / 11000 + i) * 1.8 : 0;
        const x = star.x * width + easedX * star.depth,
          y = star.y * height + easedY * star.depth + drift;
        context.fillStyle = light
          ? "#567b8d"
          : i % 5 === 0
            ? "#a3b4ff"
            : "#c6f5ff";
        context.globalAlpha = light ? 0.18 : 0.16 + star.depth * 0.33;
        context.beginPath();
        context.arc(x, y, star.size, 0, Math.PI * 2);
        context.fill();
        if (i % 23 === 0) {
          context.globalAlpha *= 0.45;
          context.fillRect(x - 3, y - 0.35, 6, 0.7);
          context.fillRect(x - 0.35, y - 3, 0.7, 6);
        }
      }
      context.globalAlpha = 1;
    };
    const refresh = () => {
      light = document.documentElement.dataset.theme === "light";
      enabled =
        document.documentElement.dataset.effects !== "off" && !media.matches;
      if (!enabled) {
        easedX = 0;
        easedY = 0;
      }
      draw(0);
      cancelAnimationFrame(frame);
      if (enabled && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const tick = (time: number) => {
      if (!enabled || document.hidden) return;
      if (time - lastDraw >= 1000 / 28) {
        easedX += (pointerX - easedX) * 0.045;
        easedY += (pointerY - easedY) * 0.045;
        draw(time);
        lastDraw = time;
      }
      frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(0);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        pointerX = (event.clientX - width / 2) * 0.018;
        pointerY = (event.clientY - height / 2) * 0.018;
      }
    };
    const observer = new MutationObserver(refresh);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-effects"],
    });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", refresh);
    media.addEventListener("change", refresh);
    resize();
    refresh();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", refresh);
      media.removeEventListener("change", refresh);
    };
  }, []);
  return (
    <div
      className="cosmic-backdrop"
      data-home={pathname === "/"}
      aria-hidden="true"
    >
      <div className="aurora aurora-blue" />
      <div className="aurora aurora-violet" />
      <div className="cosmic-grid" />
      <canvas ref={canvasRef} />
      <div className="cosmic-vignette" />
    </div>
  );
}
