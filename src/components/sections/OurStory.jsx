"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  SplitText,
  registerGsapPlugins,
} from "@/lib/gsapSetup";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import AnimatedLine from "@/components/motion/AnimatedLine";

registerGsapPlugins();

export default function OurStory() {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !rootRef.current) return;

      const headline = rootRef.current.querySelector("[data-story-headline]");
      const body = rootRef.current.querySelectorAll("[data-story-word]");
      const split = SplitText.create(headline, {
        type: "words",
        wordsClass: "story-word",
      });

      split.words.forEach((word, i) => {
        if (i === 1 || i === 3) word.classList.add("text-copper");
      });

      gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          once: true,
        },
      });

      gsap.from(body, {
        opacity: 0.15,
        y: 20,
        duration: 0.7,
        stagger: 0.04,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-story-body]",
          start: "top 80%",
          once: true,
        },
      });

      gsap.fromTo(
        "[data-story-photo]",
        { opacity: 0, scale: 1.08 },
        {
          opacity: 0.35,
          scale: 1,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 65%",
            once: true,
          },
        }
      );

      gsap.to("[data-story-photo]", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => split.revert();
    },
    { scope: rootRef, dependencies: [reduced] }
  );

  const bodyWords = [
    "JB",
    "Charcoal",
    "Grill",
    "&",
    "Burek",
    "brings",
    "Balkan-inspired",
    "grilled",
    "dishes",
    "and",
    "whole",
    "burek",
    "to",
    "Stud",
    "Road,",
    "Dandenong",
    "—",
    "food",
    "built",
    "around",
    "charcoal",
    "heat,",
    "flaky",
    "pastry,",
    "and",
    "generous",
    "plates.",
  ];

  return (
    <section id="story" ref={rootRef} className="relative overflow-hidden section-shell bg-oat/30">
      <div
        data-story-photo
        className="pointer-events-none absolute right-[-8%] top-[10%] hidden lg:block w-[42%] aspect-[3/4] opacity-0"
        aria-hidden
      >
        <Image
          src="/images/story-panel.webp"
          alt=""
          fill
          sizes="40vw"
          className="object-cover grayscale-[30%]"
        />
      </div>

      <div className="section-inner relative z-10 max-w-4xl">
        <p className="eyebrow mb-6">The JB Story</p>

        <h2
          data-story-headline
          className="font-display text-display-xl leading-[0.92] text-smoke overflow-hidden"
        >
          GOOD FOOD. BOLD ROOTS.
        </h2>

        <div className="mt-6 md:mt-8 mb-8 md:mb-10 max-w-md">
          <AnimatedLine className="mb-6 md:mb-8" />
        </div>

        <p
          data-story-body
          className="font-display text-display-sm leading-[1.3] text-smoke/80 max-w-3xl"
        >
          {bodyWords.map((word, i) => (
            <span
              key={`${word}-${i}`}
              data-story-word
              className={`inline-block mr-[0.3em] ${
                ["charcoal", "burek", "Dandenong"].includes(word.replace(",", ""))
                  ? "text-copper"
                  : ""
              }`}
            >
              {word}
            </span>
          ))}
        </p>

        <p className="mt-6 md:mt-8 max-w-xl text-lead leading-relaxed text-smoke/65">
          From cevapi and pljeskavica burgers to beef, cheese, spinach, sour
          cherry and apple burek, the menu stays focused on honest, hearty
          favourites.
        </p>
      </div>
    </section>
  );
}
