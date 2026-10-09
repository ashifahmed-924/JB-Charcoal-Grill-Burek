"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function ImageReveal({
  src,
  alt,
  className = "",
  imageClassName = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  fill = true,
  width,
  height,
}) {
  const wrapRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !wrapRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { clipPath: "inset(12% 12% 12% 12%)", opacity: 0.65 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, wrapRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imageClassName}`}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={`object-cover w-full h-full ${imageClassName}`}
        />
      )}
    </div>
  );
}
