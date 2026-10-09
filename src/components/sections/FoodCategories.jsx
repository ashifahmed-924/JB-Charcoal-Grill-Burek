"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, Flip, registerGsapPlugins } from "@/lib/gsapSetup";
import { foodCategories } from "@/data/menu";
import { useReducedMotion } from "@/hooks/useReducedMotion";

registerGsapPlugins();

const categories = foodCategories.map((c) => ({
  ...c,
  title:
    c.id === "grill"
      ? "Charcoal Grill"
      : c.id === "burek"
        ? "Traditional Burek"
        : "Drinks & More",
}));

export default function FoodCategories() {
  const rootRef = useRef(null);
  const imageRef = useRef(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const current = categories[active];

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;
      gsap.from("[data-cat-label]", {
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%", once: true },
      });
      gsap.from("[data-cat-stage]", {
        clipPath: "inset(12% 8% 12% 8%)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 72%", once: true },
      });
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  const select = (index) => {
    if (index === active) return;
    const stage = imageRef.current;
    if (!stage || reduced) {
      setActive(index);
      return;
    }

    const state = Flip.getState(stage);
    const outgoing = stage.querySelector("[data-cat-img]");

    gsap
      .timeline()
      .to(outgoing, {
        clipPath: "inset(0 0 0 100%)",
        rotate: -3,
        scale: 1.04,
        duration: 0.45,
        ease: "power2.in",
      })
      .add(() => {
        setActive(index);
        requestAnimationFrame(() => {
          const incoming = imageRef.current?.querySelector("[data-cat-img]");
          if (!incoming) return;
          gsap.fromTo(
            incoming,
            { clipPath: "inset(0 100% 0 0)", rotate: 4, scale: 1.08 },
            {
              clipPath: "inset(0 0% 0 0)",
              rotate: 0,
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
            }
          );
          Flip.from(state, { duration: 0.5, ease: "power2.out" });
        });
      });
  };

  return (
    <section id="flavours" ref={rootRef} className="section-shell bg-porcelain">
      <div className="section-inner">
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">The Archive</p>
            <h2 className="font-display text-display-md text-smoke">
              ROTATING
              <br />
              <span className="text-copper">FOOD ARCHIVE.</span>
            </h2>
          </div>
          <p className="max-w-xs text-[0.85rem] md:text-sm leading-relaxed text-smoke/65 md:text-right">
            Hover or select a category. One stage. Three stories.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 items-stretch">
          <div
            className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0"
            role="tablist"
            aria-label="Food categories"
          >
            {categories.map((cat, index) => {
              const selected = index === active;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  data-cat-label
                  onClick={() => select(index)}
                  onMouseEnter={() => {
                    if (window.matchMedia("(hover: hover)").matches) select(index);
                  }}
                  className={`group relative min-w-[11rem] lg:min-w-0 text-left border-b py-4 md:py-5 transition-colors ${
                    selected ? "border-copper" : "border-smoke/15 hover:border-smoke/40"
                  }`}
                >
                  <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-copper">
                    {cat.number}
                  </span>
                  <span
                    className={`mt-1 block font-display text-[1.25rem] sm:text-[1.45rem] md:text-[2rem] leading-none transition-colors ${
                      selected ? "text-smoke" : "text-smoke/45"
                    }`}
                  >
                    {cat.title}
                  </span>
                  <span
                    className={`mt-2 block text-[0.8rem] md:text-sm leading-relaxed transition-opacity ${
                      selected ? "opacity-100 text-smoke/65" : "opacity-0 lg:opacity-40 text-smoke/50"
                    }`}
                  >
                    {cat.description}
                  </span>
                </button>
              );
            })}
          </div>

          <a
            href={current.href}
            ref={imageRef}
            data-cat-stage
            data-cursor="EXPLORE"
            className="relative min-h-[18rem] sm:min-h-[22rem] md:min-h-[28rem] overflow-hidden bg-smoke"
            aria-label={`Explore ${current.title}`}
          >
            <div data-cat-img className="absolute inset-0" key={current.id}>
              <Image
                src={current.image}
                alt={`${current.title} — representative imagery`}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-smoke/70 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 md:p-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.62rem] sm:text-[0.7rem] uppercase tracking-[0.2em] text-oat/80">
                  Now viewing
                </p>
                <p className="font-display text-[1.45rem] sm:text-[1.85rem] md:text-[2.6rem] text-porcelain leading-none mt-1">
                  {current.title}
                </p>
              </div>
              <span className="font-display text-2xl sm:text-3xl md:text-4xl text-copper/80">
                {current.number}
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
