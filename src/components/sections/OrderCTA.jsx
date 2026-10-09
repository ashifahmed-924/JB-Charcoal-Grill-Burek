"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  SplitText,
  registerGsapPlugins,
} from "@/lib/gsapSetup";
import MagneticButton from "@/components/motion/MagneticButton";
import { restaurant } from "@/data/restaurant";
import { useReducedMotion } from "@/hooks/useReducedMotion";

registerGsapPlugins();

export default function OrderCTA() {
  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const headline = rootRef.current.querySelector("[data-cta-headline]");
      const split = SplitText.create(headline, {
        type: "lines",
        mask: "lines",
      });

      gsap.fromTo(
        "[data-cta-bg]",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        "[data-cta-photo]",
        { clipPath: "circle(8% at 70% 40%)" },
        {
          clipPath: "circle(75% at 70% 45%)",
          duration: 1.35,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            once: true,
          },
        }
      );

      gsap.from(split.lines, {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 68%",
          once: true,
        },
      });

      gsap.from("[data-cta-actions]", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 60%",
          once: true,
        },
      });

      gsap.to(ringRef.current, {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: "none",
      });

      return () => split.revert();
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden">
      <div data-cta-bg className="absolute inset-0 bg-smoke" />

      <div className="section-shell relative z-10 !py-16 md:!py-20">
        <div className="section-inner relative min-h-[22rem] md:min-h-[26rem] flex flex-col justify-center">
          <div
            data-cta-photo
            className="pointer-events-none absolute right-[-5%] top-1/2 hidden md:block w-[48%] max-w-[28rem] aspect-square -translate-y-1/2"
            style={{ clipPath: "circle(75% at 70% 45%)" }}
          >
            <Image
              src="/images/cta-meal.webp"
              alt="Grilled meal — representative imagery"
              fill
              sizes="28rem"
              className="object-cover"
            />
          </div>

          <div
            ref={ringRef}
            className="pointer-events-none absolute right-[8%] top-[12%] hidden md:flex h-28 w-28 items-center justify-center rounded-full border border-copper/40"
            aria-hidden
          >
            <span className="font-display text-copper text-sm tracking-[0.2em]">
              JB
            </span>
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="eyebrow mb-4 !text-copper">Final frame</p>
            <h2
              data-cta-headline
              className="font-display text-display-lg leading-[0.94] text-porcelain mb-6 md:mb-8"
            >
              YOUR NEXT
              <br />
              GOOD MEAL
              <br />
              STARTS HERE.
            </h2>

            <div data-cta-actions className="flex flex-wrap gap-3">
              <MagneticButton
                href={restaurant.links.uberEats}
                external
                className="btn-primary"
              >
                Order on Uber Eats
              </MagneticButton>
              <MagneticButton
                href={restaurant.links.directions}
                external
                className="btn-outline-light"
              >
                Get Directions
              </MagneticButton>
            </div>
          </div>

          {/* Mobile image */}
          <div className="relative mt-10 aspect-[16/10] overflow-hidden md:hidden rounded-sm">
            <Image
              src="/images/cta-meal.webp"
              alt="Grilled meal — representative imagery"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
