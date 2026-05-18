export function WatercolorBowline() {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <filter id="wc-edge-b" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" />
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        <filter id="wc-soft-b" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="2"
            seed="11"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="wc-paper-b">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="5" />
          <feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.30  0 0 0 0 0.18  0 0 0 0.06 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>

        <radialGradient id="b-sky" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#E8F0F7" />
          <stop offset="100%" stopColor="#C5DEEC" />
        </radialGradient>
        <linearGradient id="b-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7099B5" />
          <stop offset="100%" stopColor="#46748F" />
        </linearGradient>
        <radialGradient id="b-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FAE5A3" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#F4D96A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F4D96A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="b-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAE2D2" />
          <stop offset="100%" stopColor="#D9CDB3" />
        </linearGradient>
      </defs>

      <rect width="400" height="400" fill="#F4EFE5" />

      <ellipse cx="200" cy="160" rx="260" ry="180" fill="url(#b-sky)" filter="url(#wc-soft-b)" />

      <ellipse cx="290" cy="120" rx="80" ry="60" fill="url(#b-sun)" filter="url(#wc-soft-b)" />
      <ellipse cx="290" cy="120" rx="45" ry="35" fill="#F4D96A" opacity="0.45" filter="url(#wc-soft-b)" />

      <ellipse cx="200" cy="265" rx="300" ry="55" fill="url(#b-sea)" opacity="0.85" filter="url(#wc-edge-b)" />
      <ellipse cx="160" cy="282" rx="260" ry="32" fill="#5A8BA8" opacity="0.55" filter="url(#wc-soft-b)" />
      <ellipse cx="240" cy="298" rx="220" ry="24" fill="#46748F" opacity="0.45" filter="url(#wc-soft-b)" />

      <g opacity="0.85" filter="url(#wc-edge-b)">
        <path
          d="M 235 250 L 235 220 L 252 246 Z"
          fill="#F8F4ED"
        />
        <path
          d="M 233 250 L 233 230 L 220 250 Z"
          fill="#F8F4ED"
          opacity="0.9"
        />
        <rect x="226" y="248" width="18" height="6" fill="#1E3A5F" opacity="0.9" />
        <path d="M 222 254 Q 232 262 244 254 L 246 256 Q 232 266 220 256 Z" fill="#1E3A5F" opacity="0.7" />
      </g>

      <ellipse cx="200" cy="380" rx="320" ry="35" fill="url(#b-sand)" opacity="0.9" filter="url(#wc-edge-b)" />

      <g opacity="0.55">
        <ellipse cx="80" cy="260" rx="35" ry="3" fill="#FFFFFF" filter="url(#wc-soft-b)" />
        <ellipse cx="320" cy="275" rx="28" ry="2" fill="#FFFFFF" filter="url(#wc-soft-b)" />
        <ellipse cx="180" cy="285" rx="22" ry="2" fill="#FFFFFF" filter="url(#wc-soft-b)" />
      </g>

      <rect width="400" height="400" fill="#FAF7F2" filter="url(#wc-paper-b)" opacity="0.35" />
    </svg>
  );
}
