import React, { useState, useEffect } from "react";
import { Sparkles, Lightbulb, Compass, MessageCircle, RefreshCw, Coffee } from "lucide-react";
import { audio } from "../utils/audio";

interface MubaVibeGuideProps {
  experienceTitle: string;
  categoryTitle?: string;
  experienceEmoji: string;
  suggestedPrompt: string;
  popularSpots: string[];
}

export default function MubaVibeGuide({
  experienceTitle,
  categoryTitle,
  experienceEmoji,
  suggestedPrompt,
  popularSpots
}: MubaVibeGuideProps) {
  const [activeTab, setActiveTab] = useState<"tip" | "icebreaker" | "spots">("tip");
  const [customTipIndex, setCustomTipIndex] = useState(0);

  // Curated secrets and suggestions from Muba for each vibe type
  const localTips: Record<string, string[]> = {
    "Learn Something Together": [
      "Find a quiet corner at Sunder Nursery. Bringing along reference books or chord guides is a solid conversation piece!",
      "Focus on the process of sharing knowledge. Be supportive, ask open questions about their learning speed, and don't make it competitive.",
      "If things get dry, suggest a quick 5-minute quiz swap or a light game to lock in the learning with a smile!"
    ],
    "Build Your Career": [
      "If meeting in a workspace lounge like WeWork, grab a corner window desk. It provides beautiful natural daylight and keeps focus high.",
      "Stick to sticky notes and simple pens first! Designing mock flows on tiny pieces of paper feels far more rewarding than staring at laptop screens.",
      "Always set a 'no device' rule for the first 15 minutes. Pure face-to-face brainstorming keeps the entrepreneurial spirit flowing!"
    ],
    "Build Meaningful Connections": [
      "Order a pour-over light roast coffee to share. Talking about the blueberry and citrus notes is the perfect icebreaker!",
      "Sit on shaded wooden stools outside. The soft ambient breeze makes long, quiet pauses in conversation feel completely natural and relaxed.",
      "Split a single croissant or sweet treat. Sharing food activates ancient social trust markers, instantly bringing down barriers."
    ],
    "Express Yourself": [
      "Meet near local cultural hubs like Habitat World or outdoor gardens. Natural spacing gives you plenty of vocal and physical room to express yourself.",
      "Focus purely on cooperative jam or practice! There's absolutely zero room for judgment—only raw, fun, collaborative play.",
      "Keep a polaroid or phone-camera handy to snap a fast vintage-style candid memory of your creative session together."
    ],
    "Stay Active Together": [
      "Select turf or courts that have soft sunset or sunrise light. High shuttlecocks or cricket balls won't get lost in blinding afternoon glare.",
      "Play light cooperative warm-ups. Count how many passes you can sustain without a single drop to build beautiful teamwork.",
      "Always carry an extra chilled bottle of fresh lime water or sports drink to share. It's the ultimate warm sportsmanship gesture!"
    ],
    "Explore Together": [
      "Take the Gurgaon-Faridabad bypass roads during the golden hour. The light reflecting off the Aravalli hills looks magnificent.",
      "Queue up a warm acoustic playlist at a soft 30% volume. It fills the transition silence beautifully during long drives or walkabouts.",
      "Have a quick hot tapri tea near Leopard Trail just as the temperature begins to drop. It makes the adventure feel wonderfully rustic."
    ],
    "Celebrate Together": [
      "Arrive dressed sharply and coordinate styles with your celebration partner. It makes walking into an event or wedding feel like a team effort!",
      "Keep the focus entirely on sharing joy. Take some goofy selfies, share your favorite festival memories, and sample the finest food together.",
      "If you're travel planning, lay out a map and swap crazy bucket list travel stories to find the ultimate destination match!"
    ]
  };

  // Safe fallback tips
  const tipsKey = categoryTitle || experienceTitle;
  const currentTips = localTips[tipsKey] || [
    "Arrive 5 minutes early to secure a cozy, well-lit corner table. Spacing is key for a comfortable first talk!",
    "Order something small first so you have an easy activity to focus on. It takes off all the physical pressure.",
    "Remember to smile and maintain warm eye contact. Authentic presence is what everyone is craving!"
  ];

  // Rotate custom tips
  const cycleTip = () => {
    audio.playClick();
    setCustomTipIndex((prev) => (prev + 1) % currentTips.length);
  };

  // Reset tip index when experience changes
  useEffect(() => {
    setCustomTipIndex(0);
  }, [experienceTitle]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-[32px] p-6 sm:p-7 shadow-2xl border border-blue-500/20 relative overflow-hidden">
      
      {/* Absolute design decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />

      {/* Grid Layout: Left Column Muba Mascot SVG / Right Column Suggestions Speech Bubble */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* MUBA CHARACTER MASCOT SVG ART PANEL */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center relative">
          
          <div className="relative group">
            {/* Ambient pulse circle around him */}
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500" />
            
            {/* HIGH-FIDELITY DETAILED STYLIZED SVG OF MUBA */}
            <svg 
              className="w-36 h-36 sm:w-40 sm:h-40 relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300"
              viewBox="0 0 160 160" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer soft outline backdrop glow */}
              <circle cx="80" cy="80" r="74" fill="#002D7A" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 2" className="animate-spin duration-[40s]" />
              <circle cx="80" cy="80" r="68" fill="#0A192F" />

              {/* Cafe Background Window Silhouette */}
              <path d="M45 40 H115 V100 H45 Z" fill="#172A45" opacity="0.6" />
              <line x1="80" y1="40" x2="80" y2="100" stroke="#0F1F35" strokeWidth="2" />
              <line x1="45" y1="70" x2="115" y2="70" stroke="#0F1F35" strokeWidth="2" />

              {/* Warm Cafe Lamp Glow inside window */}
              <circle cx="100" cy="52" r="6" fill="#FBBF24" opacity="0.5" className="animate-pulse" />
              <path d="M96 40 L100 46 L104 40 Z" fill="#FBBF24" opacity="0.8" />

              {/* MUBA'S COLLAR SHIRT */}
              <path d="M48 135 C52 118, 62 108, 80 108 C98 108, 108 118, 112 135 L115 155 H45 Z" fill="#0E46A3" />
              <path d="M48 135 L62 115 L80 128 L98 115 L112 135" stroke="#1E56C3" strokeWidth="2" />

              {/* Inner White T-Shirt */}
              <path d="M70 114 C70 125, 90 125, 90 114 Z" fill="#FFFFFF" />

              {/* Face & Neck */}
              <path d="M72 100 L72 114 H88 L88 100 Z" fill="#E0A983" />
              <path d="M58 75 C58 58, 102 58, 102 75 C102 93, 102 98, 80 104 C58 98, 58 93, 58 75 Z" fill="#F3C19E" />

              {/* Beard & Mustache */}
              <path d="M58 75 C58 88, 64 100, 80 104 C96 100, 102 88, 102 75 C102 81, 98 94, 80 97 C62 94, 58 81, 58 75 Z" fill="#2D3139" />
              <path d="M68 85 C68 93, 72 95, 80 95 C88 95, 92 93, 92 85" stroke="#2D3139" strokeWidth="3" strokeLinecap="round" />
              <path d="M70 81 C75 80, 85 80, 90 81" stroke="#22252A" strokeWidth="2.5" strokeLinecap="round" />

              {/* Warm Smile */}
              <path d="M74 86 Q80 91 86 86" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

              {/* Eyes */}
              <circle cx="71" cy="72" r="2.5" fill="#5F3F19" />
              <circle cx="72" cy="71" r="0.8" fill="#FFFFFF" />
              <circle cx="89" cy="72" r="2.5" fill="#5F3F19" />
              <circle cx="90" cy="71" r="0.8" fill="#FFFFFF" />

              {/* Eyebrows */}
              <path d="M66 67 C68 65, 73 65, 76 68" stroke="#1F232B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M94 67 C92 65, 87 65, 84 68" stroke="#1F232B" strokeWidth="2.5" strokeLinecap="round" />

              {/* Ears */}
              <circle cx="57" cy="76" r="4.5" fill="#F3C19E" />
              <circle cx="103" cy="76" r="4.5" fill="#F3C19E" />

              {/* MUBA'S HAIR */}
              <circle cx="60" cy="62" r="10" fill="#21252D" />
              <circle cx="70" cy="56" r="11" fill="#1E2129" />
              <circle cx="80" cy="52" r="12" fill="#282C36" />
              <circle cx="90" cy="56" r="11" fill="#1E2129" />
              <circle cx="100" cy="62" r="10" fill="#21252D" />
              <circle cx="56" cy="70" r="8" fill="#21252D" />
              <circle cx="104" cy="70" r="8" fill="#21252D" />
              
              <circle cx="64" cy="58" r="6" fill="#2F333F" />
              <circle cx="76" cy="52" r="7" fill="#3A3E4B" />
              <circle cx="86" cy="52" r="7" fill="#3A3E4B" />
              <circle cx="96" cy="58" r="6" fill="#2F333F" />

              {/* STYLIZED COFFEE CUP BEING HELD */}
              <g transform="translate(102, 110)">
                <path d="M12 12 L14 30 H26 L28 12 Z" fill="#DDBEAA" />
                <path d="M11 8 L13 12 H27 L29 8 Z" fill="#F3F4F6" />
                <rect x="13" y="17" width="14" height="8" rx="1.5" fill="#8B5A2B" opacity="0.8" />
                <circle cx="20" cy="21" r="2" fill="#EEDAC5" />
              </g>

              {/* Heart Badge */}
              <path d="M60 132 C60 131, 59 130, 58 130 C57 130, 56 131, 56 132 C56 133, 58 135, 60 136 C62 135, 64 133, 64 132 C64 131, 63 130, 62 130 C61 130, 60 131, 60 132 Z" fill="#EF4444" />
            </svg>
          </div>

          <div className="mt-3 relative z-10">
            <h4 className="font-bold text-sm tracking-tight text-slate-100 font-display flex items-center gap-1.5 justify-center">
              Muba
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h4>
            <p className="text-[10px] text-blue-300 font-mono font-bold uppercase tracking-widest mt-0.5">
              Your Guide &amp; Curator
            </p>
          </div>

        </div>

        {/* INTERACTIVE SUGGESTIONS CHAT BUBBLE PANEL */}
        <div className="md:col-span-8 space-y-4">
          
          {/* Custom Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
            <button
              onClick={() => {
                audio.playClick();
                setActiveTab("tip");
              }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${
                activeTab === "tip"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-300"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Secret Local Tip
            </button>
            
            <button
              onClick={() => {
                audio.playClick();
                setActiveTab("icebreaker");
              }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${
                activeTab === "icebreaker"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-300"
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
              Icebreakers
            </button>

            <button
              onClick={() => {
                audio.playClick();
                setActiveTab("spots");
              }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${
                activeTab === "spots"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white/5 hover:bg-white/10 text-slate-300"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              My Secret Spots
            </button>
          </div>

          {/* Speech bubble or dynamic card */}
          <div className="relative bg-slate-900/60 rounded-2xl p-5 border border-slate-800/80 min-h-[140px] flex flex-col justify-between">
            
            {/* Tiny talk arrow decoration pointing left */}
            <div className="hidden md:block absolute top-8 -left-2 w-4 h-4 bg-slate-900 border-l border-b border-slate-800/80 rotate-45 transform -translate-x-1/2" />

            {/* TAB CONTENT: MUBA'S TIPS */}
            {activeTab === "tip" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                    Muba's Curated Tip • {experienceTitle}
                  </span>
                  
                  <button 
                    onClick={cycleTip}
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Get another secret tip"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-slate-100 text-xs sm:text-sm leading-relaxed italic font-light">
                  "{currentTips[customTipIndex]}"
                </p>
                <div className="text-[9px] text-slate-400 font-mono">
                  Tip {customTipIndex + 1} of {currentTips.length} • Click refresh icon above to cycle
                </div>
              </div>
            )}

            {/* TAB CONTENT: REFINED ICEBREAKER */}
            {activeTab === "icebreaker" && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono block">
                  Recommended Icebreaker Question
                </span>
                <p className="text-slate-100 text-xs sm:text-sm leading-relaxed italic font-light">
                  "{suggestedPrompt}"
                </p>
                <p className="text-[10px] text-slate-400 leading-normal">
                  💡 <strong className="text-slate-300">My Advice:</strong> Don't rush into deep topics immediately! Ask this when you're ordering your drinks or right after exchanging greetings. Keep it light, casual, and laugh along!
                </p>
              </div>
            )}

            {/* TAB CONTENT: CURATED SPOTS */}
            {activeTab === "spots" && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono block">
                  Muba's Top Handpicked spots in NCR
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {popularSpots.map((spot, i) => (
                    <div key={i} className="bg-slate-950/40 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Coffee className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-[11px] text-slate-200 font-medium truncate">{spot}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-emerald-400/90 font-mono">
                  ✓ Certified highly active, extremely safe, and verified by our Happy Patrol Team.
                </p>
              </div>
            )}

          </div>

          {/* Prompt banner under the speech bubble */}
          <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            <span>Muba's tips change automatically based on the pathway vibe you select above!</span>
          </div>

        </div>

      </div>

    </div>
  );
}
