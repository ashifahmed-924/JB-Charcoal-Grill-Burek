"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/gsapSetup";
import { useReducedMotion } from "@/hooks/useReducedMotion";

registerGsapPlugins();

export default function ParallaxImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  sizes = "(max-width: 768px) 100vw",
  amount = 12,
  priority = false,
}) {
  const wrapRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !wrapRef.current) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(wrapRef.current.querySelector("img"), {
          yPercent: amount,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: wrapRef, dependencies: [reduced, amount] }
  );

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover scale-110 ${imageClassName}`}
      />
    </div>
  );
}
