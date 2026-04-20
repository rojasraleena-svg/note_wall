import BrandLogo from "./BrandLogo";

export default function HeroHeader() {
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
                  <div className="text-sm text-[var(--color-muted)]">
                    A quiet public wall for passing thoughts
                  </div>
                </div>
              </div>

              <div data-testid="online-status" className="status-chip">
                <span className="status-dot animate-pulse-soft" />
                Supabase Online
              </div>

              <h1 className="hero-title display-font">留言墙</h1>
              <p className="hero-manifesto display-font">
                把一句短暂的话，做成会被重新遇见的公开收藏。
              </p>
              <p data-testid="hero-subtitle" className="hero-summary">
                参考获奖站常见的海报感首屏与编辑部式排版，我们把这里做成一块更有气氛的留白墙:
                少一点组件感，多一点节奏、层次和记忆点。
              </p>
            </div>

            <div className="hero-meta">
              <div>
                <span className="hero-meta-label">Mode</span>
                <span className="hero-meta-value">Open Notes</span>
              </div>
              <div>
                <span className="hero-meta-label">Palette</span>
                <span className="hero-meta-value">Paper / Ink / Ember</span>
              </div>
              <div>
                <span className="hero-meta-label">Energy</span>
                <span className="hero-meta-value">Editorial Calm</span>
              </div>
            </div>
          </div>

          <div className="hero-side">
            <div className="hero-stage">
              <div
                className="hero-note left-[8%] top-[10%] rotate-[-6deg]"
                style={{ animationDelay: "0.2s" }}
              >
                <small>Open line</small>
                <p>愿这里留下的每句话，都不像弹窗，而像被拾起的纸条。</p>
              </div>
              <div
                className="hero-note right-[4%] top-[34%] rotate-[5deg]"
                style={{ animationDelay: "0.8s" }}
              >
                <small>Quiet motion</small>
                <p>一眼先看到气氛，再慢慢读见内容，这才像一张真正的首屏海报。</p>
              </div>
              <div
                className="hero-note bottom-[12%] left-[14%] rotate-[-3deg]"
                style={{ animationDelay: "1.2s" }}
              >
                <small>Public archive</small>
                <p>匿名、署名、心情、碎念，都能在这里拥有一小块被看见的位置。</p>
              </div>

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
