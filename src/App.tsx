import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Star,
  ArrowRight,
  ArrowUp,
  Check,
  Clock,
  X,
  Calendar,
  AlertCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  LayoutDashboard,
  Briefcase,
  LogOut
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useInView
} from "motion/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { audio, setupGlobalAudioListeners } from "./utils/audio";
import { submitToGoogleSheets } from "./lib/googleSheets";
import { analytics } from "./utils/analytics";
import { useAuth } from "./contexts/AuthContext";
import { db, getPricingBreakdown, normalizeDocId } from "./lib/firebase";
import { PartnerRecord, createBookingRecord } from "./lib/bookings";
import HangoutRequestDispatcher from "./components/HangoutRequestDispatcher";
import FaqSection from "./components/FaqSection";
import AuthBookingGateModal from "./components/AuthBookingGateModal";
import AdminPortal from "./components/AdminPortal";
import PartnerPortal from "./components/PartnerPortal";
import SeekerBookingsModal from "./components/SeekerBookingsModal";

import heroHangoutCafeImg from "./assets/images/hero_hangout_cafe_1794391402838.jpg";
import interestBadmintonCourtImg from "./assets/images/interest_badminton_rackets_1794904217019.jpg";
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
  { id: "30m", pillLabel: "30 min · ₹99", shortLabel: "30 min", cardLabel: "₹99 · 30 min", price: 99 },
  { id: "1h", pillLabel: "1 hr · ₹199", shortLabel: "1 hr", cardLabel: "₹199 · 1 hr", price: 199 },
  { id: "2h", pillLabel: "2 hrs · ₹449", shortLabel: "2 hrs", cardLabel: "₹449 · 2 hrs", price: 449 }
];

const COMPANIONS: CompanionProfile[] = [
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
    goals: "Consistent weekday morning 5K runs before work with zero flakes.",
    hobbies: ["5K track pacing", "Dawn park loops", "Endurance cooldown"],
    interestPhoto: interestRunningTrackImg,
    interestPhotoAlt: "Running shoes and track setup at sunrise",
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
    vibeText: "Easy 6:30 AM conversational jogs, mobility drills & post-run chai.",
    goals: "A refreshing weekday morning jogging ritual under Lodhi Garden trees.",
    hobbies: ["Conversational 5K jog", "Mobility warm-ups", "Post-run chai"],
    interestPhoto: interestLodhiJogImg,
    interestPhotoAlt: "Dawn running gear on a sunlit New Delhi jogging path",
    partnerPhoto: partnerFalguniImg,
    partnerPhotoAlt: "Verified Hangout Partner Falguni Baddi in morning sunlight",
    bgColor: "#a8f0c6",
    badge: "Weekday AM"
  },
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
    vibeText: "Indoor badminton rallies, rotating doubles & net drills.",
    goals: "Unplug after work with competitive indoor court sets and steady rallies.",
    hobbies: ["Badminton doubles", "Footwork drills", "Evening rallies"],
    interestPhoto: interestBadmintonCourtImg,
    interestPhotoAlt: "Two badminton rackets and shuttlecocks on an indoor wooden court",
    partnerPhoto: partnerUjjwalImg,
    partnerPhotoAlt: "Verified Hangout Partner Ujjwal Poonia at an indoor court lounge",
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
    vibeText: "Floodlit evening pickleball dinks, fast rallies & beginner-friendly play.",
    goals: "Fast, social evening pickleball or badminton sets across South Delhi courts.",
    hobbies: ["Pickleball matches", "Badminton rallies", "Court drills"],
    interestPhoto: interestPickleballCourtImg,
    interestPhotoAlt: "Pickleball paddles and ball beside a net under evening floodlights",
    partnerPhoto: partnerAaravImg,
    partnerPhotoAlt: "Verified Hangout Partner Aarav Mehta outdoors by green courts",
    bgColor: "#7cc4ff",
    badge: "Fast Confirm"
  },
  {
    id: "p-3",
    name: "Kabir Sen",
    womenCaptainName: "Aditi Rao",
    experienceTitle: "Aravalli Sunrise Ridge Hike & Chai",
    experienceDuration: "90 min",
    emoji: "🥾",
    act: "hike",
    categoryLabel: "Weekend hike",
    slotKey: "saturday_morning",
    slotLabel: "Saturday morning",
    rating: 4.9,
    city: "Gurugram",
    location: "Aravalli Biodiversity Ridge, Gurugram",
    vibeText: "Guided Saturday sunrise ridge hike, scenic viewpoints & hot chai.",
    goals: "Step away from screens for an energizing Saturday dawn trail walk.",
    hobbies: ["Ridge hiking", "Scenic viewpoints", "Sunrise chai"],
    interestPhoto: interestAravalliTrekImg,
    interestPhotoAlt: "Trail gear and compass overlooking sunlit Aravalli ridge hills",
    partnerPhoto: partnerKabirImg,
    partnerPhotoAlt: "Verified Hangout Partner Kabir Sen on a golden sunrise trail",
    bgColor: "#ff6b4a",
    badge: "Saturday AM"
  },
  {
    id: "p-sonika",
    name: "Sonika Sharma",
    womenCaptainName: "Sonika Sharma",
    experienceTitle: "Sanjay Van Forest Trail & Reset",
    experienceDuration: "90 min",
    emoji: "🥾",
    act: "hike",
    categoryLabel: "Weekend hike",
    slotKey: "saturday_morning",
    slotLabel: "Saturday morning",
    rating: 4.9,
    city: "Delhi",
    location: "Sanjay Van & Mangar Bani Trail, Delhi NCR",
    vibeText: "Refreshing Saturday morning forest trail hike & unhurried conversation.",
    goals: "Kick off the weekend outdoors with 10K forest steps and great company.",
    hobbies: ["Forest trail hikes", "Trail stretching", "Morning chai"],
    interestPhoto: interestWeekendHikeImg,
    interestPhotoAlt: "Hiking pack and flask overlooking green Aravalli forest trails",
    partnerPhoto: partnerSonikaImg,
    partnerPhotoAlt: "Verified Hangout Partner Sonika Sharma in morning sunlight",
    bgColor: "#ffc933",
    badge: "Saturday AM"
  },
  {
    id: "p-5",
    name: "Rohan Verma",
    womenCaptainName: "Kriti Malhotra",
    experienceTitle: "32nd Ave Board Games & Courtyard Chai",
    experienceDuration: "90 min",
    emoji: "🎲",
    act: "games_cafe",
    categoryLabel: "Chess or board games at a café",
    slotKey: "saturday_evening",
    slotLabel: "Saturday evening",
    rating: 4.8,
    city: "Gurugram",
    location: "32nd Avenue Courtyard Cafés, Gurugram",
    vibeText: "Screen-free Saturday evening Catan, Splendor & sunlit café banter.",
    goals: "Unwind over tactile strategy board games and chai in a sunlit courtyard.",
    hobbies: ["Catan & strategy", "Café chess", "Courtyard chai"],
    interestPhoto: interestBoardgamesChaiImg,
    interestPhotoAlt: "Strategy board game tiles, dice, and terracotta chai cups on wood table",
    partnerPhoto: partnerRohanImg,
    partnerPhotoAlt: "Verified Hangout Partner Rohan Verma at an outdoor café table",
    bgColor: "#7cc4ff",
    badge: "Saturday PM"
  },
  {
    id: "p-2",
    name: "Meera Reddy",
    womenCaptainName: "Meera Reddy",
    experienceTitle: "Khan Market Café Chess & Lattes",
    experienceDuration: "75 min",
    emoji: "♟️",
    act: "games_cafe",
    categoryLabel: "Chess or board games at a café",
    slotKey: "saturday_evening",
    slotLabel: "Saturday evening",
    rating: 4.9,
    city: "Delhi",
    location: "Khan Market & CyberHub Cafés, Delhi NCR",
    vibeText: "Casual over-the-board rapid chess, iced pour-overs & weekend talks.",
    goals: "Three relaxed over-the-board chess games at a cozy café table.",
    hobbies: ["Rapid café chess", "Board games", "Pour-over coffee"],
    interestPhoto: interestChessCafeImg,
    interestPhotoAlt: "Classic wooden chess board beside two iced lattes on a café table",
    partnerPhoto: partnerMeeraImg,
    partnerPhotoAlt: "Verified Hangout Partner Meera Reddy beside a sunny café window",
    bgColor: "#ffc933",
    badge: "Saturday PM"
  },
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
    location: "Sunder Nursery & Humayun Trail, Delhi",
    vibeText: "Sunday sunrise heritage arches, natural light framing & chai stop.",
    goals: "Capture calm Mughal architecture on any phone or camera.",
    hobbies: ["35mm & phone framing", "Heritage walks", "Morning chai"],
    interestPhoto: interestSunderTrailImg,
    interestPhotoAlt: "Vintage camera, tote bag, and chai along a heritage garden cobblestone path",
    partnerPhoto: partnerJyotiImg,
    partnerPhotoAlt: "Verified Hangout Partner Jyoti Nandal in leafy morning sunlight",
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
    vibeText: "Street mural compositions, morning shadow play & coffee debrief.",
    goals: "Sunday morning street photography walk across Lodhi Art District.",
    hobbies: ["Street photography", "Mobile & camera", "Art district walk"],
    interestPhoto: interestSundayPhotowalkImg,
    interestPhotoAlt: "Classic silver camera and lens near sunlit New Delhi garden arches",
    partnerPhoto: partnerAnanyaImg,
    partnerPhotoAlt: "Verified Hangout Partner Ananya Kapoor outside a sunlit café",
    bgColor: "#ffc933",
    badge: "Sunday AM"
  }
];

const ROTATING_WORDS = [
  "good energy",
  "running shoes",
  "badminton racket",
  "weekend spirit",
  "camera"
];

const CATEGORIES: { id: "all" | FoundingActivityId; label: string }[] = [
  { id: "all", label: "All Experiences" },
  { id: "running", label: "Running" },
  { id: "rackets", label: "Pickleball & Badminton" },
  { id: "hike", label: "Weekend Hike" },
  { id: "games_cafe", label: "Chess & Café" },
  { id: "photowalk", label: "Photo Walk" }
];

export const FORM_INTERESTS_OPTIONS = [
  { id: "running", label: "Running buddy", desc: "Weekday mornings · 5K/10K pacing" },
  { id: "rackets", label: "Pickleball or badminton", desc: "Weekday evenings · Court rallies" },
  { id: "hike", label: "Weekend hike", desc: "Saturday morning · Aravalli & trails" },
  { id: "games_cafe", label: "Chess or board games at a café", desc: "Saturday evening · Courtyard banter" },
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

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1000;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.round(ease * value));
      if (progress < 1) requestAnimationFrame(update);
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState<"all" | "Gurugram" | "Delhi">("all");
  const [womenOnlyFilter, setWomenOnlyFilter] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<HangoutDurationKey>("1h");
  const [timeFilter, setTimeFilter] = useState<"any" | FoundingSlotKey>("any");
  const [minRating, setMinRating] = useState(0);

  // Earnings Calculator (30m, 1h, 2h per week)
  const [calcN30, setCalcN30] = useState(4);
  const [calcN60, setCalcN60] = useState(4);
  const [calcN120, setCalcN120] = useState(1);

  // Hangout Pass Form
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

  const { firebaseUser, userProfile, isAdmin, logout } = useAuth();

  // Auth Gate & Portals State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<"signup" | "signin">("signup");
  const [authDefaultRole, setAuthDefaultRole] = useState<"seeker" | "partner">("seeker");
  const [pendingBookingCompanion, setPendingBookingCompanion] = useState<CompanionProfile | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [partnerPortalOpen, setPartnerPortalOpen] = useState(false);
  const [seekerBookingsOpen, setSeekerBookingsOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

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
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [activeHappyKeyPin, setActiveHappyKeyPin] = useState<string | null>(null);
  const [unlockedPartnerIds, setUnlockedPartnerIds] = useState<string[]>([]);

  useEffect(() => {
    const cleanup = setupGlobalAudioListeners();
    return cleanup;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const triggerBoom = (message?: string) => {
    audio.playSuccess();
    if (message) setWaitlistStatus(message);
  };

  const toggleWaitlistInterest = (label: string) => {
    audio.playClick();
    setWaitlistInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!waitlistName.trim() || waitlistName.trim().length < 2) {
      audio.playToggle();
      setWaitlistStatus("Please enter your full name (minimum 2 characters).");
      return;
    }

    const cleanPhone = waitlistWhatsapp.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      audio.playToggle();
      setWaitlistStatus("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    if (!waitlistEmail.trim() || !waitlistEmail.includes("@") || !waitlistEmail.includes(".")) {
      audio.playToggle();
      setWaitlistStatus("Please enter a valid email address.");
      return;
    }

    if (!waitlistLocation.trim()) {
      audio.playToggle();
      setWaitlistStatus("Please select or enter a public NCR hub.");
      return;
    }

    if (waitlistInterests.length === 0) {
      audio.playToggle();
      setWaitlistStatus("Please select at least 1 experience.");
      return;
    }

    audio.playSuccess();
    const finalInterests =
      waitlistInterests.join(", ") +
      (waitlistWomenOnly ? " · [Women-Only Preference]" : "") +
      (customGoal.trim() ? ` · Goal: ${customGoal.trim()}` : "");

    const passCode = `HH-${cleanPhone.slice(-4)}-${Math.floor(10 + Math.random() * 89)}`;

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

    setWaitlistStatus(
      `Pass request received (${passCode}). We will check your ${
        waitlistRole === "partner" ? "Hangout Partner" : "Hangout Seeker"
      } profile and make it live manually once verified.`
    );

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

      analytics.trackLeadSubmit(waitlistRole, waitlistCity, true);
    } catch {
      // ignore offline lead fallback error
    }
  };

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
  const activeModalPricing = getPricingBreakdown(selectedDuration, false);

  const launchBookingModal = (companion: CompanionProfile) => {
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
    setWomenOnlyConfirmed(womenOnlyFilter && userProfile?.gender === "female");
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
    setActiveBookingId(null);
    setActiveHappyKeyPin(null);
    analytics.trackBookingClick(companion.name, companion.location, activeDuration.price);
  };

  const handleOpenBooking = (companion: CompanionProfile) => {
    audio.playClick();
    if (!firebaseUser || !userProfile) {
      setPendingBookingCompanion(companion);
      setAuthInitialMode("signup");
      setAuthDefaultRole("seeker");
      setAuthModalOpen(true);
      return;
    }
    launchBookingModal(companion);
  };

  const handleConfirmBooking = async () => {
    if (!bookingCompanion || !firebaseUser || !userProfile) return;
    if (bookingWomenOnly && userProfile.gender !== "female") {
      audio.playToggle();
      setBookingError("Women-Only preference is for female attendees only. Switch to Standard Open to book any partner.");
      return;
    }
    if (bookingWomenOnly && !womenOnlyConfirmed) {
      audio.playToggle();
      setBookingError("Please confirm Women-Only preference below or switch to Standard Open.");
      return;
    }

    setBookingError(null);
    setBookingSubmitting(true);
    audio.playClick();

    try {
      let assignedPartnerUid = `platform_partner_${normalizeDocId(bookingCompanion.id)}`;
      let assignedPartnerName = bookingWomenOnly
        ? bookingCompanion.womenCaptainName
        : bookingCompanion.name;

      try {
        const partnerQuery = query(
          collection(db, "partners"),
          where("kycStatus", "==", "verified")
        );
        const snap = await getDocs(partnerQuery);
        const matchedPartner = snap.docs
          .map((d) => d.data() as PartnerRecord)
          .find(
            (p) =>
              p.active &&
              p.activityCategory === bookingCompanion.act &&
              p.city === bookingCompanion.city &&
              (!bookingWomenOnly || p.womenOnlyEligible)
          );
        if (matchedPartner) {
          assignedPartnerUid = matchedPartner.ownerUid;
          assignedPartnerName = matchedPartner.displayName;
        }
      } catch {
        // fallback cleanly to curated platform partner ID
      }

      const created = await createBookingRecord({
        seekerUid: firebaseUser.uid,
        seekerName: userProfile.name,
        seekerPhone: userProfile.phone,
        seekerEmail: userProfile.email,
        seekerGender: userProfile.gender,
        partnerId: bookingCompanion.id,
        partnerUid: assignedPartnerUid,
        partnerName: assignedPartnerName,
        activityId: bookingCompanion.act,
        experienceTitle: bookingCompanion.experienceTitle,
        venue: bookingLocation || bookingCompanion.location,
        dayLabel: bookingDate,
        startHour: bookingStartHour,
        slotLabel: bookingTime,
        durationKey: selectedDuration,
        isFirstFree: false,
        womenOnly: bookingWomenOnly,
        womenOnlyConfirmed: bookingWomenOnly ? womenOnlyConfirmed : false,
      });

      setActiveBookingId(created.bookingId);
      setActiveHappyKeyPin(created.happyKeyPin);

      const finalVenue = bookingLocation || bookingCompanion.location;
      const hireSummary = `${userProfile.name} (+91 ${userProfile.phone}) wants to hire ${assignedPartnerName} for ${bookingCompanion.experienceTitle} (${bookingCompanion.categoryLabel}) | Time: ${bookingDate} at ${bookingStartHour} (${created.durationLabel} · ₹${created.chargedPriceInr}) | Location: ${finalVenue}`;

      // Dispatch instant manual-coordination notification to server + Google Sheets/Email + Admin Console
      fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          city: bookingCompanion.city,
          location_area: finalVenue,
          free_time: `${bookingDate} at ${bookingStartHour} (${created.durationLabel})`,
          interests: hireSummary,
          join_as: "seeker_booking",
          form_type: `Manual Hire Notification (${created.bookingId})`,
          seeker_name: userProfile.name,
          partner_name: assignedPartnerName,
          activity: bookingCompanion.experienceTitle,
          time_period: `${bookingDate} · ${bookingStartHour} · ${created.durationLabel}`,
          location: finalVenue,
          price_inr: `₹${created.chargedPriceInr}`,
          notification_email: "happyhangouts.life@gmail.com",
          notification_phone: "7217813236",
        }),
      }).catch(() => {});

      submitToGoogleSheets({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        city: bookingCompanion.city,
        location_area: finalVenue,
        free_time: `${bookingDate} at ${bookingStartHour} (${created.durationLabel})`,
        interests: hireSummary,
        join_as: "seeker_booking",
        form_type: `Manual Hire Request (${created.bookingId})`,
      }).catch(() => {});

      audio.playSuccess();
      setIsDispatching(true);
      analytics.trackBookingClick(bookingCompanion.name, finalVenue, created.chargedPriceInr);
    } catch (err: any) {
      setBookingError(err?.message || "Could not submit your booking request. Please try again.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  const filteredCompanions = COMPANIONS.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.act === selectedCategory;
    const matchesCity = selectedCity === "all" || p.city === selectedCity;
    const matchesRating = p.rating >= minRating;
    const matchesTime = timeFilter === "any" || p.slotKey === timeFilter;
    return matchesCategory && matchesCity && matchesRating && matchesTime;
  });

  const monthlyTakeHome = Math.round((calcN30 * 79 + calcN60 * 159 + calcN120 * 359) * 4.3);

  const scrollToSection = (id: string) => {
    audio.playPageTransition();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col font-body bg-white text-[#0B1230] selection:bg-[#3DAAFC]/25 selection:text-[#011C92] overflow-x-hidden">
      {/* Subtle Scroll-Up Affordance */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            onClick={() => {
              audio.playPageTransition();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="fixed bottom-5 right-5 z-40 w-10 h-10 rounded-full bg-white text-[#0B1230] border border-[#0B1230]/15 shadow-lg hover:border-[#0A2EB8] hover:text-[#0A2EB8] transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 1. CLEAN 3-ZONE TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#0B1230]/8">
        <div className="wrap flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            onClick={() => {
              audio.playClick();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 shrink-0 whitespace-nowrap"
          >
            <img
              src="/assets/aistudio/Happy_Hangouts_Logo_1d102f6e.jpg"
              alt="Happy Hangouts"
              className="w-8 h-8 rounded-lg object-cover border border-[#0B1230]/10"
            />
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#0B1230] whitespace-nowrap">
              Happy Hangouts
            </span>
          </a>

          {/* Zone 2: Minimal Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#475569]">
            <a href="#match" onClick={() => audio.playClick()} className="hover:text-[#0A2EB8] transition-colors whitespace-nowrap">
              Experiences
            </a>
            <a href="#pricing" onClick={() => audio.playClick()} className="hover:text-[#0A2EB8] transition-colors whitespace-nowrap">
              Pricing
            </a>
            <a href="#safe" onClick={() => audio.playClick()} className="hover:text-[#0A2EB8] transition-colors whitespace-nowrap">
              Safety
            </a>
            <a href="#earn" onClick={() => audio.playClick()} className="hover:text-[#0A2EB8] transition-colors whitespace-nowrap">
              Become a Partner
            </a>
            <a href="#faq" onClick={() => audio.playClick()} className="hover:text-[#0A2EB8] transition-colors whitespace-nowrap">
              FAQ
            </a>
          </div>

          {/* Zone 3: Account + Single Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  if (!firebaseUser) {
                    setPendingBookingCompanion(null);
                    setAuthInitialMode("signin");
                    setAuthModalOpen(true);
                  } else {
                    setAccountMenuOpen((prev) => !prev);
                  }
                }}
                className="min-h-[38px] px-3 py-1.5 rounded-full border border-[#0B1230]/15 bg-white hover:border-[#0A2EB8] text-[#0B1230] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#0A2EB8]" />
                <span className="max-w-[90px] truncate">
                  {firebaseUser ? (userProfile?.name?.split(" ")[0] || "Account") : "Sign In"}
                </span>
              </button>

              {accountMenuOpen && firebaseUser && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#0B1230]/12 rounded-2xl shadow-xl p-1.5 z-50 text-xs text-[#0B1230]">
                  <div className="px-3 py-2 border-b border-[#0B1230]/8">
                    <p className="font-bold truncate">{userProfile?.name || firebaseUser.email}</p>
                    <p className="text-[11px] text-[#475569] truncate">
                      {isAdmin ? "Platform Admin" : userProfile?.role === "partner" ? "Hangout Partner" : "Member"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setSeekerBookingsOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F8FAFC] font-medium flex items-center gap-2 cursor-pointer mt-1"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#0A2EB8]" />
                    <span>My Bookings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setPartnerPortalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F8FAFC] font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#0A2EB8]" />
                    <span>Hangout Partner Portal</span>
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setAdminOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F8FAFC] font-semibold text-[#0A2EB8] flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Admin Console</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      setAccountMenuOpen(false);
                      await logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-700 font-medium flex items-center gap-2 cursor-pointer border-t border-[#0B1230]/8 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            <a
              href="#match"
              onClick={() => audio.playClick()}
              className="hidden sm:inline-flex items-center justify-center bg-[#FFC83D] hover:bg-[#f5bc2c] text-[#0B1230] font-bold text-xs py-2 px-4 rounded-full transition-colors whitespace-nowrap min-h-[38px]"
            >
              Explore
            </a>

            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setMobileMenuOpen((prev) => !prev);
              }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="md:hidden w-10 h-10 rounded-xl border border-[#0B1230]/12 bg-white text-[#0B1230] flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Clean Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="md:hidden border-t border-[#0B1230]/8 bg-white overflow-hidden"
            >
              <div className="wrap py-3 flex flex-col gap-1">
                {[
                  { label: "Experiences", href: "#match" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Safety", href: "#safe" },
                  { label: "Become a Partner", href: "#earn" },
                  { label: "Hangout Pass", href: "#join" },
                  { label: "FAQ", href: "#faq" }
                ].map((navItem) => (
                  <a
                    key={navItem.href}
                    href={navItem.href}
                    onClick={() => {
                      audio.playClick();
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-xl text-sm font-medium text-[#0B1230] hover:bg-[#F8FAFC] flex items-center justify-between"
                  >
                    <span>{navItem.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#475569]" />
                  </a>
                ))}
                <div className="pt-2 mt-1 border-t border-[#0B1230]/8 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setPartnerPortalOpen(true);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-[#F8FAFC] border border-[#0B1230]/10 text-[#0B1230] text-xs font-semibold text-center cursor-pointer"
                  >
                    Partner Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAdminOpen(true);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-[#011C92] text-white text-xs font-semibold text-center cursor-pointer"
                  >
                    Admin Console
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. EDITORIAL BRAND HERO */}
      <header id="top" className="py-10 sm:py-16 lg:py-20 bg-white border-b border-[#0B1230]/8">
        <div className="wrap">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Editorial Proposition */}
            <div className="lg:col-span-7 flex flex-col justify-center items-start text-left min-w-0 py-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A2EB8] mb-4">
                Gurugram &amp; Delhi NCR · Starting at ₹99
              </p>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="font-serif text-[36px] sm:text-[52px] lg:text-[62px] text-[#0B1230] font-normal tracking-tight leading-[1.08] max-w-2xl"
                style={{ textWrap: "balance" }}
              >
                You bring the{" "}
                <span className="text-[#0A2EB8] italic font-semibold">
                  {ROTATING_WORDS[wordIndex]}.
                </span>
                <br />
                We curate the experience.
              </motion.h1>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed mt-5 mb-7 max-w-xl">
                Real-world offline hangouts with Govt-ID verified Hangout Partners—zero profile browsing. Starting at just ₹99 for 30 min, ₹199 for 1 hr, or ₹449 for 2 hrs.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <a
                  href="#match"
                  onClick={() => audio.playClick()}
                  className="btn py-3.5 px-7 text-sm sm:text-base min-h-[48px]"
                >
                  <span>Explore Experiences</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#earn"
                  onClick={() => {
                    audio.playClick();
                    setWaitlistRole("partner");
                  }}
                  className="btn outline py-3.5 px-7 text-sm sm:text-base min-h-[48px]"
                >
                  <span>Become a Hangout Partner</span>
                </a>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#475569] font-medium">
                <span>Govt-ID Verified Hosts</span>
                <span aria-hidden="true">·</span>
                <span>Public Venues Only</span>
                <span aria-hidden="true">·</span>
                <span>Women Can Book Anyone or Choose Women-Only</span>
              </div>
            </div>

            {/* Right Editorial Photography */}
            <div className="lg:col-span-5 relative min-w-0 order-first lg:order-last">
              <div className="relative h-full min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] rounded-2xl overflow-hidden bg-[#0B1230]">
                <img
                  src={heroHangoutCafeImg}
                  alt="Friends sharing coffee at Hazel and Oak Café in Khan Market, Delhi NCR"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1230]/85 via-[#0B1230]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#FFC83D] mb-1">
                    Hazel &amp; Oak Café · Khan Market
                  </p>
                  <p className="font-serif text-lg sm:text-xl font-medium leading-snug text-white">
                    Curated café tables, morning runs, courts, and heritage trails.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal 4-Metric Trust Strip */}
          <div className="mt-12 sm:mt-14 pt-8 border-t border-[#0B1230]/8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="font-serif text-2xl sm:text-3xl text-[#0B1230] font-semibold">
                <AnimatedCounter value={100} suffix="%" />
              </div>
              <p className="text-xs text-[#475569] mt-1">Public venues &amp; ID-verified</p>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl text-[#0A2EB8] font-semibold tabular-nums">
                ₹99 Starter
              </div>
              <p className="text-xs text-[#475569] mt-1">Affordable 30-minute hangout</p>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl text-[#0B1230] font-semibold tabular-nums">
                ₹199 / ₹449
              </div>
              <p className="text-xs text-[#475569] mt-1">Fixed rates for 1 hr &amp; 2 hrs</p>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl text-[#0B1230] font-semibold tabular-nums">
                4.9 / 5.0
              </div>
              <p className="text-xs text-[#475569] mt-1">Across 3,400+ NCR meets</p>
            </div>
          </div>
        </div>
      </header>

      {/* 3. EXPERIENCE DIRECTORY */}
      <section id="match" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-[#0B1230]/8">
        <div className="wrap">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A2EB8] mb-2">
                Curated Experiences · Zero Profile Browsing
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B1230] font-normal tracking-tight">
                Pick an experience, not a profile.
              </h2>
              <p className="text-[#475569] text-sm sm:text-base mt-2">
                Send your request at least 2 hours prior (for example, by 3:00 PM for a 5:00 PM hangout).
              </p>
            </div>

            {/* Optional Women-Only Toggle */}
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setWomenOnlyFilter((prev) => !prev);
              }}
              aria-pressed={womenOnlyFilter}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-colors cursor-pointer min-h-[40px] self-start md:self-auto shrink-0 ${
                womenOnlyFilter
                  ? "bg-[#011C92] text-white border-[#011C92]"
                  : "bg-white text-[#0B1230] border-[#0B1230]/15 hover:border-[#0A2EB8]"
              }`}
            >
              <span>Women-Only Preference</span>
              <span className={womenOnlyFilter ? "text-[#FFC83D] font-bold" : "text-[#475569]"}>
                {womenOnlyFilter ? "On" : "Optional"}
              </span>
            </button>
          </div>

          {womenOnlyFilter && (
            <div className="mb-6 bg-white border border-[#0A2EB8]/20 rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-2 text-xs text-[#0B1230]">
              <span>
                <strong className="text-[#0A2EB8]">Women-Only Preference active:</strong> Matching exclusively with verified Female Hangout Partners. Women may also switch this off anytime to book anyone.
              </span>
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setWomenOnlyFilter(false);
                }}
                className="font-semibold text-[#0A2EB8] hover:underline cursor-pointer shrink-0"
              >
                Show all partners
              </button>
            </div>
          )}

          {/* Category Filter Bar */}
          <div className="flex sm:flex-wrap gap-2 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 mb-5 scrollbar-none">
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

          {/* Clean Compact Controls Bar */}
          <div className="bg-white border border-[#0B1230]/10 rounded-2xl p-4 sm:p-5 mb-7 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* City */}
            <div className="md:col-span-3 flex items-center gap-1.5 flex-wrap">
              {(["all", "Gurugram", "Delhi"] as const).map((cityVal) => (
                <button
                  key={cityVal}
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setSelectedCity(cityVal);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer min-h-[34px] ${
                    selectedCity === cityVal
                      ? "bg-[#0B1230] text-white border-[#0B1230]"
                      : "bg-[#F8FAFC] text-[#475569] border-[#0B1230]/10 hover:text-[#0B1230]"
                  }`}
                >
                  {cityVal === "all" ? "Both Cities" : cityVal}
                </button>
              ))}
            </div>

            {/* Duration Pill Selector */}
            <div className="md:col-span-5 flex items-center gap-1.5 flex-wrap">
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
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap min-h-[34px] ${
                      isActive
                        ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                        : "bg-[#F8FAFC] text-[#475569] border-[#0B1230]/10 hover:border-[#0A2EB8]"
                    }`}
                  >
                    {dur.pillLabel}
                  </button>
                );
              })}
            </div>

            {/* When & Rating Selects */}
            <div className="md:col-span-4 grid grid-cols-2 gap-2">
              <select
                value={timeFilter}
                onChange={(e) => {
                  audio.playClick();
                  setTimeFilter(e.target.value as any);
                }}
                aria-label="Filter by weekly slot"
                className="text-xs w-full"
              >
                <option value="any">All Weekly Slots</option>
                <option value="weekday_mornings">Weekday AM</option>
                <option value="weekday_evenings">Weekday PM</option>
                <option value="saturday_morning">Saturday AM</option>
                <option value="saturday_evening">Saturday PM</option>
                <option value="sunday_morning">Sunday AM</option>
              </select>

              <select
                value={minRating}
                onChange={(e) => {
                  audio.playClick();
                  setMinRating(Number(e.target.value));
                }}
                aria-label="Filter by minimum rating"
                className="text-xs w-full"
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5+ Rating</option>
                <option value={4.8}>4.8+ Rating</option>
              </select>
            </div>
          </div>

          {/* Mobile Scroll Hint */}
          <div className="flex md:hidden items-center justify-between gap-2 mb-3 text-xs font-semibold text-[#475569]">
            <span>{filteredCompanions.length} experiences · Swipe right</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  matchCarouselRef.current?.scrollBy({ left: -290, behavior: "smooth" });
                }}
                aria-label="Scroll left"
                className="w-8 h-8 rounded-full border border-[#0B1230]/15 bg-white text-[#0B1230] flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  matchCarouselRef.current?.scrollBy({ left: 290, behavior: "smooth" });
                }}
                aria-label="Scroll right"
                className="w-8 h-8 rounded-full bg-[#FFC83D] text-[#0B1230] flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Minimalist Experience Cards */}
          <div
            ref={matchCarouselRef}
            className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-2 scroll-smooth scrollbar-none -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:overflow-visible"
          >
            {filteredCompanions.length > 0 ? (
              filteredCompanions.map((comp) => {
                const isUnlocked = unlockedPartnerIds.includes(comp.id);
                return (
                  <div
                    key={comp.id}
                    className="w-[285px] sm:w-[310px] md:w-auto shrink-0 snap-start bg-white border border-[#0B1230]/10 rounded-2xl overflow-hidden hover:border-[#0A2EB8]/40 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full overflow-hidden bg-[#0B1230]">
                        <img
                          src={comp.interestPhoto}
                          alt={comp.interestPhotoAlt}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1230]/75 via-transparent to-transparent" />
                        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-white font-medium">
                          <span className="truncate">{comp.slotLabel}</span>
                          <span className="inline-flex items-center gap-1 tabular-nums shrink-0 font-semibold">
                            <Star className="w-3 h-3 text-[#FFC83D] fill-[#FFC83D]" />
                            {comp.rating}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0A2EB8]">
                          <span>{comp.categoryLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{comp.city}</span>
                          {womenOnlyFilter && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#011C92]">Women-Only</span>
                            </>
                          )}
                        </div>

                        <h3 className="font-serif text-lg font-semibold text-[#0B1230] leading-snug line-clamp-2">
                          {comp.experienceTitle}
                        </h3>

                        <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                          {comp.vibeText}
                        </p>

                        <p className="text-[11px] text-[#475569] pt-1 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-[#0A2EB8] shrink-0" />
                          <span className="truncate">{comp.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-[#0B1230]/6 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#0B1230] tabular-nums">
                          {activeDuration.cardLabel}
                        </span>
                        <span className="text-[#0A2EB8] font-semibold">
                          {isUnlocked ? "Confirmed" : "Manual Confirm"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenBooking(comp)}
                        className="w-full py-2.5 px-4 text-xs font-bold bg-[#FFC83D] hover:bg-[#f5bc2c] text-[#0B1230] rounded-full transition-colors cursor-pointer min-h-[40px]"
                      >
                        {womenOnlyFilter ? "Book Women-Only Spot" : "Book Experience"}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full shrink-0 col-span-full text-center p-12 border border-dashed border-[#0B1230]/15 rounded-2xl bg-white">
                <p className="font-serif text-xl text-[#0B1230]">
                  No experiences match these filters.
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
                  className="btn outline text-xs mt-4 py-2 px-5"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS & SIMPLE FIXED PRICING */}
      <section id="how" className="py-16 sm:py-24 bg-white border-b border-[#0B1230]/8">
        <div className="wrap space-y-16 sm:space-y-20">
          {/* 3 Simple Steps */}
          <div>
            <div className="max-w-xl mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A2EB8] mb-2">
                How It Works
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B1230] font-normal tracking-tight">
                Three steps to real-world company.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#F8FAFC] border border-[#0B1230]/8 rounded-2xl p-6 space-y-2">
                <span className="font-serif text-2xl font-semibold text-[#0A2EB8] block">01</span>
                <h3 className="font-serif text-xl font-medium text-[#0B1230]">Pick an activity</h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Choose from morning runs, racket sports, Saturday hikes, café games, or Sunday photo walks across Gurugram and Delhi.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#0B1230]/8 rounded-2xl p-6 space-y-2">
                <span className="font-serif text-2xl font-semibold text-[#0A2EB8] block">02</span>
                <h3 className="font-serif text-xl font-medium text-[#0B1230]">We check partner availability</h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Send your hire request 2+ hrs prior. Our team receives it on +91 72178 13236 &amp; happyhangouts.life@gmail.com and checks availability directly with the Hangout Partner.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#0B1230]/8 rounded-2xl p-6 space-y-2">
                <span className="font-serif text-2xl font-semibold text-[#0A2EB8] block">03</span>
                <h3 className="font-serif text-xl font-medium text-[#0B1230]">Manual confirmation &amp; meet</h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Once the partner is available, our team manually sends confirmation to the Hangout Seeker. Fixed rates: ₹99 (30m), ₹199 (1h), ₹449 (2h). No last-hour cancels.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div id="pricing" className="pt-4 scroll-mt-24">
            <div className="max-w-xl mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A2EB8] mb-2">
                Transparent Pricing
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B1230] font-normal tracking-tight">
                Affordable. Fixed per hangout.
              </h2>
              <p className="text-sm sm:text-base text-[#475569] mt-2">
                Pay only for the duration you book—no subscriptions or hidden fees. Café or shared venue bills are not included.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 30 Min */}
              <div className="bg-white border border-[#0B1230]/12 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#19C37D] block mb-2">
                    Affordable starter
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#0B1230]">30 Minutes</h3>
                  <div className="font-serif text-4xl font-semibold text-[#0B1230] mt-2 tabular-nums">
                    ₹99
                  </div>
                  <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                    Quick coffee chat, warm-up jog, or first hangout vibe check (₹198/hr effective).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setSelectedDuration("30m");
                    scrollToSection("match");
                  }}
                  className="mt-6 w-full py-2.5 px-4 rounded-full border border-[#0B1230]/15 hover:border-[#0A2EB8] text-xs font-semibold text-[#0B1230] transition-colors cursor-pointer"
                >
                  Browse 30 min sessions
                </button>
              </div>

              {/* 1 Hour (Featured) */}
              <div className="bg-[#011C92] text-white border border-[#011C92] rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                <div>
                  <span className="text-xs font-semibold text-[#FFC83D] block mb-2">
                    Most popular
                  </span>
                  <h3 className="font-serif text-xl font-medium text-white">1 Hour</h3>
                  <div className="font-serif text-4xl font-semibold text-white mt-2 tabular-nums">
                    ₹199
                  </div>
                  <p className="text-xs text-white/75 mt-2 leading-relaxed">
                    The sweet spot for court rallies, runs, or café strategy games (₹199/hr).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setSelectedDuration("1h");
                    scrollToSection("match");
                  }}
                  className="mt-6 w-full py-2.5 px-4 rounded-full bg-[#FFC83D] hover:bg-[#f5bc2c] text-xs font-bold text-[#0B1230] transition-colors cursor-pointer"
                >
                  Browse 1 hr sessions
                </button>
              </div>

              {/* 2 Hours */}
              <div className="bg-white border border-[#0B1230]/12 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#0A2EB8] block mb-2">
                    Extended hangout
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#0B1230]">2 Hours</h3>
                  <div className="font-serif text-4xl font-semibold text-[#0B1230] mt-2 tabular-nums">
                    ₹449
                  </div>
                  <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                    Built for Saturday hikes, photo walks, and longer doubles sets (₹225/hr).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setSelectedDuration("2h");
                    scrollToSection("match");
                  }}
                  className="mt-6 w-full py-2.5 px-4 rounded-full border border-[#0B1230]/15 hover:border-[#0A2EB8] text-xs font-semibold text-[#0B1230] transition-colors cursor-pointer"
                >
                  Browse 2 hr sessions
                </button>
              </div>
            </div>

            <p className="mt-6 text-xs text-[#475569]">
              Hitting it off? Extend anytime: +₹100 upgrades 30 min (₹99) to 1 hr (₹199), +₹250 upgrades 1 hr (₹199) to 2 hrs (₹449).
            </p>
          </div>
        </div>
      </section>

      {/* 5. SAFETY CHARTER */}
      <section id="safe" className="py-16 sm:py-24 bg-[#011C92] text-white">
        <div className="wrap">
          <div className="max-w-xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3DAAFC] mb-2">
              Trust &amp; Safety
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-tight">
              Built around verified public meetups.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-white/15 bg-white/5 rounded-2xl p-6 space-y-2">
              <h3 className="font-serif text-xl font-medium text-[#FFC83D]">Govt-ID Verified</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Every Hangout Partner and member verifies Aadhaar or PAN details before hosting or booking.
              </p>
            </div>
            <div className="border border-white/15 bg-white/5 rounded-2xl p-6 space-y-2">
              <h3 className="font-serif text-xl font-medium text-[#FFC83D]">Public Places Only</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Screened parks, sports arenas, and cafés only—CyberHub, Sector 29, Khan Market, Lodhi Garden.
              </p>
            </div>
            <div className="border border-white/15 bg-white/5 rounded-2xl p-6 space-y-2">
              <h3 className="font-serif text-xl font-medium text-[#FFC83D]">2-Hr Rule &amp; PIN</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Send requests at least 2 hours prior. Confirm arrival cleanly via your private 4-digit Happy Key PIN.
              </p>
            </div>
            <div className="border border-white/15 bg-white/5 rounded-2xl p-6 space-y-2">
              <h3 className="font-serif text-xl font-medium text-[#FFC83D]">Clear Cancel Policy</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                You can&apos;t cancel in the last hour. Earlier cancellations and partner no-shows refund 100%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PARTNER EARNINGS ESTIMATOR */}
      <section id="earn" className="py-16 sm:py-24 bg-white border-b border-[#0B1230]/8">
        <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A2EB8] mb-2">
                Become a Hangout Partner
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B1230] font-normal tracking-tight">
                Host experiences. Earn on your schedule.
              </h2>
              <p className="text-sm sm:text-base text-[#475569] mt-2 max-w-xl">
                Lead weekend hikes, court rallies, or café chess. Partners keep 80% of every paid session: ₹79 (30 min), ₹159 (1 hr), or ₹359 (2 hrs).
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#0B1230]/8 rounded-2xl p-6 space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#0B1230] mb-1.5">
                  <span>30-minute hangouts / week (₹79 share)</span>
                  <span className="tabular-nums text-[#0A2EB8]">{calcN30}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={calcN30}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCalcN30(val);
                    audio.playSlider(val / 20);
                  }}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#0B1230] mb-1.5">
                  <span>1-hour hangouts / week (₹159 share)</span>
                  <span className="tabular-nums text-[#0A2EB8]">{calcN60}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={calcN60}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCalcN60(val);
                    audio.playSlider(val / 20);
                  }}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#0B1230] mb-1.5">
                  <span>2-hour hangouts / week (₹359 share)</span>
                  <span className="tabular-nums text-[#0A2EB8]">{calcN120}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={calcN120}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCalcN120(val);
                    audio.playSlider(val / 10);
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#F8FAFC] border border-[#0B1230]/10 rounded-2xl p-8 text-center space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#475569] block">
                Estimated Monthly Take-Home
              </span>
              <div className="font-serif text-4xl sm:text-5xl font-semibold text-[#0A2EB8] tabular-nums">
                ₹{monthlyTakeHome.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                After the 20% platform fee. Illustrative estimate based on 4.3 weeks per month.
              </p>
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setWaitlistRole("partner");
                  scrollToSection("join");
                }}
                className="btn w-full py-3 text-sm"
              >
                Apply as Hangout Partner →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MINIMALIST HANGOUT PASS FORM + CONDITIONAL PASS REVEAL */}
      <section id="join" className="py-16 sm:py-24 bg-white">
        <div className="wrap">
          <div className={submittedPass ? "max-w-5xl mx-auto" : "max-w-2xl mx-auto"}>
            <div className="mb-8 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A2EB8]">
                Digital Hangout Pass
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B1230] font-normal tracking-tight">
                Apply for your Hangout Pass.
              </h2>
              <p className="text-sm text-[#475569] max-w-xl">
                Choose Hangout Seeker or Hangout Partner below. Once we receive your request, our team checks your profile manually and only makes it live after verification.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-medium text-[#0B1230]/80 pt-1">
                <span>1. Submit Seeker or Partner request</span>
                <span className="text-[#0A2EB8]">→</span>
                <span>2. Team checks your profile manually</span>
                <span className="text-[#0A2EB8]">→</span>
                <span>3. Profile goes live after approval</span>
              </div>
            </div>

            <div className={submittedPass ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" : ""}>
              <form
                onSubmit={handleWaitlistSubmit}
                className={`${submittedPass ? "lg:col-span-7" : ""} bg-[#F8FAFC] border border-[#0B1230]/10 rounded-2xl p-5 sm:p-8 space-y-5`}
              >
                {/* Role Switch */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setWaitlistRole("seeker");
                    }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      waitlistRole === "seeker"
                        ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                        : "bg-white text-[#0B1230] border-[#0B1230]/12"
                    }`}
                  >
                    <span className="block text-xs font-bold">Hangout Seeker</span>
                    <span className={`block text-[11px] ${waitlistRole === "seeker" ? "text-white/80" : "text-[#475569]"}`}>
                      Book experiences from ₹99
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setWaitlistRole("partner");
                    }}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      waitlistRole === "partner"
                        ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                        : "bg-white text-[#0B1230] border-[#0B1230]/12"
                    }`}
                  >
                    <span className="block text-xs font-bold">Hangout Partner</span>
                    <span className={`block text-[11px] ${waitlistRole === "partner" ? "text-white/80" : "text-[#475569]"}`}>
                      Host &amp; earn Money
                    </span>
                  </button>
                </div>

                {/* Identity & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#0B1230] mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={waitlistName}
                      onChange={(e) => setWaitlistName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1230] mb-1">WhatsApp (+91) *</label>
                    <div className="flex items-center rounded-xl overflow-hidden border border-[#0B1230]/15 bg-white min-h-[42px]">
                      <span className="px-3 py-2 bg-[#F8FAFC] text-xs font-semibold text-[#0B1230] border-r border-[#0B1230]/10">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={waitlistWhatsapp}
                        onChange={(e) => setWaitlistWhatsapp(e.target.value.replace(/[^\d\s-]/g, "").slice(0, 12))}
                        placeholder="98765 43210"
                        required
                        className="clean-input w-full px-3 py-2 text-sm text-[#0B1230]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1230] mb-1">Email *</label>
                    <input
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                {/* City & Preferred Hub */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1230] mb-1">City *</label>
                    <select
                      value={waitlistCity}
                      onChange={(e) => {
                        const c = e.target.value as "Gurugram" | "Delhi";
                        setWaitlistCity(c);
                        setWaitlistLocation(QUICK_HUBS[c][0]);
                      }}
                      className="w-full"
                    >
                      <option value="Gurugram">Gurugram</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1230] mb-1">Preferred Hub *</label>
                    <input
                      type="text"
                      value={waitlistLocation}
                      onChange={(e) => setWaitlistLocation(e.target.value)}
                      placeholder="e.g. Sector 29 Courts"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Hub quick pills */}
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_HUBS[waitlistCity].map((hub) => (
                    <button
                      key={hub}
                      type="button"
                      onClick={() => {
                        audio.playClick();
                        setWaitlistLocation(hub);
                      }}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
                        waitlistLocation === hub
                          ? "bg-[#0B1230] text-white border-[#0B1230]"
                          : "bg-white text-[#475569] border-[#0B1230]/12 hover:border-[#0A2EB8]"
                      }`}
                    >
                      {hub}
                    </button>
                  ))}
                </div>

                {/* Weekly Slot & Experiences */}
                <div>
                  <label className="block text-xs font-semibold text-[#0B1230] mb-1">Preferred Weekly Slot *</label>
                  <select
                    value={waitlistTime}
                    onChange={(e) => setWaitlistTime(e.target.value)}
                    className="w-full"
                  >
                    {TIME_SLOT_OPTIONS.map((slot) => (
                      <option key={slot.id} value={slot.label}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1230] mb-1.5">
                    Select Experiences ({waitlistInterests.length} chosen) *
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {FORM_INTERESTS_OPTIONS.map((item) => {
                      const isSelected = waitlistInterests.includes(item.label);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleWaitlistInterest(item.label)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                              : "bg-white text-[#475569] border-[#0B1230]/12 hover:border-[#0A2EB8]"
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Women-Only Preference */}
                <label className="flex items-center justify-between gap-3 p-3 bg-white border border-[#0B1230]/10 rounded-xl cursor-pointer">
                  <div>
                    <span className="block text-xs font-semibold text-[#0B1230]">
                      Optional Women-Only Preference (For Female Members)
                    </span>
                    <span className="block text-[11px] text-[#475569]">
                      Women can book anyone freely — enable only if you prefer female partners.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={waitlistWomenOnly}
                    onChange={(e) => {
                      audio.playClick();
                      setWaitlistWomenOnly(e.target.checked);
                    }}
                    className="w-4 h-4 accent-[#0A2EB8] shrink-0 cursor-pointer"
                  />
                </label>

                <p className="text-[11px] text-[#475569] leading-relaxed">
                  Manual Profile Review: Our team reviews every Hangout Seeker &amp; Hangout Partner submission before activating your profile live.
                </p>

                <button
                  type="submit"
                  className="btn w-full py-3.5 text-sm min-h-[48px]"
                >
                  {submittedPass ? "Update Hangout Pass Request" : "Submit Hangout Pass Request"}
                </button>

                {waitlistStatus && (
                  <p className="text-xs font-medium text-[#0B1230] bg-white border border-[#0B1230]/12 rounded-xl px-4 py-3">
                    {waitlistStatus}
                  </p>
                )}
              </form>

              {/* Digital Pass Application Preview (Pending Manual Review) */}
              {submittedPass && (
                <div ref={passPreviewRef} className="lg:col-span-5 lg:sticky lg:top-24">
                  <div className="bg-[#011C92] text-white rounded-2xl p-6 space-y-5 shadow-xl">
                    <div className="flex items-center justify-between pb-4 border-b border-white/15 gap-2">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3DAAFC] block">
                          Happy Hangouts Pass
                        </span>
                        <span className="text-[11px] font-semibold text-[#FFC83D]">
                          Pending Manual Profile Check
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold bg-[#FFC83D] text-[#0B1230] px-2.5 py-0.5 rounded shrink-0">
                        {submittedPass.passId}
                      </span>
                    </div>

                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-white/60">
                        {submittedPass.role === "partner"
                          ? "Hangout Partner Application"
                          : "Hangout Seeker Application"}
                      </p>
                      <h4 className="font-serif text-2xl font-medium text-white mt-0.5 truncate">
                        {submittedPass.name}
                      </h4>
                      <p className="text-xs text-white/75 mt-1 truncate">
                        +91 {submittedPass.whatsapp} · {submittedPass.email}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-white/85 pt-2 border-t border-white/10">
                      <div className="flex justify-between gap-2">
                        <span className="text-white/60">Status</span>
                        <span className="font-semibold text-[#FFC83D] text-right">
                          Under Review · Goes live manually
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-white/60">Hub</span>
                        <span className="font-medium text-right">{submittedPass.location}, {submittedPass.city}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-white/60">Slot</span>
                        <span className="font-medium text-right">{submittedPass.time}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-white/60">Rates</span>
                        <span className="font-medium text-[#19C37D] text-right">₹99 (30m) · ₹199 (1h) · ₹449 (2h)</span>
                      </div>
                      {submittedPass.womenOnly && (
                        <div className="flex justify-between gap-2">
                          <span className="text-white/60">Preference</span>
                          <span className="font-medium text-[#FFC83D]">Women-Only Enabled</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                      {submittedPass.interests.map((interest) => (
                        <span key={interest} className="text-[11px] text-white/90 bg-white/10 px-2.5 py-0.5 rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <FaqSection onJoinWaitlist={() => scrollToSection("join")} />

      {/* BOOKING MODAL & LIVE DISPATCHER */}
      <AnimatePresence>
        {bookingCompanion && isDispatching && (
          <HangoutRequestDispatcher
            companion={bookingCompanion}
            meetingLocation={bookingLocation}
            meetingDate={bookingDate}
            meetingTime={`${bookingTime} · ${bookingStartHour}`}
            durationPrice={activeDuration.price}
            durationLabel={activeDuration.shortLabel}
            bookingId={activeBookingId}
            happyKeyPin={activeHappyKeyPin}
            isFirstFree={false}
            womenOnly={bookingWomenOnly}
            seekerName={userProfile?.name}
            seekerPhone={userProfile?.phone}
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
          <div className="fixed inset-0 z-50 bg-[#0B1230]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="bg-white border border-[#0B1230]/15 rounded-2xl p-5 sm:p-7 max-w-lg w-full shadow-2xl relative max-h-[92vh] overflow-y-auto my-auto"
            >
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  setBookingCompanion(null);
                }}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2 rounded-full border border-[#0B1230]/12 hover:bg-[#F8FAFC] cursor-pointer text-[#475569] min-w-[36px] min-h-[36px] flex items-center justify-center bg-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 mb-5 pr-8">
                <img
                  src={bookingCompanion.interestPhoto}
                  alt={bookingCompanion.interestPhotoAlt}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover border border-[#0B1230]/10 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-[#0A2EB8] block">
                    {bookingCompanion.categoryLabel} · {bookingCompanion.slotLabel}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#0B1230] leading-snug">
                    {bookingCompanion.experienceTitle}
                  </h3>
                  <p className="text-xs text-[#475569] mt-0.5 truncate">
                    {bookingCompanion.location} · {bookingCompanion.rating}★
                  </p>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-[#19C37D]/15 text-[#19C37D] rounded-full flex items-center justify-center mx-auto font-bold text-xl">
                    ✓
                  </div>
                  <h4 className="font-serif text-2xl text-[#0B1230]">Experience Spot Reserved</h4>
                  <button
                    type="button"
                    onClick={() => setBookingCompanion(null)}
                    className="btn w-full py-3"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-[#475569] bg-[#F8FAFC] border border-[#0B1230]/8 rounded-xl p-3 leading-relaxed">
                    Govt-ID verified {bookingWomenOnly ? "Female Hangout Partner" : "Hangout Partner"} ({bookingWomenOnly ? bookingCompanion.womenCaptainName : bookingCompanion.name}) unlocks privately after confirmation.
                  </p>

                  {/* Hangout Preference: Women can book anyone OR pick optional Women-Only */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <label className="text-xs font-semibold text-[#0B1230]">Hangout Preference</label>
                      <span className="text-[11px] text-[#475569]">Women can book anyone · Women-Only optional</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          audio.playClick();
                          setBookingWomenOnly(false);
                          setWomenOnlyConfirmed(false);
                          setBookingError(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                          !bookingWomenOnly
                            ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                            : "bg-white text-[#0B1230] border-[#0B1230]/15"
                        }`}
                      >
                        <span className="block text-xs font-bold">Standard Open (Book Anyone)</span>
                        <span className={`block text-[10px] ${!bookingWomenOnly ? "text-white/80" : "text-[#475569]"}`}>
                          Any verified Hangout Partner
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          audio.playClick();
                          setBookingWomenOnly(true);
                          if (userProfile?.gender === "female") setWomenOnlyConfirmed(true);
                          setBookingError(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                          bookingWomenOnly
                            ? "bg-[#011C92] text-white border-[#011C92]"
                            : "bg-white text-[#0B1230] border-[#0B1230]/15"
                        }`}
                      >
                        <span className="block text-xs font-bold flex items-center justify-between">
                          <span>Women-Only Preference</span>
                          {bookingWomenOnly && <Check className="w-3.5 h-3.5 text-[#FFC83D]" />}
                        </span>
                        <span className={`block text-[10px] ${bookingWomenOnly ? "text-[#FFC83D]" : "text-[#475569]"}`}>
                          Optional · Female partner only
                        </span>
                      </button>
                    </div>

                    {bookingWomenOnly && (
                      <label className="mt-2 p-2.5 bg-[#F8FAFC] border border-[#0B1230]/10 rounded-xl flex items-start gap-2 text-xs text-[#0B1230] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={womenOnlyConfirmed}
                          onChange={(e) => {
                            setWomenOnlyConfirmed(e.target.checked);
                            if (e.target.checked) setBookingError(null);
                          }}
                          className="mt-0.5 w-4 h-4 accent-[#0A2EB8] shrink-0"
                        />
                        <span>Confirm optional Women-Only preference (for female members).</span>
                      </label>
                    )}
                  </div>

                  {/* Date & Start Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B1230] mb-1">Day</label>
                      <select
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full text-sm"
                      >
                        <option>Tomorrow (Weekday)</option>
                        <option>Next Weekday</option>
                        <option>This Saturday</option>
                        <option>This Sunday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B1230] mb-1">Start Time (2-Hr Rule)</label>
                      <select
                        value={bookingStartHour}
                        onChange={(e) => setBookingStartHour(e.target.value)}
                        className="w-full text-sm"
                      >
                        <option value="6:30 AM">6:30 AM (Req by 4:30 AM)</option>
                        <option value="7:30 AM">7:30 AM (Req by 5:30 AM)</option>
                        <option value="5:00 PM">5:00 PM (Req by 3:00 PM)</option>
                        <option value="6:30 PM">6:30 PM (Req by 4:30 PM)</option>
                        <option value="7:30 PM">7:30 PM (Req by 5:30 PM)</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#475569] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0A2EB8] shrink-0" />
                    <span>
                      Minimum 2-hour advance rule: send request by <strong className="text-[#0B1230]">{getAdvanceCutoffLabel(bookingStartHour)}</strong>.
                    </span>
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-[#0B1230] mb-1">Public Meeting Spot</label>
                    <input
                      type="text"
                      value={bookingLocation}
                      onChange={(e) => setBookingLocation(e.target.value)}
                      placeholder="e.g. Blue Tokai CyberHub"
                      className="w-full text-sm"
                    />
                  </div>

                  {/* Pricing & Duration Selector */}
                  <div className="p-3.5 bg-[#F8FAFC] border border-[#0B1230]/10 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {DURATION_OPTIONS.map((dur) => (
                        <button
                          key={dur.id}
                          type="button"
                          onClick={() => {
                            audio.playClick();
                            setSelectedDuration(dur.id);
                          }}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold border cursor-pointer transition-colors ${
                            selectedDuration === dur.id
                              ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                              : "bg-white text-[#0B1230] border-[#0B1230]/15"
                          }`}
                        >
                          {dur.pillLabel}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#0B1230]/8">
                      <span className="text-[#475569]">Total Payable on Confirmation</span>
                      <span className="font-serif text-base font-semibold text-[#0B1230] tabular-nums">
                        ₹{activeModalPricing.chargedPriceInr} ({activeModalPricing.durationLabel})
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#475569] flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#0B1230]">Manual Process &amp; Policy:</strong> Once we receive your request, our team checks availability with the Hangout Partner and manually sends final confirmation to you. You can&apos;t cancel last hour.
                    </span>
                  </p>

                  {bookingError && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-400 text-amber-900 text-xs font-medium">
                      {bookingError}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={bookingSubmitting}
                    onClick={handleConfirmBooking}
                    className="btn w-full py-3.5 text-sm min-h-[46px]"
                  >
                    {bookingSubmitting
                      ? "Sending Hire Notification..."
                      : `Send Hire Request (${bookingStartHour} · ₹${activeModalPricing.chargedPriceInr})`}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AUTH GATE & PORTALS */}
      <AuthBookingGateModal
        isOpen={authModalOpen}
        pendingExperience={pendingBookingCompanion}
        initialMode={authInitialMode}
        defaultRole={authDefaultRole}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingBookingCompanion(null);
        }}
        onAuthenticatedReady={() => {
          setAuthModalOpen(false);
          if (pendingBookingCompanion) {
            const target = pendingBookingCompanion;
            setPendingBookingCompanion(null);
            launchBookingModal(target);
          }
        }}
      />

      <AdminPortal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onOpenAuth={() => {
          setPendingBookingCompanion(null);
          setAuthInitialMode("signin");
          setAuthModalOpen(true);
        }}
      />

      <PartnerPortal
        isOpen={partnerPortalOpen}
        onClose={() => setPartnerPortalOpen(false)}
        onOpenAuth={() => {
          setPendingBookingCompanion(null);
          setAuthInitialMode("signup");
          setAuthDefaultRole("partner");
          setAuthModalOpen(true);
        }}
      />

      <SeekerBookingsModal
        isOpen={seekerBookingsOpen}
        onClose={() => setSeekerBookingsOpen(false)}
      />

      {/* 9. QUIET EDITORIAL FOOTER */}
      <footer className="py-12 sm:py-16 bg-[#011C92] text-white/80">
        <div className="wrap">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/15">
            <div className="sm:col-span-2 lg:col-span-1 space-y-2">
              <span className="font-serif text-xl font-semibold text-white block">
                Happy Hangouts
              </span>
              <p className="text-xs text-white/70 leading-relaxed max-w-xs">
                Experience-first offline hangouts across Gurugram &amp; Delhi NCR with Govt-ID verified Hangout Partners.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase tracking-[0.14em] text-white mb-3">
                Experiences
              </h5>
              <ul className="space-y-2 text-xs text-white/75">
                <li><a href="#match" onClick={() => setSelectedCategory("running")} className="hover:text-white">Running Buddy</a></li>
                <li><a href="#match" onClick={() => setSelectedCategory("rackets")} className="hover:text-white">Pickleball &amp; Badminton</a></li>
                <li><a href="#match" onClick={() => setSelectedCategory("hike")} className="hover:text-white">Weekend Hike</a></li>
                <li><a href="#match" onClick={() => setSelectedCategory("games_cafe")} className="hover:text-white">Chess &amp; Café Games</a></li>
                <li><a href="#match" onClick={() => setSelectedCategory("photowalk")} className="hover:text-white">Sunday Photo Walk</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase tracking-[0.14em] text-white mb-3">
                Platform
              </h5>
              <ul className="space-y-2 text-xs text-white/75">
                <li><a href="#pricing" className="hover:text-white">Pricing (₹99 / ₹199 / ₹449)</a></li>
                <li><a href="#safe" className="hover:text-white">Safety Charter</a></li>
                <li><a href="#earn" className="hover:text-white">Become a Partner</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ &amp; Refunds</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase tracking-[0.14em] text-white mb-3">
                Member &amp; Partner Access
              </h5>
              <ul className="space-y-2 text-xs text-white/75">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setSeekerBookingsOpen(true);
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    My Bookings
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setPartnerPortalOpen(true);
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    Hangout Partner Portal
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      audio.playClick();
                      setAdminOpen(true);
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    Admin Console
                  </button>
                </li>
                <li>
                  <a href="https://wa.me/917217813236" target="_blank" rel="noopener noreferrer" className="text-[#FFC83D] hover:underline">
                    WhatsApp +91 72178 13236
                  </a>
                </li>
                <li>
                  <a href="mailto:happyhangouts.life@gmail.com" className="hover:text-white break-all">
                    happyhangouts.life@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
            <p>© {new Date().getFullYear()} Happy Hangouts · Delhi NCR</p>
            <p>Akele kyu? Happy Hangouts Hai na.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
