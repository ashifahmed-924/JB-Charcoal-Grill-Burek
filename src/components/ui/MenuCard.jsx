"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { showPrices } from "@/data/restaurant";
import { restaurant } from "@/data/restaurant";

export default function MenuCard({ item }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.1rem] surface-card shadow-[0_10px_28px_rgba(36,36,36,0.06)] transition-transform duration-500 hover:-translate-y-1.5">
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image
          src={item.image}
          alt={`${item.name} — representative image`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-surface-a/95 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-porcelain">
          {item.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[1.25rem] sm:text-[1.4rem] md:text-[1.55rem] leading-none text-porcelain">
            {item.name}
          </h3>
          {showPrices ? (
            <span className="shrink-0 text-sm font-semibold text-copper">
              ${item.price}
            </span>
          ) : null}
        </div>
        <p className="text-sm leading-relaxed text-porcelain/65">{item.shortDescription}</p>
        <a
          href={restaurant.links.uberEats}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-petrol transition-colors hover:text-copper"
        >
          Order
          <ArrowUpRight size={14} aria-hidden />
        </a>
      </div>
    </article>
  );
}
