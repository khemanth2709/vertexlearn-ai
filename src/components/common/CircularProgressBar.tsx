import React from 'react';

export interface CircularProgressBarProps {
  /** Percentage completion value (0 - 100) */
  percentage: number;
  /** Diameter of the SVG circle in pixels (default: 56) */
  size?: number;
  /** Thickness of the circular stroke in pixels (default: 5) */
  strokeWidth?: number;
  /** Background track color class or hex (default: 'stroke-slate-800') */
  trackColor?: string;
  /** Whether to show the percentage text in the center (default: true) */
  showText?: boolean;
  /** Optional custom CSS classes for the outer wrapper */
  className?: string;
  /** Optional custom CSS classes for the percentage label */
  textClassName?: string;
}

/**
 * CircularProgressBar:
 * SVG-based circular progress ring responsive to a 'percentage' prop (0-100).
 * Features Tailwind styles and SVG linear gradients with cyan/blue coloring,
 * and displays the percentage text in the center.
 */
export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  size = 56,
  strokeWidth = 5,
  trackColor = 'stroke-[#E5E7EB]',
  showText = true,
  className = '',
  textClassName = ''
}) => {
  // Clamp value between 0 and 100
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));

  // SVG dimensions
  const center = size / 2;
  const radius = Math.max(0, (size - strokeWidth) / 2);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${clamped}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 origin-center overflow-visible"
      >
        {/* Background track circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={`${trackColor} transition-colors`}
          strokeWidth={strokeWidth}
          fill="none"
          stroke="currentColor"
        />

        {/* Dynamic progress circle with solid crimson stroke */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#DC2626"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center percentage text */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className={`font-bold tracking-tight text-[#1F2937] ${
              size < 48 ? 'text-[10px]' : size < 70 ? 'text-xs' : 'text-sm'
            } ${textClassName}`}
          >
            {clamped}%
          </span>
        </div>
      )}
    </div>
  );
};

export default CircularProgressBar;
