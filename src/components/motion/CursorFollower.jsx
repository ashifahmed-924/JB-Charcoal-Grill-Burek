"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsapSetup";
import { isFinePointer } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Contextual cursor label for desktop pointer devices.
 * Set data-cursor="DRAG" | "VIEW" | "EXPLORE" on interactive elements.
 */
export default function CursorFollower() {
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const reduced = useReducedMotion();
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduced || !isFinePointer()) return undefined;

    const dot = dotRef.current;
    if (!dot) return undefined;

    const xTo = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e) => {
      const el = e.target.closest("[data-cursor]");
      if (!el) return;
      setLabel(el.getAttribute("data-cursor") || "");
      setActive(true);
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.25 });
    };

    const onOut = (e) => {
      const el = e.target.closest("[data-cursor]");
      if (!el) return;
      const related = e.relatedTarget;
      if (related && el.contains(related)) return;
      setActive(false);
      setLabel("");
      gsap.to(dot, { scale: 0.35, opacity: 0, duration: 0.25 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden lg:flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-copper/50 bg-smoke/80 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-porcelain opacity-0 scale-[0.35] mix-blend-difference"
      aria-hidden
      data-active={active}
    >
      <span ref={labelRef}>{label}</span>
    </div>
  );
}
