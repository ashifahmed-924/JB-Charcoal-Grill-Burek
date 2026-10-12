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
      className="relative overflow-hidden grain surface-forge text-porcelain min-h-[32rem] sm:min-h-[36rem] md:min-h-[40rem] lg:min-h-[min(92svh,58rem)]"
      aria-label="Hero"
    >
      {/* Background image — full-bleed under content on all breakpoints;
          desktop keeps centered collage crop via inner frame */}
      <div className="absolute inset-0 z-0 lg:static lg:inset-auto">
        <div className="absolute inset-0 lg:absolute lg:left-1/2 lg:top-[calc(var(--nav-height)+2rem)] lg:h-[min(68%,36rem)] lg:w-[min(72%,48rem)] lg:-translate-x-1/2 lg:aspect-[5/4] lg:inset-auto">
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
              sizes="100vw"
              className="object-cover object-center opacity-50 sm:opacity-55 lg:opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-smoke via-smoke/65 to-smoke/35 lg:via-smoke/50 lg:to-smoke/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-smoke/75 via-smoke/30 to-smoke/50 lg:from-smoke/60 lg:via-transparent lg:to-smoke/30" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-[var(--section-pad-x)] top-[calc(var(--nav-height)+1.25rem)] z-20 hidden lg:flex justify-between">
        <span data-hero-rule className="h-px w-[18%] max-w-40 bg-copper origin-left" />
        <span data-hero-rule className="h-px w-[12%] max-w-28 bg-copper/60 origin-left" />
      </div>

      {/* Content overlaid on the image */}
      <div className="section-shell relative z-10 flex min-h-[32rem] sm:min-h-[36rem] md:min-h-[40rem] lg:min-h-[min(78svh,48rem)] flex-col justify-end !pt-[calc(var(--nav-height)+0.75rem)] !pb-8 sm:!pb-10 md:!pb-12 lg:!pt-6 lg:!pb-16">
        <div className="section-inner relative flex flex-col justify-end">
          <div className="relative z-20 lg:pt-10">
            <p data-hero-copy className="eyebrow mb-2 sm:mb-3 md:mb-4 lg:mb-6 !text-copper">
              {restaurant.address.line2.split(" ")[0]} · Victoria
            </p>

            <p
              data-hero-copy
              className="font-display text-[0.95rem] sm:text-[1.1rem] md:text-[1.35rem] text-porcelain mb-1.5 sm:mb-2 md:mb-3"
            >
              JB Charcoal Grill <span className="text-copper">&amp; Burek</span>
            </p>

            <h1
              data-hero-headline
              className="font-display text-display-hero leading-[1.02] sm:leading-[0.95] lg:leading-[0.92] text-porcelain max-w-[14ch] break-words pb-1 drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]"
            >
              FIRE. FLAVOUR.{" "}
              <span className="text-copper">NO SHORTCUTS.</span>
            </h1>

            <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 flex flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:gap-10 max-w-2xl">
              <p
                data-hero-copy
                className="max-w-sm text-lead leading-relaxed text-oat/85"
              >
                From charcoal-grilled Balkan favourites to golden, flaky burek.
                Honest, hearty flavour on Stud Road, Dandenong.
              </p>
              <div data-hero-cta className="flex flex-col gap-2.5 min-[400px]:flex-row min-[400px]:flex-wrap">
                <MagneticButton
                  href="#menu"
                  className="btn-primary shadow-[0_10px_28px_rgba(46,184,166,0.28)]"
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

          {/* Accents over the image */}
          <div className="relative z-30 mt-5 sm:mt-6 flex items-end justify-between gap-4 lg:mt-0 lg:contents">
            <div
              ref={sealRef}
              data-hero-seal
              className="relative flex h-[3.75rem] w-[3.75rem] sm:h-[4.5rem] sm:w-[4.5rem] shrink-0 items-center justify-center rounded-full border border-copper/45 bg-smoke/90 text-center shadow-[0_12px_32px_rgba(0,0,0,0.35)] lg:absolute lg:left-auto lg:right-[22%] lg:top-[18%] lg:h-[7.25rem] lg:w-[7.25rem]"
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
                  fill="#2eb8a6"
                  fontSize="9.5"
                  letterSpacing="2.5"
                  fontFamily="var(--font-dm-sans), sans-serif"
                >
                  <textPath href="#sealPath" startOffset="0%">
                    CHARCOAL • BUREK • BALKAN •
                  </textPath>
                </text>
              </svg>
              <span className="font-display text-sm sm:text-base md:text-lg lg:text-xl text-porcelain">
                JB
              </span>
            </div>

            <div className="relative w-[5rem] sm:w-[6.5rem] md:w-[8rem] lg:absolute lg:right-[4%] lg:bottom-[18%] lg:w-[12rem] aspect-[3/4] rotate-[-4deg]">
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
          </div>

          <div
            ref={accentRef}
            className="pointer-events-none absolute left-[12%] top-[22%] hidden lg:block"
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
