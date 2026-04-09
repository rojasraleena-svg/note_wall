import BrandLogo from "./BrandLogo";

export default function HeroHeader() {
  return (
    <header
      data-testid="hero-container"
      className="relative text-center mb-10 animate-fade-in-up overflow-visible"
    >
      {/* Decorative background blobs */}
      <span
        data-testid="hero-decor-blob-1"
        className="absolute -top-6 -left-8 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-xl animate-float"
        aria-hidden="true"
      />
      <span
        data-testid="hero-decor-blob-2"
        className="absolute -top-2 -right-6 w-20 h-20 rounded-full bg-gradient-to-br from-pink-200/40 to-rose-200/40 blur-xl animate-float"
        style={{ animationDelay: "1s" }}
        aria-hidden="true"
      />
      <span
        data-testid="hero-decor-blob-3"
        className="absolute -bottom-4 left-1/3 w-16 h-16 rounded-full bg-gradient-to-br from-blue-200/30 to-indigo-200/30 blur-lg animate-float"
        style={{ animationDelay: "2s" }}
        aria-hidden="true"
      />

      {/* Glass card wrapper */}
      <div className="relative glass rounded-3xl px-8 py-10 sm:px-12 sm:py-14">
        {/* Online status */}
        <div
          data-testid="online-status"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 text-xs text-gray-500 mb-5 backdrop-blur-sm border border-white/40"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft shadow-sm shadow-emerald-300/50" />
          在线
        </div>

        {/* Logo + Title row */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <BrandLogo size={52} className="drop-shadow-lg" />
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text tracking-tight">
            留言墙
          </h1>
        </div>

        {/* Subtitle */}
        <p
          data-testid="hero-subtitle"
          className="text-gray-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed"
        >
          每一句话都是星光，留下你的想法，与大家分享 ✨
        </p>

        {/* Decorative line */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-indigo-200/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-indigo-300 to-purple-300" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-purple-200/60" />
        </div>
      </div>
    </header>
  );
}
