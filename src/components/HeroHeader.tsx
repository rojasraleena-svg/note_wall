"use client";

import { useCallback, useEffect, useRef } from "react";
import BrandLogo from "./BrandLogo";

const NOTES_SECTION_ID = "notes-wall";

export default function HeroHeader() {
  const hasEnteredRef = useRef(false);

  const scrollToNotes = useCallback(() => {
    if (hasEnteredRef.current) return;

    const notesSection = document.getElementById(NOTES_SECTION_ID);
    if (!notesSection) return;

    hasEnteredRef.current = true;
    notesSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const shouldHandle = () => {
      const notesSection = document.getElementById(NOTES_SECTION_ID);
      if (!notesSection) return false;
      return notesSection.getBoundingClientRect().top > 120;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY <= 8 || !shouldHandle()) return;
      scrollToNotes();
    };

    const onTouchMove = () => {
      if (!shouldHandle()) return;
      scrollToNotes();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!["ArrowDown", "PageDown", "Space", "Enter"].includes(event.code)) {
        return;
      }
      if (!shouldHandle()) return;
      scrollToNotes();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [scrollToNotes]);

  return (
    <header
      data-testid="hero-container"
      className="hero-shell animate-fade-in-up"
    >
      <span
        data-testid="hero-decor-blob-1"
        className="absolute left-[7%] top-[12%] h-32 w-32 rounded-full bg-[#f2b86a]/35 blur-3xl"
        aria-hidden="true"
      />
      <span
        data-testid="hero-decor-blob-2"
        className="absolute right-[9%] top-[18%] h-40 w-40 rounded-full bg-[#d35d31]/18 blur-3xl"
        aria-hidden="true"
      />

      <div className="hero-frame">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-copy-main">
              <div className="hero-brand-row">
                <BrandLogo size={54} />
                <div>
                  <div className="eyebrow">Live note archive</div>
                </div>
              </div>

              <div data-testid="online-status" className="status-chip">
                <span className="status-dot animate-pulse-soft" />
                Supabase Online
              </div>

              <h1 className="hero-title display-font">留言墙</h1>
              <p className="hero-manifesto display-font">
                <span>把短暂的话，</span>
                <span>留成公开收藏。</span>
              </p>
              <p data-testid="hero-subtitle" className="hero-summary">
                匿名或署名，都能被看见。
              </p>

              <div className="hero-actions">
                <button
                  type="button"
                  className="editorial-button rounded-full px-5 py-2.5 text-sm font-semibold"
                  onClick={scrollToNotes}
                  data-testid="enter-notes-button"
                >
                  进入留言墙
                </button>
                <span className="scroll-hint">向下滚动也会进入</span>
              </div>
            </div>
          </div>

          <div className="hero-side" aria-hidden="true">
            <div className="hero-stage">
              <div className="hero-stage-kicker">Public archive</div>

              <div className="hero-paper-plane">
                <div className="hero-paper-header">
                  <span>Open line</span>
                  <span>Quiet public wall</span>
                </div>

                <p className="hero-paper-quote display-font">
                  让一句话，
                  <br />
                  被轻轻贴上去。
                </p>

                <div className="hero-paper-footer">
                  <span>Anonymous or signed</span>
                  <span>Open all day</span>
                </div>
              </div>
              <div className="hero-stage-note hero-stage-note-bottom">
                今天路过，也能留下句子。
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
