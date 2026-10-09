"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

let registered = false;

export function registerGsapPlugins() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(
    ScrollTrigger,
    Flip,
    Draggable,
    InertiaPlugin,
    SplitText,
    ScrambleTextPlugin
  );
  registered = true;
}

export {
  gsap,
  ScrollTrigger,
  Flip,
  Draggable,
  InertiaPlugin,
  SplitText,
  ScrambleTextPlugin,
};
