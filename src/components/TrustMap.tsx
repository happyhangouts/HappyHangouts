import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Users, 
  Compass, 
  CheckCircle2, 
  Activity, 
  ShieldCheck, 
  Coffee, 
  Sparkles,
  Music,
  Tv,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { audio } from "../utils/audio";

interface Spot {
  id: string;
  name: string;
  city: "Delhi" | "Gurgaon" | "Noida";
  category: "sports" | "outdoors" | "cafe" | "startups" | "music";
  activeCount: number;
  partnerName: string;
  x: number; // percentage from left
  y: number; // percentage from top
  landmark: string;
}

const SPOTS_DATA: Spot[] = [
  // --- DELHI VERIFIED SPOTS (12 Spots Minimum) ---
  {
    id: "sunder-nursery",
    name: "Sunder Nursery Gardens",
    city: "Delhi",
    category: "outdoors",
    activeCount: 8,
    partnerName: "Greenwood Guides",
    x: 52,
    y: 42,
    landmark: "Nizamuddin, New Delhi"
  },
  {
    id: "siri-fort",
    name: "Siri Fort Sports Complex",
    city: "Delhi",
    category: "sports",
    activeCount: 11,
    partnerName: "Siri Fort Shuttle Club",
    x: 48,
    y: 56,
    landmark: "August Kranti Marg, South Delhi"
  },
  {
    id: "connaught-place",
    name: "Third Wave Coffee, CP",
    city: "Delhi",
    category: "cafe",
    activeCount: 12,
    partnerName: "CP Intellectual Circle",
    x: 50,
    y: 28,
    landmark: "Inner Circle, Connaught Place"
  },
  {
    id: "ngma-delhi",
    name: "National Gallery of Modern Art",
    city: "Delhi",
    category: "outdoors",
    activeCount: 6,
    partnerName: "NGMA Culture Enthusiasts",
    x: 55,
    y: 34,
    landmark: "Jaipur House, India Gate, Delhi"
  },
  {
    id: "kunzum-hkv",
    name: "Kunzum Travel Cafe & Books",
    city: "Delhi",
    category: "cafe",
    activeCount: 7,
    partnerName: "Hauz Khas Reader's Guild",
    x: 44,
    y: 48,
    landmark: "Hauz Khas Village, New Delhi"
  },
  {
    id: "habitat-world",
    name: "Habitat World Auditorium",
    city: "Delhi",
    category: "music",
    activeCount: 9,
    partnerName: "Lodhi Cultural Forum",
    x: 51,
    y: 38,
    landmark: "Lodhi Road, New Delhi"
  },
  {
    id: "lodhi-art",
    name: "Lodhi Art District Open Walk",
    city: "Delhi",
    category: "outdoors",
    activeCount: 5,
    partnerName: "Capital Street Photographers",
    x: 49,
    y: 40,
    landmark: "Lodhi Colony, New Delhi"
  },
  {
    id: "delhi-guitar",
    name: "Delhi Guitar Academy & Jam",
    city: "Delhi",
    category: "music",
    activeCount: 8,
    partnerName: "Saket Acoustic Society",
    x: 46,
    y: 62,
    landmark: "Saket District Centre, Delhi"
  },
  {
    id: "blue-tokai-khan",
    name: "Blue Tokai Coffee Roasters",
    city: "Delhi",
    category: "cafe",
    activeCount: 10,
    partnerName: "Khan Market Brew Club",
    x: 53,
    y: 32,
    landmark: "Khan Market, New Delhi"
  },
  {
    id: "innov8-cp",
    name: "Innov8 Co-working Lounge",
    city: "Delhi",
    category: "startups",
    activeCount: 14,
    partnerName: "CP Founder Exchange",
    x: 48,
    y: 24,
    landmark: "Regal Building, Connaught Place"
  },
  {
    id: "deer-park",
    name: "Deer Park & Hauz Khas Lakefront",
    city: "Delhi",
    category: "outdoors",
    activeCount: 7,
    partnerName: "Hauz Khas Nature Collective",
    x: 42,
    y: 52,
    landmark: "Hauz Khas Enclave, New Delhi"
  },
  {
    id: "dhyan-chand",
    name: "National Stadium Sports Arena",
    city: "Delhi",
    category: "sports",
    activeCount: 9,
    partnerName: "Delhi Turf & Athletics Club",
    x: 56,
    y: 30,
    landmark: "Near India Gate, New Delhi"
  },

  // --- GURGAON VERIFIED SPOTS (5 Spots) ---
  {
    id: "cyberhub",
    name: "WeWork Lounge, CyberHub",
    city: "Gurgaon",
    category: "startups",
    activeCount: 9,
    partnerName: "Cyber Founder Alliance",
    x: 20,
    y: 62,
    landmark: "DLF Phase 3, Gurgaon"
  },
  {
    id: "piano-man",
    name: "The Piano Man Jazz Club",
    city: "Gurgaon",
    category: "music",
    activeCount: 6,
    partnerName: "Acoustic Sessions NCR",
    x: 24,
    y: 72,
    landmark: "Sector 15, Gurgaon"
  },
  {
    id: "leopard-trail",
    name: "Leopard Trail Rustic Track",
    city: "Gurgaon",
    category: "outdoors",
    activeCount: 4,
    partnerName: "Aravalli Cyclists",
    x: 16,
    y: 84,
    landmark: "Aravalli foothills, Gurgaon"
  },
  {
    id: "cult-gtn",
    name: "Cult Fit Arena & Sports Turf",
    city: "Gurgaon",
    category: "sports",
    activeCount: 8,
    partnerName: "Gurgaon Athletic Club",
    x: 28,
    y: 66,
    landmark: "Sector 45, Gurgaon"
  },
  {
    id: "hamoni-golf",
    name: "Hamoni Golf Open Cafe",
    city: "Gurgaon",
    category: "cafe",
    activeCount: 5,
    partnerName: "Golf Course Rd Circle",
    x: 18,
    y: 76,
    landmark: "Sector 23, Gurgaon"
  },

  // --- NOIDA VERIFIED SPOTS (5 Spots) ---
  {
    id: "blue-tokai-noida",
    name: "Blue Tokai Coffee",
    city: "Noida",
    category: "cafe",
    activeCount: 7,
    partnerName: "Noida Brew Syndicate",
    x: 76,
    y: 38,
    landmark: "Sector 15, Noida"
  },
  {
    id: "okhla-sanctuary",
    name: "Okhla Bird Sanctuary Trail",
    city: "Noida",
    category: "outdoors",
    activeCount: 5,
    partnerName: "Yamuna Walkers Club",
    x: 82,
    y: 49,
    landmark: "Amrapali Marg, Noida"
  },
  {
    id: "sec-104-cafe",
    name: "The Book Cover Cafe",
    city: "Noida",
    category: "cafe",
    activeCount: 5,
    partnerName: "Noida Lit Society",
    x: 78,
    y: 60,
    landmark: "Sector 104, Noida"
  },
  {
    id: "noida-stadium",
    name: "Noida Stadium Badminton Complex",
    city: "Noida",
    category: "sports",
    activeCount: 10,
    partnerName: "Noida Indoor Sports League",
    x: 84,
    y: 32,
    landmark: "Sector 21A, Noida"
  },
  {
    id: "forest-cowork",
    name: "The Forest Co-working Lounge",
    city: "Noida",
    category: "startups",
    activeCount: 6,
    partnerName: "Noida Tech Founders",
    x: 80,
    y: 24,
    landmark: "Sector 62, Noida"
  }
];

const SIMULATED_SYNC_LOGS = [
  { nameA: "Aditya S.", nameB: "Tanya M.", spot: "Sunder Nursery", activity: "Acoustic Guitar Jam", key: "#301" },
  { nameA: "Vikram K.", nameB: "Rohan D.", spot: "Siri Fort Complex", activity: "Badminton Doubles", key: "#114" },
  { nameA: "Meera J.", nameB: "Ananya P.", spot: "Blue Tokai Noida", activity: "Cafe Conversations", key: "#289" },
  { nameA: "Siddharth R.", nameB: "Preeti V.", spot: "WeWork CyberHub", activity: "Startup Pitch Sync", key: "#402" },
  { nameA: "Kabir L.", nameB: "Ishaan T.", spot: "Leopard Trail", activity: "Early Cycling Trail", key: "#085" },
  { nameA: "Neha B.", nameB: "Tanmay C.", spot: "Third Wave CP", activity: "Book Discussion", key: "#193" }
];

interface TrustMapProps {
  onJoinWaitlist: (interests?: string) => void;
}

export default function TrustMap({ onJoinWaitlist }: TrustMapProps) {
  const [selectedCity, setSelectedCity] = useState<"All" | "Delhi" | "Gurgaon" | "Noida">("All");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "sports" | "outdoors" | "cafe" | "startups" | "music">("all");
  const [activeSpot, setActiveSpot] = useState<Spot>(SPOTS_DATA[0]);
  const [syncLogs, setSyncLogs] = useState(SIMULATED_SYNC_LOGS.slice(0, 3));
  const [totalLiveUsers, setTotalLiveUsers] = useState(138);

  // Dynamic live stream simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random log template
      const template = SIMULATED_SYNC_LOGS[Math.floor(Math.random() * SIMULATED_SYNC_LOGS.length)];
      // Slightly randomize names for realistic simulation
      const firstNames = ["Abhishek", "Riya", "Karan", "Ayesha", "Dhruv", "Zoya", "Manish", "Divya", "Pranav", "Shruti"];
      const lastInitials = ["A.", "G.", "K.", "R.", "P.", "S.", "V.", "M.", "H.", "T."];
      
      const newLog = {
        nameA: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastInitials[Math.floor(Math.random() * lastInitials.length)]}`,
        nameB: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastInitials[Math.floor(Math.random() * lastInitials.length)]}`,
        spot: template.spot,
        activity: template.activity,
        key: `#${Math.floor(100 + Math.random() * 899)}`
      };

      setSyncLogs(prev => [newLog, ...prev.slice(0, 2)]);
      
      // Slightly fluctuate live users count
      setTotalLiveUsers(prev => prev + (Math.random() > 0.4 ? 1 : -1));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const filteredSpots = SPOTS_DATA.filter(spot => {
    const cityMatch = selectedCity === "All" || spot.city === selectedCity;
    const catMatch = selectedCategory === "all" || spot.category === selectedCategory;
    return cityMatch && catMatch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sports": return "🏸";
      case "outdoors": return "🌲";
      case "cafe": return "☕";
      case "startups": return "💡";
      case "music": return "🎸";
      default: return "📍";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sports": return "bg-emerald-500 border-emerald-400 text-emerald-600";
      case "outdoors": return "bg-sky-500 border-sky-400 text-sky-600";
      case "cafe": return "bg-amber-500 border-amber-400 text-amber-600";
      case "startups": return "bg-blue-500 border-blue-400 text-blue-600";
      case "music": return "bg-indigo-500 border-indigo-400 text-indigo-600";
      default: return "bg-slate-500 border-slate-400 text-slate-600";
    }
  };

  const handleSpotClick = (spot: Spot) => {
    audio.playClick();
    setActiveSpot(spot);
  };

  return (
    <section id="trust-map" className="py-24 px-6 max-w-7xl mx-auto relative border-b border-slate-100">
      
      {/* Grid Pattern Decorative Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-70 pointer-events-none" />

      {/* Title block */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 relative">
        <span className="text-[10px] uppercase tracking-[0.25em] font-black text-blue-600 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-100 font-mono inline-block">
          📍 LIVE TRUST LANDSCAPE
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-[-0.04em] font-display leading-[1.05]">
          A live map built <br />
          on <span className="text-blue-600">absolute trust.</span>
        </h2>
        <p className="text-slate-500 text-sm font-light max-w-xl mx-auto leading-relaxed">
          See certified hubs, active seekers, and verified live sync handshakes across Delhi NCR. No anonymous coordinates, only real human connections at verified local spots.
        </p>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12 relative">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-slate-200 transition-colors">
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">Delhi NCR</div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1">Operational Area</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-slate-200 transition-colors">
          <div className="text-2xl sm:text-3xl font-black text-blue-600 font-display flex items-center justify-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse inline-block" />
            {totalLiveUsers}
          </div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1">Live Seekers Syncing</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-slate-200 transition-colors">
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-display">{SPOTS_DATA.length}+ Spots</div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1">Certified Hubs (10+ Delhi)</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-slate-200 transition-colors">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-display flex items-center justify-center gap-1">
            <ShieldCheck className="w-6 h-6 text-emerald-500 stroke-[2.5]" />
            100%
          </div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-1">ID Verified Base</p>
        </div>
      </div>

      {/* Main Interactive Map Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
        
        {/* LEFT COLUMN: FILTERS & SPOT INFO (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          
          {/* Filter Panel */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-100 p-6 rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.01)] space-y-5 text-left">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  Filter Regions
                </h3>
                <span className="text-[9.5px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                  {filteredSpots.length} Spot{filteredSpots.length === 1 ? '' : 's'} Verified
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {["All", "Delhi", "Gurgaon", "Noida"].map((city) => (
                  <button
                    key={city}
                    onClick={() => { audio.playClick(); setSelectedCity(city as any); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCity === city 
                        ? "bg-slate-900 text-white shadow-sm" 
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    {city === "All" ? "📍 All Areas" : city}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono">
                Interest Category
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {[
                  { id: "all", label: "✨ All", emoji: "⚡" },
                  { id: "sports", label: "Sports", emoji: "🏸" },
                  { id: "outdoors", label: "Outdoors", emoji: "🌲" },
                  { id: "cafe", label: "Cafés", emoji: "☕" },
                  { id: "startups", label: "Startups", emoji: "💡" },
                  { id: "music", label: "Music", emoji: "🎸" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { audio.playClick(); setSelectedCategory(cat.id as any); }}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1 ${
                      selectedCategory === cat.id 
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10" 
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Spot Details Card */}
          {activeSpot && (
            <div className="bg-slate-900 text-white p-6 rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] space-y-4 text-left border border-slate-950 relative overflow-hidden flex-1 flex flex-col justify-between">
              {/* Subtle visual grid background */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
              
              <div className="space-y-4 relative">
                <div className="flex justify-end items-center">
                  <span className="text-2xl">{getCategoryIcon(activeSpot.category)}</span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-lg sm:text-xl font-black font-display tracking-tight leading-snug">
                    {activeSpot.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-light flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    {activeSpot.landmark}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-slate-800">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500">Pulsing Seekers</span>
                    <div className="flex items-center gap-1.5 font-display text-sm font-black text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      {activeSpot.activeCount} Active Now
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500">Certified Host</span>
                    <div className="text-xs font-bold text-slate-200 truncate flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-indigo-400" />
                      {activeSpot.partnerName}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 bg-slate-800/40 border border-slate-800 p-3 rounded-xl text-[11px] text-slate-300 font-light leading-relaxed">
                  <p className="font-semibold text-white flex items-center gap-1">
                    🔒 Happy Key Handshake Active
                  </p>
                  <span>Our certified partners enforce physical ID checks and dual-part Happy Key matching here for absolute co-human trust.</span>
                </div>
              </div>

              <button
                onClick={() => {
                  audio.playPageTransition();
                  onJoinWaitlist(`Want to join active seekers at ${activeSpot.name}`);
                }}
                className="w-full mt-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200 animate-pulse" />
                Become a Partner at this Spot
              </button>
            </div>
          )}
        </div>

        {/* MIDDLE COLUMN: THE MAP CANVAS CANVAS (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex flex-col justify-between relative overflow-hidden min-h-[450px]">
          
          {/* Subtle grid pattern for blueprint look */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          {/* Decorative Legend Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md border border-slate-100 px-3 py-2 rounded-xl text-[9px] font-mono uppercase tracking-wider text-slate-400 shadow-sm space-y-1 pointer-events-none text-left">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Delhi NCR Sync Plane
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Pulse Beacons Live
            </div>
          </div>

          <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md border border-slate-100 px-2.5 py-1.5 rounded-xl text-[9px] font-mono font-bold text-slate-500 shadow-sm pointer-events-none">
            GRID RESOLUTION: 0.05m²
          </div>

          {/* Interactive Map Visual Stage */}
          <div className="relative w-full flex-1 flex items-center justify-center min-h-[350px]">
            
            {/* Elegant SVG paths connecting the spots for visual trust flow */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              {/* Gurgaon to Delhi center */}
              <line x1="20%" y1="62%" x2="50%" y2="28%" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
              {/* Gurgaon back to Delhi south */}
              <line x1="24%" y1="72%" x2="48%" y2="56%" stroke="#cbd5e1" strokeWidth="1" />
              {/* Noida to Delhi center */}
              <line x1="76%" y1="38%" x2="50%" y2="28%" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
              {/* Noida to Delhi south */}
              <line x1="78%" y1="60%" x2="48%" y2="56%" stroke="#cbd5e1" strokeWidth="1" />
              {/* Delhi south to Delhi center */}
              <line x1="48%" y1="56%" x2="52%" y2="42%" stroke="#cbd5e1" strokeWidth="1.5" />
            </svg>

            {/* Simulated Region Label overlays */}
            <div className="absolute left-[12%] top-[55%] pointer-events-none opacity-40 font-mono text-[10px] uppercase font-bold text-slate-400 tracking-widest rotate-[-12deg]">
              GURGAON AREA
            </div>
            <div className="absolute left-[45%] top-[15%] pointer-events-none opacity-40 font-mono text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              DELHI AREA
            </div>
            <div className="absolute right-[12%] top-[30%] pointer-events-none opacity-40 font-mono text-[10px] uppercase font-bold text-slate-400 tracking-widest rotate-[15deg]">
              NOIDA AREA
            </div>

            {/* Glowing Map Spots Map Pins */}
            {filteredSpots.map((spot) => {
              const isActive = activeSpot?.id === spot.id;
              
              return (
                <div 
                  key={spot.id}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group/pin z-20"
                >
                  {/* Outer Pulsing Glow Indicator */}
                  <div className="relative">
                    <span className="absolute -inset-4 rounded-full bg-blue-500/10 scale-0 group-hover/pin:scale-100 transition-transform duration-300 pointer-events-none" />
                    
                    {/* Live ping animation */}
                    <span className="absolute -inset-1.5 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />

                    {/* Interactive Marker Dot */}
                    <button
                      onClick={() => handleSpotClick(spot)}
                      className={`w-8 h-8 rounded-full border shadow-md flex items-center justify-center transition-all ${
                        isActive 
                          ? "bg-blue-600 border-blue-500 text-white scale-125 z-30" 
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:scale-110"
                      }`}
                    >
                      <span className="text-xs font-semibold">{getCategoryIcon(spot.category)}</span>
                    </button>

                    {/* Miniature Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[9px] font-mono px-2 py-1 rounded-md opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                      {spot.name} • {spot.activeCount} live
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footnotes instruction */}
          <div className="border-t border-slate-100/80 pt-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>🖱 CLICK ANY SPOT TO VERIFY CAPACITY</span>
            <span> delhi-ncr-v1.2</span>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE FEED & REASSURANCE (3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.01)] flex flex-col justify-between text-left">
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono">
                  Live Trust Stream
                </h3>
              </div>
              <p className="text-[10px] text-slate-400 font-light mt-1">
                Real-time synchronized companion logs with dual-part Happy Key authentications.
              </p>
            </div>

            {/* Dynamic Sync Stream Stack */}
            <div className="space-y-3.5">
              {syncLogs.map((log, index) => (
                <div 
                  key={index + log.nameA}
                  className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors space-y-2 animate-fade-in text-xs"
                >
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span className="font-extrabold text-blue-600 uppercase tracking-wider">SYNC COMPLETED</span>
                    <span className="font-bold text-slate-500">{log.key}</span>
                  </div>
                  
                  <p className="text-slate-800 font-semibold leading-snug">
                    {log.nameA} <span className="text-slate-400 font-light">matched with</span> {log.nameB}
                  </p>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-light">🎯 {log.activity}</span>
                    <span className="font-mono text-slate-400">📍 {log.spot}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Trust Reassurance Shield */}
          <div className="border-t border-slate-100 pt-5 mt-6 space-y-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider font-mono">Guaranteed Human Safety</h4>
                <p className="text-[10px] text-slate-400 font-light leading-relaxed">No anonymous drop coordinates are ever permitted. Every encounter starts safely at verified public spots curated by local partners.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
