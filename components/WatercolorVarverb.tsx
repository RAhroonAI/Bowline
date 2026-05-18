export function WatercolorVarverb() {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <filter id="wc-edge-v" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="2"
            seed="13"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" />
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        <filter id="wc-soft-v" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="2"
            seed="17"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="wc-paper-v">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="9" />
          <feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.30  0 0 0 0 0.18  0 0 0 0.06 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>

        <radialGradient id="v-sky" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#F7EED1" />
          <stop offset="60%" stopColor="#E8F0F7" />
          <stop offset="100%" stopColor="#C5DEEC" />
        </radialGradient>
        <linearGradient id="v-meadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8C6A4" />
          <stop offset="100%" stopColor="#7BA67E" />
        </linearGradient>
        <linearGradient id="v-hills" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8C9B5" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#9BAE9A" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <rect width="400" height="400" fill="#F4EFE5" />

      <ellipse cx="200" cy="140" rx="280" ry="180" fill="url(#v-sky)" filter="url(#wc-soft-v)" />

      <ellipse cx="200" cy="280" rx="320" ry="65" fill="url(#v-hills)" opacity="0.8" filter="url(#wc-soft-v)" />
      <ellipse cx="120" cy="295" rx="180" ry="38" fill="#A8C6A4" opacity="0.6" filter="url(#wc-soft-v)" />
      <ellipse cx="290" cy="290" rx="180" ry="34" fill="#9BAE9A" opacity="0.55" filter="url(#wc-soft-v)" />

      <ellipse cx="200" cy="340" rx="320" ry="80" fill="url(#v-meadow)" opacity="0.9" filter="url(#wc-edge-v)" />

      <g opacity="0.92">
        <ellipse cx="95" cy="135" rx="38" ry="50" fill="#9BC09E" filter="url(#wc-soft-v)" opacity="0.75" />
        <ellipse cx="130" cy="115" rx="32" ry="42" fill="#7BA67E" filter="url(#wc-soft-v)" opacity="0.7" />
        <rect x="106" y="160" width="13" height="140" fill="#F8F4ED" filter="url(#wc-edge-v)" />
        <rect x="105" y="172" width="15" height="3" fill="#2A2E26" opacity="0.85" />
        <rect x="106" y="198" width="13" height="2" fill="#2A2E26" opacity="0.7" />
        <rect x="105" y="225" width="15" height="3" fill="#2A2E26" opacity="0.85" />
        <rect x="106" y="255" width="13" height="2" fill="#2A2E26" opacity="0.65" />
        <rect x="105" y="280" width="15" height="2.5" fill="#2A2E26" opacity="0.75" />
      </g>

      <g opacity="0.88">
        <ellipse cx="295" cy="155" rx="34" ry="44" fill="#9BC09E" filter="url(#wc-soft-v)" opacity="0.7" />
        <ellipse cx="325" cy="140" rx="28" ry="36" fill="#7BA67E" filter="url(#wc-soft-v)" opacity="0.7" />
        <rect x="304" y="180" width="12" height="125" fill="#F8F4ED" filter="url(#wc-edge-v)" />
        <rect x="303" y="195" width="14" height="2.5" fill="#2A2E26" opacity="0.8" />
        <rect x="304" y="220" width="12" height="2" fill="#2A2E26" opacity="0.65" />
        <rect x="303" y="248" width="14" height="3" fill="#2A2E26" opacity="0.85" />
        <rect x="304" y="278" width="12" height="2" fill="#2A2E26" opacity="0.6" />
      </g>

      <g opacity="0.85">
        <ellipse cx="205" cy="175" rx="22" ry="28" fill="#9BC09E" filter="url(#wc-soft-v)" opacity="0.6" />
        <rect x="210" y="200" width="8" height="100" fill="#F8F4ED" filter="url(#wc-edge-v)" />
        <rect x="209" y="218" width="10" height="2" fill="#2A2E26" opacity="0.75" />
        <rect x="210" y="245" width="8" height="1.8" fill="#2A2E26" opacity="0.65" />
        <rect x="209" y="275" width="10" height="2" fill="#2A2E26" opacity="0.7" />
      </g>

      <g>
        <circle cx="60" cy="345" r="10" fill="#F4C430" filter="url(#wc-edge-v)" />
        <circle cx="60" cy="345" r="5" fill="#E89B1F" />
        <circle cx="95" cy="358" r="7" fill="#F4C430" filter="url(#wc-edge-v)" opacity="0.95" />
        <circle cx="95" cy="358" r="3" fill="#E89B1F" />
        <circle cx="160" cy="355" r="9" fill="#FFE07A" filter="url(#wc-edge-v)" />
        <circle cx="160" cy="355" r="4.5" fill="#F4C430" />
        <circle cx="160" cy="355" r="2" fill="#E89B1F" />
        <circle cx="240" cy="362" r="8" fill="#F4C430" filter="url(#wc-edge-v)" />
        <circle cx="240" cy="362" r="4" fill="#E89B1F" />
        <circle cx="285" cy="350" r="7" fill="#FFE07A" filter="url(#wc-edge-v)" opacity="0.9" />
        <circle cx="285" cy="350" r="3.5" fill="#F4C430" />
        <circle cx="335" cy="360" r="9" fill="#F4C430" filter="url(#wc-edge-v)" />
        <circle cx="335" cy="360" r="4" fill="#E89B1F" />
      </g>

      <path
        d="M 250 95 Q 256 91 262 95 Q 256 93 250 95"
        fill="none"
        stroke="#1E3A5F"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M 285 110 Q 290 107 295 110 Q 290 108 285 110"
        fill="none"
        stroke="#1E3A5F"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />

      <rect width="400" height="400" fill="#FAF7F2" filter="url(#wc-paper-v)" opacity="0.35" />
    </svg>
  );
}
