"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, Flip, registerGsapPlugins } from "@/lib/gsapSetup";
import { menuCategories, menuItems } from "@/data/menu";
import { restaurant, showPrices } from "@/data/restaurant";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isFinePointer } from "@/lib/animations";

registerGsapPlugins();

export default function MenuBoard() {
  const [filter, setFilter] = useState("all");
  const [preview, setPreview] = useState(null);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const indicatorRef = useRef(null);
  const tabRefs = useRef({});
  const floatRef = useRef(null);
  const reduced = useReducedMotion();

  const filtered = useMemo(() => {
    if (filter === "all") return menuItems;
    return menuItems.filter((item) => item.category === filter);
  }, [filter]);

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;
      gsap.from("[data-menu-head]", {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 78%", once: true },
      });
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  useGSAP(
    () => {
      const tab = tabRefs.current[filter];
      const ind = indicatorRef.current;
      if (!tab || !ind) return;
      const parent = tab.parentElement;
      const pr = parent.getBoundingClientRect();
      const tr = tab.getBoundingClientRect();
      gsap.to(ind, {
        x: tr.left - pr.left,
        width: tr.width,
        duration: 0.4,
        ease: "power3.out",
      });
    },
    { dependencies: [filter] }
  );

  const changeFilter = (id) => {
    if (id === filter) return;
    const list = listRef.current;
    if (!list || reduced) {
      setFilter(id);
      return;
    }
    const items = list.querySelectorAll("[data-menu-item]");
    const state = Flip.getState(items);
    gsap.to(items, {
      opacity: 0,
      y: -12,
      duration: 0.25,
      stagger: 0.015,
      ease: "power2.in",
      onComplete: () => {
        setFilter(id);
        requestAnimationFrame(() => {
          const next = listRef.current?.querySelectorAll("[data-menu-item]");
          if (!next) return;
          gsap.fromTo(
            next,
            { opacity: 0, y: 18, clipPath: "inset(0 0 40% 0)" },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: 0.45,
              stagger: 0.03,
              ease: "power2.out",
            }
          );
          Flip.from(state, { duration: 0.45, ease: "power2.out", absolute: false });
        });
      },
    });
  };

  const onItemMove = (e, item) => {
    if (!isFinePointer() || reduced) return;
    setPreview(item);
    const float = floatRef.current;
    if (!float) return;
    const bounds = rootRef.current.getBoundingClientRect();
    gsap.to(float, {
      x: e.clientX - bounds.left + 24,
      y: e.clientY - bounds.top - 40,
      opacity: 1,
      duration: 0.35,
      ease: "power3.out",
      overwrite: true,
    });
  };

  const onItemLeave = () => {
    setPreview(null);
    if (floatRef.current) {
      gsap.to(floatRef.current, { opacity: 0, duration: 0.25 });
    }
  };

  return (
    <section id="menu" ref={rootRef} className="section-shell relative bg-porcelain overflow-hidden">
      <div className="section-inner relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8 md:mb-10">
          <div data-menu-head>
            <p className="eyebrow mb-3">The Living Menu</p>
            <h2 className="font-display text-display-md text-smoke">
              THE GOOD
              <br />
              <span className="text-copper">STUFF.</span>
            </h2>
            <p className="mt-3 md:mt-4 max-w-md text-lead text-smoke/65">
              Indicative Uber Eats listing prices in AUD. In-store prices may differ.
            </p>
          </div>
          <a
            data-menu-head
            href={restaurant.links.uberEats}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-petrol hover:text-copper"
          >
            Full Uber Eats menu
            <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>

        <div
          className="relative mb-8 flex gap-1 overflow-x-auto pb-3 border-b border-smoke/10"
          role="tablist"
          aria-label="Menu categories"
        >
          <span
            ref={indicatorRef}
            className="absolute bottom-0 left-0 h-[2px] w-16 bg-copper"
            aria-hidden
          />
          {menuCategories.map((cat) => {
            const selected = filter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selected}
                ref={(el) => {
                  tabRefs.current[cat.id] = el;
                }}
                onClick={() => changeFilter(cat.id)}
                className={`shrink-0 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] min-h-11 transition-colors ${
                  selected ? "text-smoke" : "text-smoke/45 hover:text-smoke"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <ul ref={listRef} className="relative divide-y divide-smoke/10">
          {filtered.map((item) => (
            <li
              key={item.id}
              data-menu-item
              className="group relative flex gap-4 md:gap-6 py-5 md:py-6"
              onMouseMove={(e) => onItemMove(e, item)}
              onMouseLeave={onItemLeave}
            >
              {/* Inline thumbs on touch / small screens; desktop uses floating preview */}
              <div className="relative h-16 w-16 shrink-0 overflow-hidden sm:h-[4.5rem] sm:w-[4.5rem] lg:hidden">
                {item.category !== "drinks" ? (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover"
                    aria-hidden
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-oat/40">
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-smoke/45">
                      Drink
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-display-sm text-smoke leading-none transition-transform duration-300 group-hover:translate-x-1">
                    {item.name}
                  </h3>
                  {showPrices ? (
                    <span className="shrink-0 text-sm font-semibold text-copper tabular-nums">
                      ${item.price}
                    </span>
                  ) : null}
                </div>
                <div className="my-2.5 h-px w-full border-t border-dashed border-smoke/15" />
                <p className="text-sm leading-relaxed text-smoke/65 max-w-xl">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop floating preview */}
        <div
          ref={floatRef}
          className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block h-40 w-32 overflow-hidden border-[3px] border-white shadow-[0_20px_50px_rgba(36,36,36,0.2)] opacity-0"
          aria-hidden
        >
          {preview && preview.category !== "drinks" ? (
            <Image
              key={preview.id}
              src={preview.image}
              alt=""
              fill
              sizes="128px"
              className="object-cover"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
