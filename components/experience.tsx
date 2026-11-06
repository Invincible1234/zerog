"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function Experience() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const elements = document.querySelectorAll(".reveal-section");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    elements.forEach((el) => observer.observe(el));
    let frame = 0;
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const card = (event.target as Element).closest<HTMLElement>(
          "[data-spotlight]",
        );
        if (!card) return;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
      });
    };
    document.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      observer.disconnect();
      document.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);
  return null;
}
