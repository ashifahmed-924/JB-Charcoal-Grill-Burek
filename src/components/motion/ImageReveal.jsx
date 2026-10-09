"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/gsapSetup";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { durations, easings } from "@/lib/motionConfig";

registerGsapPlugins();

const presets = {
  wipe: { from: "inset(0 0 100% 0)", to: "inset(0 0 0% 0)" },
  expand: { from: "inset(18% 18% 18% 18%)", to: "inset(0% 0% 0% 0%)" },
  scale: null,
  horizontal: { from: "inset(0 100% 0 0)", to: "inset(0 0% 0 0)" },
};

export default function ImageReveal({
  src,
  alt,
  className = "",
  imageClassName = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  mode = "expand",
}) {
  const wrapRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !wrapRef.current) return;

      if (mode === "scale") {
        gsap.fromTo(
          wrapRef.current.querySelector("img"),
          { scale: 1.25, opacity: 0.6 },
          {
            scale: 1,
            opacity: 1,
            duration: durations.image,
            ease: easings.strong,
            scrollTrigger: {
              trigger: wrapRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
        return;
      }

      const preset = presets[mode] || presets.expand;
      gsap.fromTo(
        wrapRef.current,
        { clipPath: preset.from },
        {
          clipPath: preset.to,
          duration: durations.image,
          ease: easings.strong,
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: wrapRef, dependencies: [reduced, mode] }
  );

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${imageClassName}`}
      />
    </div>
  );
}
