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
import AnimatedCharacterStorySection from "./components/AnimatedCharacterStorySection";

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

export const FORM_INTERESTS_OPTIONS = [
  { id: "badminton", label: "🏸 Badminton & Rackets", desc: "Doubles, rallies & court games" },
  { id: "cafe", label: "☕ Café Crawl & Chai", desc: "Specialty coffee, books & talks" },
  { id: "trek", label: "🥾 Sunrise Treks & Trails", desc: "Aravalli trails & nature walks" },
  { id: "tech", label: "💡 Startup & Tech Co-working", desc: "Product brainstorming, AI & code" },
  { id: "language", label: "🗣️ Language Practice", desc: "French, English, German, Spanish" },
  { id: "chess", label: "♟️ Chess & Board Games", desc: "Blitz, strategy, Catan & Ludo" },
  { id: "music", label: "🎸 Acoustic Music & Jam", desc: "Guitar, vocals & open mics" },
  { id: "running", label: "🏃 Running & 5K Fitness", desc: "Early morning pacing & trails" },
  { id: "photo", label: "📷 Street Photowalks", desc: "Candid portraits & heritage trails" },
  { id: "food", label: "🍜 Foodie Walks & Dining", desc: "Street food, fine dining & brunch" }
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
  { id: "weekday_eve", label: "Weekday Evenings (6:00 PM – 9:30 PM)", time: "6:00 PM – 9:30 PM", icon: "🌆", tag: "Post-Work Chai & Rallies" },
  { id: "weekend_morn", label: "Weekend Mornings (8:30 AM – 1:00 PM)", time: "8:30 AM – 1:00 PM", icon: "☕", tag: "Sunrise Treks & Coffee" },
  { id: "weekend_aft", label: "Weekend Afternoons (1:30 PM – 5:30 PM)", time: "1:30 PM – 5:30 PM", icon: "🏸", tag: "Badminton & Board Games" },
  { id: "weekend_night", label: "Weekend Nights (6:00 PM – 10:30 PM)", time: "6:00 PM – 10:30 PM", icon: "✨", tag: "Music Jams & Dining" },
  { id: "flexible", label: "Flexible / Spontaneous on coordination", time: "On-demand", icon: "⚡", tag: "Anytime" }
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
  };

  // Confirm booking
  const handleConfirmBooking = () => {
    if (!bookingCompanion) return;
    audio.playSuccess();
    setBookingSuccess(true);
    triggerBoom(`Booking request sent for ${bookingCompanion.name}! 🎉`);

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

  const scrollToSection = (id: string) => {
    audio.playPageTransition();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-blue-600/20 selection:text-blue-900 pb-16 md:pb-0 relative">
      
      {/* 0. GLOBAL SCROLL PROGRESS INDICATOR (BUTTERY SMOOTH TOP BAR) */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-1.5 bg-slate-200/50">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#1f4ee0] via-[#ffc933] to-[#ff6b4a] shadow-[0_0_10px_rgba(31,78,224,0.5)] origin-left"
          style={{ scaleX }}
        />
      </div>

      {/* 0.1 DESKTOP FLOATING VERTICAL SCROLL-SPY DOCK */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2.5 bg-white/95 backdrop-blur-md p-2 rounded-2xl border-[2.5px] border-[#0b1f5c] shadow-[4px_4px_0_#0b1f5c]">
        {SECTIONS.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`group relative flex items-center justify-center w-8 h-8 rounded-xl font-display font-black text-xs transition-all cursor-pointer ${
                isActive 
                  ? "bg-[#ffc933] text-[#0b1f5c] border-[2px] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] scale-110" 
                  : "bg-transparent text-[#4a5a8a] hover:bg-blue-50 hover:text-[#0b1f5c]"
              }`}
              title={s.name}
            >
              <span>{s.label}</span>
              {/* Tooltip on Hover */}
              <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#0b1f5c] text-white text-[11px] font-bold tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                {s.name}
              </span>
            </button>
          );
        })}
        {/* Live Scroll Percentage Pill */}
        <div className="pt-2 border-t border-slate-200 text-center font-display font-extrabold text-[10px] text-[#1f4ee0]">
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
            whileHover={{ scale: 1.1, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              audio.playPageTransition();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="fixed bottom-20 md:bottom-6 right-5 z-40 p-3 rounded-full bg-[#ffc933] text-[#0b1f5c] border-[2.5px] border-[#0b1f5c] shadow-[4px_4px_0_#0b1f5c] hover:shadow-[6px_6px_0_#0b1f5c] transition-all cursor-pointer flex items-center justify-center"
            title="Scroll back to top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 1. TOP NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#f3f8ff]/95 backdrop-blur-md border-b-[2.5px] border-[#0b1f5c] transition-colors">
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
              href="#videos" 
              onClick={() => audio.playClick()}
              className="hidden md:inline-block font-bold text-[#0b1f5c] hover:text-[#1f4ee0] transition-colors"
            >
              Story Studio
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

      {/* 2. HERO SECTION WITH SCROLL-PARALLAX STICKERS & DYNAMIC DEPTH */}
      <header 
        id="top" 
        onMouseMove={handleHeroMouseMove}
        className="relative py-14 sm:py-20 lg:py-24 overflow-hidden border-b-[2.5px] border-[#0b1f5c] bg-[#f3f8ff]"
      >
        <motion.div 
          className="wrap relative"
          style={{ scale: heroScale }}
        >
          
          {/* Floating Sticker Badges with Scroll-Linked Parallax & Hover Reaction */}
          <motion.span 
            className="stk y hidden lg:block"
            style={{ 
              right: "6%", 
              top: "4%", 
              y: stickerY1,
              transform: `rotate(6deg) translate(${parallax.x * 24}px, ${parallax.y * 24}px)` 
            }}
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            ⭐ 4.9 · 218 reviews
          </motion.span>

          <motion.span 
            className="stk s hidden lg:block"
            style={{ 
              right: "22%", 
              top: "36%", 
              y: stickerY2,
              transform: `rotate(-7deg) translate(${parallax.x * -20}px, ${parallax.y * -20}px)` 
            }}
            whileHover={{ scale: 1.1, rotate: -12 }}
          >
            🏸 Today, 6 PM
          </motion.span>

          <motion.span 
            className="stk p hidden lg:block"
            style={{ 
              right: "5%", 
              top: "60%", 
              y: stickerY3,
              transform: `rotate(4deg) translate(${parallax.x * 30}px, ${parallax.y * 30}px)` 
            }}
            whileHover={{ scale: 1.1, rotate: 8 }}
          >
            ☕ ₹400/hr
          </motion.span>

          <motion.span 
            className="stk hidden lg:block"
            style={{ 
              right: "26%", 
              top: "84%", 
              y: stickerY4,
              transform: `rotate(-3deg) translate(${parallax.x * -26}px, ${parallax.y * -26}px)` 
            }}
            whileHover={{ scale: 1.1, rotate: -6 }}
          >
            📍 Gurugram & Delhi
          </motion.span>

          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="tag">
              Akele kyu? Happy Hangouts Hai na!!
            </span>
          </motion.div>

          {/* Dynamic Animated Heading with rotating verb */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-5 text-[40px] sm:text-[64px] md:text-[80px] lg:text-[100px] font-extrabold tracking-[-0.03em] text-[#0b1f5c] max-w-4xl"
          >
            Find someone <br className="hidden sm:inline" />
            to{" "}
            <em className="not-italic text-white bg-[#1f4ee0] px-2 py-0.5 rounded-[0.2em] inline-block -rotate-2 border-[3px] border-[#0b1f5c] shadow-[4px_4px_0_#0b1f5c] transition-all duration-300">
              {ROTATING_WORDS[wordIndex]}
            </em>{" "}
            <br className="hidden sm:inline" />
            with. Tonight.
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-[17px] sm:text-[21px] max-w-[640px] mt-6 mb-8 text-[#4a5a8a] font-normal leading-relaxed"
          >
            Hire real, verified people for an hour or an afternoon in Gurugram & Delhi. Pick by interest, hobby or goal, then filter by time, budget and reviews. No more cancelled plans, no more doing it alone.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="flex items-center gap-4 flex-wrap"
          >
            <a 
              href="#match" 
              onClick={() => audio.playClick()}
              className="btn b text-[18px] py-3.5 px-7 shadow-[4px_4px_0_#0b1f5c]"
            >
              Find my hangout →
            </a>
            <a 
              href="#earn" 
              onClick={() => audio.playClick()}
              className="btn text-[18px] py-3.5 px-7 shadow-[4px_4px_0_#0b1f5c]"
            >
              Earn as a partner
            </a>
          </motion.div>

          {/* Key Trust Counters Strip on Scroll */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-12 pt-8 border-t-[2px] border-[#0b1f5c]/20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl"
          >
            <div>
              <div className="font-display font-black text-2xl sm:text-3xl text-[#0b1f5c]">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <div className="text-xs font-bold text-[#4a5a8a] mt-0.5">Government ID Verified</div>
            </div>
            <div>
              <div className="font-display font-black text-2xl sm:text-3xl text-[#1f4ee0]">
                <AnimatedCounter value={0} prefix="₹" suffix=" Risk" />
              </div>
              <div className="text-xs font-bold text-[#4a5a8a] mt-0.5">Escrow UPI Protected</div>
            </div>
            <div>
              <div className="font-display font-black text-2xl sm:text-3xl text-[#0b1f5c]">
                ⭐ 4.9 / 5.0
              </div>
              <div className="text-xs font-bold text-[#4a5a8a] mt-0.5">Community Rating</div>
            </div>
            <div>
              <div className="font-display font-black text-2xl sm:text-3xl text-[#ff6b4a]">
                <AnimatedCounter value={3400} suffix="+" />
              </div>
              <div className="text-xs font-bold text-[#4a5a8a] mt-0.5">NCR Hangouts Completed</div>
            </div>
          </motion.div>

        </motion.div>
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

      {/* 4. "WHAT'S YOUR VIBE?" INTERACTIVE DIRECTORY WITH SCROLL REVEALS */}
      <section id="match" className="py-16 sm:py-24 bg-[#f3f8ff]">
        <div className="wrap">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start"
          >
            <span className="tag">Try it live</span>
            <h2 className="text-[34px] sm:text-[52px] font-extrabold tracking-tight mt-3 mb-2 text-[#0b1f5c]">
              What’s your vibe?
            </h2>
            <p className="text-[#4a5a8a] text-[17px] sm:text-[19px] max-w-2xl mb-8">
              Tap an interest, choose your city, and set your budget. Filter verified partners ready for hangouts in Gurugram and Delhi.
            </p>
          </motion.div>

          {/* Category Chips with Hover Pop */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex gap-2.5 flex-wrap mb-4"
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

          {/* City Selection Chips (Strictly Gurugram & Delhi) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex items-center gap-2 mb-6"
          >
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
          </motion.div>

          {/* Filter Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
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
          </motion.div>

          {/* Companion Cards Grid with Scroll-Triggered Stagger */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCompanions.length > 0 ? (
              filteredCompanions.map((comp, idx) => (
                <motion.div 
                  key={comp.id} 
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: (idx % 4) * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.15 } }}
                  className="pc"
                >
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
                    <small className="block mt-0.5 text-xs text-[#4a5a8a] font-semibold">
                      📍 {comp.location} · {comp.times.join(", ")}
                    </small>
                  </div>

                  {/* Vibe Description */}
                  <p className="text-sm text-[#0b1f5c] font-medium leading-snug line-clamp-2">
                    {comp.vibeText}
                  </p>

                  {/* Price & Rating */}
                  <div className="row pt-2 border-t border-slate-200 flex items-center justify-between">
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
                    className="btn w-full py-2.5 text-sm font-extrabold mt-1 cursor-pointer"
                  >
                    Hangout! 🙌
                  </button>
                </motion.div>
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

      {/* 5. "HANGOUT IN 3 TAPS" (SCROLL ANIMATED HOW IT WORKS TIMELINE) */}
      <section id="how" className="py-16 sm:py-24 bg-white border-y-[2.5px] border-[#0b1f5c]">
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="tag">3 steps</span>
            <h2 className="text-[34px] sm:text-[52px] font-extrabold tracking-tight mt-3 mb-8 text-[#0b1f5c]">
              Hangout in 3 taps
            </h2>
          </motion.div>

          <div className="steps grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="st relative"
            >
              <div className="n bg-[#ffc933] text-[#0b1f5c]">1</div>
              <h3 className="text-[#0b1f5c] text-xl font-extrabold mt-3 mb-1.5">Pick your plan</h3>
              <p className="text-[#4a5a8a] font-medium leading-relaxed">
                Hobby, badminton match, trek or just chill company for chai. Add your preferred time slot and budget.
              </p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="st relative"
            >
              <div className="n bg-[#1f4ee0] text-white">2</div>
              <h3 className="text-[#0b1f5c] text-xl font-extrabold mt-3 mb-1.5">Choose a partner</h3>
              <p className="text-[#4a5a8a] font-medium leading-relaxed">
                Compare verified reviews and hourly rates in Gurugram & Delhi. Coordinate safely in the app before you meet.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="st relative"
            >
              <div className="n bg-[#ff6b4a] text-white">3</div>
              <h3 className="text-[#0b1f5c] text-xl font-extrabold mt-3 mb-1.5">Go hang out</h3>
              <p className="text-[#4a5a8a] font-medium leading-relaxed">
                Meet strictly in a verified public place, pay securely by the hour, and rate each other right after the session.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5.5 ANIMATED CHARACTER STORY THEATRE */}
      <AnimatedCharacterStorySection 
        onOpenBookingClick={() => {
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

      {/* 6. LIVE HANGOUTS RADAR (SCROLL-TRIGGERED RADAR & BLUE LIGHTS MAP) */}
      <section id="radar" className="py-16 sm:py-24 bg-[#f3f8ff] border-b-[2.5px] border-[#0b1f5c]">
        <div className="wrap">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
          >
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
          </motion.div>

          {/* Interactive Radar Box with Blue Light Nodes */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="bg-white border-[2.5px] border-[#0b1f5c] rounded-[28px] p-6 sm:p-8 shadow-[8px_8px_0_#0b1f5c] relative overflow-hidden"
          >
            
            {/* Grid Hotspots */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {LIVE_RADAR_SPOTS.slice(0, 4).map((spot, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.03 }}
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
                </motion.div>
              ))}
            </div>

            {/* Radar schematic visual showing Delhi & Gurgaon hubs */}
            <div className="relative w-full h-64 sm:h-80 bg-[#0b1f5c] rounded-2xl overflow-hidden border-[2.5px] border-[#0b1f5c] flex items-center justify-center p-4">
              
              {/* Concentric radar rings */}
              <div className="absolute w-44 h-44 sm:w-64 sm:h-64 rounded-full border border-blue-400/20"></div>
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-blue-400/15"></div>
              <div className="absolute w-full h-[1px] bg-blue-400/20"></div>
              <div className="absolute h-full w-[1px] bg-blue-400/20"></div>

              {/* Glowing Blue Radar sweep line */}
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "conic-gradient(from 0deg at 50% 50%, rgba(31, 78, 224, 0.45) 0deg, transparent 60deg, transparent 360deg)"
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              />

              {/* Pulsing Blue Light Hotspots with Scroll Animation */}
              {LIVE_RADAR_SPOTS.map((spot, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="absolute group cursor-pointer z-20"
                  style={{
                    left: `${spot.coords.x}%`,
                    top: `${spot.coords.y}%`,
                    transform: "translate(-50%, -50%)"
                  }}
                  whileHover={{ scale: 1.35 }}
                  onClick={() => {
                    audio.playClick();
                    triggerBoom(`Active hangout node: ${spot.name} (${spot.active} companions online)`);
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute h-7 w-7 rounded-full bg-cyan-400 opacity-80"></span>
                    <span className="relative flex h-3.5 w-3.5 rounded-full bg-cyan-300 border-2 border-white shadow-[0_0_14px_#38bdf8]"></span>
                  </div>
                  
                  {/* Tooltip on badge */}
                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-[#0b1f5c] text-[11px] font-extrabold px-2.5 py-1 rounded-lg border-[1.5px] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] z-30">
                    {spot.name}: {spot.active} active
                  </div>
                </motion.div>
              ))}

              <div className="absolute bottom-3 left-4 text-xs font-bold text-blue-200 z-10 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]"></span>
                <span>Live GPS Escrow Radar: Strictly Gurugram & Delhi NCR</span>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* 7. "FUN IS ONLY FUN WHEN IT'S SAFE" (SCROLL ANIMATED 4-PILLAR SAFETY) */}
      <section id="safe" className="safe py-16 sm:py-24">
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="tag" style={{ background: "#ffc933", color: "#0b1f5c" }}>
              Safety first
            </span>
            <h2 className="text-[34px] sm:text-[52px] font-extrabold tracking-tight mt-3 mb-2 text-white">
              Fun is only fun when it’s safe
            </h2>
            <p className="sub text-lg max-w-2xl mb-8">
              Everything here is about friendly activity partners meeting in public places. Our 4-pillar safety framework:
            </p>
          </motion.div>

          <div className="sg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/10 backdrop-blur-xs p-6 rounded-2xl border-2 border-white/20"
            >
              <b>ID</b>
              <p className="font-semibold text-sm sm:text-base leading-snug mt-2">
                Every partner verified with Government ID (Aadhaar/PAN) and biometric selfie before attending or hosting.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-white/10 backdrop-blur-xs p-6 rounded-2xl border-2 border-white/20"
            >
              <b>📍</b>
              <p className="font-semibold text-sm sm:text-base leading-snug mt-2">
                Public meeting places only — verified cafes (CyberHub, CP, Khan Market) and sports arenas (Siri Fort).
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="bg-white/10 backdrop-blur-xs p-6 rounded-2xl border-2 border-white/20"
            >
              <b>SOS</b>
              <p className="font-semibold text-sm sm:text-base leading-snug mt-2">
                Real-time session timer, live location sharing with emergency contacts, and instant one-tap help alert.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-white/10 backdrop-blur-xs p-6 rounded-2xl border-2 border-white/20"
            >
              <b>★</b>
              <p className="font-semibold text-sm sm:text-base leading-snug mt-2">
                Mandatory two-way post-hangout reviews. Zero tolerance policy: bad actors and inappropriate behavior permanently banned.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. "GET PAID FOR YOUR HOBBIES" (SCROLL ANIMATED EARNINGS CALCULATOR) */}
      <section id="earn" className="py-16 sm:py-24 bg-[#f3f8ff] border-b-[2.5px] border-[#0b1f5c]">
        <div className="wrap earn-container">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="tag">For partners</span>
            <h2 className="text-[34px] sm:text-[52px] font-extrabold tracking-tight mt-3 mb-2 text-[#0b1f5c]">
              Get paid for your hobbies
            </h2>
            <p className="text-[#4a5a8a] text-lg mb-6 leading-relaxed">
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
          </motion.div>

          {/* Big Earnings Result Card with Scroll Counter */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            whileHover={{ scale: 1.02 }}
            className="big-card shadow-[8px_8px_0_#0b1f5c]"
          >
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
          </motion.div>

        </div>
      </section>

      {/* 9. "BE FIRST IN LINE" (SCROLL ANIMATED FORM & STICKY LIVE TICKET PASS) */}
      <section id="join" className="join py-16 sm:py-24">
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="tag" style={{ background: "#ffffff", color: "#0b1f5c" }}>
              Gurugram & Delhi first
            </span>
            <h2 className="text-[34px] sm:text-[54px] font-extrabold tracking-tight mt-3 mb-2 text-[#0b1f5c]">
              Be first in line
            </h2>
            <p className="text-[#173a8a] text-lg font-medium mb-10 max-w-2xl">
              Create your custom Hangout Pass to receive priority access, founding host badges, and launch perks in Gurugram & Delhi.
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
              className="lg:col-span-7 form-box max-w-none shadow-[8px_8px_0_#0b1f5c]"
            >
              
              {/* Profile Power / Vibe Score Bar */}
              <div className="bg-[#f3f8ff] border-[2px] border-[#0b1f5c] rounded-xl p-3 shadow-[2px_2px_0_#0b1f5c]">
                <div className="flex items-center justify-between text-xs font-bold text-[#0b1f5c] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#1f4ee0]" />
                    Hangout Pass Readiness
                  </span>
                  <span className="font-display font-extrabold text-[#1f4ee0]">
                    {calculateVibeScore()}% Complete
                  </span>
                </div>
                <div className="w-full h-3 bg-white border-[1.5px] border-[#0b1f5c] rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-[#ffc933] via-[#ff6b4a] to-[#1f4ee0] rounded-full transition-all duration-300"
                    style={{ width: `${calculateVibeScore()}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#4a5a8a] mt-1 font-semibold">
                  {calculateVibeScore() === 100 
                    ? "✨ 100% Hangout Ready! Your verified pass is complete." 
                    : "Fill your name, required WhatsApp, email & interests to power up your pass."}
                </p>
              </div>

              {/* 1. Role Selection */}
              <div>
                <label className="block text-xs font-bold text-[#0b1f5c] mb-1.5">
                  1. How would you like to participate?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setWaitlistRole("seeker");
                    }}
                    className={`p-3 rounded-xl border-[2px] text-center font-bold text-sm transition-all cursor-pointer ${
                      waitlistRole === "seeker" 
                        ? "bg-[#1f4ee0] text-white border-[#0b1f5c] shadow-[3px_3px_0_#0b1f5c] -translate-y-0.5" 
                        : "bg-white text-[#0b1f5c] border-[#0b1f5c]/70 hover:border-[#0b1f5c]"
                    }`}
                  >
                    🙋 I want to hire companions
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setWaitlistRole("partner");
                    }}
                    className={`p-3 rounded-xl border-[2px] text-center font-bold text-sm transition-all cursor-pointer ${
                      waitlistRole === "partner" 
                        ? "bg-[#1f4ee0] text-white border-[#0b1f5c] shadow-[3px_3px_0_#0b1f5c] -translate-y-0.5" 
                        : "bg-white text-[#0b1f5c] border-[#0b1f5c]/70 hover:border-[#0b1f5c]"
                    }`}
                  >
                    💪 I want to earn as host
                  </button>
                </div>
              </div>

              {/* 2. Full Name Input */}
              <div>
                <label className="block text-xs font-bold text-[#0b1f5c] mb-1 flex items-center justify-between">
                  <span>2. Your Full Name</span>
                  <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wider">* Required</span>
                </label>
                <input 
                  type="text" 
                  value={waitlistName}
                  onChange={(e) => setWaitlistName(e.target.value)}
                  placeholder="e.g. Rahul Sharma" 
                  required 
                  className="w-full bg-white font-medium"
                />
              </div>

              {/* 3. BOTH WhatsApp & Email Required Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp Number (Required) */}
                <div>
                  <label className="block text-xs font-bold text-[#0b1f5c] mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      WhatsApp Number
                    </span>
                    <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wider">* Required</span>
                  </label>
                  
                  {/* Clean Country-Code Input Group (No Overlapping/Messed Up Text) */}
                  <div className="flex items-center rounded-xl overflow-hidden border-[2.5px] border-[#0b1f5c] bg-white shadow-xs focus-within:border-[#1f4ee0] focus-within:shadow-[3px_3px_0_#1f4ee0] transition-all">
                    <div className="bg-[#f3f8ff] border-r-[2px] border-[#0b1f5c] px-3.5 py-2.5 flex items-center gap-1.5 shrink-0 select-none">
                      <span className="text-base leading-none">🇮🇳</span>
                      <span className="text-xs font-black text-[#0b1f5c] tracking-tight">+91</span>
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
                      className="clean-input w-full bg-white font-semibold text-sm text-[#0b1f5c] px-3.5 py-2.5 focus:outline-none !border-0 !shadow-none !rounded-none placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-[10px] text-[#4a5a8a] mt-1 font-semibold">
                    For private verification and booking coordination.
                  </p>
                </div>

                {/* Email Address (Required) */}
                <div>
                  <label className="block text-xs font-bold text-[#0b1f5c] mb-1 flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wider">* Required</span>
                  </label>
                  <input 
                    type="email" 
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="name@gmail.com" 
                    required 
                    className="w-full bg-white font-medium"
                  />
                  <p className="text-[10px] text-[#4a5a8a] mt-1 font-semibold">
                    For launch invitation and pass confirmation.
                  </p>
                </div>
              </div>

              {/* 4. City & Quick Hub Shortcuts */}
              <div className="bg-[#f3f8ff] border-[2px] border-[#0b1f5c] rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#0b1f5c]">
                    4. City Focus & Meeting Hub
                  </label>
                  <span className="text-[10px] font-black text-[#1f4ee0] uppercase tracking-wide">
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
                    className={`flex-1 py-2 text-xs font-extrabold rounded-lg border-[2px] cursor-pointer transition-all ${
                      waitlistCity === "Gurugram" 
                        ? "bg-[#ffc933] text-[#0b1f5c] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c]" 
                        : "bg-white text-[#4a5a8a] border-[#0b1f5c]/50"
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
                    className={`flex-1 py-2 text-xs font-extrabold rounded-lg border-[2px] cursor-pointer transition-all ${
                      waitlistCity === "Delhi" 
                        ? "bg-[#ffc933] text-[#0b1f5c] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c]" 
                        : "bg-white text-[#4a5a8a] border-[#0b1f5c]/50"
                    }`}
                  >
                    📍 Delhi
                  </button>
                </div>

                {/* 1-Tap Quick Hub Shortcuts */}
                <div className="mb-2.5">
                  <span className="text-[11px] font-bold text-[#4a5a8a] block mb-1">
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
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          waitlistLocation === hub
                            ? "bg-[#1f4ee0] text-white border-[#0b1f5c]"
                            : "bg-white text-[#0b1f5c] border-[#0b1f5c]/60 hover:border-[#0b1f5c]"
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
                  className="w-full text-xs bg-white font-medium"
                />
              </div>

              {/* 5. What time are you free actually? */}
              <div>
                <label className="block text-xs font-bold text-[#0b1f5c] mb-1.5">
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
                        className={`text-left p-2.5 rounded-xl border-[2px] transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#ffc933] text-[#0b1f5c] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] -translate-y-0.5"
                            : "bg-white text-[#0b1f5c] border-[#0b1f5c]/70 hover:border-[#0b1f5c]"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-extrabold">
                          <span className="flex items-center gap-1.5">
                            <span>{slot.icon}</span>
                            <span>{slot.time}</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#0b1f5c]" />}
                        </div>
                        <span className="text-[10px] text-[#4a5a8a] font-bold block mt-0.5">
                          {slot.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Interests / Hobbies / Goals Selection */}
              <div className="bg-[#f3f8ff] border-[2px] border-[#0b1f5c] rounded-2xl p-4 shadow-[3px_3px_0_#0b1f5c]">
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <label className="block text-xs font-bold text-[#0b1f5c]">
                    6. Interests, Hobbies & Goals ({waitlistRole === "partner" ? "What you want to host / teach" : "What you want a companion for"})
                  </label>
                  <span className="text-[11px] font-black bg-[#ffc933] text-[#0b1f5c] px-2.5 py-0.5 rounded-full border border-[#0b1f5c]">
                    {waitlistInterests.length} selected
                  </span>
                </div>
                <p className="text-[12px] text-[#4a5a8a] mb-2.5 font-medium">
                  Tap the activities, hobbies, or sports you want to share with your hangout companion:
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
                        className={`text-left p-2.5 rounded-xl border-[2px] transition-all text-xs font-bold flex flex-col justify-center cursor-pointer ${
                          isSelected 
                            ? "bg-[#1f4ee0] text-white border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] -translate-y-0.5" 
                            : "bg-white text-[#0b1f5c] border-[#0b1f5c]/70 hover:border-[#0b1f5c] hover:bg-slate-50"
                        }`}
                      >
                        <span className="font-extrabold flex items-center justify-between">
                          <span>{item.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 ml-1 shrink-0 text-[#ffc933]" />}
                        </span>
                        <span className={`text-[10px] mt-0.5 font-medium ${isSelected ? "text-blue-100" : "text-[#4a5a8a]"}`}>
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Specific Goal or Activity Input */}
                <div>
                  <label className="block text-[11px] font-bold text-[#0b1f5c] mb-1">
                    Specific goal, personal hobby, or custom hangout wish (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="e.g. Find a squash partner for weekends, or speak French over chai"
                    className="w-full text-sm bg-white font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button className="btn b py-4 text-base w-full mt-3 shadow-[5px_5px_0_#0b1f5c] cursor-pointer" type="submit">
                Generate My Hangout Pass & Join 🎉
              </button>

              {/* Feedback status message */}
              {waitlistStatus && (
                <div className={`border-[2px] rounded-xl p-3.5 font-semibold text-xs flex items-center gap-2.5 ${
                  waitlistStatus.startsWith("⚠️") 
                    ? "bg-amber-50 border-amber-600 text-amber-900" 
                    : "bg-emerald-50 border-emerald-600 text-emerald-900"
                }`}>
                  {waitlistStatus.startsWith("⚠️") ? (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
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
                className="bg-white border-[3px] border-[#0b1f5c] rounded-[28px] p-6 shadow-[8px_8px_0_#0b1f5c] relative overflow-hidden"
              >
                
                {/* Pass Header Band */}
                <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-[#0b1f5c]/50">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-black uppercase tracking-wider text-[#0b1f5c]">
                      Live Pass Preview
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold bg-[#ffc933] text-[#0b1f5c] px-2.5 py-0.5 rounded-full border border-[#0b1f5c]">
                    #HH-2026 NCR VIP
                  </span>
                </div>

                {/* Ticket Body */}
                <div className="pt-5 space-y-4">
                  {/* Name & Role Avatar */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#1f4ee0] text-white flex items-center justify-center text-2xl font-black border-[2px] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] shrink-0">
                      {waitlistRole === "partner" ? "💪" : "🙋"}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4a5a8a]">
                        {waitlistRole === "partner" ? "Founding Hangout Partner" : "Founding Hangout Seeker"}
                      </span>
                      <h4 className="text-xl font-extrabold text-[#0b1f5c] leading-tight">
                        {waitlistName.trim() || "Your Name Here"}
                      </h4>
                      <p className="text-xs font-semibold text-[#1f4ee0] mt-0.5">
                        {waitlistWhatsapp ? `+91 ${waitlistWhatsapp}` : "WhatsApp Pending"} · {waitlistEmail || "Email Pending"}
                      </p>
                    </div>
                  </div>

                  {/* Meeting Hub & City */}
                  <div className="p-3 bg-[#f3f8ff] rounded-xl border-[1.5px] border-[#0b1f5c]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#4a5a8a]">
                      Focus Location
                    </div>
                    <div className="text-sm font-extrabold text-[#0b1f5c] flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-4 h-4 text-[#1f4ee0]" />
                      <span>{waitlistLocation} ({waitlistCity})</span>
                    </div>
                  </div>

                  {/* Time Availability */}
                  <div className="p-3 bg-amber-50 rounded-xl border-[1.5px] border-[#0b1f5c]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#4a5a8a]">
                      Free Schedule
                    </div>
                    <div className="text-xs font-bold text-[#0b1f5c] flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>{waitlistTime}</span>
                    </div>
                  </div>

                  {/* Selected Interests on Pass */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#4a5a8a] mb-1.5">
                      Activities & Vibes
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {waitlistInterests.length > 0 ? (
                        waitlistInterests.map((interest, i) => (
                          <span 
                            key={i}
                            className="text-[11px] font-bold bg-[#1f4ee0] text-white px-2.5 py-0.5 rounded-full border border-[#0b1f5c]"
                          >
                            {interest.split(" ")[0]} {interest.split(" ")[1]}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#4a5a8a] italic">
                          Tap activities on the left to add to your pass
                        </span>
                      )}
                    </div>
                    {customGoal && (
                      <p className="text-[11px] text-[#0b1f5c] font-semibold mt-2 italic bg-blue-50 p-2 rounded-lg border border-blue-200">
                        "{customGoal}"
                      </p>
                    )}
                  </div>

                  {/* Security QR / Barcode aesthetic line */}
                  <div className="pt-3 border-t-2 border-dashed border-[#0b1f5c]/40 flex items-center justify-between text-[10px] font-bold text-[#4a5a8a]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Biometric & Escrow Guarantee
                    </span>
                    <span className="font-mono">DELHI-NCR-PASS</span>
                  </div>

                </div>

              </motion.div>

              {/* Direct WhatsApp Concierge Help Card */}
              <div className="mt-4 p-4 bg-white border-[2px] border-[#0b1f5c] rounded-2xl shadow-[3px_3px_0_#0b1f5c] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
                    💬
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-extrabold text-[#0b1f5c]">Need manual booking help?</p>
                    <p className="text-[11px] text-[#4a5a8a] font-medium">Talk to Happy Hangouts Founder Team</p>
                  </div>
                </div>
                <a 
                  href="https://wa.me/918800843189?text=Hi%20Happy%20Hangouts!%20I'd%20like%20assistance%20with%20booking%20a%20hangout%20partner."
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => audio.playClick()}
                  className="btn text-xs py-2 px-3 shrink-0 shadow-[2px_2px_0_#0b1f5c]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Text +91 8800843189
                </a>
              </div>

            </div>

          </div>

          {/* City launch indicator badges */}
          <div className="flex gap-2.5 flex-wrap mt-10">
            <span className="bg-[#ff6b4a] text-white border-[2.5px] border-[#0b1f5c] rounded-full px-3.5 py-1.5 font-bold text-sm shadow-[2px_2px_0_#0b1f5c]">
              📍 Gurugram: Launching First
            </span>
            <span className="bg-white text-[#0b1f5c] border-[2.5px] border-[#0b1f5c] rounded-full px-3.5 py-1.5 font-bold text-sm shadow-[2px_2px_0_#0b1f5c]">
              📍 Delhi: Launching in Parallel
            </span>
          </div>

        </div>
      </section>

      {/* 10. BOOKING INQUIRY MODAL */}
      <AnimatePresence>
        {bookingCompanion && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border-[3px] border-[#0b1f5c] rounded-[26px] p-6 sm:p-8 max-w-lg w-full shadow-[10px_10px_0_#0b1f5c] relative"
            >
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setBookingCompanion(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full border-[2px] border-[#0b1f5c] hover:bg-slate-100 transition-colors cursor-pointer"
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
                    className="btn b w-full py-3 cursor-pointer"
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
                      className="btn b w-full py-3.5 text-base shadow-[4px_4px_0_#0b1f5c] cursor-pointer"
                    >
                      Confirm & Chat on WhatsApp 🙌
                    </button>
                    <p className="text-[11px] text-center text-[#4a5a8a] mt-2 font-medium">
                      Strictly public places. Escrow guarantee. Free cancellation up to 2 hours prior.
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
