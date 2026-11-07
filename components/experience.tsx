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
    const resetDepth = (card: HTMLElement) => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    };
    const onPointer = (event: PointerEvent) => {
      if (
        event.pointerType !== "mouse" ||
        document.documentElement.dataset.effects === "off" ||
        reduced.matches
      )
        return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const card = (event.target as Element).closest<HTMLElement>(
          "[data-spotlight]",
        );
        if (!card) return;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
        if (card.hasAttribute("data-depth")) {
          card.style.setProperty(
            "--tilt-x",
            `${(-(event.clientY - bounds.top - bounds.height / 2) / bounds.height) * 4}deg`,
          );
          card.style.setProperty(
            "--tilt-y",
            `${((event.clientX - bounds.left - bounds.width / 2) / bounds.width) * 4}deg`,
          );
        }
      });
    };
    const onLeave = (event: PointerEvent) => {
      const card = (event.target as Element).closest<HTMLElement>(
        "[data-depth]",
      );
      if (
        card &&
        (!(event.relatedTarget instanceof Node) ||
          !card.contains(event.relatedTarget))
      )
        resetDepth(card);
    };
    document.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerout", onLeave, { passive: true });
    return () => {
      observer.disconnect();
      document.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerout", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);
  return null;
}
