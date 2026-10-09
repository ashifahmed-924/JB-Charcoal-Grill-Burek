"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, Flip, registerGsapPlugins } from "@/lib/gsapSetup";
import { burekItems } from "@/data/menu";
import { showPrices } from "@/data/restaurant";
import { useReducedMotion } from "@/hooks/useReducedMotion";

registerGsapPlugins();

const labels = {
  "beef-burek": "Beef",
  "cheese-burek": "Cheese",
  "cheese-spinach-burek": "Cheese & Spinach",
  "sour-cherry-burek": "Sour Cherry",
  "apple-burek": "Apple",
};

export default function BurekFeature() {
  const [activeId, setActiveId] = useState(burekItems[0]?.id);
  const active = burekItems.find((item) => item.id === activeId) || burekItems[0];
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const nameRef = useRef(null);
  const underlineRef = useRef(null);
  const tabRefs = useRef({});
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;
      gsap.from("[data-burek-enter]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%", once: true },
      });
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  useGSAP(
    () => {
      const tab = tabRefs.current[activeId];
      const line = underlineRef.current;
      if (!tab || !line) return;
      const parent = tab.parentElement;
      const pr = parent.getBoundingClientRect();
      const tr = tab.getBoundingClientRect();
      gsap.to(line, {
        x: tr.left - pr.left,
        width: tr.width,
        duration: 0.4,
        ease: "power3.out",
      });
    },
    { dependencies: [activeId] }
  );

  const select = (id) => {
    if (id === activeId) return;
    if (reduced) {
      setActiveId(id);
      return;
    }

    const panel = panelRef.current;
    const state = panel ? Flip.getState(panel) : null;

    gsap
      .timeline()
      .to(panel, {
        clipPath: "inset(0 0 0 85%)",
        duration: 0.4,
        ease: "power2.in",
      })
      .to(
        nameRef.current,
        { y: 16, opacity: 0, duration: 0.25, ease: "power2.in" },
        0
      )
      .add(() => {
        setActiveId(id);
        requestAnimationFrame(() => {
          gsap.fromTo(
            panelRef.current,
            { clipPath: "inset(0 85% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.65, ease: "power3.out" }
          );
          gsap.fromTo(
            nameRef.current,
            { y: -16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
          );
          if (state) Flip.from(state, { duration: 0.5, ease: "power2.out" });
        });
      });
  };

  return (
    <section
      id="burek"
      ref={rootRef}
      className="section-shell relative overflow-hidden bg-porcelain"
    >
      {/* Layered paper effect */}
      <div
        className="pointer-events-none absolute inset-6 md:inset-10 border border-oat/80 bg-oat/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-10 md:inset-14 border border-copper/20 rotate-[-0.6deg]"
        aria-hidden
      />

      <div className="section-inner relative z-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-center">
          <div data-burek-enter className="relative">
            <p
              className="absolute -left-2 top-0 hidden xl:block font-display text-[0.85rem] uppercase tracking-[0.35em] text-copper writing-vertical-rl rotate-180"
              style={{ writingMode: "vertical-rl" }}
              aria-hidden
            >
              Golden Layers
            </p>

            <div
              ref={panelRef}
              className="relative ml-0 xl:ml-10 aspect-[5/4] overflow-hidden bg-oat"
              style={{ clipPath: "inset(0 0% 0 0)" }}
            >
              <Image
                key={active.id}
                src={active.image}
                alt={`${active.name} — representative imagery`}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              {/* Layered rectangular masks decoration */}
              <div className="pointer-events-none absolute inset-4 border border-white/40" />
              <div className="pointer-events-none absolute inset-8 border border-copper/30" />
            </div>
            <p className="mt-3 text-xs text-smoke/50">
              Representative pastry photography — not JB product photos.
            </p>
          </div>

          <div data-burek-enter>
            <p className="eyebrow mb-4">The Burek Reveal</p>
            <h2 className="font-display text-display-md text-smoke mb-5 md:mb-6">
              GOLDEN
              <br />
              <span className="text-copper">LAYERS.</span>
            </h2>

            <div
              className="relative flex flex-wrap gap-x-4 gap-y-2 mb-8 pb-3 border-b border-smoke/10"
              role="tablist"
              aria-label="Burek varieties"
            >
              <span
                ref={underlineRef}
                className="absolute bottom-0 left-0 h-[2px] bg-copper"
                aria-hidden
              />
              {burekItems.map((item) => {
                const selected = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    ref={(el) => {
                      tabRefs.current[item.id] = el;
                    }}
                    onClick={() => select(item.id)}
                    className={`py-2 text-sm font-semibold tracking-wide min-h-10 transition-colors ${
                      selected ? "text-smoke" : "text-smoke/40 hover:text-smoke/70"
                    }`}
                  >
                    {labels[item.id] || item.name}
                  </button>
                );
              })}
            </div>

            <div className="bg-white/70 border border-smoke/8 p-5 md:p-7">
              <div className="flex items-baseline justify-between gap-3 mb-3 overflow-hidden">
                <h3
                  ref={nameRef}
                  className="font-display text-[1.45rem] sm:text-[1.7rem] md:text-[2.2rem] text-smoke leading-none"
                >
                  {active.name}
                </h3>
                {showPrices ? (
                  <span className="text-sm font-semibold text-copper">
                    ${active.price}
                  </span>
                ) : null}
              </div>
              <p className="text-[1rem] leading-relaxed text-smoke/70">
                {active.description}
              </p>
              <p className="mt-4 text-xs text-smoke/45">
                Whole burek · Indicative Uber Eats price
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
