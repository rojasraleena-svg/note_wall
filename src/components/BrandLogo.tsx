interface BrandLogoProps {
  size?: number;
  className?: string;
}

export default function BrandLogo({ size = 48, className = "" }: BrandLogoProps) {
  return (
    <svg
      data-testid="brand-logo"
      role="img"
      aria-label="留言墙 Logo"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="logo-gradient-light" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>

      {/* Background rounded rectangle (note shape) */}
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx="10"
        ry="10"
        fill="url(#logo-gradient)"
      />

      {/* Folded corner effect */}
      <path
        d="M34 4 L44 4 L44 14 Z"
        fill="white"
        opacity="0.25"
      />

      {/* Inner paper area */}
      <rect
        x="10"
        y="12"
        width="28"
        height="24"
        rx="4"
        ry="4"
        fill="white"
        opacity="0.95"
      />

      {/* Text lines on note */}
      <rect x="15" y="18" width="18" height="2.5" rx="1.25" fill="#c7d2fe" opacity="0.8" />
      <rect x="15" y="24" width="14" height="2.5" rx="1.25" fill="#e0e7ff" opacity="0.6" />
      <rect x="15" y="30" width="10" height="2.5" rx="1.25" fill="#e0e7ff" opacity="0.4" />

      {/* Heart accent */}
      <path
        d="M33 28 C33 26 31 24.5 29.5 24.5 C27.5 24.5 26 26.5 26 28.5 C26 31.5 29.5 35 33 38 C36.5 35 40 31.5 40 28.5 C40 26.5 38.5 24.5 36.5 24.5 C35 24.5 33 26 33 28 Z"
        fill="url(#logo-gradient-light)"
        transform="translate(-3, -1) scale(0.55)"
      />
    </svg>
  );
}
