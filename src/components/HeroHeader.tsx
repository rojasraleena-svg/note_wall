"use client";

import { useCallback, useEffect, useRef } from "react";
import BrandLogo from "./BrandLogo";

const NOTES_SECTION_ID = "notes-wall";

const HERO_NOTES = [
  {
    label: "Open line",
    content: "像被留下的纸条，不像弹窗。",
    className: "left-[10%] top-[14%] rotate-[-6deg]",
    animationDelay: "0.2s",
  },
  {
    label: "Passing thought",
    content: "今天路过，也能在这里停一下。",
    className: "right-[10%] top-[30%] rotate-[5deg]",
    animationDelay: "0.7s",
  },
  {
    label: "Open archive",
    content: "短句、小事、情绪，都值得被放进页面。",
    className: "left-[18%] bottom-[22%] rotate-[3deg]",
    animationDelay: "1.1s",
  },
  {
    label: "Public archive",
    content: "匿名、署名、碎念，都能被看见。",
    className: "right-[0%] bottom-[12%] rotate-[-4deg]",
    animationDelay: "1.5s",
  },
];

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
        className="absolute left-[8%] top-[10%] h-28 w-28 rounded-full bg-[#f2b86a]/35 blur-2xl"
        aria-hidden="true"
      />
      <span
        data-testid="hero-decor-blob-2"
        className="absolute right-[10%] top-[14%] h-36 w-36 rounded-full bg-[#d35d31]/25 blur-3xl"
        aria-hidden="true"
      />
      <span
        data-testid="hero-decor-blob-3"
        className="absolute bottom-[10%] left-[36%] h-20 w-20 rounded-full bg-[#fff3d1]/55 blur-xl"
        aria-hidden="true"
      />

      <div className="hero-frame">
        <div className="hero-grid">
          <div className="hero-copy">
            <div>
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
                <span>把一句短暂的话，</span>
                <span>做成会被重新看见的公开收藏。</span>
              </p>
              <p data-testid="hero-subtitle" className="hero-summary">
                先停一下，再进入留言本身。
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
              </div>
            </div>

            <div className="hero-meta">
              <div>
                <span className="hero-meta-label">Mode</span>
                <span className="hero-meta-value">Open Notes</span>
              </div>
              <div>
                <span className="hero-meta-label">Palette</span>
                <span className="hero-meta-value">Paper / Ink</span>
              </div>
            </div>
          </div>

          <div className="hero-side">
            <div className="hero-stage">
              {HERO_NOTES.map((note) => (
                <div
                  key={note.label}
                  className={`hero-note ${note.className}`}
                  style={{ animationDelay: note.animationDelay }}
                >
                  <small>{note.label}</small>
                  <p>{note.content}</p>
                </div>
              ))}

              <div className="hero-marquee">
                <span className="hero-marquee-dot" />
                Site of the day inspired composition
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
