"use client";

import { useRef } from "react";
import { Flame } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/gsapSetup";
import { useReducedMotion } from "@/hooks/useReducedMotion";

registerGsapPlugins();

const rowA = ["CHARCOAL", "GRILLED", "CHARCOAL", "GRILLED"];
const rowB = ["GOLDEN BUREK", "BALKAN SOUL", "GOLDEN BUREK", "BALKAN SOUL"];

function Track({ words, reverse = false }) {
  const doubled = [...words, ...words, ...words, ...words];
  return (
    <div
      className={`flex w-max items-center gap-8 md:gap-14 ${reverse ? "flex-row-reverse" : ""}`}
      data-kinetic-track
      data-direction={reverse ? "right" : "left"}
    >
      {doubled.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-flex items-center gap-8 md:gap-14">
          <span className="font-display text-[clamp(1.15rem,3.2vw,3rem)] tracking-[0.06em] whitespace-nowrap text-smoke">
            {word}
          </span>
          <Flame
            size={18}
            className="text-copper shrink-0"
            aria-hidden
            strokeWidth={1.5}
          />
        </span>
      ))}
    </div>
  );
}

export default function KineticStrip() {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const tracks = gsap.utils.toArray("[data-kinetic-track]");
      const tweens = tracks.map((track) => {
        const dir = track.getAttribute("data-direction");
        const distance = track.scrollWidth / 4;
        return gsap.to(track, {
          x: dir === "left" ? -distance : distance,
          duration: 28,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x) => {
              const n = parseFloat(x);
              if (dir === "left") return ((n % -distance) + -distance) % -distance || 0;
              return n % distance;
            }),
          },
        });
      });

      let last = 0;
      const st = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = Math.abs(self.getVelocity());
            const boost = gsap.utils.clamp(1, 2.4, 1 + v / 1800);
            tweens.forEach((t) => t.timeScale(boost));
            last = boost;
          },
          onLeave: () => tweens.forEach((t) => t.timeScale(1)),
          onLeaveBack: () => tweens.forEach((t) => t.timeScale(1)),
        },
      });

      void last;
      void st;
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-y border-smoke/10 bg-oat/40 py-5 md:py-7"
      aria-label="Kinetic typography strip"
    >
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-copper/25" aria-hidden />
      <div className="flex flex-col gap-3 md:gap-4 overflow-hidden">
        <div className="overflow-hidden">
          <Track words={rowA} />
        </div>
        <div className="overflow-hidden">
          <Track words={rowB} reverse />
        </div>
      </div>
      <p className="sr-only">Charcoal, grilled, golden burek, Balkan soul.</p>
    </section>
  );
}
