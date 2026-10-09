"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks pointer position with rAF batching. Callers receive {x,y} relative to viewport.
 */
export function usePointerPosition(enabled = true, onMove) {
  const frame = useRef(0);
  const latest = useRef({ x: 0, y: 0 });
  const onMoveRef = useRef(onMove);

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return undefined;

    const handle = (event) => {
      latest.current = { x: event.clientX, y: event.clientY };
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        onMoveRef.current?.(latest.current);
      });
    };

    window.addEventListener("pointermove", handle, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handle);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [enabled]);

  return latest;
}
