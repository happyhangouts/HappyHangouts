import React from "react";

interface CircledHighlightProps {
  children: React.ReactNode;
  className?: string;
  circleColor?: string;
}

/**
 * CircledHighlight:
 * Renders an authentic rounded loop/circle enclosing the highlighted word or phrase
 * in official brand Sky (#3DAAFC) accent.
 */
export default function CircledHighlight({
  children,
  className = "",
  circleColor = "#3DAAFC"
}: CircledHighlightProps) {
  return (
    <span className={`relative inline-block px-2 py-0.5 mx-0.5 font-bold ${className}`}>
      <span className="relative z-10 text-inherit">{children}</span>
      <svg
        className="absolute -inset-x-2 -inset-y-1.5 w-[calc(100%+16px)] h-[calc(100%+12px)] pointer-events-none select-none"
        viewBox="0 0 160 54"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 14 30 C 18 12, 54 6, 96 6 C 138 6, 154 15, 152 28 C 149 42, 114 48, 62 48 C 24 48, 8 40, 11 26 C 14 14, 42 8, 80 8"
          stroke={circleColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="400"
          strokeDashoffset="0"
          opacity="0.95"
        />
      </svg>
    </span>
  );
}
