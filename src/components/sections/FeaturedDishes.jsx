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
  "lg:col-start-1 lg:row-start-1 lg:rotate-[-3deg] lg:translate-y-4",
  "lg:col-start-2 lg:row-start-1 lg:rotate-[2deg] lg:-translate-y-2",
  "lg:col-start-3 lg:row-start-1 lg:rotate-[-1.5deg] lg:translate-y-8",
  "lg:col-start-1 lg:row-start-2 lg:rotate-[2.5deg] lg:-translate-y-2",
  "lg:col-start-2 lg:row-start-2 lg:rotate-[-2deg] lg:translate-y-6",
  "lg:col-start-3 lg:row-start-2 lg:rotate-[1deg] lg:-translate-y-4",
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

      mm.add("(min-width: 1024px)", () => {
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
          <h2 className="font-display text-display-md text-porcelain">
            FLOATING
            <br />
            FOOD PANELS.
          </h2>
          <p className="mt-3 md:mt-4 text-lead text-porcelain/65 leading-relaxed">
            Favourites from the grill and the burek tray — indicative Uber Eats
            prices in AUD.
          </p>
        </div>

        {/* Desktop collage */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 perspective-[1200px]">
          {dishes.map((item, index) => (
            <article
              key={item.id}
              data-dish-panel
              data-cursor="VIEW"
              className={`group relative bg-surface-card border border-porcelain/10 shadow-[0_18px_40px_rgba(36,36,36,0.1)] overflow-hidden will-change-transform ${layouts[index]}`}
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
                  <h3 className="font-display text-[1.35rem] leading-none text-porcelain">
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

        {/* Phone + tablet swipe rail */}
        <div
          ref={trackRef}
          className="lg:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-[var(--section-pad-x)] px-[var(--section-pad-x)] scrollbar-none"
          tabIndex={0}
          role="list"
          aria-label="Featured dishes"
        >
          {dishes.map((item) => (
            <article
              key={item.id}
              role="listitem"
              className="relative snap-center shrink-0 w-[min(78vw,19rem)] sm:w-[min(42vw,18rem)] bg-surface-card border border-porcelain/10 overflow-hidden"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={`${item.name} — representative image`}
                  fill
                  sizes="(max-width: 640px) 78vw, 42vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-lg sm:text-xl text-porcelain leading-tight">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-petrol">
                    {item.tag}
                  </p>
                </div>
                {showPrices ? (
                  <span className="shrink-0 text-sm font-semibold text-copper">
                    ${item.price}
                  </span>
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
      </div>
    </section>
  );
}
