import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  UserCheck, 
  Briefcase, 
  ShieldCheck, 
  Key, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Coffee, 
  Dumbbell, 
  Lightbulb, 
  Camera, 
  Music, 
  BookOpen, 
  CreditCard, 
  Smartphone, 
  Calendar, 
  ChevronRight,
  Filter,
  DollarSign,
  AlertCircle,
  X,
  Send,
  Zap,
  HelpCircle
} from "lucide-react";
import { audio } from "../utils/audio";
import confetti from "canvas-confetti";

export interface CompanionProfile {
  id: string;
  name: string;
  avatarSeed: string;
  age: number;
  city: string;
  hub: string;
  vibe: string;
  category: "coffee" | "sports" | "tech" | "photo" | "chess" | "music";
  bio: string;
  hourlyRate: number;
  rating: number;
  hangoutsCompleted: number;
  verifiedBadges: string[];
  skills: string[];
  availability: string;
  color: string;
  emoji: string;
}

const COMPANIONS: CompanionProfile[] = [
  {
    id: "comp-1",
    name: "Aarav Mehta",
    avatarSeed: "aarav",
    age: 26,
    city: "Gurgaon",
    hub: "CyberHub & 32nd Avenue",
    vibe: "Startup Pitching & Tech Co-working",
    category: "tech",
    bio: "Ex-fintech builder. Love whiteboarding product ideas, discussing AI agents, or doing focused co-working sessions over pour-overs.",
    hourlyRate: 500,
    rating: 4.98,
    hangoutsCompleted: 34,
    verifiedBadges: ["Biometric Facial Hash ✓", "Aadhaar Identity ✓", "Founding Partner #04"],
    skills: ["Startup Brainstorming", "AI & Tech", "Espresso Tasting", "Pitch Decks"],
    availability: "Weekdays after 5 PM, Weekends",
    color: "from-blue-600 to-indigo-700",
    emoji: "💡"
  },
  {
    id: "comp-2",
    name: "Meera Reddy",
    avatarSeed: "meera",
    age: 24,
    city: "South Delhi",
    hub: "Siri Fort & Sunder Nursery",
    vibe: "Badminton Tactical Rally & Fitness",
    category: "sports",
    bio: "State-level badminton player. Looking for rally partners, morning outdoor runs, or post-match smoothies in leafy Delhi parks.",
    hourlyRate: 600,
    rating: 5.0,
    hangoutsCompleted: 48,
    verifiedBadges: ["Biometric Facial Hash ✓", "Govt ID Verified ✓", "Superhost 5★"],
    skills: ["Badminton Rallies", "Footwork Drills", "Morning Fitness", "Park Trails"],
    availability: "Tue, Thu, Sat, Sun mornings",
    color: "from-emerald-600 to-teal-700",
    emoji: "🏸"
  },
  {
    id: "comp-3",
    name: "Kabir Sen",
    avatarSeed: "kabir",
    age: 27,
    city: "Central Delhi",
    hub: "Khan Market & Lodhi Colony",
    vibe: "Specialty Coffee & Vintage Vinyls",
    category: "coffee",
    bio: "Vinyl collector and literature buff. Passionate about indie cinema, Murakami novels, and discovering quiet cafe reading nooks.",
    hourlyRate: 400,
    rating: 4.92,
    hangoutsCompleted: 29,
    verifiedBadges: ["Biometric Facial Hash ✓", "Aadhaar Identity ✓", "Vibe Verified"],
    skills: ["Specialty Coffee", "Book Discussions", "Vinyl Hunting", "Art Cafe Crawls"],
    availability: "Flexible all week",
    color: "from-amber-600 to-orange-700",
    emoji: "☕"
  },
  {
    id: "comp-4",
    name: "Ananya Kapoor",
    avatarSeed: "ananya",
    age: 23,
    city: "Central / South Delhi",
    hub: "Lodhi Art District & NGMA",
    vibe: "Street Photowalks & Heritage Tales",
    category: "photo",
    bio: "Street photographer with 35mm film passion. Let's explore Delhi's street murals, secret stepwells, and snap timeless candid portraits.",
    hourlyRate: 550,
    rating: 4.96,
    hangoutsCompleted: 41,
    verifiedBadges: ["Biometric Facial Hash ✓", "Aadhaar Identity ✓", "Top Visualist"],
    skills: ["35mm Street Photo", "Composition Tips", "Heritage Walking", "Art Murals"],
    availability: "Saturday & Sunday Golden Hour",
    color: "from-pink-600 to-rose-700",
    emoji: "📸"
  },
  {
    id: "comp-5",
    name: "Rohan Verma",
    avatarSeed: "rohan",
    age: 28,
    city: "Central Delhi",
    hub: "Cha Bar CP & India Habitat Centre",
    vibe: "Chess Tactical Match & Philosophy",
    category: "chess",
    bio: "FIDE rated 1850. Happy to play blitz, rapid, or teach chess openings, alongside deep conversations on psychology and history.",
    hourlyRate: 450,
    rating: 4.95,
    hangoutsCompleted: 22,
    verifiedBadges: ["Biometric Facial Hash ✓", "Aadhaar Identity ✓", "Chess Master"],
    skills: ["Blitz & Rapid Chess", "Opening Strategy", "Board Games", "Philosophy"],
    availability: "Mon, Wed, Fri evenings & Weekends",
    color: "from-purple-600 to-indigo-800",
    emoji: "♟️"
  },
  {
    id: "comp-6",
    name: "Priya Sharma",
    avatarSeed: "priya",
    age: 25,
    city: "Noida",
    hub: "Sector 104 Cafe Strip & DLF Mall",
    vibe: "Acoustic Guitar Jam & Indie Vocals",
    category: "music",
    bio: "Singer-songwriter playing acoustic melodies. Let's do a duet jam, explore live indie gigs, or grab iced matcha and talk music production.",
    hourlyRate: 500,
    rating: 5.0,
    hangoutsCompleted: 38,
    verifiedBadges: ["Biometric Facial Hash ✓", "Aadhaar Identity ✓", "Music Superhost"],
    skills: ["Acoustic Guitar", "Vocal Harmonies", "Indie Music Gigs", "Songwriting"],
    availability: "Thursday & Weekend afternoons",
    color: "from-violet-600 to-fuchsia-700",
    emoji: "🎸"
  }
];

interface HowItWorksHireGetHiredProps {
  onApplyAsPartner: (interest?: string) => void;
  onBookAsSeeker: (details: string) => void;
  themeVibe: "day" | "twilight";
}

export default function HowItWorksHireGetHired({
  onApplyAsPartner,
  onBookAsSeeker,
  themeVibe
}: HowItWorksHireGetHiredProps) {
  // Active Mode: 'hire' (Seeker) vs 'get_hired' (Partner)
  const [activeTab, setActiveTab] = useState<"hire" | "get_hired">("hire");
  
  // Interactive Step Tracker
  const [activeStep, setActiveStep] = useState<number>(1);
  
  // Marketplace Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Modal for Simulated Booking
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionProfile | null>(null);
  const [bookingDate, setBookingDate] = useState("This Saturday");
  const [bookingTime, setBookingTime] = useState("11:00 AM - 1:00 PM (2 hrs)");
  const [bookingNote, setBookingNote] = useState("Excited to connect and hang out!");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const seekerSteps = [
    {
      step: 1,
      title: "Discover Verified Companions",
      subtitle: "Browse Real Passions & Vibe Tags",
      desc: "Explore 100% ID-verified locals in Delhi NCR by specific passions: badminton rallies, tech brainstorming, cafe reading, or heritage photowalks.",
      icon: <UserCheck className="w-5 h-5" />,
      badge: "Zero Catfishes",
      highlight: "Filter by location (Delhi / Noida / Gurgaon), hourly token rate, and mutual hobbies."
    },
    {
      step: 2,
      title: "Transparent Hourly Booking",
      subtitle: "Safe Escrow & Zero Awkwardness",
      desc: "Select your desired slot and duration. Transparent hourly rates (₹300 - ₹600/hr or 1st 3 hangouts free during launch). No awkward bill splits!",
      icon: <CreditCard className="w-5 h-5" />,
      badge: "Escrow Protection",
      highlight: "Payment is securely escrowed and only released after your hangout session successfully completes."
    },
    {
      step: 3,
      title: "Meet at Vetted Public Hubs",
      subtitle: "10+ Certified Safe Hangout Spots",
      desc: "Meets happen strictly at verified public spots—Blue Tokai Khan Market, Siri Fort Complex, Sunder Nursery, CyberHub, or Sector 104 Noida.",
      icon: <MapPin className="w-5 h-5" />,
      badge: "100% Public & Safe",
      highlight: "Partner cafes reserve table seating and provide a safe, vibrant atmosphere."
    },
    {
      step: 4,
      title: "Dual Happy Key Handshake",
      subtitle: "6-Digit Mutual Verification",
      desc: "When you arrive, both you and your companion match matching 6-digit Happy Keys on the website to authenticate presence with biometric facial check.",
      icon: <Key className="w-5 h-5" />,
      badge: "Biometric Protocol",
      highlight: "Guarantees that the exact person you booked is physically present."
    },
    {
      step: 5,
      title: "Enjoy, Rate & Build Your Circle",
      subtitle: "Genuine Real-World Connection",
      desc: "Share your passion, have deep conversations, play sports, and leave a 5★ review. Save favorite companions for regular weekly sessions!",
      icon: <Star className="w-5 h-5" />,
      badge: "5★ Community",
      highlight: "Unlock loyalty perks, invitations to micro-gatherings, and priority scheduling."
    }
  ];

  const partnerSteps = [
    {
      step: 1,
      title: "60-Second Biometric Onboarding",
      subtitle: "Liveness Check & Aadhaar Hash",
      desc: "Sign up as a Founding Hangout Partner. Complete a fast biometric selfie liveness scan and Aadhaar verification to establish maximum trust.",
      icon: <ShieldCheck className="w-5 h-5" />,
      badge: "Govt & Face Verified",
      highlight: "Your personal data is encrypted at rest using AES-256 with DPDP compliance."
    },
    {
      step: 2,
      title: "Build Your Vibe & Set Your Rate",
      subtitle: "Monetize What You Love",
      desc: "List your specialties (guitar, badminton, chess, cafes, tech), upload your photos, and set your hourly hangout rate (e.g., ₹400 - ₹800/hr).",
      icon: <Briefcase className="w-5 h-5" />,
      badge: "You Set The Price",
      highlight: "First 50 Founding Partners get lifetime 0% platform commissions & Founder Badges!"
    },
    {
      step: 3,
      title: "Receive & Accept Booking Requests",
      subtitle: "Total Schedule Autonomy",
      desc: "Get instant WhatsApp and SMS alerts when verified seekers book your open slots. Review their profile and accept on your own terms.",
      icon: <Smartphone className="w-5 h-5" />,
      badge: "WhatsApp Alerts",
      highlight: "Never accept unvetted strangers. Full control over when, where, and who you hang out with."
    },
    {
      step: 4,
      title: "Host at Certified Partner Hubs",
      subtitle: "Safe, Welcoming Public Venues",
      desc: "Meet at designated partner cafes and sports arenas. Enter the 6-digit Happy Key on arrival to start the clocked session safely.",
      icon: <Key className="w-5 h-5" />,
      badge: "Reserved Seating",
      highlight: "Enjoy partner discounts and dedicated tables at our partner cafe network."
    },
    {
      step: 5,
      title: "Instant Direct UPI Payouts",
      subtitle: "Earn ₹15,000 - ₹40,000+ / Month",
      desc: "Once the session concludes, your earnings and optional tips are instantly deposited to your UPI bank account with 0% commission deducted.",
      icon: <Zap className="w-5 h-5" />,
      badge: "Instant Bank Payout",
      highlight: "Hosting 5–10 hrs/week easily generates ₹10,000–₹30,000+ while making genuine friendships."
    }
  ];

  const currentSteps = activeTab === "hire" ? seekerSteps : partnerSteps;
  const currentStepData = currentSteps.find(s => s.step === activeStep) || currentSteps[0];

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
      onBookAsSeeker(`Booked Hangout with ${selectedCompanion?.name} (${selectedCompanion?.vibe}) at ${selectedCompanion?.hub} for ${bookingDate} [${bookingTime}]`);
      setBookingConfirmed(false);
      setSelectedCompanion(null);
    }, 1800);
  };

  return (
    <section 
      id="how-it-works-marketplace" 
      className={`py-20 sm:py-28 px-4 sm:px-6 md:px-12 border-y transition-colors duration-500 relative overflow-hidden ${
        themeVibe === 'twilight' 
          ? 'bg-slate-950 text-white border-slate-800' 
          : 'bg-gradient-to-b from-white via-slate-50/50 to-white text-slate-900 border-slate-200/80'
      }`}
    >
      {/* Background Decorative Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16 sm:space-y-20">
        
        {/* ============================================================ */}
        {/* SECTION HEADER & DUAL ROLE SELECTOR                           */}
        {/* ============================================================ */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 font-mono text-[11px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>THE TWO-SIDED HANGOUT ECOSYSTEM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-[1.1]">
            How to <span className="text-blue-600">Hire</span> or <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Get Hired</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            Happy Hangouts connects seekers craving real-life companionship with passionate local partners who host, teach, and guide activities across Delhi NCR.
          </p>

          {/* DUAL INTERACTIVE ROLE TOGGLE */}
          <div className="pt-4 flex justify-center">
            <div className={`p-1.5 rounded-2xl sm:rounded-full border flex flex-col sm:flex-row items-center gap-2 max-w-xl w-full shadow-lg transition-all ${
              themeVibe === 'twilight' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <button
                id="tab-seeker-hire"
                onClick={() => {
                  audio.playClick();
                  setActiveTab("hire");
                  setActiveStep(1);
                }}
                className={`w-full sm:flex-1 py-3 px-5 rounded-xl sm:rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "hire"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>I Want to Hire a Partner</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono">SEEKER</span>
              </button>

              <button
                id="tab-partner-get-hired"
                onClick={() => {
                  audio.playClick();
                  setActiveTab("get_hired");
                  setActiveStep(1);
                }}
                className={`w-full sm:flex-1 py-3 px-5 rounded-xl sm:rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "get_hired"
                    ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>I Want to Get Hired &amp; Earn</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono font-bold">EARN ₹</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE 5-STEP WORKFLOW WALKTHROUGH                      */}
        {/* ============================================================ */}
        <div className={`p-6 sm:p-10 rounded-[32px] border shadow-xl relative overflow-hidden transition-all ${
          themeVibe === 'twilight' 
            ? 'bg-slate-900/80 border-slate-800' 
            : 'bg-white border-slate-200/90 shadow-slate-100'
        }`}>
          {/* Header of the step simulator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <span>{activeTab === 'hire' ? 'SEEKER JOURNEY' : 'PARTNER ONBOARDING JOURNEY'}</span>
                <span>•</span>
                <span>STEP {activeStep} OF 5</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-display mt-1">
                {activeTab === 'hire' 
                  ? 'How You Hire a Vetted Companion in 5 Simple Steps' 
                  : 'How You Get Hired, Host Hangouts & Get Paid'}
              </h3>
            </div>

            {/* Quick Step Navigation Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
              {currentSteps.map((s) => (
                <button
                  key={s.step}
                  onClick={() => {
                    audio.playClick();
                    setActiveStep(s.step);
                  }}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-mono text-xs font-black transition-all flex items-center justify-center cursor-pointer ${
                    activeStep === s.step
                      ? activeTab === 'hire' 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-110'
                        : 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-md scale-110'
                      : s.step < activeStep
                        ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {s.step < activeStep ? "✓" : `0${s.step}`}
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Interactive Showcase Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            
            {/* Left Column: Step Details & Explanation */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {currentStepData.icon}
                <span>{currentStepData.badge}</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-slate-400">
                  {currentStepData.subtitle}
                </h4>
                <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                  {currentStepData.title}
                </h3>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                {currentStepData.desc}
              </p>

              {/* Key Benefit Highlight Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  <strong>Why it matters:</strong> {currentStepData.highlight}
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-3 pt-2">
                {activeStep > 1 && (
                  <button
                    onClick={() => {
                      audio.playClick();
                      setActiveStep(prev => prev - 1);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    ← Previous Step
                  </button>
                )}

                {activeStep < 5 ? (
                  <button
                    onClick={() => {
                      audio.playClick();
                      setActiveStep(prev => prev + 1);
                    }}
                    className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                      activeTab === 'hire'
                        ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                    }`}
                  >
                    <span>Next: Step 0{activeStep + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      audio.playPageTransition();
                      if (activeTab === 'hire') {
                        // Jump to live companion directory below
                        const element = document.getElementById("companion-directory");
                        element?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        onApplyAsPartner("Completed Partner Step Walkthrough");
                      }
                    }}
                    className={`px-6 py-2.5 rounded-xl text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
                      activeTab === 'hire'
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{activeTab === 'hire' ? 'Browse Companions to Hire Below ↓' : 'Apply to Get Hired as Partner ↗'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Simulated Visual Interface */}
            <div className="lg:col-span-6">
              <div className={`p-6 sm:p-7 rounded-3xl border shadow-xl relative overflow-hidden text-left ${
                themeVibe === 'twilight'
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-900 text-white border-slate-950'
              }`}>
                {/* Web Portal Verification Status Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-slate-300">HAPPY HANGOUTS • VERIFIED PORTAL</span>
                  </div>
                  <span>DELHI NCR SECURE</span>
                </div>

                {/* Simulated Interactive Card for Current Step */}
                <div className="py-6 space-y-4">
                  {activeTab === "hire" ? (
                    // SEEKER VISUAL INTERFACES
                    activeStep === 1 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Verified Companion Pool: <strong>Delhi, Noida, Gurgaon</strong></span>
                          <span className="text-emerald-400">100% ID Verified ✓</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-2xl">
                            🏸
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm text-white">Meera Reddy</h5>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">BADMINTON RALLY</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Siri Fort Sports Complex • 5.0★ (48 hangouts)</p>
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-sm font-bold text-emerald-400">₹600</span>
                            <span className="text-[10px] text-slate-400 block">/ hour</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center gap-4 opacity-70">
                          <div className="w-12 h-12 rounded-2xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-2xl">
                            ☕
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm text-white">Kabir Sen</h5>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">COFFEE &amp; VINYLS</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">Khan Market Blue Tokai • 4.9★ (29 hangouts)</p>
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-sm font-bold text-emerald-400">₹400</span>
                            <span className="text-[10px] text-slate-400 block">/ hour</span>
                          </div>
                        </div>
                      </div>
                    ) : activeStep === 2 ? (
                      <div className="p-4 rounded-2xl bg-slate-800/90 border border-blue-500/40 space-y-4">
                        <div className="flex justify-between items-center text-xs font-mono text-blue-400 font-bold">
                          <span>ESCROW PAYMENT SUMMARY</span>
                          <span>PROTECTED</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-slate-300">
                            <span>Hangout Activity (2 hrs with Aarav Mehta)</span>
                            <span>₹1,000</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Partner Hub Table Reservation</span>
                            <span className="text-emerald-400">FREE</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Launch Escrow Protection Fee</span>
                            <span className="text-emerald-400">₹0 (Waived)</span>
                          </div>
                          <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-sm text-white">
                            <span>Total Escrow Held:</span>
                            <span className="text-emerald-400">₹1,000</span>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-[11px] text-blue-200">
                          🔒 Funds remain in escrow until both parties confirm completion at the cafe.
                        </div>
                      </div>
                    ) : activeStep === 3 ? (
                      <div className="space-y-3">
                        <div className="text-xs font-mono text-slate-400">VETTED PUBLIC MEETING HUBS</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                            <span className="text-base">☕</span>
                            <div className="font-bold text-white mt-1">Blue Tokai</div>
                            <div className="text-[10px] text-slate-400">Khan Market &amp; Gurgaon</div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                            <span className="text-base">🏸</span>
                            <div className="font-bold text-white mt-1">Siri Fort Sports</div>
                            <div className="text-[10px] text-slate-400">South Delhi Complex</div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                            <span className="text-base">🌳</span>
                            <div className="font-bold text-white mt-1">Sunder Nursery</div>
                            <div className="text-[10px] text-slate-400">Heritage Park &amp; Walks</div>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                            <span className="text-base">🍰</span>
                            <div className="font-bold text-white mt-1">Sec 104 Cafe Strip</div>
                            <div className="text-[10px] text-slate-400">Noida Express Vibe</div>
                          </div>
                        </div>
                      </div>
                    ) : activeStep === 4 ? (
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/40 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 mx-auto">
                          <Key className="w-6 h-6" />
                        </div>
                        <h5 className="font-bold text-white text-sm">Mutual Happy Key Handshake</h5>
                        <div className="inline-block px-6 py-2 rounded-xl bg-slate-900 border border-indigo-400 font-mono text-2xl font-black text-amber-400 tracking-[0.3em]">
                          7 4 9 • 2 8 1
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Both devices match this key at the venue. Liveness check confirms 100% genuine presence.
                        </p>
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-slate-800/90 border border-emerald-500/40 text-center space-y-3">
                        <div className="text-3xl">🎉 ⭐⭐⭐⭐⭐</div>
                        <h5 className="font-bold text-white text-sm">Hangout Completed Successfully!</h5>
                        <p className="text-xs text-slate-300">
                          "Aarav was super sharp and gave great feedback on my SaaS pitch. Will definitely book again!"
                        </p>
                        <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                          ✓ ₹1,000 Escrow Released to Partner
                        </div>
                      </div>
                    )
                  ) : (
                    // PARTNER VISUAL INTERFACES
                    activeStep === 1 ? (
                      <div className="p-4 rounded-2xl bg-slate-800/90 border border-indigo-500/40 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                            ✓
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">Biometric Facial Verification</div>
                            <div className="text-[10px] text-slate-400">One-way mathematical hash created</div>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-300">Aadhaar Paperless Offline e-KYC</span>
                          <span className="text-emerald-400 font-mono font-bold">APPROVED ✓</span>
                        </div>
                        <div className="text-[10px] text-slate-400 text-center">
                          🔒 Zero photo resale. DPDP Act 2023 certified.
                        </div>
                      </div>
                    ) : activeStep === 2 ? (
                      <div className="p-4 rounded-2xl bg-slate-800/90 border border-purple-500/40 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono font-bold text-purple-300">SET HOURLY HANGOUT RATE</span>
                          <span className="text-xs font-mono font-black text-amber-400">₹500 / hr</span>
                        </div>
                        <input 
                          type="range" 
                          min="300" 
                          max="1500" 
                          step="50" 
                          defaultValue="500" 
                          className="w-full accent-indigo-500 cursor-pointer"
                        />
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Badminton</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Coffee &amp; Books</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Startups</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Chess</span>
                        </div>
                      </div>
                    ) : activeStep === 3 ? (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/40 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-emerald-400 font-bold font-mono">⚡ NEW HANGOUT REQUEST</span>
                          <span className="text-slate-400">2 min ago</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                          <div className="font-bold text-white">Aditya Sen (ID Verified ✓)</div>
                          <p className="text-slate-400 text-[11px]">"Would love to do a 2-hr tech brainstorming session at CyberHub this Saturday."</p>
                          <div className="text-emerald-400 font-mono font-bold pt-1">Offer: ₹1,000 (Escrowed)</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs">
                            Accept Hangout ✓
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs">
                            Decline
                          </button>
                        </div>
                      </div>
                    ) : activeStep === 4 ? (
                      <div className="p-4 rounded-2xl bg-slate-800/90 border border-indigo-500/40 text-center space-y-2">
                        <div className="text-2xl">☕ 🤝</div>
                        <h5 className="font-bold text-white text-sm">Session Live at Blue Tokai</h5>
                        <div className="font-mono text-xl font-bold text-amber-400">01:42:15 Elapsed</div>
                        <p className="text-[11px] text-slate-400">Table #04 • Siri Fort Hub • 10% Partner Cafe Discount Applied</p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 to-purple-950 border border-amber-400/40 space-y-3 text-center">
                        <div className="text-xs font-mono font-bold text-amber-400 uppercase">INSTANT UPI PAYOUT DISPATCHED</div>
                        <div className="text-3xl font-black font-mono text-emerald-400">₹1,000.00</div>
                        <p className="text-[11px] text-slate-300">
                          Deposited to your UPI ID • 0% Founder Commission Deducted • +50 Trust Points
                        </p>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Monthly Accumulated: ₹18,500.00
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Bottom Trust Assurance */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>🔒 END-TO-END VERIFIED</span>
                  <span>DELHI NCR ONLY</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* LIVE COMPANION DIRECTORY / HIRING SIMULATOR (REAL MARKETPLACE) */}
        {/* ============================================================ */}
        <div id="companion-directory" className="space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 font-mono text-[10px] font-bold uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5" />
                <span>EXPLORE COMPANIONS AVAILABLE FOR HIRE IN DELHI NCR</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black font-display tracking-tight">
                Hire a Verified Hangout Partner
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-xl font-light">
                Every partner below has passed 100% biometric liveness and ID verification. Tap <strong>"Hire for Hangout"</strong> to book a session.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Vibes", icon: "✨" },
                { id: "coffee", label: "Coffee", icon: "☕" },
                { id: "sports", label: "Sports", icon: "🏸" },
                { id: "tech", label: "Tech / Startups", icon: "💡" },
                { id: "photo", label: "Photo / Art", icon: "📸" },
                { id: "chess", label: "Chess", icon: "♟️" },
                { id: "music", label: "Music", icon: "🎸" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    audio.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* COMPANION CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanions.map((comp) => (
              <div
                key={comp.id}
                className={`p-6 rounded-[28px] border transition-all duration-300 flex flex-col justify-between text-left relative group hover:-translate-y-1.5 hover:shadow-xl ${
                  themeVibe === 'twilight'
                    ? 'bg-slate-900/90 border-slate-800 hover:border-blue-500/40 hover:shadow-blue-500/5'
                    : 'bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-slate-100'
                }`}
              >
                {/* Top Avatar & Badges */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${comp.color} text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform`}>
                        {comp.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-base text-slate-900 dark:text-white">{comp.name}</h4>
                          <span className="text-xs text-slate-400">({comp.age})</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-blue-500" />
                          <span>{comp.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hourly Rate Badge */}
                    <div className="text-right">
                      <div className="text-base font-black font-mono text-blue-600 dark:text-blue-400">
                        ₹{comp.hourlyRate}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 uppercase">per hour</div>
                    </div>
                  </div>

                  {/* Vibe Tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold border border-blue-200 dark:border-blue-800/60">
                    <span>{comp.vibe}</span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light line-clamp-3">
                    {comp.bio}
                  </p>

                  {/* Hub & Availability Details */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span><strong>Hubs:</strong> {comp.hub}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Slots:</strong> {comp.availability}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {comp.skills.slice(0, 3).map((skill, idx) => (
                      <span 
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating, Hangouts Count & Hire Button */}
                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{comp.rating}</span>
                    <span className="text-slate-400 text-[10px] font-normal">({comp.hangoutsCompleted} hangs)</span>
                  </div>

                  <button
                    onClick={() => {
                      audio.playPageTransition();
                      setSelectedCompanion(comp);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Hire for Hangout</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Become a Partner Callout */}
          <div className={`p-6 sm:p-8 rounded-[28px] border flex flex-col sm:flex-row items-center justify-between gap-6 text-left ${
            themeVibe === 'twilight'
              ? 'bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-slate-900 border-indigo-800/40'
              : 'bg-gradient-to-r from-indigo-50 via-purple-50 to-white border-indigo-200/80'
          }`}>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-black text-indigo-600 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>WANT TO GET HIRED LIKE THESE COMPANIONS?</span>
              </div>
              <h4 className="text-lg sm:text-xl font-black font-display text-slate-900 dark:text-white">
                Earn ₹500–₹800/hr doing what you love in Delhi NCR.
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 font-light max-w-xl">
                Join our first 50 founding partners cohort. Set your own hangout rate, choose your local hubs, and enjoy lifetime 0% commissions.
              </p>
            </div>

            <button
              onClick={() => {
                audio.playPageTransition();
                onApplyAsPartner("Marketplace Callout - Become a Companion Partner");
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-indigo-500/25 transition-all shrink-0 cursor-pointer active:scale-95 hover:scale-105"
            >
              Apply to Get Hired as Partner ↗
            </button>
          </div>

        </div>

        {/* ============================================================ */}
        {/* COMPARISON MATRIX: SEEKER VS PARTNER AT A GLANCE             */}
        {/* ============================================================ */}
        <div className="space-y-6 text-left">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black font-display">
              Seeker vs. Partner at a Glance
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-light">
              Clear breakdown of responsibilities, pricing, safety guarantees, and payouts.
            </p>
          </div>

          <div className={`overflow-x-auto rounded-3xl border ${
            themeVibe === 'twilight' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                  <th className="p-4 sm:p-5 font-bold">Feature / Guarantee</th>
                  <th className="p-4 sm:p-5 font-bold text-blue-600 dark:text-blue-400">🔍 Hangout Seeker (Hire)</th>
                  <th className="p-4 sm:p-5 font-bold text-indigo-600 dark:text-indigo-400">🤝 Hangout Partner (Get Hired)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Primary Goal</td>
                  <td className="p-4 sm:p-5">Find verified companions for sports, coffee, startups, or photowalks</td>
                  <td className="p-4 sm:p-5">Monetize your passions, host activities &amp; earn flexible income</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Cost &amp; Earnings</td>
                  <td className="p-4 sm:p-5">Pay ₹300 - ₹600/hr (1st 3 hangouts FREE during launch)</td>
                  <td className="p-4 sm:p-5">Earn ₹400 - ₹800/hr directly to UPI (0% commission for first 50)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Verification Requirement</td>
                  <td className="p-4 sm:p-5">Biometric Selfie Hash + Phone OTP</td>
                  <td className="p-4 sm:p-5">Biometric Facial Hash + Aadhaar e-KYC ID Check</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Location Rules</td>
                  <td className="p-4 sm:p-5">Strictly public certified hubs (cafes, sports complexes, parks)</td>
                  <td className="p-4 sm:p-5">Host at partnered cafes with reserved seating discounts</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Arrival Verification</td>
                  <td className="p-4 sm:p-5">Match 6-digit Happy Key with partner on arrival</td>
                  <td className="p-4 sm:p-5">Enter Happy Key to start clocked session safely</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold">Escrow &amp; Payouts</td>
                  <td className="p-4 sm:p-5">Payment held in escrow until session completes</td>
                  <td className="p-4 sm:p-5">Instant automatic UPI payout upon session finish</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* SIMULATED HIRE / BOOKING MODAL                               */}
      {/* ============================================================ */}
      <AnimatePresence>
        {selectedCompanion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`max-w-lg w-full p-6 sm:p-8 rounded-[32px] border shadow-2xl relative text-left ${
                themeVibe === 'twilight' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCompanion(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!bookingConfirmed ? (
                <div className="space-y-6">
                  {/* Companion Header */}
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedCompanion.color} text-white flex items-center justify-center text-3xl shadow-md`}>
                      {selectedCompanion.emoji}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-blue-500 font-bold">
                        BOOKING COMPANION HANGOUT
                      </div>
                      <h3 className="text-xl font-black font-display">{selectedCompanion.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{selectedCompanion.vibe}</span>
                        <span>•</span>
                        <span className="font-mono text-emerald-400 font-bold">₹{selectedCompanion.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Options Form */}
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase font-mono text-[10px]">
                        Select Preferred Day
                      </label>
                      <select 
                        value={bookingDate} 
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium outline-none focus:border-blue-500"
                      >
                        <option value="This Saturday">This Saturday</option>
                        <option value="This Sunday">This Sunday</option>
                        <option value="Tomorrow Evening">Tomorrow Evening</option>
                        <option value="Next Weekend">Next Weekend</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase font-mono text-[10px]">
                        Session Slot &amp; Duration
                      </label>
                      <select 
                        value={bookingTime} 
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium outline-none focus:border-blue-500"
                      >
                        <option value="11:00 AM - 1:00 PM (2 hrs)">11:00 AM - 1:00 PM (2 hrs - Recommended)</option>
                        <option value="4:00 PM - 6:00 PM (2 hrs)">4:00 PM - 6:00 PM (2 hrs)</option>
                        <option value="6:00 PM - 7:30 PM (1.5 hrs)">6:00 PM - 7:30 PM (1.5 hrs)</option>
                        <option value="8:00 AM - 10:00 AM (2 hrs - Sports/Walk)">8:00 AM - 10:00 AM (2 hrs - Sports/Walk)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase font-mono text-[10px]">
                        Vetted Meeting Hub
                      </label>
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{selectedCompanion.hub}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase font-mono text-[10px]">
                        Note for Companion
                      </label>
                      <input 
                        type="text" 
                        value={bookingNote}
                        onChange={(e) => setBookingNote(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium outline-none focus:border-blue-500"
                        placeholder="What are you excited to talk about or do?"
                      />
                    </div>
                  </div>

                  {/* Escrow Total Calculation */}
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>2 Hours with {selectedCompanion.name}</span>
                      <span>₹{selectedCompanion.hourlyRate * 2}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>Launch Escrow Guarantee</span>
                      <span className="text-emerald-500 font-bold">100% SECURE</span>
                    </div>
                    <div className="pt-2 border-t border-blue-200 dark:border-blue-800 flex justify-between items-center font-bold text-sm text-slate-900 dark:text-white">
                      <span>Total Escrow Amount:</span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono">₹{selectedCompanion.hourlyRate * 2}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setSelectedCompanion(null)}
                      className="w-1/3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      className="w-2/3 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Confirm &amp; Hold Escrow</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto animate-bounce">
                    ✓
                  </div>
                  <h4 className="text-2xl font-black font-display">Hangout Request Sent!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                    {selectedCompanion.name} has been notified via WhatsApp. You will receive your 6-digit Happy Key verification link shortly!
                  </p>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-600 dark:text-slate-300">
                    Meeting Hub: {selectedCompanion.hub} • {bookingDate}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
