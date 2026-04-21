"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BrandLogo from "./BrandLogo";
import { fetchMessageCount } from "@/services/messageService";

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return n.toLocaleString();
}

export default function HeroHeader() {
  const [paperOffset, setPaperOffset] = useState({ x: 0, y: 0 });
  const paperRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const [noteCount, setNoteCount] = useState<number | null>(null);

  useEffect(() => {
    fetchMessageCount()
      .then(setNoteCount)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const paper = paperRef.current;
    if (!paper) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);

      frameRef.current = requestAnimationFrame(() => {
        const rect = paper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 400) {
          const strength = Math.max(0, 1 - distance / 400);
          setPaperOffset({
            x: distX * strength * 0.02,
            y: distY * strength * 0.02,
          });
        } else {
          setPaperOffset({ x: 0, y: 0 });
        }
      });
    };

    const handleMouseLeave = () => {
      setPaperOffset({ x: 0, y: 0 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const paperStyle = {
    transform: `translate(${paperOffset.x}px, ${paperOffset.y}px)`,
  };

  return (
    <header data-testid="hero-container" className="hero-shell">
      <span
        data-testid="hero-decor-blob-1"
        className="absolute left-[5%] top-[10%] h-40 w-40 rounded-full bg-[#f2b86a]/30 blur-[100px]"
        style={{ animation: "blob-pulse-slow 7s ease-in-out infinite", mixBlendMode: "multiply" }}
        aria-hidden="true"
      />
      <span
        data-testid="hero-decor-blob-2"
        className="absolute right-[7%] top-[15%] h-48 w-48 rounded-full bg-[#d35d31]/15 blur-[120px]"
        style={{ animation: "blob-pulse-slow 9s ease-in-out infinite 1.5s", mixBlendMode: "multiply" }}
        aria-hidden="true"
      />

      <div className="hero-frame">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-copy-main">
              <div className="hero-brand-row hero-entrance-brand">
                <BrandLogo size={54} />
                <div>
                  <div className="eyebrow">Live note archive</div>
                </div>
              </div>

              <h1 className="hero-title display-font hero-entrance-title">
                <span className="hero-title-reveal" aria-label="留言墙">
                  {"留言墙".split("").map((char, i) => (
                    <span
                      key={i}
                      style={{
                        animationDelay: `${0.35 + i * 0.12}s`,
                        ...(i === 2
                          ? {
                              WebkitTextStroke: "1.8px rgba(19,17,15,0.45)",
                              color: "transparent",
                            }
                          : {}),
                      }}
                      aria-hidden="true"
                      className={i === 2 ? "outline-char" : ""}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </h1>

              <p className="hero-manifesto display-font hero-entrance-manifesto">
                <span>把短暂的话，</span>
                <span>留成公开收藏。</span>
              </p>

              <p data-testid="hero-subtitle" className="hero-summary hero-entrance-subtitle">
                匿名或署名，都能被看见。
              </p>

              <div className="hero-actions hero-entrance-actions">
                <Link href="/wall" className="hero-cta-button" data-testid="enter-notes-button">
                  进入留言墙
                </Link>
                <div className="scroll-indicator" aria-hidden="true">
                  <span className="scroll-arrow" />
                </div>
              </div>
            </div>
          </div>

          <div className="hero-side" aria-hidden="true">
            <div className="hero-stage">
              <div className="hero-stage-kicker hero-entrance-kicker">Public archive</div>

              <div className="hero-stats-row hero-entrance-stats">
                <div className="hero-stat">
                  <span className="hero-stat-value">
                    {noteCount !== null ? formatCount(noteCount) : "--"}
                  </span>
                  <span className="hero-stat-label">条留言</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <span className="hero-stat-value hero-stat-value--accent">LIVE</span>
                  <span className="hero-stat-label">实时更新</span>
                </div>
              </div>

              <div className="hero-paper-plane hero-entrance-paper">
                <div ref={paperRef} className="hero-paper-magnetic" style={paperStyle}>
                  <p className="hero-paper-quote display-font">让一句话，被轻轻贴上去。</p>
                  <span className="hero-paper-signature">— 今天路过，也能留下句子。</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
