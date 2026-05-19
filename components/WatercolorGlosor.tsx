export function WatercolorGlosor() {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <filter id="wc-edge-g" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="2"
            seed="23"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" />
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        <filter id="wc-soft-g" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="2"
            seed="29"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="wc-paper-g">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="31" />
          <feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.30  0 0 0 0 0.18  0 0 0 0.06 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>

        <radialGradient id="g-bg" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#FAF4DC" />
          <stop offset="100%" stopColor="#EFE4C7" />
        </radialGradient>
        <linearGradient id="g-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9C49E" />
          <stop offset="100%" stopColor="#B89A6E" />
        </linearGradient>
        <radialGradient id="g-lamp" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FAEEDA" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#F4D96A" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="400" fill="#F4EFE5" />

      <ellipse cx="200" cy="160" rx="280" ry="180" fill="url(#g-bg)" filter="url(#wc-soft-g)" />

      <ellipse cx="320" cy="120" rx="100" ry="90" fill="url(#g-lamp)" filter="url(#wc-soft-g)" />

      <ellipse cx="200" cy="345" rx="320" ry="80" fill="url(#g-desk)" opacity="0.85" filter="url(#wc-edge-g)" />

      <g filter="url(#wc-edge-g)">
        <rect x="80" y="225" width="160" height="22" fill="#5A8BA8" opacity="0.9" />
        <rect x="80" y="225" width="160" height="22" fill="none" stroke="#46748F" strokeWidth="1" />
        <line x1="100" y1="237" x2="220" y2="237" stroke="#FFF8E1" strokeWidth="0.8" opacity="0.7" />
      </g>

      <g filter="url(#wc-edge-g)">
        <rect x="95" y="200" width="155" height="25" fill="#C8694A" opacity="0.92" />
        <rect x="95" y="200" width="155" height="25" fill="none" stroke="#B05839" strokeWidth="1" />
        <line x1="115" y1="213" x2="230" y2="213" stroke="#FBEEE8" strokeWidth="0.8" opacity="0.6" />
      </g>

      <g filter="url(#wc-edge-g)">
        <rect x="105" y="172" width="135" height="28" fill="#7BA67E" opacity="0.9" />
        <rect x="105" y="172" width="135" height="28" fill="none" stroke="#5C8A60" strokeWidth="1" />
        <line x1="125" y1="187" x2="220" y2="187" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.55" />
      </g>

      <g filter="url(#wc-soft-g)">
        <path
          d="M 240 220 Q 260 215 280 218 L 305 230 Q 295 235 282 240 Q 268 245 248 240 Z"
          fill="#FFFFFF"
          opacity="0.92"
        />
        <path
          d="M 305 230 Q 312 228 320 232 L 340 240 Q 332 244 322 244 Q 314 244 305 240 Z"
          fill="#FFFFFF"
          opacity="0.85"
        />
        <line x1="252" y1="228" x2="288" y2="232" stroke="#1E3A5F" strokeWidth="0.6" opacity="0.55" />
        <line x1="252" y1="234" x2="288" y2="238" stroke="#1E3A5F" strokeWidth="0.6" opacity="0.5" />
      </g>

      <g filter="url(#wc-edge-g)">
        <ellipse cx="305" cy="262" rx="32" ry="9" fill="#1E3A5F" opacity="0.85" />
        <path
          d="M 273 262 Q 273 285 287 290 L 323 290 Q 337 285 337 262 Z"
          fill="#5A8BA8"
          opacity="0.9"
        />
        <path
          d="M 337 268 Q 350 270 350 280 Q 350 290 337 290"
          stroke="#5A8BA8"
          strokeWidth="2"
          fill="none"
          opacity="0.85"
        />
        <ellipse cx="305" cy="262" rx="32" ry="9" fill="#3D2817" opacity="0.85" />
        <ellipse cx="305" cy="260" rx="28" ry="6" fill="#5C3A20" opacity="0.6" />
      </g>

      <g opacity="0.75">
        <path
          d="M 305 252 Q 302 246 305 240"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 312 252 Q 309 244 313 236"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>

      <g opacity="0.65" filter="url(#wc-soft-g)">
        <ellipse cx="60" cy="320" rx="50" ry="40" fill="#9BC09E" />
        <rect x="55" y="280" width="10" height="50" fill="#7BA67E" />
        <rect x="50" y="332" width="20" height="6" fill="#5A4632" />
      </g>

      <rect width="400" height="400" fill="#FAF7F2" filter="url(#wc-paper-g)" opacity="0.35" />
    </svg>
  );
}
