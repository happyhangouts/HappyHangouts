import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Key, 
  MapPin, 
  AlertCircle, 
  ArrowRight, 
  ChevronRight, 
  Play, 
  Pause, 
  Download, 
  Smartphone, 
  Check, 
  ChevronDown, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  Lock, 
  Activity, 
  Coffee, 
  Volume2,
  Users,
  Eye,
  Info,
  Shield,
  Cpu,
  Fingerprint,
  Radio,
  Terminal,
  Sun,
  Moon,
  Zap,
  CheckCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import HappyHangoutsLogo from "./components/HappyHangoutsLogo";
import { audio } from "./utils/audio";
import MubaInteractiveChat, { COMPANIONS } from "./components/MubaInteractiveChat";
import InteractiveAppDemo, { CharacteristicAvatar } from "./components/InteractiveAppDemo";
import LeadCollectionForm from "./components/LeadCollectionForm";
import TrustMap from "./components/TrustMap";
import { VisualStoryReel, VisualStory } from "./components/VisualStoryReel";
import PartnerAppDemo from "./components/PartnerAppDemo";
import FaqSection from "./components/FaqSection";

// Interfaces
interface Scene {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  location: string;
}

const scenes: Scene[] = [
  {
    id: "guitar",
    title: "Learn Guitar together.",
    subtitle: "Master chords and fingerstyle together.",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=1600",
    category: "Learn Guitar",
    location: "Delhi NCR"
  },
  {
    id: "startup",
    title: "Pitch your startup.",
    subtitle: "Sketch workflows and meet co-founders.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1600",
    category: "Startup Pitch",
    location: "CyberHub, Gurgaon"
  },
  {
    id: "badminton",
    title: "Find a badminton partner.",
    subtitle: "Enjoy quick tactical drops and rallies.",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1600",
    category: "Badminton",
    location: "Siri Fort, Delhi"
  },
  {
    id: "wedding",
    title: "Attend a wedding.",
    subtitle: "Coordinate style themes and share conversations.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
    category: "Wedding Partner",
    location: "The Lodhi, Delhi"
  },
  {
    id: "cafe",
    title: "Explore a hidden café.",
    subtitle: "Discover quiet alleys and savor pour-overs.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1600",
    category: "Hidden Café",
    location: "Sector 104, Noida"
  },
  {
    id: "friendship",
    title: "Build your next friendship.",
    subtitle: "Meet verified companions who share your passions.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1600",
    category: "True Connections",
    location: "NCR Region"
  }
];

const experienceCards = [
  { id: "startup", title: "Startup Discussions", emoji: "💡", desc: "Exchange venture ideas, review mock pitches, and whiteboard business models with active co-founders." },
  { id: "guitar", title: "Learn Guitar", emoji: "🎸", desc: "Skip practicing in isolation. Master chord progressions, fingerstyle rhythms, and acoustic songs together." },
  { id: "sports", title: "Sports", emoji: "🏸", desc: "Sweat out daily city stress with friendly badminton, tennis matches, or football drills." },
  { id: "photography", title: "Photography", emoji: "📷", desc: "Explore heritage pathways and parks with camera lenses, capturing candid frames and lighting." },
  { id: "food", title: "Food Explorer", emoji: "🍜", desc: "Satisfy your taste buds on culinary street walks, authentic ramens, or artisanal sourdough cafes." },
  { id: "wedding", title: "Wedding Companion", emoji: "💍", desc: "Coordinate ethnic outfit color themes and share positive energies at beautiful weddings." },
  { id: "books", title: "Book Club", emoji: "📚", desc: "Discuss literature, philosophy, and creative writing in cozy book cafes with avid readers." },
  { id: "music", title: "Music", emoji: "🎤", desc: "Practice vocal tracks, duet harmonies, or join fun acoustic jams in safe local studios." },
  { id: "cities", title: "Explore Cities", emoji: "🌍", desc: "Stroll down historic routes, tour museums, and discover scenic weekend sunrise drives." }
];

export const PROTOCOLS = [
  { id: "startup", name: "Startup Pitch", emoji: "💡", compId: "gr-t2", code: "772183", color: "from-blue-600 to-indigo-600" },
  { id: "guitar", name: "Learn Guitar", emoji: "🎸", compId: "gr-t1", code: "481592", color: "from-purple-600 to-pink-600" },
  { id: "badminton", name: "Badminton", emoji: "🏸", compId: "nd-s1", code: "290384", color: "from-emerald-600 to-teal-600" },
  { id: "cinema", name: "Creative Talk", emoji: "🍿", compId: "nd-c1", code: "104928", color: "from-pink-600 to-rose-600" },
  { id: "nature", name: "Nature Walk", emoji: "🌳", compId: "dl-n1", code: "255109", color: "from-green-600 to-emerald-600" },
  { id: "coffee", name: "Book & Coffee", emoji: "☕", compId: "dl-c1", code: "244302", color: "from-amber-600 to-orange-600" },
  { id: "chess", name: "Chess Strategy", emoji: "♟", compId: "dl-l1", code: "826391", color: "from-cyan-600 to-blue-600" }
];

export const ROULETTE_MATCHES = [
  {
    id: "r1",
    title: "Acoustic Guitar & Vocals Jam",
    host: "Rohan Malhotra",
    badge: "Chess & Music Master • ID Verified ✓",
    location: "Delhi Guitar Academy, Saket",
    city: "South Delhi",
    vibe: "Music & Acoustic",
    spotsLeft: 2,
    avatarId: "dl-l1",
    emoji: "🎸",
    time: "Today @ 5:30 PM",
    bio: "Looking for someone to jam chord progressions and acoustic covers over iced pour-over coffee."
  },
  {
    id: "r2",
    title: "Co-Founder & Pitch Review Sync",
    host: "Aditya Sen",
    badge: "Tech Founder • ID Verified ✓",
    location: "Third Wave Coffee, CyberHub",
    city: "Gurgaon",
    vibe: "Startups & Ideas",
    spotsLeft: 3,
    avatarId: "user",
    emoji: "💡",
    time: "Tomorrow @ 4:00 PM",
    bio: "Let's review product wireframes, pitch decks, and build something iconic over espresso."
  },
  {
    id: "r3",
    title: "Cozy Books & Filter Coffee",
    host: "Aditi Sharma",
    badge: "Vinyl & Lit Enthusiast • ID Verified ✓",
    location: "Blue Tokai, Khan Market",
    city: "Central Delhi",
    vibe: "Deep Talk & Books",
    spotsLeft: 1,
    avatarId: "dl-c1",
    emoji: "☕",
    time: "Saturday @ 11:00 AM",
    bio: "Love magic realism, vintage records, and quiet conversations in leafy green cafes."
  },
  {
    id: "r4",
    title: "Morning Badminton Tactical Rally",
    host: "Meera Reddy",
    badge: "Sunder Trails & Sports • ID Verified ✓",
    location: "Siri Fort Sports Complex",
    city: "South Delhi",
    vibe: "Badminton Rally",
    spotsLeft: 2,
    avatarId: "dl-n1",
    emoji: "🏸",
    time: "Sunday @ 7:00 AM",
    bio: "Fast-paced badminton drops and rallies followed by fresh fruit smoothies!"
  },
  {
    id: "r5",
    title: "Golden Hour Photowalk & Heritage",
    host: "Ananya Kapoor",
    badge: "Cinema & Photography • ID Verified ✓",
    location: "Lodhi Art District",
    city: "Delhi NCR",
    vibe: "Photography & Art",
    spotsLeft: 4,
    avatarId: "nd-c1",
    emoji: "📸",
    time: "Saturday @ 5:00 PM",
    bio: "Capture street murals, 35mm film vibes, and grab artisanal pastries after sunset."
  }
];

export default function App() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Audience mode switcher (Seekers vs Partners) - Defaulting to Partners
  const [heroTab, setHeroTab] = useState<'seeker' | 'partner'>('partner');
  
  // Theme Vibe: Day Cafe vs Twilight Cyber Night Mode
  const [themeVibe, setThemeVibe] = useState<'day' | 'twilight'>('day');

  // Roulette Instant Matcher State
  const [rouletteMatch, setRouletteMatch] = useState<typeof ROULETTE_MATCHES[0] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Partner Revenue & Trust Calculator State
  const [partnerHourlyRate, setPartnerHourlyRate] = useState<number>(500);
  const [partnerWeeklyHours, setPartnerWeeklyHours] = useState<number>(5);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cyber Terminal custom states
  const [selectedProtocol, setSelectedProtocol] = useState("startup");
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [terminalKey, setTerminalKey] = useState("");
  const [syncError, setSyncError] = useState("");
  
  // Modal states
  const [activeExperience, setActiveExperience] = useState<typeof experienceCards[0] | null>(null);
  const [isContinueModalOpen, setIsContinueModalOpen] = useState(false);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [watchSceneIndex, setWatchSceneIndex] = useState(0);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalType, setLeadModalType] = useState<'partner' | 'waitlist' | 'early_access'>('waitlist');
  const [leadModalInterests, setLeadModalInterests] = useState("");
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [showSeekerFull, setShowSeekerFull] = useState(false);
  const [showPartnerFull, setShowPartnerFull] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const watchScenes = [
    { title: "The Screen Trap", desc: "We spend our beautiful days scrolling past curated feeds, wishing we had someone to explore hobbies, sports, or cafes with.", icon: "📱" },
    { title: "Selfie Verification", desc: "Happy Hangouts clears every member's face using secure biometric scans before they step out. No bots, no fake accounts.", icon: "🛡️" },
    { title: "The Sync Protocol", desc: "Once aligned, lock a time at certified spots. Slide your visual Happy Keys together to verify you have both safely arrived.", icon: "🔑" },
    { title: "Unforgettable Experiences", desc: "No more canceled plans. Share acoustic guitar, deep startup talks, food crawls, or sunset drives with verified friends.", icon: "✨" }
  ];

  // Auto scroll background scenes
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSceneIndex((prev) => (prev + 1) % scenes.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleWatchNext = () => {
    audio.playClick();
    if (watchSceneIndex < watchScenes.length - 1) {
      setWatchSceneIndex(prev => prev + 1);
    } else {
      setIsWatchModalOpen(false);
      setWatchSceneIndex(0);
      confetti({ particleCount: 100, spread: 60, colors: ["#3b82f6", "#60a5fa", "#ffffff"] });
    }
  };

  const handleCardClick = (card: typeof experienceCards[0]) => {
    audio.playPageTransition();
    setActiveExperience(card);
    setIsContinueModalOpen(true);
  };

  const spinRoulette = () => {
    audio.playBeacon();
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * ROULETTE_MATCHES.length);
      setRouletteMatch(ROULETTE_MATCHES[randomIdx]);
      counter++;
      audio.playRouletteTick(counter);
      if (counter > 8) {
        clearInterval(interval);
        setIsSpinning(false);
        audio.playSuccess();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
    }, 110);
  };

  const handleGlobalClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;
    const interactive = target.closest("button, a, select, input, .cursor-pointer");
    if (!interactive) return;

    const isMusicControl = interactive.closest(".no-sound-trigger");
    if (!isMusicControl) {
      audio.playClick();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleGlobalClick, true);
    return () => document.removeEventListener("click", handleGlobalClick, true);
  }, []);

  return (
    <div className={`min-h-screen overflow-x-hidden relative transition-colors duration-700 selection:bg-blue-600/10 selection:text-blue-900 ${
      themeVibe === 'twilight' 
        ? 'bg-slate-950 text-slate-100 grid-mesh-dark' 
        : 'bg-white text-slate-800 font-sans grid-mesh'
    }`}>
      
      {/* BEAUTIFUL AMBIENT LIGHT-MODE OR ORBITAL TWILIGHT ORBS */}
      <div className={`absolute top-[5vh] left-[10%] w-[55vw] h-[55vw] rounded-full blur-[140px] pointer-events-none -z-10 transition-all duration-700 ${
        themeVibe === 'twilight' ? 'bg-radial from-blue-600/15 via-indigo-600/10 to-transparent' : 'bg-radial from-blue-500/5 via-indigo-500/3 to-transparent animate-pulse-slow'
      }`} />
      <div className={`absolute top-[100vh] right-[2%] w-[45vw] h-[45vw] rounded-full blur-[130px] pointer-events-none -z-10 transition-all duration-700 ${
        themeVibe === 'twilight' ? 'bg-radial from-indigo-600/15 via-purple-600/10 to-transparent' : 'bg-radial from-indigo-500/5 via-blue-500/3 to-transparent animate-float'
      }`} />

      {/* LUXURY MINIMALIST NAV HEADER */}
      <header className={`sticky top-0 left-0 w-full z-45 backdrop-blur-xl border-b transition-colors duration-500 py-3 sm:py-4 ${
        themeVibe === 'twilight' 
          ? 'bg-slate-950/80 border-slate-800/80 text-white' 
          : 'bg-white/80 border-slate-100/80 text-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="group transition-transform hover:scale-[1.01] active:scale-98 flex items-center gap-2">
            <HappyHangoutsLogo variant="header" theme={themeVibe === 'twilight' ? 'dark' : 'light'} />
          </a>

          {/* Minimalist Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-xs tracking-wide font-medium">
            <button
              onClick={() => {
                audio.playClick();
                setHeroTab('partner');
              }}
              className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
                heroTab === 'partner' 
                  ? 'text-indigo-600 font-extrabold' 
                  : themeVibe === 'twilight' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <span>🤝 Hangout Partners</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 font-black border border-indigo-500/30 uppercase">FOUNDING</span>
            </button>
            <button
              onClick={() => {
                audio.playClick();
                setHeroTab('seeker');
              }}
              className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
                heroTab === 'seeker' 
                  ? 'text-blue-600 font-extrabold' 
                  : themeVibe === 'twilight' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <span>🔍 Hangout Seekers</span>
            </button>
            {heroTab === 'partner' && (
              <a href="#partners" className="text-indigo-500 hover:text-indigo-400 font-semibold flex items-center gap-1.5 transition-colors">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                Partner Hub
              </a>
            )}
            {heroTab === 'seeker' && (
              <a href="#demo" className="text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1.5 transition-colors">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                Muba AI
              </a>
            )}
          </nav>

          {/* Clean Right Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Minimalist Sun/Moon Icon Toggle */}
            <button
              onClick={() => {
                audio.playToggle();
                setThemeVibe(prev => prev === 'day' ? 'twilight' : 'day');
              }}
              className={`p-2 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                themeVibe === 'twilight'
                  ? 'bg-slate-900 text-amber-300 border-slate-800 hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title="Toggle Day vs Twilight Mode"
            >
              {themeVibe === 'twilight' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Single Sleek Primary CTA */}
            <button 
              onClick={() => {
                audio.playPageTransition();
                setLeadModalType('partner');
                setLeadModalInterests("Applying as Founding Hangout Partner");
                setIsLeadModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 transform active:scale-95 text-center shrink-0 cursor-pointer shadow-sm hover:shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Become a Partner</span>
            </button>
          </div>
        </div>
      </header>

      {/* LIVE NCR ACTIVITY PULSE MARQUEE TICKER */}
      <div className={`w-full py-2 px-4 border-b font-mono text-[10px] uppercase tracking-wider overflow-hidden relative ${
        themeVibe === 'twilight' 
          ? 'bg-indigo-950/80 border-indigo-500/20 text-indigo-200' 
          : 'bg-slate-900 text-slate-200 border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0 font-black text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>⚡ NCR BEACON PULSE:</span>
          </div>
          <div className="whitespace-nowrap overflow-x-auto no-scrollbar flex items-center gap-6 text-slate-300 font-medium">
            <span className="flex items-center gap-1.5"><span className="text-emerald-400">●</span> 🎸 Hauz Khas Acoustic Jam (2 slots left)</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5"><span className="text-indigo-400">●</span> ☕ CyberHub Tech &amp; Coffee (1 slot left)</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5"><span className="text-blue-400">●</span> 🏸 Siri Fort Badminton Rally (Active)</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5"><span className="text-purple-400">●</span> 📚 Saket Book Club &amp; Pour-over</span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5"><span className="text-amber-400">●</span> 📸 CP Heritage Photowalk</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 shrink-0 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% ID-Vetted</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: CINEMATIC NEXT-GEN HERO WITH AUDIENCE TOGGLE */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 sm:pt-12 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-12 overflow-hidden border-b border-slate-100">
        {/* Rotating Ken Burns Background images */}
        <div className="absolute inset-0 z-0">
          {scenes.map((scene, idx) => (
            <div 
              key={scene.id}
              className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
                idx === activeSceneIndex ? "opacity-[0.07] scale-100" : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10" />
              <img 
                src={scene.image} 
                alt={scene.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto w-full relative z-10 text-center flex flex-col items-center space-y-6 sm:space-y-8">
          
          {/* DUAL AUDIENCE SWITCHER CONTROL PILL (Hangout Partners First) */}
          <div className="p-1 bg-slate-100/90 border border-slate-200/80 rounded-full shadow-inner flex items-center gap-1 max-w-xs sm:max-w-md w-full mx-auto">
            <button
              onClick={() => {
                audio.playClick();
                setHeroTab('partner');
              }}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                heroTab === 'partner' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 bg-transparent'
              }`}
            >
              <span>🤝 Hangout Partners</span>
            </button>
            <button
              onClick={() => {
                audio.playClick();
                setHeroTab('seeker');
              }}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                heroTab === 'seeker' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 bg-transparent'
              }`}
            >
              <span>🔍 Hangout Seekers</span>
            </button>
          </div>

          {/* Active scene live locator tag */}
          <div className="inline-flex items-center gap-2.5 bg-slate-50 border border-slate-200/60 px-4.5 py-2 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.02)] transition-all duration-500">
            <span className={`w-2 h-2 rounded-full animate-ping ${heroTab === 'seeker' ? 'bg-blue-600' : 'bg-indigo-600'}`} />
            <span className="text-[9px] font-black tracking-[0.16em] uppercase text-slate-500">
              {heroTab === 'seeker' ? (
                <>EXCLUSIVE ID-VERIFIED PEER NETWORK • <span className="text-blue-600 font-extrabold">DELHI NCR</span></>
              ) : (
                <>🔥 EXCLUSIVE COHORT • <span className="text-indigo-600 font-extrabold">ONBOARDING FIRST 50 PARTNERS IN DELHI NCR ONLY</span></>
              )}
            </span>
          </div>

          {/* Dynamic Title based on HeroTab */}
          {heroTab === 'partner' ? (
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] text-slate-900 leading-[1.05] font-display max-w-4xl">
              Become a Founding <br className="hidden md:inline" />
              Hangout Partner. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative inline-block">
                Monetize &amp; grow in NCR.
              </span>
            </h1>
          ) : (
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] text-slate-900 leading-[1.05] font-display max-w-4xl">
              Whatever you want <br className="hidden md:inline" />
              to experience... <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 relative inline-block">
                don't do it alone.
              </span>
            </h1>
          )}

          {/* Dynamic Subtext */}
          {heroTab === 'partner' ? (
            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl font-light leading-relaxed">
              Turn your free time and passions into rewarding experiences. Join the <strong>First 50 Founding Hangout Partners in Delhi NCR</strong> to host coffee jams, sports games, or city walks on your own schedule.
            </p>
          ) : (
            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl font-light leading-relaxed">
              Life is better when shared. Happy Hangouts connects friendly locals across Delhi NCR for real-life coffee chats, music jams, sports, and genuine friendships — safely and effortlessly.
            </p>
          )}

          {/* CTAs (Focused on single primary CTA) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4.5 w-full max-w-md pt-2">
            <button 
              onClick={() => {
                audio.playPageTransition();
                setLeadModalType('partner');
                setLeadModalInterests("Applying as Founding Hangout Partner - First 50 Cohort");
                setIsLeadModalOpen(true);
              }}
              className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 group active:scale-97 shrink-0 font-sans cursor-pointer hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Become a Founding Hangout Partner</span>
            </button>
          </div>

          {/* First 50 Delhi NCR Cohort High-Conversion Highlight Card */}
          <div className="w-full max-w-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4.5 sm:p-5 rounded-3xl border border-amber-400/40 text-white text-left shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-sans mt-2">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-400 text-[10px] font-mono font-black uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LIMITED DELHI NCR LAUNCH COHORT</span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-white tracking-tight">
                Now Onboarding First 50 Founding Partners in Delhi NCR Only
              </h4>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                First 50 partners receive Founder Badges, priority host matching, and lifetime 0% platform commissions. First 3 hangouts are 100% free to build your 5★ reviews!
              </p>
            </div>
            <button
              onClick={() => {
                audio.playPageTransition();
                setLeadModalType('partner');
                setLeadModalInterests("Claiming Founder Spot - First 50 Delhi NCR Partners");
                setIsLeadModalOpen(true);
              }}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shrink-0 cursor-pointer hover:scale-105 active:scale-95"
            >
              Claim Founder Spot ↗
            </button>
          </div>

          {/* Minimal cinematic slider indicator bar */}
          <div className="flex items-center gap-4 bg-white/95 border border-slate-200/60 px-4.5 py-2.5 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.02)] text-[11px] text-slate-500">
            <span className="font-extrabold tracking-widest uppercase text-[8px] text-slate-400">EXPERIENCE REELS:</span>
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="p-1 rounded-full hover:bg-slate-100 transition-colors no-sound-trigger text-slate-600 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-blue-600 fill-current" />}
            </button>
            <div className="w-20 h-0.5 bg-slate-200 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((activeSceneIndex + 1) / scenes.length) * 100}%` }}
              />
            </div>
            <span className="font-mono text-[9px] tracking-wider font-extrabold text-slate-600">{activeSceneIndex + 1}/{scenes.length}</span>
          </div>
        </div>
      </section>

      {/* SEEKER VIEW CONTENT (Only shown when Hangout Seekers tab is active) */}
      {heroTab === 'seeker' && (
        <>
          {/* SECTION 2: SHORT & CRISPY MISSION MANIFESTO */}
      <section id="about" className="py-20 px-6 max-w-7xl mx-auto relative border-b border-slate-100 text-center">
        
        <div className="space-y-4 relative max-w-3xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.25em] font-black text-blue-600 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-100 font-mono inline-block">
            📍 OUR MISSION
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-[-0.04em] font-display leading-[1.05]">
            Real people <span className="text-blue-600">syncing face-to-face.</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-light max-w-lg mx-auto leading-relaxed">
            Verified, like-minded locals meeting up at cozy spots across Delhi, Gurgaon, and Noida for real conversations and shared hobbies.
          </p>
        </div>

        {/* VISUAL REELS GRID */}
        <div className="mt-12 text-left">
          <VisualStoryReel 
            onSelectStory={(story: VisualStory) => {
              setLeadModalType('waitlist');
              setLeadModalInterests(`Selected Visual Reel: ${story.title} at ${story.location}`);
              setIsLeadModalOpen(true);
            }} 
          />
        </div>

        {/* 3 Ultra-Crispy laws cards - Transformed into Live 3D Perspective Panels with floating layers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto perspective-2000">
          {/* Card 1: Zero Catfishes */}
          <div className="animate-tilt-wobble-1 hover:!transform-none hover:translate-y-[-10px] hover:scale-[1.03] hover:shadow-[0_35px_60px_-15px_rgba(59,130,246,0.18)] transition-all duration-500 bg-white border border-slate-200/60 shadow-[0_15px_40px_rgba(0,0,0,0.02)] rounded-[32px] p-8 text-left relative overflow-hidden transform-style-3d cursor-default group">
            {/* Ambient subtle mesh background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-500" />
            
            {/* Floated Number Badge */}
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-black font-mono mb-8 shadow-inner translate-z-20 transition-transform duration-300 group-hover:scale-110">
              01
            </div>

            {/* Content with 3D translation */}
            <div className="translate-z-30 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-950 font-display tracking-tight">Zero Catfishes</h3>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                Every single profile is <strong className="text-slate-800 font-semibold font-sans">biometrically ID-verified</strong> before stepping outdoors. No bots, no fakes, and <strong className="text-slate-800 font-semibold font-sans">zero ghosting</strong>.
              </p>
            </div>

            {/* Bottom 3D accent label */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span className="uppercase tracking-widest">VERIFIED BIOMETRICS</span>
              <span className="text-blue-500 font-extrabold group-hover:translate-x-1.5 transition-transform duration-300">SECURE →</span>
            </div>
          </div>

          {/* Card 2: Happy Key Sync */}
          <div className="animate-tilt-wobble-2 hover:!transform-none hover:translate-y-[-10px] hover:scale-[1.03] hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6),0_0_40px_rgba(59,130,246,0.25)] transition-all duration-500 bg-slate-900 border border-slate-950 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.3)] rounded-[32px] p-8 text-left relative overflow-hidden transform-style-3d cursor-default group text-white">
            {/* Glowing neon halo in bg */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl group-hover:bg-blue-500/25 transition-all duration-500 pointer-events-none" />
            
            {/* Floated Number Badge */}
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-blue-400 flex items-center justify-center text-xl font-black font-mono mb-8 shadow-inner translate-z-20 transition-transform duration-300 group-hover:scale-110">
              02
            </div>

            {/* Content with 3D translation */}
            <div className="translate-z-30 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white font-display tracking-tight">Happy Key Sync</h3>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                Slide screens physically together to align tactile visual keys. It verifies <strong className="text-white font-semibold font-sans">physical arrival</strong> and cements <strong className="text-white font-semibold font-sans">absolute trust</strong>.
              </p>
            </div>

            {/* Bottom 3D accent label */}
            <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span className="uppercase tracking-widest">SCREEN-TO-SCREEN</span>
              <span className="text-blue-400 font-extrabold group-hover:translate-x-1.5 transition-transform duration-300">TRUSTED →</span>
            </div>
          </div>

          {/* Card 3: Handpicked Hubs */}
          <div className="animate-bounce-different hover:!transform-none hover:translate-y-[-10px] hover:scale-[1.03] hover:shadow-[0_35px_60px_-15px_rgba(59,130,246,0.18)] transition-all duration-500 bg-white border border-slate-200/60 shadow-[0_15px_40px_rgba(0,0,0,0.02)] rounded-[32px] p-8 text-left relative overflow-hidden transform-style-3d cursor-default group">
            {/* Ambient subtle mesh background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-500" />
            
            {/* Floated Number Badge */}
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-black font-mono mb-8 shadow-inner translate-z-20 transition-transform duration-300 group-hover:scale-110">
              03
            </div>

            {/* Content with 3D translation */}
            <div className="translate-z-30 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-950 font-display tracking-tight">Handpicked Hubs</h3>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light font-sans">
                No shady coordinates. Meet only at <strong className="text-slate-800 font-semibold">handpicked verified spots, parks, and activity hubs</strong> certified by trusted partners.
              </p>
            </div>

            {/* Bottom 3D accent label */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span className="uppercase tracking-widest">VETTED LOCATIONS Only</span>
              <span className="text-indigo-500 font-extrabold group-hover:translate-x-1.5 transition-transform duration-300">CERTIFIED →</span>
            </div>
          </div>
        </div>

      </section>

      {/* SECTION: INTERACTIVE LIVE APP DEMO SIMULATOR */}
      <section id="demo" className="py-28 px-6 max-w-7xl mx-auto border-b border-slate-100 relative">
        <div className="text-center mb-14 space-y-5">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-black text-blue-600 px-4 py-2 rounded-full bg-blue-50/90 border border-blue-200/80 shadow-sm font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>✨ WEB-FIRST EXPERIENCE SIMULATOR</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-[-0.04em] font-display max-w-4xl mx-auto leading-[1.08]">
            Step into the <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Living App</span>.
          </h2>

          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Experience Happy Hangouts in real-time. Test companion matching, schedule coffee meets, and trigger live Happy Key handshakes directly in your browser.
          </p>

          {/* Interactive Feature Highlight Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 max-w-2xl mx-auto text-[11px] font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200/60 flex items-center gap-1.5 shadow-2xs">
              ⚡ Real-Time Companion Match
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200/60 flex items-center gap-1.5 shadow-2xs">
              🔑 Dual Happy Key Handshake
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200/60 flex items-center gap-1.5 shadow-2xs">
              🛡️ Biometric Retina Score
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200/60 flex items-center gap-1.5 shadow-2xs">
              📍 Certified NCR Hubs
            </span>
          </div>
        </div>

        {/* ULTRA-COOL HIGH TECH SIMULATOR FRAME */}
        <div className="bg-slate-950 rounded-[44px] p-3 sm:p-6 lg:p-10 border border-slate-800 shadow-[0_30px_100px_rgba(15,23,42,0.25)] relative overflow-hidden text-left">
          
          {/* Ambient Lighting Background Halos */}
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

          {/* SIMULATED BROWSER / STUDIO DEVICE TOP TOOLBAR */}
          <div className="flex items-center justify-between pb-4 sm:pb-6 px-3 border-b border-slate-800/80 mb-6 relative z-10 text-slate-400">
            {/* macOS Window Controls */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm" />
              <span className="text-[10px] font-mono text-slate-500 ml-2 hidden sm:inline-block">Happy Hangouts Web Engine v1.4</span>
            </div>

            {/* Address Bar Pill */}
            <div className="bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-full text-[10px] font-mono text-slate-300 flex items-center gap-2 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-slate-400 font-bold">https://</span>
              <span className="text-white font-extrabold tracking-wide">happyhangouts.app</span>
              <span className="text-slate-500">/simulator</span>
            </div>

            {/* Live Engine Status Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono px-3 py-1 rounded-full font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>SIMULATOR ACTIVE</span>
            </div>
          </div>

          {/* APP DEMO CONTAINER */}
          <div className="relative z-10">
            <InteractiveAppDemo />
          </div>

        </div>
      </section>

      {/* SECTION 3: WHAT DO YOU WANT TO EXPERIENCE? (FOR HANGOUT SEEKERS) */}
      <section id="seekers" className="py-28 border-b border-slate-100 px-6 bg-slate-50/30">
        <div className="max-w-7xl mx-auto">
          
          {selectedInterest === null && (
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left animate-fade-in">
              <div className="max-w-xl space-y-4">
                <span className="text-[10px] uppercase tracking-[0.25em] font-black text-blue-600 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-100 font-mono inline-block">
                  🔍 FOR HANGOUT SEEKERS • PROTOCOL BEACONS
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-[-0.04em] font-display leading-[1.05]">
                  What do you want to <br className="hidden sm:inline" />
                  <span className="text-blue-600">experience today?</span>
                </h2>
              </div>
              <p className="text-slate-500 text-sm font-light max-w-sm leading-relaxed">
                Select any of our pre-vetted peer protocols below. Each protocol instantly bridges <strong className="text-slate-800 font-semibold font-sans">verified companion pools</strong>, spot routing, and <strong className="text-slate-800 font-semibold font-sans">offline biometric matching</strong>.
              </p>
            </div>
          )}

          {/* INSTANT HANGOUT ROULETTE CARD */}
          {selectedInterest === null && (
            <div className="mb-12 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-[32px] p-6 sm:p-8 text-white border border-blue-500/30 shadow-2xl relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
                    <span>🎲 INSTANT MATCH GENERATOR</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                    Don't know what to do today in NCR?
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                    Hit the Roulette wheel to randomly discover a 100% ID-verified companion, verified spot location, and activity recipe across Delhi, Gurgaon, or Noida.
                  </p>
                </div>

                <button
                  onClick={spinRoulette}
                  disabled={isSpinning}
                  className={`px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-2 font-mono ${
                    isSpinning ? 'animate-pulse opacity-80' : ''
                  }`}
                >
                  <span className="text-lg">🎲</span>
                  <span>{isSpinning ? 'SPINNING ROULETTE...' : 'SPIN FOR INSTANT MATCH'}</span>
                </button>
              </div>

              {/* ROULETTE MATCH RESULT BOX */}
              {rouletteMatch && (
                <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in">
                  <div className="bg-slate-950/80 border border-indigo-500/40 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-900/80 border border-indigo-400/30 overflow-hidden shrink-0 flex items-center justify-center text-2xl shadow-inner">
                        <CharacteristicAvatar id={rouletteMatch.avatarId} className="w-full h-full" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg">{rouletteMatch.emoji}</span>
                          <h4 className="text-base font-black text-white font-display">{rouletteMatch.title}</h4>
                          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                            {rouletteMatch.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-light">{rouletteMatch.bio}</p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-indigo-300 pt-1">
                          <span>📍 {rouletteMatch.location} ({rouletteMatch.city})</span>
                          <span>•</span>
                          <span>⏰ {rouletteMatch.time}</span>
                          <span>•</span>
                          <span className="text-amber-300 font-bold">🔥 {rouletteMatch.spotsLeft} Spots Left</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        audio.playPageTransition();
                        setLeadModalType('waitlist');
                        setLeadModalInterests(`Roulette Match Access: ${rouletteMatch.title} at ${rouletteMatch.location}`);
                        setIsLeadModalOpen(true);
                      }}
                      className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer shrink-0 text-center"
                    >
                      Lock Slot with {rouletteMatch.host.split(" ")[0]} →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Swiss-Modern Horizontal Scroll Carousel */}
          {selectedInterest === null ? (
            <div className="space-y-6 text-left animate-fade-in relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400 flex items-center gap-2">
                  <span>🔒 Swipe / Scroll horizontally to explore protocol beacons</span>
                  <span className="animate-pulse text-blue-600">→</span>
                </p>
                {/* Scroll Control Arrows (Visible on desktop & mobile for excellent utility) */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (scrollRef.current) {
                        scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
                        audio.playClick();
                      }
                    }}
                    className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center text-slate-600 active:scale-95 cursor-pointer"
                    title="Scroll Left"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => {
                      if (scrollRef.current) {
                        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
                        audio.playClick();
                      }
                    }}
                    className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center text-slate-600 active:scale-95 cursor-pointer"
                    title="Scroll Right"
                  >
                    →
                  </button>
                </div>
              </div>
              
              {/* Horizontal Scroll Track */}
              <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:mx-0 md:px-0"
                style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
              >
                {[
                  { id: "startup", title: "Startups & Tech", emoji: "💡", desc: "Whiteboarding, co-founder sync, startup ideas.", seekers: 14, color: "hover:border-blue-500/40 hover:bg-blue-50/5" },
                  { id: "guitar", title: "Learn Guitar", emoji: "🎸", desc: "Chords progressions, duet harmonies, songwriting.", seekers: 8, color: "hover:border-purple-500/40 hover:bg-purple-50/5" },
                  { id: "sports", title: "Sports & Fitness", emoji: "🏸", desc: "Badminton drop rallies, early outdoor trail cycling.", seekers: 19, color: "hover:border-emerald-500/40 hover:bg-emerald-50/5" },
                  { id: "photography", title: "Art & Lens", emoji: "📷", desc: "Park photowalks, camera setups, frame composition.", seekers: 6, color: "hover:border-pink-500/40 hover:bg-pink-50/5" },
                  { id: "food", title: "Cafes & Culinary", emoji: "🍜", desc: "Heritage tea stalls, specialty pour-overs, food walks.", seekers: 11, color: "hover:border-amber-500/40 hover:bg-amber-50/5" },
                  { id: "wedding", title: "Socials & Weddings", emoji: "💍", desc: "Ethnic coordination, stylistic themes, positive aura.", seekers: 4, color: "hover:border-rose-500/40 hover:bg-rose-50/5" },
                  { id: "books", title: "Lit & Philosophy", emoji: "📚", desc: "Discuss book chapters, cozy reading rooms, creative writing.", seekers: 10, color: "hover:border-orange-500/40 hover:bg-orange-50/5" },
                  { id: "music", title: "Vocal Jam Jams", emoji: "🎤", desc: "Mic recordings, choir duets, physical studio setup.", seekers: 7, color: "hover:border-indigo-500/40 hover:bg-indigo-50/5" },
                  { id: "cities", title: "Explore Cities", emoji: "🌍", desc: "Historic ruins, weekend morning runs, scenic NCR drives.", seekers: 12, color: "hover:border-sky-500/40 hover:bg-sky-50/5" }
                ].map((interest) => (
                  <button
                    key={interest.id}
                    onClick={() => {
                      audio.playPageTransition();
                      setSelectedInterest(interest.id);
                    }}
                    className={`group bg-white border border-slate-100 p-7 rounded-[24px] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-100/50 flex flex-col justify-between h-[210px] w-[280px] sm:w-[320px] shrink-0 snap-start cursor-pointer ${interest.color}`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-3xl filter saturate-100 group-hover:scale-110 transition-transform duration-300">{interest.emoji}</span>
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {interest.seekers} Seekers Live
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 font-display tracking-tight group-hover:text-blue-600 transition-colors">
                        {interest.title}
                      </h3>
                      <p className="text-slate-400 text-xs font-light leading-relaxed">
                        {interest.desc}
                      </p>
                    </div>

                    <div className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center justify-between group-hover:text-blue-600 transition-colors pt-3 border-t border-slate-50">
                      <span>UNLOCK PROTOCOL</span>
                      <span>➕</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in text-left">
              
              {/* Sleek Active Tab Control Bar */}
              <div className="bg-white border border-slate-100 rounded-[24px] p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
                  <button
                    onClick={() => {
                      audio.playClick();
                      setSelectedInterest(null);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-mono font-black text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors mr-2 flex items-center gap-1 shrink-0"
                  >
                    ⬅ ALL INTERESTS
                  </button>
                  
                  {[
                    { id: "startup", label: "Startups", emoji: "💡" },
                    { id: "guitar", label: "Guitar", emoji: "🎸" },
                    { id: "sports", label: "Sports", emoji: "🏸" },
                    { id: "photography", label: "Photography", emoji: "📷" },
                    { id: "food", label: "Food", emoji: "🍜" },
                    { id: "wedding", label: "Weddings", emoji: "💍" },
                    { id: "books", label: "Books", emoji: "📚" },
                    { id: "music", label: "Music", emoji: "🎤" },
                    { id: "cities", label: "Explore", emoji: "🌍" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        audio.playClick();
                        setSelectedInterest(tab.id);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        selectedInterest === tab.id
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span>{tab.emoji}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    audio.playClick();
                    setSelectedInterest(null);
                  }}
                  className="text-xs text-slate-400 font-mono hover:text-blue-600 transition-colors uppercase shrink-0"
                >
                  Clear filter ✖
                </button>
              </div>

              {/* Highlighted detail template layout for the clicked card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8">
                {experienceCards
                  .filter((card) => card.id === selectedInterest)
                  .map((card) => (
                    <React.Fragment key={card.id}>
                      {/* Left Side: Immersive Dossier Card */}
                      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 shadow-lg shadow-slate-100/40 relative overflow-hidden flex flex-col justify-between text-left">
                        <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-60 pointer-events-none" />
                        
                        <div className="space-y-6 relative z-10">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <span className="text-5xl filter saturate-100 animate-float">{card.emoji}</span>
                              <div>
                                <span className="text-[9px] font-mono font-black text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md uppercase tracking-wider block w-fit">
                                  ACTIVE PROTOCOL PROTO-{card.id.toUpperCase()}
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight mt-1.5">
                                  {card.title}
                                </h3>
                              </div>
                            </div>
                            <span className="text-xs font-mono text-slate-400">#{(experienceCards.indexOf(card) * 11 + 10).toString(16).toUpperCase()}</span>
                          </div>

                          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">
                            {card.desc}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100 text-xs">
                            <div className="space-y-1 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60">
                              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider font-mono text-[10px]">📍 Recommended Hubs</h4>
                              <p className="text-slate-500 font-light">Verified spots (10+ in Delhi NCR): Siri Fort, Sunder Nursery, CP Third Wave, Khan Market, NGMA, CyberHub & Sector 104 Noida.</p>
                            </div>
                            <div className="space-y-1 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60">
                              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider font-mono text-[10px]">👥 Dynamic Grouping</h4>
                              <p className="text-slate-500 font-light">Choose single 1-on-1 companions or coordinated micro-gatherings of 3-5 peers.</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="text-[10px] font-mono text-slate-400">
                            🔒 100% ID Verified & Physically Secured
                          </div>
                          <button
                            onClick={() => handleCardClick(card)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>Initiate Connection</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Right Side: Security Guidelines Panel */}
                      <div className="lg:col-span-5 bg-slate-900 text-white border border-slate-950 rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-between text-left">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
                        
                        <div className="space-y-5 text-xs font-light">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono">INTEGRITY & SAFETY FRAMEWORK</h4>
                          </div>

                          <div className="space-y-4">
                            <p className="text-slate-300 leading-relaxed">
                              Happy Hangouts coordinates and pairs you with verified peers under strict modern standards:
                            </p>

                            <div className="space-y-3 font-mono text-[11px] text-slate-400">
                              <div className="flex items-start gap-2.5">
                                <span className="text-blue-400">✓</span>
                                <div>
                                  <strong className="text-white block font-mono font-bold">1. SECURE SEEDING</strong>
                                  <span>Every individual passes government-tier biometric identity scans.</span>
                                </div>
                              </div>
                              <div className="flex items-start gap-2.5">
                                <span className="text-blue-400">✓</span>
                                <div>
                                  <strong className="text-white block font-mono font-bold">2. PARTNER VERIFIED HUBS</strong>
                                  <span>Meets are confined to curated, pre-vetted local venues with physical hosts.</span>
                                </div>
                              </div>
                              <div className="flex items-start gap-2.5">
                                <span className="text-blue-400">✓</span>
                                <div>
                                  <strong className="text-white block font-mono font-bold">3. HAPPY KEY SYNC</strong>
                                  <span>Slide and align visual keys face-to-face to verify secure arrivals.</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            audio.playPageTransition();
                            setLeadModalType('waitlist');
                            setLeadModalInterests(`Highly interested in "${card.title}" protocol. Goal: ${card.desc}`);
                            setIsLeadModalOpen(true);
                          }}
                          className="w-full mt-6 py-3.5 rounded-xl bg-white text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 font-display"
                        >
                          Join waitlist for {card.title}
                        </button>
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* NEW INTERACTIVE TRUST MAP */}
      <TrustMap 
        onJoinWaitlist={(interests) => {
          setLeadModalType('waitlist');
          if (interests) {
            setLeadModalInterests(interests);
          } else {
            setLeadModalInterests("");
          }
          setIsLeadModalOpen(true);
        }}
      />
        </>
      )}

      {/* PARTNER VIEW CONTENT (Only shown when Hangout Partners tab is active) */}
      {heroTab === 'partner' && (
        <>
          {/* SECTION 4.5: HANGOUT PARTNERS & HOST PROGRAM */}
      <section id="partners" className="py-24 px-6 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-b border-slate-800">
        {/* Glowing background orbs */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-mono font-black uppercase tracking-widest shadow-lg shadow-amber-500/10">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>🔥 FIRST 50 PARTNERS ONLY • DELHI NCR</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Monetize Your Time &amp; Passions
            </h2>

            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto font-sans">
              Host activities on your schedule, build 5★ reviews with 3 free hangouts, and set your custom hourly rate.
            </p>
          </div>

          {/* 3 Core Highlights of a Hangout Partner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            
            {/* Highlight 1: Flexible Schedule */}
            <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-[28px] space-y-4 hover:border-indigo-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                ⏰
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-extrabold text-indigo-400 uppercase tracking-widest">FLEXIBLE HOURS</span>
                <h3 className="text-lg font-black font-display text-white">Host On Your Schedule</h3>
              </div>
              <p className="text-slate-400 text-xs font-light leading-relaxed">
                Coffee chats, guitar jams, or sports rallies whenever you're free. You pick the venue, date, and time.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono pt-3 border-t border-slate-800/80">
                <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Total control over your dates</li>
                <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Choose verified venues in NCR</li>
                <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Zero fixed quotas</li>
              </ul>
            </div>

            {/* Highlight 2: Trust & Reviews First */}
            <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-[28px] space-y-4 hover:border-amber-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                ⭐
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-extrabold text-amber-400 uppercase tracking-widest">TRUST FIRST</span>
                <h3 className="text-lg font-black font-display text-white">First 3 Hangouts 100% Free</h3>
              </div>
              <p className="text-slate-400 text-xs font-light leading-relaxed">
                Your first 3 hangouts build trust, collect verified 5-star seeker reviews, and earn 150+ Trust Points.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono pt-3 border-t border-slate-800/80">
                <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Earn 150 Trust Points</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Verified 5-star seeker reviews</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Unlocks custom hourly pricing</li>
              </ul>
            </div>

            {/* Highlight 3: Custom Hourly Payouts */}
            <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-[28px] space-y-4 hover:border-emerald-500/50 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                💎
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-extrabold text-emerald-400 uppercase tracking-widest">MONETIZE TIME</span>
                <h3 className="text-lg font-black font-display text-white">Set Your Hourly Rate</h3>
              </div>
              <p className="text-slate-400 text-xs font-light leading-relaxed">
                After 3 trust hangouts, set your price per hour (₹200 – ₹1,500/hr) for your time or skills. Direct payouts.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono pt-3 border-t border-slate-800/80">
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Set hourly price freely</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Direct UPI / Bank payouts</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 100% ID-verified seekers</li>
              </ul>
            </div>

          </div>

          {/* INTERACTIVE PARTNER REVENUE & TRUST ESTIMATOR */}
          <div className="bg-slate-900/95 border border-indigo-500/30 rounded-[36px] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />
            
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">
                  🧮 HANGOUT PARTNER TRUST &amp; EARNINGS ESTIMATOR
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                  Estimate Your Trust Points &amp; Hourly Payouts
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm font-light">
                  First 3 hangouts are <strong>100% FREE</strong> for seekers to build your trust &amp; reviews, then unlock your custom hourly rate!
                </p>
              </div>

              {/* Trust Badge Process Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left font-sans">
                <div className="bg-slate-800/80 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">First 3 Hangouts (100% Free)</span>
                    <p className="text-[11px] text-slate-300 font-light mt-0.5 leading-relaxed">
                      Earn <strong className="text-amber-300">150 Trust Points</strong> &amp; verified 5-star reviews to build your host credibility.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-emerald-500/30 p-4 rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Unlock Custom Hourly Rate</span>
                    <p className="text-[11px] text-slate-300 font-light mt-0.5 leading-relaxed">
                      Set your price per hour (₹200 – ₹1,500/hr) and get direct payouts on your schedule.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sliders Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Slider 1: Target Hourly Rate */}
                <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-3 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-bold">Your Custom Hourly Rate</span>
                    <span className="font-mono text-emerald-400 font-black text-sm">₹{partnerHourlyRate} / hr</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1500"
                    step="50"
                    value={partnerHourlyRate}
                    onChange={(e) => setPartnerHourlyRate(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Unlocked post 3 free trust-building hangouts
                  </span>
                </div>

                {/* Slider 2: Weekly Hosted Hours */}
                <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-3 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-bold">Weekly Hosted Hours</span>
                    <span className="font-mono text-indigo-400 font-black text-sm">{partnerWeeklyHours} hrs / week</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="1"
                    value={partnerWeeklyHours}
                    onChange={(e) => setPartnerWeeklyHours(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block font-mono">
                    ~{partnerWeeklyHours * 4} hours total per month
                  </span>
                </div>
              </div>

              {/* Payout & Trust Output Card */}
              <div className="bg-gradient-to-r from-indigo-900/90 via-slate-900 to-blue-900/90 p-6 rounded-2xl border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold block">PROJECTED MONTHLY EARNINGS</span>
                    <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">POST 3 FREE HANGOUTS</span>
                  </div>
                  
                  <div className="text-3xl sm:text-4xl font-black font-display text-emerald-400">
                    ₹{(partnerWeeklyHours * 4 * partnerHourlyRate).toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-300">/ month</span>
                  </div>
                  
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    <strong className="text-amber-300">Trust Onboarding:</strong> First 3 hangouts earn <strong>150 Trust Points + 3 Verified Reviews</strong>. <br />
                    After that, hosting {partnerWeeklyHours} hrs/wk at ₹{partnerHourlyRate}/hr yields ₹{(partnerWeeklyHours * 4 * partnerHourlyRate).toLocaleString('en-IN')} monthly.
                  </p>
                </div>

                <button
                  onClick={() => {
                    audio.playPageTransition();
                    setLeadModalType('partner');
                    setLeadModalInterests(`Partner Estimator Application: Target Rate: ₹${partnerHourlyRate}/hr, Weekly Hours: ${partnerWeeklyHours} hrs/wk. Est Monthly Payout: ₹${partnerWeeklyHours * 4 * partnerHourlyRate}`);
                    setIsLeadModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <span>Become a Founding Hangout Partner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* LIVE PARTNER IN-APP INTERFACE PREVIEW */}
          <div className="space-y-6 pt-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">
                📱 LIVE PARTNER APP INTERFACE
              </span>
              <h3 className="text-2xl sm:text-4xl font-black font-display text-white">
                How Happy Hangouts Works For Hosts &amp; Venues
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm font-light">
                Experience the real-time Partner Hub dashboard: validate Biometric Happy Keys, manage table slots, track instant payouts, and broadcast messages to attending seekers.
              </p>
            </div>

            <PartnerAppDemo />
          </div>

          {/* Partner Trust Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-900/60 border border-slate-800 rounded-3xl text-center">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black font-display text-indigo-400">+45%</span>
              <p className="text-[10px] font-mono uppercase text-slate-400 font-bold">Footfall Boost</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black font-display text-blue-400">100%</span>
              <p className="text-[10px] font-mono uppercase text-slate-400 font-bold">Biometric ID Vetted</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black font-display text-emerald-400">&lt; 2%</span>
              <p className="text-[10px] font-mono uppercase text-slate-400 font-bold">No-Show Rate</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black font-display text-amber-400">Direct</span>
              <p className="text-[10px] font-mono uppercase text-slate-400 font-bold">WhatsApp &amp; Sheet Alerts</p>
            </div>
          </div>

        </div>
      </section>
        </>
      )}

      {/* SECTION 5: PREMIUM LEAD COLLECTION (JOIN WAITLIST / BECOME A PARTNER) */}
      <section id="join" className="py-24 px-6 bg-slate-50/20 border-b border-slate-100 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8 text-left lg:sticky lg:top-28">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.25em] font-black text-blue-600 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-100 font-mono inline-block">
                  ⚡ CHOOSE YOUR PATHWAY
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-[-0.03em] font-display leading-tight">
                  Discover Your <span className="text-blue-600">Perfect Fit</span>
                </h3>
                <p className="text-slate-500 text-sm font-light leading-relaxed">
                  Whether you are seeking real-life face-to-face companions or wanting to run local neighborhood hubs, we provide a complete, authenticated infrastructure.
                </p>
              </div>

              {/* Unique selling benefits: Seeker vs Partner (Redesigned with cool, highly-interactive 3D cards & pulse elements) */}
              <div className="space-y-6 pt-2">
                {/* Seeker Benefits Card */}
                <div 
                  onClick={() => {
                    audio.playClick();
                    setShowSeekerFull(!showSeekerFull);
                  }}
                  className="group relative p-7 rounded-[28px] border bg-white animate-border-pulse-blue hover:shadow-[0_20px_45px_rgba(59,130,246,0.18)] hover:-translate-y-2.5 overflow-hidden cursor-pointer select-none transition-all duration-500"
                >
                  {/* Neon radial glow in background */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none" />
                  
                  {/* Top Header & Pulse beacon */}
                  <div className="flex items-center justify-between mb-4.5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-[inset_0_2px_4px_rgba(59,130,246,0.06)] group-hover:scale-110 transition-transform duration-300">
                        👤
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">ROLE 01 • SEEKER</h4>
                        <h3 className="text-lg font-black text-slate-900 font-display">Hangout Seeker</h3>
                      </div>
                    </div>
                    {/* Live pulse indicator */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-extrabold text-emerald-600 font-mono animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ACTIVE SEEKER
                    </div>
                  </div>

                  {/* Teaser content when collapsed */}
                  {!showSeekerFull && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-4 text-[13px] text-slate-500 leading-relaxed font-light"
                    >
                      <p>
                        Find real, verified human friends nearby. Tap to view custom safety match rules and coordinates.
                      </p>
                    </motion.div>
                  )}

                  {/* Expanded bullet items */}
                  <AnimatePresence initial={false}>
                    {showSeekerFull && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden mt-4"
                      >
                        <ul className="space-y-3 text-[13px] text-slate-500 font-light pt-2 border-t border-slate-100">
                          <motion.li 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <span className="text-blue-500 font-black shrink-0">✓</span>
                            <span><strong>Genuine Peer Match:</strong> Match instantly with 100% ID-verified human companions.</span>
                          </motion.li>
                          <motion.li 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <span className="text-blue-500 font-black shrink-0">✓</span>
                            <span><strong>Instant Coordination:</strong> Say goodbye to scheduling chaos for sports, coffee, or music jams.</span>
                          </motion.li>
                          <motion.li 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="flex items-start gap-3"
                          >
                            <span className="text-blue-500 font-black shrink-0">✓</span>
                            <span><strong>Verified Hub Safeties:</strong> Coordinate meets strictly at vetted café & wellness spots.</span>
                          </motion.li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Toggle CTA bar at bottom */}
                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                    <span>{showSeekerFull ? "Hide Premium Perks" : "Click to Reveal 3 Seeker Perks"}</span>
                    <motion.span 
                      animate={{ rotate: showSeekerFull ? 180 : 0 }}
                      className="text-blue-500"
                    >
                      ▼
                    </motion.span>
                  </div>
                </div>

                {/* Partner Benefits Card */}
                <div 
                  onClick={() => {
                    audio.playClick();
                    setShowPartnerFull(!showPartnerFull);
                  }}
                  className="group relative p-7 rounded-[28px] border bg-white animate-border-pulse-indigo hover:shadow-[0_20px_45px_rgba(99,102,241,0.18)] hover:-translate-y-2.5 overflow-hidden cursor-pointer select-none transition-all duration-500"
                >
                  {/* Neon radial glow in background */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500 pointer-events-none" />
                  
                  {/* Top Header & Pulse beacon */}
                  <div className="flex items-center justify-between mb-4.5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-[inset_0_2px_4px_rgba(99,102,241,0.06)] group-hover:scale-110 transition-transform duration-300">
                        🤝
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">ROLE 02 • CERTIFIED HOST</h4>
                        <h3 className="text-lg font-black text-slate-900 font-display">Hangout Partner</h3>
                      </div>
                    </div>
                    {/* Live pulse indicator */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-extrabold text-indigo-600 font-mono animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      CERTIFY OPEN
                    </div>
                  </div>

                  {/* Teaser content when collapsed */}
                  {!showPartnerFull && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="mt-4 text-[13px] text-slate-500 leading-relaxed font-light"
                    >
                      <p>
                        Host premium circles, direct visitors to handpicked venues, and earn hosting bonuses.
                      </p>
                    </motion.div>
                  )}

                  {/* Expanded bullet items */}
                  <AnimatePresence initial={false}>
                    {showPartnerFull && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden mt-4"
                      >
                        <ul className="space-y-3 text-[13px] text-slate-500 font-light pt-2 border-t border-slate-100">
                          <motion.li 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <span className="text-indigo-500 font-black shrink-0">✓</span>
                            <span><strong>Curated Gatherings:</strong> Host highly vetted, interest-driven circles with premium tools.</span>
                          </motion.li>
                          <motion.li 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <span className="text-indigo-500 font-black shrink-0">✓</span>
                            <span><strong>Promote Local Hubs:</strong> Direct verified visitors to pre-certified partner spots, parks, or activity centers.</span>
                          </motion.li>
                          <motion.li 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="flex items-start gap-3"
                          >
                            <span className="text-indigo-500 font-black shrink-0">✓</span>
                            <span><strong>Host Rewards Tier:</strong> Unlock premium revenue perks, customized badges, and priority support.</span>
                          </motion.li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Toggle CTA bar at bottom */}
                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                    <span>{showPartnerFull ? "Hide Certified Host Perks" : "Click to Reveal 3 Partner Perks"}</span>
                    <motion.span 
                      animate={{ rotate: showPartnerFull ? 180 : 0 }}
                      className="text-indigo-500"
                    >
                      ▼
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <LeadCollectionForm inlineLayout={true} initialType={heroTab === 'partner' ? 'partner' : 'waitlist'} />
            </div>

          </div>
        </div>
      </section>

      {/* FUTURISTIC MINIMALIST FOOTER (Updated for clean light mode) */}
      <footer className="py-16 border-t border-slate-100 bg-slate-50/40 text-center text-slate-500 text-[11px] font-mono tracking-wider">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <span>&copy; {new Date().getFullYear()} HAPPY HANGOUTS. ALL RIGHTS SECURED.</span>
          <div className="flex gap-6 items-center">
            <a href="#about" className="hover:text-blue-600 transition-colors">ABOUT</a>
            <a href="#demo" className="hover:text-blue-600 text-blue-600 font-extrabold transition-colors">LIVE DEMO</a>
            <a href="#experiences" className="hover:text-blue-600 transition-colors">EXPERIENCES</a>
          </div>
        </div>
      </footer>

      {/* WATCH STORY OVERLAY DIALOG (Updated to light mode card) */}
      {isWatchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-55 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white border border-slate-200/60 rounded-[36px] max-w-lg w-full p-9 text-center relative shadow-2xl space-y-6">
            <div className="text-5xl">{watchScenes[watchSceneIndex].icon}</div>
            
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-600 font-mono bg-blue-50 px-2.5 py-1 rounded-md">
                Chapter {watchSceneIndex + 1} of {watchScenes.length}
              </span>
              <h3 className="text-2xl font-black font-display text-slate-900 tracking-tight pt-3">
                {watchScenes[watchSceneIndex].title}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light font-sans max-w-sm mx-auto">
                {watchScenes[watchSceneIndex].desc}
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between gap-4">
              <button 
                onClick={() => { audio.playClick(); setIsWatchModalOpen(false); setWatchSceneIndex(0); }}
                className="text-[10px] font-mono text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest font-black"
              >
                Skip Story
              </button>
              
              <button
                onClick={handleWatchNext}
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-blue-500/10 active:scale-95"
              >
                <span>{watchSceneIndex === watchScenes.length - 1 ? "Complete" : "Next Scene"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTINUE IN THE MOBILE APP MODAL (Updated to light mode card) */}
      {isContinueModalOpen && activeExperience && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-55 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white border border-slate-200/60 rounded-[36px] max-w-md w-full p-9 text-center relative shadow-2xl">
            <button 
              onClick={() => { audio.playClick(); setIsContinueModalOpen(false); }}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              &times;
            </button>

            {/* Category Icon */}
            <div className="mx-auto w-18 h-18 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl mb-6 shadow-xs">
              {activeExperience.emoji}
            </div>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full">
              {activeExperience.title}
            </span>

            <h4 className="text-2xl font-black font-display tracking-tight text-slate-900 mt-6 leading-tight">
              Protocol Private Beta
            </h4>

            <p className="text-xs text-slate-500 mt-4 leading-relaxed font-light font-sans px-2">
              Our <strong>{activeExperience.title}</strong> companion pool is currently in private beta. To find verified peers, synchronize biometric Happy Keys, and coordinate offline meetups, secure your priority slot.
            </p>

            {/* Direct App Store Download Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
              <button
                onClick={() => { 
                  audio.playPageTransition(); 
                  setIsContinueModalOpen(false); 
                  setLeadModalType('waitlist');
                  setLeadModalInterests(`Highly interested in "${activeExperience.title}" protocol. Goal: ${activeExperience.desc}`);
                  setIsLeadModalOpen(true);
                }}
                className="w-full py-4.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/15 transition-all block text-center active:scale-95 cursor-pointer font-sans"
              >
                Join the Waitlist
              </button>
              <span className="text-[9px] text-slate-400 font-mono block uppercase tracking-wider">
                🔒 100% Biometrically Verified & Secure
              </span>
            </div>
          </div>
        </div>
      )}

      {/* LEAD COLLECTION OVERLAY MODAL */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-55 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white border border-slate-200/60 rounded-[32px] max-w-2xl w-full p-6 sm:p-10 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => { audio.playClick(); setIsLeadModalOpen(false); }}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-10"
              aria-label="Close"
            >
              &times;
            </button>

            <LeadCollectionForm 
              initialType={leadModalType} 
              defaultInterests={leadModalInterests}
              defaultJoinAs={leadModalType === 'partner' ? 'partner' : 'seeker'}
              onSuccess={() => {
                setTimeout(() => {
                  setIsLeadModalOpen(false);
                }, 1500);
              }}
            />
          </div>
        </div>
      )}

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <FaqSection 
        onJoinWaitlist={(reason) => {
          setLeadModalType('waitlist');
          setLeadModalInterests(reason || 'Interested from FAQ section');
          setIsLeadModalOpen(true);
        }} 
      />

      {/* GLOBAL FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-6 border-t border-slate-800 font-sans relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Col 1: Brand info */}
          <div className="md:col-span-5 space-y-4">
            <HappyHangoutsLogo variant="header" theme="dark" />
            <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm">
              Life is better when shared. Happy Hangouts brings effortless human connection back to Delhi NCR — connecting friendly locals for real-life coffee meets, sports, music, and genuine friendships.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <h5 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">Hangout Seekers</h5>
            <ul className="space-y-2 text-slate-400 font-light">
              <li><a href="#seekers" className="hover:text-white transition-colors">Acoustic Jam Sync</a></li>
              <li><a href="#seekers" className="hover:text-white transition-colors">Chess &amp; Coffee Meets</a></li>
              <li><a href="#seekers" className="hover:text-white transition-colors">Lodhi Photowalks</a></li>
              <li><a href="#seekers" className="hover:text-white transition-colors">Siri Fort Sports</a></li>
            </ul>
          </div>

          {/* Col 3: Partners & Security */}
          <div className="md:col-span-4 space-y-3 font-mono text-xs">
            <h5 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">Partner Hubs &amp; Safety</h5>
            <ul className="space-y-2 text-slate-400 font-light">
              <li><a href="#partners" className="hover:text-white transition-colors">Founding Partner Network</a></li>
              <li><a href="#partners" className="hover:text-white transition-colors">Aadhaar Biometric Verification</a></li>
              <li><a href="#partners" className="hover:text-white transition-colors">Happy Key Handshake Protocol</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-4">
          <p>© 2026 Happy Hangouts Inc. All rights reserved. Built for Delhi NCR.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Cloud Run Deployed</span>
            <span>•</span>
            <span>Biometrically Secured</span>
          </div>
        </div>
      </footer>

      {/* Floating Muba Experience Chat Coordinator */}
      <MubaInteractiveChat />

      {/* MOBILE STICKY BOTTOM QUICK BAR */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-xl border border-slate-200/80 p-1.5 rounded-full shadow-2xl flex items-center justify-around gap-1 font-mono text-[10px]">
        <a 
          href="#seekers" 
          onClick={() => audio.playClick()}
          className="flex-1 py-2 rounded-full text-center font-bold text-blue-700 bg-blue-50/80 border border-blue-200/60 active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          <span>🔍 Seekers</span>
        </a>
        <a 
          href="#demo" 
          onClick={() => audio.playClick()}
          className="flex-1 py-2 rounded-full text-center font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          <span>💬 Muba AI</span>
        </a>
        <a 
          href="#partners" 
          onClick={() => audio.playClick()}
          className="flex-1 py-2 rounded-full text-center font-bold text-indigo-700 bg-indigo-50/80 border border-indigo-200/60 active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          <span>🤝 Partners</span>
        </a>
      </div>

    </div>
  );
}
