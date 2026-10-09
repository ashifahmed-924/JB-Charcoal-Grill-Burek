"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  registerGsapPlugins,
} from "@/lib/gsapSetup";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { durations, easings } from "@/lib/motionConfig";

registerGsapPlugins();

/**
 * mode: "chars" | "words" | "lines"
 */
export default function MaskedText({
  children,
  as: Tag = "div",
  className = "",
  mode = "lines",
  delay = 0,
  stagger = 0.06,
  scrub = false,
  trigger,
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;

      const split = SplitText.create(ref.current, {
        type: mode === "chars" ? "chars,words" : mode,
        mask: mode === "lines" ? "lines" : undefined,
        charsClass: "split-char",
        wordsClass: "split-word",
        linesClass: "split-line",
      });

      const targets =
        mode === "chars"
          ? split.chars
          : mode === "words"
            ? split.words
            : split.lines;

      const fromVars =
        mode === "lines"
          ? { yPercent: 110 }
          : { opacity: 0, y: mode === "chars" ? 18 : 24 };

      if (scrub) {
        gsap.fromTo(targets, fromVars, {
          opacity: 1,
          y: 0,
          yPercent: 0,
          ease: "none",
          stagger,
          scrollTrigger: {
            trigger: trigger || ref.current,
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          },
        });
      } else {
        gsap.fromTo(targets, fromVars, {
          opacity: 1,
          y: 0,
          yPercent: 0,
          duration: durations.text,
          delay,
          stagger,
          ease: easings.strong,
          scrollTrigger: {
            trigger: trigger || ref.current,
            start: "top 85%",
            once: true,
          },
        });
      }

      return () => split.revert();
    },
    { scope: ref, dependencies: [reduced, mode, delay, scrub] }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

// Silence unused ScrollTrigger import warning in some bundlers
void ScrollTrigger;
