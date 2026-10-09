"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({ images, index, onClose, onPrev, onNext }) {
  const active = images[index];

  const onKey = useCallback(
    (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onKey]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-smoke/92 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X size={20} />
      </button>

      <button
        type="button"
        className="absolute left-3 md:left-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous image"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        className="absolute right-3 md:right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next image"
      >
        <ChevronRight size={22} />
      </button>

      <div
        data-lightbox-image
        className="relative w-full max-w-5xl aspect-[4/3] md:aspect-[16/10]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={active.src}
          alt={active.alt}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
        {active.caption ? (
          <p className="absolute bottom-0 inset-x-0 text-center text-white/90 text-sm py-3 bg-gradient-to-t from-black/50 to-transparent">
            {active.caption}
          </p>
        ) : null}
      </div>
    </div>
  );
}
