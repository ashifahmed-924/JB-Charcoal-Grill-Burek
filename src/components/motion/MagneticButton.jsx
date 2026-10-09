"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsapSetup";
import { magneticStrength, durations, easings } from "@/lib/motionConfig";
import { isFinePointer } from "@/lib/animations";

export default function MagneticButton({
  children,
  href,
  className = "",
  external = false,
  onClick,
  type = "button",
  ariaLabel,
  strength = magneticStrength,
}) {
  const ref = useRef(null);

  const onMove = (event) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!isFinePointer()) return;

    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: x * strength.x,
      y: y * strength.y,
      duration: durations.micro,
      ease: easings.soft,
      overwrite: true,
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: durations.hover,
      ease: easings.spring,
      overwrite: true,
    });
  };

  const shared = {
    ref,
    className: `btn ${className}`,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <a
        {...shared}
        href={href}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button {...shared} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
