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
import { isFinePointer } from "@/lib/animations";

registerGsapPlugins();

export default function Hero() {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const secondaryRef = useRef(null);
  const sealRef = useRef(null);
  const accentRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!rootRef.current) return;

      if (reducedMotion) {
        gsap.set(
          [
            "[data-hero-rule]",
            "[data-hero-main]",
            "[data-hero-secondary]",
            "[data-hero-seal]",
            "[data-hero-copy]",
            "[data-hero-cta]",
          ],
          { clearProps: "all", opacity: 1 }
        );
        return;
      }

      const headline = rootRef.current.querySelector("[data-hero-headline]");
      const split = SplitText.create(headline, {
        type: "words,lines",
        mask: "lines",
        wordsClass: "hero-word",
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-hero-rule]",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, stagger: 0.12, transformOrigin: "left center" }
      )
        .from(
          split.words,
          { yPercent: 120, duration: 0.95, stagger: 0.1 },
          "-=0.35"
        )
        .fromTo(
          "[data-hero-main]",
          {
            clipPath: "inset(38% 38% 38% 38% round 12px)",
            scale: 0.72,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            scale: 1,
            duration: 1.35,
            ease: "expo.out",
          },
          "-=0.7"
        )
        .fromTo(
          "[data-hero-secondary]",
          { x: 80, rotate: 8, opacity: 0 },
          { x: 0, rotate: -4, opacity: 1, duration: 0.95 },
          "-=0.85"
        )
        .fromTo(
          "[data-hero-seal]",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.4)" },
          "-=0.55"
        )
        .fromTo(
          "[data-hero-copy], [data-hero-cta]",
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 },
          "-=0.35"
        );

      gsap.to(sealRef.current, {
        rotation: 360,
        duration: 32,
        repeat: -1,
        ease: "none",
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to("[data-hero-main] img", {
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to("[data-hero-headline]", {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to("[data-hero-secondary]", {
          yPercent: 22,
          rotate: 2,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      if (isFinePointer()) {
        const onMove = (e) => {
          const rect = rootRef.current.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(mainRef.current, {
            x: nx * 14,
            y: ny * 10,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          });
          gsap.to(secondaryRef.current, {
            x: nx * -22,
            y: ny * -16,
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          });
          gsap.to(accentRef.current, {
            x: nx * 28,
            y: ny * 18,
            duration: 1.1,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        rootRef.current.addEventListener("pointermove", onMove);
        return () => {
          split.revert();
          rootRef.current?.removeEventListener("pointermove", onMove);
        };
      }

      return () => split.revert();
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative overflow-hidden grain surface-forge text-porcelain pt-[calc(var(--nav-height)+0.5rem)]"
      style={{ minHeight: "clamp(38rem, 92svh, 58rem)" }}
      aria-label="Hero"
    >
      {/* Decorative copper rules */}
      <div className="pointer-events-none absolute inset-x-[var(--section-pad-x)] top-[calc(var(--nav-height)+1.25rem)] z-20 flex justify-between">
        <span data-hero-rule className="h-px w-[18%] max-w-40 bg-copper origin-left" />
        <span data-hero-rule className="h-px w-[12%] max-w-28 bg-copper/60 origin-left" />
      </div>

      <div className="section-shell relative z-10 !pt-6 !pb-12 md:!pb-16">
        <div className="section-inner relative min-h-[min(78svh,48rem)]">
          {/* Central photographic installation — outer centers, inner accepts GSAP x/y */}
          <div className="absolute left-1/2 top-[8%] z-0 w-[min(92%,38rem)] md:w-[min(72%,48rem)] -translate-x-1/2 aspect-[4/5] md:aspect-[5/4]">
            <div
              ref={mainRef}
              data-hero-main
              data-cursor="VIEW"
              className="relative h-full w-full overflow-hidden will-change-transform"
            >
              <Image
                src="/images/hero-grill.webp"
                alt="Charcoal-grilled meats — representative imagery"
                fill
                priority
                sizes="(max-width: 768px) 92vw, 48rem"
                className="object-cover opacity-55"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-smoke via-smoke/55 to-smoke/25" />
              <div className="absolute inset-0 bg-gradient-to-r from-smoke/70 via-transparent to-smoke/40" />
            </div>
          </div>

          {/* Oversized crossing typography */}
          <div className="relative z-20 pt-[min(48vh,22rem)] md:pt-[min(22vh,11rem)] lg:pt-10">
            <p data-hero-copy className="eyebrow mb-4 md:mb-6 !text-copper">
              {restaurant.address.line2.split(" ")[0]} · Victoria
            </p>

            <p
              data-hero-copy
              className="font-display text-[1rem] sm:text-[1.15rem] md:text-[1.45rem] text-porcelain mb-3 md:mb-4"
            >
              JB Charcoal Grill <span className="text-copper">&amp; Burek</span>
            </p>

            <h1
              data-hero-headline
              className="font-display text-display-hero leading-[0.92] text-porcelain max-w-[12ch] sm:max-w-[14ch] break-words"
            >
              FIRE. FLAVOUR.{" "}
              <span className="text-copper">NO SHORTCUTS.</span>
            </h1>

            <div className="mt-5 md:mt-8 flex flex-col md:flex-row md:items-end gap-5 md:gap-10 max-w-2xl">
              <p
                data-hero-copy
                className="max-w-sm text-lead leading-relaxed text-oat/75"
              >
                From charcoal-grilled Balkan favourites to golden, flaky burek.
                Honest, hearty flavour on Stud Road, Dandenong.
              </p>
              <div data-hero-cta className="flex flex-wrap gap-3">
                <MagneticButton
                  href="#menu"
                  className="btn-primary shadow-[0_10px_28px_rgba(196,108,69,0.35)]"
                >
                  Explore Menu
                </MagneticButton>
                <MagneticButton
                  href={restaurant.links.uberEats}
                  external
                  className="btn-outline-light"
                >
                  Order Online
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Secondary offset image */}
          <div className="absolute right-[4%] bottom-[14%] md:bottom-[18%] z-30 w-[7.5rem] sm:w-[9.5rem] md:w-[12rem] aspect-[3/4] rotate-[-4deg]">
            <div
              ref={secondaryRef}
              data-hero-secondary
              className="relative h-full w-full overflow-hidden border-[3px] border-porcelain/80 shadow-[0_20px_50px_rgba(0,0,0,0.4)] will-change-transform"
            >
              <Image
                src="/images/hero-burek.jpg"
                alt="Golden layered pastry — representative imagery"
                fill
                priority
                sizes="200px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Copper circular emblem */}
          <div
            ref={sealRef}
            data-hero-seal
            className="absolute left-[6%] bottom-[12%] md:left-auto md:right-[22%] md:top-[18%] z-30 flex h-[5.5rem] w-[5.5rem] md:h-[7.25rem] md:w-[7.25rem] items-center justify-center rounded-full border border-copper/45 bg-smoke/90 text-center shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
            aria-hidden
          >
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)]"
            >
              <defs>
                <path
                  id="sealPath"
                  d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0"
                />
              </defs>
              <text
                fill="#C46C45"
                fontSize="9.5"
                letterSpacing="2.5"
                fontFamily="var(--font-dm-sans), sans-serif"
              >
                <textPath href="#sealPath" startOffset="0%">
                  CHARCOAL • BUREK • BALKAN •
                </textPath>
              </text>
            </svg>
            <span className="font-display text-lg md:text-xl text-porcelain">JB</span>
          </div>

          {/* Fine decorative accent */}
          <div
            ref={accentRef}
            className="pointer-events-none absolute left-[12%] top-[22%] hidden md:block"
            aria-hidden
          >
            <span className="block h-16 w-px bg-copper/50" />
            <span className="mt-2 block h-2 w-2 rounded-full bg-copper" />
          </div>
        </div>
      </div>
    </section>
  );
}
