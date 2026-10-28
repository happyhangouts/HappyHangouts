import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Coffee, 
  Dumbbell, 
  Lightbulb, 
  Camera, 
  Music, 
  X, 
  Star, 
  Check, 
  Phone, 
  Lock, 
  ChevronRight,
  HelpCircle,
  AlertCircle,
  Volume2,
  VolumeX
} from "lucide-react";
import confetti from "canvas-confetti";
import HappyHangoutsLogo from "./components/HappyHangoutsLogo";
import LeadCollectionForm from "./components/LeadCollectionForm";
import FaqSection from "./components/FaqSection";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import LiveHangoutsTrustMap from "./components/LiveHangoutsTrustMap";
import SpatialCard3D from "./components/SpatialCard3D";
import { audio, setupGlobalAudioListeners } from "./utils/audio";

// Direct static image asset imports guaranteed to load on mobile and desktop
import heroDelhiImg from "./assets/images/hero_delhi_hangout_1792650857994.jpg";
import hubSportsImg from "./assets/images/hub_sports_rally_1792650858523.jpg";
import hubCafeImg from "./assets/images/hub_cafe_coffee_1792650858578.jpg";

// Companion Profile Interface
export interface Companion {
  id: string;
  name: string;
  age: number;
  city: string;
  hub: string;
  vibe: string;
  category: "coffee" | "sports" | "tech" | "photo" | "chess" | "music";
  bio: string;
  hourlyRate: number;
  rating: number;
  hangoutsCompleted: number;
  skills: string[];
  emoji: string;
  color: string;
}

const COMPANIONS: Companion[] = [
  {
    id: "comp-1",
    name: "Aarav Mehta",
    age: 26,
    city: "Gurgaon",
    hub: "DLF CyberHub & 32nd Avenue",
    vibe: "Startup Pitching & Tech Co-working",
    category: "tech",
    bio: "Ex-fintech builder. Love whiteboarding product ideas, discussing AI agents, or doing focused co-working sessions over pour-overs.",
    hourlyRate: 500,
    rating: 4.98,
    hangoutsCompleted: 34,
    skills: ["Startup Brainstorming", "AI & Tech", "Espresso Tasting", "Pitch Decks"],
    emoji: "💡",
    color: "bg-blue-600"
  },
  {
    id: "comp-2",
    name: "Meera Reddy",
    age: 24,
    city: "South Delhi",
    hub: "Siri Fort Sports Complex",
    vibe: "Badminton Tactical Rally & Fitness",
    category: "sports",
    bio: "State-level badminton player. Looking for rally partners, morning outdoor runs, or post-match smoothies in leafy Delhi parks.",
    hourlyRate: 600,
    rating: 5.0,
    hangoutsCompleted: 48,
    skills: ["Badminton Rallies", "Footwork Drills", "Morning Fitness", "Park Trails"],
    emoji: "🏸",
    color: "bg-emerald-600"
  },
  {
    id: "comp-3",
    name: "Kabir Sen",
    age: 27,
    city: "Central Delhi",
    hub: "Khan Market (Blue Tokai)",
    vibe: "Specialty Coffee & Vintage Vinyls",
    category: "coffee",
    bio: "Vinyl collector and literature buff. Passionate about indie cinema, Murakami novels, and discovering quiet cafe reading nooks.",
    hourlyRate: 400,
    rating: 4.92,
    hangoutsCompleted: 29,
    skills: ["Specialty Coffee", "Book Discussions", "Vinyl Hunting", "Art Cafe Crawls"],
    emoji: "☕",
    color: "bg-amber-600"
  },
  {
    id: "comp-4",
    name: "Ananya Kapoor",
    age: 23,
    city: "South Delhi",
    hub: "Lodhi Art District & Sunder Nursery",
    vibe: "Street Photowalks & Heritage Trails",
    category: "photo",
    bio: "Documentary photographer & heritage enthusiast. Let's explore Delhi's vibrant street murals, capture candid film portraits, and sip chai.",
    hourlyRate: 500,
    rating: 4.96,
    hangoutsCompleted: 41,
    skills: ["Camera Framing", "Street Murals", "Historical Walks", "Candid Portraits"],
    emoji: "📷",
    color: "bg-rose-600"
  },
  {
    id: "comp-5",
    name: "Rohan Verma",
    age: 28,
    city: "Central Delhi",
    hub: "Connaught Place (CP Oxford Cafe)",
    vibe: "Chess Strategy & Deep Chats",
    category: "chess",
    bio: "FIDE rated 1850. Happy to play blitz, rapid, or teach chess openings, alongside engaging conversations on psychology and history.",
    hourlyRate: 450,
    rating: 4.95,
    hangoutsCompleted: 22,
    skills: ["Blitz Chess", "Opening Strategy", "Board Games", "Philosophy"],
    emoji: "♟️",
    color: "bg-indigo-600"
  },
  {
    id: "comp-6",
    name: "Priya Sharma",
    age: 25,
    city: "Gurgaon",
    hub: "32nd Avenue & CyberHub",
    vibe: "Acoustic Guitar Jam & Indie Vocals",
    category: "music",
    bio: "Singer-songwriter playing acoustic melodies. Let's do a duet jam, explore live indie gigs, or grab iced matcha and talk music production.",
    hourlyRate: 500,
    rating: 5.0,
    hangoutsCompleted: 38,
    skills: ["Acoustic Guitar", "Vocal Harmonies", "Indie Music Gigs", "Songwriting"],
    emoji: "🎸",
    color: "bg-purple-600"
  }
];

const CERTIFIED_HUBS = [
  {
    name: "Siri Fort Sports Complex",
    city: "South Delhi",
    type: "Badminton, Tennis & Jogging",
    highlight: "Olympic-grade indoor wooden courts, public cafe & green trails.",
    metro: "Green Park / Hauz Khas Metro",
    img: hubSportsImg
  },
  {
    name: "Khan Market",
    city: "Central Delhi",
    type: "Blue Tokai, Colocal & Book Cafes",
    highlight: "Safe, shaded, upscale public market with reserved seating.",
    metro: "Khan Market Metro (Violet Line)",
    img: hubCafeImg
  },
  {
    name: "DLF CyberHub & 32nd Avenue",
    city: "Gurgaon",
    type: "Tech Co-working & Open-Air Dining",
    highlight: "High-security corporate boulevard with vibrant pedestrian promenade.",
    metro: "Cyber City Rapid Metro",
    img: heroDelhiImg
  }
];

export default function App() {
  // Navigation & Role states
  const [activeRole, setActiveRole] = useState<"seeker" | "host">("seeker");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [heroViewMode, setHeroViewMode] = useState<"map" | "photo">("map");

  // Booking Modal states
  const [bookingCompanion, setBookingCompanion] = useState<Companion | null>(null);
  const [bookingHours, setBookingHours] = useState<number>(2);
  const [bookingDate, setBookingDate] = useState<string>("This Saturday");
  const [bookingTime, setBookingTime] = useState<string>("11:00 AM - 1:00 PM");
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  // Host Calculator State
  const [calculatorRate, setCalculatorRate] = useState<number>(500);
  const [calculatorHours, setCalculatorHours] = useState<number>(6);

  // Lead Collection Modal
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [leadModalType, setLeadModalType] = useState<"partner" | "waitlist">("waitlist");
  const [leadModalInterests, setLeadModalInterests] = useState<string>("");

  // Privacy Policy Modal
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  // Audio Experience State
  const [isMuted, setIsMuted] = useState<boolean>(() => audio.getIsMuted());

  // Attach global keyboard typing and click audio feedback
  useEffect(() => {
    const cleanup = setupGlobalAudioListeners();
    return () => cleanup();
  }, []);

  const filteredCompanions = selectedCategory === "all"
    ? COMPANIONS
    : COMPANIONS.filter(c => c.category === selectedCategory);

  const handleConfirmBooking = () => {
    audio.playUnlock();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setBookingCompanion(null);
      setLeadModalType("waitlist");
      setLeadModalInterests(`Booked session with ${bookingCompanion?.name} (${bookingHours} hrs at ₹${bookingCompanion ? bookingCompanion.hourlyRate * bookingHours : 0}) at ${bookingCompanion?.hub}`);
      setIsLeadModalOpen(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-24 lg:pb-0">
      
      {/* ============================================================ */}
      {/* 1. CLEAN TOP NAVIGATION BAR (High Contrast Dark Text)        */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo Zone */}
          <a href="#" className="flex items-center gap-3 shrink-0">
            <HappyHangoutsLogo variant="header" theme="light" />
          </a>

          {/* Clean Navigation Links with Dark Legible Text */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-slate-800">
            <a href="#live-map" className="hover:text-blue-600 transition-colors flex items-center gap-1.5 text-blue-700 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block shadow-[0_0_6px_#2563eb]" />
              Live Radar
            </a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#companions" className="hover:text-blue-600 transition-colors">
              Find Companions
            </a>
            <a href="#hubs" className="hover:text-blue-600 transition-colors">
              Verified Hubs
            </a>
            <a href="#safety" className="hover:text-blue-600 transition-colors">
              Safety &amp; Escrow
            </a>
            <a href="#calculator" className="hover:text-blue-600 transition-colors">
              Host &amp; Earn
            </a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs & Sound Experience Control */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Interactive Sound Toggle (Minimalist, accessible) */}
            <button
              onClick={() => {
                const newMuted = audio.toggleMute();
                setIsMuted(newMuted);
              }}
              title={isMuted ? "Sound muted (click to enable typing & click sounds)" : "Interactive sound active (click to mute)"}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0 ${
                !isMuted 
                  ? "border-blue-300 bg-blue-50 text-blue-900 shadow-2xs hover:bg-blue-100" 
                  : "border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
              aria-label="Toggle interactive sound effects"
            >
              {!isMuted ? (
                <>
                  <Volume2 className="w-4 h-4 text-blue-600 animate-pulse shrink-0" />
                  <span className="font-mono text-[11px] font-semibold text-blue-800">
                    Sound
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="font-mono text-[11px] font-semibold text-slate-600">
                    Muted
                  </span>
                </>
              )}
            </button>

            {/* CTAs on tablet & desktop only: on mobile, sticky bottom dock provides primary actions with zero top header congestion */}
            <button
              onClick={() => {
                audio.playClick();
                setLeadModalType("partner");
                setLeadModalInterests("Applying as Founding Host Partner");
                setIsLeadModalOpen(true);
              }}
              className="hidden sm:inline-flex px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 border-slate-900 bg-slate-950 hover:bg-slate-850 text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95 items-center gap-1 shrink-0"
            >
              <span>🤝</span>
              <span>Become Host</span>
            </button>
            <a
              href="#companions"
              onClick={() => audio.playClick()}
              className="hidden sm:inline-flex px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer items-center gap-1 shrink-0"
            >
              <span>⚡</span>
              <span>Book Hangout</span>
            </a>
          </div>

        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MINIMALIST HERO SECTION (High-Contrast, Clear Copy)       */}
      {/* ============================================================ */}
      <section className="pt-6 sm:pt-16 pb-12 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Immediate Actions */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            
            {/* Clean Location Tag (Solid Dark Text on Light Pill) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-300 text-slate-900 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Delhi NCR · Verified In-Person Hangouts</span>
            </div>

            {/* Main Headline in Deep Ink Black */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
              Find real friends for <br />
              <span className="text-blue-600">real activities</span> in Delhi NCR.
            </h1>

            {/* Subtitle in High-Contrast Dark Slate */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-700 font-normal leading-relaxed max-w-xl">
              Skip awkward small talk and lonely weekends. Hire verified local companions by the hour for badminton rallies, pour-over coffee, startup brainstorming, and heritage walks. Safe public cafes only.
            </p>

            {/* Primary Brand Action Buttons (Specially Highlighted on Mobile & Desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              
              {/* Brand Action 1: Book a Hangout */}
              <a
                href="#companions"
                onClick={() => audio.playClick()}
                className="group relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white shadow-xl shadow-blue-500/25 border-2 border-blue-400/40 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-200">
                    Seeker · From ₹400/hr
                  </span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-3">
                  <div className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>⚡ Book a Hangout</span>
                  </div>
                  <p className="text-xs text-blue-100 font-medium mt-1 leading-snug">
                    Hire verified badminton, coffee, chess &amp; startup companions in Delhi NCR
                  </p>
                </div>
              </a>

              {/* Brand Action 2: Become a Host */}
              <button
                onClick={() => {
                  audio.playClick();
                  setLeadModalType("partner");
                  setLeadModalInterests("Applying as Founding Host Partner (Delhi NCR)");
                  setIsLeadModalOpen(true);
                }}
                className="group relative p-4 sm:p-5 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 shadow-xl border-2 border-slate-800 hover:border-slate-700 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300">
                    Host Partner · 0% Fee
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
                </div>
                <div className="mt-3">
                  <div className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>🤝 Become a Host</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-1 leading-snug">
                    Get paid ₹400–₹1,500/hr for your hobbies &amp; friendly company
                  </p>
                </div>
              </button>

            </div>

            {/* High-Contrast Trust Signals Strip */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% ID Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Public Spots Only</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Escrow Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Delhi &amp; Gurgaon Focused</span>
              </div>
            </div>

          </div>

          {/* Right Column: Creative Live Hangouts Map with Glowing Blue Lights */}
          <div id="live-map" className="lg:col-span-6 space-y-3 scroll-mt-24">
            {/* View Mode Switcher Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shadow-[0_0_8px_#2563eb]" />
                <span className="text-xs font-black text-slate-950 uppercase tracking-wider">
                  {heroViewMode === "map" ? "Live Hangouts Radar (Blue Lights)" : "Verified Meetup Photo"}
                </span>
              </div>

              <div className="flex items-center gap-1 p-1 bg-white border-2 border-slate-300 rounded-xl shadow-xs">
                <button
                  onClick={() => {
                    audio.playClick();
                    setHeroViewMode("map");
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    heroViewMode === "map"
                      ? "bg-slate-950 text-white shadow-xs"
                      : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                  }`}
                >
                  🗺️ Live Map
                </button>
                <button
                  onClick={() => {
                    audio.playClick();
                    setHeroViewMode("photo");
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    heroViewMode === "photo"
                      ? "bg-slate-950 text-white shadow-xs"
                      : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                  }`}
                >
                  📸 Real Meetup
                </button>
              </div>
            </div>

            {/* Creative Live Map with Glowing Blue Lights */}
            {heroViewMode === "map" ? (
              <LiveHangoutsTrustMap
                onSelectSpot={(spot) => {
                  setSelectedCategory(spot.category);
                  const el = document.getElementById("companions");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            ) : (
              <div className="relative rounded-3xl overflow-hidden border-2 border-slate-300 shadow-xl bg-slate-100">
                <img
                  src={heroDelhiImg}
                  alt="Two people having a real-world coffee hangout in Delhi NCR"
                  className="w-full h-[320px] xs:h-[350px] sm:h-[390px] lg:h-[430px] object-cover"
                  loading="eager"
                />
                <div className="p-4 bg-white border-t border-slate-200 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-950">Weekend Coffee &amp; Tech Chat</h4>
                      <p className="text-xs text-slate-700 mt-0.5 font-medium">Khan Market &amp; CyberHub Partner Cafes</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 font-extrabold text-xs border border-emerald-300">
                      Safe &amp; Verified
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-700 font-bold px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_6px_#2563eb] shrink-0" />
                Live active hangouts across Delhi NCR
              </span>
              <span className="text-blue-700 font-extrabold hidden sm:inline">Akele Kyu....? Happy Hangouts Hai na</span>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. HOW IT WORKS (Simple, High-Contrast 4-Step Breakdown)     */}
      {/* ============================================================ */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-md">
              SIMPLE &amp; TRANSPARENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              How Happy Hangouts Works
            </h2>
            <p className="text-slate-700 text-sm sm:text-base">
              Whether you want to book a companion for an activity or earn money by hosting, our process is safe, simple, and transparent.
            </p>

            {/* High-Contrast Mode Switcher */}
            <div className="pt-4 flex justify-center">
              <div className="p-1 bg-white border-2 border-slate-300 rounded-2xl flex items-center shadow-xs">
                <button
                  onClick={() => { audio.playClick(); setActiveRole("seeker"); }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    activeRole === "seeker"
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-950"
                  }`}
                >
                  I Want to Book a Companion
                </button>
                <button
                  onClick={() => { audio.playClick(); setActiveRole("host"); }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    activeRole === "host"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-950"
                  }`}
                >
                  I Want to Host &amp; Earn
                </button>
              </div>
            </div>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {activeRole === "seeker" ? (
              <>
                {/* Step 1 */}
                <SpatialCard3D maxTilt={6} scale={1.02} className="h-full">
                  <div className="h-full p-6 bg-white rounded-3xl border-2 border-slate-300 shadow-xs hover:shadow-xl transition-all space-y-3">
                    <div 
                      style={{ transform: "translateZ(24px)" }}
                      className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-950 font-mono font-black text-lg flex items-center justify-center border border-blue-300 shadow-xs"
                    >
                      01
                    </div>
                    <h3 className="font-extrabold text-base text-slate-950">Choose a Companion</h3>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      Filter verified profiles by badminton, coffee, startup discussions, or music. See photos, bios, reviews, and hourly rates upfront.
                    </p>
                  </div>
                </SpatialCard3D>

                {/* Step 2 */}
                <SpatialCard3D maxTilt={6} scale={1.02} className="h-full">
                  <div className="h-full p-6 bg-white rounded-3xl border-2 border-slate-300 shadow-xs hover:shadow-xl transition-all space-y-3">
                    <div 
                      style={{ transform: "translateZ(24px)" }}
                      className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-950 font-mono font-black text-lg flex items-center justify-center border border-blue-300 shadow-xs"
                    >
                      02
                    </div>
                    <h3 className="font-extrabold text-base text-slate-950">Pick a Public Hub</h3>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      Choose a convenient certified public venue like Khan Market, Siri Fort Sports Complex, or CyberHub Gurgaon. No private spaces allowed.
                    </p>
                  </div>
                </SpatialCard3D>

                {/* Step 3 */}
                <SpatialCard3D maxTilt={6} scale={1.02} className="h-full">
                  <div className="h-full p-6 bg-white rounded-3xl border-2 border-slate-300 shadow-xs hover:shadow-xl transition-all space-y-3">
                    <div 
                      style={{ transform: "translateZ(24px)" }}
                      className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-950 font-mono font-black text-lg flex items-center justify-center border border-blue-300 shadow-xs"
                    >
                      03
                    </div>
                    <h3 className="font-extrabold text-base text-slate-950">Secure Escrow Booking</h3>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      Your booking fee is held safely in 100% protected escrow. The money is not transferred to the host until you actually meet and finish.
                    </p>
                  </div>
                </SpatialCard3D>

                {/* Step 4 */}
                <SpatialCard3D maxTilt={6} scale={1.02} className="h-full">
                  <div className="h-full p-6 bg-white rounded-3xl border-2 border-slate-300 shadow-xs hover:shadow-xl transition-all space-y-3">
                    <div 
                      style={{ transform: "translateZ(24px)" }}
                      className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-950 font-mono font-black text-lg flex items-center justify-center border border-blue-300 shadow-xs"
                    >
                      04
                    </div>
                    <h3 className="font-extrabold text-base text-slate-950">Meet &amp; Have Fun</h3>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      Meet at the cafe or sports arena, check in with a simple code, enjoy your activity, and leave a review.
                    </p>
                  </div>
                </SpatialCard3D>
              </>
            ) : (
              <>
                {/* Host Step 1 */}
                <SpatialCard3D maxTilt={6} scale={1.02} className="h-full">
                  <div className="h-full p-6 bg-white rounded-3xl border-2 border-slate-300 shadow-xs hover:shadow-xl transition-all space-y-3">
                    <div 
                      style={{ transform: "translateZ(24px)" }}
                      className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-950 font-mono font-black text-lg flex items-center justify-center border border-emerald-300 shadow-xs"
                    >
                      01
                    </div>
                    <h3 className="font-extrabold text-base text-slate-950">Fast ID Verification</h3>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      Complete a quick 1-minute government ID verification to keep our entire community safe, trustworthy, and scam-free.
                    </p>
                  </div>
                </SpatialCard3D>

                {/* Host Step 2 */}
                <SpatialCard3D maxTilt={6} scale={1.02} className="h-full">
                  <div className="h-full p-6 bg-white rounded-3xl border-2 border-slate-300 shadow-xs hover:shadow-xl transition-all space-y-3">
                    <div 
                      style={{ transform: "translateZ(24px)" }}
                      className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-950 font-mono font-black text-lg flex items-center justify-center border border-emerald-300 shadow-xs"
                    >
                      02
                    </div>
                    <h3 className="font-extrabold text-base text-slate-950">Set Your Hourly Rate</h3>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      Set your custom rate from ₹400 to ₹1,500 per hour based on your activity, skills, or hobbies.
                    </p>
                  </div>
                </SpatialCard3D>

                {/* Host Step 3 */}
                <SpatialCard3D maxTilt={6} scale={1.02} className="h-full">
                  <div className="h-full p-6 bg-white rounded-3xl border-2 border-slate-300 shadow-xs hover:shadow-xl transition-all space-y-3">
                    <div 
                      style={{ transform: "translateZ(24px)" }}
                      className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-950 font-mono font-black text-lg flex items-center justify-center border border-emerald-300 shadow-xs"
                    >
                      03
                    </div>
                    <h3 className="font-extrabold text-base text-slate-950">Accept Requests</h3>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      Receive booking requests on WhatsApp and choose when you are free. You have 100% control over your schedule.
                    </p>
                  </div>
                </SpatialCard3D>

                {/* Host Step 4 */}
                <SpatialCard3D maxTilt={6} scale={1.02} className="h-full">
                  <div className="h-full p-6 bg-white rounded-3xl border-2 border-slate-300 shadow-xs hover:shadow-xl transition-all space-y-3">
                    <div 
                      style={{ transform: "translateZ(24px)" }}
                      className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-950 font-mono font-black text-lg flex items-center justify-center border border-emerald-300 shadow-xs"
                    >
                      04
                    </div>
                    <h3 className="font-extrabold text-base text-slate-950">Direct UPI Payout</h3>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      Right after your session wraps up, your money is sent directly to your UPI bank account with 0% platform commission for the first 50 hosts.
                    </p>
                  </div>
                </SpatialCard3D>
              </>
            )}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. COMPANION DIRECTORY (Clean, Filterable, Easy to Book)     */}
      {/* ============================================================ */}
      <section id="companions" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        
        {/* Header & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-md">
              BIOMETRICALLY VERIFIED LOCALS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Hire a Companion in Delhi NCR
            </h2>
            <p className="text-slate-700 text-sm max-w-xl">
              Every person below has passed government identity checks. Select any companion to book an in-person hangout session.
            </p>
          </div>

          {/* High-Contrast Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Vibes" },
              { id: "sports", label: "🏸 Badminton" },
              { id: "coffee", label: "☕ Coffee" },
              { id: "tech", label: "💡 Tech & Startups" },
              { id: "photo", label: "📷 Photowalks" },
              { id: "chess", label: "♟️ Chess" },
              { id: "music", label: "🎸 Music" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => { audio.playClick(); setSelectedCategory(cat.id); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedCategory === cat.id
                    ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                    : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Companions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredCompanions.map((comp) => (
            <SpatialCard3D key={comp.id} maxTilt={7} scale={1.02} className="h-full">
              <div className="h-full bg-white rounded-3xl border-2 border-slate-300 p-6 shadow-sm hover:shadow-xl hover:border-slate-500 transition-all flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  
                  {/* Card Top: Avatar, Name, Rating with 3D Popout */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div 
                        style={{ transform: "translateZ(28px)" }}
                        className={`w-14 h-14 rounded-2xl ${comp.color} text-white flex items-center justify-center text-2xl shadow-md shrink-0`}
                      >
                        {comp.emoji}
                      </div>
                      <div style={{ transform: "translateZ(18px)" }}>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-lg text-slate-950">{comp.name}</h3>
                          <span className="text-xs text-slate-700 font-bold">({comp.age})</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-800 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate max-w-[180px] font-semibold">{comp.hub}</span>
                        </div>
                      </div>
                    </div>

                    <span 
                      style={{ transform: "translateZ(20px)" }}
                      className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-extrabold text-[11px] shrink-0 shadow-xs"
                    >
                      ID Verified ✓
                    </span>
                  </div>

                  {/* Vibe Tagline */}
                  <div 
                    style={{ transform: "translateZ(14px)" }}
                    className="text-xs font-bold text-blue-950 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
                  >
                    {comp.vibe}
                  </div>

                  {/* Bio in Dark Legible Text */}
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    {comp.bio}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {comp.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-900 text-[11px] font-semibold border border-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Card Bottom: Rate and Book Button with 3D Depth */}
                <div 
                  style={{ transform: "translateZ(22px)" }}
                  className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-base sm:text-lg font-black text-slate-950">
                      ₹{comp.hourlyRate} <span className="text-xs font-normal text-slate-700">/ hour</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-800 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{comp.rating} ({comp.hangoutsCompleted} hangouts)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      audio.playClick();
                      setBookingCompanion(comp);
                      setBookingHours(2);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95"
                  >
                    Book Hangout
                  </button>
                </div>

              </div>
            </SpatialCard3D>
          ))}
        </div>

      </section>

      {/* ============================================================ */}
      {/* 5. CERTIFIED PUBLIC HUBS (Real Photos, High Contrast)        */}
      {/* ============================================================ */}
      <section id="hubs" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-md">
              SAFE PUBLIC LOCATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Where Meets Happen in Delhi NCR
            </h2>
            <p className="text-slate-700 text-sm">
              We never permit meetings at private apartments. Hangouts occur strictly at certified partner cafes, sports complexes, and heritage gardens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CERTIFIED_HUBS.map((hub, idx) => (
              <SpatialCard3D key={idx} maxTilt={6} scale={1.02} className="h-full">
                <div className="h-full bg-white rounded-3xl border-2 border-slate-300 overflow-hidden shadow-xs hover:shadow-xl transition-all space-y-4">
                  <img
                    src={hub.img}
                    alt={hub.name}
                    className="w-full h-48 object-cover border-b border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-5 pt-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700 font-mono uppercase">{hub.city}</span>
                      <span className="text-[11px] font-extrabold text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        CCTV Monitored ✓
                      </span>
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-950">{hub.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">{hub.highlight}</p>
                    <div className="pt-3 border-t border-slate-200 flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{hub.metro}</span>
                    </div>
                  </div>
                </div>
              </SpatialCard3D>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. TRUST, SAFETY & ESCROW PILLARS                            */}
      {/* ============================================================ */}
      <section id="safety" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-left">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-md">
            SAFETY FIRST
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            How We Protect You
          </h2>
          <p className="text-slate-700 text-sm sm:text-base">
            Your safety and financial peace of mind are built into every single step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-8 bg-white rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-950">100% ID Verified</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              Every companion and user undergoes government ID checks and selfie liveness verification. Zero fake accounts, zero catfishes.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-950">Vetted Public Spots Only</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              All meetings happen exclusively at established public cafes, sports facilities, or heritage gardens with security. Never in private homes.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-950">100% Escrow Protection</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              Your payment is safely held by Happy Hangouts and only transferred to the host after you meet, verify with your check-in code, and confirm completion.
            </p>
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* 7. HOST EARNINGS CALCULATOR                                  */}
      {/* ============================================================ */}
      <section id="calculator" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
              EARNINGS CALCULATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              See How Much You Can Earn as a Host
            </h2>
            <p className="text-slate-700 text-sm">
              First 50 founding partners in Delhi NCR pay 0% platform commission. Keep 100% of what you earn!
            </p>
          </div>

          <div className="p-8 sm:p-10 bg-white rounded-3xl border-2 border-slate-300 shadow-md space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Slider 1: Rate */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-900 uppercase">Your Hourly Rate</label>
                  <span className="text-lg font-black text-blue-700">₹{calculatorRate} / hr</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="1500"
                  step="50"
                  value={calculatorRate}
                  onChange={(e) => setCalculatorRate(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-xs text-slate-600">Standard range: ₹400–₹800/hr</span>
              </div>

              {/* Slider 2: Hours */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-900 uppercase">Hours Per Week</label>
                  <span className="text-lg font-black text-blue-700">{calculatorHours} hours / wk</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={calculatorHours}
                  onChange={(e) => setCalculatorHours(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-xs text-slate-600">e.g. 2 coffee chats or 3 badminton games</span>
              </div>
            </div>

            {/* Projected Earnings Output */}
            <div className="p-6 bg-slate-100 rounded-2xl border border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Projected Monthly Earnings
                </span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-700 mt-1">
                  ₹{(calculatorHours * 4 * calculatorRate).toLocaleString("en-IN")}{" "}
                  <span className="text-xs font-normal text-slate-600">/ month</span>
                </div>
                <p className="text-xs text-slate-700 mt-1 font-medium">
                  Direct UPI bank transfer · 0% commission deducted for founding hosts.
                </p>
              </div>

              <button
                onClick={() => {
                  audio.playClick();
                  setLeadModalType("partner");
                  setLeadModalInterests(`Host application: Rate ₹${calculatorRate}/hr, ${calculatorHours} hrs/wk (Est ₹${calculatorHours * 4 * calculatorRate}/mo)`);
                  setIsLeadModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
              >
                Apply as a Host Now
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. APPLICATION & BOOKING FORM SECTION                        */}
      {/* ============================================================ */}
      <section id="apply" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <LeadCollectionForm inlineLayout={true} initialType="waitlist" />
      </section>

      {/* ============================================================ */}
      {/* 9. FAQ ACCORDION SECTION                                     */}
      {/* ============================================================ */}
      <FaqSection 
        onJoinWaitlist={(topic) => {
          setLeadModalType("waitlist");
          setLeadModalInterests(topic);
          setIsLeadModalOpen(true);
        }}
      />

      {/* ============================================================ */}
      {/* 10. MINIMALIST HIGH-CONTRAST FOOTER                          */}
      {/* ============================================================ */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-100 border-t border-slate-300 text-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <HappyHangoutsLogo variant="header" />
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#companions" className="hover:text-blue-600 transition-colors">Companions</a>
            <a href="#hubs" className="hover:text-blue-600 transition-colors">Meeting Hubs</a>
            <a href="#safety" className="hover:text-blue-600 transition-colors">Safety</a>
            <button
              onClick={() => {
                audio.playClick();
                setIsPrivacyModalOpen(true);
              }}
              className="hover:text-blue-600 transition-colors cursor-pointer underline"
            >
              Privacy &amp; Security Policy
            </button>
          </div>

          <div className="text-slate-600">
            &copy; {new Date().getFullYear()} Happy Hangouts. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* BOOKING MODAL (High-Contrast, Clean & Simple)                */}
      {/* ============================================================ */}
      <AnimatePresence>
        {bookingCompanion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-300 shadow-2xl relative text-left text-slate-900"
            >
              <button
                onClick={() => setBookingCompanion(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!bookingConfirmed ? (
                <div className="space-y-6">
                  {/* Companion Info */}
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                    <div className={`w-14 h-14 rounded-2xl ${bookingCompanion.color} text-white flex items-center justify-center text-3xl shadow-sm`}>
                      {bookingCompanion.emoji}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold block">
                        BOOKING COMPANION HANGOUT
                      </span>
                      <h3 className="text-xl font-black text-slate-950">{bookingCompanion.name}</h3>
                      <div className="text-xs font-semibold text-slate-700">
                        {bookingCompanion.vibe} · <span className="text-emerald-700 font-black">₹{bookingCompanion.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                        Select Preferred Day
                      </label>
                      <select
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold text-xs outline-none focus:border-blue-600"
                      >
                        <option value="This Saturday">This Saturday</option>
                        <option value="This Sunday">This Sunday</option>
                        <option value="Tomorrow Evening">Tomorrow Evening</option>
                        <option value="Next Weekend">Next Weekend</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                        Select Time Slot
                      </label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold text-xs outline-none focus:border-blue-600"
                      >
                        <option value="11:00 AM - 1:00 PM">11:00 AM - 1:00 PM (Morning Coffee)</option>
                        <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM (Afternoon Tea / Sports)</option>
                        <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM (Evening Chat)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-800 uppercase">
                          Duration (Hours)
                        </label>
                        <span className="text-xs font-black text-blue-700">{bookingHours} Hours</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        step="1"
                        value={bookingHours}
                        onChange={(e) => setBookingHours(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                        Vetted Public Hub
                      </label>
                      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{bookingCompanion.hub}</span>
                      </div>
                    </div>
                  </div>

                  {/* Escrow Calculation */}
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1.5 text-slate-800">
                    <div className="flex justify-between">
                      <span>{bookingHours} Hours with {bookingCompanion.name}:</span>
                      <span className="font-bold">₹{bookingCompanion.hourlyRate * bookingHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Launch Escrow Fee:</span>
                      <span className="font-bold text-emerald-700">₹0 (Free)</span>
                    </div>
                    <div className="pt-2 border-t border-blue-200 flex justify-between font-black text-sm text-slate-950">
                      <span>Total Escrow Held:</span>
                      <span className="text-blue-700">₹{bookingCompanion.hourlyRate * bookingHours}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 pt-1">
                      🔒 Your payment stays in escrow until you meet in person and finish the session.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setBookingCompanion(null)}
                      className="w-1/3 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      className="w-2/3 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Confirm &amp; Hold Escrow</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto">
                    ✓
                  </div>
                  <h4 className="text-2xl font-black text-slate-950">Hangout Requested!</h4>
                  <p className="text-xs sm:text-sm text-slate-700 max-w-sm mx-auto leading-relaxed">
                    {bookingCompanion.name} has been notified. You will receive your confirmation code shortly!
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* LEAD / WAITLIST OVERLAY MODAL                                */}
      {/* ============================================================ */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-300 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              &times;
            </button>
            <LeadCollectionForm
              initialType={leadModalType}
              defaultInterests={leadModalInterests}
              defaultJoinAs={leadModalType === "partner" ? "partner" : "seeker"}
              onSuccess={() => {
                setTimeout(() => setIsLeadModalOpen(false), 2000);
              }}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PRIVACY POLICY MODAL                                         */}
      {/* ============================================================ */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* ============================================================ */}
      {/* STICKY MOBILE BOTTOM BRAND ACTION DOCK (Always Highlighted) */}
      {/* ============================================================ */}
      <aside 
        aria-label="Mobile quick actions"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-300 px-3 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.15)] flex items-center gap-2.5 text-left"
      >
        {/* Mobile Action 1: Become a Host */}
        <button
          onClick={() => {
            audio.playClick();
            setLeadModalType("partner");
            setLeadModalInterests("Applying as Founding Host Partner (Mobile Quick Action)");
            setIsLeadModalOpen(true);
          }}
          className="flex-1 py-3 px-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 border-2 border-slate-800 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <span>🤝 Become a Host</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
            ₹/hr
          </span>
        </button>

        {/* Mobile Action 2: Book a Hangout */}
        <a
          href="#companions"
          onClick={() => audio.playClick()}
          className="flex-1 py-3 px-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping shrink-0" />
          <span>⚡ Book a Hangout</span>
        </a>
      </aside>

    </div>
  );
}
