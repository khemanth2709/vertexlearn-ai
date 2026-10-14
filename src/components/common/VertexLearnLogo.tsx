import React from 'react';

interface VertexLearnLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'icon-only' | 'light' | 'white';
}

/**
 * Official VertexLearn AI Education Logo Component
 * Exact reproduction from the official logo asset:
 * - Mortarboard graduation cap atop faceted 'V'
 * - Inner learner celebrating with raised arms
 * - Orbital purple-cyan swoosh with 4-point sparkle star
 * - Distinctive two-tone wordmark: Vertex (Navy) + Learn (Bright Blue) + AI (Royal Purple)
 * - Subtitle: Intelligent Learning Management System
 */
export const VertexLearnLogo: React.FC<VertexLearnLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'full',
}) => {
  const iconDimensions = {
    sm: { width: 34, height: 34 },
    md: { width: 44, height: 44 },
    lg: { width: 60, height: 60 },
    xl: { width: 84, height: 84 },
  }[size];

  const titleSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black',
  }[size];

  const subtitleSizes = {
    sm: 'text-[8px]',
    md: 'text-[9.5px]',
    lg: 'text-xs',
    xl: 'text-sm',
  }[size];

  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Vector Emblem */}
      <svg
        width={iconDimensions.width}
        height={iconDimensions.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
        aria-label="VertexLearn AI Official Emblem"
      >
        {/* Orbital Swoosh (Purple to Blue) */}
        <path
          d="M12 56 C6 62, 18 68, 38 66 C28 62, 22 56, 32 46"
          stroke="#0084FF"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M48 68 C72 68, 92 56, 92 42 C92 34, 82 30, 72 32"
          stroke="#7C3AED"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 4-point Sparkle Star */}
        <path
          d="M93 28 Q93 33 97 33 Q93 33 93 38 Q93 33 89 33 Q93 33 93 28 Z"
          fill="#7C3AED"
        />

        {/* Faceted Blue 'V' - Left Wing */}
        <polygon points="18,34 46,84 52,84 32,34" fill="#0075FF" />
        <polygon points="26,34 46,84 38,84 18,34" fill="#0052CC" />

        {/* Faceted Purple 'V' - Right Wing */}
        <polygon points="82,34 54,84 48,84 68,34" fill="#7C3AED" />
        <polygon points="74,34 54,84 62,84 82,34" fill="#6D28D9" />

        {/* Inner Learner Torso Celebrating with Raised Arms */}
        <path
          d="M50 48 C44 48, 40 52, 38 60 L44 80 L56 80 L62 60 C60 52, 56 48, 50 48 Z"
          fill="#00B4D8"
        />
        {/* Raised Arms */}
        <path
          d="M44 58 L34 44 L40 40 L48 54 Z"
          fill="#0096C7"
        />
        <path
          d="M56 58 L66 44 L60 40 L52 54 Z"
          fill="#0077B6"
        />

        {/* Learner Head */}
        <circle cx="50" cy="40" r="6" fill="#0096C7" />

        {/* Academic Mortarboard Graduation Cap */}
        <polygon points="50,14 84,27 50,37 16,27" fill="#0052CC" />
        <polygon points="50,15 78,26 50,34 22,26" fill="#0075FF" />
        <path d="M30 28 L30 38 C30 44 70 44 70 38 L70 28 Z" fill="#003E99" />
        {/* Cap Tassel */}
        <path d="M80 28 L86 38 L83 39 L78 30 Z" fill="#00B4D8" />
        <circle cx="84.5" cy="39" r="2.5" fill="#00B4D8" />
      </svg>

      {/* Official Typography Wordmark */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col justify-center leading-tight">
          <div className={`flex items-baseline tracking-tight ${titleSizes}`}>
            <span className={isWhite ? 'text-white' : 'text-[#0B1B3D]'}>Vertex</span>
            <span className="text-[#0075FF]">Learn</span>
            <span className="ml-0.5 text-[#7C3AED] font-black">AI</span>
          </div>
          {showSubtitle && (
            <span
              className={`font-normal tracking-normal ${subtitleSizes} ${
                isWhite ? 'text-slate-200' : 'text-[#475569]'
              }`}
            >
              Intelligent Learning Management System
            </span>
          )}
        </div>
      )}
    </div>
  );
};
