import React, { useState, useEffect, useRef } from "react";
import { 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  MapPin, 
  Star, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Clock, 
  Phone, 
  X, 
  CheckCircle2, 
  Calendar,
  Send,
  MessageCircle,
  AlertCircle
} from "lucide-react";
import { audio, setupGlobalAudioListeners } from "./utils/audio";
import { submitToGoogleSheets, generateWhatsAppLeadUrl } from "./lib/googleSheets";

// Verified Companion Model for Gurgaon & Delhi
export interface CompanionProfile {
  id: string;
  name: string;
  emoji: string;
  act: string;
  categoryLabel: string;
  rate: number;
  rating: number;
  times: ("morning" | "evening" | "weekend")[];
  city: "Gurugram" | "Delhi";
  location: string;
  vibeText: string;
  bgColor: string;
  badge?: string;
}

const COMPANIONS: CompanionProfile[] = [
  {
    id: "p-1",
    name: "Aarav Mehta",
    emoji: "🏸",
    act: "badminton",
    categoryLabel: "Badminton",
    rate: 350,
    rating: 4.9,
    times: ["evening", "weekend"],
    city: "Gurugram",
    location: "Sector 29, Gurugram",
    vibeText: "Smash rallies, doubles matches, all skill levels welcome.",
    bgColor: "#7cc4ff",
    badge: "Fast Responder"
  },
  {
    id: "p-2",
    name: "Meera Reddy",
    emoji: "☕",
    act: "cafe",
    categoryLabel: "Café chat",
    rate: 400,
    rating: 4.8,
    times: ["evening", "weekend"],
    city: "Gurugram",
    location: "DLF CyberHub, Gurugram",
    vibeText: "Pour-over coffees, indie books, and honest real talks.",
    bgColor: "#ffc933",
    badge: "Top Rated"
  },
  {
    id: "p-3",
    name: "Kabir Sen",
    emoji: "🥾",
    act: "trek",
    categoryLabel: "Trekking",
    rate: 600,
    rating: 4.9,
    times: ["morning", "weekend"],
    city: "Gurugram",
    location: "Aravalli Biodiversity, Gurugram",
    vibeText: "Sunrise wilderness trails, hidden scenic spots & birdwatching.",
    bgColor: "#ff6b4a",
    badge: "Trail Expert"
  },
  {
    id: "p-4",
    name: "Sana Farooqui",
    emoji: "🗣️",
    act: "language",
    categoryLabel: "Language",
    rate: 450,
    rating: 4.7,
    times: ["morning", "evening"],
    city: "Gurugram",
    location: "DLF Phase 2, Gurugram",
    vibeText: "French conversation drills & English public speaking confidence.",
    bgColor: "#a8f0c6"
  },
  {
    id: "p-5",
    name: "Rohan Verma",
    emoji: "🎲",
    act: "games",
    categoryLabel: "Board games",
    rate: 300,
    rating: 4.6,
    times: ["evening", "weekend"],
    city: "Gurugram",
    location: "Golf Course Rd, Gurugram",
    vibeText: "Catan tournaments, blitz chess, and strategy board games.",
    bgColor: "#7cc4ff"
  },
  {
    id: "p-6",
    name: "Ishita Roy",
    emoji: "🎸",
    act: "music",
    categoryLabel: "Jam session",
    rate: 550,
    rating: 4.8,
    times: ["evening"],
    city: "Gurugram",
    location: "Sector 56 & 32nd Ave, Gurugram",
    vibeText: "Acoustic guitar jamming, songwriting & indie open mics.",
    bgColor: "#ffc933",
    badge: "Musician"
  },
  {
    id: "p-7",
    name: "Dev Malhotra",
    emoji: "🏃",
    act: "run",
    categoryLabel: "Running",
    rate: 250,
    rating: 4.5,
    times: ["morning"],
    city: "Gurugram",
    location: "Sector 52 & Tau Devi Lal, Gurugram",
    vibeText: "5K & 10K pacing, morning endurance loops, sprint drills.",
    bgColor: "#a8f0c6"
  },
  {
    id: "p-8",
    name: "Tara Khanna",
    emoji: "☕",
    act: "cafe",
    categoryLabel: "Café chat",
    rate: 500,
    rating: 4.9,
    times: ["morning", "weekend"],
    city: "Delhi",
    location: "Connaught Place (CP), Delhi",
    vibeText: "Weekend brunch companion & central Delhi heritage lover.",
    bgColor: "#ff6b4a",
    badge: "Top Rated"
  },
  {
    id: "p-9",
    name: "Neil Bakshi",
    emoji: "🏸",
    act: "badminton",
    categoryLabel: "Badminton",
    rate: 500,
    rating: 4.7,
    times: ["morning", "evening"],
    city: "Delhi",
    location: "Siri Fort Complex, Delhi",
    vibeText: "Coach-level tactical doubles player & fitness enthusiast.",
    bgColor: "#7cc4ff"
  },
  {
    id: "p-10",
    name: "Zoya Haque",
    emoji: "🥾",
    act: "trek",
    categoryLabel: "Trekking",
    rate: 550,
    rating: 5.0,
    times: ["morning", "weekend"],
    city: "Delhi",
    location: "Sunder Nursery & Lodhi, Delhi",
    vibeText: "UNESCO park sunrise walks, photography trails & chai stops.",
    bgColor: "#a8f0c6",
    badge: "Super Host"
  },
  {
    id: "p-11",
    name: "Ananya Kapoor",
    emoji: "🗣️",
    act: "language",
    categoryLabel: "Language",
    rate: 450,
    rating: 4.8,
    times: ["evening", "weekend"],
    city: "Delhi",
    location: "Khan Market, Delhi",
    vibeText: "Literature coffee debates, Italian phrases & creative writing.",
    bgColor: "#ffc933"
  },
  {
    id: "p-12",
    name: "Vikram Singhania",
    emoji: "🎲",
    act: "games",
    categoryLabel: "Board games",
    rate: 350,
    rating: 4.9,
    times: ["evening", "weekend"],
    city: "Delhi",
    location: "Hauz Khas Village, Delhi",
    vibeText: "FIDE rated 1800 blitz chess player & strategic game host.",
    bgColor: "#ff6b4a"
  }
];

const ROTATING_WORDS = ["trek", "play badminton", "sip chai", "speak French", "jam", "run", "play chess"];

const MARQUEE_ITEMS = [
  "🏸 Badminton buddies",
  "🥾 Sunrise treks",
  "☕ Café chats",
  "🗣️ Language practice",
  "🎲 Board games",
  "🎸 Jam sessions",
  "🏃 Morning runs",
  "🎬 Movie plus-ones"
];

const CATEGORIES = [
  { id: "all", label: "✨ All" },
  { id: "badminton", label: "🏸 Badminton" },
  { id: "trek", label: "🥾 Trekking" },
  { id: "cafe", label: "☕ Café chat" },
  { id: "language", label: "🗣️ Language" },
  { id: "games", label: "🎲 Board games" },
  { id: "music", label: "🎸 Jam session" },
  { id: "run", label: "🏃 Running" }
];

// Gurgaon & Delhi Hotspots for Live Radar with Blue Lights
const LIVE_RADAR_SPOTS = [
  { name: "DLF CyberHub", city: "Gurugram", active: 24, coords: { x: 38, y: 48 }, icon: "💡" },
  { name: "Sector 29 Entertainment Hub", city: "Gurugram", active: 18, coords: { x: 28, y: 62 }, icon: "🏸" },
  { name: "Golf Course Road (Horizon)", city: "Gurugram", active: 16, coords: { x: 44, y: 72 }, icon: "☕" },
  { name: "Connaught Place (CP)", city: "Delhi", active: 31, coords: { x: 62, y: 26 }, icon: "♟️" },
  { name: "Khan Market", city: "Delhi", active: 19, coords: { x: 70, y: 40 }, icon: "☕" },
  { name: "Sunder Nursery & Lodhi", city: "Delhi", active: 22, coords: { x: 74, y: 55 }, icon: "🥾" },
  { name: "Siri Fort Sports Complex", city: "Delhi", active: 15, coords: { x: 65, y: 70 }, icon: "🏸" }
];

export default function App() {
  // Sound system state
  const [isMuted, setIsMuted] = useState(false);

  // Rotating hero verb
  const [wordIndex, setWordIndex] = useState(0);

  // Hero sticker parallax offset
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Filters for "What's your vibe?" directory
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState<"all" | "Gurugram" | "Delhi">("all");
  const [budgetLimit, setBudgetLimit] = useState(600);
  const [timeFilter, setTimeFilter] = useState<"any" | "morning" | "evening" | "weekend">("any");
  const [minRating, setMinRating] = useState(0);

  // Earnings Calculator State
  const [calcHours, setCalcHours] = useState(8);
  const [calcRate, setCalcRate] = useState(400);

  // Waitlist form state
  const [waitlistRole, setWaitlistRole] = useState<"seeker" | "partner">("seeker");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistContact, setWaitlistContact] = useState("");
  const [waitlistCity, setWaitlistCity] = useState("Gurugram");
  const [waitlistLocation, setWaitlistLocation] = useState("CyberHub / DLF");
  const [waitlistTime, setWaitlistTime] = useState("Weekday Evenings (6:00 PM – 9:30 PM)");
  const [waitlistStatus, setWaitlistStatus] = useState<string | null>(null);

  // Booking Modal State
  const [bookingCompanion, setBookingCompanion] = useState<CompanionProfile | null>(null);
  const [bookingDate, setBookingDate] = useState("Tomorrow");
  const [bookingTime, setBookingTime] = useState("Evening (6:00 PM)");
  const [bookingLocation, setBookingLocation] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Global Audio listener initialization
  useEffect(() => {
    const cleanup = setupGlobalAudioListeners();
    setIsMuted(audio.getIsMuted());
    return cleanup;
  }, []);

  // Verb rotator interval (1.8s)
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // Parallax on mouse move inside Hero
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    setParallax({ x, y });
  };

  // Falling celebratory emojis shower ("boom()")
  const triggerBoom = (message?: string) => {
    audio.playSuccess();
    const emojis = ["🎉", "🙌", "⭐", "🎈", "🥳", "☕", "🏸"];
    emojis.forEach((emoji) => {
      for (let k = 0; k < 3; k++) {
        const span = document.createElement("span");
        span.className = "fall";
        span.textContent = emoji;
        span.style.left = `${Math.random() * 92}vw`;
        span.style.animationDelay = `${Math.random() * 0.6}s`;
        document.body.appendChild(span);
        setTimeout(() => span.remove(), 2800);
      }
    });
    if (message) {
      setWaitlistStatus(message);
    }
  };

  // Sound toggle button handler
  const handleToggleSound = () => {
    const newMuted = audio.toggleMute();
    setIsMuted(newMuted);
  };

  // Waitlist submission handler
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistName.trim() || !waitlistContact.trim()) return;

    audio.playClick();
    triggerBoom(`You're on the list, ${waitlistName}! We'll reach out on WhatsApp soon. 🎉`);

    try {
      const waitlistRecord = {
        role: waitlistRole,
        name: waitlistName,
        contact: waitlistContact,
        city: waitlistCity,
        location: waitlistLocation,
        preferredTime: waitlistTime,
        submittedAt: new Date().toISOString()
      };
      
      const existing = JSON.parse(localStorage.getItem("hh_waitlist") || "[]");
      existing.push(waitlistRecord);
      localStorage.setItem("hh_waitlist", JSON.stringify(existing));

      // Also send to Google Sheets bridge
      await submitToGoogleSheets({
        name: waitlistName,
        email: waitlistContact.includes("@") ? waitlistContact : `${waitlistName.toLowerCase().replace(/\s+/g, '')}@lead.happyhangouts.life`,
        phone: !waitlistContact.includes("@") ? waitlistContact : "",
        city: waitlistCity,
        location_area: waitlistLocation,
        free_time: waitlistTime,
        interests: "General Activities",
        join_as: waitlistRole,
        form_type: waitlistRole === "partner" ? "Become a Hangout Partner" : "Become a Hangout Seeker",
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      // safe fallback
    }

    setWaitlistName("");
    setWaitlistContact("");
  };

  // Open booking modal
  const handleOpenBooking = (companion: CompanionProfile) => {
    audio.playClick();
    setBookingCompanion(companion);
    setBookingLocation(companion.location);
    setBookingSuccess(false);
  };

  // Confirm booking
  const handleConfirmBooking = () => {
    if (!bookingCompanion) return;
    audio.playSuccess();
    setBookingSuccess(true);
    triggerBoom(`Booking request sent for ${bookingCompanion.name}! 🎉`);

    // WhatsApp URL to fast-track directly with platform team
    const message = `Hi Happy Hangouts! I'd like to book a hangout with ${bookingCompanion.name} (${bookingCompanion.emoji} ${bookingCompanion.categoryLabel}) at ${bookingLocation} for ${bookingDate} (${bookingTime}). Rate: ₹${bookingCompanion.rate}/hr.`;
    const waUrl = `https://wa.me/918800843189?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }, 1200);
  };

  // Filter companions
  const filteredCompanions = COMPANIONS.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.act === selectedCategory;
    const matchesCity = selectedCity === "all" || p.city === selectedCity;
    const matchesBudget = p.rate <= budgetLimit;
    const matchesRating = p.rating >= minRating;
    const matchesTime = timeFilter === "any" || p.times.includes(timeFilter);
    return matchesCategory && matchesCity && matchesBudget && matchesRating && matchesTime;
  });

  // Calculate earnings (after 20% platform fee)
  const monthlyTakeHome = Math.round(calcHours * 4.3 * calcRate * 0.8);

  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-blue-600/20 selection:text-blue-900 pb-16 md:pb-0">
      
      {/* 1. TOP NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#f3f8ff] border-b-[2.5px] border-[#0b1f5c] transition-colors">
        <div className="wrap flex items-center justify-between h-16">
          
          {/* Logo with official image emblem & bold brand name */}
          <a 
            href="#top" 
            onClick={() => audio.playClick()}
            className="flex items-center gap-3 no-underline group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border-[2.5px] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] shrink-0 bg-blue-700">
              <img 
                src="/assets/aistudio/Happy_Hangouts_Logo_1d102f6e.jpg" 
                alt="Happy Hangouts Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-extrabold text-[20px] sm:text-[22px] tracking-tight text-[#0b1f5c] leading-none">
                Happy Hangouts
              </span>
              <span className="text-[11px] font-bold text-[#4a5a8a] mt-0.5 tracking-tight flex items-center gap-1">
                <span>Akele kyu?</span>
                <span className="text-[#1f4ee0] font-black">Happy Hangouts Hai na!!</span>
              </span>
            </div>
          </a>

          {/* Nav links and actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <a 
              href="#match" 
              onClick={() => audio.playClick()}
              className="hidden md:inline-block font-bold text-[#0b1f5c] hover:text-[#1f4ee0] transition-colors"
            >
              Find a partner
            </a>
            <a 
              href="#radar" 
              onClick={() => audio.playClick()}
              className="hidden md:inline-block font-bold text-[#0b1f5c] hover:text-[#1f4ee0] transition-colors"
            >
              Live Radar
            </a>
            <a 
              href="#earn" 
              onClick={() => audio.playClick()}
              className="hidden md:inline-block font-bold text-[#0b1f5c] hover:text-[#1f4ee0] transition-colors"
            >
              Earn
            </a>
            <a 
              href="#safe" 
              onClick={() => audio.playClick()}
              className="hidden lg:inline-block font-bold text-[#0b1f5c] hover:text-[#1f4ee0] transition-colors"
            >
              Safety
            </a>

            {/* Audio Toggle Button with tactile feedback */}
            <button
              type="button"
              onClick={handleToggleSound}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              className={`p-2 rounded-full border-[2px] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] transition-transform active:translate-y-0.5 ${
                isMuted ? "bg-white text-slate-500" : "bg-[#ffc933] text-[#0b1f5c]"
              }`}
              title={isMuted ? "Click to enable sound" : "Sound enabled"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Join Waitlist CTA */}
            <a 
              href="#join" 
              onClick={() => audio.playClick()}
              className="btn text-sm py-2 px-4 shadow-[3px_3px_0_#0b1f5c]"
            >
              Join waitlist
            </a>
          </div>

        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header 
        id="top" 
        onMouseMove={handleHeroMouseMove}
        className="relative py-14 sm:py-20 lg:py-24 overflow-hidden border-b-[2.5px] border-[#0b1f5c] bg-[#f3f8ff]"
      >
        <div className="wrap relative">
          
          {/* Floating Sticker Badges with Responsive Tilts & Parallax */}
          <span 
            className="stk y"
            style={{ 
              right: "6%", 
              top: "4%", 
              transform: `rotate(6deg) translate(${parallax.x * 24}px, ${parallax.y * 24}px)` 
            }}
          >
            ⭐ 4.9 · 218 reviews
          </span>

          <span 
            className="stk s"
            style={{ 
              right: "22%", 
              top: "36%", 
              transform: `rotate(-7deg) translate(${parallax.x * -20}px, ${parallax.y * -20}px)` 
            }}
          >
            🏸 Today, 6 PM
          </span>

          <span 
            className="stk p"
            style={{ 
              right: "5%", 
              top: "60%", 
              transform: `rotate(4deg) translate(${parallax.x * 30}px, ${parallax.y * 30}px)` 
            }}
          >
            ☕ ₹400/hr
          </span>

          <span 
            className="stk"
            style={{ 
              right: "26%", 
              top: "84%", 
              transform: `rotate(-3deg) translate(${parallax.x * -26}px, ${parallax.y * -26}px)` 
            }}
          >
            📍 Gurugram & Delhi
          </span>

          {/* Tagline Badge */}
          <div>
            <span className="tag">
              Akele kyu? Happy Hangouts Hai na!!
            </span>
          </div>

          {/* Dynamic Animated Heading with rotating verb */}
          <h1 className="mt-5 text-[42px] sm:text-[68px] md:text-[84px] lg:text-[104px] font-extrabold tracking-[-0.03em] text-[#0b1f5c] max-w-4xl">
            Find someone <br className="hidden sm:inline" />
            to{" "}
            <em className="not-italic text-white bg-[#1f4ee0] px-2 py-0.5 rounded-[0.2em] inline-block -rotate-2 border-[3px] border-[#0b1f5c] shadow-[4px_4px_0_#0b1f5c] transition-all duration-300">
              {ROTATING_WORDS[wordIndex]}
            </em>{" "}
            <br className="hidden sm:inline" />
            with. Tonight.
          </h1>

          {/* Subtitle */}
          <p className="text-[18px] sm:text-[22px] max-w-[640px] mt-6 mb-8 text-[#4a5a8a] font-normal leading-relaxed">
            Hire real, verified people for an hour or an afternoon in Gurugram & Delhi. Pick by interest, hobby or goal, then filter by time, budget and reviews. No more cancelled plans, no more doing it alone.
          </p>

          {/* Action CTAs */}
          <div className="flex items-center gap-4 flex-wrap">
            <a 
              href="#match" 
              onClick={() => audio.playClick()}
              className="btn b text-[18px] py-3.5 px-7"
            >
              Find my hangout →
            </a>
            <a 
              href="#earn" 
              onClick={() => audio.playClick()}
              className="btn text-[18px] py-3.5 px-7"
            >
              Earn as a partner
            </a>
          </div>

        </div>
      </header>

      {/* 3. CONTINUOUS RUNNING MARQUEE BANNER */}
      <div className="mq" aria-hidden="true">
        <div className="mq-track">
          {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, idx) => (
            <span key={idx} className="mq-item">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 4. "WHAT'S YOUR VIBE?" INTERACTIVE DIRECTORY */}
      <section id="match" className="py-16 sm:py-20 bg-[#f3f8ff]">
        <div className="wrap">
          
          <div className="flex flex-col items-start">
            <span className="tag">Try it live</span>
            <h2 className="text-[34px] sm:text-[52px] font-extrabold tracking-tight mt-3 mb-2 text-[#0b1f5c]">
              What’s your vibe?
            </h2>
            <p className="text-[#4a5a8a] text-[17px] sm:text-[19px] max-w-2xl mb-8">
              Tap an interest, choose your city, and set your budget. Filter verified partners ready for hangouts in Gurugram and Delhi.
            </p>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2.5 flex-wrap mb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  audio.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`chip ${selectedCategory === cat.id ? "active" : ""}`}
                aria-pressed={selectedCategory === cat.id}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* City Selection Chips (Strictly Gurugram & Delhi) */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-bold text-[#4a5a8a] uppercase tracking-wider mr-1">
              Location:
            </span>
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setSelectedCity("all");
              }}
              className={`chip text-sm py-1.5 px-3.5 ${selectedCity === "all" ? "active" : ""}`}
            >
              📍 Both Cities
            </button>
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setSelectedCity("Gurugram");
              }}
              className={`chip text-sm py-1.5 px-3.5 ${selectedCity === "Gurugram" ? "active" : ""}`}
            >
              📍 Gurugram
            </button>
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setSelectedCity("Delhi");
              }}
              className={`chip text-sm py-1.5 px-3.5 ${selectedCity === "Delhi" ? "active" : ""}`}
            >
              📍 Delhi
            </button>
          </div>

          {/* Filter Controls Panel */}
          <div className="ctl">
            {/* Budget Range */}
            <label className="flex items-center gap-3">
              <span>Budget up to</span>
              <input 
                type="range" 
                min={200} 
                max={1000} 
                step={50} 
                value={budgetLimit}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setBudgetLimit(val);
                  audio.playSlider((val - 200) / 800);
                }}
              />
              <output>₹{budgetLimit}</output>
            </label>

            {/* When / Time Filter */}
            <label className="flex items-center gap-3">
              <span>When</span>
              <select 
                value={timeFilter}
                onChange={(e) => {
                  audio.playClick();
                  setTimeFilter(e.target.value as any);
                }}
              >
                <option value="any">Anytime</option>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="weekend">Weekend</option>
              </select>
            </label>

            {/* Rating Filter */}
            <label className="flex items-center gap-3">
              <span>Min rating</span>
              <select 
                value={minRating}
                onChange={(e) => {
                  audio.playClick();
                  setMinRating(Number(e.target.value));
                }}
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>⭐ 4.5+</option>
                <option value={4.8}>⭐ 4.8+</option>
              </select>
            </label>
          </div>

          {/* Companion Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCompanions.length > 0 ? (
              filteredCompanions.map((comp) => (
                <div key={comp.id} className="pc">
                  {/* Avatar & Badges */}
                  <div className="flex items-start justify-between">
                    <div 
                      className="av"
                      style={{ backgroundColor: comp.bgColor }}
                    >
                      {comp.emoji}
                    </div>
                    {comp.badge && (
                      <span className="text-xs font-bold bg-[#ffc933] text-[#0b1f5c] px-2.5 py-1 rounded-full border-[1.5px] border-[#0b1f5c]">
                        {comp.badge}
                      </span>
                    )}
                  </div>

                  {/* Name & Location */}
                  <div>
                    <h3 className="text-[#0b1f5c]">{comp.name}</h3>
                    <small className="block mt-0.5">
                      📍 {comp.location} · {comp.times.join(", ")}
                    </small>
                  </div>

                  {/* Vibe Description */}
                  <p className="text-sm text-[#0b1f5c] font-medium leading-snug line-clamp-2">
                    {comp.vibeText}
                  </p>

                  {/* Price & Rating */}
                  <div className="row pt-2 border-t border-slate-200">
                    <b className="text-[#0b1f5c]">
                      ₹{comp.rate}
                      <small className="text-xs text-[#4a5a8a] font-bold">/hr</small>
                    </b>
                    <span className="font-bold text-sm text-[#0b1f5c] flex items-center gap-1">
                      ⭐ {comp.rating}
                    </span>
                  </div>

                  {/* Book / Hangout CTA */}
                  <button 
                    type="button"
                    onClick={() => handleOpenBooking(comp)}
                    className="btn w-full py-2.5 text-sm font-extrabold mt-1"
                  >
                    Hangout! 🙌
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center p-10 border-[2.5px] border-dashed border-[#0b1f5c] rounded-[22px] bg-white">
                <p className="font-bold text-lg text-[#0b1f5c]">
                  No match found for this budget or filter in Gurugram/Delhi.
                </p>
                <p className="text-[#4a5a8a] text-sm mt-1">
                  Try adjusting the budget slider up to ₹1,000 or selecting "Anytime" — new verified partners join every week!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setSelectedCategory("all");
                    setSelectedCity("all");
                    setBudgetLimit(1000);
                    setTimeFilter("any");
                    setMinRating(0);
                  }}
                  className="btn b text-sm mt-4 py-2 px-5"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 5. "HANGOUT IN 3 TAPS" (HOW IT WORKS) */}
      <section className="py-16 sm:py-20 bg-white border-y-[2.5px] border-[#0b1f5c]">
        <div className="wrap">
          <span className="tag">3 steps</span>
          <h2 className="text-[34px] sm:text-[52px] font-extrabold tracking-tight mt-3 mb-8 text-[#0b1f5c]">
            Hangout in 3 taps
          </h2>

          <div className="steps grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="st">
              <div className="n">1</div>
              <h3 className="text-[#0b1f5c]">Pick your plan</h3>
              <p className="text-[#4a5a8a] font-medium">
                Hobby, badminton match, trek or just chill company for chai. Add your preferred time slot and budget.
              </p>
            </div>
            
            <div className="st">
              <div className="n">2</div>
              <h3 className="text-[#0b1f5c]">Choose a partner</h3>
              <p className="text-[#4a5a8a] font-medium">
                Compare verified reviews and hourly rates in Gurugram & Delhi. Coordinate safely in the app before you meet.
              </p>
            </div>

            <div className="st">
              <div className="n">3</div>
              <h3 className="text-[#0b1f5c]">Go hang out</h3>
              <p className="text-[#4a5a8a] font-medium">
                Meet strictly in a verified public place, pay securely by the hour, and rate each other right after the session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LIVE HANGOUTS RADAR (BLUE LIGHTS MAP) */}
      <section id="radar" className="py-16 sm:py-20 bg-[#f3f8ff] border-b-[2.5px] border-[#0b1f5c]">
        <div className="wrap">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="tag">Real-Time Trust</span>
              <h2 className="text-[32px] sm:text-[48px] font-extrabold tracking-tight mt-2 text-[#0b1f5c]">
                Live Hangouts Radar
              </h2>
              <p className="text-[#4a5a8a] font-medium text-base sm:text-lg">
                Blue light radar showing active sessions right now across Gurugram and Delhi.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-[2px] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] shrink-0 self-start sm:self-auto">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1f4ee0]"></span>
              </span>
              <span className="text-xs font-extrabold text-[#0b1f5c]">
                138 Active Hangouts Now
              </span>
            </div>
          </div>

          {/* Interactive Radar Box with Blue Light Nodes */}
          <div className="bg-white border-[2.5px] border-[#0b1f5c] rounded-[24px] p-6 sm:p-8 shadow-[6px_6px_0_#0b1f5c] relative overflow-hidden">
            
            {/* Grid graphic lines */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {LIVE_RADAR_SPOTS.slice(0, 4).map((spot, idx) => (
                <div 
                  key={idx}
                  className="bg-[#f3f8ff] border-[2px] border-[#0b1f5c] rounded-xl p-3 flex items-center justify-between shadow-[2px_2px_0_#0b1f5c]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{spot.icon}</span>
                    <div className="leading-tight">
                      <p className="text-xs font-bold text-[#0b1f5c] truncate max-w-[110px]">
                        {spot.name}
                      </p>
                      <p className="text-[10px] text-[#4a5a8a] font-semibold">
                        {spot.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1f4ee0] shadow-[0_0_8px_#1f4ee0] animate-pulse"></div>
                    <span className="text-xs font-black text-[#1f4ee0]">{spot.active}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Radar schematic visual showing Delhi & Gurgaon hubs */}
            <div className="relative w-full h-56 sm:h-72 bg-[#0b1f5c] rounded-2xl overflow-hidden border-[2px] border-[#0b1f5c] flex items-center justify-center p-4">
              
              {/* Concentric radar rings */}
              <div className="absolute w-44 h-44 sm:w-64 sm:h-64 rounded-full border border-blue-400/20"></div>
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-blue-400/15"></div>
              <div className="absolute w-full h-[1px] bg-blue-400/20"></div>
              <div className="absolute h-full w-[1px] bg-blue-400/20"></div>

              {/* Glowing Blue Radar sweep line */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "conic-gradient(from 0deg at 50% 50%, rgba(31, 78, 224, 0.4) 0deg, transparent 60deg, transparent 360deg)",
                  animation: "spin 6s linear infinite"
                }}
              ></div>

              {/* Pulsing Blue Light Hotspots */}
              {LIVE_RADAR_SPOTS.map((spot, i) => (
                <div
                  key={i}
                  className="absolute group cursor-pointer transition-transform hover:scale-125 z-20"
                  style={{
                    left: `${spot.coords.x}%`,
                    top: `${spot.coords.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                  onClick={() => {
                    audio.playClick();
                    triggerBoom(`Active hangout node: ${spot.name} (${spot.active} companions online)`);
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute h-6 w-6 rounded-full bg-cyan-400 opacity-80"></span>
                    <span className="relative flex h-3.5 w-3.5 rounded-full bg-cyan-300 border-2 border-white shadow-[0_0_12px_#38bdf8]"></span>
                  </div>
                  
                  {/* Tooltip on badge */}
                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-[#0b1f5c] text-[11px] font-extrabold px-2.5 py-1 rounded-lg border-[1.5px] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] z-30">
                    {spot.name}: {spot.active} active
                  </div>
                </div>
              ))}

              <div className="absolute bottom-3 left-4 text-xs font-bold text-blue-200 z-10 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]"></span>
                <span>Live GPS Escrow Radar: Strictly Gurugram & Delhi NCR</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. "FUN IS ONLY FUN WHEN IT'S SAFE" (SAFETY SECTION) */}
      <section id="safe" className="safe py-16 sm:py-20">
        <div className="wrap">
          <span className="tag" style={{ background: "#ffc933", color: "#0b1f5c" }}>
            Safety first
          </span>
          <h2 className="text-[34px] sm:text-[52px] font-extrabold tracking-tight mt-3 mb-2 text-white">
            Fun is only fun when it’s safe
          </h2>
          <p className="sub text-lg max-w-2xl mb-8">
            Everything here is about friendly activity partners meeting in public places. Our 4-pillar safety framework:
          </p>

          <div className="sg">
            <div>
              <b>ID</b>
              <p className="font-semibold text-sm sm:text-base leading-snug">
                Every partner verified with Government ID (Aadhaar/PAN) and biometric selfie before attending or hosting.
              </p>
            </div>
            <div>
              <b>📍</b>
              <p className="font-semibold text-sm sm:text-base leading-snug">
                Public meeting places only — verified cafes (CyberHub, CP, Khan Market) and sports arenas (Siri Fort).
              </p>
            </div>
            <div>
              <b>SOS</b>
              <p className="font-semibold text-sm sm:text-base leading-snug">
                Real-time session timer, live location sharing with emergency contacts, and instant one-tap help alert.
              </p>
            </div>
            <div>
              <b>★</b>
              <p className="font-semibold text-sm sm:text-base leading-snug">
                Mandatory two-way post-hangout reviews. Zero tolerance policy: bad actors and inappropriate behavior permanently banned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. "GET PAID FOR YOUR HOBBIES" (PARTNER EARNINGS CALCULATOR) */}
      <section id="earn" className="py-16 sm:py-20 bg-[#f3f8ff] border-b-[2.5px] border-[#0b1f5c]">
        <div className="wrap earn-container">
          
          <div>
            <span className="tag">For partners</span>
            <h2 className="text-[34px] sm:text-[52px] font-extrabold tracking-tight mt-3 mb-2 text-[#0b1f5c]">
              Get paid for your hobbies
            </h2>
            <p className="text-[#4a5a8a] text-lg mb-6">
              Love badminton, morning treks, acoustic music or learning languages? Be a Hangout Partner on your own schedule. Drag the sliders to calculate your monthly earnings.
            </p>

            <div className="flex flex-col gap-5 bg-white p-6 rounded-2xl border-[2.5px] border-[#0b1f5c] shadow-[4px_4px_0_#0b1f5c]">
              {/* Hours slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#0b1f5c]">Hours per week:</span>
                  <b className="font-display text-xl text-[#1f4ee0] font-extrabold">{calcHours} hrs</b>
                </div>
                <input 
                  type="range" 
                  min={2} 
                  max={30} 
                  value={calcHours}
                  className="w-full"
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCalcHours(val);
                    audio.playSlider((val - 2) / 28);
                  }}
                />
              </div>

              {/* Rate slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#0b1f5c]">Your rate per hour:</span>
                  <b className="font-display text-xl text-[#1f4ee0] font-extrabold">₹{calcRate}</b>
                </div>
                <input 
                  type="range" 
                  min={200} 
                  max={1000} 
                  step={50}
                  value={calcRate}
                  className="w-full"
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCalcRate(val);
                    audio.playSlider((val - 200) / 800);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Big Earnings Result Card */}
          <div className="big-card">
            <small className="text-base sm:text-lg font-bold tracking-tight text-[#0b1f5c]">
              You could take home about
            </small>
            <b className="text-[#0b1f5c]">
              ₹{monthlyTakeHome.toLocaleString("en-IN")}
            </b>
            <small className="text-xs sm:text-sm font-semibold text-[#0b1f5c] block mt-2">
              per month, after a 20% platform fee (illustrative based on {calcHours} hrs/wk at ₹{calcRate}/hr)
            </small>
            <a 
              href="#join"
              onClick={() => {
                audio.playClick();
                setWaitlistRole("partner");
              }}
              className="btn b mt-6 text-base py-3 px-6 shadow-[4px_4px_0_#0b1f5c]"
            >
              Apply to earn as partner →
            </a>
          </div>

        </div>
      </section>

      {/* 9. "BE FIRST IN LINE" (WAITLIST & APPLICATION FORM) */}
      <section id="join" className="join py-16 sm:py-20">
        <div className="wrap">
          <span className="tag" style={{ background: "#ffffff", color: "#0b1f5c" }}>
            Gurugram & Delhi first
          </span>
          <h2 className="text-[34px] sm:text-[52px] font-extrabold tracking-tight mt-3 mb-2 text-[#0b1f5c]">
            Be first in line
          </h2>
          <p className="text-[#173a8a] text-lg font-medium mb-8">
            Join the waitlist to receive priority access, founding host badges, and launch perks.
          </p>

          <form onSubmit={handleWaitlistSubmit} className="form-box">
            
            {/* Role switch chips */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setWaitlistRole("seeker");
                }}
                className={`chip text-center justify-center font-bold ${
                  waitlistRole === "seeker" ? "active" : ""
                }`}
                aria-pressed={waitlistRole === "seeker"}
              >
                🙋 I want to hire
              </button>
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setWaitlistRole("partner");
                }}
                className={`chip text-center justify-center font-bold ${
                  waitlistRole === "partner" ? "active" : ""
                }`}
                aria-pressed={waitlistRole === "partner"}
              >
                💪 I want to earn
              </button>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-[#0b1f5c] mb-1">
                Your Full Name
              </label>
              <input 
                type="text" 
                value={waitlistName}
                onChange={(e) => setWaitlistName(e.target.value)}
                placeholder="e.g. Rahul Sharma" 
                required 
                className="w-full"
              />
            </div>

            {/* Contact Input */}
            <div>
              <label className="block text-xs font-bold text-[#0b1f5c] mb-1">
                WhatsApp Phone Number or Email
              </label>
              <input 
                type="text" 
                value={waitlistContact}
                onChange={(e) => setWaitlistContact(e.target.value)}
                placeholder="+91 98765 43210 or yourname@gmail.com" 
                required 
                className="w-full"
              />
            </div>

            {/* City & Specific Location Area (Strictly Gurgaon & Delhi as requested) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0b1f5c] mb-1">
                  City Focus
                </label>
                <select 
                  value={waitlistCity}
                  onChange={(e) => {
                    audio.playClick();
                    setWaitlistCity(e.target.value);
                  }}
                  className="w-full"
                >
                  <option value="Gurugram">Gurugram (CyberHub / Golf Course)</option>
                  <option value="Delhi">Delhi (Central / South Delhi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1f5c] mb-1">
                  Your Exact Location Area
                </label>
                <input 
                  type="text"
                  value={waitlistLocation}
                  onChange={(e) => setWaitlistLocation(e.target.value)}
                  placeholder="e.g. Sector 29, CP, or Hauz Khas"
                  className="w-full"
                />
              </div>
            </div>

            {/* What time are you free actually? (As explicitly requested) */}
            <div>
              <label className="block text-xs font-bold text-[#0b1f5c] mb-1">
                What time are you actually free?
              </label>
              <select 
                value={waitlistTime}
                onChange={(e) => {
                  audio.playClick();
                  setWaitlistTime(e.target.value);
                }}
                className="w-full"
              >
                <option value="Weekday Evenings (6:00 PM – 9:30 PM)">Weekday Evenings (6:00 PM – 9:30 PM)</option>
                <option value="Weekend Mornings (8:30 AM – 1:00 PM)">Weekend Mornings (8:30 AM – 1:00 PM)</option>
                <option value="Weekend Afternoons (1:30 PM – 5:30 PM)">Weekend Afternoons (1:30 PM – 5:30 PM)</option>
                <option value="Weekend Nights (6:00 PM – 10:30 PM)">Weekend Nights (6:00 PM – 10:30 PM)</option>
                <option value="Flexible / Anytime on coordination">Flexible / Anytime on coordination</option>
              </select>
            </div>

            {/* Submit Button */}
            <button className="btn b py-3.5 text-base w-full mt-2" type="submit">
              Count me in 🎉
            </button>

            {/* Success message display */}
            {waitlistStatus && (
              <div className="bg-emerald-50 border-[2px] border-emerald-600 text-emerald-900 rounded-xl p-3 font-semibold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{waitlistStatus}</span>
              </div>
            )}
          </form>

          {/* City launch indicator badges */}
          <div className="flex gap-2.5 flex-wrap mt-8">
            <span className="bg-[#ff6b4a] text-white border-[2.5px] border-[#0b1f5c] rounded-full px-3.5 py-1.5 font-bold text-sm shadow-[2px_2px_0_#0b1f5c]">
              📍 Gurugram: Launching First
            </span>
            <span className="bg-white text-[#0b1f5c] border-[2.5px] border-[#0b1f5c] rounded-full px-3.5 py-1.5 font-bold text-sm shadow-[2px_2px_0_#0b1f5c]">
              📍 Delhi: Launching in Parallel
            </span>
          </div>

          {/* WhatsApp Direct Connect */}
          <p className="mt-7 text-base text-[#0b1f5c] font-medium flex items-center gap-2">
            <span>Or fast-track via WhatsApp:</span>
            <a 
              href="https://wa.me/918800843189?text=Hi%20Happy%20Hangouts!%20I'd%20like%20early%20access%20in%20Gurgaon%2FDelhi." 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => audio.playClick()}
              className="font-extrabold text-[#1f4ee0] underline decoration-2 hover:text-[#0b1f5c] flex items-center gap-1"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp +91 8800843189
            </a>
          </p>

        </div>
      </section>

      {/* 10. BOOKING INQUIRY MODAL */}
      {bookingCompanion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-[3px] border-[#0b1f5c] rounded-[26px] p-6 sm:p-8 max-w-lg w-full shadow-[10px_10px_0_#0b1f5c] relative animate-in fade-in zoom-in-95 duration-150">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setBookingCompanion(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full border-[2px] border-[#0b1f5c] hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-[#0b1f5c]" />
            </button>

            {/* Companion Header in Modal */}
            <div className="flex items-center gap-4 mb-5">
              <div 
                className="w-14 h-14 rounded-full border-[2.5px] border-[#0b1f5c] flex items-center justify-center text-3xl shrink-0"
                style={{ backgroundColor: bookingCompanion.bgColor }}
              >
                {bookingCompanion.emoji}
              </div>
              <div>
                <span className="text-xs font-bold text-[#1f4ee0] uppercase tracking-wider">
                  Verified Hangout Partner
                </span>
                <h3 className="text-2xl font-extrabold text-[#0b1f5c]">
                  {bookingCompanion.name}
                </h3>
                <p className="text-xs font-bold text-[#4a5a8a]">
                  📍 {bookingCompanion.location} · ⭐ {bookingCompanion.rating}
                </p>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 border-[2.5px] border-[#0b1f5c] text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  🎉
                </div>
                <h4 className="text-xl font-extrabold text-[#0b1f5c] mb-2">
                  Booking Request Received!
                </h4>
                <p className="text-sm text-[#4a5a8a] mb-5">
                  Opening WhatsApp to connect with {bookingCompanion.name}'s coordinator at +91 8800843189.
                </p>
                <button
                  type="button"
                  onClick={() => setBookingCompanion(null)}
                  className="btn b w-full py-3"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0b1f5c] mb-1">
                    Activity & Plan
                  </label>
                  <div className="bg-[#f3f8ff] border-[2px] border-[#0b1f5c] rounded-xl p-3 font-semibold text-sm text-[#0b1f5c]">
                    {bookingCompanion.vibeText}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0b1f5c] mb-1">
                      Day
                    </label>
                    <select 
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full text-sm"
                    >
                      <option>Today</option>
                      <option>Tomorrow</option>
                      <option>This Saturday</option>
                      <option>This Sunday</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0b1f5c] mb-1">
                      Time Slot
                    </label>
                    <select 
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full text-sm"
                    >
                      <option>Morning (8:30 AM)</option>
                      <option>Afternoon (2:00 PM)</option>
                      <option>Evening (6:00 PM)</option>
                      <option>Night (8:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0b1f5c] mb-1">
                    Public Meeting Spot
                  </label>
                  <input 
                    type="text" 
                    value={bookingLocation}
                    onChange={(e) => setBookingLocation(e.target.value)}
                    placeholder="e.g. Blue Tokai CyberHub or Khan Market"
                    className="w-full text-sm"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 border-[2px] border-[#0b1f5c] rounded-xl text-xs font-bold text-[#0b1f5c]">
                  <span>Hourly Rate:</span>
                  <span className="text-base text-[#1f4ee0] font-black">₹{bookingCompanion.rate}/hr</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    className="btn b w-full py-3.5 text-base shadow-[4px_4px_0_#0b1f5c]"
                  >
                    Confirm & Chat on WhatsApp 🙌
                  </button>
                  <p className="text-[11px] text-center text-[#4a5a8a] mt-2 font-medium">
                    Strictly public places. Escrow guarantee. Free cancellation up to 2 hours prior.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 11. FOOTER */}
      <footer className="py-10 text-center text-[#4a5a8a] border-t-[2.5px] border-[#0b1f5c] bg-white">
        <div className="wrap">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="font-display font-extrabold text-xl text-[#0b1f5c]">
              Happy Hangouts
            </span>
            <span className="text-xs bg-[#ffc933] text-[#0b1f5c] font-black px-2 py-0.5 rounded-full border border-[#0b1f5c]">
              NCR Edition
            </span>
          </div>
          <p className="text-sm font-semibold mb-2">
            Happy Hangouts · <a href="https://www.happyhangouts.life" target="_blank" rel="noopener noreferrer" className="underline font-bold text-[#0b1f5c]">www.happyhangouts.life</a> · Akele kyu? Happy Hangouts Hai na!! 🙌
          </p>
          <p className="text-xs text-[#4a5a8a]">
            Verified Activity Companions & Escrow Protection in Gurugram & Delhi.
          </p>
        </div>
      </footer>

      {/* 12. MOBILE BOTTOM FLOATING ACTION BAR (Streamlined & Non-Congested) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t-[2.5px] border-[#0b1f5c] py-2.5 px-4 z-40 md:hidden flex items-center justify-between gap-3 shadow-[0_-4px_12px_rgba(11,31,92,0.1)]">
        <a 
          href="#earn" 
          onClick={() => {
            audio.playClick();
            setWaitlistRole("partner");
          }}
          className="flex-1 text-center py-2.5 px-3 rounded-full border-[2px] border-[#0b1f5c] bg-[#ffc933] text-[#0b1f5c] font-display font-extrabold text-xs shadow-[2px_2px_0_#0b1f5c]"
        >
          💪 Become a Host
        </a>
        <a 
          href="#match" 
          onClick={() => audio.playClick()}
          className="flex-1 text-center py-2.5 px-3 rounded-full border-[2px] border-[#0b1f5c] bg-[#1f4ee0] text-white font-display font-extrabold text-xs shadow-[2px_2px_0_#0b1f5c]"
        >
          ⚡ Book a Hangout
        </a>
      </div>

    </div>
  );
}
