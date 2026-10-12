"use client";

import { useRef } from "react";
import Image from "next/image";
import { Phone, Navigation, ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  SplitText,
  registerGsapPlugins,
} from "@/lib/gsapSetup";
import { restaurant } from "@/data/restaurant";
import MagneticButton from "@/components/motion/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";

registerGsapPlugins();

export default function VisitUs() {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const city = rootRef.current.querySelector("[data-city]");
      const split = SplitText.create(city, {
        type: "chars",
        charsClass: "city-char",
      });

      gsap.fromTo(
        split.chars,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        "[data-map-panel]",
        { clipPath: "inset(20% 25% 20% 25%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 68%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        "[data-route-line]",
        { strokeDashoffset: 600 },
        {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 60%",
            once: true,
          },
        }
      );

      gsap.from("[data-visit-detail]", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 55%",
          once: true,
        },
      });

      return () => split.revert();
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <section id="visit" ref={rootRef} className="section-shell relative overflow-hidden bg-smoke text-porcelain">
      <div className="section-inner relative z-10">
        <p className="eyebrow mb-4 !text-copper">The destination</p>

        <h2
          data-city
          className="font-display text-display-city leading-[0.88] tracking-tight overflow-hidden"
        >
          DANDENONG
        </h2>

        <div className="mt-6 sm:mt-8 grid gap-8 md:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 items-start">
          <div className="min-w-0">
            <svg
              className="mb-6 sm:mb-8 h-10 sm:h-12 w-full max-w-none lg:max-w-md text-copper"
              viewBox="0 0 400 48"
              fill="none"
              aria-hidden
            >
              <path
                data-route-line
                d="M0 24 H80 L110 8 L150 40 L190 16 L240 32 L290 12 L340 28 H400"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="600"
                strokeDashoffset="600"
              />
            </svg>

            <address className="not-italic space-y-5 sm:space-y-6 w-full">
              <div data-visit-detail className="w-full">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-copper mb-2">
                  Address
                </p>
                <p className="font-display text-[1.2rem] sm:text-[1.5rem] md:text-[1.9rem] leading-tight break-words">
                  {restaurant.address.line1}
                  <br />
                  {restaurant.address.line2}
                </p>
              </div>

              <div data-visit-detail className="w-full">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-copper mb-2">
                  Phone
                </p>
                <a
                  href={`tel:${restaurant.phone.tel}`}
                  className="text-lg sm:text-xl text-oat hover:text-copper transition-colors"
                >
                  {restaurant.phone.display}
                </a>
              </div>

              <div data-visit-detail className="w-full">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-copper mb-3">
                  Hours
                </p>
                <ul className="space-y-1.5 text-sm w-full max-w-none lg:max-w-sm">
                  {restaurant.hours.map((row) => (
                    <li
                      key={row.day}
                      className="flex justify-between gap-3 border-b border-porcelain/10 py-1.5"
                    >
                      <span className="text-oat/80 shrink-0">{row.day}</span>
                      <span className="text-oat/55 text-right">
                        {row.closed ? "Closed" : `${row.open} – ${row.close}`}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-oat/40">{restaurant.hoursNote}</p>
              </div>

              <div data-visit-detail className="flex flex-wrap gap-3 pt-2">
                <MagneticButton
                  href={`tel:${restaurant.phone.tel}`}
                  className="btn-primary"
                  ariaLabel="Call the restaurant"
                >
                  <Phone size={16} aria-hidden />
                  Call
                </MagneticButton>
                <MagneticButton
                  href={restaurant.links.directions}
                  external
                  className="btn-outline-light group"
                  ariaLabel="Get directions"
                >
                  <Navigation size={16} aria-hidden />
                  Directions
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </MagneticButton>
              </div>
            </address>
          </div>

          <a
            href={restaurant.links.maps}
            target="_blank"
            rel="noopener noreferrer"
            data-map-panel
            data-cursor="EXPLORE"
            className="group relative block aspect-[5/4] sm:aspect-[16/11] lg:aspect-[5/4] overflow-hidden bg-surface-d"
            aria-label="Open location in Google Maps"
            style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          >
            <Image
              src="/images/map-preview.webp"
              alt="Map atmosphere preview for Dandenong location"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-smoke/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
              <span className="text-sm font-semibold text-porcelain">
                Stud Road · VIC 3175
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-copper px-3.5 py-2 text-[0.7rem] sm:text-xs font-semibold uppercase tracking-[0.12em] text-white">
                Open map
                <ArrowUpRight size={14} aria-hidden />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
