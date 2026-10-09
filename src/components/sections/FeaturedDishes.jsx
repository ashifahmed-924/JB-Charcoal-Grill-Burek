"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/gsapSetup";
import { featuredDishIds, menuItems } from "@/data/menu";
import { restaurant, showPrices } from "@/data/restaurant";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isFinePointer } from "@/lib/animations";

registerGsapPlugins();

const layouts = [
  "md:col-start-1 md:row-start-1 md:rotate-[-3deg] md:translate-y-4",
  "md:col-start-2 md:row-start-1 md:rotate-[2deg] md:-translate-y-2",
  "md:col-start-3 md:row-start-1 md:rotate-[-1.5deg] md:translate-y-8",
  "md:col-start-1 md:row-start-2 md:rotate-[2.5deg] md:-translate-y-2",
  "md:col-start-2 md:row-start-2 md:rotate-[-2deg] md:translate-y-6",
  "md:col-start-3 md:row-start-2 md:rotate-[1deg] md:-translate-y-4",
];

export default function FeaturedDishes() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const dishes = featuredDishIds
    .map((id) => menuItems.find((item) => item.id === id))
    .filter(Boolean);

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const panels = gsap.utils.toArray("[data-dish-panel]");
        const dirs = [
          { x: -80, y: 40 },
          { x: 0, y: -70 },
          { x: 90, y: 30 },
          { x: -60, y: 80 },
          { x: 40, y: 90 },
          { x: 70, y: -50 },
        ];
        panels.forEach((panel, i) => {
          gsap.from(panel, {
            ...dirs[i % dirs.length],
            opacity: 0,
            rotate: (i % 2 === 0 ? -8 : 8),
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 70%",
              once: true,
            },
            delay: i * 0.07,
          });
        });

        if (isFinePointer()) {
          panels.forEach((panel) => {
            const onMove = (e) => {
              const rect = panel.getBoundingClientRect();
              const nx = (e.clientX - rect.left) / rect.width - 0.5;
              const ny = (e.clientY - rect.top) / rect.height - 0.5;
              gsap.to(panel, {
                x: nx * 10,
                y: ny * 8,
                z: 40,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto",
              });
            };
            const onLeave = () => {
              gsap.to(panel, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
            };
            panel.addEventListener("pointermove", onMove);
            panel.addEventListener("pointerleave", onLeave);
          });
        }
      });
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  return (
    <section id="favourites" ref={rootRef} className="section-shell surface-quilt overflow-hidden">
      <div className="section-inner">
        <div className="mb-10 md:mb-14 max-w-xl">
          <p className="eyebrow mb-3">Signature plates</p>
          <h2 className="font-display text-display-md text-smoke">
            FLOATING
            <br />
            FOOD PANELS.
          </h2>
          <p className="mt-3 md:mt-4 text-lead text-smoke/65 leading-relaxed">
            Favourites from the grill and the burek tray — indicative Uber Eats
            prices in AUD.
          </p>
        </div>

        {/* Desktop collage */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-6 lg:gap-8 perspective-[1200px]">
          {dishes.map((item, index) => (
            <article
              key={item.id}
              data-dish-panel
              data-cursor="VIEW"
              className={`group relative bg-white border border-smoke/10 shadow-[0_18px_40px_rgba(36,36,36,0.1)] overflow-hidden will-change-transform ${layouts[index]}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={item.image}
                  alt={`${item.name} — representative image`}
                  fill
                  sizes="33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex items-baseline justify-between gap-3">
                <div>
                  <h3 className="font-display text-[1.2rem] md:text-[1.35rem] leading-none text-smoke">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-[0.68rem] uppercase tracking-[0.14em] text-petrol">
                    {item.tag}
                  </p>
                </div>
                {showPrices ? (
                  <span className="text-sm font-semibold text-copper">${item.price}</span>
                ) : null}
              </div>
              <a
                href={restaurant.links.uberEats}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                aria-label={`Order ${item.name} on Uber Eats`}
              />
            </article>
          ))}
        </div>

        {/* Mobile swipe rail */}
        <div
          ref={trackRef}
          className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-[var(--section-pad-x)] px-[var(--section-pad-x)] scrollbar-none"
          tabIndex={0}
          role="list"
          aria-label="Featured dishes"
        >
          {dishes.map((item) => (
            <article
              key={item.id}
              role="listitem"
              className="snap-center shrink-0 w-[78vw] max-w-[20rem] bg-white border border-smoke/10 overflow-hidden"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={`${item.name} — representative image`}
                  fill
                  sizes="78vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex items-baseline justify-between">
                <h3 className="font-display text-xl text-smoke">{item.name}</h3>
                {showPrices ? (
                  <span className="text-sm font-semibold text-copper">${item.price}</span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
