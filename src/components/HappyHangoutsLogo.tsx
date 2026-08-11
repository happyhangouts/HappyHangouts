import React from "react";

interface HappyHangoutsLogoProps {
  variant?: "full" | "header" | "icon";
  className?: string;
  theme?: "light" | "dark" | "brand";
}

export default function HappyHangoutsLogo({
  variant = "full",
  className = "",
  theme = "brand"
}: HappyHangoutsLogoProps) {
  // Theme coloring classes
  // brand: uses the gorgeous deep blue gradient and colors from the image
  // dark: optimized for dark interfaces
  // light: optimized for clean white/slate interfaces
  
  const bgStyle = theme === "brand" 
    ? "bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white shadow-2xl p-8 sm:p-12 rounded-[40px] border border-blue-500/30" 
    : theme === "dark" 
      ? "bg-slate-950 text-white p-8 rounded-[40px] border border-white/5"
      : "bg-white text-slate-900 p-8 rounded-[40px] border border-slate-100 shadow-md";

  const leftFigureColor = theme === "brand" ? "#FFFFFF" : theme === "dark" ? "#FFFFFF" : "#1E3A8A";
  const rightFigureColor = theme === "brand" ? "#44B0FF" : "#3B82F6";
  const sparkColor = theme === "brand" ? "#FFFFFF" : theme === "dark" ? "#3B82F6" : "#2563EB";
  const textColor1 = theme === "brand" ? "#FFFFFF" : theme === "dark" ? "#FFFFFF" : "#1E3A8A";
  const textColor2 = theme === "brand" ? "#44B0FF" : "#3B82F6";
  const taglineColor1 = theme === "brand" ? "#FFFFFF" : theme === "dark" ? "#CBD5E1" : "#1E293B";
  const taglineColor2 = theme === "brand" ? "#44B0FF" : "#2563EB";

  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${className}`}
        id="hh-logo-icon"
      >
        {/* Connection Spark (Lines above high-five) */}
        <g id="spark-lines" stroke={sparkColor} strokeWidth="3" strokeLinecap="round">
          <line x1="100" y1="20" x2="100" y2="30" />
          <line x1="88" y1="25" x2="93" y2="33" />
          <line x1="112" y1="25" x2="107" y2="33" />
        </g>

        {/* Left Figure (White / Dark Slate) */}
        <g id="left-figure">
          {/* Head */}
          <circle cx="75" cy="52" r="11" fill={leftFigureColor} />
          {/* Body with raised arm & curved body leaning right */}
          <path
            d="M 52,112 
               C 52,112 55,90 60,82 
               C 65,74 72,71 78,70 
               C 84,69 88,71 92,75 
               C 96,79 100,105 100,105 
               C 100,105 94,106 91,95 
               C 88,84 83,81 80,81 
               C 76,81 74,85 73,92 
               C 71,101 70,112 70,112 
               Z"
            fill={leftFigureColor}
            stroke={leftFigureColor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Legs */}
          <path
            d="M 52,111 
               C 49,111 47,117 47,126 
               L 47,143 
               C 47,148 51,152 56,152 
               C 61,152 64,148 64,143 
               L 64,128 
               C 64,124 67,122 71,122 
               C 75,122 78,124 78,128 
               L 78,143 
               C 78,148 82,152 87,152 
               C 92,152 96,148 96,143 
               L 96,122
               C 96,115 91,111 87,111
               Z"
            fill={leftFigureColor}
          />
        </g>

        {/* Right Figure (Sky Blue) */}
        <g id="right-figure">
          {/* Head */}
          <circle cx="125" cy="52" r="11" fill={rightFigureColor} />
          {/* Body with raised arm & curved body leaning left */}
          <path
            d="M 148,112 
               C 148,112 145,90 140,82 
               C 135,74 128,71 122,70 
               C 116,69 112,71 108,75 
               C 104,79 100,105 100,105 
               C 100,105 106,106 109,95 
               C 112,84 117,81 120,81 
               C 124,81 126,85 127,92 
               C 129,101 130,112 130,112 
               Z"
            fill={rightFigureColor}
            stroke={rightFigureColor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Legs */}
          <path
            d="M 148,111 
               C 151,111 153,117 153,126 
               L 153,143 
               C 153,148 149,152 144,152 
               C 139,152 136,148 136,143 
               L 136,128 
               C 136,124 133,122 129,122 
               C 125,122 122,124 122,128 
               L 122,143 
               C 122,148 118,152 113,152 
               C 108,152 104,148 104,143 
               L 104,122
               C 104,115 109,111 113,111
               Z"
            fill={rightFigureColor}
          />
        </g>
      </svg>
    );
  }

  if (variant === "header") {
    return (
      <div className={`flex items-center gap-3 ${className}`} id="hh-logo-header">
        {/* Clean, smaller icon for the navbar */}
        <div className="w-10 h-8 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 200 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Spark */}
            <g stroke={rightFigureColor} strokeWidth="3.5" strokeLinecap="round">
              <line x1="100" y1="20" x2="100" y2="30" />
              <line x1="88" y1="25" x2="93" y2="33" />
              <line x1="112" y1="25" x2="107" y2="33" />
            </g>
            {/* Left Character (Dark Gray / White depending on context) */}
            <circle cx="75" cy="52" r="12" fill={textColor1} />
            <path
              d="M 52,112 C 52,112 55,90 60,82 C 65,74 72,71 78,70 C 84,69 88,71 92,75 C 96,79 100,105 100,105 C 100,105 94,106 91,95 C 88,84 83,81 80,81 C 76,81 74,85 73,92 C 71,101 70,112 70,112 Z"
              fill={textColor1}
            />
            <path
              d="M 52,111 C 49,111 47,117 47,126 L 47,143 C 47,148 51,152 56,152 C 61,152 64,148 64,143 L 64,128 C 64,124 67,122 71,122 C 75,122 78,124 78,128 L 78,143 C 78,148 82,152 87,152 C 92,152 96,148 96,143 L 96,122 C 96,115 91,111 87,111 Z"
              fill={textColor1}
            />
            {/* Right Character (Sky Blue) */}
            <circle cx="125" cy="52" r="12" fill={textColor2} />
            <path
              d="M 148,112 C 148,112 145,90 140,82 C 135,74 128,71 122,70 C 116,69 112,71 108,75 C 104,79 100,105 100,105 C 100,105 106,106 109,95 C 112,84 117,81 120,81 C 124,81 126,85 127,92 C 129,101 130,112 130,112 Z"
              fill={textColor2}
            />
            <path
              d="M 148,111 C 151,111 153,117 153,126 L 153,143 C 153,148 149,152 144,152 C 139,152 136,148 136,143 L 136,128 C 136,124 133,122 129,122 C 125,122 122,124 122,128 L 122,143 C 122,148 118,152 113,152 C 108,152 104,148 104,143 L 104,122 C 104,115 109,111 113,111 Z"
              fill={textColor2}
            />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-extrabold tracking-[-0.03em] text-lg font-display leading-none">
            <span style={{ color: textColor1 }}>Happy</span>{" "}
            <span style={{ color: textColor2 }}>Hangouts</span>
          </span>
          <span className="text-[9.5px] font-semibold font-sans tracking-tight text-slate-500 mt-1 flex items-center gap-1">
            <span className={theme === "light" ? "text-slate-700" : "text-slate-300"}>Akele Kyu....?</span>
            <span className="text-blue-500 font-bold">Happy Hangouts Hai na</span>
          </span>
        </div>
      </div>
    );
  }

  // Full brand card version (perfect match of the user's uploaded logo)
  return (
    <div className={`${bgStyle} ${className}`} id="hh-logo-full">
      <div className="flex flex-col items-center text-center">
        
        {/* Avatars Section */}
        <div className="w-40 h-32 sm:w-48 sm:h-36 mb-6">
          <svg
            viewBox="0 0 200 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Spark Above Hands */}
            <g stroke={sparkColor} strokeWidth="3.5" strokeLinecap="round" className="animate-pulse">
              <line x1="100" y1="18" x2="100" y2="28" />
              <line x1="86" y1="23" x2="92" y2="32" />
              <line x1="114" y1="23" x2="108" y2="32" />
            </g>

            {/* Left Figure */}
            <circle cx="74" cy="50" r="12" fill={leftFigureColor} />
            {/* Hand Raised & curve */}
            <path
              d="M 52,112 C 52,112 55,90 60,82 C 65,74 72,71 78,70 C 84,69 88,71 92,75 C 96,79 100,105 100,105 C 100,105 94,106 91,95 C 88,84 83,81 80,81 C 76,81 74,85 73,92 C 71,101 70,112 70,112 Z"
              fill={leftFigureColor}
            />
            {/* Legs */}
            <path
              d="M 52,111 C 49,111 47,117 47,126 L 47,143 C 47,148 51,152 56,152 C 61,152 64,148 64,143 L 64,128 C 64,124 67,122 71,122 C 75,122 78,124 78,128 L 78,143 C 78,148 82,152 87,152 C 92,152 96,148 96,143 L 96,122 C 96,115 91,111 87,111 Z"
              fill={leftFigureColor}
            />

            {/* Right Figure */}
            <circle cx="126" cy="50" r="12" fill={rightFigureColor} />
            {/* Hand Raised & curve */}
            <path
              d="M 148,112 C 148,112 145,90 140,82 C 135,74 128,71 122,70 C 116,69 112,71 108,75 C 104,79 100,105 100,105 C 100,105 106,106 109,95 C 112,84 117,81 120,81 C 124,81 126,85 127,92 C 129,101 130,112 130,112 Z"
              fill={rightFigureColor}
            />
            {/* Legs */}
            <path
              d="M 148,111 C 151,111 153,117 153,126 L 153,143 C 153,148 149,152 144,152 C 139,152 136,148 136,143 L 136,128 C 136,124 133,122 129,122 C 125,122 122,124 122,128 L 122,143 C 122,148 118,152 113,152 C 108,152 104,148 104,143 L 104,122 C 104,115 109,111 113,111 Z"
              fill={rightFigureColor}
            />
          </svg>
        </div>

        {/* Text Area - Stacked Happy / Hangouts matching official brand graphic */}
        <div className="flex flex-col items-center leading-[0.92] tracking-tight my-3 font-black font-display select-none">
          <span className="text-4xl sm:text-6xl" style={{ color: textColor1 }}>Happy</span>
          <span className="text-4xl sm:text-6xl" style={{ color: textColor2 }}>Hangouts</span>
        </div>

        {/* Divider with Heart */}
        <div className="flex items-center justify-center gap-3 w-full max-w-[280px] my-5">
          <div className="h-[1px] flex-1" style={{ backgroundColor: theme === "brand" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)" }} />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 animate-pulse"
            style={{ color: rightFigureColor }}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="currentColor"
            />
          </svg>
          <div className="h-[1px] flex-1" style={{ backgroundColor: theme === "brand" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.1)" }} />
        </div>

        {/* Tagline */}
        <div className="mt-2 text-center">
          <p className="text-sm sm:text-base font-semibold tracking-wide">
            <span style={{ color: taglineColor1 }}>Akele Kyu....?</span>{" "}
            <span className="relative inline-block ml-1">
              <span style={{ color: taglineColor2 }}>Happy Hangouts Hai na</span>
              {/* Swoosh Underline */}
              <svg
                viewBox="0 0 160 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-0 -bottom-1.5 w-full h-2"
              >
                <path
                  d="M2 10C35 4.5 105 1.5 158 8.5"
                  stroke={rightFigureColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
