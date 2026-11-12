import React, { useState, useEffect, useRef } from "react";
import { 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  MapPin, 
  Star, 
  Sparkles, 
  ArrowRight, 
  ArrowUp,
  Check, 
  Clock, 
  Phone, 
  X, 
  CheckCircle2, 
  Calendar,
  Send,
  MessageCircle,
  AlertCircle,
  Radio,
  Compass,
  Zap,
  Lock,
  Flame,
  Award
} from "lucide-react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  AnimatePresence,
  useInView
} from "motion/react";
import { audio, setupGlobalAudioListeners } from "./utils/audio";
import { submitToGoogleSheets, generateWhatsAppLeadUrl } from "./lib/googleSheets";
import { analytics, trackPageView } from "./utils/analytics";
import AnimatedCharacterStorySection from "./components/AnimatedCharacterStorySection";
import LiveHangoutsRadar from "./components/LiveHangoutsRadar";
import BacklinkHub from "./components/BacklinkHub";
import HangoutRequestDispatcher from "./components/HangoutRequestDispatcher";
import CircledHighlight from "./components/CircledHighlight";
import LifestyleHangoutGallery from "./components/LifestyleHangoutGallery";

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
    id: "p-ujjwal",
    name: "Ujjwal Poonia",
    emoji: "🏸",
    act: "badminton",
    categoryLabel: "Badminton",
    rate: 400,
    rating: 4.9,
    times: ["morning", "evening", "weekend"],
    city: "Gurugram",
    location: "Sector 29 & DLF Phase 4, Gurugram",
    vibeText: "Competitive rallies, doubles matches, and high-energy court drills.",
    bgColor: "#7cc4ff",
    badge: "Featured Host"
  },
  {
    id: "p-sonika",
    name: "Sonika Sharma",
    emoji: "☕",
    act: "cafe",
    categoryLabel: "Café chat",
    rate: 450,
    rating: 4.9,
    times: ["evening", "weekend"],
    city: "Gurugram",
    location: "DLF CyberHub & 32nd Avenue, Gurugram",
    vibeText: "Specialty brew explorer, honest startup talks, and cozy cafe vibes.",
    bgColor: "#ffc933",
    badge: "Top Rated"
  },
  {
    id: "p-jyoti",
    name: "Jyoti Nandal",
    emoji: "🥾",
    act: "trek",
    categoryLabel: "Trekking",
    rate: 500,
    rating: 5.0,
    times: ["morning", "weekend"],
    city: "Delhi",
    location: "Sunder Nursery & Lodhi Garden, Delhi",
    vibeText: "Heritage photography walks, sunrise botanical trails & morning chai.",
    bgColor: "#a8f0c6",
    badge: "Super Host"
  },
  {
    id: "p-falguni",
    name: "Falguni Baddi",
    emoji: "🎸",
    act: "music",
    categoryLabel: "Jam session",
    rate: 450,
    rating: 4.8,
    times: ["evening", "weekend"],
    city: "Delhi",
    location: "Khan Market & Connaught Place (CP), Delhi",
    vibeText: "Acoustic jamming, indie playlist sharing & creative conversations.",
    bgColor: "#ff6b4a",
    badge: "Musician"
  },
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

const ROTATING_WORDS = [
  "badminton rallies", 
  "specialty coffee", 
  "Catan & board games", 
  "Sunder Nursery walks", 
  "acoustic jamming", 
  "5K morning runs"
];

const MARQUEE_ITEMS = [
  "First 3 Hangouts 100% Free",
  "Sector 29 Badminton Rallies",
  "DLF CyberHub Pour-Over Chats",
  "Sunder Nursery Sunrise Walks",
  "32nd Avenue Board Game Nights",
  "Siri Fort Badminton Doubles",
  "100% Govt ID Verified Humans",
  "Akele kyu? Happy Hangouts Hai na!!",
  "Strictly Public Safe Meetups",
  "Zero Awkwardness Guarantee"
];

const CATEGORIES = [
  { id: "all", label: "All Vibes" },
  { id: "badminton", label: "Badminton" },
  { id: "cafe", label: "Café Chat" },
  { id: "trek", label: "Heritage Walks" },
  { id: "language", label: "Language" },
  { id: "games", label: "Board Games" },
  { id: "music", label: "Music & Jam" },
  { id: "run", label: "Running" }
];

export const FORM_INTERESTS_OPTIONS = [
  { id: "badminton", label: "Badminton & Rackets", desc: "Doubles, rallies & court games" },
  { id: "cafe", label: "Café Crawl & Chai", desc: "Specialty coffee, books & talks" },
  { id: "trek", label: "Sunrise Treks & Trails", desc: "Aravalli trails & nature walks" },
  { id: "tech", label: "Startup & Tech Co-working", desc: "Product brainstorming, AI & code" },
  { id: "language", label: "Language Practice", desc: "French, English, German, Spanish" },
  { id: "chess", label: "Chess & Board Games", desc: "Blitz, strategy, Catan & Ludo" },
  { id: "music", label: "Acoustic Music & Jam", desc: "Guitar, vocals & open mics" },
  { id: "running", label: "Running & 5K Fitness", desc: "Early morning pacing & trails" },
  { id: "photo", label: "Street Photowalks", desc: "Candid portraits & heritage trails" },
  { id: "food", label: "Foodie Walks & Dining", desc: "Street food, fine dining & brunch" }
];

export const QUICK_HUBS = {
  Gurugram: [
    "DLF CyberHub",
    "Golf Course Road (Horizon)",
    "32nd Avenue (Milestone)",
    "Sector 29 Entertainment Hub",
    "DLF Phase 4 (Galleria)",
    "Aravalli Trails"
  ],
  Delhi: [
    "Connaught Place (CP)",
    "Khan Market (Blue Tokai)",
    "Sunder Nursery & Lodhi",
    "Hauz Khas Village",
    "Siri Fort Complex",
    "Saket / South Delhi"
  ]
};

export const TIME_SLOT_OPTIONS = [
  { id: "weekday_eve", label: "Weekday Evenings (6:00 PM – 9:30 PM)", time: "6:00 PM – 9:30 PM", icon: "", tag: "Post-Work Chai & Rallies" },
  { id: "weekend_morn", label: "Weekend Mornings (8:30 AM – 1:00 PM)", time: "8:30 AM – 1:00 PM", icon: "", tag: "Sunrise Treks & Coffee" },
  { id: "weekend_aft", label: "Weekend Afternoons (1:30 PM – 5:30 PM)", time: "1:30 PM – 5:30 PM", icon: "", tag: "Badminton & Board Games" },
  { id: "weekend_night", label: "Weekend Nights (6:00 PM – 10:30 PM)", time: "6:00 PM – 10:30 PM", icon: "", tag: "Music Jams & Dining" },
  { id: "flexible", label: "Flexible / Spontaneous on coordination", time: "On-demand", icon: "", tag: "Anytime" }
];

// Floating Scroll Spy Sections
const SECTIONS = [
  { id: "top", label: "01", name: "Welcome" },
  { id: "match", label: "02", name: "Partners" },
  { id: "how", label: "03", name: "3 Steps" },
  { id: "videos", label: "04", name: "Story Studio" },
  { id: "radar", label: "05", name: "Live Radar" },
  { id: "safe", label: "06", name: "Escrow Safe" },
  { id: "earn", label: "07", name: "Calculator" },
  { id: "join", label: "08", name: "Hangout Pass" }
];

// Animated Number Counter on Scroll
function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(ease * value);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{isInView ? displayValue.toLocaleString("en-IN") : value.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

export default function App() {
  // Sound system state
  const [isMuted, setIsMuted] = useState(false);

  // Rotating hero verb
  const [wordIndex, setWordIndex] = useState(0);

  // Hero sticker parallax offset
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Scroll Progress and Scroll-Linked animations
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 25, restDelta: 0.001 });
  const [scrollProgressPercent, setScrollProgressPercent] = useState(0);
  const [activeSection, setActiveSection] = useState("top");
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Parallax transforms for hero stickers
  const stickerY1 = useTransform(scrollY, [0, 450], [0, -65]);
  const stickerY2 = useTransform(scrollY, [0, 450], [0, 50]);
  const stickerY3 = useTransform(scrollY, [0, 450], [0, -40]);
  const stickerY4 = useTransform(scrollY, [0, 450], [0, 45]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.96]);

  // Filters for "What's your vibe?" directory
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState<"all" | "Gurugram" | "Delhi">("all");
  const [budgetLimit, setBudgetLimit] = useState(600);
  const [timeFilter, setTimeFilter] = useState<"any" | "morning" | "evening" | "weekend">("any");
  const [minRating, setMinRating] = useState(0);

  // Earnings Calculator State
  const [calcHours, setCalcHours] = useState(8);
  const [calcRate, setCalcRate] = useState(400);

  // Waitlist form state (both WhatsApp and Email required)
  const [waitlistRole, setWaitlistRole] = useState<"seeker" | "partner">("seeker");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistWhatsapp, setWaitlistWhatsapp] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistCity, setWaitlistCity] = useState<"Gurugram" | "Delhi">("Gurugram");
  const [waitlistLocation, setWaitlistLocation] = useState("DLF CyberHub");
  const [waitlistTime, setWaitlistTime] = useState("Weekday Evenings (6:00 PM – 9:30 PM)");
  const [waitlistInterests, setWaitlistInterests] = useState<string[]>([
    "🏸 Badminton & Rackets",
    "☕ Café Crawl & Chai"
  ]);
  const [customGoal, setCustomGoal] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<string | null>(null);

  // Booking Modal State
  const [bookingCompanion, setBookingCompanion] = useState<CompanionProfile | null>(null);
  const [bookingDate, setBookingDate] = useState("Tomorrow");
  const [bookingTime, setBookingTime] = useState("Evening (6:00 PM)");
  const [bookingLocation, setBookingLocation] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

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

  // Scroll listener for progress percentage, back to top visibility, and active section
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setScrollProgressPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setShowBackToTop(latest > 350);

      // Simple intersection check for current section
      const sectionElements = SECTIONS.map(s => ({
        id: s.id,
        el: document.getElementById(s.id)
      })).filter(s => s.el !== null);

      const scrollPosition = latest + 240;
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el && item.el.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          break;
        }
      }
    });
  }, [scrollY]);

  // Parallax on mouse move inside Hero
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    setParallax({ x, y });
  };

  // Falling celebratory emojis shower
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

  // Calculate live vibe meter (Profile Power)
  const calculateVibeScore = () => {
    let score = 0;
    if (waitlistName.trim().length > 1) score += 20;
    if (waitlistWhatsapp.replace(/\D/g, '').length >= 10) score += 25;
    if (waitlistEmail.includes("@") && waitlistEmail.includes(".")) score += 25;
    if (waitlistLocation.trim().length > 2) score += 15;
    if (waitlistInterests.length > 0) score += 15;
    return Math.min(100, score);
  };

  // Toggle interest item
  const toggleWaitlistInterest = (label: string) => {
    audio.playClick();
    setWaitlistInterests((prev) => 
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  // Waitlist submission handler (Both WhatsApp & Email strictly required)
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!waitlistName.trim()) {
      audio.playToggle();
      setWaitlistStatus("⚠️ Please enter your full name.");
      return;
    }

    const cleanPhone = waitlistWhatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      audio.playToggle();
      setWaitlistStatus("⚠️ WhatsApp number is required! Please provide a valid 10-digit number.");
      return;
    }

    if (!waitlistEmail.trim() || !waitlistEmail.includes("@") || !waitlistEmail.includes(".")) {
      audio.playToggle();
      setWaitlistStatus("⚠️ Email address is required! Please provide a valid email (e.g. name@gmail.com).");
      return;
    }

    audio.playSuccess();
    const finalInterests = waitlistInterests.length > 0 
      ? waitlistInterests.join(", ") + (customGoal.trim() ? ` · Goal: ${customGoal.trim()}` : "")
      : customGoal.trim() || "General Activities & Hangouts";

    triggerBoom(`You're in, ${waitlistName}! Your Hangout Pass has been created. 🎉`);

    try {
      const waitlistRecord = {
        role: waitlistRole,
        name: waitlistName,
        whatsapp: waitlistWhatsapp,
        email: waitlistEmail,
        city: waitlistCity,
        location: waitlistLocation,
        preferredTime: waitlistTime,
        interests: finalInterests,
        submittedAt: new Date().toISOString()
      };
      
      const existing = JSON.parse(localStorage.getItem("hh_waitlist") || "[]");
      existing.push(waitlistRecord);
      localStorage.setItem("hh_waitlist", JSON.stringify(existing));

      // Also send to Google Sheets bridge
      await submitToGoogleSheets({
        name: waitlistName,
        email: waitlistEmail,
        phone: waitlistWhatsapp,
        city: waitlistCity,
        location_area: waitlistLocation,
        free_time: waitlistTime,
        interests: finalInterests,
        join_as: waitlistRole,
        form_type: waitlistRole === "partner" ? "Become a Hangout Partner" : "Become a Hangout Seeker",
        timestamp: new Date().toISOString()
      });

      // Track Google Analytics Lead Submission Conversion Event
      analytics.trackLeadSubmit(waitlistRole, waitlistCity, true);
    } catch (err) {
      // safe fallback
    }

    setWaitlistStatus(`🎉 Success! Early access pass confirmed for ${waitlistName}. Coordinator will message on WhatsApp +91 ${cleanPhone.slice(-10)} and email ${waitlistEmail}.`);
    setWaitlistName("");
    setWaitlistWhatsapp("");
    setWaitlistEmail("");
    setCustomGoal("");
  };

  // Open booking modal
  const handleOpenBooking = (companion: CompanionProfile) => {
    audio.playClick();
    setBookingCompanion(companion);
    setBookingLocation(companion.location);
    setBookingSuccess(false);
    setIsDispatching(false);
    // Track Google Analytics companion inspection / booking initiation
    analytics.trackBookingClick(companion.name, companion.location, companion.rate);
  };

  // Confirm booking & trigger live 5-minute Uber/Ola-style dispatch
  const handleConfirmBooking = () => {
    if (!bookingCompanion) return;
    audio.playClick();
    audio.playSuccess();
    setIsDispatching(true);

    // Track Google Analytics booking conversion
    analytics.trackBookingClick(bookingCompanion.name, bookingLocation, 0);
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

  const scrollToSection = (id: string) => {
    audio.playPageTransition();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-[#3DAAFC]/30 selection:text-[#011C92] pb-16 md:pb-0 relative bg-[#F3F7FF] text-[#0B1230]">
      
      {/* 0. GLOBAL SCROLL PROGRESS INDICATOR (BRAND PALETTE) */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-1.5 bg-[#011C92]/30">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#0A2EB8] via-[#3DAAFC] to-[#FFC83D] shadow-[0_0_10px_rgba(61,170,252,0.6)] origin-left"
          style={{ scaleX }}
        />
      </div>

      {/* 0.1 DESKTOP FLOATING VERTICAL SCROLL-SPY DOCK */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2.5 bg-white/95 backdrop-blur-md p-2 rounded-2xl border-2 border-[#0A2EB8]/20 shadow-[0_8px_24px_rgba(10,46,184,0.12)]">
        {SECTIONS.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`group relative flex items-center justify-center w-8 h-8 rounded-xl font-body font-bold text-xs transition-all cursor-pointer ${
                isActive 
                  ? "bg-[#FFC83D] text-[#0B1230] shadow-sm scale-110" 
                  : "bg-transparent text-[#0B1230]/70 hover:bg-[#F3F7FF] hover:text-[#0A2EB8]"
              }`}
              title={s.name}
            >
              <span>{s.label}</span>
              {/* Tooltip on Hover */}
              <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#011C92] text-white text-[11px] font-semibold tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                {s.name}
              </span>
            </button>
          );
        })}
        {/* Live Scroll Percentage Pill */}
        <div className="pt-2 border-t border-[#0A2EB8]/15 text-center font-bold text-[10px] text-[#0A2EB8]">
          {scrollProgressPercent}%
        </div>
      </div>

      {/* 0.2 FLOATING "BACK TO TOP" BUTTON (SCROLL-TRIGGERED) */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ scale: 1.08, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              audio.playPageTransition();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="fixed bottom-20 md:bottom-6 right-5 z-40 p-3 rounded-full bg-[#FFC83D] text-[#0B1230] shadow-lg hover:bg-[#ffbe26] transition-all cursor-pointer flex items-center justify-center border border-[#0B1230]/10"
            title="Scroll back to top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 0.3 LAUNCH PRIVILEGE ANNOUNCEMENT BANNER (Deep Midnight & Sunshine) */}
      <div className="bg-[#011C92] text-white px-4 py-2.5 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2 relative z-40 border-b border-white/10">
        <span className="font-semibold text-[#FFC83D]">Launch Trust Initiative:</span>
        <span>Your first 3 hangouts are <strong className="font-bold underline decoration-[#FFC83D]">100% FREE</strong> to build mutual trust & 5-star reviews on both sides.</span>
        <a 
          href="#match" 
          onClick={() => audio.playClick()} 
          className="hidden sm:inline-flex items-center gap-1 font-semibold text-[#3DAAFC] hover:text-white ml-2 underline"
        >
          Explore Partners →
        </a>
      </div>

      {/* 1. TOP NAVBAR (Light, airy Cloud & White with Hangout Blue branding) */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0A2EB8]/10 transition-colors text-[#0B1230]">
        <div className="wrap flex items-center justify-between h-18">
          
          {/* Logo with official image emblem & Roman brand wordmark */}
          <a 
            href="#top" 
            onClick={() => audio.playClick()}
            className="flex items-center gap-3 no-underline group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#0A2EB8]/20 shadow-sm shrink-0 bg-white">
              <img 
                src="/assets/aistudio/Happy_Hangouts_Logo_1d102f6e.jpg" 
                alt="Happy Hangouts Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif text-[22px] tracking-tight text-[#0A2EB8] leading-none font-bold">
                Happy Hangouts
              </span>
              <span className="text-[11px] font-medium text-[#0B1230]/70 mt-1 tracking-tight flex items-center gap-1">
                <span>Akele kyu?</span>
                <span className="text-[#0A2EB8] font-bold">Happy Hangouts Hai na!!</span>
              </span>
            </div>
          </a>

          {/* Nav links and actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a 
              href="#match" 
              onClick={() => audio.playClick()}
              className="hidden md:inline-block text-sm font-semibold text-[#0B1230]/80 hover:text-[#0A2EB8] transition-colors"
            >
              Partners
            </a>
            <a 
              href="#experiences" 
              onClick={() => audio.playClick()}
              className="hidden md:inline-block text-sm font-semibold text-[#0B1230]/80 hover:text-[#0A2EB8] transition-colors"
            >
              Experiences
            </a>
            <a 
              href="#videos" 
              onClick={() => audio.playClick()}
              className="hidden md:inline-block text-sm font-semibold text-[#0B1230]/80 hover:text-[#0A2EB8] transition-colors"
            >
              Story Studio
            </a>
            <a 
              href="#radar" 
              onClick={() => audio.playClick()}
              className="hidden lg:inline-block text-sm font-semibold text-[#0B1230]/80 hover:text-[#0A2EB8] transition-colors"
            >
              Live Radar
            </a>
            <a 
              href="#safe" 
              onClick={() => audio.playClick()}
              className="hidden lg:inline-block text-sm font-semibold text-[#0B1230]/80 hover:text-[#0A2EB8] transition-colors"
            >
              Safety
            </a>

            {/* Audio Toggle Button with subtle styling */}
            <button
              type="button"
              onClick={handleToggleSound}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              className={`p-2 rounded-full border transition-all ${
                isMuted ? "bg-[#0A2EB8]/5 text-[#0B1230]/60 border-[#0A2EB8]/15 hover:bg-[#0A2EB8]/10" : "bg-[#FFC83D] text-[#0B1230] border-[#FFC83D] shadow-sm"
              }`}
              title={isMuted ? "Click to enable sound" : "Sound enabled"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Join Waitlist / Find Partner CTA (Sunshine #FFC83D) */}
            <a 
              href="#match" 
              onClick={() => audio.playClick()}
              className="bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-sm py-2 px-5 rounded-full shadow-[0_3px_10px_rgba(255,200,61,0.4)] transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Find a partner
            </a>
          </div>

        </div>
      </nav>

      {/* 2. EXPANSIVE BRAND HERO SECTION (Light Cloud & White surface, Hangout Blue & Ink typography) */}
      <header 
        id="top" 
        className="relative py-14 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-[#F3F7FF] via-white to-[#F3F7FF] text-[#0B1230] border-b border-[#0A2EB8]/10"
      >
        <div className="wrap">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Brand Mock Structure */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Location & Launch Kicker */}
              <div className="flex items-center gap-2.5 flex-wrap mb-5">
                <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-[#0A2EB8]">
                  Gurugram & Delhi NCR
                </span>
                <span className="text-[#0B1230]/30">·</span>
                <span className="text-xs font-bold text-[#0B1230]/80">
                  Verified Hangout Partners
                </span>
                <span className="text-[#0B1230]/30">·</span>
                <span className="bg-[#FFC83D] text-[#0B1230] text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-sm">
                  1st 3 Free
                </span>
              </div>

              {/* High Contrast Editorial Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="font-serif text-[44px] sm:text-[62px] md:text-[74px] lg:text-[82px] text-[#0B1230] font-normal tracking-tight leading-[1.08] max-w-2xl"
              >
                You bring the <br />
                <CircledHighlight circleColor="#3DAAFC">
                  <span className="text-[#0A2EB8] font-bold">{ROTATING_WORDS[wordIndex]}.</span>
                </CircledHighlight> <br />
                We bring the people.
              </motion.h1>

              {/* Exact Brand Subtitle with Rich Contrast */}
              <motion.p 
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="text-base sm:text-lg lg:text-xl text-[#0B1230]/80 font-normal leading-relaxed mt-6 mb-8 max-w-xl"
              >
                Tired of friends cancelling on Sunday morning badminton? Want to explore cafes without sitting alone? 
                Connect with verified partners across Gurgaon & Delhi. 
                <strong className="text-[#0A2EB8] font-bold"> Your first 3 hangouts are 100% free (₹0 fee)</strong> so you can build trust first.
              </motion.p>

              {/* Action Buttons & Verified Partner Card */}
              <motion.div 
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap"
              >
                {/* Sunshine Primary Button */}
                <a 
                  href="#match" 
                  onClick={() => audio.playClick()}
                  className="bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-base py-3.5 px-8 rounded-full shadow-[0_6px_20px_rgba(255,200,61,0.45)] hover:shadow-[0_8px_24px_rgba(255,200,61,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2 cursor-pointer select-none"
                >
                  <span>Find a partner →</span>
                </a>

                {/* Secondary Outlined Button */}
                <a 
                  href="#join" 
                  onClick={() => {
                    audio.playClick();
                    setWaitlistRole("partner");
                  }}
                  className="border-2 border-[#0A2EB8] bg-white hover:bg-[#0A2EB8] text-[#0A2EB8] hover:text-white font-bold text-base py-3.5 px-8 rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2 cursor-pointer select-none"
                >
                  <span>Become a partner</span>
                </a>
              </motion.div>

              {/* Verified Partner Badge (Light Surface Badge) */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-6 inline-flex items-center gap-2.5 bg-white text-[#0B1230] px-4 py-2.5 rounded-xl shadow-md border border-[#0A2EB8]/15"
              >
                <span className="w-3 h-3 rounded-full bg-[#19C37D] shrink-0 shadow-sm"></span>
                <span className="font-bold text-xs tracking-tight text-[#0B1230]">Verified partner</span>
                <span className="text-xs text-[#0B1230]/65 ml-2 font-medium">Govt ID & In-Person Screened</span>
              </motion.div>

            </div>

            {/* Right Column: Authentic Lifestyle Hangout Photography (Not a Gaming Site) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#0A2EB8]/15 shadow-2xl bg-white aspect-[4/3] sm:aspect-[16/12]">
                <img 
                  src="/src/assets/images/hero_hangout_cafe_1794391402838.jpg" 
                  alt="Friends enjoying coffee and honest conversation at Hazel and Oak Cafe in Delhi NCR"
                  className="w-full h-full object-cover"
                />
                
                {/* Subtle scrim & photo caption badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1230]/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif text-sm font-semibold">Hazel & Oak Café · Khan Market</span>
                    <span className="bg-[#19C37D] text-[#0B1230] px-2 py-0.5 rounded text-[11px] font-bold">Verified Hangout Spot</span>
                  </div>
                  <p className="text-[11px] text-white/95 mt-1 font-medium">
                    Companions sharing coffee, book recommendations, and genuine conversation.
                  </p>
                </div>
              </div>

              {/* Quiet editorial trust marker */}
              <div className="mt-3 flex items-center justify-between text-xs text-[#0B1230]/75 px-1 font-semibold">
                <span>📍 Verified public venues across NCR</span>
                <span>⭐ 4.9 Average community score</span>
              </div>
            </motion.div>

          </div>

          {/* Key Trust Counters Strip (UNOBSTRUCTED: 3,400+ NCR Hangouts Completed is 100% visible) */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-14 pt-9 border-t border-[#0A2EB8]/15 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-left"
          >
            <div className="pr-4">
              <div className="font-serif text-3xl sm:text-4xl text-[#0A2EB8] font-bold">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#0B1230]/75 mt-1">Government ID Verified</div>
            </div>

            <div className="pr-4">
              <div className="font-serif text-3xl sm:text-4xl text-[#0A2EB8] font-bold">
                <AnimatedCounter value={0} prefix="₹" suffix=" Risk" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#0B1230]/75 mt-1">Escrow UPI Protected</div>
            </div>

            <div className="pr-4">
              <div className="font-serif text-3xl sm:text-4xl text-[#0A2EB8] font-bold">
                4.9 / 5.0
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#0B1230]/75 mt-1">Community Rating</div>
            </div>

            <div>
              <div className="font-serif text-3xl sm:text-4xl text-[#0A2EB8] font-bold">
                <AnimatedCounter value={3400} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#0B1230]/75 mt-1">NCR Hangouts Completed</div>
            </div>
          </motion.div>

        </div>
      </header>

      {/* 3. CONTINUOUS RUNNING MARQUEE BANNER (Hangout Blue & Sky) */}
      <div className="mq bg-[#0A2EB8] text-white border-y border-white/15" aria-hidden="true">
        <div className="mq-track">
          {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, idx) => (
            <span key={idx} className="mq-item">
              <span>{item}</span>
              <span className="text-[#3DAAFC]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3.5. AUTHENTIC LIFESTYLE HANGOUT GALLERY SHOWCASE (Café, Badminton, Heritage Parks, Board Games) */}
      <div id="experiences">
        <LifestyleHangoutGallery onExploreVibes={() => scrollToSection("match")} />
      </div>

      {/* 4. "WHAT'S YOUR VIBE?" INTERACTIVE DIRECTORY WITH SCROLL REVEALS */}
      <section id="match" className="py-16 sm:py-24 bg-[#F3F7FF]">
        <div className="wrap">
          
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start mb-10"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#0A2EB8] block mb-2">
              Browse Delhi NCR
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1230] font-normal tracking-tight">
              What’s your <CircledHighlight circleColor="#3DAAFC">vibe</CircledHighlight>?
            </h2>
            <p className="text-[#0B1230]/75 text-base sm:text-lg max-w-2xl mt-3 font-normal">
              Select an activity, pick your city, and find verified partners ready for hangouts in Gurugram and Delhi.
            </p>
          </motion.div>

          {/* Category Chips with Clean Typography (No Emoji Clutter) */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex gap-2 flex-wrap mb-4"
          >
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
          </motion.div>

          {/* City Selection Chips (Clean Text Alignment) */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="text-xs font-semibold text-[#0B1230]/60 uppercase tracking-wider mr-1">
              City:
            </span>
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setSelectedCity("all");
              }}
              className={`chip text-xs py-1.5 px-3.5 ${selectedCity === "all" ? "active" : ""}`}
            >
              Both Cities
            </button>
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setSelectedCity("Gurugram");
              }}
              className={`chip text-xs py-1.5 px-3.5 ${selectedCity === "Gurugram" ? "active" : ""}`}
            >
              Gurugram
            </button>
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setSelectedCity("Delhi");
              }}
              className={`chip text-xs py-1.5 px-3.5 ${selectedCity === "Delhi" ? "active" : ""}`}
            >
              Delhi
            </button>
          </motion.div>

          {/* Filter Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="ctl"
          >
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
              <span>Min Rating</span>
              <select 
                value={minRating}
                onChange={(e) => {
                  audio.playClick();
                  setMinRating(Number(e.target.value));
                }}
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
              </select>
            </label>
          </motion.div>

          {/* Companion Cards Grid with Responsive Symmetrical Expansion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCompanions.length > 0 ? (
              filteredCompanions.map((comp, idx) => (
                <motion.div 
                  key={comp.id} 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (idx % 4) * 0.06 }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  className="pc"
                >
                  {/* Clean Monogram Header & Category Tag */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-full border border-[#0A2EB8]/20 bg-[#F3F7FF] flex items-center justify-center font-serif font-semibold text-base text-[#0A2EB8]">
                      {comp.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-[11px] font-semibold text-[#0A2EB8] bg-[#F3F7FF] border border-[#0A2EB8]/25 px-2.5 py-0.5 rounded-full">
                      {comp.categoryLabel}
                    </span>
                  </div>

                  {/* Name & Location */}
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#0B1230] leading-snug">{comp.name}</h3>
                    <p className="text-xs text-[#0B1230]/65 mt-1 font-normal">
                      {comp.location} · {comp.times.join(", ")}
                    </p>
                  </div>

                  {/* Vibe Description */}
                  <p className="text-sm text-[#0B1230]/80 font-normal leading-relaxed line-clamp-2">
                    {comp.vibeText}
                  </p>

                  {/* Price & Rating (Highlighting 1st 3 Hangouts Free) */}
                  <div className="pt-3 border-t border-[#F3F7FF]">
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="line-through text-[#0B1230]/40">₹{comp.rate}/hr</span>
                        <span className="font-bold text-[#19C37D] bg-[#19C37D]/10 px-1.5 py-0.5 rounded">
                          ₹0 FREE
                        </span>
                      </div>
                      <span className="font-medium text-[#0B1230]">
                        ⭐ {comp.rating}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#0B1230]/60">
                      <span>Launch Privilege</span>
                      <span className="text-[#19C37D] font-bold">1st 3 Free</span>
                    </div>
                  </div>

                  {/* Book / Hangout CTA (Sunshine #FFC83D) */}
                  <button 
                    type="button"
                    onClick={() => handleOpenBooking(comp)}
                    className="w-full py-3 px-4 text-xs sm:text-sm font-extrabold mt-1 cursor-pointer bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] rounded-full shadow-[0_3px_10px_rgba(255,200,61,0.35)] hover:shadow-[0_5px_15px_rgba(255,200,61,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ Request Free Hangout</span>
                    <span className="text-[10px] bg-[#0B1230]/10 px-2 py-0.5 rounded-full font-bold">1st 3 Free</span>
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center p-12 border border-dashed border-[#0A2EB8]/25 rounded-2xl bg-white">
                <p className="font-serif text-xl text-[#0B1230] font-medium">
                  No match found for this filter in Gurugram or Delhi.
                </p>
                <p className="text-[#0B1230]/60 text-sm mt-2 max-w-md mx-auto font-normal">
                  Try adjusting the budget slider up to ₹1,000 or selecting "Anytime" — new verified partners join every week.
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
                  className="btn outline text-xs mt-5 py-2 px-5"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 5. "HANGOUT IN 3 STEPS" (SCROLL ANIMATED HOW IT WORKS TIMELINE) */}
      <section id="how" className="py-20 sm:py-28 bg-white border-y border-[#0A2EB8]/10">
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl text-left mb-12 sm:mb-16"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#0A2EB8] block mb-2">
              Simple & Safe
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1230] font-normal tracking-tight">
              Hangout in 3 <CircledHighlight circleColor="#3DAAFC">simple</CircledHighlight> steps
            </h2>
            <p className="text-[#0B1230]/75 text-base sm:text-lg mt-3 font-normal">
              Designed from the ground up for safe, transparent public meetups across Delhi and Gurugram.
            </p>
          </motion.div>

          <div className="steps grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -3 }}
              className="st relative"
            >
              <div className="font-serif text-4xl text-[#0A2EB8] font-bold mb-3">01</div>
              <h3 className="font-serif text-2xl text-[#0B1230] font-medium mb-2">Pick your activity</h3>
              <p className="text-[#0B1230]/75 text-sm leading-relaxed font-normal">
                Choose badminton, a heritage garden walk, specialty coffee, or casual board games. Select your preferred time and public spot.
              </p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -3 }}
              className="st relative"
            >
              <div className="font-serif text-4xl text-[#011C92] font-bold mb-3">02</div>
              <h3 className="font-serif text-2xl text-[#0B1230] font-medium mb-2">Connect with a partner</h3>
              <p className="text-[#0B1230]/75 text-sm leading-relaxed font-normal">
                Review verified profiles and authentic community ratings. Send a request with a live 5-minute action window for quick confirmation.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -3 }}
              className="st relative"
            >
              <div className="font-serif text-4xl text-[#0A2EB8] font-bold mb-3">03</div>
              <h3 className="font-serif text-2xl text-[#0B1230] font-medium mb-2 flex items-center justify-between">
                <span>Meet & Hangout</span>
                <span className="text-xs bg-[#19C37D]/15 text-[#19C37D] px-2.5 py-0.5 rounded-full font-sans font-bold">1st 3 Free</span>
              </h3>
              <p className="text-[#0B1230]/75 text-sm leading-relaxed font-normal">
                Meet in verified public places like CyberHub or Khan Market. Your first 3 hangouts are 100% free to build mutual trust and 5-star reviews.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5.5 ANIMATED CHARACTER STORY THEATRE */}
      <AnimatedCharacterStorySection 
        onOpenBookingClick={(companionName, location) => {
          if (companionName) {
            const found = COMPANIONS.find(c => 
              c.name.toLowerCase().includes(companionName.toLowerCase()) || 
              companionName.toLowerCase().includes(c.name.toLowerCase())
            );
            if (found) {
              handleOpenBooking(found);
              return;
            }
          }
          if (location) {
            setBookingLocation(location);
          }
          scrollToSection("match");
        }}
        onApplyHostClick={() => {
          setWaitlistRole("partner");
          scrollToSection("join");
        }}
        onExploreSafetyClick={() => {
          scrollToSection("safe");
        }}
      />

      {/* 6. LIVE HANGOUTS RADAR (DYNAMIC REAL-TIME ACTIVITY) */}
      <section id="radar" className="py-16 sm:py-24 bg-[#F3F7FF] border-b-2 border-[#0A2EB8]/15">
        <div className="wrap">
          <LiveHangoutsRadar 
            onOpenBookingClick={(companionName, location) => {
              if (companionName) {
                const found = COMPANIONS.find(c => 
                  c.name.toLowerCase().includes(companionName.toLowerCase()) || 
                  companionName.toLowerCase().includes(c.name.toLowerCase())
                );
                if (found) {
                  handleOpenBooking(found);
                  return;
                }
              }
              if (location) {
                setBookingLocation(location);
              }
              scrollToSection("match");
            }}
            triggerBoom={triggerBoom}
          />
        </div>
      </section>

      {/* 7. "TRUST & SAFETY FIRST" (Deep Midnight #011C92) */}
      <section id="safe" className="py-20 sm:py-28 bg-[#011C92] text-white border-y border-white/10">
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl text-left mb-14"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#3DAAFC] block mb-2">
              Safety First
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal tracking-tight">
              Trust and safety in every <CircledHighlight circleColor="#3DAAFC"><span className="text-[#3DAAFC]">hangout</span></CircledHighlight>
            </h2>
            <p className="text-white/80 text-base sm:text-lg mt-3 font-normal leading-relaxed">
              Every hangout is built around friendly companion meetups in verified public places. Our 4-pillar safety framework:
            </p>
          </motion.div>

          <div className="sg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -3 }}
              className="bg-white/10 backdrop-blur-xs p-6 sm:p-7 rounded-2xl border border-white/15"
            >
              <div className="font-serif text-2xl font-semibold text-[#FFC83D] mb-2">ID Verified</div>
              <p className="text-white/85 text-sm leading-relaxed font-normal">
                Every partner is verified with Government ID (Aadhaar/PAN) and biometric verification before attending or hosting.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -3 }}
              className="bg-white/10 backdrop-blur-xs p-6 sm:p-7 rounded-2xl border border-white/15"
            >
              <div className="font-serif text-2xl font-semibold text-[#FFC83D] mb-2">Public Only</div>
              <p className="text-white/85 text-sm leading-relaxed font-normal">
                Strictly public meeting places only — verified cafes (CyberHub, CP, Khan Market) and sports arenas (Siri Fort Complex).
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -3 }}
              className="bg-white/10 backdrop-blur-xs p-6 sm:p-7 rounded-2xl border border-white/15"
            >
              <div className="font-serif text-2xl font-semibold text-[#FFC83D] mb-2">Live Support</div>
              <p className="text-white/85 text-sm leading-relaxed font-normal">
                Real-time 5-minute action window, session duration tracking, and instant coordinator check-in during your hangout.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -3 }}
              className="bg-white/10 backdrop-blur-xs p-6 sm:p-7 rounded-2xl border border-white/15"
            >
              <div className="font-serif text-2xl font-semibold text-[#FFC83D] mb-2">Two-Way Reviews</div>
              <p className="text-white/85 text-sm leading-relaxed font-normal">
                Mandatory two-way post-hangout ratings. Zero tolerance policy: bad actors and inappropriate behavior permanently banned.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. "EARN BY SHARING YOUR PASSIONS" (EARNINGS CALCULATOR) */}
      <section id="earn" className="py-20 sm:py-28 bg-[#F3F7FF] border-b border-[#0A2EB8]/10">
        <div className="wrap earn-container">
          
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#0A2EB8] block mb-2">
              For Partners
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1230] font-normal tracking-tight">
              Earn by sharing your <CircledHighlight circleColor="#3DAAFC">passions</CircledHighlight>
            </h2>
            <p className="text-[#0B1230]/75 text-base sm:text-lg mb-8 leading-relaxed mt-3 font-normal">
              Love badminton, morning walks, coffee conversations, or board games? Host hangouts on your own schedule across Delhi and Gurugram.
            </p>

            <div className="flex flex-col gap-5 bg-white p-6 sm:p-7 rounded-2xl border border-[#0A2EB8]/15 shadow-sm">
              {/* Hours slider */}
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-medium text-[#0B1230]">Hours per week:</span>
                  <span className="font-serif text-xl text-[#0A2EB8] font-bold">{calcHours} hrs</span>
                </div>
                <input 
                  type="range" 
                  min={2} 
                  max={30} 
                  value={calcHours}
                  className="w-full accent-[#0A2EB8]"
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCalcHours(val);
                    audio.playSlider((val - 2) / 28);
                  }}
                />
              </div>

              {/* Rate slider */}
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="font-medium text-[#0B1230]">Your rate per hour:</span>
                  <span className="font-serif text-xl text-[#0A2EB8] font-bold">₹{calcRate}</span>
                </div>
                <input 
                  type="range" 
                  min={200} 
                  max={1000} 
                  step={50} 
                  value={calcRate}
                  className="w-full accent-[#0A2EB8]"
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCalcRate(val);
                    audio.playSlider((val - 200) / 800);
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Big Earnings Result Card with Editorial Restraint */}
          <motion.div 
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="big-card bg-white border border-[#0A2EB8]/20 shadow-md p-8 rounded-3xl"
          >
            <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#0A2EB8] block">
              Estimated Monthly Take-Home
            </span>
            <b className="font-serif text-4xl sm:text-6xl text-[#0A2EB8] my-3 block font-bold">
              ₹{monthlyTakeHome.toLocaleString("en-IN")}
            </b>
            <p className="text-xs sm:text-sm text-[#0B1230]/70 font-normal leading-relaxed">
              Based on {calcHours} hrs/week at ₹{calcRate}/hr, after 20% platform hosting & escrow support.
            </p>

            {/* Host Trust Period Notice */}
            <div className="mt-5 p-4 bg-[#F3F7FF] rounded-xl border border-[#0A2EB8]/15 text-xs text-[#0B1230]/80 text-left">
              <strong className="text-[#0B1230] block mb-1">Founding Partner Trust Privilege:</strong>
              Your first 3 hangouts are held at ₹0 fee to build mutual comfort and acquire your initial 5-star community reviews. Standard hourly earnings apply seamlessly from session 4 onwards.
            </div>

            <a 
              href="#join"
              onClick={() => {
                audio.playClick();
                setWaitlistRole("partner");
              }}
              className="bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-bold mt-6 text-sm py-3 px-6 w-full rounded-full inline-block text-center shadow-md transition-transform hover:-translate-y-0.5"
            >
              Apply as a partner →
            </a>
          </motion.div>

        </div>
      </section>

      {/* 9. "BE FIRST IN LINE" (SCROLL ANIMATED FORM & STICKY LIVE TICKET PASS) */}
      <section id="join" className="join py-16 sm:py-24 bg-[#F3F7FF]">
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="tag" style={{ background: "#ffffff", color: "#0A2EB8", border: "1px solid #0A2EB8" }}>
              Gurugram & Delhi first
            </span>
            <h2 className="text-[34px] sm:text-[54px] font-extrabold tracking-tight mt-3 mb-2 text-[#011C92]">
              Be first in line
            </h2>
            <p className="text-[#0B1230]/80 text-lg font-medium mb-10 max-w-2xl">
              Create your custom Hangout Pass to receive priority access, founding partner badges, and launch perks in Gurugram & Delhi.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: THE INTERACTIVE APPLICATION FORM */}
            <motion.form 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              onSubmit={handleWaitlistSubmit} 
              className="lg:col-span-7 form-box max-w-none bg-white border border-[#0A2EB8]/20 rounded-3xl p-6 sm:p-8 shadow-md"
            >
              
              {/* Profile Power / Vibe Score Bar */}
              <div className="bg-[#F3F7FF] border border-[#0A2EB8]/20 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#011C92] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#3DAAFC]" />
                    Hangout Pass Readiness
                  </span>
                  <span className="font-extrabold text-[#0A2EB8]">
                    {calculateVibeScore()}% Complete
                  </span>
                </div>
                <div className="w-full h-3 bg-white border border-[#0A2EB8]/20 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0A2EB8] via-[#3DAAFC] to-[#FFC83D] rounded-full transition-all duration-300"
                    style={{ width: `${calculateVibeScore()}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#0B1230]/70 mt-1 font-medium">
                  {calculateVibeScore() === 100 
                    ? "✨ 100% Hangout Ready! Your verified pass is complete." 
                    : "Fill your name, required WhatsApp, email & interests to power up your pass."}
                </p>
              </div>

              {/* 1. Role Selection */}
              <div>
                <label className="block text-xs font-bold text-[#0B1230] mb-1.5">
                  1. How would you like to participate?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setWaitlistRole("seeker");
                    }}
                    className={`p-3 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                      waitlistRole === "seeker" 
                        ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-sm -translate-y-0.5" 
                        : "bg-white text-[#0B1230] border-[#0A2EB8]/30 hover:border-[#0A2EB8]"
                    }`}
                  >
                    🙋 I want to find partners
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setWaitlistRole("partner");
                    }}
                    className={`p-3 rounded-xl border text-center font-bold text-sm transition-all cursor-pointer ${
                      waitlistRole === "partner" 
                        ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-sm -translate-y-0.5" 
                        : "bg-white text-[#0B1230] border-[#0A2EB8]/30 hover:border-[#0A2EB8]"
                    }`}
                  >
                    💪 I want to earn as partner
                  </button>
                </div>
              </div>

              {/* 2. Full Name Input */}
              <div>
                <label className="block text-xs font-bold text-[#0B1230] mb-1 flex items-center justify-between">
                  <span>2. Your Full Name</span>
                  <span className="text-[10px] text-[#0A2EB8] font-bold uppercase tracking-wider">* Required</span>
                </label>
                <input 
                  type="text" 
                  value={waitlistName}
                  onChange={(e) => setWaitlistName(e.target.value)}
                  placeholder="e.g. Rahul Sharma" 
                  required 
                  className="w-full bg-[#F3F7FF] border border-[#0A2EB8]/20 rounded-xl p-3 font-medium text-sm text-[#0B1230] focus:outline-none focus:border-[#0A2EB8]"
                />
              </div>

              {/* 3. BOTH WhatsApp & Email Required Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp Number (Required) */}
                <div>
                  <label className="block text-xs font-bold text-[#0B1230] mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#19C37D]" />
                      WhatsApp Number
                    </span>
                    <span className="text-[10px] text-[#0A2EB8] font-bold uppercase tracking-wider">* Required</span>
                  </label>
                  
                  {/* Clean Country-Code Input Group */}
                  <div className="flex items-center rounded-xl overflow-hidden border border-[#0A2EB8]/25 bg-white shadow-xs focus-within:border-[#0A2EB8] transition-all">
                    <div className="bg-[#F3F7FF] border-r border-[#0A2EB8]/20 px-3.5 py-2.5 flex items-center gap-1.5 shrink-0 select-none">
                      <span className="text-base leading-none">🇮🇳</span>
                      <span className="text-xs font-bold text-[#0B1230] tracking-tight">+91</span>
                    </div>
                    <input 
                      type="tel" 
                      value={waitlistWhatsapp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d\s-]/g, '').slice(0, 13);
                        setWaitlistWhatsapp(val);
                      }}
                      placeholder="98765 43210" 
                      required 
                      className="clean-input w-full bg-white font-medium text-sm text-[#0B1230] px-3.5 py-2.5 focus:outline-none !border-0 !shadow-none !rounded-none placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-[10px] text-[#0B1230]/60 mt-1 font-medium">
                    For private verification and booking coordination.
                  </p>
                </div>

                {/* Email Address (Required) */}
                <div>
                  <label className="block text-xs font-bold text-[#0B1230] mb-1 flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-[#0A2EB8] font-bold uppercase tracking-wider">* Required</span>
                  </label>
                  <input 
                    type="email" 
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="name@gmail.com" 
                    required 
                    className="w-full bg-[#F3F7FF] border border-[#0A2EB8]/20 rounded-xl p-3 font-medium text-sm text-[#0B1230] focus:outline-none focus:border-[#0A2EB8]"
                  />
                  <p className="text-[10px] text-[#0B1230]/60 mt-1 font-medium">
                    For launch invitation and pass confirmation.
                  </p>
                </div>
              </div>

              {/* 4. City & Quick Hub Shortcuts */}
              <div className="bg-[#F3F7FF] border border-[#0A2EB8]/20 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#0B1230]">
                    4. City Focus & Meeting Hub
                  </label>
                  <span className="text-[10px] font-bold text-[#0A2EB8] uppercase tracking-wide">
                    Strictly Gurugram & Delhi
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setWaitlistCity("Gurugram");
                      setWaitlistLocation("DLF CyberHub");
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                      waitlistCity === "Gurugram" 
                        ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-sm" 
                        : "bg-white text-[#0B1230] border-[#0A2EB8]/20"
                    }`}
                  >
                    📍 Gurugram
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setWaitlistCity("Delhi");
                      setWaitlistLocation("Connaught Place (CP)");
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                      waitlistCity === "Delhi" 
                        ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-sm" 
                        : "bg-white text-[#0B1230] border-[#0A2EB8]/20"
                    }`}
                  >
                    📍 Delhi
                  </button>
                </div>

                {/* 1-Tap Quick Hub Shortcuts */}
                <div className="mb-2.5">
                  <span className="text-[11px] font-semibold text-[#0B1230]/70 block mb-1">
                    Tap a popular public hub in {waitlistCity}:
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {QUICK_HUBS[waitlistCity].map((hub, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          audio.playClick();
                          setWaitlistLocation(hub);
                        }}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          waitlistLocation === hub
                            ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                            : "bg-white text-[#0B1230] border-[#0A2EB8]/25 hover:border-[#0A2EB8]"
                        }`}
                      >
                        {hub}
                      </button>
                    ))}
                  </div>
                </div>

                <input 
                  type="text" 
                  value={waitlistLocation}
                  onChange={(e) => setWaitlistLocation(e.target.value)}
                  placeholder="Or enter your exact neighborhood..."
                  className="w-full text-xs bg-white border border-[#0A2EB8]/20 rounded-lg p-2.5 font-medium text-[#0B1230] focus:outline-none focus:border-[#0A2EB8]"
                />
              </div>

              {/* 5. What time are you free actually? */}
              <div>
                <label className="block text-xs font-bold text-[#0B1230] mb-1.5">
                  5. What time are you free actually?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TIME_SLOT_OPTIONS.map((slot) => {
                    const isSelected = waitlistTime === slot.label;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => {
                          audio.playClick();
                          setWaitlistTime(slot.label);
                        }}
                        className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-sm -translate-y-0.5"
                            : "bg-white text-[#0B1230] border-[#0A2EB8]/25 hover:border-[#0A2EB8]"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="flex items-center gap-1.5">
                            <span>{slot.icon}</span>
                            <span>{slot.time}</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#FFC83D]" />}
                        </div>
                        <span className={`text-[10px] font-medium block mt-0.5 ${isSelected ? "text-white/80" : "text-[#0B1230]/60"}`}>
                          {slot.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Interests / Hobbies / Goals Selection */}
              <div className="bg-[#F3F7FF] border border-[#0A2EB8]/20 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <label className="block text-xs font-bold text-[#0B1230]">
                    6. Interests & Goals ({waitlistRole === "partner" ? "What you want to host / teach" : "What you want a partner for"})
                  </label>
                  <span className="text-[11px] font-bold bg-[#FFC83D] text-[#0B1230] px-2.5 py-0.5 rounded-full">
                    {waitlistInterests.length} selected
                  </span>
                </div>
                <p className="text-[12px] text-[#0B1230]/70 mb-2.5 font-medium">
                  Tap the activities or sports you want to share with your hangout partner:
                </p>
                
                {/* Interactive Multi-Select Chips Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {FORM_INTERESTS_OPTIONS.map((item) => {
                    const isSelected = waitlistInterests.includes(item.label);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleWaitlistInterest(item.label)}
                        className={`text-left p-2.5 rounded-xl border transition-all text-xs font-medium flex flex-col justify-center cursor-pointer ${
                          isSelected 
                            ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-sm -translate-y-0.5" 
                            : "bg-white text-[#0B1230] border-[#0A2EB8]/20 hover:border-[#0A2EB8]"
                        }`}
                      >
                        <span className="font-bold flex items-center justify-between">
                          <span>{item.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 ml-1 shrink-0 text-[#FFC83D]" />}
                        </span>
                        <span className={`text-[10px] mt-0.5 ${isSelected ? "text-white/80" : "text-[#0B1230]/60"}`}>
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Specific Goal or Activity Input */}
                <div>
                  <label className="block text-[11px] font-bold text-[#0B1230] mb-1">
                    Specific goal or custom hangout wish (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="e.g. Find a squash partner for weekends, or speak French over chai"
                    className="w-full text-sm bg-white border border-[#0A2EB8]/20 rounded-lg p-2.5 font-medium text-[#0B1230] focus:outline-none focus:border-[#0A2EB8]"
                  />
                </div>
              </div>

              {/* Submit Button (Sunshine #FFC83D) */}
              <button 
                className="w-full py-4 text-base font-bold bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] rounded-full shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer mt-3" 
                type="submit"
              >
                Generate My Hangout Pass & Join 🎉
              </button>

              {/* Feedback status message */}
              {waitlistStatus && (
                <div className={`border rounded-xl p-3.5 font-semibold text-xs flex items-center gap-2.5 ${
                  waitlistStatus.startsWith("⚠️") 
                    ? "bg-amber-50 border-amber-500 text-amber-900" 
                    : "bg-[#19C37D]/10 border-[#19C37D] text-[#0B1230]"
                }`}>
                  {waitlistStatus.startsWith("⚠️") ? (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-[#19C37D] shrink-0" />
                  )}
                  <span>{waitlistStatus}</span>
                </div>
              )}
            </motion.form>

            {/* RIGHT COLUMN: STICKY LIVE INTERACTIVE "HANGOUT PASS" DIGITAL ID CARD */}
            <div className="lg:col-span-5 w-full sticky top-24">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="bg-white border-2 border-[#0A2EB8]/20 rounded-3xl p-6 shadow-xl relative overflow-hidden"
              >
                
                {/* Pass Header Band */}
                <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#0A2EB8]/25">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#19C37D] animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#011C92]">
                      Live Pass Preview
                    </span>
                  </div>
                  <span className="text-[11px] font-bold bg-[#FFC83D] text-[#0B1230] px-2.5 py-0.5 rounded-full">
                    #HH-2026 NCR VIP
                  </span>
                </div>

                {/* Ticket Body */}
                <div className="pt-5 space-y-4">
                  {/* Name & Role Avatar */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#0A2EB8] text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-sm">
                      {waitlistRole === "partner" ? "💪" : "🙋"}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A2EB8]">
                        {waitlistRole === "partner" ? "Founding Hangout Partner" : "Founding Hangout Seeker"}
                      </span>
                      <h4 className="text-xl font-bold text-[#0B1230] leading-tight">
                        {waitlistName.trim() || "Your Name Here"}
                      </h4>
                      <p className="text-xs font-medium text-[#0A2EB8] mt-0.5">
                        {waitlistWhatsapp ? `+91 ${waitlistWhatsapp}` : "WhatsApp Pending"} · {waitlistEmail || "Email Pending"}
                      </p>
                    </div>
                  </div>

                  {/* Meeting Hub & City */}
                  <div className="p-3 bg-[#F3F7FF] rounded-xl border border-[#0A2EB8]/15">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#0B1230]/60">
                      Focus Location
                    </div>
                    <div className="text-sm font-bold text-[#0B1230] flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-4 h-4 text-[#0A2EB8]" />
                      <span>{waitlistLocation} ({waitlistCity})</span>
                    </div>
                  </div>

                  {/* Time Availability */}
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Free Schedule
                    </div>
                    <div className="text-xs font-bold text-[#0B1230] flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>{waitlistTime}</span>
                    </div>
                  </div>

                  {/* 3 Free Hangouts Credit on Pass */}
                  <div className="p-3 bg-[#19C37D]/10 rounded-xl border border-[#19C37D]/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#19C37D]">
                        Launch Trust Privilege
                      </div>
                      <div className="text-xs font-bold text-[#0B1230] mt-0.5 flex items-center gap-1">
                        <span>🎁 3 Free Hangouts Included</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-[#19C37D] text-white px-2.5 py-1 rounded-full shadow-xs">
                      ₹0 (First 3 Free)
                    </span>
                  </div>

                  {/* Selected Interests on Pass */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#0B1230]/60 mb-1.5">
                      Activities & Vibes
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {waitlistInterests.length > 0 ? (
                        waitlistInterests.map((interest, i) => (
                          <span 
                            key={i}
                            className="text-[11px] font-semibold bg-[#0A2EB8] text-white px-2.5 py-0.5 rounded-full"
                          >
                            {interest.split(" ")[0]} {interest.split(" ")[1]}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#0B1230]/60 italic">
                          Tap activities on the left to add to your pass
                        </span>
                      )}
                    </div>
                    {customGoal && (
                      <p className="text-[11px] text-[#0B1230] font-semibold mt-2 italic bg-[#F3F7FF] p-2 rounded-lg border border-[#0A2EB8]/15">
                        "{customGoal}"
                      </p>
                    )}
                  </div>

                  {/* Security QR / Barcode aesthetic line */}
                  <div className="pt-3 border-t border-dashed border-[#0A2EB8]/20 flex items-center justify-between text-[10px] font-bold text-[#0B1230]/60">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#19C37D]" />
                      Biometric & Escrow Guarantee
                    </span>
                    <span className="font-mono text-[#0A2EB8]">DELHI-NCR-PASS</span>
                  </div>

                </div>

              </motion.div>

              {/* Direct WhatsApp Concierge Help Card */}
              <div className="mt-4 p-4 bg-white border border-[#0A2EB8]/20 rounded-2xl shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#19C37D] text-white flex items-center justify-center font-bold text-lg">
                    💬
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-[#0B1230]">Need manual booking help?</p>
                    <p className="text-[11px] text-[#0B1230]/60 font-medium">Talk to Happy Hangouts Founder Team</p>
                  </div>
                </div>
                <a 
                  href="https://wa.me/918800843189?text=Hi%20Happy%20Hangouts!%20I'd%20like%20assistance%20with%20booking%20a%20hangout%20partner."
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => audio.playClick()}
                  className="bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-bold text-xs py-2 px-3.5 rounded-full shrink-0 shadow-xs flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Text Team
                </a>
              </div>

            </div>

          </div>

          {/* City launch indicator badges */}
          <div className="flex gap-2.5 flex-wrap mt-10">
            <span className="bg-[#0A2EB8] text-white rounded-full px-4 py-1.5 font-bold text-xs shadow-xs">
              📍 Gurugram: Launching First
            </span>
            <span className="bg-white text-[#0A2EB8] border border-[#0A2EB8] rounded-full px-4 py-1.5 font-bold text-xs shadow-xs">
              📍 Delhi: Launching in Parallel
            </span>
          </div>

        </div>
      </section>

      {/* 9.5. PRESS, CITATIONS & BACKLINK DIRECTORY NETWORK */}
      <BacklinkHub triggerBoom={triggerBoom} />

      {/* 10. BOOKING INQUIRY & 5-MINUTE UBER/OLA ACTION DISPATCHER MODAL */}
      <AnimatePresence>
        {bookingCompanion && isDispatching && (
          <HangoutRequestDispatcher
            companion={bookingCompanion}
            meetingLocation={bookingLocation}
            meetingDate={bookingDate}
            meetingTime={bookingTime}
            onClose={() => {
              setIsDispatching(false);
              setBookingCompanion(null);
            }}
            onMatchAnother={() => {
              setIsDispatching(false);
              setBookingCompanion(null);
              scrollToSection("match");
            }}
            triggerBoom={triggerBoom}
          />
        )}

        {bookingCompanion && !isDispatching && (
          <div className="fixed inset-0 z-50 bg-[#011C92]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              className="bg-white border border-[#0A2EB8]/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            >
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setBookingCompanion(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full border border-slate-200 hover:bg-[#F3F7FF] transition-colors cursor-pointer text-[#0B1230]/60"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Companion Header in Modal */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full border border-[#0A2EB8]/20 bg-[#F3F7FF] flex items-center justify-center font-serif text-xl font-bold text-[#0A2EB8] shrink-0">
                  {bookingCompanion.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#0A2EB8] font-bold block">
                    {bookingCompanion.categoryLabel} · Verified Partner
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0B1230]">
                    {bookingCompanion.name}
                  </h3>
                  <p className="text-xs text-[#0B1230]/65 mt-0.5">
                    {bookingCompanion.location} · ⭐ {bookingCompanion.rating}
                  </p>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-[#19C37D]/15 text-[#19C37D] rounded-full flex items-center justify-center mx-auto mb-4 font-serif text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-serif text-2xl text-[#0B1230] font-bold mb-2">
                    Request Received
                  </h4>
                  <p className="text-sm text-[#0B1230]/70 mb-5">
                    Opening WhatsApp to connect with {bookingCompanion.name}'s coordinator at +91 8800843189.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBookingCompanion(null)}
                    className="bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-bold w-full py-3 rounded-full"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B1230]/70 uppercase tracking-wider mb-1.5">
                      Activity & Plan
                    </label>
                    <div className="bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-xl p-3.5 text-sm text-[#0B1230] font-normal">
                      {bookingCompanion.vibeText}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0B1230]/70 uppercase tracking-wider mb-1.5">
                        Day
                      </label>
                      <select 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full text-sm bg-white border border-[#0A2EB8]/20 rounded-lg p-2 font-medium text-[#0B1230]"
                      >
                        <option>Today</option>
                        <option>Tomorrow</option>
                        <option>This Saturday</option>
                        <option>This Sunday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0B1230]/70 uppercase tracking-wider mb-1.5">
                        Time Slot
                      </label>
                      <select 
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full text-sm bg-white border border-[#0A2EB8]/20 rounded-lg p-2 font-medium text-[#0B1230]"
                      >
                        <option>Morning (8:30 AM)</option>
                        <option>Afternoon (2:00 PM)</option>
                        <option>Evening (6:00 PM)</option>
                        <option>Night (8:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0B1230]/70 uppercase tracking-wider mb-1.5">
                      Public Meeting Spot
                    </label>
                    <input 
                      type="text" 
                      value={bookingLocation}
                      onChange={(e) => setBookingLocation(e.target.value)}
                      placeholder="e.g. Blue Tokai CyberHub or Khan Market"
                      className="w-full text-sm bg-white border border-[#0A2EB8]/20 rounded-lg p-2.5 font-medium text-[#0B1230]"
                    />
                  </div>

                  {/* First 3 Hangouts Free Trust Callout */}
                  <div className="p-4 bg-[#19C37D]/10 border border-[#19C37D]/30 rounded-2xl">
                    <div className="flex items-center justify-between text-xs font-bold text-[#19C37D] mb-1">
                      <span>Launch Trust Privilege:</span>
                      <span className="bg-[#19C37D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ₹0 (1st of 3 Free)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#0B1230]/60 pt-1 border-t border-[#19C37D]/20">
                      <span>Regular Partner Rate:</span>
                      <span className="line-through">₹{bookingCompanion.rate}/hr</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-[#0B1230] mt-1">
                      <span>Your Cost Today:</span>
                      <span className="font-serif text-base text-[#19C37D] font-bold">₹0 Free</span>
                    </div>
                  </div>

                  {/* Uber/Ola 5-Minute Partner Window Explainer Notice */}
                  <div className="p-3.5 bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-2xl flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0A2EB8] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      5m
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0B1230] flex items-center gap-1.5">
                        <span>Live 5-Minute Action Window</span>
                      </p>
                      <p className="text-[11px] text-[#0B1230]/75 font-normal mt-0.5 leading-relaxed">
                        Once sent, <strong>{bookingCompanion.name}</strong> has exactly 5 minutes to confirm. If unresponded, the request auto-cancels with ₹0 charge (Uber/Ola style).
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      className="bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-bold w-full py-3.5 text-sm rounded-full shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      Send Request to {bookingCompanion.name} (5-Min Live Action)
                    </button>
                    <p className="text-[11px] text-center text-[#0B1230]/60 mt-2 font-normal">
                      Strictly public venues. Escrow guarantee. Free auto-cancel after 5 minutes.
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 11. FOOTER & SEO CITATION DIRECTORY (Deep Midnight #011C92) */}
      <footer className="py-12 sm:py-16 text-white/80 bg-[#011C92] border-t border-white/10">
        <div className="wrap">
          {/* Top Grid of Backlink & Directory Citations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10 text-left">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-serif font-bold text-2xl text-white">
                  Happy Hangouts
                </span>
                <span className="text-xs bg-[#FFC83D] text-[#0B1230] font-bold px-2.5 py-0.5 rounded-full">
                  NCR Edition
                </span>
              </div>
              <p className="text-sm font-semibold text-[#3DAAFC] mb-2 leading-snug">
                Akele kyu? Happy Hangouts Hai na!! 🙌
              </p>
              <p className="text-xs text-white/70 leading-relaxed mb-4 max-w-sm font-normal">
                India's first escrow-protected marketplace to find verified partners for badminton rallies, specialty cafe chats, photowalks, and board games across Gurugram and Delhi.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 w-fit">
                <span>⭐ 4.9 / 5 Rating</span>
                <span>·</span>
                <span className="text-[#FFC83D]">First 3 Hangouts Free</span>
              </div>
            </div>

            {/* Hotspots Directory Column */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                📍 NCR Hotspot Hubs
              </h5>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <a href="#radar" onClick={() => scrollToSection("radar")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    DLF CyberHub (Gurgaon)
                  </a>
                </li>
                <li>
                  <a href="#radar" onClick={() => scrollToSection("radar")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    Connaught Place (CP Delhi)
                  </a>
                </li>
                <li>
                  <a href="#radar" onClick={() => scrollToSection("radar")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    Khan Market & Lodhi
                  </a>
                </li>
                <li>
                  <a href="#radar" onClick={() => scrollToSection("radar")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    Sunder Nursery Botanical
                  </a>
                </li>
                <li>
                  <a href="#radar" onClick={() => scrollToSection("radar")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    Siri Fort Sports Arena
                  </a>
                </li>
                <li>
                  <a href="#radar" onClick={() => scrollToSection("radar")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    Golf Course Road Hub
                  </a>
                </li>
              </ul>
            </div>

            {/* Activity Passions Column */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                ⚡ Partner Passions
              </h5>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <a href="#match" onClick={() => { setSelectedCategory("badminton"); scrollToSection("match"); }} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    🏸 Badminton Partners
                  </a>
                </li>
                <li>
                  <a href="#match" onClick={() => { setSelectedCategory("cafe"); scrollToSection("match"); }} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    ☕ Cafe Chat & Co-working
                  </a>
                </li>
                <li>
                  <a href="#match" onClick={() => { setSelectedCategory("trek"); scrollToSection("match"); }} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    🥾 Aravalli Sunrise Trails
                  </a>
                </li>
                <li>
                  <a href="#match" onClick={() => { setSelectedCategory("music"); scrollToSection("match"); }} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    🎸 Acoustic Indie Jamming
                  </a>
                </li>
                <li>
                  <a href="#match" onClick={() => { setSelectedCategory("boardgames"); scrollToSection("match"); }} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    🎲 Board Games & Catan
                  </a>
                </li>
              </ul>
            </div>

            {/* Trust & External Backlinks Column */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                🔗 Trust & Safety
              </h5>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <a href="#safe" onClick={() => scrollToSection("safe")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    ID & Aadhaar Verification
                  </a>
                </li>
                <li>
                  <a href="#safe" onClick={() => scrollToSection("safe")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    Escrow Digital Protection
                  </a>
                </li>
                <li>
                  <a href="#backlinks" onClick={() => scrollToSection("backlinks")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    Embed Partner Badge
                  </a>
                </li>
                <li>
                  <a href="https://lbb.in/delhi" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    LBB Delhi Feature
                  </a>
                </li>
                <li>
                  <a href="https://www.happyhangouts.life" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    www.happyhangouts.life
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright & Canonical Notice */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-center sm:text-left text-white/70">
            <div>
              <p className="font-semibold text-white">
                © {new Date().getFullYear()} Happy Hangouts. All rights reserved.
              </p>
              <p className="text-[11px] text-white/60 mt-0.5">
                Connecting genuine humans across Gurugram & Delhi in safe public daylight spaces.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-[#3DAAFC]">
              <a href="#backlinks" onClick={() => scrollToSection("backlinks")} className="hover:underline">
                Press Kit & Badges
              </a>
              <span>·</span>
              <a href="#safe" onClick={() => scrollToSection("safe")} className="hover:underline">
                Safety Charter
              </a>
              <span>·</span>
              <a href="https://wa.me/918800843189" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#FFC83D]">
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 12. MOBILE BOTTOM FLOATING ACTION BAR (Streamlined & Non-Congested) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#0A2EB8]/15 py-2.5 px-4 z-40 md:hidden flex items-center justify-between gap-3 shadow-[0_-4px_12px_rgba(10,46,184,0.08)]">
        <a 
          href="#join" 
          onClick={() => {
            audio.playClick();
            setWaitlistRole("partner");
          }}
          className="flex-1 text-center py-2.5 px-3 rounded-full border border-[#0A2EB8] text-[#0A2EB8] font-bold text-xs"
        >
          Become a Partner
        </a>
        <a 
          href="#match" 
          onClick={() => audio.playClick()}
          className="flex-1 text-center py-2.5 px-3 rounded-full bg-[#FFC83D] text-[#0B1230] font-bold text-xs shadow-sm"
        >
          Find a Partner
        </a>
      </div>

    </div>
  );
}
