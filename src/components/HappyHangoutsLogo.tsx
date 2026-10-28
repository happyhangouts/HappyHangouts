import React from "react";

interface HappyHangoutsLogoProps {
  variant?: "full" | "header" | "icon" | "image";
  className?: string;
  theme?: "light" | "dark" | "brand";
  size?: "sm" | "md" | "lg" | "xl";
}

export const LOGO_IMAGE_PATH = "/assets/aistudio/Happy_Hangouts_Logo_1d102f6e.jpg";

export default function HappyHangoutsLogo({
  variant = "header",
  className = "",
  theme = "light",
  size = "md"
}: HappyHangoutsLogoProps) {
  
  // 1. Pure image asset variant
  if (variant === "image") {
    return (
      <img
        src={LOGO_IMAGE_PATH}
        alt="Happy Hangouts Logo"
        className={`rounded-2xl object-cover shadow-md ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  // 2. Icon badge only
  if (variant === "icon") {
    return (
      <div className={`overflow-hidden rounded-xl border border-blue-200/80 shadow-xs shrink-0 ${className}`}>
        <img
          src={LOGO_IMAGE_PATH}
          alt="Happy Hangouts Icon"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // 3. Navbar header lockup: Authentic official brand mark + crisp legible typography
  if (variant === "header") {
    return (
      <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`} id="hh-logo-header">
        {/* Official Brand Emblem Thumbnail */}
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-blue-200 shadow-xs shrink-0 bg-blue-700">
          <img
            src={LOGO_IMAGE_PATH}
            alt="Happy Hangouts Logo"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Text Lockup with High-Contrast Legibility */}
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1 font-display">
            <span className="font-black text-slate-950 text-base sm:text-xl tracking-tight">
              Happy
            </span>
            <span className="font-black text-blue-600 text-base sm:text-xl tracking-tight">
              Hangouts
            </span>
          </div>
          <div className="text-[10px] sm:text-xs font-semibold tracking-tight text-slate-700 flex items-center gap-1 mt-0.5 whitespace-nowrap">
            <span className="text-slate-800">Akele Kyu....?</span>
            <span className="text-blue-600 font-extrabold hidden xs:inline">Happy Hangouts Hai na</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. Full Brand Card display (Showcases the user's authentic official brand asset)
  const sizeClasses = {
    sm: "max-w-[200px]",
    md: "max-w-[280px]",
    lg: "max-w-[360px]",
    xl: "max-w-[440px]"
  }[size];

  return (
    <div 
      className={`rounded-3xl overflow-hidden shadow-xl border-2 border-blue-400/40 bg-blue-700 ${sizeClasses} ${className}`}
      id="hh-logo-full"
    >
      <img
        src={LOGO_IMAGE_PATH}
        alt="Happy Hangouts — Akele Kyu....? Happy Hangouts Hai na"
        className="w-full h-auto object-contain block"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
