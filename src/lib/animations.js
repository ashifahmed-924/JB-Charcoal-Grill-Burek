import { gsap } from "@/lib/gsapSetup";
import { durations, easings } from "@/lib/motionConfig";

export function fadeRise(targets, opts = {}) {
  return gsap.fromTo(
    targets,
    { opacity: 0, y: opts.y ?? 28 },
    {
      opacity: 1,
      y: 0,
      duration: opts.duration ?? durations.text,
      stagger: opts.stagger ?? 0.08,
      ease: opts.ease ?? easings.soft,
      ...opts,
    }
  );
}

export function clipWipe(target, opts = {}) {
  const from = opts.from ?? "inset(0 0 100% 0)";
  return gsap.fromTo(
    target,
    { clipPath: from },
    {
      clipPath: "inset(0 0 0% 0)",
      duration: opts.duration ?? durations.image,
      ease: opts.ease ?? easings.strong,
      ...opts,
    }
  );
}

export function drawLine(target, opts = {}) {
  return gsap.fromTo(
    target,
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: opts.duration ?? 0.9,
      ease: opts.ease ?? easings.expo,
      transformOrigin: opts.origin ?? "left center",
      ...opts,
    }
  );
}

export function isFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function isTouchPrimary() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}
