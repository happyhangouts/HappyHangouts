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
  Unlock,
  Flame,
  Award,
  Menu,
  ChevronLeft,
  ChevronRight
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
import FaqSection from "./components/FaqSection";

import heroHangoutCafeImg from "./assets/images/hero_hangout_cafe_1794391402838.jpg";
import interestBadmintonCourtImg from "./assets/images/interest_badminton_court_1794643859671.jpg";
import interestPickleballCourtImg from "./assets/images/interest_pickleball_court_1794650754588.jpg";
import interestSunderTrailImg from "./assets/images/interest_sunder_trail_1794643861853.jpg";
import interestSundayPhotowalkImg from "./assets/images/interest_sunday_photowalk_1794650756069.jpg";
import interestAravalliTrekImg from "./assets/images/interest_aravalli_trek_1794643864039.jpg";
import interestWeekendHikeImg from "./assets/images/interest_weekend_hike_1794650755581.jpg";
import interestBoardgamesChaiImg from "./assets/images/interest_boardgames_chai_1794643864116.jpg";
import interestChessCafeImg from "./assets/images/interest_chess_cafe_1794650755399.jpg";
import interestRunningTrackImg from "./assets/images/interest_running_track_1794643865023.jpg";
import interestLodhiJogImg from "./assets/images/interest_lodhi_jog_1794650754028.jpg";
import partnerUjjwalImg from "./assets/images/partner_ujjwal_1794643864904.jpg";
import partnerSonikaImg from "./assets/images/partner_sonika_1794643865588.jpg";
import partnerJyotiImg from "./assets/images/partner_jyoti_1794643866173.jpg";
import partnerFalguniImg from "./assets/images/partner_falguni_1794643867369.jpg";
import partnerAaravImg from "./assets/images/partner_aarav_1794643885821.jpg";
import partnerMeeraImg from "./assets/images/partner_meera_1794643868002.jpg";
import partnerKabirImg from "./assets/images/partner_kabir_1794643868632.jpg";
import partnerAnanyaImg from "./assets/images/partner_ananya_1794643868202.jpg";
import partnerRohanImg from "./assets/images/partner_rohan_1794643868750.jpg";
import partnerDevImg from "./assets/images/partner_dev_1794643869685.jpg";

export type FoundingActivityId = "running" | "rackets" | "hike" | "games_cafe" | "photowalk";
export type FoundingSlotKey = "weekday_mornings" | "weekday_evenings" | "saturday_morning" | "saturday_evening" | "sunday_morning";

// Curated Weekly Experience Model for Gurgaon & Delhi (5 Starting Activities & Slots, Experience-First)
export interface CompanionProfile {
  id: string;
  name: string;
  womenCaptainName: string;
  experienceTitle: string;
  experienceDuration: string;
  emoji: string;
  act: FoundingActivityId;
  categoryLabel: string;
  slotKey: FoundingSlotKey;
  slotLabel: string;
  rating: number;
  city: "Gurugram" | "Delhi";
  location: string;
  vibeText: string;
  goals: string;
  hobbies: string[];
  interestPhoto: string;
  interestPhotoAlt: string;
  partnerPhoto: string;
  partnerPhotoAlt: string;
  bgColor: string;
  badge?: string;
}

export type HangoutDurationKey = "30m" | "1h" | "2h";

const DURATION_OPTIONS: {
  id: HangoutDurationKey;
  pillLabel: string;
  shortLabel: string;
  cardLabel: string;
  price: number;
}[] = [
  { id: "30m", pillLabel: "30 min · ₹199", shortLabel: "30 min", cardLabel: "₹199 · 30 min", price: 199 },
  { id: "1h", pillLabel: "1 hr · ₹299", shortLabel: "1 hr", cardLabel: "₹299 · 1 hr", price: 299 },
  { id: "2h", pillLabel: "2 hrs · ₹499", shortLabel: "2 hrs", cardLabel: "₹499 · 2 hrs", price: 499 }
];

const COMPANIONS: CompanionProfile[] = [
  // 1. Weekday mornings — Running buddy (Gurugram & Delhi)
  {
    id: "p-7",
    name: "Dev Malhotra",
    womenCaptainName: "Riya Verma",
    experienceTitle: "Sunrise 5K Track Pacing & Stretch",
    experienceDuration: "60 min",
    emoji: "🏃",
    act: "running",
    categoryLabel: "Running buddy",
    slotKey: "weekday_mornings",
    slotLabel: "Weekday mornings",
    rating: 4.8,
    city: "Gurugram",
    location: "Tau Devi Lal Park & Sector 52, Gurugram",
    vibeText: "Guided dawn 5K park loops, steady pacing & cooldown stretch.",
    goals: "Lock consistent weekday morning 5K runs before work with zero flakes.",
    hobbies: ["5K track pacing", "Dawn park loops", "Endurance cooldown"],
    interestPhoto: interestRunningTrackImg,
    interestPhotoAlt: "White and blue running shoes, sports watch, and water bottle on a sunrise track",
    partnerPhoto: partnerDevImg,
    partnerPhotoAlt: "Verified Hangout Partner Dev Malhotra after a morning park run",
    bgColor: "#a8f0c6",
    badge: "Weekday AM"
  },
  {
    id: "p-falguni",
    name: "Falguni Baddi",
    womenCaptainName: "Falguni Baddi",
    experienceTitle: "Lodhi Garden 6:30 AM Jog & Loop",
    experienceDuration: "60 min",
    emoji: "🏃",
    act: "running",
    categoryLabel: "Running buddy",
    slotKey: "weekday_mornings",
    slotLabel: "Weekday mornings",
    rating: 4.9,
    city: "Delhi",
    location: "Lodhi Garden Jogging Track, Delhi",
    vibeText: "Easy 6:30 AM conversational jogs, mobility drills & post-run lemon chai.",
    goals: "Build a refreshing weekday morning jogging ritual under Lodhi Garden trees.",
    hobbies: ["Conversational 5K jog", "Mobility warm-ups", "Post-run lemon chai"],
    interestPhoto: interestLodhiJogImg,
    interestPhotoAlt: "Dawn running shoes, fitness watch, and water bottle on a sunlit leafy New Delhi jogging path",
    partnerPhoto: partnerFalguniImg,
    partnerPhotoAlt: "Verified Hangout Partner Falguni Baddi in bright garden sunlight",
    bgColor: "#a8f0c6",
    badge: "Weekday AM"
  },

  // 2. Weekday evenings — Pickleball or badminton (Gurugram & Delhi)
  {
    id: "p-ujjwal",
    name: "Ujjwal Poonia",
    womenCaptainName: "Neha Singh",
    experienceTitle: "After-Work Doubles Badminton Smash",
    experienceDuration: "60 min",
    emoji: "🏸",
    act: "rackets",
    categoryLabel: "Pickleball or badminton",
    slotKey: "weekday_evenings",
    slotLabel: "Weekday evenings",
    rating: 4.9,
    city: "Gurugram",
    location: "Sector 29 & DLF Phase 4, Gurugram",
    vibeText: "High-energy indoor badminton rallies, rotating doubles & net drills.",
    goals: "Unplug after work with competitive indoor court sets and steady rallies.",
    hobbies: ["Badminton doubles", "Footwork drills", "Evening court rallies"],
    interestPhoto: interestBadmintonCourtImg,
    interestPhotoAlt: "Two cobalt badminton rackets and shuttlecocks on an indoor wooden court",
    partnerPhoto: partnerUjjwalImg,
    partnerPhotoAlt: "Verified Hangout Partner Ujjwal Poonia at an indoor badminton lounge",
    bgColor: "#7cc4ff",
    badge: "Weekday PM"
  },
  {
    id: "p-1",
    name: "Aarav Mehta",
    womenCaptainName: "Pooja Nair",
    experienceTitle: "Floodlit Pickleball & Court Rally Hour",
    experienceDuration: "60 min",
    emoji: "🏓",
    act: "rackets",
    categoryLabel: "Pickleball or badminton",
    slotKey: "weekday_evenings",
    slotLabel: "Weekday evenings",
    rating: 4.9,
    city: "Delhi",
    location: "Siri Fort & South Delhi Courts, Delhi",
    vibeText: "Floodlit evening pickleball dinks, fast rallies & beginner-friendly rotation.",
    goals: "Play fast, social evening pickleball or badminton sets across South Delhi courts.",
    hobbies: ["Pickleball matches", "Badminton rallies", "Court drills"],
    interestPhoto: interestPickleballCourtImg,
    interestPhotoAlt: "Two cobalt and yellow pickleball paddles and ball beside a net under evening court floodlights",
    partnerPhoto: partnerAaravImg,
    partnerPhotoAlt: "Verified Hangout Partner Aarav Mehta outdoors by green court trees",
    bgColor: "#7cc4ff",
    badge: "Fast Confirm"
  },

  // 3. Saturday morning — Weekend hike (Gurugram & Delhi NCR)
  {
    id: "p-3",
    name: "Kabir Sen",
    womenCaptainName: "Aditi Rao",
    experienceTitle: "Aravalli Sunrise Ridge Hike & Flask Chai",
    experienceDuration: "90 min",
    emoji: "🥾",
    act: "hike",
    categoryLabel: "Weekend hike",
    slotKey: "saturday_morning",
    slotLabel: "Saturday morning",
    rating: 4.9,
    city: "Gurugram",
    location: "Aravalli Biodiversity Ridge, Gurugram",
    vibeText: "Guided Saturday sunrise ridge hike, scenic viewpoints & hot thermos chai.",
    goals: "Escape city screens for an energizing Saturday dawn hike along the Aravalli ridge.",
    hobbies: ["Ridge hiking", "Scenic viewpoints", "Sunrise flask chai"],
    interestPhoto: interestAravalliTrekImg,
    interestPhotoAlt: "Trail hiking shoes, steel flask, and brass compass overlooking sunlit Aravalli hills",
    partnerPhoto: partnerKabirImg,
    partnerPhotoAlt: "Verified Hangout Partner Kabir Sen on a golden sunrise nature trail",
    bgColor: "#ff6b4a",
    badge: "Saturday AM"
  },
  {
    id: "p-sonika",
    name: "Sonika Sharma",
    womenCaptainName: "Sonika Sharma",
    experienceTitle: "Sanjay Van Forest Trail & Morning Reset",
    experienceDuration: "90 min",
    emoji: "🥾",
    act: "hike",
    categoryLabel: "Weekend hike",
    slotKey: "saturday_morning",
    slotLabel: "Saturday morning",
    rating: 4.9,
    city: "Delhi",
    location: "Sanjay Van & Mangar Bani Trail, Delhi NCR",
    vibeText: "Refreshing Saturday morning forest trail hike, stretching & unhurried chats.",
    goals: "Kick off the weekend outdoors with 10K forest steps and great company.",
    hobbies: ["Forest trail hikes", "Trail stretching", "Thermos masala chai"],
    interestPhoto: interestWeekendHikeImg,
    interestPhotoAlt: "Hiking daypack, steel thermos flask, and trail hat overlooking Aravalli green hills",
    partnerPhoto: partnerSonikaImg,
    partnerPhotoAlt: "Verified Hangout Partner Sonika Sharma outdoors in morning sunlight",
    bgColor: "#ffc933",
    badge: "Saturday AM"
  },

  // 4. Saturday evening — Chess or board games at a café (Gurugram & Delhi)
  {
    id: "p-5",
    name: "Rohan Verma",
    womenCaptainName: "Kriti Malhotra",
    experienceTitle: "32nd Ave Strategy Board Games & Chai",
    experienceDuration: "90 min",
    emoji: "🎲",
    act: "games_cafe",
    categoryLabel: "Chess or board games at a café",
    slotKey: "saturday_evening",
    slotLabel: "Saturday evening",
    rating: 4.8,
    city: "Gurugram",
    location: "32nd Avenue Courtyard Cafés, Gurugram",
    vibeText: "Screen-free Saturday evening Catan, Splendor & courtyard café banter.",
    goals: "Unwind over tactile strategy board games and hot chai in a sunlit café courtyard.",
    hobbies: ["Catan & strategy games", "Café chess", "Kulhad chai banter"],
    interestPhoto: interestBoardgamesChaiImg,
    interestPhotoAlt: "Colorful wooden hex strategy board game with dice and terracotta chai cups",
    partnerPhoto: partnerRohanImg,
    partnerPhotoAlt: "Verified Hangout Partner Rohan Verma at an outdoor courtyard cafe table",
    bgColor: "#7cc4ff",
    badge: "Saturday PM"
  },
  {
    id: "p-2",
    name: "Meera Reddy",
    womenCaptainName: "Meera Reddy",
    experienceTitle: "Khan Market Café Chess & Iced Lattes",
    experienceDuration: "75 min",
    emoji: "♟️",
    act: "games_cafe",
    categoryLabel: "Chess or board games at a café",
    slotKey: "saturday_evening",
    slotLabel: "Saturday evening",
    rating: 4.9,
    city: "Delhi",
    location: "Khan Market & CyberHub Cafés, Delhi NCR",
    vibeText: "Casual over-the-board rapid chess, iced pour-overs & easy weekend talks.",
    goals: "Play 3 relaxed over-the-board chess games at a cozy café table.",
    hobbies: ["Rapid café chess", "Board games", "Iced pour-overs"],
    interestPhoto: interestChessCafeImg,
    interestPhotoAlt: "Classic wooden chess board beside two iced lattes on a warm Saturday evening café table",
    partnerPhoto: partnerMeeraImg,
    partnerPhotoAlt: "Verified Hangout Partner Meera Reddy beside a sunny leafy cafe window",
    bgColor: "#ffc933",
    badge: "Saturday PM"
  },

  // 5. Sunday morning — Photo walk (Delhi & Gurugram)
  {
    id: "p-jyoti",
    name: "Jyoti Nandal",
    womenCaptainName: "Jyoti Nandal",
    experienceTitle: "Sunder Nursery Heritage Photo Walk",
    experienceDuration: "90 min",
    emoji: "📸",
    act: "photowalk",
    categoryLabel: "Photo walk",
    slotKey: "sunday_morning",
    slotLabel: "Sunday morning",
    rating: 5.0,
    city: "Delhi",
    location: "Sunder Nursery & Humayun Tomb Trail, Delhi",
    vibeText: "Sunday sunrise heritage arches, natural light framing & morning chai stop.",
    goals: "Capture calm Mughal architecture on any phone or camera with fellow creators.",
    hobbies: ["35mm & phone framing", "Heritage walks", "Morning masala chai"],
    interestPhoto: interestSunderTrailImg,
    interestPhotoAlt: "Vintage camera, tote bag, and chai cup along a heritage garden cobblestone path",
    partnerPhoto: partnerJyotiImg,
    partnerPhotoAlt: "Verified Hangout Partner Jyoti Nandal in leafy Delhi morning sunlight",
    bgColor: "#a8f0c6",
    badge: "Sunday AM"
  },
  {
    id: "p-11",
    name: "Ananya Kapoor",
    womenCaptainName: "Ananya Kapoor",
    experienceTitle: "Lodhi Murals & Street Frame Photo Walk",
    experienceDuration: "90 min",
    emoji: "📸",
    act: "photowalk",
    categoryLabel: "Photo walk",
    slotKey: "sunday_morning",
    slotLabel: "Sunday morning",
    rating: 4.8,
    city: "Delhi",
    location: "Lodhi Art District & Mehrauli, Delhi",
    vibeText: "Street mural compositions, morning shadow play & creative coffee debrief.",
    goals: "Build a weekly Sunday morning street photography series across Delhi.",
    hobbies: ["Street photography", "Mirrorless & phone", "Art district walks"],
    interestPhoto: interestSundayPhotowalkImg,
    interestPhotoAlt: "Classic silver camera, spare lens, and notebook near sunlit New Delhi Mughal garden arches",
    partnerPhoto: partnerAnanyaImg,
    partnerPhotoAlt: "Verified Hangout Partner Ananya Kapoor outside a sunlit Delhi garden cafe",
    bgColor: "#ffc933",
    badge: "Sunday AM"
  }
];

const ROTATING_WORDS = [
  "running buddies",
  "pickleball or badminton",
  "weekend hikes",
  "chess & board games",
  "Sunday photo walks"
];

const MARQUEE_ITEMS = [
  "1st Hangout 100% Free",
  "Weekday Mornings: Running Buddy",
  "Weekday Evenings: Pickleball or Badminton",
  "Saturday Morning: Weekend Hike",
  "Saturday Evening: Chess or Board Games at a Café",
  "Sunday Morning: Photo Walk",
  "100% Govt ID Verified Humans",
  "Interest-First Photo Privacy",
  "Strictly Public Safe Meetups"
];

const CATEGORIES: { id: "all" | FoundingActivityId; label: string; slot?: string }[] = [
  { id: "all", label: "All 5 Activities" },
  { id: "running", label: "Running buddy", slot: "Weekday mornings" },
  { id: "rackets", label: "Pickleball or badminton", slot: "Weekday evenings" },
  { id: "hike", label: "Weekend hike", slot: "Saturday morning" },
  { id: "games_cafe", label: "Chess or board games at a café", slot: "Saturday evening" },
  { id: "photowalk", label: "Photo walk", slot: "Sunday morning" }
];

export const FORM_INTERESTS_OPTIONS = [
  { id: "running", label: "Running buddy", desc: "Weekday mornings · 5K/10K park pacing" },
  { id: "rackets", label: "Pickleball or badminton", desc: "Weekday evenings · Courts & rallies" },
  { id: "hike", label: "Weekend hike", desc: "Saturday morning · Aravalli & forest trails" },
  { id: "games_cafe", label: "Chess or board games at a café", desc: "Saturday evening · Strategy & café banter" },
  { id: "photowalk", label: "Photo walk", desc: "Sunday morning · Heritage & street frames" }
];

export const QUICK_HUBS = {
  Gurugram: [
    "Sector 29 Courts",
    "Tau Devi Lal Park",
    "Aravalli Ridge Trail",
    "32nd Avenue Cafés",
    "DLF CyberHub"
  ],
  Delhi: [
    "Lodhi Garden Track",
    "Siri Fort Complex",
    "Sanjay Van Trail",
    "Khan Market Cafés",
    "Sunder Nursery Park"
  ]
};

export const TIME_SLOT_OPTIONS = [
  { id: "weekday_mornings", label: "Weekday mornings — Running buddy", time: "Weekday mornings", icon: "🏃", tag: "Running buddy" },
  { id: "weekday_evenings", label: "Weekday evenings — Pickleball or badminton", time: "Weekday evenings", icon: "🏸", tag: "Pickleball or badminton" },
  { id: "saturday_morning", label: "Saturday morning — Weekend hike", time: "Saturday morning", icon: "🥾", tag: "Weekend hike" },
  { id: "saturday_evening", label: "Saturday evening — Chess or board games at a café", time: "Saturday evening", icon: "♟️", tag: "Chess or board games at a café" },
  { id: "sunday_morning", label: "Sunday morning — Photo walk", time: "Sunday morning", icon: "📸", tag: "Photo walk" }
];

// Floating Scroll Spy Sections
const SECTIONS = [
  { id: "top", label: "01", name: "Welcome" },
  { id: "match", label: "02", name: "Experiences" },
  { id: "how", label: "03", name: "3 Steps" },
  { id: "pricing", label: "04", name: "Pricing" },
  { id: "videos", label: "05", name: "NCR Stories" },
  { id: "radar", label: "06", name: "Live Radar" },
  { id: "safe", label: "07", name: "Safety" },
  { id: "earn", label: "08", name: "Host" },
  { id: "join", label: "09", name: "Hangout Pass" },
  { id: "faq", label: "10", name: "FAQ" }
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Filters for experiences directory
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState<"all" | "Gurugram" | "Delhi">("all");
  const [womenOnlyFilter, setWomenOnlyFilter] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<HangoutDurationKey>("1h");
  const [timeFilter, setTimeFilter] = useState<"any" | FoundingSlotKey>("any");
  const [minRating, setMinRating] = useState(0);

  // Earnings Calculator State (30m, 1h, 2h hangouts per week)
  const [calcN30, setCalcN30] = useState(4);
  const [calcN60, setCalcN60] = useState(4);
  const [calcN120, setCalcN120] = useState(1);

  // Waitlist form state (both WhatsApp and Email required)
  const [waitlistRole, setWaitlistRole] = useState<"seeker" | "partner">("seeker");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistWhatsapp, setWaitlistWhatsapp] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistCity, setWaitlistCity] = useState<"Gurugram" | "Delhi">("Gurugram");
  const [waitlistLocation, setWaitlistLocation] = useState("Sector 29 Courts");
  const [waitlistTime, setWaitlistTime] = useState("Weekday evenings — Pickleball or badminton");
  const [waitlistInterests, setWaitlistInterests] = useState<string[]>([
    "Running buddy",
    "Pickleball or badminton"
  ]);
  const [waitlistWomenOnly, setWaitlistWomenOnly] = useState(false);
  const [customGoal, setCustomGoal] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<string | null>(null);
  const [submittedPass, setSubmittedPass] = useState<{
    passId: string;
    role: "seeker" | "partner";
    name: string;
    whatsapp: string;
    email: string;
    city: "Gurugram" | "Delhi";
    location: string;
    time: string;
    interests: string[];
    customGoal: string;
    womenOnly: boolean;
  } | null>(null);
  const passPreviewRef = useRef<HTMLDivElement>(null);
  const matchCarouselRef = useRef<HTMLDivElement>(null);

  // Booking Modal State
  const [bookingCompanion, setBookingCompanion] = useState<CompanionProfile | null>(null);
  const [bookingDate, setBookingDate] = useState("Next matching day");
  const [bookingTime, setBookingTime] = useState("Weekday evenings");
  const [bookingStartHour, setBookingStartHour] = useState("5:00 PM");
  const [bookingLocation, setBookingLocation] = useState("");
  const [bookingWomenOnly, setBookingWomenOnly] = useState(false);
  const [womenOnlyConfirmed, setWomenOnlyConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  // Interest-First Photo Privacy: partner real photos unlock ONLY after partner accepts request
  const [unlockedPartnerIds, setUnlockedPartnerIds] = useState<string[]>([]);
  const [showHobbyMap, setShowHobbyMap] = useState<Record<string, boolean>>({});

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

  // Waitlist submission handler (All required details must be completed before revealing Live Pass)
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!waitlistName.trim() || waitlistName.trim().length < 2) {
      audio.playToggle();
      setWaitlistStatus("⚠️ Please enter your full name (min 2 characters).");
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

    if (!waitlistLocation.trim()) {
      audio.playToggle();
      setWaitlistStatus("⚠️ Please choose or enter your preferred NCR meeting hub.");
      return;
    }

    if (waitlistInterests.length === 0) {
      audio.playToggle();
      setWaitlistStatus("⚠️ Please pick at least 1 weekly experience you want on your pass.");
      return;
    }

    audio.playSuccess();
    const finalInterests = waitlistInterests.join(", ") +
      (waitlistWomenOnly ? " · [Women-Only Preference]" : "") +
      (customGoal.trim() ? ` · Goal: ${customGoal.trim()}` : "");

    const passCode = `#HH-${cleanPhone.slice(-4)}-${Math.floor(10 + Math.random() * 89)}`;

    setSubmittedPass({
      passId: passCode,
      role: waitlistRole,
      name: waitlistName.trim(),
      whatsapp: cleanPhone.slice(-10),
      email: waitlistEmail.trim(),
      city: waitlistCity,
      location: waitlistLocation.trim(),
      time: waitlistTime,
      interests: [...waitlistInterests],
      customGoal: customGoal.trim(),
      womenOnly: waitlistWomenOnly
    });

    triggerBoom(`Pass Unlocked for ${waitlistName.trim()}! 🎉`);

    setTimeout(() => {
      passPreviewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);

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
        womenOnly: waitlistWomenOnly,
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

    setWaitlistStatus(`🎉 Pass Activated (${passCode})! Coordinator will coordinate on WhatsApp +91 ${cleanPhone.slice(-10)} and email ${waitlistEmail}.`);
  };

  // Helper: compute minimum 2 hours prior request cutoff label
  const getAdvanceCutoffLabel = (startLabel: string) => {
    const map: Record<string, string> = {
      "6:30 AM": "4:30 AM (or night before)",
      "7:30 AM": "5:30 AM (or night before)",
      "5:00 PM": "3:00 PM latest",
      "6:30 PM": "4:30 PM latest",
      "7:30 PM": "5:30 PM latest"
    };
    return map[startLabel] || "at least 2 hours before";
  };

  const activeDuration = DURATION_OPTIONS.find((d) => d.id === selectedDuration) || DURATION_OPTIONS[1];

  // Open booking modal
  const handleOpenBooking = (companion: CompanionProfile) => {
    audio.playClick();
    setBookingCompanion(companion);
    setBookingLocation(companion.location);
    setBookingTime(companion.slotLabel);
    setBookingStartHour(
      companion.slotKey === "weekday_mornings" || companion.slotKey === "sunday_morning"
        ? "7:30 AM"
        : companion.slotKey === "saturday_morning"
        ? "6:30 AM"
        : "5:00 PM"
    );
    setBookingWomenOnly(womenOnlyFilter);
    setWomenOnlyConfirmed(false);
    setBookingError(null);
    setBookingDate(
      companion.slotKey === "saturday_morning" || companion.slotKey === "saturday_evening"
        ? "This Saturday"
        : companion.slotKey === "sunday_morning"
        ? "This Sunday"
        : "Tomorrow (Weekday)"
    );
    setBookingSuccess(false);
    setIsDispatching(false);
    // Track Google Analytics companion inspection / booking initiation
    analytics.trackBookingClick(companion.name, companion.location, activeDuration.price);
  };

  // Confirm booking & trigger live dispatch
  const handleConfirmBooking = () => {
    if (!bookingCompanion) return;
    if (bookingWomenOnly && !womenOnlyConfirmed) {
      audio.playToggle();
      setBookingError("⚠️ Women-Only Booking is strictly for women only. Please tick the confirmation box below to continue.");
      return;
    }
    setBookingError(null);
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
    const matchesRating = p.rating >= minRating;
    const matchesTime = timeFilter === "any" || p.slotKey === timeFilter;
    return matchesCategory && matchesCity && matchesRating && matchesTime;
  });

  // Calculate monthly earnings estimate (80% partner share: ₹159 for 30m, ₹239 for 1h, ₹399 for 2h)
  const monthlyTakeHome = Math.round((calcN30 * 159 + calcN60 * 239 + calcN120 * 399) * 4.3);

  const scrollToSection = (id: string) => {
    audio.playPageTransition();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-[#3DAAFC]/30 selection:text-[#011C92] relative bg-[#F3F7FF] text-[#0B1230] overflow-x-hidden">
      
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

      {/* 0.3 LAUNCH PRIVILEGE ANNOUNCEMENT BANNER (Highlighted Sunshine Strip) */}
      <div className="bg-[#FFC83D] text-[#0B1230] px-3 sm:px-5 py-2.5 text-center text-xs sm:text-sm font-semibold flex items-center justify-center flex-wrap gap-x-2.5 gap-y-1 relative z-40 border-b-2 border-[#0A2EB8]/20 leading-snug shadow-sm">
        <span className="inline-flex items-center gap-1 bg-[#011C92] text-[#FFC83D] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0">
          Launch Offer
        </span>
        <span className="font-bold text-[#0B1230]">
          Your 1st hangout is{" "}
          <span className="bg-[#0A2EB8] text-white px-2 py-0.5 rounded font-extrabold tracking-tight mx-0.5">
            100% FREE
          </span>{" "}
          to build mutual trust.
        </span>
        <a 
          href="#match" 
          onClick={() => audio.playClick()} 
          className="inline-flex items-center gap-1 font-extrabold text-[#011C92] hover:text-[#0A2EB8] underline decoration-2 underline-offset-2 whitespace-nowrap ml-1"
        >
          Book 1st Free Hangout →
        </a>
      </div>

      {/* 1. TOP NAVBAR (Light, airy Cloud & White with Hangout Blue branding) */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0A2EB8]/10 transition-colors text-[#0B1230]">
        <div className="wrap flex items-center justify-between h-14 sm:h-16 gap-3">
          
          {/* Logo with official image emblem & Roman brand wordmark */}
          <a 
            href="#top" 
            onClick={() => {
              audio.playClick();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 sm:gap-3 no-underline group min-w-0 shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-[#0A2EB8]/20 shadow-sm shrink-0 bg-white">
              <img 
                src="/assets/aistudio/Happy_Hangouts_Logo_1d102f6e.jpg" 
                alt="Happy Hangouts Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="font-serif text-lg sm:text-[22px] tracking-tight text-[#0A2EB8] leading-none font-bold whitespace-nowrap">
                Happy Hangouts
              </span>
              <span className="hidden sm:flex text-[11px] font-medium text-[#0B1230]/70 mt-1 tracking-tight items-center gap-1 whitespace-nowrap">
                <span>Akele kyu?</span>
                <span className="text-[#0A2EB8] font-bold">Happy Hangouts Hai na!!</span>
              </span>
            </div>
          </a>

          {/* Nav links (visible cleanly on tablet md+ and desktop lg+) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <a 
              href="#match" 
              onClick={() => audio.playClick()}
              className="text-sm font-semibold text-[#0B1230]/80 hover:text-[#0A2EB8] transition-colors whitespace-nowrap"
            >
              Experiences
            </a>
            <a 
              href="#pricing" 
              onClick={() => audio.playClick()}
              className="text-sm font-semibold text-[#0B1230]/80 hover:text-[#0A2EB8] transition-colors whitespace-nowrap"
            >
              Pricing
            </a>
            <a 
              href="#videos" 
              onClick={() => audio.playClick()}
              className="text-sm font-semibold text-[#0B1230]/80 hover:text-[#0A2EB8] transition-colors whitespace-nowrap"
            >
              Stories
            </a>
            <a 
              href="#radar" 
              onClick={() => audio.playClick()}
              className="text-sm font-semibold text-[#0B1230]/80 hover:text-[#0A2EB8] transition-colors whitespace-nowrap"
            >
              Live Radar
            </a>
            <a 
              href="#safe" 
              onClick={() => audio.playClick()}
              className="text-sm font-semibold text-[#0B1230]/80 hover:text-[#0A2EB8] transition-colors whitespace-nowrap"
            >
              Safety
            </a>
            <a 
              href="#faq" 
              onClick={() => audio.playClick()}
              className="text-sm font-semibold text-[#0B1230]/80 hover:text-[#0A2EB8] transition-colors whitespace-nowrap"
            >
              FAQ
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Audio Toggle Button */}
            <button
              type="button"
              onClick={handleToggleSound}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              className={`min-w-[40px] min-h-[40px] p-2 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                isMuted ? "bg-[#0A2EB8]/5 text-[#0B1230]/60 border-[#0A2EB8]/15 hover:bg-[#0A2EB8]/10" : "bg-[#FFC83D] text-[#0B1230] border-[#FFC83D] shadow-sm"
              }`}
              title={isMuted ? "Click to enable sound" : "Sound enabled"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Primary CTA on Tablet/Desktop */}
            <a 
              href="#match" 
              onClick={() => audio.playClick()}
              className="hidden sm:inline-flex items-center justify-center bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-xs sm:text-sm py-2 px-4 sm:px-5 rounded-full shadow-[0_3px_10px_rgba(255,200,61,0.4)] transition-all hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
            >
              Explore Experiences
            </a>

            {/* Mobile Menu Button (< md) */}
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setMobileMenuOpen((prev) => !prev);
              }}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              className="md:hidden min-w-[42px] min-h-[42px] p-2 rounded-xl border border-[#0A2EB8]/20 bg-[#F3F7FF] text-[#0A2EB8] flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-Down Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-[#0A2EB8]/10 bg-white overflow-hidden shadow-lg"
            >
              <div className="wrap py-3 flex flex-col gap-1">
                {[
                  { label: "Experiences", href: "#match" },
                  { label: "Pricing (From ₹199)", href: "#pricing" },
                  { label: "Experience Stories", href: "#videos" },
                  { label: "Live Hangouts Radar", href: "#radar" },
                  { label: "4-Pillar Safety", href: "#safe" },
                  { label: "Host an Experience", href: "#earn" },
                  { label: "Get Hangout Pass", href: "#join" },
                  { label: "Security, Payment & Refund FAQ", href: "#faq" }
                ].map((navItem) => (
                  <a
                    key={navItem.href}
                    href={navItem.href}
                    onClick={() => {
                      audio.playClick();
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-xl text-sm font-semibold text-[#0B1230] hover:bg-[#F3F7FF] hover:text-[#0A2EB8] transition-colors flex items-center justify-between"
                  >
                    <span>{navItem.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#0A2EB8]/60" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. EXPANSIVE BRAND HERO SECTION (Light Cloud & White surface, Hangout Blue & Ink typography) */}
      <header 
        id="top" 
        className="relative py-6 sm:py-12 lg:py-20 overflow-hidden bg-gradient-to-b from-[#F3F7FF] via-white to-[#F3F7FF] text-[#0B1230] border-b border-[#0A2EB8]/10"
      >
        <div className="wrap">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Brand Mock Structure */}
            <div className="lg:col-span-7 flex flex-col items-start text-left min-w-0">
              
              {/* Location & Launch Kicker */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap mb-4 sm:mb-5">
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] font-extrabold text-[#0A2EB8]">
                  Gurugram & Delhi NCR
                </span>
                <span className="text-[#0B1230]/30">·</span>
                <span className="text-[11px] sm:text-xs font-bold text-[#0B1230]/80">
                  5 Curated Weekly Experiences
                </span>
                <span className="text-[#0B1230]/30">·</span>
                <span className="bg-[#FFC83D] text-[#0B1230] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                  1st Hangout Free
                </span>
              </div>

              {/* High Contrast Editorial Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="font-serif text-[32px] min-[400px]:text-[36px] sm:text-[54px] md:text-[64px] lg:text-[74px] text-[#0B1230] font-normal tracking-tight leading-[1.12] max-w-2xl break-words"
              >
                You bring the <br />
                <CircledHighlight circleColor="#3DAAFC" className="my-1">
                  <span className="text-[#0A2EB8] font-bold">{ROTATING_WORDS[wordIndex]}.</span>
                </CircledHighlight> <br />
                We curate the experience.
              </motion.h1>

              {/* Exact Brand Subtitle with Rich Contrast */}
              <motion.p 
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="text-sm sm:text-lg lg:text-xl text-[#0B1230]/80 font-normal leading-relaxed mt-5 sm:mt-6 mb-4 sm:mb-5 max-w-xl"
              >
                Skip awkward profile browsing. Pick one of 5 curated offline experiences in Gurgaon &amp; Delhi — from 30 minutes to a full afternoon — with verified Hangout Partners. Pay per hangout, from ₹199 (request at least 2 hours prior).
              </motion.p>

              {/* Highlighted Launch Offer Callout Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-xl mb-6 sm:mb-7 rounded-2xl bg-[#FFC83D]/25 border-2 border-[#FFC83D] px-4 py-3.5 shadow-sm flex items-start sm:items-center justify-between gap-3 flex-wrap"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="bg-[#0A2EB8] text-[#FFC83D] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 mt-0.5 sm:mt-0">
                    Launch Offer
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#0B1230] leading-snug">
                    Your 1st hangout is{" "}
                    <span className="bg-[#FFC83D] text-[#0B1230] px-1.5 py-0.5 rounded font-extrabold">
                      100% FREE
                    </span>{" "}
                    to build mutual trust.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-[#19C37D] text-[#0B1230] text-[11px] font-extrabold px-2.5 py-1 rounded-full shrink-0">
                  ₹0 Booking Fee
                </span>
              </motion.div>

              {/* Action Buttons & Experience Assurance */}
              <motion.div 
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
              >
                {/* Sunshine Primary Button */}
                <a 
                  href="#match" 
                  onClick={() => audio.playClick()}
                  className="bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-sm sm:text-base py-3.5 px-7 sm:px-8 rounded-full shadow-[0_6px_20px_rgba(255,200,61,0.45)] hover:shadow-[0_8px_24px_rgba(255,200,61,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 cursor-pointer select-none min-h-[48px]"
                >
                  <span>Explore Experiences →</span>
                </a>

                {/* Secondary Outlined Button */}
                <a 
                  href="#join" 
                  onClick={() => {
                    audio.playClick();
                    setWaitlistRole("partner");
                  }}
                  className="border-2 border-[#0A2EB8] bg-white hover:bg-[#0A2EB8] text-[#0A2EB8] hover:text-white font-bold text-sm sm:text-base py-3.5 px-7 sm:px-8 rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 cursor-pointer select-none min-h-[48px]"
                >
                  <span>Host an Experience</span>
                </a>
              </motion.div>

              {/* Verified Experience Badge (Light Surface Badge) */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-5 sm:mt-6 inline-flex flex-wrap items-center gap-2 bg-white text-[#0B1230] px-3.5 sm:px-4 py-2.5 rounded-xl shadow-md border border-[#0A2EB8]/15"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#19C37D] shrink-0 shadow-sm"></span>
                <span className="font-bold text-xs tracking-tight text-[#0B1230]">Curated Public Experiences</span>
                <span className="text-[11px] sm:text-xs text-[#0B1230]/65 sm:ml-1 font-medium">Govt-ID Screened Hosts & Venues</span>
              </motion.div>

            </div>

            {/* Right Column (shown first on mobile so hero photo is never buried at bottom) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="lg:col-span-5 relative min-w-0 order-first lg:order-last"
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#0A2EB8]/20 shadow-2xl bg-[#0B1230] min-h-[270px] sm:min-h-[340px] lg:min-h-[410px]">
                <img 
                  src={heroHangoutCafeImg} 
                  alt="Friends enjoying coffee and honest conversation at Hazel and Oak Cafe in Delhi NCR"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Measured Dark Scrim for High-Contrast Legibility */}
                <div className="absolute inset-0 bg-[#0B1230]/45" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#011C92]/95 via-[#0B1230]/75 to-[#0B1230]/50" />

                {/* Clear Structured Info Overlay on Darkened Photo */}
                <div className="relative z-10 h-full min-h-[270px] sm:min-h-[340px] lg:min-h-[410px] p-4 sm:p-6 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-[#19C37D] text-[#0B1230] px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Public Venues</span>
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center bg-white text-[#0B1230] px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-md -rotate-2 border border-[#0A2EB8]/15">
                        ☕ From ₹199
                      </span>
                      <span className="inline-flex items-center bg-[#FFC83D] text-[#0B1230] px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-sm">
                        1st Hangout FREE
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-8">
                    <div className="inline-block text-[11px] uppercase tracking-[0.14em] font-extrabold text-[#3DAAFC]">
                      Hazel &amp; Oak Café · Khan Market &amp; NCR
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                      Real-world offline rituals across parks, courts &amp; cafés.
                    </h2>
                    <ul className="space-y-1.5 text-xs sm:text-[13px] font-semibold text-white/95 bg-[#0B1230]/60 backdrop-blur-xs border border-white/15 rounded-xl p-3">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#19C37D] shrink-0" />
                        <span>5 curated weekly slots · Min. 2 hrs prior request</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC83D] shrink-0" />
                        <span>Govt-ID verified Hangout Partners · Women-Only (for women)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-[#FFC83D] fill-[#FFC83D] shrink-0" />
                        <span>4.9/5 average experience rating across 3,400+ meets</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Key Trust Counters Strip (UNOBSTRUCTED: 3,400+ NCR Experiences Hosted is 100% visible) */}
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
              <div className="text-xs sm:text-sm font-semibold text-[#0B1230]/75 mt-1">Public Venues & ID Verified</div>
            </div>

            <div className="pr-4">
              <div className="font-serif text-3xl sm:text-4xl text-[#0A2EB8] font-bold">
                <AnimatedCounter value={0} prefix="₹" suffix=" Risk" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#0B1230]/75 mt-1">Launch Free Guarantee</div>
            </div>

            <div className="pr-4">
              <div className="font-serif text-3xl sm:text-4xl text-[#0A2EB8] font-bold">
                4.9 / 5.0
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#0B1230]/75 mt-1">Experience Rating</div>
            </div>

            <div>
              <div className="font-serif text-3xl sm:text-4xl text-[#0A2EB8] font-bold">
                <AnimatedCounter value={3400} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#0B1230]/75 mt-1">NCR Experiences Hosted</div>
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
              Experience-First · Zero Profile Browsing
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1230] font-normal tracking-tight">
              Pick an <CircledHighlight circleColor="#3DAAFC">experience</CircledHighlight>, not a profile.
            </h2>
            <p className="text-[#0B1230]/75 text-base sm:text-lg max-w-2xl mt-3 font-normal">
              Choose by curated activity, weekly time slot, and public venue. Send your request at least 2 hours prior (e.g., by 3:00 PM for a 5:00 PM hangout) so a Govt-ID vetted Hangout Partner confirms cleanly.
            </p>
            <div className="mt-4 inline-flex items-center gap-2.5 bg-white border border-[#0A2EB8]/15 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#0B1230] shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#19C37D] shrink-0" />
              <span>
                Every card highlights the <strong className="text-[#0A2EB8]">real experience, venue &amp; schedule</strong> — Hangout Partner details unlock once confirmed.
              </span>
            </div>
          </motion.div>

          {/* Category Chips with Horizontal Touch Scroller on Mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex sm:flex-wrap gap-2 overflow-x-auto pb-2.5 -mx-4 px-4 sm:mx-0 sm:px-0 mb-3 scrollbar-none"
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

          {/* City Selection + Women-Only Booking Trust Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="flex items-center justify-between flex-wrap gap-3 mb-6"
          >
            <div className="flex items-center flex-wrap gap-2">
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
            </div>

            {/* Women-Only Booking Trust Option */}
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setWomenOnlyFilter((prev) => !prev);
              }}
              aria-pressed={womenOnlyFilter}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-xs font-extrabold transition-all cursor-pointer min-h-[40px] ${
                womenOnlyFilter
                  ? "bg-[#011C92] text-[#FFC83D] border-[#011C92] shadow-md"
                  : "bg-white text-[#0B1230] border-[#0A2EB8]/25 hover:border-[#0A2EB8]"
              }`}
            >
              <span>👩 Women-Only Booking</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                womenOnlyFilter ? "bg-[#19C37D] text-[#0B1230]" : "bg-[#19C37D]/15 text-[#19C37D]"
              }`}>
                {womenOnlyFilter ? "ON · Women Only" : "For Women Only"}
              </span>
            </button>
          </motion.div>

          {womenOnlyFilter && (
            <div className="mb-6 bg-[#011C92] text-white rounded-2xl p-3.5 sm:p-4 flex items-center justify-between flex-wrap gap-2 shadow-sm">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#19C37D] shrink-0" />
                <span>
                  <strong className="text-[#FFC83D]">Women-Only Mode (Exclusively for Women):</strong> Available strictly for women attendees, matched only with an Aadhaar-verified Female Hangout Partner.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setWomenOnlyFilter(false);
                }}
                className="text-[11px] font-bold text-[#3DAAFC] hover:underline cursor-pointer shrink-0"
              >
                Switch to All
              </button>
            </div>
          )}

          {/* Filter Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="ctl"
          >
            {/* Duration Pill Selector (Fixed Hangout Pricing) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
              <span className="text-sm font-semibold text-[#0B1230] shrink-0">Duration</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {DURATION_OPTIONS.map((dur) => {
                  const isActive = selectedDuration === dur.id;
                  return (
                    <button
                      key={dur.id}
                      type="button"
                      onClick={() => {
                        audio.playClick();
                        setSelectedDuration(dur.id);
                      }}
                      aria-pressed={isActive}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                        isActive
                          ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-xs"
                          : "bg-[#F3F7FF] text-[#0B1230] border-[#0A2EB8]/20 hover:border-[#0A2EB8]"
                      }`}
                    >
                      {dur.pillLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* When / Weekly Slot Filter */}
            <label className="flex items-center gap-3">
              <span>When</span>
              <select 
                value={timeFilter}
                onChange={(e) => {
                  audio.playClick();
                  setTimeFilter(e.target.value as any);
                }}
              >
                <option value="any">All 5 Weekly Slots</option>
                <option value="weekday_mornings">Weekday mornings (Running buddy)</option>
                <option value="weekday_evenings">Weekday evenings (Pickleball / Badminton)</option>
                <option value="saturday_morning">Saturday morning (Weekend hike)</option>
                <option value="saturday_evening">Saturday evening (Chess / Board games)</option>
                <option value="sunday_morning">Sunday morning (Photo walk)</option>
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

          {/* Mobile Horizontal Right-Scroll Cue for Experiences */}
          <div className="flex md:hidden items-center justify-between gap-2 mb-3 bg-white border border-[#0A2EB8]/15 rounded-xl px-3.5 py-2.5 shadow-xs">
            <span className="text-xs font-extrabold text-[#0A2EB8]">
              {filteredCompanions.length} Curated Experiences · Scroll right
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  matchCarouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
                }}
                aria-label="Scroll experiences left"
                className="w-8 h-8 rounded-full border border-[#0A2EB8]/20 bg-[#F3F7FF] text-[#0A2EB8] flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  matchCarouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });
                }}
                aria-label="Scroll experiences right"
                className="w-8 h-8 rounded-full bg-[#FFC83D] text-[#0B1230] flex items-center justify-center cursor-pointer shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Experience Cards: Horizontal Right-Scroll on Mobile, Grid on Tablet/Desktop */}
          <div
            ref={matchCarouselRef}
            className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-3 scroll-smooth scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:overflow-visible"
          >
            {filteredCompanions.length > 0 ? (
              filteredCompanions.map((comp, idx) => {
                const isUnlocked = unlockedPartnerIds.includes(comp.id);

                return (
                <motion.div 
                  key={comp.id} 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (idx % 4) * 0.06 }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  className="w-[290px] sm:w-[320px] md:w-auto shrink-0 snap-start bg-white border border-[#0A2EB8]/15 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#3DAAFC]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Experience Visual Showcase (Locked Height for Cross-Browser Mobile Stability) */}
                    <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-[#0B1230] shrink-0">
                      <img
                        src={comp.interestPhoto}
                        alt={comp.interestPhotoAlt}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1230]/85 via-[#0B1230]/20 to-black/25" />

                      {/* Top Tags Bar */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#0A2EB8] px-2 py-0.5 rounded-md shadow-xs truncate max-w-[48%]">
                          {comp.categoryLabel}
                        </span>
                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 bg-[#19C37D] text-[#0B1230] px-2 py-0.5 rounded-md text-[10px] font-extrabold shadow-xs shrink-0">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Confirmed</span>
                          </span>
                        ) : womenOnlyFilter ? (
                          <span className="inline-flex items-center gap-1 bg-[#FFC83D] text-[#0B1230] px-2 py-0.5 rounded-md text-[10px] font-extrabold shadow-xs shrink-0">
                            <span>👩 Women-Only</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-[#0B1230]/85 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0">
                            <span>{activeDuration.shortLabel}</span>
                          </span>
                        )}
                      </div>

                      {/* Bottom Schedule Caption inside Photo */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 text-white">
                        <span className="text-[11px] font-semibold truncate">
                          {comp.slotLabel}
                        </span>
                        <span className="text-[11px] font-bold bg-black/60 px-2 py-0.5 rounded shrink-0">
                          ⭐ {comp.rating}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 sm:p-5 space-y-2.5 sm:space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-serif text-base sm:text-xl font-semibold text-[#0B1230] leading-snug line-clamp-2">
                            {comp.experienceTitle}
                          </h3>
                          <p className="text-xs text-[#0B1230]/65 mt-0.5 sm:mt-1 font-medium truncate">
                            📍 {comp.location}
                          </p>
                        </div>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#0A2EB8]/15 bg-[#F3F7FF] flex items-center justify-center text-base shrink-0">
                          {comp.emoji}
                        </div>
                      </div>

                      {/* What You'll Experience */}
                      <div className="bg-[#F3F7FF] border border-[#0A2EB8]/10 rounded-xl p-2 sm:p-2.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0A2EB8] block mb-0.5">
                          What You'll Experience
                        </span>
                        <p className="text-xs text-[#0B1230]/85 font-medium leading-snug line-clamp-2 sm:line-clamp-none">
                          {comp.vibeText}
                        </p>
                      </div>

                      {/* Experience Highlights */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B1230]/50 block mb-1">
                          Experience Highlights
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {comp.hobbies.map((hobby) => (
                            <span
                              key={hobby}
                              className="text-[10px] sm:text-[11px] font-semibold text-[#0A2EB8] bg-[#F3F7FF] border border-[#0A2EB8]/15 px-2 py-0.5 rounded-md"
                            >
                              {hobby}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] text-[#0B1230]/65 font-medium">
                        {isUnlocked
                          ? `Hangout Partner assigned: ${womenOnlyFilter ? comp.womenCaptainName : comp.name} · ID Verified`
                          : womenOnlyFilter
                          ? `👩 Female Hangout Partner (${comp.womenCaptainName}) · Women Only`
                          : `Women-Only (women) & Open options · ★ ${comp.rating}`}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer & CTA */}
                  <div className="px-3.5 sm:px-5 pb-3.5 sm:pb-5 pt-2 border-t border-[#F3F7FF]">
                    <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-extrabold text-[#0A2EB8] bg-[#F3F7FF] border border-[#0A2EB8]/15 px-2 py-0.5 rounded tabular-nums">
                          {activeDuration.cardLabel}
                        </span>
                        <span className="font-bold text-[#19C37D] bg-[#19C37D]/10 px-1.5 py-0.5 rounded text-[10px]">
                          1st Free
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#0A2EB8] bg-[#F3F7FF] border border-[#0A2EB8]/15 px-2 py-0.5 rounded-md truncate">
                        {comp.city}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#0B1230]/60 font-medium mb-2.5">
                      Hitting it off? Extend anytime.
                    </p>

                    <button 
                      type="button"
                      onClick={() => handleOpenBooking(comp)}
                      className="w-full py-3 px-4 text-xs sm:text-sm font-extrabold cursor-pointer bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] rounded-full shadow-[0_3px_10px_rgba(255,200,61,0.35)] hover:shadow-[0_5px_15px_rgba(255,200,61,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5"
                    >
                      <span>
                        {isUnlocked
                          ? "⚡ Book Experience Again"
                          : womenOnlyFilter
                          ? "👩 Book Women-Only Spot"
                          : "⚡ Book This Experience"}
                      </span>
                    </button>
                  </div>
                </motion.div>
                );
              })
            ) : (
              <div className="w-full shrink-0 col-span-full text-center p-12 border border-dashed border-[#0A2EB8]/25 rounded-2xl bg-white">
                <p className="font-serif text-xl text-[#0B1230] font-medium">
                  No experiences found for this filter in Gurugram or Delhi.
                </p>
                <p className="text-[#0B1230]/60 text-sm mt-2 max-w-md mx-auto font-normal">
                  Try selecting "All 5 Weekly Slots" or "Both Cities" — new weekly experiences open every week.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setSelectedCategory("all");
                    setSelectedCity("all");
                    setSelectedDuration("1h");
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
              <h3 className="font-serif text-2xl text-[#0B1230] font-medium mb-2">Pick one of 5 activities</h3>
              <p className="text-[#0B1230]/75 text-sm leading-relaxed font-normal">
                Choose Running buddy, Pickleball or badminton, Weekend hike, Chess/board games at a café, or Sunday Photo walk with its matched weekly slot.
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
              <h3 className="font-serif text-2xl text-[#0B1230] font-medium mb-2">Request 2+ hrs prior &amp; lock venue</h3>
              <p className="text-[#0B1230]/75 text-sm leading-relaxed font-normal">
                Send your request at least 2 hours before start time (e.g., request by 3 PM for a 5 PM hangout). A Govt-ID vetted Hangout Partner confirms and unlocks check-in details. Note: no last-hour cancellations.
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
                <span>Show up &amp; live the vibe</span>
                <span className="text-xs bg-[#19C37D]/15 text-[#19C37D] px-2.5 py-0.5 rounded-full font-sans font-bold">1st Free</span>
              </h3>
              <p className="text-[#0B1230]/75 text-sm leading-relaxed font-normal">
                Meet in vibrant cafés, courts, parks, or trails. Your 1st hangout is 100% free (₹0 fee) to build mutual trust and 5-star community reviews.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5.5 NEW FIXED PRICING SECTION */}
      <section id="pricing" className="py-16 sm:py-24 bg-[#F3F7FF] border-b border-[#0A2EB8]/10">
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl text-left sm:text-center sm:mx-auto mb-10 sm:mb-14"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#0A2EB8] block mb-2">
              Simple pricing
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1230] font-normal tracking-tight">
              Start small. <CircledHighlight circleColor="#FFC83D">Stay longer.</CircledHighlight>
            </h2>
            <p className="text-[#0B1230]/75 text-base sm:text-lg mt-3 font-normal">
              Pay per hangout. No subscriptions, no hidden charges. Venue or café bills are not included.
            </p>
          </motion.div>

          {/* 3 Tilted Sticker-Style Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
            {/* 30 Min */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setSelectedDuration("30m");
                  scrollToSection("match");
                }}
                className="w-full flex-1 bg-white border-2 border-[#0B1230] rounded-3xl p-6 sm:p-7 text-left shadow-[5px_5px_0_#0A2EB8] sm:-rotate-2 hover:rotate-0 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-[#F3F7FF] text-[#0A2EB8] border border-[#0A2EB8]/20 px-2.5 py-0.5 rounded-full">
                    Try it out
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0B1230] mt-3">30 Min</h3>
                  <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#0A2EB8] mt-2 tabular-nums">
                    ₹199
                  </div>
                  <p className="text-xs text-[#0B1230]/70 mt-2 font-medium">
                    Quick coffee, warm-up run, or casual first meet.
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-[#0A2EB8]">
                  Browse 30 min hangouts →
                </span>
              </button>
              <span className="mt-3 text-xs font-bold text-[#0B1230]/70 tabular-nums">
                ₹398/hr
              </span>
            </div>

            {/* 1 Hour (Highlighted with Yellow Accent) */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setSelectedDuration("1h");
                  scrollToSection("match");
                }}
                className="w-full flex-1 bg-[#FFC83D] border-2 border-[#0B1230] rounded-3xl p-6 sm:p-7 text-left shadow-[6px_6px_0_#0B1230] sm:rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-[#0B1230] text-[#FFC83D] px-2.5 py-0.5 rounded-full">
                    Most popular
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0B1230] mt-3">1 Hour</h3>
                  <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#0B1230] mt-2 tabular-nums">
                    ₹299
                  </div>
                  <p className="text-xs text-[#0B1230]/85 mt-2 font-semibold">
                    The sweet spot for court rallies, runs, or café chess.
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-[#0B1230]">
                  Browse 1 hr hangouts →
                </span>
              </button>
              <span className="mt-3 text-xs font-bold text-[#0B1230]/70 tabular-nums">
                ₹299/hr
              </span>
            </div>

            {/* 2 Hours */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setSelectedDuration("2h");
                  scrollToSection("match");
                }}
                className="w-full flex-1 bg-white border-2 border-[#0B1230] rounded-3xl p-6 sm:p-7 text-left shadow-[5px_5px_0_#0A2EB8] sm:rotate-2 hover:rotate-0 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-[#19C37D]/15 text-[#0B1230] border border-[#19C37D] px-2.5 py-0.5 rounded-full">
                    Best value
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0B1230] mt-3">2 Hours</h3>
                  <div className="font-serif text-4xl sm:text-5xl font-extrabold text-[#0A2EB8] mt-2 tabular-nums">
                    ₹499
                  </div>
                  <p className="text-xs font-bold text-[#19C37D] mt-2">
                    Save ₹99 vs two 1-hour hangouts
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-[#0A2EB8]">
                  Browse 2 hrs hangouts →
                </span>
              </button>
              <span className="mt-3 text-xs font-bold text-[#0B1230]/70 tabular-nums">
                ₹250/hr
              </span>
            </div>
          </div>

          <p className="mt-8 text-center text-sm sm:text-base font-semibold text-[#0B1230] max-w-2xl mx-auto bg-white border border-[#0A2EB8]/15 rounded-2xl px-5 py-3.5 shadow-xs">
            Hitting it off? Extend your hangout anytime: +₹100 takes 30 minutes to 1 hour, +₹200 takes 1 hour to 2 hours.
          </p>
        </div>
      </section>

      {/* 5.5 ANIMATED CHARACTER STORY THEATRE */}
      <AnimatedCharacterStorySection 
        onOpenBookingClick={(companionName, location) => {
          if (companionName) {
            const found = COMPANIONS.find(c => 
              c.name.toLowerCase().includes(companionName.toLowerCase()) || 
              companionName.toLowerCase().includes(c.name.toLowerCase()) ||
              c.experienceTitle.toLowerCase().includes(companionName.toLowerCase())
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
                  companionName.toLowerCase().includes(c.name.toLowerCase()) ||
                  c.experienceTitle.toLowerCase().includes(companionName.toLowerCase())
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
              Trust and safety in every <CircledHighlight circleColor="#3DAAFC"><span className="text-[#3DAAFC]">experience</span></CircledHighlight>
            </h2>
            <p className="text-white/80 text-base sm:text-lg mt-3 font-normal leading-relaxed">
              Every experience is built around structured group & 1-on-1 rituals in verified public places. Our 4-pillar safety framework:
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
                Every Hangout Partner and attendee is verified with Government ID (Aadhaar/PAN) before leading or joining a session.
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
      <section id="earn" className="py-16 sm:py-24 bg-[#F3F7FF] border-b border-[#0A2EB8]/10 overflow-hidden">
        <div className="wrap earn-container">
          
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#0A2EB8] block mb-2">
              For Experience Hosts
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#0B1230] font-normal tracking-tight">
              Earn by leading local <CircledHighlight circleColor="#3DAAFC">experiences</CircledHighlight>
            </h2>
            <p className="text-[#0B1230] text-sm sm:text-base font-semibold mt-3">
              Make the first 30 minutes great. Happy hangouts often get extended, and you earn more.
            </p>
            <p className="text-[#0B1230]/75 text-base sm:text-lg mb-8 leading-relaxed mt-2 font-normal">
              Host weekly morning runs, evening pickleball or badminton, Saturday hikes, café board games, or Sunday photo walks across Delhi and Gurugram. Partners keep 80% of every session: ₹159 (30 min), ₹239 (1 hr), or ₹399 (2 hrs).
            </p>

            <div className="flex flex-col gap-5 bg-white p-6 sm:p-7 rounded-2xl border border-[#0A2EB8]/15 shadow-sm">
              {/* Slider 1: 30-minute hangouts per week */}
              <div>
                <div className="flex justify-between items-center mb-1 text-sm gap-2">
                  <span className="font-medium text-[#0B1230]">30-minute hangouts per week <span className="text-xs text-[#0B1230]/60">(₹159 each)</span>:</span>
                  <span className="font-serif text-xl text-[#0A2EB8] font-bold tabular-nums shrink-0">{calcN30}</span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={20} 
                  value={calcN30}
                  className="w-full accent-[#0A2EB8]"
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCalcN30(val);
                    audio.playSlider(val / 20);
                  }}
                />
              </div>

              {/* Slider 2: 1-hour hangouts per week */}
              <div>
                <div className="flex justify-between items-center mb-1 text-sm gap-2">
                  <span className="font-medium text-[#0B1230]">1-hour hangouts per week <span className="text-xs text-[#0B1230]/60">(₹239 each)</span>:</span>
                  <span className="font-serif text-xl text-[#0A2EB8] font-bold tabular-nums shrink-0">{calcN60}</span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={20} 
                  value={calcN60}
                  className="w-full accent-[#0A2EB8]"
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCalcN60(val);
                    audio.playSlider(val / 20);
                  }}
                />
              </div>

              {/* Slider 3: 2-hour hangouts per week */}
              <div>
                <div className="flex justify-between items-center mb-1 text-sm gap-2">
                  <span className="font-medium text-[#0B1230]">2-hour hangouts per week <span className="text-xs text-[#0B1230]/60">(₹399 each)</span>:</span>
                  <span className="font-serif text-xl text-[#0A2EB8] font-bold tabular-nums shrink-0">{calcN120}</span>
                </div>
                <input 
                  type="range" 
                  min={0} 
                  max={10} 
                  value={calcN120}
                  className="w-full accent-[#0A2EB8]"
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCalcN120(val);
                    audio.playSlider(val / 10);
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
            <b className="font-serif text-4xl sm:text-6xl text-[#0A2EB8] my-3 block font-bold tabular-nums">
              ₹{monthlyTakeHome.toLocaleString("en-IN")}
            </b>
            <p className="text-xs sm:text-sm text-[#0B1230]/75 font-normal leading-relaxed">
              After the 20% platform fee. Illustrative estimate. Venue bonuses may be added at launch.
            </p>

            {/* Hangout Partner Trust Notice */}
            <div className="mt-5 p-4 bg-[#F3F7FF] rounded-xl border border-[#0A2EB8]/15 text-xs text-[#0B1230]/80 text-left">
              <strong className="text-[#0B1230] block mb-1">Hangout Partner Trust Privilege:</strong>
              Your 1st session is held at ₹0 fee to build mutual trust and earn your initial 5-star review. Standard session payouts apply from hangout 2 onwards.
            </div>

            <a 
              href="#join"
              onClick={() => {
                audio.playClick();
                setWaitlistRole("partner");
              }}
              className="bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-bold mt-6 text-sm py-3 px-6 w-full rounded-full inline-block text-center shadow-md transition-transform hover:-translate-y-0.5"
            >
              Become a Hangout Partner →
            </a>
          </motion.div>

        </div>
      </section>

      {/* 9. "BE FIRST IN LINE" (MOBILE-FIRST FORM + POST-SUBMIT PASS UNLOCK) */}
      <section id="join" className="join py-14 sm:py-24 bg-[#F3F7FF]">
        <div className="wrap">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={submittedPass ? "" : "max-w-2xl mx-auto text-left sm:text-center"}
          >
            <span className="tag" style={{ background: "#ffffff", color: "#0A2EB8", border: "1px solid #0A2EB8" }}>
              Gurugram &amp; Delhi NCR · 1st Hangout Free
            </span>
            <h2 className="font-serif text-[32px] sm:text-[50px] font-normal tracking-tight mt-3 mb-2 text-[#0B1230]">
              Unlock Your <CircledHighlight circleColor="#3DAAFC">Hangout Pass</CircledHighlight>
            </h2>
            <p className="text-[#0B1230]/75 text-sm sm:text-lg font-normal mb-2">
              Complete all details below and tap submit — your official #HH-2026 Digital Hangout Pass will unlock immediately once submitted.
            </p>
            <p className="text-[#0A2EB8] text-xs sm:text-sm font-bold mb-8">
              Launch prices: ₹199 for 30 min, ₹299 for 1 hr, ₹499 for 2 hrs.
            </p>
          </motion.div>

          <div className={submittedPass ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" : "max-w-2xl mx-auto"}>
            
            {/* INTERACTIVE MOBILE-FIRST HANGOUT PASS FORM */}
            <motion.form 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              onSubmit={handleWaitlistSubmit} 
              className={`${submittedPass ? "lg:col-span-7" : ""} form-box max-w-none bg-white border-2 border-[#0A2EB8]/15 rounded-3xl p-4 sm:p-8 shadow-lg space-y-5`}
            >
              
              {/* Mobile-Friendly Step Readiness Header */}
              <div className="bg-gradient-to-br from-[#011C92] to-[#0A2EB8] text-white rounded-2xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="flex items-center gap-1.5 text-[#FFC83D]">
                    <Sparkles className="w-4 h-4" />
                    Pass Readiness
                  </span>
                  <span className="bg-white/15 px-2.5 py-0.5 rounded-full font-extrabold">
                    {calculateVibeScore()}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-[#3DAAFC] via-[#FFC83D] to-[#19C37D] rounded-full transition-all duration-300"
                    style={{ width: `${calculateVibeScore()}%` }}
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-bold">
                  {[
                    { label: "Name", ok: waitlistName.trim().length > 1 },
                    { label: "WhatsApp", ok: waitlistWhatsapp.replace(/\D/g, "").length >= 10 },
                    { label: "Email", ok: waitlistEmail.includes("@") && waitlistEmail.includes(".") },
                    { label: "Hub", ok: waitlistLocation.trim().length > 2 },
                    { label: "Experiences", ok: waitlistInterests.length > 0 }
                  ].map((item) => (
                    <span
                      key={item.label}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors ${
                        item.ok ? "bg-[#19C37D] text-[#0B1230]" : "bg-white/15 text-white/80"
                      }`}
                    >
                      {item.ok ? <Check className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-white/50" />}
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* 1. Role Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-extrabold text-[#0B1230]">
                  <span className="w-5 h-5 rounded-full bg-[#0A2EB8] text-white text-[10px] inline-flex items-center justify-center shrink-0">01</span>
                  <span>How would you like to participate?</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setWaitlistRole("seeker");
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer min-h-[54px] flex items-center gap-3 ${
                      waitlistRole === "seeker" 
                        ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-md" 
                        : "bg-[#F3F7FF]/60 text-[#0B1230] border-[#0A2EB8]/20 hover:border-[#0A2EB8]"
                    }`}
                  >
                    <span className="text-xl shrink-0">🙋</span>
                    <div className="min-w-0">
                      <span className="block text-sm font-extrabold leading-tight">Join Experiences</span>
                      <span className={`block text-[11px] ${waitlistRole === "seeker" ? "text-white/80" : "text-[#0B1230]/60"}`}>1st hangout 100% Free</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setWaitlistRole("partner");
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer min-h-[54px] flex items-center gap-3 ${
                      waitlistRole === "partner" 
                        ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-md" 
                        : "bg-[#F3F7FF]/60 text-[#0B1230] border-[#0A2EB8]/20 hover:border-[#0A2EB8]"
                    }`}
                  >
                    <span className="text-xl shrink-0">💪</span>
                    <div className="min-w-0">
                      <span className="block text-sm font-extrabold leading-tight">Become Hangout Partner</span>
                      <span className={`block text-[11px] ${waitlistRole === "partner" ? "text-white/80" : "text-[#0B1230]/60"}`}>Lead activities &amp; earn monthly</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Full Name & Contact */}
              <div className="space-y-3 bg-[#F3F7FF]/60 border border-[#0A2EB8]/15 rounded-2xl p-3.5 sm:p-4">
                <div>
                  <label className="text-xs font-extrabold text-[#0B1230] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0A2EB8] text-white text-[10px] inline-flex items-center justify-center shrink-0">02</span>
                      Your Full Name
                    </span>
                    <span className="text-[10px] text-[#0A2EB8] font-bold uppercase tracking-wider">* Required</span>
                  </label>
                  <input 
                    type="text" 
                    value={waitlistName}
                    onChange={(e) => setWaitlistName(e.target.value)}
                    placeholder="e.g. Rahul Sharma" 
                    required 
                    className="w-full bg-white border border-[#0A2EB8]/25 rounded-xl p-3 font-medium text-sm text-[#0B1230] focus:outline-none focus:border-[#0A2EB8] min-h-[46px]"
                  />
                </div>

                {/* BOTH WhatsApp & Email Required Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* WhatsApp Number */}
                  <div>
                    <label className="text-xs font-extrabold text-[#0B1230] mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#0A2EB8] text-white text-[10px] inline-flex items-center justify-center shrink-0">03</span>
                        <Phone className="w-3.5 h-3.5 text-[#19C37D]" />
                        WhatsApp
                      </span>
                      <span className="text-[10px] text-[#0A2EB8] font-bold uppercase">* Req</span>
                    </label>
                    <div className="flex items-center rounded-xl overflow-hidden border border-[#0A2EB8]/25 bg-white shadow-xs focus-within:border-[#0A2EB8] transition-all min-h-[46px]">
                      <div className="bg-[#F3F7FF] border-r border-[#0A2EB8]/20 px-3 py-2.5 flex items-center gap-1.5 shrink-0 select-none">
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
                        className="clean-input w-full bg-white font-medium text-sm text-[#0B1230] px-3 py-2.5 focus:outline-none !border-0 !shadow-none !rounded-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="text-xs font-extrabold text-[#0B1230] mb-1.5 flex items-center justify-between">
                      <span>Email Address</span>
                      <span className="text-[10px] text-[#0A2EB8] font-bold uppercase">* Req</span>
                    </label>
                    <input 
                      type="email" 
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="name@gmail.com" 
                      required 
                      className="w-full bg-white border border-[#0A2EB8]/25 rounded-xl p-3 font-medium text-sm text-[#0B1230] focus:outline-none focus:border-[#0A2EB8] min-h-[46px]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. City & Quick Hub Shortcuts */}
              <div className="bg-[#F3F7FF]/60 border border-[#0A2EB8]/15 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-extrabold text-[#0B1230]">
                    <span className="w-5 h-5 rounded-full bg-[#0A2EB8] text-white text-[10px] inline-flex items-center justify-center shrink-0">04</span>
                    <span>City & Preferred Venue Hub</span>
                  </label>
                  <span className="text-[10px] font-bold text-[#0A2EB8] uppercase">NCR</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setWaitlistCity("Gurugram");
                      setWaitlistLocation("DLF CyberHub");
                    }}
                    className={`py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-all min-h-[42px] ${
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
                    className={`py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-all min-h-[42px] ${
                      waitlistCity === "Delhi" 
                        ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-sm" 
                        : "bg-white text-[#0B1230] border-[#0A2EB8]/20"
                    }`}
                  >
                    📍 Delhi
                  </button>
                </div>

                <div className="flex gap-1.5 overflow-x-auto sm:flex-wrap pb-1 scrollbar-none">
                  {QUICK_HUBS[waitlistCity].map((hub, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        audio.playClick();
                        setWaitlistLocation(hub);
                      }}
                      className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        waitlistLocation === hub
                          ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                          : "bg-white text-[#0B1230] border-[#0A2EB8]/25 hover:border-[#0A2EB8]"
                      }`}
                    >
                      {hub}
                    </button>
                  ))}
                </div>

                <input 
                  type="text" 
                  value={waitlistLocation}
                  onChange={(e) => setWaitlistLocation(e.target.value)}
                  placeholder="Or enter your exact neighborhood..."
                  required
                  className="w-full text-xs bg-white border border-[#0A2EB8]/20 rounded-xl p-3 font-medium text-[#0B1230] focus:outline-none focus:border-[#0A2EB8]"
                />
              </div>

              {/* 5. Preferred Weekly Slot */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-extrabold text-[#0B1230]">
                  <span className="w-5 h-5 rounded-full bg-[#0A2EB8] text-white text-[10px] inline-flex items-center justify-center shrink-0">05</span>
                  <span>Which weekly slot fits you best?</span>
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
                        className={`text-left p-3 rounded-2xl border transition-all cursor-pointer min-h-[54px] ${
                          isSelected
                            ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-sm"
                            : "bg-white text-[#0B1230] border-[#0A2EB8]/20 hover:border-[#0A2EB8]"
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

              {/* 6. Experience Interests & Women-Only Preference */}
              <div className="bg-[#F3F7FF]/60 border border-[#0A2EB8]/15 rounded-2xl p-3.5 sm:p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="flex items-center gap-2 text-xs font-extrabold text-[#0B1230]">
                    <span className="w-5 h-5 rounded-full bg-[#0A2EB8] text-white text-[10px] inline-flex items-center justify-center shrink-0">06</span>
                    <span>Pick Experiences</span>
                  </label>
                  <span className="text-[11px] font-bold bg-[#FFC83D] text-[#0B1230] px-2.5 py-0.5 rounded-full">
                    {waitlistInterests.length} selected
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FORM_INTERESTS_OPTIONS.map((item) => {
                    const isSelected = waitlistInterests.includes(item.label);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleWaitlistInterest(item.label)}
                        className={`text-left p-3 rounded-xl border transition-all text-xs font-medium flex flex-col justify-center cursor-pointer min-h-[54px] ${
                          isSelected 
                            ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-sm" 
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

                {/* Women-Only Safety Preference Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setWaitlistWomenOnly((prev) => !prev);
                  }}
                  aria-pressed={waitlistWomenOnly}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-2 min-h-[48px] ${
                    waitlistWomenOnly
                      ? "bg-[#011C92] text-white border-[#011C92]"
                      : "bg-white text-[#0B1230] border-[#0A2EB8]/20 hover:border-[#0A2EB8]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">👩</span>
                    <div className="min-w-0">
                      <span className="block text-xs font-extrabold">Women-Only Booking Option (For Women Only)</span>
                      <span className={`block text-[10px] ${waitlistWomenOnly ? "text-white/80" : "text-[#0B1230]/65"}`}>
                        Exclusively for women seekers · Matched only with Female Hangout Partners
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                    waitlistWomenOnly ? "bg-[#19C37D] text-[#0B1230]" : "bg-[#F3F7FF] text-[#0A2EB8]"
                  }`}>
                    {waitlistWomenOnly ? "ON" : "Optional"}
                  </span>
                </button>

                <div>
                  <label className="block text-[11px] font-bold text-[#0B1230] mb-1">
                    Your personal goal for this experience (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="e.g. Sub-28 min 5K pace, doubles pickleball, or café chess"
                    className="w-full text-sm bg-white border border-[#0A2EB8]/20 rounded-xl p-2.5 font-medium text-[#0B1230] focus:outline-none focus:border-[#0A2EB8]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="space-y-2 pt-1">
                <button 
                  className="w-full py-4 text-sm sm:text-base font-extrabold bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] rounded-full shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer min-h-[52px]" 
                  type="submit"
                >
                  {submittedPass ? "Update & Refresh My Hangout Pass 🎉" : "Submit & Unlock Live Hangout Pass 🎉"}
                </button>
                {!submittedPass && (
                  <p className="text-[11px] text-center text-[#0B1230]/60 font-medium">
                    Your Digital Live Pass unlocks below immediately after all required info is filled and submitted.
                  </p>
                )}
              </div>

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

            {/* LIVE PASS PREVIEW: STRICTLY SHOWN ONLY AFTER ALL INFORMATION IS FILLED AND SUBMITTED */}
            {submittedPass && (
            <div ref={passPreviewRef} className="lg:col-span-5 w-full lg:sticky lg:top-24 min-w-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="bg-white border-2 border-[#19C37D] rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden"
              >
                
                {/* Pass Header Band */}
                <div className="flex items-center justify-between pb-4 border-b border-dashed border-[#0A2EB8]/25">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#19C37D] animate-pulse"></span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#011C92]">
                      Official Hangout Pass
                    </span>
                  </div>
                  <span className="text-[11px] font-bold bg-[#FFC83D] text-[#0B1230] px-2.5 py-0.5 rounded-full">
                    {submittedPass.passId}
                  </span>
                </div>

                {/* Ticket Body */}
                <div className="pt-5 space-y-4">
                  {/* Name & Role Avatar */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#0A2EB8] text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-sm">
                      {submittedPass.role === "partner" ? "💪" : "🙋"}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A2EB8]">
                        {submittedPass.role === "partner" ? "Founding Experience Host" : "Founding Experience Member"}
                      </span>
                      <h4 className="text-xl font-bold text-[#0B1230] leading-tight truncate">
                        {submittedPass.name}
                      </h4>
                      <p className="text-xs font-medium text-[#0A2EB8] mt-0.5 truncate">
                        +91 {submittedPass.whatsapp} · {submittedPass.email}
                      </p>
                    </div>
                  </div>

                  {submittedPass.womenOnly && (
                    <div className="px-3 py-2 bg-[#011C92] text-white rounded-xl flex items-center justify-between text-xs font-bold">
                      <span>👩 Women-Only Verified Preference</span>
                      <span className="bg-[#19C37D] text-[#0B1230] text-[10px] px-2 py-0.5 rounded-full">Active</span>
                    </div>
                  )}

                  {/* Meeting Hub & City */}
                  <div className="p-3 bg-[#F3F7FF] rounded-xl border border-[#0A2EB8]/15">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#0B1230]/60">
                      Focus Location
                    </div>
                    <div className="text-sm font-bold text-[#0B1230] flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-4 h-4 text-[#0A2EB8] shrink-0" />
                      <span>{submittedPass.location} ({submittedPass.city})</span>
                    </div>
                  </div>

                  {/* Time Availability */}
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Preferred Weekly Slot
                    </div>
                    <div className="text-xs font-bold text-[#0B1230] flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{submittedPass.time}</span>
                    </div>
                  </div>

                  {/* 1st Free Hangout Credit on Pass */}
                  <div className="p-3 bg-[#19C37D]/10 rounded-xl border border-[#19C37D]/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#19C37D]">
                        Launch Trust Privilege
                      </div>
                      <div className="text-xs font-bold text-[#0B1230] mt-0.5 flex items-center gap-1">
                        <span>🎁 1st Free Experience Included</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-[#19C37D] text-white px-2.5 py-1 rounded-full shadow-xs">
                      ₹0 (1st Hangout Free)
                    </span>
                  </div>

                  {/* Selected Experiences on Pass */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#0B1230]/60 mb-1.5">
                      Selected Experiences
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {submittedPass.interests.map((interest, i) => (
                        <span 
                          key={i}
                          className="text-[11px] font-semibold bg-[#0A2EB8] text-white px-2.5 py-0.5 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                    {submittedPass.customGoal && (
                      <p className="text-[11px] text-[#0B1230] font-semibold mt-2 italic bg-[#F3F7FF] p-2 rounded-lg border border-[#0A2EB8]/15">
                        "{submittedPass.customGoal}"
                      </p>
                    )}
                  </div>

                  {/* Security QR / Barcode aesthetic line */}
                  <div className="pt-3 border-t border-dashed border-[#0A2EB8]/20 flex items-center justify-between text-[10px] font-bold text-[#0B1230]/60">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#19C37D]" />
                      ID & Escrow Verified Pass
                    </span>
                    <span className="font-mono text-[#0A2EB8]">DELHI-NCR-PASS</span>
                  </div>

                </div>

              </motion.div>

              {/* Direct WhatsApp Concierge Help Card */}
              <div className="mt-4 p-4 bg-white border border-[#0A2EB8]/20 rounded-2xl shadow-sm flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#19C37D] text-white flex items-center justify-center font-bold text-lg shrink-0">
                    💬
                  </div>
                  <div className="leading-tight min-w-0">
                    <p className="text-xs font-bold text-[#0B1230]">Need manual booking help?</p>
                    <p className="text-[11px] text-[#0B1230]/60 font-medium truncate">Talk to Happy Hangouts Team</p>
                  </div>
                </div>
                <a 
                  href="https://wa.me/918800843189?text=Hi%20Happy%20Hangouts!%20I%20just%20created%20my%20Hangout%20Pass."
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => audio.playClick()}
                  className="bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-bold text-xs py-2.5 px-4 rounded-full shrink-0 shadow-xs flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Text Team
                </a>
              </div>

            </div>
            )}

          </div>

          {!submittedPass && (
            <div className="max-w-2xl mx-auto mt-4 p-4 bg-white border border-[#0A2EB8]/15 rounded-2xl shadow-xs flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#19C37D] text-white flex items-center justify-center font-bold text-lg shrink-0">
                  💬
                </div>
                <div className="leading-tight min-w-0">
                  <p className="text-xs font-bold text-[#0B1230]">Prefer WhatsApp booking help?</p>
                  <p className="text-[11px] text-[#0B1230]/60 font-medium truncate">Chat with Happy Hangouts NCR Coordinator</p>
                </div>
              </div>
              <a 
                href="https://wa.me/918800843189?text=Hi%20Happy%20Hangouts!%20I'd%20like%20help%20joining%20an%20experience."
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => audio.playClick()}
                className="bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-bold text-xs py-2.5 px-4 rounded-full shrink-0 shadow-xs flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Text Team
              </a>
            </div>
          )}

          {/* City launch indicator badges */}
          <div className={`flex gap-2.5 flex-wrap mt-8 ${submittedPass ? "" : "max-w-2xl mx-auto"}`}>
            <span className="bg-[#0A2EB8] text-white rounded-full px-4 py-1.5 font-bold text-xs shadow-xs">
              📍 Gurugram: Launching First
            </span>
            <span className="bg-white text-[#0A2EB8] border border-[#0A2EB8] rounded-full px-4 py-1.5 font-bold text-xs shadow-xs">
              📍 Delhi: Launching in Parallel
            </span>
          </div>

        </div>
      </section>

      {/* 9.3 FAQ: SECURITY & PRIVACY, PAYMENT, CANCELLATION & REFUND */}
      <FaqSection onJoinWaitlist={() => scrollToSection("join")} />

      {/* 9.5. PRESS, CITATIONS & BACKLINK DIRECTORY NETWORK (Hidden on mobile < md) */}
      <BacklinkHub triggerBoom={triggerBoom} />

      {/* 10. BOOKING INQUIRY & 5-MINUTE ACTION DISPATCHER MODAL */}
      <AnimatePresence>
        {bookingCompanion && isDispatching && (
          <HangoutRequestDispatcher
            companion={bookingCompanion}
            meetingLocation={bookingLocation}
            meetingDate={bookingDate}
            meetingTime={`${bookingTime} · ${bookingStartHour}`}
            durationPrice={activeDuration.price}
            durationLabel={activeDuration.shortLabel}
            womenOnly={bookingWomenOnly}
            isAlreadyUnlocked={unlockedPartnerIds.includes(bookingCompanion.id)}
            onPartnerAccepted={(acceptedId) => {
              setUnlockedPartnerIds((prev) =>
                prev.includes(acceptedId) ? prev : [...prev, acceptedId]
              );
            }}
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
          <div className="fixed inset-0 z-50 bg-[#011C92]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              className="bg-white border border-[#0A2EB8]/20 rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[92vh] overflow-y-auto my-auto"
            >
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setBookingCompanion(null);
                }}
                aria-label="Close modal"
                className="absolute top-3.5 right-3.5 p-2.5 rounded-full border border-slate-200 hover:bg-[#F3F7FF] transition-colors cursor-pointer text-[#0B1230]/60 min-w-[40px] min-h-[40px] flex items-center justify-center z-10 bg-white"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Experience Header in Modal */}
              <div className="flex items-center gap-3.5 sm:gap-4 mb-5 pr-8">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-[#0A2EB8]/20 bg-[#F3F7FF] shrink-0">
                  <img
                    src={bookingCompanion.interestPhoto}
                    alt={bookingCompanion.interestPhotoAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#0A2EB8] font-bold block">
                    {bookingCompanion.categoryLabel} · {bookingCompanion.slotLabel}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0B1230] leading-snug">
                    {bookingCompanion.experienceTitle}
                  </h3>
                  <p className="text-xs text-[#0B1230]/65 mt-0.5 truncate">
                    📍 {bookingCompanion.location} · ⭐ {bookingCompanion.rating}
                  </p>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-[#19C37D]/15 text-[#19C37D] rounded-full flex items-center justify-center mx-auto mb-4 font-serif text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-serif text-2xl text-[#0B1230] font-bold mb-2">
                    Experience Spot Reserved
                  </h4>
                  <p className="text-sm text-[#0B1230]/70 mb-5">
                    Opening WhatsApp to finalize your spot for {bookingCompanion.experienceTitle} (+91 8800843189).
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
                  <div className="bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-xl p-3.5 space-y-2">
                    <div>
                      <span className="block text-[10px] font-bold text-[#0A2EB8] uppercase tracking-wider">
                        What You'll Experience
                      </span>
                      <p className="text-sm text-[#0B1230] font-semibold mt-0.5">
                        {bookingCompanion.vibeText}
                      </p>
                      <p className="text-xs text-[#0B1230]/75 mt-1">
                        {bookingCompanion.goals}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {bookingCompanion.hobbies.map((hobby) => (
                        <span
                          key={hobby}
                          className="text-[11px] font-semibold text-[#0A2EB8] bg-white border border-[#0A2EB8]/15 px-2 py-0.5 rounded-md"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#0B1230]/70 flex items-center gap-1.5 pt-1 border-t border-[#0A2EB8]/10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#19C37D] shrink-0" />
                      <span>
                        A Govt-ID vetted {bookingWomenOnly ? "Female Hangout Partner" : "Hangout Partner"} ({bookingWomenOnly ? bookingCompanion.womenCaptainName : bookingCompanion.name}) is assigned once confirmed.
                      </span>
                    </p>
                  </div>

                  {/* Booking Cohort Option: Open vs Women-Only */}
                  <div>
                    <label className="block text-xs font-bold text-[#0B1230]/70 uppercase tracking-wider mb-1.5">
                      Booking Option
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          audio.playClick();
                          setBookingWomenOnly(false);
                          setWomenOnlyConfirmed(false);
                          setBookingError(null);
                        }}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          !bookingWomenOnly
                            ? "bg-[#0A2EB8] text-white border-[#0A2EB8] shadow-xs"
                            : "bg-white text-[#0B1230] border-[#0A2EB8]/20 hover:border-[#0A2EB8]"
                        }`}
                      >
                        <span className="block text-xs font-extrabold">Standard Open Spot</span>
                        <span className={`block text-[10px] ${!bookingWomenOnly ? "text-white/80" : "text-[#0B1230]/60"}`}>
                          All ID-verified members
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          audio.playClick();
                          setBookingWomenOnly(true);
                          setBookingError(null);
                        }}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          bookingWomenOnly
                            ? "bg-[#011C92] text-white border-[#011C92] shadow-xs"
                            : "bg-white text-[#0B1230] border-[#0A2EB8]/20 hover:border-[#0A2EB8]"
                        }`}
                      >
                        <span className="block text-xs font-extrabold flex items-center justify-between">
                          <span>👩 Women-Only (Women Only)</span>
                          {bookingWomenOnly && <Check className="w-3.5 h-3.5 text-[#FFC83D]" />}
                        </span>
                        <span className={`block text-[10px] ${bookingWomenOnly ? "text-[#FFC83D]" : "text-[#0B1230]/60"}`}>
                          Female Hangout Partner · Strictly for women
                        </span>
                      </button>
                    </div>

                    {bookingWomenOnly && (
                      <label className="mt-2.5 p-3 bg-[#011C92]/5 border border-[#011C92]/25 rounded-xl flex items-start gap-2.5 text-xs text-[#0B1230] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={womenOnlyConfirmed}
                          onChange={(e) => {
                            setWomenOnlyConfirmed(e.target.checked);
                            if (e.target.checked) setBookingError(null);
                          }}
                          className="mt-0.5 w-4 h-4 accent-[#0A2EB8] shrink-0 cursor-pointer"
                        />
                        <span className="font-semibold leading-snug">
                          I confirm I am a woman — Women-Only booking is strictly for women only (with Female Hangout Partners).
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0B1230]/70 uppercase tracking-wider mb-1.5">
                        Day
                      </label>
                      <select 
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full text-sm bg-white border border-[#0A2EB8]/20 rounded-lg p-2 font-medium text-[#0B1230]"
                      >
                        <option>Tomorrow (Weekday)</option>
                        <option>Next Weekday</option>
                        <option>This Saturday</option>
                        <option>This Sunday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0B1230]/70 uppercase tracking-wider mb-1.5">
                        Hangout Start Time (2-Hr Rule)
                      </label>
                      <select 
                        value={bookingStartHour}
                        onChange={(e) => setBookingStartHour(e.target.value)}
                        className="w-full text-sm bg-white border border-[#0A2EB8]/20 rounded-lg p-2 font-medium text-[#0B1230]"
                      >
                        <option value="6:30 AM">6:30 AM (Request by 4:30 AM)</option>
                        <option value="7:30 AM">7:30 AM (Request by 5:30 AM)</option>
                        <option value="5:00 PM">5:00 PM (Request by 3:00 PM)</option>
                        <option value="6:30 PM">6:30 PM (Request by 4:30 PM)</option>
                        <option value="7:30 PM">7:30 PM (Request by 5:30 PM)</option>
                      </select>
                    </div>
                  </div>

                  {/* Minimum 2-Hour Advance Booking Window */}
                  <div className="p-3 bg-[#F3F7FF] border border-[#0A2EB8]/20 rounded-xl text-xs text-[#0B1230] flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#0A2EB8] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#0A2EB8] block">
                        Minimum 2-Hour Advance Request Rule
                      </strong>
                      <span className="text-[11px] text-[#0B1230]/80 leading-snug block mt-0.5">
                        Selected start time: <strong>{bookingStartHour}</strong> → Please send your request by{" "}
                        <strong className="text-[#0A2EB8]">{getAdvanceCutoffLabel(bookingStartHour)}</strong> (e.g., request by 3:00 PM for a 5:00 PM hangout).
                      </span>
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

                  {/* 1st Hangout Free Trust Callout & Duration Selector */}
                  <div className="p-4 bg-[#19C37D]/10 border border-[#19C37D]/30 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#19C37D]">
                      <span>Launch Offer:</span>
                      <span className="bg-[#19C37D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ₹0 (1st Hangout Free)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {DURATION_OPTIONS.map((dur) => (
                        <button
                          key={dur.id}
                          type="button"
                          onClick={() => {
                            audio.playClick();
                            setSelectedDuration(dur.id);
                          }}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                            selectedDuration === dur.id
                              ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                              : "bg-white text-[#0B1230] border-[#0A2EB8]/20"
                          }`}
                        >
                          {dur.pillLabel}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#0B1230]/65 pt-1 border-t border-[#19C37D]/20">
                      <span>Standard Price (from 2nd hangout):</span>
                      <span className="line-through tabular-nums">{activeDuration.cardLabel}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-[#0B1230]">
                      <span>Your Cost Today:</span>
                      <span className="font-serif text-base text-[#19C37D] font-bold">₹0 (1st Hangout Free)</span>
                    </div>
                  </div>

                  {/* Cancellation & 5-Min Confirmation Policy */}
                  <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-extrabold text-[#0B1230]">
                        Cancellation Policy: You can&apos;t cancel last hour
                      </p>
                      <p className="text-[11px] text-[#0B1230]/80 font-normal mt-0.5 leading-relaxed">
                        No cancellations are allowed within 1 hour of your hangout start time. Our Hangout Partner confirms within 5 minutes and unlocks WhatsApp details; if unresponded, it auto-cancels with ₹0 fee.
                      </p>
                    </div>
                  </div>

                  {bookingError && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-500 text-amber-900 text-xs font-bold">
                      {bookingError}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleConfirmBooking}
                      className="bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-bold w-full py-3.5 text-sm rounded-full shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      Send Request to Hangout Partner ({bookingStartHour})
                    </button>
                    <p className="text-[11px] text-center text-[#0B1230]/60 mt-2 font-normal">
                      1st hangout ₹0 free · Request min. 2 hrs prior · No last-hour cancellations.
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 11. FOOTER & SEO CITATION DIRECTORY (Deep Midnight #011C92) */}
      <footer className="pt-12 pb-24 md:py-16 text-white/80 bg-[#011C92] border-t border-white/10">
        <div className="wrap">
          {/* Top Grid of Backlink & Directory Citations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10 text-left">
            
            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center flex-wrap gap-2 mb-3">
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
                Delhi NCR’s curated community starting with 5 structured weekly hangouts: Running buddy, Pickleball or badminton, Weekend hike, Café chess & board games, and Sunday Photo walk.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 w-fit">
                <span>⭐ 4.9 / 5 Rating</span>
                <span>·</span>
                <span className="text-[#FFC83D]">1st Hangout Free</span>
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
                    Tau Devi Lal Park & Lodhi Track
                  </a>
                </li>
                <li>
                  <a href="#radar" onClick={() => scrollToSection("radar")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    Sector 29 & Siri Fort Courts
                  </a>
                </li>
                <li>
                  <a href="#radar" onClick={() => scrollToSection("radar")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    Aravalli & Mangar Bani Trails
                  </a>
                </li>
                <li>
                  <a href="#radar" onClick={() => scrollToSection("radar")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    32nd Avenue & Khan Market Cafés
                  </a>
                </li>
                <li>
                  <a href="#radar" onClick={() => scrollToSection("radar")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    Sunder Nursery Botanical Park
                  </a>
                </li>
              </ul>
            </div>

            {/* 5 Starting Activities Column */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                ⚡ 5 Starting Activities
              </h5>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <a href="#match" onClick={() => { setSelectedCategory("running"); scrollToSection("match"); }} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    🏃 Running buddy (Weekday AM)
                  </a>
                </li>
                <li>
                  <a href="#match" onClick={() => { setSelectedCategory("rackets"); scrollToSection("match"); }} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    🏸 Pickleball or badminton (Weekday PM)
                  </a>
                </li>
                <li>
                  <a href="#match" onClick={() => { setSelectedCategory("hike"); scrollToSection("match"); }} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    🥾 Weekend hike (Saturday AM)
                  </a>
                </li>
                <li>
                  <a href="#match" onClick={() => { setSelectedCategory("games_cafe"); scrollToSection("match"); }} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    ♟️ Chess or board games at a café (Sat PM)
                  </a>
                </li>
                <li>
                  <a href="#match" onClick={() => { setSelectedCategory("photowalk"); scrollToSection("match"); }} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    📸 Photo walk (Sunday AM)
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
                  <a href="#faq" onClick={() => scrollToSection("faq")} className="text-white/80 hover:text-[#3DAAFC] transition-colors">
                    Security, Payment & Refund FAQ
                  </a>
                </li>
                <li className="hidden md:list-item">
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

            <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-bold text-[#3DAAFC]">
              <a href="#faq" onClick={() => scrollToSection("faq")} className="hover:underline">
                FAQ & Refunds
              </a>
              <span aria-hidden="true" className="hidden md:inline">·</span>
              <a href="#backlinks" onClick={() => scrollToSection("backlinks")} className="hidden md:inline hover:underline">
                Press Kit & Badges
              </a>
              <span aria-hidden="true">·</span>
              <a href="#safe" onClick={() => scrollToSection("safe")} className="hover:underline">
                Safety Charter
              </a>
              <span aria-hidden="true">·</span>
              <a href="https://wa.me/918800843189" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#FFC83D]">
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 12. MOBILE BOTTOM FLOATING ACTION BAR (Compact & Touch-Ergonomic) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#0A2EB8]/15 py-2 px-3 z-40 md:hidden flex items-center justify-between gap-2.5 shadow-[0_-4px_12px_rgba(10,46,184,0.08)]">
        <a 
          href="#join" 
          onClick={() => {
            audio.playClick();
            setWaitlistRole("partner");
          }}
          className="flex-1 text-center py-2.5 px-3 rounded-full border border-[#0A2EB8] text-[#0A2EB8] font-bold text-xs min-h-[42px] flex items-center justify-center whitespace-nowrap"
        >
          Host Experience
        </a>
        <a 
          href="#match" 
          onClick={() => audio.playClick()}
          className="flex-1 text-center py-2.5 px-3 rounded-full bg-[#FFC83D] text-[#0B1230] font-extrabold text-xs shadow-sm min-h-[42px] flex items-center justify-center whitespace-nowrap"
        >
          Explore Experiences
        </a>
      </div>

    </div>
  );
}
