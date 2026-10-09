"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  Draggable,
  Flip,
  registerGsapPlugins,
} from "@/lib/gsapSetup";
import Lightbox from "@/components/ui/Lightbox";
import { useReducedMotion } from "@/hooks/useReducedMotion";

registerGsapPlugins();

const galleryImages = [
  {
    src: "/images/gallery-1.webp",
    alt: "Dining atmosphere — representative imagery",
    caption: "A Taste of Tradition",
    w: "w-[18rem] md:w-[22rem]",
    aspect: "aspect-[3/4]",
    rotate: "-rotate-3",
  },
  {
    src: "/images/gallery-2.webp",
    alt: "Grilled steak close-up — representative imagery",
    caption: "The Grill",
    w: "w-[20rem] md:w-[26rem]",
    aspect: "aspect-[5/4]",
    rotate: "rotate-2",
  },
  {
    src: "/images/gallery-3.webp",
    alt: "Grilled meat platter — representative imagery",
    caption: "Platter",
    w: "w-[16rem] md:w-[20rem]",
    aspect: "aspect-square",
    rotate: "rotate-[-1.5deg]",
  },
  {
    src: "/images/gallery-4.webp",
    alt: "Grilled sausages — representative imagery",
    caption: "From the Fire",
    w: "w-[18rem] md:w-[24rem]",
    aspect: "aspect-[4/5]",
    rotate: "rotate-3",
  },
  {
    src: "/images/filo-pastry.webp",
    alt: "Layered pastry — representative imagery",
    caption: "Golden Layers",
    w: "w-[17rem] md:w-[21rem]",
    aspect: "aspect-[3/4]",
    rotate: "-rotate-2",
  },
  {
    src: "/images/gallery-6.webp",
    alt: "Rustic bread — representative imagery",
    caption: "Bread & Share",
    w: "w-[19rem] md:w-[25rem]",
    aspect: "aspect-[5/4]",
    rotate: "rotate-1",
  },
  {
    src: "/images/gallery-5.webp",
    alt: "Food close-up — representative imagery",
    caption: "Close Up",
    w: "w-[16rem] md:w-[20rem]",
    aspect: "aspect-square",
    rotate: "rotate-[-2.5deg]",
  },
];

export default function FoodGallery() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const dragInstance = useRef(null);

  const updateActiveFromX = useCallback(() => {
    const cards = trackRef.current?.querySelectorAll("[data-gallery-card]");
    if (!cards?.length) return;
    const center = window.innerWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;
      const dist = Math.abs(mid - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActiveIndex(best);
  }, []);

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const cards = gsap.utils.toArray("[data-gallery-card]");
      const dirs = [
        { x: -100, y: 60, rotate: -12 },
        { x: 40, y: -80, rotate: 8 },
        { x: 120, y: 40, rotate: 10 },
        { x: -60, y: 90, rotate: -6 },
        { x: 80, y: -50, rotate: 5 },
        { x: -40, y: 70, rotate: -9 },
        { x: 60, y: -40, rotate: 7 },
      ];

      cards.forEach((card, i) => {
        gsap.from(card, {
          ...dirs[i % dirs.length],
          opacity: 0,
          duration: 1.05,
          ease: "power3.out",
          delay: i * 0.06,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            once: true,
          },
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        if (!track) return;

        dragInstance.current = Draggable.create(track, {
          type: "x",
          inertia: true,
          bounds: {
            minX: () =>
              Math.min(0, window.innerWidth - track.scrollWidth - 48),
            maxX: 0,
          },
          edgeResistance: 0.75,
          onDrag() {
            updateActiveFromX();
          },
          onThrowUpdate() {
            updateActiveFromX();
          },
        })[0];
      });
    },
    { scope: rootRef, dependencies: [reduced, updateActiveFromX] }
  );

  const nudge = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = dir * Math.min(360, window.innerWidth * 0.55);
    const current = gsap.getProperty(track, "x") || 0;
    const minX = Math.min(0, window.innerWidth - track.scrollWidth - 48);
    const next = gsap.utils.clamp(minX, 0, current + amount);
    gsap.to(track, {
      x: next,
      duration: 0.7,
      ease: "power3.out",
      onUpdate: () => updateActiveFromX(),
    });
  };

  const open = (index) => {
    const card = trackRef.current?.querySelectorAll("[data-gallery-card]")[index];
    if (card && !reduced) {
      const state = Flip.getState(card);
      setLightboxIndex(index);
      requestAnimationFrame(() => {
        const lb = document.querySelector("[data-lightbox-image]");
        if (lb) Flip.from(state, { duration: 0.55, ease: "power2.inOut" });
      });
    } else {
      setLightboxIndex(index);
    }
  };

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = () =>
    setLightboxIndex((i) => (i === 0 ? galleryImages.length - 1 : i - 1));
  const next = () =>
    setLightboxIndex((i) => (i === galleryImages.length - 1 ? 0 : i + 1));

  useEffect(() => {
    return () => dragInstance.current?.kill();
  }, []);

  return (
    <section id="gallery" ref={rootRef} className="section-shell bg-oat/25 overflow-hidden">
      <div className="section-inner mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Food exhibition</p>
          <h2 className="font-display text-display-md text-smoke">
            THE MOVING
            <br />
            <span className="text-copper">FOOD GALLERY.</span>
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => nudge(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-smoke/20 text-smoke hover:bg-smoke hover:text-porcelain transition-colors"
            aria-label="Previous gallery images"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => nudge(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-smoke/20 text-smoke hover:bg-smoke hover:text-porcelain transition-colors"
            aria-label="Next gallery images"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Desktop / tablet draggable track */}
      <div className="relative hidden md:block cursor-grab active:cursor-grabbing">
        <div
          ref={trackRef}
          className="flex items-center gap-6 lg:gap-8 px-[var(--section-pad-x)] w-max will-change-transform"
          data-cursor="DRAG"
        >
          {galleryImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              data-gallery-card
              onClick={() => open(index)}
              className={`group relative shrink-0 overflow-hidden border-[3px] border-white shadow-[0_18px_40px_rgba(36,36,36,0.14)] text-left transition-[filter,transform] duration-400 ${image.w} ${image.aspect} ${image.rotate} ${
                activeIndex === index ? "z-10 brightness-100" : "brightness-[0.92]"
              }`}
              aria-label={`Open image: ${image.caption || image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="400px"
                className="object-cover"
              />
              {image.caption ? (
                <span className="absolute bottom-3 left-3 right-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-porcelain drop-shadow">
                  {image.caption}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile snap gallery */}
      <div
        className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-[var(--section-pad-x)] -mx-[var(--section-pad-x)]"
        tabIndex={0}
        aria-label="Gallery"
      >
        {galleryImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => open(index)}
            className={`snap-center shrink-0 relative overflow-hidden border-[3px] border-white shadow-lg ${image.w} ${image.aspect}`}
            aria-label={`Open image: ${image.caption || image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="80vw"
              className="object-cover"
            />
            {image.caption ? (
              <span className="absolute bottom-3 left-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-porcelain">
                {image.caption}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {lightboxIndex !== null ? (
        <Lightbox
          images={galleryImages}
          index={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      ) : null}
    </section>
  );
}
