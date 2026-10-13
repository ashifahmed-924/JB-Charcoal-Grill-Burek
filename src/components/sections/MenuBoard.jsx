"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, Flip, registerGsapPlugins } from "@/lib/gsapSetup";
import { menuCategories, menuItems } from "@/data/menu";
import { restaurant, showPrices } from "@/data/restaurant";
import { useReducedMotion } from "@/hooks/useReducedMotion";

registerGsapPlugins();

const INITIAL_VISIBLE = 6;

export default function MenuBoard() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const indicatorRef = useRef(null);
  const tabRefs = useRef({});
  const reduced = useReducedMotion();

  const filtered = useMemo(() => {
    if (filter === "all") return menuItems;
    return menuItems.filter((item) => item.category === filter);
  }, [filter]);

  const visible = expanded ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const hasMore = filtered.length > INITIAL_VISIBLE;

  useEffect(() => {
    setExpanded(false);
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
      const parent = ind.offsetParent || ind.parentElement;
      if (!parent) return;
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
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
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

  return (
    <section id="menu" ref={rootRef} className="section-shell relative bg-surface-a overflow-hidden">
      <div className="section-inner relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8 md:mb-10">
          <div data-menu-head>
            <p className="eyebrow mb-3">The Living Menu</p>
            <h2 className="font-display text-display-md text-porcelain">
              THE GOOD
              <br />
              <span className="text-copper">STUFF.</span>
            </h2>
            <p className="mt-3 md:mt-4 max-w-md text-lead text-porcelain/65">
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
          className="relative mb-6 sm:mb-8 -mx-[var(--section-pad-x)] px-[var(--section-pad-x)] border-b border-porcelain/10"
          role="tablist"
          aria-label="Menu categories"
        >
          <div className="relative flex gap-1 overflow-x-auto pb-3 scrollbar-none">
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
                  className={`shrink-0 px-3 sm:px-4 py-3 text-[0.75rem] sm:text-sm font-semibold uppercase tracking-[0.12em] min-h-11 whitespace-nowrap transition-colors ${
                    selected ? "text-porcelain" : "text-porcelain/45 hover:text-porcelain"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <ul
          ref={listRef}
          className="relative grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-5 sm:gap-x-5 sm:gap-y-7 lg:gap-x-6 lg:gap-y-8"
        >
          {visible.map((item) => (
            <li key={item.id} data-menu-item className="group flex flex-col min-w-0">
              <div className="relative aspect-[5/4] overflow-hidden bg-smoke">
                {item.category !== "drinks" ? (
                  <Image
                    src={item.image}
                    alt={`${item.name} — representative imagery`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-surface-b">
                    <span className="text-[0.62rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-porcelain/45">
                      Drink
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2.5 sm:mt-4 flex flex-1 flex-col gap-1.5 sm:gap-2">
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <h3 className="font-display text-[1.05rem] sm:text-[1.35rem] leading-tight text-porcelain">
                    {item.name}
                  </h3>
                  {showPrices ? (
                    <span className="shrink-0 text-xs sm:text-sm font-semibold text-copper tabular-nums pt-0.5 sm:pt-1">
                      ${item.price}
                    </span>
                  ) : null}
                </div>
                <p className="text-[0.75rem] sm:text-sm leading-relaxed text-porcelain/65 line-clamp-3 sm:line-clamp-none">
                  {item.shortDescription || item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {hasMore ? (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="min-h-11 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-petrol border-b border-petrol/40 transition-colors hover:text-copper hover:border-copper"
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : `See more (${filtered.length - INITIAL_VISIBLE} more)`}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
