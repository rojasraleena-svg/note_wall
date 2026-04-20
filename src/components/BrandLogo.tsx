interface BrandLogoProps {
  size?: number;
  className?: string;
}

export default function BrandLogo({
  size = 48,
  className = "",
}: BrandLogoProps) {
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
        <linearGradient id="paper-frame" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#1B1714" />
          <stop offset="100%" stopColor="#40352B" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx="10"
        ry="10"
        fill="url(#paper-frame)"
      />
      <path d="M31 4H44V17L31 4Z" fill="#F8F0E5" opacity="0.9" />
      <rect x="11" y="11" width="25" height="25" rx="4" fill="#F8F0E5" />
      <rect x="16" y="18" width="15" height="2.2" rx="1.1" fill="#40352B" opacity="0.75" />
      <rect x="16" y="24" width="11" height="2.2" rx="1.1" fill="#40352B" opacity="0.45" />
      <circle cx="31.5" cy="29.5" r="4.5" fill="#D35D31" />
      <path
        d="M29.8 29.5L31 30.7L33.6 27.9"
        stroke="#FFF8EC"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
