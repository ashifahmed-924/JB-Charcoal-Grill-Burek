"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/gsapSetup";
import { restaurant } from "@/data/restaurant";
import MagneticButton from "@/components/motion/MagneticButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";

registerGsapPlugins();

const sectionIds = ["top", "menu", "story", "gallery", "visit"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const indicatorRef = useRef(null);
  const linkRefs = useRef({});
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion || !rootRef.current) return;
      gsap.from(rootRef.current.querySelector("[data-nav-bar]"), {
        y: -40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.15,
      });
    },
    { dependencies: [reducedMotion] }
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(`#${id === "top" ? "top" : id}`);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  useEffect(() => {
    const link = linkRefs.current[active];
    const indicator = indicatorRef.current;
    if (!link || !indicator) return;
    const parent = link.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    gsap.to(indicator, {
      x: linkRect.left - parentRect.left,
      width: linkRect.width,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [active, scrolled]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      if (!open) {
        gsap.set(panel, { autoAlpha: 0, pointerEvents: "none" });
        return;
      }

      if (reducedMotion) {
        gsap.set(panel, { autoAlpha: 1, y: 0, pointerEvents: "auto" });
        gsap.set(panel.querySelectorAll("[data-mobile-link]"), {
          autoAlpha: 1,
          y: 0,
        });
        return;
      }

      const links = panel.querySelectorAll("[data-mobile-link]");
      const tl = gsap.timeline();
      gsap.set(panel, { pointerEvents: "auto" });
      tl.fromTo(
        panel,
        { autoAlpha: 0, y: -24 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }
      ).fromTo(
        links,
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.45,
          stagger: 0.06,
          ease: "power3.out",
        },
        "-=0.15"
      );
    },
    { dependencies: [open, reducedMotion] }
  );

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  const onLinkEnter = (e) => {
    if (reducedMotion) return;
    const texts = e.currentTarget.querySelectorAll("[data-nav-slide]");
    gsap.to(texts, { yPercent: -100, duration: 0.35, ease: "power2.out" });
  };

  const onLinkLeave = (e) => {
    if (reducedMotion) return;
    const texts = e.currentTarget.querySelectorAll("[data-nav-slide]");
    gsap.to(texts, { yPercent: 0, duration: 0.35, ease: "power2.out" });
  };

  return (
    <header ref={rootRef} className="fixed inset-x-0 top-0 z-50">
      {/* Mobile / tablet full-screen menu — sits under the bar */}
      <div
        id="mobile-nav"
        ref={panelRef}
        className="lg:hidden fixed inset-0 z-40 bg-surface-a"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
      >
        <div className="flex h-full flex-col px-5 sm:px-8 pb-10 pt-24 sm:pt-28">
          <nav className="flex flex-col gap-1" aria-label="Mobile primary">
            {restaurant.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-mobile-link
                onClick={close}
                tabIndex={open ? 0 : -1}
                className="font-display text-[clamp(1.75rem,7vw,3.25rem)] text-porcelain border-b border-porcelain/10 py-2.5"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto" data-mobile-link>
            <MagneticButton
              href={restaurant.links.uberEats}
              external
              className="btn-primary w-full"
              onClick={close}
              ariaLabel="Order online on Uber Eats"
            >
              Order Online
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Floating bar — always above the menu panel so hamburger/close stays clickable */}
      <div
        data-nav-bar
        className={`relative z-50 mx-auto mt-3 flex w-[min(100%-1rem,70rem)] sm:w-[min(100%-1.5rem,70rem)] items-center justify-between rounded-full px-3.5 py-2 sm:px-4 sm:py-2.5 md:px-5 transition-[padding,background,box-shadow,border-color] duration-500 ${
          scrolled || open
            ? "bg-surface-a/95 shadow-[0_12px_40px_rgba(36,36,36,0.12)] backdrop-blur-md border border-porcelain/10 py-2"
            : "bg-surface-a/55 backdrop-blur-md border border-porcelain/5"
        }`}
      >
        <a
          href="#top"
          className="group relative overflow-hidden font-display text-[0.95rem] sm:text-[1.05rem] tracking-tight text-porcelain leading-tight"
          onClick={close}
          aria-label={restaurant.name}
        >
          <span className="block transition-transform duration-500 group-hover:-translate-y-full">
            JB <span className="text-copper">Grill</span>
          </span>
          <span className="absolute inset-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0">
            JB <span className="text-copper">&amp; Burek</span>
          </span>
        </a>

        <nav
          className="relative hidden lg:flex items-center gap-8"
          aria-label="Primary"
        >
          <span
            ref={indicatorRef}
            className="absolute -bottom-1 left-0 h-[2px] w-8 bg-copper rounded-full"
            aria-hidden
          />
          {restaurant.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              ref={(el) => {
                linkRefs.current[item.href] = el;
              }}
              aria-label={item.label}
              aria-current={active === item.href ? "true" : undefined}
              className="relative h-5 overflow-hidden text-[0.82rem] font-medium tracking-[0.04em] uppercase text-porcelain/75 hover:text-porcelain"
              onMouseEnter={onLinkEnter}
              onMouseLeave={onLinkLeave}
            >
              <span className="flex flex-col" data-nav-slide aria-hidden="true">
                <span>{item.label}</span>
                <span className="text-copper">{item.label}</span>
              </span>
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <MagneticButton
            href={restaurant.links.uberEats}
            external
            className="btn-primary !min-h-10 !px-5 !text-[0.75rem]"
            ariaLabel="Order online on Uber Eats"
          >
            Order Online
          </MagneticButton>
        </div>

        <button
          type="button"
          className="lg:hidden relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-porcelain/15 text-porcelain bg-surface-a/80"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={toggle}
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </div>
    </header>
  );
}
