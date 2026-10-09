"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/gsapSetup";
import { reviews, reviewsDisclaimer } from "@/data/reviews";
import { restaurant } from "@/data/restaurant";
import { useReducedMotion } from "@/hooks/useReducedMotion";

registerGsapPlugins();

export default function Reviews() {
  const [index, setIndex] = useState(0);
  const rootRef = useRef(null);
  const stackRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;
      const cards = gsap.utils.toArray("[data-gravity-card]");
      gsap.from(cards, {
        y: -120,
        rotate: (i) => (i % 2 === 0 ? -8 : 8),
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 72%",
          once: true,
        },
      });
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  const bringToFront = (nextIndex) => {
    if (nextIndex === index) return;
    if (reduced) {
      setIndex(nextIndex);
      return;
    }
    const cards = stackRef.current?.querySelectorAll("[data-gravity-card]");
    if (!cards) {
      setIndex(nextIndex);
      return;
    }

    const current = cards[index];
    const next = cards[nextIndex];

    gsap
      .timeline()
      .to(current, {
        y: 30,
        rotate: index % 2 === 0 ? -6 : 6,
        scale: 0.94,
        zIndex: 1,
        duration: 0.45,
        ease: "power2.inOut",
      })
      .to(
        next,
        {
          y: 0,
          rotate: 0,
          scale: 1,
          zIndex: 10,
          duration: 0.55,
          ease: "power3.out",
        },
        0.1
      )
      .add(() => setIndex(nextIndex));
  };

  const prev = () => bringToFront(index === 0 ? reviews.length - 1 : index - 1);
  const next = () => bringToFront(index === reviews.length - 1 ? 0 : index + 1);

  return (
    <section ref={rootRef} className="section-shell bg-porcelain overflow-hidden">
      <div className="section-inner">
        <div className="mb-8 md:mb-12 max-w-2xl">
          <p className="eyebrow mb-3">Around the table</p>
          <h2 className="font-display text-display-md text-smoke">
            GRAVITY
            <br />
            <span className="text-copper">CARDS.</span>
          </h2>
          <p className="mt-3 md:mt-4 text-[0.7rem] md:text-xs text-smoke/50">{reviewsDisclaimer}</p>
        </div>

        <div className="grid gap-8 md:gap-10 lg:grid-cols-[0.85fr_1.15fr] items-center">
          <div>
            <p className="font-display text-[clamp(2.75rem,10vw,8rem)] leading-none text-copper/25 select-none" aria-hidden>
              “
            </p>
            <p className="mt-2 text-[0.8rem] md:text-sm text-smoke/60 max-w-xs leading-relaxed">
              Sample layout comments only. For live guest feedback, see public
              listings.
            </p>
            <a
              href={restaurant.links.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-semibold uppercase tracking-[0.14em] text-petrol hover:text-copper"
            >
              View public reviews →
            </a>
          </div>

          <div className="relative">
            <div
              ref={stackRef}
              className="relative mx-auto h-[22rem] sm:h-[24rem] max-w-lg"
            >
              {reviews.map((review, i) => {
                const offset = (i - index + reviews.length) % reviews.length;
                const isFront = i === index;
                return (
                  <article
                    key={review.id}
                    data-gravity-card
                    className="absolute inset-x-0 top-0 rounded-[1.25rem] border border-smoke/10 bg-white p-6 sm:p-8 shadow-[0_24px_60px_rgba(36,36,36,0.12)]"
                    style={{
                      zIndex: isFront ? 10 : 5 - offset,
                      transform: isFront
                        ? "none"
                        : `translateY(${12 + offset * 10}px) rotate(${offset % 2 === 0 ? -2.5 : 2.5}deg) scale(${1 - offset * 0.03})`,
                    }}
                    aria-hidden={!isFront}
                  >
                    <blockquote>
                      <p className="font-display text-display-sm leading-[1.25] text-smoke">
                        “{review.quote}”
                      </p>
                      <footer className="mt-6 text-sm text-smoke/55">
                        <cite className="not-italic font-semibold text-smoke">
                          {review.name}
                        </cite>
                        <span className="mx-2">·</span>
                        <span>{review.context}</span>
                      </footer>
                    </blockquote>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between max-w-lg mx-auto">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-smoke/45">
                {index + 1} / {reviews.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prev}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-smoke/15 text-smoke hover:bg-oat/50"
                  aria-label="Previous review"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-smoke/15 text-smoke hover:bg-oat/50"
                  aria-label="Next review"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
