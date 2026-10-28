import React, { useState, useEffect, useMemo } from "react";
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Calendar, 
  Coins, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight,
  Star,
  Layers,
  Cpu
} from "lucide-react";
import { 
  COMPANION_PARTNERS, 
  PRESET_SEEKER_REQUESTS, 
  SeekerRequest, 
  calculateMatches, 
  CompanionPartner, 
  MatchResult,
  TimeOfDay,
  DayOption
} from "../data/companions";
import SpatialCard3D from "./SpatialCard3D";
import { audio } from "../utils/audio";

interface FuturisticMatchmakerProps {
  onSelectCompanionToBook: (companion: CompanionPartner, matchedSlot?: string) => void;
}

const AVAILABLE_INTERESTS = [
  "Specialty Coffee",
  "Badminton",
  "Tech & Startups",
  "Street Photography",
  "Chess & Strategy",
  "Live Music & Guitar",
  "Pickleball",
  "Book Reading",
  "Heritage Walks",
  "Sports & Fitness",
  "Board Games",
  "Foodie Walk"
];

const DELHI_NCR_ZONES = [
  { id: "all", label: "All Delhi & Gurgaon" },
  { id: "Gurgaon", label: "Gurgaon (CyberHub / Horizon / 32nd)" },
  { id: "Central Delhi", label: "Central Delhi (Khan Mkt / CP)" },
  { id: "South Delhi", label: "South Delhi (Siri Fort / HKV / Saket)" },
  { id: "North Delhi", label: "North Delhi (Civil Lines / Campus)" },
  { id: "West Delhi", label: "West Delhi (Dwarka / Rajouri)" }
];

const TIME_SLOTS: { id: TimeOfDay | "any"; label: string; timeRange: string; icon: string }[] = [
  { id: "any", label: "Any Time", timeRange: "Flexible", icon: "🕒" },
  { id: "morning", label: "Morning", timeRange: "8:00 AM - 12:00 PM", icon: "🌅" },
  { id: "afternoon", label: "Afternoon", timeRange: "12:00 PM - 4:00 PM", icon: "☀️" },
  { id: "evening", label: "Evening", timeRange: "4:00 PM - 8:00 PM", icon: "🌆" },
  { id: "night", label: "Night", timeRange: "8:00 PM - 11:30 PM", icon: "🌙" }
];

const DAYS: { id: DayOption; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "weekend", label: "This Weekend" },
  { id: "weekdays", label: "Weekdays" },
  { id: "any", label: "Any Day" }
];

export default function FuturisticMatchmaker({ onSelectCompanionToBook }: FuturisticMatchmakerProps) {
  // Current active seeker request state
  const [activeRequest, setActiveRequest] = useState<SeekerRequest>({
    interestTags: ["Specialty Coffee", "Book Reading"],
    city: "Central Delhi",
    day: "today",
    timeSlot: "evening",
    maxBudget: 600,
    seekerName: "Guest Seeker"
  });

  const [activePresetId, setActivePresetId] = useState<string>("req-1");
  const [profileLimit, setProfileLimit] = useState<number>(6); // 5 to 10 profiles
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [telemetryCount, setTelemetryCount] = useState<number>(16);

  // Compute matches
  const matchResults: MatchResult[] = useMemo(() => {
    return calculateMatches(activeRequest, COMPANION_PARTNERS, profileLimit);
  }, [activeRequest, profileLimit]);

  // Handle preset selection
  const handleSelectPreset = (preset: typeof PRESET_SEEKER_REQUESTS[0]) => {
    audio.playClick();
    setIsComputing(true);
    setActivePresetId(preset.id);
    setActiveRequest({
      interestTags: [...preset.interestTags],
      city: preset.city,
      day: preset.day,
      timeSlot: preset.timeSlot,
      maxBudget: preset.maxBudget,
      seekerName: preset.seekerName
    });

    setTimeout(() => {
      setIsComputing(false);
      audio.playUnlock();
    }, 280);
  };

  // Toggle interest tag
  const handleToggleInterest = (tag: string) => {
    audio.playClick();
    setActivePresetId(""); // cleared custom
    setActiveRequest(prev => {
      const exists = prev.interestTags.includes(tag);
      let updated: string[];
      if (exists) {
        updated = prev.interestTags.filter(t => t !== tag);
        if (updated.length === 0) updated = [tag]; // keep at least 1
      } else {
        updated = [...prev.interestTags, tag];
      }
      return { ...prev, interestTags: updated };
    });
  };

  return (
    <section id="matchmaker" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* ============================================================ */}
      {/* 1. FUTURISTIC HUD TELEMETRY HEADER                           */}
      {/* ============================================================ */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white shadow-2xl border-2 border-slate-700/80 overflow-hidden">
        {/* Futuristic Background Matrix Grid Accent */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-mono font-black tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DELHI_NCR_GRID // AUTO_MATCH_ENGINE_v3.8</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Automated Hangout Seeker Matcher
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
              When a new hangout seeker request arrives, our engine automatically checks <span className="text-emerald-400 font-bold">16+ verified partner schedules</span>, interests, hourly budgets, and Delhi NCR locations to instantly surface the top <span className="text-cyan-300 font-bold">5 to 10 best-matching companion profiles</span>.
            </p>
          </div>

          {/* Futuristic Telemetry Status Box */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-400/30 backdrop-blur-md flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left font-mono">
              <div className="text-[11px] text-slate-400 uppercase tracking-widest">Active Partner Nodes</div>
              <div className="text-xl font-black text-white">16 Verified · 100% Online</div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Zero bots · Biometric KYC checked</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. ONE-CLICK LIVE INCOMING SEEKER REQUESTS DOCK             */}
        {/* ============================================================ */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Simulate Incoming Seeker Requests (1-Tap Test)
            </span>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Tap any request to watch profiles auto-match
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESET_SEEKER_REQUESTS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-blue-600/30 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-extrabold text-white line-clamp-1">
                      {preset.title}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700 shrink-0">
                      ₹{preset.maxBudget}/hr
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 mt-1.5 leading-snug">
                    {preset.highlight}
                  </p>

                  <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                      📍 {preset.city}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 uppercase">
                      ⏰ {preset.timeSlot}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. SEEKER REQUEST CONFIGURATION TERMINAL                     */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" />
              Customize Seeker Request Parameters
            </h3>
            <p className="text-xs text-slate-800 font-medium mt-0.5">
              Change any parameter below to immediately recalculate the top 5 to 10 matching hangout partners.
            </p>
          </div>

          {/* Profile count limit selector (5 - 10) */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-300 shrink-0">
            <span className="text-xs font-black text-slate-900 pl-2">Show Profiles:</span>
            {[5, 6, 8, 10].map((num) => (
              <button
                key={num}
                onClick={() => {
                  audio.playClick();
                  setProfileLimit(num);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  profileLimit === num
                    ? "bg-slate-950 text-white shadow-xs"
                    : "text-slate-800 hover:text-slate-950 hover:bg-slate-200"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Zone / Location */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              1. Location Zone
            </label>
            <select
              value={activeRequest.city}
              onChange={(e) => {
                audio.playClick();
                setActivePresetId("");
                setActiveRequest(prev => ({ ...prev, city: e.target.value }));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-slate-950 font-bold text-xs focus:outline-hidden focus:border-blue-600 cursor-pointer"
            >
              {DELHI_NCR_ZONES.map(z => (
                <option key={z.id} value={z.id} className="text-slate-900 font-medium">
                  {z.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-700 font-medium">
              Filters partners in this safe public cluster.
            </p>
          </div>

          {/* Time Slot */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              2. Availability Time Slot
            </label>
            <select
              value={activeRequest.timeSlot}
              onChange={(e) => {
                audio.playClick();
                setActivePresetId("");
                setActiveRequest(prev => ({ ...prev, timeSlot: e.target.value as any }));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-slate-950 font-bold text-xs focus:outline-hidden focus:border-blue-600 cursor-pointer"
            >
              {TIME_SLOTS.map(t => (
                <option key={t.id} value={t.id} className="text-slate-900 font-medium">
                  {t.icon} {t.label} ({t.timeRange})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-700 font-medium">
              Matches companion's active schedule.
            </p>
          </div>

          {/* Day */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              3. Day of Hangout
            </label>
            <select
              value={activeRequest.day}
              onChange={(e) => {
                audio.playClick();
                setActivePresetId("");
                setActiveRequest(prev => ({ ...prev, day: e.target.value as any }));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-slate-950 font-bold text-xs focus:outline-hidden focus:border-blue-600 cursor-pointer"
            >
              {DAYS.map(d => (
                <option key={d.id} value={d.id} className="text-slate-900 font-medium">
                  {d.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-700 font-medium">
              Verifies host availability for this day.
            </p>
          </div>

          {/* Max Hourly Budget */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-blue-600" />
                4. Max Hourly Budget
              </label>
              <span className="text-xs font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                ₹{activeRequest.maxBudget}/hr
              </span>
            </div>
            <input
              type="range"
              min={350}
              max={950}
              step={50}
              value={activeRequest.maxBudget}
              onChange={(e) => {
                setActivePresetId("");
                setActiveRequest(prev => ({ ...prev, maxBudget: Number(e.target.value) }));
              }}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-700">
              <span>₹350/hr</span>
              <span>₹650/hr</span>
              <span>₹950/hr</span>
            </div>
          </div>

        </div>

        {/* Interest / Hobby / Goal Tags Filter */}
        <div className="pt-4 border-t border-slate-200 space-y-2.5">
          <label className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Interests, Hobbies &amp; Goals (Select multiple):
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_INTERESTS.map((interest) => {
              const isSelected = activeRequest.interestTags.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => handleToggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-slate-950 text-white border-slate-950 shadow-xs"
                      : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <span>{interest}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 4. DYNAMIC TOP MATCHES RESULTS GRID (5 TO 10 PROFILES)      */}
      {/* ============================================================ */}
      <div className="space-y-6 text-left">
        
        {/* Results Header with Telemetry Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-extrabold text-blue-800 bg-blue-100 px-3 py-1 rounded-md">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>AUTOMATIC COMPATIBILITY RANKING</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Top {matchResults.length} Matched Profiles for Your Request
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 font-medium">
              Ranked dynamically by time slot compatibility, shared hobbies, location proximity, and hourly rate.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300">
              ⚡ Calculated in 14ms
            </span>
            <button
              onClick={() => handleSelectPreset(PRESET_SEEKER_REQUESTS[0])}
              className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 transition-all cursor-pointer"
              title="Reset to default request"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profiles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchResults.map((match, idx) => {
            const comp = match.companion;
            const isTopMatch = idx === 0;

            return (
              <SpatialCard3D key={comp.id} maxTilt={6} scale={1.02} className="h-full">
                <div className={`h-full bg-white rounded-3xl border-2 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-5 ${
                  isTopMatch ? "border-blue-600 ring-2 ring-blue-500/20" : "border-slate-300 hover:border-slate-500"
                }`}>
                  
                  <div className="space-y-4">
                    
                    {/* Top Row: Rank & Match Score Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-mono font-black text-xs flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        {isTopMatch && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-extrabold text-[10px] uppercase tracking-wider">
                            ★ Best Match
                          </span>
                        )}
                      </div>

                      {/* Glowing Match Score Pill */}
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-950 border-2 border-emerald-400 font-mono font-black text-xs shadow-xs">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{match.score}% MATCH</span>
                      </div>
                    </div>

                    {/* Companion Identity Header */}
                    <div className="flex items-start gap-3 pt-1">
                      <div 
                        style={{ transform: "translateZ(24px)" }}
                        className={`w-14 h-14 rounded-2xl ${comp.color} text-white flex items-center justify-center text-2xl shadow-md shrink-0`}
                      >
                        {comp.emoji}
                      </div>
                      <div style={{ transform: "translateZ(16px)" }} className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-extrabold text-lg text-slate-950 truncate">{comp.name}</h4>
                          <span className="text-xs text-slate-700 font-bold">({comp.age})</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-[10px] shrink-0">
                            Verified ✓
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-800 font-semibold mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{comp.hub}</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-600">
                          [{comp.coordinates.areaCode}]
                        </div>
                      </div>
                    </div>

                    {/* Vibe Tagline */}
                    <div 
                      style={{ transform: "translateZ(12px)" }}
                      className="text-xs font-bold text-blue-950 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200"
                    >
                      {comp.vibe}
                    </div>

                    {/* Partner Bio (Crisp Dark Text) */}
                    <p className="text-xs text-slate-800 leading-relaxed font-normal">
                      {comp.bio}
                    </p>

                    {/* Match Reasons Badges (Why this partner was automatically chosen) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-mono font-extrabold text-slate-900 uppercase">
                        Matching Criteria Breakdown:
                      </div>
                      <div className="space-y-1">
                        {match.matchReasons.map((reason, rIdx) => (
                          <div 
                            key={rIdx}
                            className="text-[11px] font-medium text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 flex items-center gap-1.5"
                          >
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Availability Slot Window */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-900 flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-600" />
                        Free Slot:
                      </span>
                      <span className="font-mono font-bold text-slate-950">{comp.availability.preferredWindow}</span>
                    </div>

                  </div>

                  {/* Card Footer: Hourly Rate & Direct Booking CTA */}
                  <div 
                    style={{ transform: "translateZ(20px)" }}
                    className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-lg font-black text-slate-950">
                        ₹{comp.hourlyRate} <span className="text-xs font-normal text-slate-700">/ hr</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-800 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{comp.rating} ({comp.hangoutsCompleted} meets)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        audio.playClick();
                        onSelectCompanionToBook(comp, comp.availability.preferredWindow);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center gap-1.5"
                    >
                      <span>Book Match</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </SpatialCard3D>
            );
          })}
        </div>

      </div>

    </section>
  );
}
