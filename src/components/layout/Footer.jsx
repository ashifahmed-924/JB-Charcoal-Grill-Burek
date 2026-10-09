"use client";

import { useRef } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  SplitText,
  registerGsapPlugins,
} from "@/lib/gsapSetup";
import { restaurant } from "@/data/restaurant";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import AnimatedLine from "@/components/motion/AnimatedLine";

registerGsapPlugins();

function SocialIcon({ id }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
  };

  switch (id) {
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.026 2.096 15.635 2 14.118 2 10.931 2 9 3.99 9 7.3V9.5H6.5v4H9V22h5v-8.5z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.92a3.12 3.12 0 1 1 0-6.24 3.12 3.12 0 0 1 0 6.24zM17.76 6.96a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0z" />
          <path d="M12 2.4c-2.6 0-2.93.01-3.96.06-2.66.12-4.06 1.53-4.18 4.18-.05 1.03-.06 1.36-.06 3.96s.01 2.93.06 3.96c.12 2.64 1.52 4.06 4.18 4.18 1.03.05 1.36.06 3.96.06s2.93-.01 3.96-.06c2.67-.12 4.06-1.54 4.18-4.18.05-1.03.06-1.36.06-3.96s-.01-2.93-.06-3.96c-.12-2.65-1.51-4.06-4.18-4.18C14.93 2.41 14.6 2.4 12 2.4zm0 1.68c2.55 0 2.85.01 3.86.06 1.99.09 3.07 1.2 3.16 3.16.05 1 .06 1.3.06 3.86s-.01 2.85-.06 3.86c-.09 1.95-1.17 3.07-3.16 3.16-1.01.05-1.31.06-3.86.06s-2.85-.01-3.86-.06c-2-.09-3.07-1.21-3.16-3.16-.05-1-.06-1.3-.06-3.86s.01-2.85.06-3.86c.09-1.96 1.17-3.07 3.16-3.16 1.01-.05 1.31-.06 3.86-.06z" />
        </svg>
      );
    case "twitter":
      return (
        <svg {...common}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.57V8.43L15.82 12l-6.07 3.57z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const mark = rootRef.current.querySelector("[data-footer-mark]");
      const split = SplitText.create(mark, {
        type: "chars",
        mask: "chars",
      });

      gsap.from(split.chars, {
        yPercent: 120,
        duration: 0.8,
        stagger: 0.02,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          once: true,
        },
      });

      gsap.from("[data-footer-link]", {
        y: 16,
        opacity: 0,
        duration: 0.55,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });

      return () => split.revert();
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={rootRef} className="relative overflow-hidden bg-porcelain border-t border-smoke/10">
      <div className="section-shell !py-12 md:!py-20">
        <div className="section-inner">
          <p
            data-footer-mark
            className="font-display text-display-xl leading-[0.9] text-smoke overflow-hidden"
          >
            JB CHARCOAL
            <br />
            <span className="text-copper">GRILL &amp; BUREK</span>
          </p>

          <div className="mt-6 mb-8 md:mt-8 md:mb-10 max-w-full">
            <AnimatedLine />
          </div>

          {/* Mobile: 2 columns · Desktop: 4-column editorial grid */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:gap-x-8 md:gap-y-10 lg:grid-cols-4 lg:gap-x-10">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-copper mb-3 md:mb-4">
                Visit
              </p>
              <p className="hidden sm:block text-[0.85rem] md:text-sm text-smoke/65 leading-relaxed mb-3">
                Balkan-inspired charcoal grill and whole burek on Stud Road,
                Dandenong.
              </p>
              <address
                data-footer-link
                className="not-italic text-[0.78rem] sm:text-[0.85rem] md:text-sm text-smoke/70 space-y-1"
              >
                <p>{restaurant.address.line1}</p>
                <p>{restaurant.address.line2}</p>
                <p>
                  <a
                    href={`tel:${restaurant.phone.tel}`}
                    className="hover:text-copper transition-colors"
                  >
                    {restaurant.phone.display}
                  </a>
                </p>
              </address>
            </div>

            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-copper mb-3 md:mb-4">
                Explore
              </p>
              <ul className="space-y-2 md:space-y-3">
                {restaurant.nav.map((item) => (
                  <li key={item.href} data-footer-link>
                    <a
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 text-[0.88rem] md:text-[1rem] text-smoke/80 hover:text-copper transition-colors"
                    >
                      {item.label}
                      <ArrowUpRight
                        size={13}
                        className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                        aria-hidden
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-copper mb-3 md:mb-4">
                Order
              </p>
              <div className="flex flex-col gap-2.5 md:gap-3">
                <a
                  data-footer-link
                  href={restaurant.links.uberEats}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[0.88rem] md:text-[1rem] text-smoke/80 hover:text-copper"
                >
                  Uber Eats
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </a>
                <a
                  data-footer-link
                  href={restaurant.links.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[0.88rem] md:text-[1rem] text-smoke/80 hover:text-copper"
                >
                  Directions
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </a>
              </div>
            </div>

            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-copper mb-3 md:mb-4">
                Follow
              </p>
              <ul className="flex flex-wrap gap-2" data-footer-link>
                {restaurant.social.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full border border-smoke/15 text-smoke/70 transition-colors hover:border-copper hover:text-copper hover:bg-copper/5"
                    >
                      <SocialIcon id={item.id} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 md:mt-12 flex flex-col gap-4 border-t border-smoke/10 pt-5 md:pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.7rem] md:text-xs text-smoke/45">
              © 2026 {restaurant.name}. All rights reserved.
            </p>
            <button
              type="button"
              onClick={toTop}
              className="inline-flex items-center gap-2 text-[0.7rem] md:text-xs font-semibold uppercase tracking-[0.16em] text-smoke/70 hover:text-copper transition-colors"
              aria-label="Back to top"
            >
              Back to top
              <ArrowUp size={14} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
