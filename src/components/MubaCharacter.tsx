import React, { useState } from "react";
import { Sparkles, MessageSquare, ArrowRight, RefreshCw } from "lucide-react";
import { audio } from "../utils/audio";

interface MubaCharacterProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export default function MubaCharacter({
  className = "",
  size = "md",
  interactive = true,
}: MubaCharacterProps) {
  const [speechIndex, setSpeechIndex] = useState(0);

  const bubbleSpeeches = [
    {
      title: "Hey! I'm Muba. ☕️",
      text: "Delhi NCR can feel huge and busy. I'm here to help you get off your screen and share hobbies, passions, goals and real-life experiences.",
      action: "Next Tip"
    },
    {
      title: "Our core features, simply:",
      text: "Choose an experience category, verify your profile using Selfie Verification, and sync safely face-to-face using Happy Keys.",
      action: "Why trust us?"
    },
    {
      title: "Your safety is my priority:",
      text: "Every resident undergoes strict Selfie Verification. Plus, we use Happy Keys so you can connect in verified public hangout spots.",
      action: "Let's hang out!"
    }
  ];

  const handleNextSpeech = () => {
    audio.playClick();
    setSpeechIndex((prev) => (prev + 1) % bubbleSpeeches.length);
  };

  const currentSpeech = bubbleSpeeches[speechIndex];

  // Sizing mapping
  const svgDimensions = {
    sm: "w-44 h-72",
    md: "w-60 h-96",
    lg: "w-72 h-[420px]"
  };

  return (
    <div className={`flex flex-col items-center md:flex-row gap-6 ${className}`}>
      {/* MUBA HIGH-FIDELITY CHARACTER VECTOR ART */}
      <div className="relative shrink-0 group">
        {/* Soft elegant ambient gradient glow matching the visual identity */}
        <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-2xl group-hover:bg-blue-500/15 transition-all duration-700 pointer-events-none" />
        
        <svg
          className={`${svgDimensions[size]} relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.25)] hover:scale-102 transition-transform duration-500`}
          viewBox="0 0 200 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle floor shadow ellipse */}
          <ellipse cx="100" cy="335" rx="55" ry="8" fill="#1e293b" opacity="0.3" className="animate-pulse" />

          {/* LEFT ARM / HAND IN POCKET */}
          <path d="M125 150 C135 170, 145 200, 138 230" stroke="#0047AB" strokeWidth="18" strokeLinecap="round" />
          <path d="M138 230 C136 235, 128 245, 120 245" stroke="#1f2937" strokeWidth="16" strokeLinecap="round" />

          {/* LEGS & PANTS */}
          <path d="M85 220 L78 300 L72 318" stroke="#23272F" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M110 220 L115 285 L114 315" stroke="#1C1E24" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Torso crotch area */}
          <path d="M75 210 H120 V235 H75 Z" fill="#23272F" />

          {/* WHITE SNEAKERS */}
          <g transform="translate(56, 312)">
            <path d="M2 14 C2 10, 8 4, 18 4 C24 4, 28 8, 30 14 C30 16, 22 20, 10 20 C2 20, 2 16, 2 14 Z" fill="#FFFFFF" />
            <path d="M2 14 L18 4 L28 14" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M12 18 H26" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
            <circle cx="15" cy="9" r="1.5" fill="#94A3B8" />
            <circle cx="20" cy="9" r="1.5" fill="#94A3B8" />
          </g>
          <g transform="translate(98, 310)">
            <path d="M2 14 C2 10, 8 4, 18 4 C24 4, 28 8, 30 14 C30 16, 22 20, 10 20 C2 20, 2 16, 2 14 Z" fill="#F8FAFC" />
            <path d="M2 14 L18 4 L28 14" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M12 18 H26" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
            <circle cx="15" cy="9" r="1.5" fill="#94A3B8" />
            <circle cx="20" cy="9" r="1.5" fill="#94A3B8" />
          </g>

          {/* TORSO */}
          <path d="M68 130 C64 165, 68 220, 72 230 C75 235, 120 235, 122 230 C126 220, 130 165, 126 130 Z" fill="#FFFFFF" />
          
          {/* Open Blue Shirt Vest Panels */}
          <path d="M66 128 C62 160, 65 210, 72 225 L88 225 L82 128 Z" fill="#0E46A3" />
          <path d="M128 128 C132 160, 129 210, 122 225 L106 225 L112 128 Z" fill="#0E46A3" />

          {/* Collar Details */}
          <path d="M68 128 L82 140 L88 128" stroke="#1E56C3" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M126 128 L112 140 L106 128" stroke="#1E56C3" strokeWidth="3.5" fill="none" strokeLinecap="round" />

          {/* RIGHT ARM & COFFEE CUP */}
          <path d="M68 135 C58 150, 48 168, 52 185 C54 195, 74 198, 78 180" stroke="#0E46A3" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          
          {/* Hands holding coffee cup */}
          <path d="M72 178 C74 176, 80 176, 82 180 C84 184, 80 188, 75 188" stroke="#E0A983" strokeWidth="7" strokeLinecap="round" />

          {/* TAKEAWAY COFFEE CUP */}
          <g transform="translate(74, 162)">
            <path d="M2 10 L4 28 H14 L16 10 Z" fill="#E2E8F0" />
            <path d="M1 6 L3 10 H15 L17 6 Z" fill="#475569" />
            <rect x="3" y="14" width="11" height="8" rx="1.5" fill="#8B5A2B" />
            <circle cx="8.5" cy="18" r="2.2" fill="#EEDAC5" />
          </g>

          {/* NECK */}
          <path d="M90 115 H104 V130 H90 Z" fill="#E0A983" />
          <path d="M88 128 C94 133, 100 133, 106 128" stroke="#C28762" strokeWidth="1.5" fill="none" />

          {/* FACE */}
          <path d="M78 82 C78 65, 116 65, 116 82 C116 100, 116 105, 97 111 C78 105, 78 100, 78 82 Z" fill="#F3C19E" />

          {/* BEARD & MUSTACHE */}
          <path d="M78 82 C78 95, 84 107, 97 111 C110 107, 116 95, 116 82 C116 88, 112 101, 97 104 C82 101, 78 88, 78 82 Z" fill="#2D3139" />
          <path d="M86 92 C86 100, 90 102, 97 102 C104 102, 108 100, 108 92" stroke="#2D3139" strokeWidth="3" strokeLinecap="round" />
          <path d="M88 88 C92 87, 102 87, 106 88" stroke="#1F232B" strokeWidth="2.5" strokeLinecap="round" />

          {/* FRIENDLY SMILE */}
          <path d="M91 93 Q97 98 103 93" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* EYES */}
          <circle cx="89" cy="79" r="2.5" fill="#5F3F19" />
          <circle cx="89.5" cy="78" r="0.8" fill="#FFFFFF" />
          <circle cx="105" cy="79" r="2.5" fill="#5F3F19" />
          <circle cx="105.5" cy="78" r="0.8" fill="#FFFFFF" />

          {/* EYEBROWS */}
          <path d="M84 74 Q89 71 94 74" stroke="#1F232B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M100 74 Q105 71 110 74" stroke="#1F232B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* EARS */}
          <circle cx="77" cy="83" r="4.5" fill="#F3C19E" />
          <circle cx="117" cy="83" r="4.5" fill="#F3C19E" />

          {/* CURLY DARK BLACK HAIR */}
          <circle cx="80" cy="69" r="11" fill="#21252D" />
          <circle cx="90" cy="63" r="12" fill="#1E2129" />
          <circle cx="100" cy="59" r="13" fill="#282C36" />
          <circle cx="110" cy="63" r="12" fill="#1E2129" />
          <circle cx="120" cy="69" r="11" fill="#21252D" />
          <circle cx="76" cy="77" r="9" fill="#21252D" />
          <circle cx="121" cy="77" r="9" fill="#21252D" />
          
          <circle cx="84" cy="65" r="7" fill="#2F333F" />
          <circle cx="96" cy="59" r="8" fill="#3A3E4B" />
          <circle cx="106" cy="59" r="8" fill="#3A3E4B" />
          <circle cx="114" cy="65" r="7" fill="#2F333F" />
        </svg>

        {/* Dynamic Character Tag */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 px-4.5 py-1 rounded-full text-center shadow-md">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="text-[11px] font-black text-white font-display">Muba</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <p className="text-[8.5px] uppercase tracking-widest font-bold text-blue-400 font-mono">
            Vibe Anchor
          </p>
        </div>
      </div>

      {/* SPEECH BUBBLE INTERACTION */}
      {interactive && (
        <div className="flex-1 max-w-md bg-slate-900/90 border border-slate-800/80 p-6 rounded-[32px] shadow-2xl relative text-left animate-fadeIn">
          {/* Chat bubble pointer decoration */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-slate-900/90 border-b-[10px] border-b-transparent hidden md:block" />
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-b-[15px] border-b-slate-900/90 border-r-[10px] border-r-transparent block md:hidden" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-widest font-black text-blue-400 bg-blue-500/10 border border-blue-500/15 px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Curator Insight
              </span>
              <span className="text-[9.5px] font-mono text-slate-500 font-bold">
                {speechIndex + 1} of {bubbleSpeeches.length}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-extrabold text-base tracking-tight font-display">
                {currentSpeech.title}
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                {currentSpeech.text}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
              <p className="text-[10px] text-slate-500 italic font-medium">
                💡 Tap card to cycle through advice
              </p>
              
              <button
                onClick={handleNextSpeech}
                className="bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider py-2 px-4 rounded-xl transition-all duration-300 flex items-center gap-1.5 hover:shadow-lg shadow-sm"
              >
                <span>{currentSpeech.action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
