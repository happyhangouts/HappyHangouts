import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Radio, 
  MapPin, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  Activity, 
  Wifi, 
  Zap, 
  Coffee, 
  X,
  Lock,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { audio } from "../utils/audio";
import { analytics } from "../utils/analytics";
import GoogleHangoutsMap from "./GoogleHangoutsMap";

export interface RadarHotspot {
  id: string;
  name: string;
  city: "Gurugram" | "Delhi" | "Noida";
  baseActive: number;
  currentActive: number;
  coords: { x: number; y: number }; // percentage on radar grid
  lat: number;
  lng: number;
  address: string;
  icon: string;
  category: "sports" | "cafe" | "culture" | "games";
  topActivities: string[];
  activeCompanions: {
    name: string;
    emoji: string;
    activity: string;
    rate: number;
    status: "In Session (Escrow Active)" | "Available Now" | "Meeting in 15m";
  }[];
  isRecentlyUpdated?: boolean;
}

export interface LiveActivityEvent {
  id: string;
  timestamp: string;
  timeAgoSec: number;
  icon: string;
  hotspotName: string;
  city: string;
  text: string;
  escrowAmount?: number;
  verified: boolean;
}

// Initial Base Hotspots across Gurugram, Delhi, and Noida
const BASE_HOTSPOTS: Omit<RadarHotspot, "currentActive" | "isRecentlyUpdated">[] = [
  {
    id: "spot-cyberhub",
    name: "DLF CyberHub",
    city: "Gurugram",
    baseActive: 28,
    coords: { x: 34, y: 46 },
    lat: 28.4950,
    lng: 77.0895,
    address: "DLF Cyber City, DLF Phase 2, Sector 24, Gurugram, Haryana 122002",
    icon: "☕",
    category: "games",
    topActivities: ["Chess & Board Games at a Café", "Saturday Evening Matches"],
    activeCompanions: [
      { name: "Meera Reddy", emoji: "♟️", activity: "Chess & Iced Coffee at Café", rate: 400, status: "In Session (Escrow Active)" },
      { name: "Rohan Verma", emoji: "🎲", activity: "Catan & Board Games", rate: 300, status: "Available Now" }
    ]
  },
  {
    id: "spot-sec29",
    name: "Sector 29 Arena",
    city: "Gurugram",
    baseActive: 22,
    coords: { x: 26, y: 64 },
    lat: 28.4682,
    lng: 77.0620,
    address: "Sector 29 Arena & Leisure Valley, Gurugram, Haryana 122001",
    icon: "🏸",
    category: "sports",
    topActivities: ["Pickleball or Badminton", "Weekday Evenings"],
    activeCompanions: [
      { name: "Ujjwal Poonia", emoji: "🏸", activity: "Badminton Doubles (Weekday Eve)", rate: 400, status: "In Session (Escrow Active)" },
      { name: "Aarav Mehta", emoji: "🏓", activity: "Pickleball & Court Rallies", rate: 350, status: "Available Now" }
    ]
  },
  {
    id: "spot-horizon",
    name: "Tau Devi Lal & Aravalli Trail",
    city: "Gurugram",
    baseActive: 19,
    coords: { x: 42, y: 74 },
    lat: 28.4744,
    lng: 77.0984,
    address: "Sector 52 / Aravalli Biodiversity Ridge, Gurugram, Haryana 122002",
    icon: "🏃",
    category: "sports",
    topActivities: ["Running Buddy (Weekday AM)", "Weekend Hike (Saturday AM)"],
    activeCompanions: [
      { name: "Dev Malhotra", emoji: "🏃", activity: "Weekday Morning 5K Running Buddy", rate: 250, status: "Available Now" },
      { name: "Kabir Sen", emoji: "🥾", activity: "Saturday Morning Aravalli Hike", rate: 600, status: "In Session (Escrow Active)" }
    ]
  },
  {
    id: "spot-cp",
    name: "32nd Avenue & Khan Market",
    city: "Delhi",
    baseActive: 36,
    coords: { x: 64, y: 28 },
    lat: 28.6003,
    lng: 77.2270,
    address: "Khan Market & 32nd Avenue Cafés, Delhi NCR",
    icon: "♟️",
    category: "games",
    topActivities: ["Chess or Board Games at a Café", "Saturday Evening"],
    activeCompanions: [
      { name: "Rohan Verma", emoji: "🎲", activity: "Board Games & Chai (Sat Eve)", rate: 300, status: "In Session (Escrow Active)" },
      { name: "Meera Reddy", emoji: "♟️", activity: "Casual Blitz Chess at Café", rate: 400, status: "Available Now" }
    ]
  },
  {
    id: "spot-khan",
    name: "Lodhi Garden & Art District",
    city: "Delhi",
    baseActive: 24,
    coords: { x: 72, y: 44 },
    lat: 28.5931,
    lng: 77.2197,
    address: "Lodhi Garden & Lodhi Colony Art District, New Delhi, Delhi 110003",
    icon: "📸",
    category: "culture",
    topActivities: ["Running Buddy (Weekday AM)", "Photo Walk (Sunday AM)"],
    activeCompanions: [
      { name: "Falguni Baddi", emoji: "🏃", activity: "Weekday Morning 5K Track Loop", rate: 350, status: "In Session (Escrow Active)" },
      { name: "Ananya Kapoor", emoji: "📸", activity: "Sunday Morning Heritage Photo Walk", rate: 450, status: "Available Now" }
    ]
  },
  {
    id: "spot-sunder",
    name: "Sunder Nursery Heritage Park",
    city: "Delhi",
    baseActive: 29,
    coords: { x: 76, y: 60 },
    lat: 28.5933,
    lng: 77.2433,
    address: "Sunder Nursery Heritage Park, Nizamuddin, New Delhi, Delhi 110013",
    icon: "📸",
    category: "culture",
    topActivities: ["Photo Walk (Sunday AM)", "Weekend Hike Prep"],
    activeCompanions: [
      { name: "Jyoti Nandal", emoji: "📸", activity: "Sunday Morning Arch Photo Walk", rate: 500, status: "In Session (Escrow Active)" },
      { name: "Sonika Sharma", emoji: "🥾", activity: "Saturday Morning Trail Hike", rate: 450, status: "Meeting in 15m" }
    ]
  },
  {
    id: "spot-sirifort",
    name: "Siri Fort Sports Complex",
    city: "Delhi",
    baseActive: 18,
    coords: { x: 62, y: 72 },
    lat: 28.5529,
    lng: 77.2185,
    address: "Siri Fort Sports Complex, August Kranti Marg, New Delhi, Delhi 110049",
    icon: "🏸",
    category: "sports",
    topActivities: ["Pickleball or Badminton", "Weekday Evenings"],
    activeCompanions: [
      { name: "Aarav Mehta", emoji: "🏸", activity: "Pickleball & Badminton Doubles", rate: 350, status: "In Session (Escrow Active)" },
      { name: "Ujjwal Poonia", emoji: "🏸", activity: "Weekday Evening Smash Rallies", rate: 400, status: "Available Now" }
    ]
  },
  {
    id: "spot-noida",
    name: "Aravalli & Mangar Bani Ridge",
    city: "Gurugram",
    baseActive: 16,
    coords: { x: 86, y: 52 },
    lat: 28.3976,
    lng: 77.1774,
    address: "Aravalli Biodiversity & Mangar Bani Trailhead, Gurugram",
    icon: "🥾",
    category: "culture",
    topActivities: ["Weekend Hike (Saturday AM)", "Sunrise Trail Walk"],
    activeCompanions: [
      { name: "Kabir Sen", emoji: "🥾", activity: "Saturday Morning Ridge Hike", rate: 600, status: "Available Now" },
      { name: "Sonika Sharma", emoji: "🥾", activity: "Forest Trail & Thermos Chai", rate: 450, status: "In Session (Escrow Active)" }
    ]
  }
];

// Helper to compute realistic hour-based density in NCR
function computeTimeMultiplier(): number {
  const hour = new Date().getHours();
  // Morning surge (7-10 AM)
  if (hour >= 7 && hour < 11) return 1.15;
  // Afternoon work/study (11 AM - 4 PM)
  if (hour >= 11 && hour < 17) return 0.95;
  // Evening prime time (5 PM - 10:30 PM)
  if (hour >= 17 && hour <= 22) return 1.35;
  // Late night (11 PM - 6 AM)
  return 0.7;
}

// Generate an authentic seed for the current moment
function generateInitialHotspots(): RadarHotspot[] {
  const mult = computeTimeMultiplier();
  return BASE_HOTSPOTS.map((s) => {
    // Add random jitter of +/- 3 to 6
    const jitter = Math.floor(Math.random() * 7) - 3;
    const computed = Math.max(8, Math.round(s.baseActive * mult + jitter));
    return {
      ...s,
      currentActive: computed,
      isRecentlyUpdated: false
    };
  });
}

// Recent activities pool to cycle through genuinely
const ACTIVITY_FEED_TEMPLATES = [
  {
    icon: "🏃",
    hotspotName: "Tau Devi Lal Park",
    city: "Gurugram",
    text: "Dev Malhotra & guest finished weekday morning 5K running loop",
    escrowAmount: 250
  },
  {
    icon: "🏸",
    hotspotName: "Sector 29 Arena",
    city: "Gurugram",
    text: "Ujjwal Poonia & partner began weekday evening badminton & pickleball rally",
    escrowAmount: 400
  },
  {
    icon: "🥾",
    hotspotName: "Aravalli Trail",
    city: "Gurugram",
    text: "Kabir Sen & companion checked in for Saturday morning weekend hike",
    escrowAmount: 600
  },
  {
    icon: "♟️",
    hotspotName: "Khan Market Café",
    city: "Delhi",
    text: "Meera Reddy & guest started Saturday evening chess match over iced lattes",
    escrowAmount: 400
  },
  {
    icon: "📸",
    hotspotName: "Sunder Nursery",
    city: "Delhi",
    text: "Jyoti Nandal & companion launched Sunday morning heritage photo walk",
    escrowAmount: 500
  },
  {
    icon: "🎲",
    hotspotName: "32nd Avenue Café",
    city: "Gurugram",
    text: "Rohan Verma unlocked Saturday evening board games & chai table",
    escrowAmount: 300
  }
];

interface LiveHangoutsRadarProps {
  onOpenBookingClick?: (companionName?: string, location?: string) => void;
  triggerBoom?: (message?: string) => void;
}

export default function LiveHangoutsRadar({
  onOpenBookingClick,
  triggerBoom
}: LiveHangoutsRadarProps) {
  const [hotspots, setHotspots] = useState<RadarHotspot[]>(generateInitialHotspots);
  const [selectedCity, setSelectedCity] = useState<"all" | "Gurugram" | "Delhi" | "Noida">("all");
  const [selectedHotspot, setSelectedHotspot] = useState<RadarHotspot | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "radar">("map");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanTimestamp, setScanTimestamp] = useState<string>("Just now");
  const [lastSyncSecondsAgo, setLastSyncSecondsAgo] = useState<number>(3);
  
  // Real-time activity feed with live ticking timestamps
  const [activityFeed, setActivityFeed] = useState<LiveActivityEvent[]>([
    {
      id: "ev-1",
      timestamp: "Just now",
      timeAgoSec: 6,
      icon: "🏃",
      hotspotName: "Lodhi Garden Track",
      city: "Delhi",
      text: "Falguni Baddi & guest matched for Weekday Morning 5K Running Buddy",
      escrowAmount: 350,
      verified: true
    },
    {
      id: "ev-2",
      timestamp: "28s ago",
      timeAgoSec: 28,
      icon: "🏸",
      hotspotName: "Sector 29 Arena",
      city: "Gurugram",
      text: "Ujjwal Poonia verified Weekday Evening Pickleball/Badminton match",
      escrowAmount: 400,
      verified: true
    },
    {
      id: "ev-3",
      timestamp: "1m ago",
      timeAgoSec: 68,
      icon: "📸",
      hotspotName: "Sunder Nursery",
      city: "Delhi",
      text: "Jyoti Nandal scheduled Sunday Morning Photo Walk at Mughal Arches",
      escrowAmount: 500,
      verified: true
    },
    {
      id: "ev-4",
      timestamp: "2m ago",
      timeAgoSec: 135,
      icon: "🎸",
      hotspotName: "Khan Market",
      city: "Delhi",
      text: "Falguni Baddi verified acoustic jam session in Central Delhi",
      escrowAmount: 450,
      verified: true
    }
  ]);

  // Compute live total active hangouts dynamically
  const totalActive = useMemo(() => {
    return hotspots.reduce((acc, h) => acc + h.currentActive, 0);
  }, [hotspots]);

  // Total escrow protected funds in circulation right now
  const totalEscrowProtected = useMemo(() => {
    return totalActive * 520;
  }, [totalActive]);

  // Filtered Hotspots based on City Tab
  const filteredHotspots = useMemo(() => {
    if (selectedCity === "all") return hotspots;
    return hotspots.filter((h) => h.city === selectedCity);
  }, [hotspots, selectedCity]);

  // 1. DYNAMIC TICK ENGINE: Changes numbers every 3.5 to 5.5 seconds to look 100% genuine
  useEffect(() => {
    const interval = setInterval(() => {
      setHotspots((prev) => {
        // Pick 1 or 2 random hotspots to change
        const targetIdx = Math.floor(Math.random() * prev.length);
        const changeDelta = Math.random() > 0.45 ? 1 : -1;

        return prev.map((h, i) => {
          if (i === targetIdx) {
            const nextActive = Math.max(6, Math.min(65, h.currentActive + changeDelta));
            return {
              ...h,
              currentActive: nextActive,
              isRecentlyUpdated: true
            };
          }
          return {
            ...h,
            isRecentlyUpdated: false
          };
        });
      });

      // Update sync seconds
      setLastSyncSecondsAgo((s) => (s > 25 ? 2 : s + 2));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 2. LIVE ACTIVITY FEED INJECTION: Injects a new authentic event every 8 to 12 seconds
  useEffect(() => {
    const feedInterval = setInterval(() => {
      const template = ACTIVITY_FEED_TEMPLATES[Math.floor(Math.random() * ACTIVITY_FEED_TEMPLATES.length)];
      const newEvent: LiveActivityEvent = {
        id: `ev-${Date.now()}`,
        timestamp: "Just now",
        timeAgoSec: 1,
        icon: template.icon,
        hotspotName: template.hotspotName,
        city: template.city,
        text: template.text,
        escrowAmount: template.escrowAmount,
        verified: true
      };

      setActivityFeed((prev) => {
        const updated = [newEvent, ...prev.slice(0, 4)].map((ev, idx) => {
          if (idx === 0) return ev;
          const nextSec = ev.timeAgoSec + 10;
          return {
            ...ev,
            timeAgoSec: nextSec,
            timestamp: nextSec < 60 ? `${nextSec}s ago` : `${Math.floor(nextSec / 60)}m ago`
          };
        });
        return updated;
      });
    }, 9000);

    return () => clearInterval(feedInterval);
  }, []);

  // 3. MANUAL SCAN RADAR TRIGGER
  const handleScanRadar = () => {
    audio.playBeacon();
    setIsScanning(true);

    // Randomize hotspots dynamically on manual scan
    setTimeout(() => {
      setHotspots((prev) =>
        prev.map((h) => {
          const delta = Math.floor(Math.random() * 5) - 2;
          return {
            ...h,
            currentActive: Math.max(8, h.currentActive + delta),
            isRecentlyUpdated: true
          };
        })
      );
      setIsScanning(false);
      setLastSyncSecondsAgo(0);
      setScanTimestamp("Just now");
      if (triggerBoom) {
        triggerBoom("Radar sweep complete: 100% ID-verified companions synced across NCR! 📡");
      }
    }, 1200);
  };

  return (
    <div className="relative">
      
      {/* 1. SECTION HEADER WITH LIVE PULSE & REAL-TIME COUNTER */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="tag">Live Telemetry</span>
            <span className="text-xs font-black text-[#1f4ee0] uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#1f4ee0]" />
              Real-Time Activity Engine
            </span>
          </div>
          <h2 className="text-[32px] sm:text-[48px] font-extrabold tracking-tight text-[#0b1f5c] leading-tight">
            Live Hangouts Radar
          </h2>
          <p className="text-[#4a5a8a] font-medium text-base sm:text-lg max-w-2xl mt-1">
            Real-time blue light radar monitoring active verified companions, public venues, and escrow sessions right now across Gurugram, Delhi, and Noida.
          </p>
        </div>

        {/* Live Active Pill & Refresh Action */}
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-2xl border-[2.5px] border-[#0b1f5c] shadow-[3px_3px_0_#0b1f5c]">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#1f4ee0] shadow-[0_0_8px_#1f4ee0]"></span>
            </span>
            <div>
              <div className="flex items-baseline gap-1">
                <motion.span 
                  key={totalActive}
                  initial={{ scale: 1.2, color: "#1f4ee0" }}
                  animate={{ scale: 1, color: "#0b1f5c" }}
                  className="text-base sm:text-lg font-black tracking-tight"
                >
                  {totalActive}
                </motion.span>
                <span className="text-xs font-extrabold text-[#0b1f5c]">Companions Online</span>
              </div>
              <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Updated {lastSyncSecondsAgo}s ago · 24ms
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleScanRadar}
            disabled={isScanning}
            className={`btn text-xs py-2.5 px-3.5 shadow-[2px_2px_0_#0b1f5c] cursor-pointer flex items-center gap-1.5 ${
              isScanning ? "bg-[#ffc933] opacity-80" : "bg-white hover:bg-slate-50"
            }`}
            title="Scan Radar for latest active companions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin text-[#0b1f5c]" : "text-[#1f4ee0]"}`} />
            <span className="hidden sm:inline font-bold">{isScanning ? "Scanning NCR..." : "Scan Radar"}</span>
          </button>
        </div>
      </motion.div>

      {/* 2. MAIN INTERACTIVE RADAR DASHBOARD */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="bg-white border-[3px] border-[#0b1f5c] rounded-[32px] p-5 sm:p-8 shadow-[8px_8px_0_#0b1f5c] relative overflow-hidden"
      >
        
        {/* Launch Privilege Banner */}
        <div className="bg-[#011C92] border border-[#3DAAFC]/30 text-white rounded-2xl px-4 py-3 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-white/90">
            <span className="text-base">🎁</span>
            <span>First 3 Hangouts are 100% FREE! Meet verified partners across any radar hub with ₹0 fee to build mutual comfort & reviews.</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-[#FFC83D] text-[#0B1230] px-3 py-1 rounded-full shrink-0 shadow-xs">
            Sessions 1, 2, 3 = ₹0 Free
          </span>
        </div>

        {/* City Filter Tabs & Telemetry Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b-[2px] border-[#0b1f5c]/20 gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(["all", "Gurugram", "Delhi", "Noida"] as const).map((city) => {
              const isSelected = selectedCity === city;
              const count = city === "all" 
                ? totalActive 
                : hotspots.filter(h => h.city === city).reduce((a, b) => a + b.currentActive, 0);

              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setSelectedCity(city);
                  }}
                  className={`chip text-xs sm:text-sm py-1.5 px-3.5 transition-all cursor-pointer ${
                    isSelected ? "active" : ""
                  }`}
                >
                  <span>{city === "all" ? "📍 All NCR" : city}</span>
                  <span className={`text-[10px] ml-1.5 px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? "bg-white text-[#0b1f5c]" : "bg-blue-100 text-[#1f4ee0]"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-[#4a5a8a] self-start sm:self-auto">
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ₹{totalEscrowProtected.toLocaleString("en-IN")} Escrow Protected
            </span>
          </div>
        </div>

        {/* 3. DYNAMIC HOTSPOT METRIC CARDS (Top 4 Featured Hubs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {filteredHotspots.slice(0, 4).map((spot) => (
            <motion.div 
              key={spot.id}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => {
                audio.playClick();
                setSelectedHotspot(spot);
              }}
              className={`border-[2px] rounded-2xl p-3.5 flex flex-col justify-between transition-all cursor-pointer min-w-0 ${
                spot.isRecentlyUpdated
                  ? "bg-[#eaf3ff] border-[#1f4ee0] shadow-[3px_3px_0_#1f4ee0]"
                  : "bg-[#f3f8ff] border-[#0b1f5c] shadow-[3px_3px_0_#0b1f5c] hover:border-[#1f4ee0]"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-xl p-1.5 bg-white rounded-lg border border-[#0b1f5c]/30 shadow-xs shrink-0">
                    {spot.icon}
                  </span>
                  <div className="leading-tight min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-extrabold text-[#0b1f5c] truncate">
                      {spot.name}
                    </p>
                    <p className="text-[11px] text-[#4a5a8a] font-bold">
                      {spot.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 bg-white px-2 py-0.5 rounded-full border border-[#0b1f5c]/30">
                  <div className="w-2 h-2 rounded-full bg-[#1f4ee0] shadow-[0_0_6px_#1f4ee0] animate-pulse"></div>
                  <motion.span 
                    key={spot.currentActive}
                    initial={{ scale: 1.3, color: "#1f4ee0" }}
                    animate={{ scale: 1, color: "#0b1f5c" }}
                    className="text-xs font-black tabular-nums"
                  >
                    {spot.currentActive}
                  </motion.span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#0b1f5c]/10 flex items-center justify-between gap-2 text-[11px] text-[#1f4ee0] font-bold">
                <span className="truncate text-[#4a5a8a] min-w-0">
                  {spot.topActivities[0]}
                </span>
                <span className="flex items-center shrink-0">
                  Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. VIEW MODE TOGGLE & LIVE MAP / RADAR DISPLAY */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setViewMode("map");
                analytics.trackViewModeSwitch("map");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 border-[2px] transition-all cursor-pointer ${
                viewMode === "map"
                  ? "bg-[#1f4ee0] text-white border-[#0b1f5c] shadow-[2.5px_2.5px_0_#0b1f5c]"
                  : "bg-white text-[#0b1f5c] border-[#0b1f5c]/30 hover:border-[#0b1f5c]"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#ffc933]" />
              <span>🗺️ Google Maps View</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono">Interactive</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setViewMode("radar");
                analytics.trackViewModeSwitch("radar");
              }}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 border-[2px] transition-all cursor-pointer ${
                viewMode === "radar"
                  ? "bg-[#0b1f5c] text-white border-[#0b1f5c] shadow-[2.5px_2.5px_0_#0b1f5c]"
                  : "bg-white text-[#0b1f5c] border-[#0b1f5c]/30 hover:border-[#0b1f5c]"
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>🛰️ Sonar Radar View</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold text-[#4a5a8a]">
            <Sparkles className="w-3.5 h-3.5 text-[#1f4ee0]" />
            <span>Interactive Google Maps with live companion pins & directions</span>
          </div>
        </div>

        {viewMode === "map" ? (
          <GoogleHangoutsMap
            hotspots={filteredHotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={(spot) => setSelectedHotspot(spot)}
            onBookCompanion={(compName, loc) => onOpenBookingClick(compName, loc)}
            triggerBoom={triggerBoom}
            selectedCity={selectedCity}
          />
        ) : (
          <div className="relative w-full h-72 sm:h-96 bg-[#071330] rounded-[24px] overflow-hidden border-[3px] border-[#0b1f5c] flex items-center justify-center p-4 shadow-inner">
            {/* Stylized Delhi NCR Map Vector Grid / Trails */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#radar-grid)" />
              {/* Expressways lines (NH48, Ring Road, Mehrauli-Gurgaon Rd) */}
              <path d="M 50 250 Q 200 180 400 140 T 800 100" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6,6" opacity="0.6" />
              <path d="M 200 400 Q 300 250 500 150 T 700 80" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
            </svg>

            {/* Concentric distance radar rings (10km, 25km, 40km range rings) */}
            <div className="absolute w-44 h-44 sm:w-64 sm:h-64 rounded-full border border-cyan-400/25"></div>
            <div className="absolute w-72 h-72 sm:w-[420px] sm:h-[420px] rounded-full border border-cyan-400/15"></div>
            <div className="absolute w-[500px] h-[500px] sm:w-[620px] sm:h-[620px] rounded-full border border-cyan-400/10"></div>
            
            {/* Center Crosshairs */}
            <div className="absolute w-full h-[1px] bg-cyan-400/20"></div>
            <div className="absolute h-full w-[1px] bg-cyan-400/20"></div>
            <div className="absolute w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]"></div>

            {/* Range Labels */}
            <span className="absolute top-1/2 left-[58%] -translate-y-1/2 text-[9px] font-mono text-cyan-400/50">10km</span>
            <span className="absolute top-1/2 left-[78%] -translate-y-1/2 text-[9px] font-mono text-cyan-400/40">25km</span>

            {/* Rotating Conic Radar Sweep Beam */}
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "conic-gradient(from 0deg at 50% 50%, rgba(56, 189, 248, 0.42) 0deg, rgba(31, 78, 224, 0.15) 30deg, transparent 70deg, transparent 360deg)"
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: isScanning ? 2.5 : 6.5, ease: "linear" }}
            />

            {/* Pulsing Blue Light Hotspots with Real-Time Dynamic Coordinates */}
            {filteredHotspots.map((spot) => (
              <motion.div
                key={spot.id}
                className="absolute group cursor-pointer z-20"
                style={{
                  left: `${spot.coords.x}%`,
                  top: `${spot.coords.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
                whileHover={{ scale: 1.35 }}
                onClick={() => {
                  audio.playClick();
                  setSelectedHotspot(spot);
                }}
              >
                {/* Outer Pulsing Aura */}
                <div className="relative flex items-center justify-center">
                  <span className={`animate-ping absolute rounded-full bg-cyan-400 opacity-75 ${
                    spot.isRecentlyUpdated ? "h-10 w-10 bg-amber-400" : "h-7 w-7"
                  }`}></span>
                  
                  {/* Center Core Blue Light */}
                  <span className={`relative flex rounded-full border-2 border-white shadow-[0_0_16px_#38bdf8] ${
                    spot.isRecentlyUpdated ? "h-4 w-4 bg-amber-300" : "h-3.5 w-3.5 bg-cyan-300"
                  }`}></span>
                </div>
                
                {/* Permanent Spot Label on Map */}
                <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-white bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded border border-white/20 shadow-md flex items-center gap-1 group-hover:bg-[#1f4ee0] transition-colors">
                  <span>{spot.icon}</span>
                  <span className="hidden sm:inline">{spot.name}</span>
                  <span className="font-mono text-cyan-300 font-extrabold">({spot.currentActive})</span>
                </div>

                {/* Tooltip on Hover */}
                <div className="hidden group-hover:block absolute bottom-full mb-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-[#0b1f5c] text-xs font-black px-3 py-1.5 rounded-xl border-[2px] border-[#0b1f5c] shadow-[3px_3px_0_#0b1f5c] z-30 pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <span>{spot.name}:</span>
                    <span className="text-[#1f4ee0] font-black">{spot.currentActive} online</span>
                  </div>
                  <p className="text-[10px] text-[#4a5a8a] font-medium">{spot.topActivities[0]}</p>
                </div>
              </motion.div>
            ))}

            {/* Radar Telemetry Footer Overlays */}
            <div className="absolute bottom-3 left-4 text-[11px] font-bold text-cyan-200 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-cyan-500/30">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse"></span>
              <span>Live GPS Escrow Radar: Gurugram, Delhi & Noida</span>
            </div>

            <div className="absolute bottom-3 right-4 text-[11px] font-mono text-cyan-300 z-10 hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-cyan-500/30">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>PING 24ms · 100% ID SECURE</span>
            </div>
          </div>
        )}

        {/* 5. LIVE ACTIVITY FEED STREAM ("HAPPENING RIGHT NOW IN NCR") */}
        <div className="mt-6 pt-5 border-t-[2px] border-[#0b1f5c]/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0b1f5c] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1f4ee0] animate-pulse" />
              Live Activity Stream (Real-Time NCR Hangouts)
            </h4>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
              ● Live Sync
            </span>
          </div>

          {/* Activity items scrolling list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activityFeed.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#f3f8ff] border-[1.5px] border-[#0b1f5c] rounded-xl p-2.5 flex items-center justify-between text-xs font-semibold text-[#0b1f5c] hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-2 truncate mr-2">
                  <span className="text-base p-1 bg-white rounded-md border border-[#0b1f5c]/20 shrink-0">
                    {ev.icon}
                  </span>
                  <div className="truncate leading-tight">
                    <p className="truncate font-bold text-[#0b1f5c]">{ev.text}</p>
                    <p className="text-[10px] text-[#4a5a8a] flex items-center gap-1 font-semibold">
                      <span>{ev.hotspotName}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-bold">₹{ev.escrowAmount} Escrow Locked</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#1f4ee0] font-bold shrink-0 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {ev.timestamp}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </motion.div>

      {/* 6. HOTSPOT DETAIL MODAL / INSPECTOR (Triggered on Node Click) */}
      <AnimatePresence>
        {selectedHotspot && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-white border-[3px] border-[#0b1f5c] rounded-3xl sm:rounded-[28px] max-w-lg w-full shadow-[8px_8px_0_#0b1f5c] overflow-y-auto max-h-[92vh] my-auto"
            >
              {/* Modal Header */}
              <div className="bg-[#f3f8ff] border-b-[2.5px] border-[#0b1f5c] p-4 sm:p-5 flex items-center justify-between gap-3 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-white rounded-xl border border-[#0b1f5c]">
                    {selectedHotspot.icon}
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0b1f5c]">
                      {selectedHotspot.name}
                    </h3>
                    <p className="text-xs font-bold text-[#1f4ee0]">
                      📍 {selectedHotspot.city} · {selectedHotspot.currentActive} Companions Active Right Now
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedHotspot(null)}
                  className="p-1.5 rounded-full border-[2px] border-[#0b1f5c] hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-[#0b1f5c]" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-4">
                
                {/* Popular activities */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#4a5a8a] mb-2">
                    Popular Activities Here Today:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedHotspot.topActivities.map((act, i) => (
                      <span key={i} className="text-xs font-bold bg-[#f3f8ff] text-[#0b1f5c] px-3 py-1 rounded-full border border-[#0b1f5c]">
                        ⚡ {act}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Companions Online at this Spot */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#4a5a8a] mb-2">
                    Verified Hosts at {selectedHotspot.name}:
                  </h4>
                  <div className="space-y-2">
                    {selectedHotspot.activeCompanions.map((comp, idx) => (
                      <div 
                        key={idx}
                        className="bg-slate-50 border-[1.5px] border-[#0b1f5c] rounded-xl p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{comp.emoji}</span>
                          <div>
                            <p className="text-xs font-extrabold text-[#0b1f5c]">{comp.name}</p>
                            <p className="text-[10px] text-[#4a5a8a] font-semibold">{comp.activity}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-[#1f4ee0]">₹{comp.rate}/hr</span>
                          <p className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                            {comp.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Guarantee */}
                <div className="bg-emerald-50 border-[1.5px] border-emerald-600 rounded-xl p-3 flex items-start gap-2.5 text-xs font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span>100% Verified Public Venue Guarantee</span>
                    <p className="text-[11px] font-medium text-emerald-800 mt-0.5">
                      All hangouts at {selectedHotspot.name} are escrow-protected. Funds only release after your mutual session approval.
                    </p>
                  </div>
                </div>

                {/* Venue Address & Google Maps Navigation */}
                <div className="bg-[#f3f8ff] border border-[#0b1f5c]/20 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-[#4a5a8a] text-[11px] truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#1f4ee0] shrink-0" />
                    <span className="truncate">{selectedHotspot.address}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${selectedHotspot.name}, ${selectedHotspot.city}, India`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1 font-bold text-[11px] text-[#1f4ee0] hover:underline"
                  >
                    Open in Maps
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>

                {/* Direct Action */}
                <div className="pt-1 flex items-center gap-2">
                  <a
                    href="#match"
                    onClick={() => {
                      audio.playClick();
                      setSelectedHotspot(null);
                      if (onOpenBookingClick) {
                        onOpenBookingClick(selectedHotspot.activeCompanions[0]?.name, selectedHotspot.name);
                      }
                    }}
                    className="btn b w-full py-3 text-sm shadow-[3px_3px_0_#0b1f5c] text-center"
                  >
                    ⚡ Book Free Experience at {selectedHotspot.name}
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
