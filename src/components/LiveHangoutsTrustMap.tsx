import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Radio,
  X,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { audio } from "../utils/audio";

export interface HangoutSpot {
  id: string;
  name: string;
  region: "Delhi" | "Gurgaon" | "Noida";
  activity: string;
  activeCount: number;
  category: "coffee" | "sports" | "tech" | "photo" | "chess" | "music";
  icon: string;
  x: number; // percentage from left
  y: number; // percentage from top
  landmark: string;
  metro: string;
  currentHosts: string[];
  safetyHighlight: string;
}

export const HANGOUT_SPOTS: HangoutSpot[] = [
  {
    id: "spot-4",
    name: "Connaught Place (CP)",
    region: "Delhi",
    activity: "Chess Blitz, Cafes & Conversations",
    activeCount: 15,
    category: "chess",
    icon: "♟️",
    x: 50,
    y: 20,
    landmark: "Central Delhi · Georgian Colonnades",
    metro: "Rajiv Chowk Metro",
    currentHosts: ["Rohan V.", "Tanmay G."],
    safetyHighlight: "High-security central plaza with constant police presence"
  },
  {
    id: "spot-1",
    name: "Khan Market",
    region: "Delhi",
    activity: "Specialty Coffee & Book Discussions",
    activeCount: 14,
    category: "coffee",
    icon: "☕",
    x: 55,
    y: 35,
    landmark: "Central Delhi · Shaded Pedestrian Market",
    metro: "Khan Market Metro",
    currentHosts: ["Kabir S.", "Ananya K."],
    safetyHighlight: "Diplomatic zone, CCTV monitored, premium public cafes"
  },
  {
    id: "spot-5",
    name: "Sunder Nursery",
    region: "Delhi",
    activity: "Photowalks & Heritage Trails",
    activeCount: 9,
    category: "photo",
    icon: "📷",
    x: 64,
    y: 42,
    landmark: "South-Central · UNESCO Park",
    metro: "JLN Stadium Metro",
    currentHosts: ["Zoya H.", "Ananya K."],
    safetyHighlight: "Gated entry, security guards on all open trails"
  },
  {
    id: "spot-7",
    name: "Hauz Khas & Deer Park",
    region: "Delhi",
    activity: "Sunset Walks & Creative Talks",
    activeCount: 10,
    category: "coffee",
    icon: "🌅",
    x: 44,
    y: 50,
    landmark: "South Delhi · Heritage Reservoir",
    metro: "Hauz Khas Metro",
    currentHosts: ["Rhea M.", "Ishaan B."],
    safetyHighlight: "Popular tourist & university destination, gated entry"
  },
  {
    id: "spot-2",
    name: "Siri Fort Complex",
    region: "Delhi",
    activity: "Badminton Rallies & Tennis",
    activeCount: 12,
    category: "sports",
    icon: "🏸",
    x: 52,
    y: 60,
    landmark: "South Delhi · Olympic Wooden Courts",
    metro: "Green Park Metro",
    currentHosts: ["Meera R.", "Devendra P."],
    safetyHighlight: "Govt-managed gated sports facility with security registration"
  },
  {
    id: "spot-3",
    name: "DLF CyberHub",
    region: "Gurgaon",
    activity: "Startup Brainstorming & Co-working",
    activeCount: 16,
    category: "tech",
    icon: "💡",
    x: 22,
    y: 68,
    landmark: "Gurgaon · Cyber City Promenade",
    metro: "Cyber City Rapid Metro",
    currentHosts: ["Aarav M.", "Karan M."],
    safetyHighlight: "Private corporate boulevard with 24/7 CCTV surveillance"
  },
  {
    id: "spot-8",
    name: "Golf Course Road",
    region: "Gurgaon",
    activity: "Specialty Pour-Overs & Networking",
    activeCount: 8,
    category: "tech",
    icon: "☕",
    x: 18,
    y: 82,
    landmark: "Gurgaon · Horizon Plaza Atrium",
    metro: "Sector 54 Rapid Metro",
    currentHosts: ["Vikram S.", "Nikhil P."],
    safetyHighlight: "Corporate campus grade security and upscale pedestrian plaza"
  },
  {
    id: "spot-6",
    name: "Sector 29 & Galleria",
    region: "Gurgaon",
    activity: "Acoustic Jams & Coffee Crawls",
    activeCount: 11,
    category: "music",
    icon: "🎸",
    x: 32,
    y: 82,
    landmark: "Gurgaon · Open Amphitheater & Cafes",
    metro: "IFFCO Chowk Metro",
    currentHosts: ["Priya S.", "Sameer K."],
    safetyHighlight: "Vibrant high-security dining hub with pedestrian plazas"
  }
];

const RECENT_LIVE_PULSES = [
  { host: "Aarav M.", seeker: "Kunal S.", spot: "DLF CyberHub", activity: "Startup Pitch Jam", time: "2m ago" },
  { host: "Meera R.", seeker: "Pooja D.", spot: "Siri Fort Complex", activity: "Badminton Court 3", time: "5m ago" },
  { host: "Kabir S.", seeker: "Ritika W.", spot: "Khan Market", activity: "Blue Tokai Coffee", time: "9m ago" },
  { host: "Rohan V.", seeker: "Aditya N.", spot: "Connaught Place", activity: "Blitz Chess (1800+)", time: "14m ago" },
  { host: "Priya S.", seeker: "Sneha G.", spot: "32nd Avenue Gurgaon", activity: "Acoustic Jam Session", time: "19m ago" }
];

interface LiveHangoutsTrustMapProps {
  onSelectSpot?: (spot: HangoutSpot) => void;
  className?: string;
}

export default function LiveHangoutsTrustMap({
  onSelectSpot,
  className = ""
}: LiveHangoutsTrustMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<"All" | "Delhi" | "Gurgaon">("All");
  const [activeSpot, setActiveSpot] = useState<HangoutSpot | null>(HANGOUT_SPOTS[1]); // Default to Khan Market
  const [totalActiveNow, setTotalActiveNow] = useState<number>(92);
  const [tickerIndex, setTickerIndex] = useState<number>(0);

  // Subtle live counter oscillation
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalActiveNow(prev => Math.max(85, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Smooth rotating ticker for recent live hangouts
  useEffect(() => {
    const tickerTimer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % RECENT_LIVE_PULSES.length);
    }, 4000);
    return () => clearInterval(tickerTimer);
  }, []);

  const filteredSpots = selectedRegion === "All"
    ? HANGOUT_SPOTS
    : HANGOUT_SPOTS.filter(s => s.region === selectedRegion);

  const handleSpotClick = (spot: HangoutSpot) => {
    audio.playClick();
    setActiveSpot(spot);
    if (onSelectSpot) {
      onSelectSpot(spot);
    }
  };

  const currentPulse = RECENT_LIVE_PULSES[tickerIndex];

  return (
    <div className={`w-full rounded-2xl sm:rounded-3xl border-2 border-slate-300 bg-slate-950 shadow-xl overflow-hidden flex flex-col text-left ${className}`}>
      
      {/* 1. Slim Integrated Header (Filters & Live Beacon) */}
      <div className="px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        
        {/* Title & Glowing Blue Light Indicator */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" />
            <span className="absolute -inset-1 rounded-full bg-blue-400/60 animate-ping" />
            <span className="absolute -inset-2 rounded-full bg-cyan-400/25 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs sm:text-sm text-white tracking-tight">
                Live Radar
              </span>
              <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-cyan-300 font-mono text-[9px] font-bold border border-blue-400/30">
                NCR
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Blue lights show real companions active right now
            </p>
          </div>
        </div>

        {/* Region Filter Pills & Live Count */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
            {(["All", "Delhi", "Gurgaon"] as const).map(reg => (
              <button
                key={reg}
                onClick={() => {
                  audio.playClick();
                  setSelectedRegion(reg);
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {reg === "All" ? "All" : reg}
              </button>
            ))}
          </div>

          <div className="hidden xs:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{totalActiveNow} Live</span>
          </div>
        </div>

      </div>

      {/* 2. Compact Radar Canvas (Not Bulky, Height-Optimized) */}
      <div className="relative w-full h-[320px] xs:h-[350px] sm:h-[390px] lg:h-[430px] bg-[#070b14] overflow-hidden select-none">
        
        {/* Radar Background Grid & Ambient Rings */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#131d33_1px,transparent_1px),linear-gradient(to_bottom,#131d33_1px,transparent_1px)] bg-[size:28px_28px] opacity-50 pointer-events-none" />
        
        {/* Subtle Concentric Radar Rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-blue-500/10 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-blue-500/15 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full border border-cyan-400/20 pointer-events-none" />

        {/* Stylized Transit Route Vectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {/* Gurgaon Yellow Line to Central Delhi */}
          <path d="M 60 270 Q 140 210, 200 90" stroke="#38bdf8" strokeWidth="2" fill="none" strokeDasharray="4 3" />
          {/* Violet Line Central Delhi to South Delhi */}
          <path d="M 200 90 Q 220 160, 210 230" stroke="#60a5fa" strokeWidth="2" fill="none" strokeDasharray="4 3" />
        </svg>

        {/* Ambient Regional Watermarks */}
        <div className="absolute left-4 bottom-8 pointer-events-none text-slate-800 font-black text-xl tracking-widest uppercase opacity-40">
          Gurgaon
        </div>
        <div className="absolute left-1/2 top-4 -translate-x-1/2 pointer-events-none text-slate-800 font-black text-xl tracking-widest uppercase opacity-40">
          Delhi
        </div>

        {/* Interactive Spots with Glowing Blue Lights */}
        {filteredSpots.map(spot => {
          const isSelected = activeSpot?.id === spot.id;

          return (
            <div
              key={spot.id}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="relative flex items-center justify-center">
                
                {/* Glowing Blue Radar Lights */}
                <span className="absolute -inset-2.5 rounded-full bg-blue-500/50 animate-ping pointer-events-none" />
                <span className="absolute -inset-4 rounded-full bg-cyan-400/30 blur-xs pointer-events-none" />
                <span className="absolute -inset-1 rounded-full bg-blue-600 shadow-[0_0_16px_#38bdf8] pointer-events-none" />

                {/* Interactive Clickable Beacon Button */}
                <button
                  onClick={() => handleSpotClick(spot)}
                  aria-label={`View hangouts at ${spot.name}`}
                  className={`relative flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-950 shadow-[0_0_20px_#2563eb] z-30"
                      : "bg-slate-900/90 text-cyan-200 border border-cyan-500/60 hover:scale-105 hover:bg-slate-800"
                  }`}
                >
                  <span className="text-sm leading-none">{spot.icon}</span>
                  <span className="font-extrabold text-[11px] whitespace-nowrap text-white">
                    {spot.name.split(" ")[0]}
                  </span>
                  <span className="px-1 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black">
                    {spot.activeCount}
                  </span>
                </button>

              </div>
            </div>
          );
        })}

        {/* 3. Floating Lightweight Glass Spot Preview Card (Bottom Docked, High Contrast) */}
        {activeSpot && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:left-4 sm:right-auto sm:max-w-md z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-300 shadow-2xl text-left">
              
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-base shrink-0 shadow-xs">
                    {activeSpot.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-sm text-slate-950 tracking-tight leading-none">
                        {activeSpot.name}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-900 font-mono font-bold text-[9px]">
                        {activeSpot.region}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>{activeSpot.landmark}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSpot(null)}
                  className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Close preview"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Details Bar */}
              <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 font-bold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {activeSpot.activeCount} Live Now
                  </span>
                  <span className="text-[11px] text-slate-700 font-medium hidden xs:inline">
                    Hosts: <strong className="text-slate-900">{activeSpot.currentHosts.join(", ")}</strong>
                  </span>
                </div>

                <a
                  href="#companions"
                  onClick={() => audio.playClick()}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer ml-auto"
                >
                  <span>Meet Here</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* 4. Slim 1-Line Live Activity Ticker (Real-Time Proof, Not Bulky) */}
      <div className="px-3 py-2 bg-slate-900/95 border-t border-slate-800 text-[11px] flex items-center justify-between gap-2 overflow-hidden shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_#38bdf8] shrink-0" />
          <span className="font-mono text-cyan-400 font-black uppercase text-[10px] shrink-0">
            Live Stream:
          </span>
          <span className="text-slate-200 font-medium truncate">
            <strong className="text-white font-bold">{currentPulse.host}</strong> &amp; {currentPulse.seeker} checked in at <strong className="text-cyan-300">{currentPulse.spot}</strong> ({currentPulse.activity})
          </span>
        </div>

        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded shrink-0 border border-slate-700">
          {currentPulse.time}
        </span>
      </div>

    </div>
  );
}
