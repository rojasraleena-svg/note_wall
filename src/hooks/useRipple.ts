"use client";

import { useCallback, useRef } from "react";

export function useRipple() {
  const ref = useRef<HTMLButtonElement>(null);

  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = ref.current;
    if (!button) return;

    const existing = button.querySelector(".ripple-effect");
    if (existing) existing.remove();

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  return { ref, onClick: createRipple };
}
