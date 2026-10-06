import React from 'react';

interface SumichLogoProps {
  className?: string;
  size?: number | string;
  color?: string;
}

/**
 * Official SUMICH SOLUTIONS LIMITED Crest & Logo
 * Designed for private security excellence & regulatory distinction:
 * - Golden heraldic security shield with protective double-rim bevel
 * - Majestic Soaring Vigilance Eagle crest with outspread wings
 * - Sculpted bold 'S' monogram for SUMICH SOLUTIONS
 * - Triple stars of vigilance, integrity, and elite service
 * - Security chevrons and golden metallic gradients
 */
export const SumichLogo: React.FC<SumichLogoProps> = ({
  className = "w-7 h-8",
  size,
  color
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="SUMICH SOLUTIONS LIMITED Official Security Crest"
    >
      <defs>
        {/* Rich Metallic Amber-Gold Gradients */}
        <linearGradient id="sumichGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="25%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        <linearGradient id="sumichGoldLight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="40%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        <linearGradient id="sumichShieldPlate" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#090D16" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="sumichEagleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        <linearGradient id="sumichWingLeft" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        <linearGradient id="sumichWingRight" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        <filter id="sumichGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#F59E0B" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* 1. Outer Heraldic Security Shield Background & Border */}
      <path
        d="M 50 18
           L 84 25
           C 84 54 75 78 50 101
           C 25 78 16 54 16 25
           Z"
        fill="url(#sumichShieldPlate)"
        stroke={color || "url(#sumichGoldGrad)"}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* 2. Inner Shield Inset Bevel Frame */}
      <path
        d="M 50 23
           L 80 29
           C 80 52 72 74 50 95
           C 28 74 20 52 20 29
           Z"
        fill="none"
        stroke={color || "url(#sumichGoldLight)"}
        strokeWidth="1.2"
        strokeOpacity="0.75"
        strokeLinejoin="round"
      />

      {/* 3. Eagle Wings of Vigilance - Outstretched at Top of Shield */}
      {/* Left Wing Outer Feathers */}
      <path
        d="M 46 14
           C 36 9 24 7 10 11
           C 16 15 25 18 36 20
           C 26 20 17 22 12 26
           C 20 28 29 28 40 27
           C 30 28 22 32 17 37
           C 26 36 34 33 44 28
           Z"
        fill={color || "url(#sumichWingLeft)"}
        stroke={color || "#F59E0B"}
        strokeWidth="0.5"
      />

      {/* Right Wing Outer Feathers */}
      <path
        d="M 54 14
           C 64 9 76 7 90 11
           C 84 15 75 18 64 20
           C 74 20 83 22 88 26
           C 80 28 71 28 60 27
           C 70 28 78 32 83 37
           C 74 36 66 33 56 28
           Z"
        fill={color || "url(#sumichWingRight)"}
        stroke={color || "#F59E0B"}
        strokeWidth="0.5"
      />

      {/* 4. Vigilant Eagle Head & Crown Crest */}
      <path
        d="M 50 5
           C 51.5 5 53 7 53 9
           C 54.5 9 55.5 10.5 55 12
           C 54.5 13.5 53 14 52 14.5
           L 50 18
           L 48 14.5
           C 47 14 45.5 13.5 45 12
           C 44.5 10.5 45.5 9 47 9
           C 47 7 48.5 5 50 5
           Z"
        fill={color || "url(#sumichEagleGrad)"}
        filter="url(#sumichGlow)"
      />
      {/* Eagle Beak */}
      <path
        d="M 50 11
           L 46.5 13.5
           L 50 15
           Z"
        fill="#FEF08A"
      />
      {/* Eagle Keen Eye */}
      <circle cx="48.5" cy="11.5" r="0.9" fill="#0F172A" />

      {/* 5. Triple Stars of Security & Standards */}
      {/* Left Star */}
      <polygon
        points="37,30 38.2,33 41.5,33.2 38.9,35.2 39.8,38.3 37,36.5 34.2,38.3 35.1,35.2 32.5,33.2 35.8,33"
        fill={color || "url(#sumichGoldLight)"}
        transform="scale(0.85) translate(6, 4)"
      />
      {/* Center Star (Prominent) */}
      <polygon
        points="50,22 51.5,25.8 55.5,26 52.3,28.5 53.4,32.4 50,30.2 46.6,32.4 47.7,28.5 44.5,26 48.5,25.8"
        fill={color || "url(#sumichGoldLight)"}
        filter="url(#sumichGlow)"
      />
      {/* Right Star */}
      <polygon
        points="63,30 64.2,33 67.5,33.2 64.9,35.2 65.8,38.3 63,36.5 60.2,38.3 61.1,35.2 58.5,33.2 61.8,33"
        fill={color || "url(#sumichGoldLight)"}
        transform="scale(0.85) translate(11, 4)"
      />

      {/* 6. Sculpted Bold "S" Monogram (for SUMICH SOLUTIONS) */}
      {/* Outer Drop Highlight */}
      <path
        d="M 66 43
           L 66 48
           L 61.5 48
           C 59.5 42 55.5 37.5 49.5 37.5
           C 42.5 37.5 37 41.5 37 47
           C 37 53 42 56 50.5 58.5
           C 61 61.8 67.5 66 67.5 74.5
           C 67.5 83.5 59.5 89.5 49 89.5
           C 38 89.5 31.5 83.5 30.5 75
           L 38 75
           C 38.8 80.5 43.5 84 49 84
           C 54.5 84 59.5 80.5 59.5 74.5
           C 59.5 69 54.5 65.5 46.5 63
           C 36.5 59.8 29.5 55 29.5 47
           C 29.5 38.5 37.5 32 49.5 32
           C 59 32 65 37 66 43
           Z"
        fill={color || "url(#sumichGoldGrad)"}
        stroke={color || "#FFFBEB"}
        strokeWidth="0.8"
        strokeLinejoin="round"
        filter="url(#sumichGlow)"
      />

      {/* Inner "S" Facet Chamfer Line for 3D Chiseled Metallic Effect */}
      <path
        d="M 49.5 35
           C 40.5 35 34 39.5 34 47
           C 34 52.5 39 55.5 48 58.5
           M 50 63
           C 60 66 63.5 69.5 63.5 74.5
           C 63.5 81 57.5 86 49 86"
        stroke="#FFFBEB"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeOpacity="0.6"
        fill="none"
      />

      {/* 7. Lower Security Chevron of Protection */}
      <path
        d="M 38 90
           L 50 96
           L 62 90"
        stroke={color || "url(#sumichGoldLight)"}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Apex Diamond Emblem */}
      <polygon
        points="50,97 51.8,99 50,101 48.2,99"
        fill={color || "#FEF08A"}
      />
    </svg>
  );
};

