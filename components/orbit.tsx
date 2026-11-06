"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  MoveUpRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import styles from "./orbit.module.css";

type Point = { x: number; y: number; z: number };
type Controls = { rotate: (x: number, y: number) => void; reset: () => void };
const RAD = Math.PI / 180;

// Geography comes from public-domain Natural Earth polygons. The orbit is conceptual.
export function Orbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useRef<Controls | null>(null);
  const motion = useRef(true);
  const [rotating, setRotating] = useState(true);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    motion.current = rotating;
  }, [rotating]);

  useEffect(() => {
    const canvas = canvasRef.current,
      container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let disposed = false,
      visible = true,
      width = 520,
      radius = 174,
      cx = 260,
      cy = 244;
    let longitude = -15 * RAD,
      tilt = 16 * RAD,
      orbitAngle = 0.8,
      raf = 0,
      previous = 0;
    let pointer: { id: number; x: number; y: number } | null = null;
    let land: Point[] = [];
    let palette = { accent: "#83e8cc", ink: "#eeeae2", light: false };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      motion.current = false;
      setRotating(false);
    }
    const spherePoint = (lon: number, lat: number): Point => ({
      x: Math.cos(lat) * Math.sin(lon),
      y: Math.sin(lat),
      z: Math.cos(lat) * Math.cos(lon),
    });
    const project = (p: Point, rotate = true) => {
      const sin = Math.sin(rotate ? longitude : -0.28),
        cos = Math.cos(rotate ? longitude : -0.28);
      const x = p.x * cos + p.z * sin,
        z = p.z * cos - p.x * sin;
      const y = p.y * Math.cos(tilt) - z * Math.sin(tilt);
      return {
        x: cx + radius * x,
        y: cy - radius * y,
        z: p.y * Math.sin(tilt) + z * Math.cos(tilt),
      };
    };
    const graticules: Point[][] = [];
    for (let lat = -60; lat <= 60; lat += 30)
      graticules.push(
        Array.from({ length: 181 }, (_, i) =>
          spherePoint((i * 2 - 180) * RAD, lat * RAD),
        ),
      );
    for (let lon = 0; lon < 360; lon += 30)
      graticules.push(
        Array.from({ length: 91 }, (_, i) =>
          spherePoint(lon * RAD, (i * 2 - 90) * RAD),
        ),
      );
    const orbitPoint = (angle: number) =>
      project(
        {
          x: Math.cos(angle) * 1.32,
          y: Math.sin(angle) * Math.sin(0.59) * 1.32,
          z: Math.sin(angle) * Math.cos(0.59) * 1.32,
        },
        false,
      );
    const renderOrbit = (front: boolean) => {
      ctx.beginPath();
      let open = false;
      for (let i = 0; i <= 220; i++) {
        const p = orbitPoint((i / 220) * Math.PI * 2);
        const hidden = p.z < 0 && Math.hypot(p.x - cx, p.y - cy) < radius;
        if ((front ? p.z >= 0 : p.z < 0) && !hidden) {
          if (!open) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
          open = true;
        } else open = false;
      }
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = front ? 0.55 : 0.2;
      ctx.strokeStyle = palette.accent;
      ctx.setLineDash([2, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    };
    const render = () => {
      ctx.clearRect(0, 0, width, width);
      const scale = width / 520;
      const atmosphere = ctx.createRadialGradient(
        cx,
        cy,
        radius * 0.95,
        cx,
        cy,
        radius * 1.27,
      );
      atmosphere.addColorStop(0, "#62deff00");
      atmosphere.addColorStop(0.2, palette.light ? "#3d83d511" : "#58cbff28");
      atmosphere.addColorStop(0.55, palette.light ? "#794de909" : "#725bff10");
      atmosphere.addColorStop(1, "#725bff00");
      ctx.fillStyle = atmosphere;
      ctx.fillRect(0, 0, width, width);
      for (let i = 0; i < 62; i++) {
        const x = (((Math.sin(i * 127.1 + 13) * 43758.5453) % 1) + 1) % 1;
        const y = (((Math.sin(i * 311.7 + 3) * 9643.732) % 1) + 1) % 1;
        if (Math.hypot(x * width - cx, y * width - cy) < radius * 1.12)
          continue;
        ctx.fillStyle = palette.ink;
        ctx.globalAlpha = 0.12 + (i % 5) * 0.045;
        const size = (i % 3 === 0 ? 1.3 : 0.7) * scale;
        ctx.fillRect(x * width, y * width, size, size);
      }
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.39, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([2, 9]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.43, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      for (let i = 0; i < 60; i++) {
        const a = (i / 60) * Math.PI * 2,
          length = i % 5 === 0 ? 6 : 2.5;
        ctx.beginPath();
        ctx.moveTo(
          cx + Math.cos(a) * radius * 1.39,
          cy + Math.sin(a) * radius * 1.39,
        );
        ctx.lineTo(
          cx + Math.cos(a) * (radius * 1.39 + length * scale),
          cy + Math.sin(a) * (radius * 1.39 + length * scale),
        );
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      renderOrbit(false);
      const surface = ctx.createRadialGradient(
        cx - radius * 0.35,
        cy - radius * 0.45,
        0,
        cx,
        cy,
        radius,
      );
      surface.addColorStop(0, palette.light ? "#e5edf4" : "#152c43");
      surface.addColorStop(0.6, palette.light ? "#edf0f2" : "#0c1a2c");
      surface.addColorStop(1, palette.light ? "#e4e8ee" : "#080e1d");
      ctx.fillStyle = surface;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = palette.accent;
      ctx.globalAlpha = palette.light ? 0.19 : 0.16;
      ctx.lineWidth = 0.55;
      for (const line of graticules) {
        ctx.beginPath();
        let open = false;
        for (const coordinate of line) {
          const p = project(coordinate);
          if (p.z > 0) {
            if (!open) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
            open = true;
          } else open = false;
        }
        ctx.stroke();
      }
      ctx.fillStyle = palette.light ? palette.accent : palette.ink;
      for (const coordinate of land) {
        const p = project(coordinate);
        if (p.z <= 0) continue;
        ctx.fillStyle = palette.light
          ? palette.accent
          : p.x < cx - radius * 0.25
            ? "#94dfff"
            : palette.ink;
        ctx.globalAlpha = 0.24 + p.z * 0.72;
        const dot = Math.max(0.55, (0.95 + p.z * 0.5) * scale);
        ctx.beginPath();
        ctx.arc(p.x, p.y, dot, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      renderOrbit(true);
      const satellite = orbitPoint(orbitAngle);
      if (
        satellite.z >= 0 ||
        Math.hypot(satellite.x - cx, satellite.y - cy) > radius
      ) {
        for (let i = 1; i <= 16; i++) {
          const tail = orbitPoint(orbitAngle - i * 0.026);
          if (tail.z < 0 && Math.hypot(tail.x - cx, tail.y - cy) < radius)
            continue;
          ctx.globalAlpha = (1 - i / 17) * 0.48;
          ctx.fillStyle = palette.accent;
          ctx.beginPath();
          ctx.arc(tail.x, tail.y, Math.max(0.6, 1.2 * scale), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 0.14;
        ctx.beginPath();
        ctx.arc(satellite.x, satellite.y, 13 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(satellite.x, satellite.y, 7 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowColor = palette.accent;
        ctx.shadowBlur = 16 * scale;
        ctx.beginPath();
        ctx.arc(satellite.x, satellite.y, 2.5 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    };
    const updatePalette = () => {
      const element =
          container.closest("[data-theme]") || document.documentElement,
        style = getComputedStyle(element);
      palette = {
        accent: style.getPropertyValue("--accent").trim() || "#83e8cc",
        ink: style.getPropertyValue("--ink").trim() || "#eeeae2",
        light: element.getAttribute("data-theme") === "light",
      };
      render();
    };
    const resize = () => {
      width = container.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(width * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = width * 0.335;
      cx = width * 0.5;
      cy = width * 0.47;
      render();
    };
    const tick = (time: number) => {
      if (disposed) return;
      const elapsed = previous ? Math.min(time - previous, 40) : 16;
      previous = time;
      if (
        visible &&
        !document.hidden &&
        !pointer &&
        motion.current &&
        document.documentElement.dataset.effects !== "off"
      ) {
        longitude += elapsed * 0.000052;
        orbitAngle += elapsed * 0.00019;
        render();
      }
      raf = requestAnimationFrame(tick);
    };
    const rotate = (x: number, y: number) => {
      longitude += x;
      tilt = Math.max(-Math.PI * 0.36, Math.min(Math.PI * 0.36, tilt + y));
      render();
    };
    controls.current = {
      rotate,
      reset: () => {
        longitude = -15 * RAD;
        tilt = 16 * RAD;
        orbitAngle = 0.8;
        render();
      },
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
      setDragging(true);
    };
    const move = (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      rotate(
        (event.clientX - pointer.x) * 0.006,
        (event.clientY - pointer.y) * 0.004,
      );
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const up = (event: PointerEvent) => {
      if (pointer?.id !== event.pointerId) return;
      pointer = null;
      setDragging(false);
      if (canvas.hasPointerCapture(event.pointerId))
        canvas.releasePointerCapture(event.pointerId);
    };
    const motionChange = () => {
      if (reducedMotion.matches) {
        motion.current = false;
        setRotating(false);
      }
    };
    const themeObserver = new MutationObserver(updatePalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const frame = document.getElementById("theme-frame");
    if (frame)
      themeObserver.observe(frame, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    visibilityObserver.observe(container);
    reducedMotion.addEventListener("change", motionChange);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    resize();
    updatePalette();
    const abort = new AbortController();
    fetch("/globe/land-points.json", { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Globe geography unavailable");
        return response.json();
      })
      .then((data: { points: [number, number][] }) => {
        if (!disposed) {
          land = data.points.map(([lon, lat]) =>
            spherePoint(lon * RAD, lat * RAD),
          );
          render();
        }
      })
      .catch(() => {
        /* Graticule remains usable if optional geography cannot load. */
      });
    raf = requestAnimationFrame(tick);
    return () => {
      disposed = true;
      abort.abort();
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      reducedMotion.removeEventListener("change", motionChange);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      controls.current = null;
    };
  }, []);

  return (
    <div className={styles.instrument} ref={containerRef}>
      <div className={styles.aura} aria-hidden="true" />
      <div className={styles.spectralHalo} aria-hidden="true" />
      <div className={styles.opticalRing} aria-hidden="true" />
      <div className={styles.orbitBadge} aria-hidden="true">
        <span>⊕</span> A DIFFERENT PERSPECTIVE
      </div>
      <div className={styles.topline}>
        <span>
          <i /> OPEN SCIENCE, IN ORBIT
        </span>
        <MoveUpRight size={13} aria-hidden="true" />
      </div>
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${dragging ? styles.dragging : ""}`}
        role="img"
        tabIndex={0}
        aria-label="Interactive Earth illustration. Drag or use arrow keys to rotate. Space pauses rotation. This is not mission telemetry."
        onKeyDown={(event) => {
          const direction: Record<string, [number, number]> = {
            ArrowLeft: [-0.12, 0],
            ArrowRight: [0.12, 0],
            ArrowUp: [0, -0.09],
            ArrowDown: [0, 0.09],
          };
          if (direction[event.key]) {
            event.preventDefault();
            controls.current?.rotate(...direction[event.key]);
          }
          if (event.code === "Space") {
            event.preventDefault();
            setRotating((value) => !value);
          }
        }}
      />
      <div className={styles.floatingLabel} aria-hidden="true">
        <span className={styles.crosshair} />
        <div>
          <span>THE OPEN ARCHIVE</span>
          <strong>One planet. Shared questions.</strong>
        </div>
      </div>
      <div className={styles.controls}>
        <span className={styles.hint}>
          <ArrowLeftRight size={12} />{" "}
          {dragging ? "EXPLORING" : "DRAG TO EXPLORE"}
        </span>
        <div className={styles.buttons}>
          <button
            type="button"
            aria-label={
              rotating ? "Pause globe rotation" : "Resume globe rotation"
            }
            title={rotating ? "Pause rotation" : "Resume rotation"}
            onClick={() => setRotating((value) => !value)}
          >
            {rotating ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button
            type="button"
            aria-label="Reset globe view"
            title="Reset globe view"
            onClick={() => controls.current?.reset()}
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
      <span className={styles.caption}>
        Conceptual orbit · geographic illustration
      </span>
    </div>
  );
}
