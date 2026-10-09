"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/gsapSetup";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { easings } from "@/lib/motionConfig";

registerGsapPlugins();

export default function AnimatedLine({
  className = "",
  vertical = false,
  delay = 0,
  color = "var(--copper)",
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.fromTo(
        ref.current,
        vertical ? { scaleY: 0 } : { scaleX: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          duration: 1,
          delay,
          ease: easings.expo,
          transformOrigin: vertical ? "center top" : "left center",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    },
    { scope: ref, dependencies: [reduced, delay, vertical] }
  );

  return (
    <span
      ref={ref}
      aria-hidden
      className={`block ${vertical ? "w-px h-full origin-top" : "h-px w-full origin-left"} ${className}`}
      style={{ background: color }}
    />
  );
}
