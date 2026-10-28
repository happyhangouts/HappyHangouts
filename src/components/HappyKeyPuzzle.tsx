import React, { useState } from "react";
import { audio } from "../utils/audio";
import confetti from "canvas-confetti";
import { Check, RotateCcw, Sparkles } from "lucide-react";

interface HappyKeyPuzzleProps {
  onConnect?: () => void;
  onReset?: () => void;
}

export default function HappyKeyPuzzle({ onConnect, onReset }: HappyKeyPuzzleProps) {
  const [viewMode, setViewMode] = useState<"front" | "back">("front");
  const [progress, setProgress] = useState<number>(35); // 35 (apart) to 100 (connected)
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setProgress(val);
    if (val >= 98) {
      triggerConnection();
    }
  };

  const triggerConnection = () => {
    setIsConnected(true);
    setProgress(100);
    audio.playConnect();
    confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.65 },
      colors: ["#0047BA", "#3B82F6", "#60A5FA", "#FFFFFF"]
    });
    if (onConnect) onConnect();
  };

  const handleReset = () => {
    audio.playClick();
    setIsConnected(false);
    setProgress(35);
    if (onReset) onReset();
  };

  const forceConnect = () => {
    triggerConnection();
  };

  // Puzzle offset calculations
  // At progress = 35, they are apart by 65px on each side.
  // At progress = 100, they are locked (translate = 0px).
  const apartDistance = 100 - progress; // ranges from 65 down to 0
  const leftTranslate = isConnected ? 0 : -apartDistance * 0.9;
  const rightTranslate = isConnected ? 0 : apartDistance * 0.9;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      
      {/* SIDE TOGGLE SWITCH (Matches screenshot precisely) */}
      <div className="mb-8 w-full flex flex-col items-center">
        <div className="flex items-center gap-12 text-slate-400 font-bold text-xs uppercase tracking-widest relative">
          
          {/* Front Side Tab */}
          <button
            onClick={() => {
              audio.playClick();
              setViewMode("front");
            }}
            className={`pb-2.5 transition-all relative ${
              viewMode === "front" 
                ? "text-[#0047BA] font-extrabold" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Front Side
            {viewMode === "front" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047BA] rounded-full" />
            )}
          </button>

          {/* Double-headed horizontal arrow */}
          <span className="text-slate-300 text-sm pb-2">⟷</span>

          {/* Back Side Tab */}
          <button
            onClick={() => {
              audio.playClick();
              setViewMode("back");
            }}
            className={`pb-2.5 transition-all relative ${
              viewMode === "back" 
                ? "text-[#0047BA] font-extrabold" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Back Side
            {viewMode === "back" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047BA] rounded-full" />
            )}
          </button>
        </div>
        
        {/* Horizontal thin line under tabs */}
        <div className="w-full max-w-md h-[1px] bg-slate-100 -mt-[1px] mb-6" />
      </div>

      {/* THE PUZZLE CANVAS BOARD */}
      <div className="relative w-full max-w-4xl bg-[#f8fafc] sm:bg-[#e0e9f4]/40 backdrop-blur-md rounded-[48px] p-4 sm:p-10 border border-white/60 shadow-xl overflow-hidden flex flex-col items-center min-h-[500px] justify-center">
        
        {/* Dynamic Glowing Halo behind puzzle when locked */}
        <div className={`absolute inset-0 bg-radial from-[#0047BA]/10 via-transparent to-transparent opacity-0 transition-opacity duration-1000 pointer-events-none -z-10 ${
          isConnected ? "opacity-100 animate-pulse" : "opacity-0"
        }`} />

        {/* Puzzle Assembly */}
        <div className="flex flex-col sm:flex-row items-center justify-center relative w-full select-none py-6 gap-6 sm:gap-0">
          
          {/* LEFT PUZZLE PIECE (Blue background) */}
          <div
            className="w-[280px] sm:w-[320px] h-[320px] bg-[#0047BA] rounded-3xl p-6 flex flex-col justify-between shadow-lg relative transition-all duration-150 z-20 border border-blue-700/20"
            style={{
              transform: `translateX(${leftTranslate}px)`,
              boxShadow: isConnected ? "0 20px 40px -10px rgba(0, 71, 186, 0.4)" : "0 10px 20px -5px rgba(0, 0, 0, 0.12)"
            }}
          >
            {/* The puzzle protruding peg on the right edge */}
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0047BA] -mr-4.5 z-30 transition-transform duration-150" 
              style={{
                boxShadow: isConnected ? "none" : "3px 0 6px rgba(0,0,0,0.15)"
              }}
            />

            {/* FRONT SIDE (LEFT) */}
            {viewMode === "front" ? (
              <div className="flex-1 flex flex-col justify-between text-white text-left h-full">
                
                {/* Cheering/Waving Figure (Waving right hand) */}
                <div className="w-full flex justify-center pt-1 h-32 relative">
                  <svg className="w-32 h-32 absolute bottom-0 right-[-10px]" viewBox="0 0 112 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Waving sparkles/rays */}
                    <path d="M75 12L80 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
                    <path d="M85 20L95 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
                    <path d="M80 14L89 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
                    
                    {/* Head */}
                    <circle cx="68" cy="40" r="13" fill="white" />
                    
                    {/* Torso */}
                    <path d="M38 128 C45 92, 58 78, 68 78 C76 78, 80 92, 84 128" fill="white" />
                    
                    {/* Right arm going up-right, ending exactly at the right border (x=112, y=50) */}
                    <path d="M68 76 C72 65, 88 48, 112 42" stroke="white" strokeWidth="15" strokeLinecap="round" />
                    
                    {/* Left arm resting down */}
                    <path d="M48 84 C40 90, 32 102, 30 112" stroke="white" strokeWidth="11" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Happy Title and subtitle */}
                <div className="space-y-2 text-center px-4 mt-2">
                  <h4 className="text-4xl font-extrabold tracking-tight font-display text-white">Happy</h4>
                  
                  {/* Heart Separator Line */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-[1px] bg-white/40 flex-1" />
                    <svg className="w-4 h-4 fill-white text-white shrink-0 animate-pulse" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <div className="h-[1px] bg-white/40 flex-1" />
                  </div>

                  <p className="text-base font-bold text-blue-100 tracking-wide">Akele Kyu....?</p>
                </div>

                {/* Code badge bottom-left */}
                <div className="mt-2 flex justify-between items-center text-[10px] font-mono tracking-wider font-extrabold text-blue-200">
                  <span className="border border-white/30 rounded-lg px-2.5 py-1 bg-white/10 uppercase">
                    CODE: HH-1045
                  </span>
                </div>

              </div>
            ) : (
              // BACK SIDE (LEFT - Café scene table part)
              <div className="flex-1 flex flex-col justify-between text-white text-left h-full">
                
                {/* Café Vector Left Half */}
                <div className="w-full flex-1 flex justify-center items-center relative min-h-[160px]">
                  
                  <svg className="w-full h-full min-h-[160px]" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Light cone from lamp at the right edge */}
                    <path d="M260 30 L150 200 H280 V30 Z" fill="url(#lamp-glow-left)" opacity="0.16" />

                    {/* Pendant Lamp Hanging at x=260 */}
                    <line x1="260" y1="0" x2="260" y2="30" stroke="white" strokeWidth="2" />
                    {/* Left half of shade */}
                    <path d="M245 30 H260 V38 H250 Z" fill="white" />

                    {/* Man on Chair */}
                    {/* Chair */}
                    <path d="M50 185 H30 L35 130 H60 Z" fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
                    <path d="M32 130 L25 80 C25 70, 38 70, 42 80 L48 130" stroke="#60A5FA" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                    
                    {/* Man Body */}
                    {/* Head & Hair */}
                    <circle cx="75" cy="70" r="11" fill="white" />
                    <path d="M63 65 C63 58, 75 55, 82 60 C85 63, 85 68, 82 72 C78 72, 75 69, 75 65" fill="#1E293B" />
                    {/* Torso in Blue Hoodie */}
                    <path d="M60 105 C60 85, 80 85, 88 100 L95 150 H50 Z" fill="#2563EB" stroke="white" strokeWidth="1" />
                    {/* Arm holding cup */}
                    <path d="M80 110 C95 110, 105 112, 113 118" stroke="white" strokeWidth="6" strokeLinecap="round" />
                    {/* Cup */}
                    <rect x="111" y="110" width="8" height="9" rx="2" fill="white" />
                    <path d="M119 112 C120 112, 120 115, 119 115" stroke="white" strokeWidth="1.2" />
                    
                    {/* Legs & Shoes */}
                    <path d="M65 150 L75 185 H95" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M80 150 L90 185 H110" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
                    {/* Sneakers */}
                    <rect x="85" y="181" width="16" height="7" rx="1.5" fill="white" />
                    <rect x="100" y="181" width="16" height="7" rx="1.5" fill="white" />

                    {/* Table (Left Half, cut off at x=280) */}
                    <path d="M190 135 H280" stroke="white" strokeWidth="4.5" strokeLinecap="round" />
                    {/* Leg at x=260 */}
                    <line x1="260" y1="135" x2="260" y2="200" stroke="white" strokeWidth="3" />
                    {/* Base at bottom */}
                    <path d="M230 198 H280" stroke="white" strokeWidth="3.5" strokeLinecap="round" />

                    {/* Potted plant on table */}
                    <rect x="225" y="120" width="10" height="15" rx="1.5" fill="white" />
                    <path d="M220 120 Q225 105 231 112 Z" fill="#10B981" />
                    <path d="M231 120 Q236 102 242 110 Z" fill="#34D399" />

                    {/* Steam rising */}
                    <path d="M113 105 Q115 97 112 92" stroke="white" strokeWidth="1.2" strokeLinecap="round" className="animate-pulse" />
                    <path d="M117 103 Q119 95 116 90" stroke="white" strokeWidth="1.2" strokeLinecap="round" className="animate-pulse" />

                    <defs>
                      <linearGradient id="lamp-glow-left" x1="260" y1="30" x2="210" y2="200" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FBBF24" />
                        <stop offset="1" stopColor="#FBBF24" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Subtitle bottom */}
                <div className="text-center space-y-1 pb-1 mt-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-wider">
                    <span>❤️</span>
                    <span className="uppercase text-[11px] tracking-widest font-extrabold text-blue-100">Two Pieces</span>
                    <span>❤️</span>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* CONNECTING ARROW INDICATOR (Only visible when apart) */}
          <div 
            className="absolute sm:static z-10 flex flex-col items-center justify-center transition-all duration-300 pointer-events-none"
            style={{
              opacity: isConnected ? 0 : 1,
              transform: `scale(${isConnected ? 0.8 : 1})`
            }}
          >
            <div className="bg-slate-900 text-white rounded-full p-2.5 shadow-xl border border-slate-800 flex items-center justify-center">
              <span className="text-sm font-extrabold tracking-widest animate-pulse px-1">⟷</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mt-2 font-mono">
              Align Key
            </span>
          </div>

          {/* RIGHT PUZZLE PIECE (White background with blue typography) */}
          <div
            className="w-[280px] sm:w-[320px] h-[320px] bg-white rounded-3xl p-6 flex flex-col justify-between shadow-lg relative transition-all duration-150 z-20 border border-slate-150"
            style={{
              transform: `translateX(${rightTranslate}px)`,
              boxShadow: isConnected ? "0 20px 40px -10px rgba(0, 71, 186, 0.15)" : "0 10px 20px -5px rgba(0, 0, 0, 0.06)"
            }}
          >
            {/* The puzzle circular cutout slot on the left edge */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#f8fafc] sm:bg-[#e0e9f4] -ml-4.5 z-30 transition-colors duration-150 border-r border-slate-100" 
              style={{
                backgroundColor: isConnected ? "#0047BA" : "#f8fafc"
              }}
            />

            {/* FRONT SIDE (RIGHT) */}
            {viewMode === "front" ? (
              <div className="flex-1 flex flex-col justify-between text-[#0047BA] text-right h-full">
                
                {/* Cheering/Waving Figure (Waving left hand) */}
                <div className="w-full flex justify-center pt-1 h-32 relative">
                  <svg className="w-32 h-32 absolute bottom-0 left-[-10px]" viewBox="0 0 112 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Waving sparkles/rays */}
                    <path d="M37 12L32 5" stroke="#0047BA" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
                    <path d="M27 20L17 18" stroke="#0047BA" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
                    <path d="M32 14L23 10" stroke="#0047BA" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
                    
                    {/* Head */}
                    <circle cx="44" cy="40" r="13" fill="#0047BA" />
                    
                    {/* Torso */}
                    <path d="M74 128 C67 92, 54 78, 44 78 C36 78, 32 92, 28 128" fill="#0047BA" />
                    
                    {/* Left arm going up-left, starting exactly at left border (x=0, y=42) */}
                    <path d="M44 76 C40 65, 24 48, 0 42" stroke="#0047BA" strokeWidth="15" strokeLinecap="round" />
                    
                    {/* Right arm resting down */}
                    <path d="M64 84 C72 90, 80 102, 82 112" stroke="#0047BA" strokeWidth="11" strokeLinecap="round" />
                  </svg>

                  {/* HIGH-FIVE CLAP SPARKS AND EMITTER (only when connected!) */}
                  {isConnected && (
                    <div className="absolute top-[35px] left-[-20px] z-40 pointer-events-none">
                      <svg className="w-14 h-14 text-yellow-400 animate-bounce" viewBox="0 0 64 64" fill="none">
                        <path d="M32 10 L32 2" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                        <path d="M45 20 L53 13" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                        <path d="M19 20 L11 13" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="32" cy="32" r="4" fill="#FBBF24" className="animate-ping" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Hangouts Title and subtitle */}
                <div className="space-y-2 px-4 text-center mt-2">
                  <h4 className="text-4xl font-extrabold tracking-tight font-display text-[#0047BA]">Hangouts</h4>
                  
                  {/* Heart Separator Line */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-[1px] bg-[#0047BA]/30 flex-1" />
                    <svg className="w-4 h-4 fill-[#0047BA] text-[#0047BA] shrink-0 animate-pulse" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <div className="h-[1px] bg-[#0047BA]/30 flex-1" />
                  </div>

                  <div className="relative inline-block mx-auto">
                    <p className="text-base font-bold text-[#0047BA] tracking-wide relative z-10 px-2">
                      Happy Hangouts Hai Na!
                    </p>
                    {/* Curved blue underline swoosh exactly like in the screenshot */}
                    <svg className="absolute -bottom-2.5 left-0 w-full h-3 text-[#0047BA]/80" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 2 Q 50 10, 100 2" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* Code badge bottom-right */}
                <div className="mt-2 flex justify-between items-center text-[10px] font-mono tracking-wider font-extrabold text-[#0047BA]/60">
                  <div className="flex-1" />
                  <span className="border border-[#0047BA]/30 rounded-lg px-2.5 py-1 bg-blue-50/50 uppercase">
                    CODE: HH-2078
                  </span>
                </div>

              </div>
            ) : (
              // BACK SIDE (RIGHT - Café scene table part)
              <div className="flex-1 flex flex-col justify-between text-[#0047BA] text-right h-full">
                
                {/* Café Vector Right Half */}
                <div className="w-full flex-1 flex justify-center items-center relative min-h-[160px]">
                  
                  <svg className="w-full h-full min-h-[160px]" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Light cone from lamp at the left edge */}
                    <path d="M20 30 L-90 200 H130 V30 Z" fill="url(#lamp-glow-right)" opacity="0.15" />

                    {/* Pendant Lamp Hanging at x=20 */}
                    <line x1="20" y1="0" x2="20" y2="30" stroke="#0047BA" strokeWidth="2" />
                    {/* Right half of shade */}
                    <path d="M20 30 H35 L30 38 H20 Z" fill="#0047BA" />

                    {/* Woman on Chair */}
                    {/* Chair */}
                    <path d="M230 185 H250 L245 130 H220 Z" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
                    <path d="M248 130 L255 80 C255 70, 242 70, 238 80 L232 130" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" fill="none" />

                    {/* Woman Body */}
                    {/* Head & Ponytail */}
                    <circle cx="205" cy="70" r="11" fill="#0047BA" />
                    <path d="M208 72 C215 70, 222 75, 220 85 C215 82, 212 76, 208 72" fill="#1E293B" />
                    {/* Torso in White Sweater */}
                    <path d="M220 105 C220 85, 200 85, 192 100 L185 150 H230 Z" fill="white" stroke="#0047BA" strokeWidth="1" />
                    {/* Arm holding cup */}
                    <path d="M200 110 C185 110, 175 112, 167 118" stroke="#0047BA" strokeWidth="6" strokeLinecap="round" />
                    {/* Cup */}
                    <rect x="161" y="110" width="8" height="9" rx="2" fill="#0047BA" />
                    <path d="M161 112 C160 112, 160 115, 161 115" stroke="#0047BA" strokeWidth="1.2" />

                    {/* Legs & Jeans */}
                    <path d="M215 150 L205 185 H185" stroke="#0047BA" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M195 150 L185 185 H165" stroke="#0047BA" strokeWidth="4" strokeLinecap="round" fill="none" />
                    {/* Sneakers */}
                    <rect x="179" y="181" width="16" height="7" rx="1.5" fill="#0047BA" />
                    <rect x="159" y="181" width="16" height="7" rx="1.5" fill="#0047BA" />

                    {/* Table (Right Half, starts at x=0) */}
                    <path d="M0 135 H90" stroke="#0047BA" strokeWidth="4.5" strokeLinecap="round" />
                    {/* Leg at x=20 */}
                    <line x1="20" y1="135" x2="20" y2="200" stroke="#0047BA" strokeWidth="3" />
                    {/* Base at bottom */}
                    <path d="M0 198 H50" stroke="#0047BA" strokeWidth="3.5" strokeLinecap="round" />

                    {/* Steam rising */}
                    <path d="M167 105 Q165 97 168 92" stroke="#0047BA" strokeWidth="1.2" strokeLinecap="round" className="animate-pulse" />
                    <path d="M163 103 Q161 95 164 90" stroke="#0047BA" strokeWidth="1.2" strokeLinecap="round" className="animate-pulse" />

                    <defs>
                      <linearGradient id="lamp-glow-right" x1="20" y1="30" x2="70" y2="200" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FBBF24" />
                        <stop offset="1" stopColor="#FBBF24" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Subtitle bottom */}
                <div className="text-center space-y-1 pb-1 mt-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-wider">
                    <span>💙</span>
                    <span className="uppercase text-[11px] tracking-widest font-extrabold text-[#0047BA]">One Connection</span>
                    <span>💙</span>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* TACTILE INTERACTIVE SLIDER BAR */}
        <div className="w-full max-w-md mt-6 space-y-4 relative z-30">
          
          {!isConnected ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
                <span>Drag to lock puzzle</span>
                <span className="text-[#0047BA] animate-pulse font-extrabold">Ready to pair</span>
              </div>

              {/* Slider Track and thumb */}
              <div className="flex items-center gap-4 bg-slate-100/85 rounded-2xl p-4 border border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">APART</span>
                <input 
                  type="range" 
                  min="35" 
                  max="100" 
                  value={progress}
                  onChange={handleSliderChange}
                  className="flex-1 accent-[#0047BA] h-3 bg-slate-300 rounded-full cursor-pointer appearance-none outline-none transition-all hover:bg-slate-300/80"
                />
                <span className="text-[10px] font-black text-[#0047BA] uppercase tracking-widest font-mono">LOCK</span>
              </div>

              {/* Direct Tap to complete action */}
              <button
                onClick={forceConnect}
                className="w-full bg-[#0047BA] hover:bg-[#003da1] text-white py-3.5 px-6 rounded-2xl text-xs font-extrabold uppercase tracking-widest shadow-lg shadow-[#0047BA]/10 hover:shadow-[#0047BA]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                Quick Match Sync Key
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-5 py-2.5 rounded-full text-xs font-black text-emerald-700 shadow-md animate-bounce">
                <Check className="w-4 h-4" />
                Dual Handshake Verification Complete
              </div>

              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto font-light">
                {viewMode === "front" 
                  ? "High-Five Handshake verified. Your secure local network gateway is now active!" 
                  : "Café Table successfully merged. Connection established at CP Café, Delhi NCR."}
              </p>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-800 underline transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Key and Slider
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
