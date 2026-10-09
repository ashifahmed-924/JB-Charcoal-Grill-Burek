"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  SplitText,
  registerGsapPlugins,
} from "@/lib/gsapSetup";
import { useReducedMotion } from "@/hooks/useReducedMotion";

registerGsapPlugins();

export default function FireExperience() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const headline = rootRef.current.querySelector("[data-fire-headline]");
      const split = SplitText.create(headline, {
        type: "lines,words",
        mask: "lines",
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: "+=140%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          "[data-fire-main]",
          { clipPath: "inset(18% 22% 18% 22%)", scale: 1.15 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "none", duration: 1 }
        )
          .fromTo(
            "[data-fire-svg]",
            { strokeDashoffset: 1200 },
            { strokeDashoffset: 0, ease: "none", duration: 0.8 },
            0.15
          )
          .from(
            split.words,
            { yPercent: 120, opacity: 0, stagger: 0.08, ease: "none", duration: 0.6 },
            0.35
          )
          .fromTo(
            "[data-fire-overlay]",
            { y: 120, opacity: 0, rotate: 6 },
            { y: 0, opacity: 1, rotate: -3, ease: "none", duration: 0.7 },
            0.55
          );
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          "[data-fire-main]",
          { clipPath: "inset(10% 8% 10% 8%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );
        gsap.from(split.words, {
          yPercent: 100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 65%",
            once: true,
          },
        });
        gsap.from("[data-fire-overlay]", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 55%",
            once: true,
          },
        });
      });

      return () => split.revert();
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <section ref={rootRef} className="relative bg-smoke text-porcelain overflow-hidden">
      <div ref={pinRef} className="relative min-h-[min(100svh,48rem)] md:min-h-[100svh]">
        <div
          data-fire-main
          className="absolute inset-0"
          style={{ clipPath: "inset(0% 0% 0% 0%)" }}
        >
          <Image
            src="/images/grill-flames.webp"
            alt="Charcoal grill flames — representative imagery"
            fill
            sizes="100vw"
            className="object-cover opacity-55"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-smoke/40 via-smoke/55 to-smoke/85" />
        </div>

        <svg
          data-fire-svg
          className="pointer-events-none absolute inset-x-[8%] top-[28%] z-10 h-24 w-[84%] text-copper"
          viewBox="0 0 800 80"
          fill="none"
          aria-hidden
        >
          <path
            d="M0 40 C120 10, 200 70, 320 40 S520 5, 640 45 S760 60, 800 35"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="1200"
            strokeDashoffset="1200"
          />
        </svg>

        <div className="relative z-20 flex h-full min-h-[min(100svh,48rem)] md:min-h-[100svh] flex-col justify-end section-shell !pb-16 md:!pb-24">
          <div className="section-inner relative">
            <p className="eyebrow mb-4 !text-copper">Straight from the fire</p>
            <h2
              data-fire-headline
              className="font-display text-display-xl leading-[0.92] max-w-[10ch]"
            >
              THE FIRE DOES THE TALKING.
            </h2>

            <div
              data-fire-overlay
              className="absolute right-0 bottom-[-2rem] md:bottom-8 w-[9rem] md:w-[14rem] aspect-[3/4] overflow-hidden border-[3px] border-porcelain/80 shadow-[0_20px_50px_rgba(0,0,0,0.4)] rotate-[-3deg]"
            >
              <Image
                src="/images/food-closeup.webp"
                alt="Food close-up — representative imagery"
                fill
                sizes="224px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
