import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, 
  Send, 
  Users, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  Smile, 
  Clock,
  Sparkles,
  Activity,
  ShieldCheck,
  Copy,
  Share2,
  Calendar,
  Compass,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Building2
} from "lucide-react";
import { submitToGoogleSheets, generateWhatsAppLeadUrl } from "../lib/googleSheets";
import GoogleScriptGuideModal from "./GoogleScriptGuideModal";
import { audio } from "../utils/audio";
import confetti from "canvas-confetti";

interface LeadCollectionFormProps {
  initialType?: "partner" | "waitlist" | "early_access";
  onSuccess?: () => void;
  inlineLayout?: boolean;
  defaultInterests?: string;
  defaultJoinAs?: "partner" | "seeker";
}

// Strictly Delhi & Gurgaon Locations
const DELHI_AREAS = [
  "Connaught Place (CP)",
  "Khan Market",
  "Hauz Khas & Deer Park",
  "Sunder Nursery",
  "Siri Fort Complex",
  "Greater Kailash (GK) / South Delhi",
  "Dwarka / West Delhi",
  "North Campus / Civil Lines"
];

const GURGAON_AREAS = [
  "DLF CyberHub",
  "32nd Avenue (Milestone)",
  "Golf Course Road (One Horizon)",
  "Sector 29 Entertainment Hub",
  "Cyber City Rapid Metro",
  "Ambience Mall & Island",
  "DLF Phase 4 / Galleria",
  "Sohna Road / South City"
];

// When Are You Free Actually Time Slots
const FREE_TIME_SLOTS = [
  { id: "weekday_evening", label: "Weekday Evenings", time: "6:00 PM – 9:30 PM", icon: "🌆" },
  { id: "weekend_morning", label: "Weekend Mornings", time: "8:30 AM – 1:00 PM", icon: "☕" },
  { id: "weekend_afternoon", label: "Weekend Afternoons", time: "1:30 PM – 5:30 PM", icon: "🏸" },
  { id: "weekend_night", label: "Weekend Nights", time: "6:00 PM – 10:30 PM", icon: "✨" },
  { id: "flexible", label: "Flexible / Anytime", time: "On-demand coordination", icon: "⚡" }
];

const INTEREST_OPTIONS = [
  "🏸 Sports & Badminton",
  "☕ Specialty Coffee Crawls",
  "🎸 Guitar & Jamming",
  "💡 Startup & Tech Chats",
  "📷 Heritage Photowalks",
  "🍜 Food & Street Tasting",
  "📚 Book Club & Reading",
  "♟ Chess & Strategy",
  "🌇 Sunset Walks & Parks"
];

export default function LeadCollectionForm({ 
  initialType,
  onSuccess,
  inlineLayout = false,
  defaultInterests = "",
  defaultJoinAs = "seeker"
}: LeadCollectionFormProps) {
  
  // 1. Role & Contact Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [joinAs, setJoinAs] = useState<"partner" | "seeker">(defaultJoinAs);

  // 2. Location (Strictly Delhi & Gurgaon)
  const [city, setCity] = useState<"Delhi" | "Gurgaon">("Delhi");
  const [selectedArea, setSelectedArea] = useState<string>("Connaught Place (CP)");
  const [customLocation, setCustomLocation] = useState<string>("");

  // 3. What time are you free actually?
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([
    "Weekend Mornings (8:30 AM – 1:00 PM)",
    "Weekday Evenings (6:00 PM – 9:30 PM)"
  ]);
  const [customFreeTime, setCustomFreeTime] = useState("");

  // 4. Hobbies & Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "☕ Specialty Coffee Crawls"
  ]);
  const [customInterests, setCustomInterests] = useState(defaultInterests);

  // Interactive Form Stage
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Submission UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState("");
  const [copiedRef, setCopiedRef] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Sync external defaultInterests
  useEffect(() => {
    if (defaultInterests) {
      setCustomInterests(defaultInterests);
    }
  }, [defaultInterests]);

  // Sync joinAs when initialType or defaultJoinAs changes
  useEffect(() => {
    if (initialType === "partner" || defaultJoinAs === "partner") {
      setJoinAs("partner");
    } else if (defaultJoinAs === "seeker") {
      setJoinAs("seeker");
    }
  }, [initialType, defaultJoinAs]);

  // Update default selectedArea when toggling Delhi vs Gurgaon
  const handleCityChange = (newCity: "Delhi" | "Gurgaon") => {
    audio.playClick();
    setCity(newCity);
    if (newCity === "Delhi") {
      setSelectedArea("Connaught Place (CP)");
    } else {
      setSelectedArea("DLF CyberHub");
    }
  };

  const toggleTimeSlot = (slotString: string) => {
    audio.playClick();
    setSelectedTimeSlots(prev => 
      prev.includes(slotString)
        ? prev.filter(s => s !== slotString)
        : [...prev, slotString]
    );
  };

  const toggleInterest = (option: string) => {
    audio.playClick();
    setSelectedInterests(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option) 
        : [...prev, option]
    );
  };

  // Step navigation validations
  const validateStep1 = () => {
    if (!name.trim()) {
      setErrorMessage("Please enter your name");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage("Please enter a valid mobile number for ID verification");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateStep2 = () => {
    if (!selectedArea && !customLocation.trim()) {
      setErrorMessage("Please choose your preferred area or enter a neighborhood in " + city);
      return false;
    }
    if (selectedTimeSlots.length === 0 && !customFreeTime.trim()) {
      setErrorMessage("Please select at least one time slot when you are free");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const goToNextStep = () => {
    audio.playClick();
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const goToPrevStep = () => {
    audio.playClick();
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }

    const combinedInterests = [
      ...selectedInterests,
      customInterests.trim()
    ].filter(Boolean).join(", ");

    if (!combinedInterests) {
      setErrorMessage("Please select at least one activity or enter your interests");
      setCurrentStep(3);
      return;
    }

    const finalArea = [
      selectedArea,
      customLocation.trim()
    ].filter(Boolean).join(" · ");

    const finalFreeTime = [
      ...selectedTimeSlots,
      customFreeTime.trim()
    ].filter(Boolean).join(", ");

    setIsSubmitting(true);
    audio.playPageTransition();

    const formTypeLabel = 
      joinAs === "partner" 
        ? "Become a Hangout Partner" 
        : "Waitlist Application";

    const leadPayload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city, // Strictly "Delhi" or "Gurgaon"
      location_area: finalArea,
      free_time: finalFreeTime,
      interests: combinedInterests,
      join_as: joinAs,
      form_type: formTypeLabel
    };

    try {
      // 1. Store to local storage
      const existingBackupStr = localStorage.getItem("happy_hangouts_leads") || "[]";
      let existingBackup = [];
      try {
        existingBackup = JSON.parse(existingBackupStr);
      } catch (err) {
        existingBackup = [];
      }
      existingBackup.push({ ...leadPayload, timestamp: new Date().toISOString() });
      localStorage.setItem("happy_hangouts_leads", JSON.stringify(existingBackup));

      // 2. Submit to backend / Google Sheets
      await submitToGoogleSheets(leadPayload);

      // Generate unique referral link
      const cleanSlug = (name.trim() || "MEMBER").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const origin = typeof window !== "undefined" ? window.location.origin : "https://happyhangouts.com";
      setReferralLink(`${origin}?ref=HH-${cleanSlug}-${randomCode}`);

      setIsSuccess(true);
      audio.playConnect();
      
      // Multi-stage celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#3b82f6", "#10b981", "#6366f1", "#f59e0b"]
      });

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 3200);
      }

    } catch (error) {
      console.error("Error submitting lead:", error);
      setErrorMessage("Something went wrong while submitting. Please try again or WhatsApp directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeAreas = city === "Delhi" ? DELHI_AREAS : GURGAON_AREAS;
  const isSeeker = joinAs === "seeker";

  // -------------------------------------------------------------------------
  // SUCCESS SCREEN: Unique Membership Pass with Instant WhatsApp Fast-Track
  // -------------------------------------------------------------------------
  if (isSuccess) {
    const finalArea = [selectedArea, customLocation.trim()].filter(Boolean).join(" · ");
    const finalFreeTime = [...selectedTimeSlots, customFreeTime.trim()].filter(Boolean).join(", ");
    const whatsAppUrl = generateWhatsAppLeadUrl({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city,
      location_area: finalArea,
      free_time: finalFreeTime,
      interests: [...selectedInterests, customInterests.trim()].filter(Boolean).join(", "),
      join_as: joinAs,
      form_type: joinAs === "partner" ? "Become a Hangout Partner" : "Waitlist Application"
    });

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className={`p-6 sm:p-10 text-center rounded-3xl ${
          inlineLayout ? "bg-white border-2 border-slate-300 shadow-xl" : "bg-transparent"
        } flex flex-col items-center justify-center space-y-6 text-left relative overflow-hidden`}
      >
        {/* Animated Check Emblem */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
          <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
        </div>

        {/* Headline */}
        <div className="space-y-2 text-center max-w-md">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Application Confirmed · {city.toUpperCase()}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            You&apos;re On the {city} Priority List!
          </h3>

          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
            Thank you, <strong className="text-slate-950">{name}</strong>. Your {joinAs === "partner" ? "Host Partner" : "Seeker"} request for <strong className="text-slate-950">{city} ({selectedArea})</strong> has been securely logged.
          </p>
        </div>

        {/* Unique Verified Member Card Pass */}
        <div className="w-full max-w-md bg-slate-950 text-white p-5 sm:p-6 rounded-2xl border-2 border-slate-800 shadow-2xl space-y-3.5 relative overflow-hidden text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE APPLICATION PASS</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-300 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              {city.toUpperCase()} CLUSTER
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left text-xs">
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Member</span>
              <p className="font-extrabold text-slate-100 truncate">{name}</p>
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Role</span>
              <p className="font-extrabold text-cyan-300">{joinAs === "partner" ? "🤝 Host Partner" : "⚡ Hangout Seeker"}</p>
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Target Hub / Area</span>
              <p className="font-bold text-slate-200 truncate">{selectedArea}</p>
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">Preferred Time</span>
              <p className="font-bold text-emerald-300 truncate">{selectedTimeSlots[0] || "Flexible"}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>Security: 100% ID Verified Public Meetups</span>
            <span className="font-mono text-slate-300">ID: HH-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
        </div>

        {/* WhatsApp Fast-Track Button */}
        <div className="w-full max-w-md space-y-3">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => audio.playClick()}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <span>💬 Fast-Track on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Referral link box */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-300 text-left">
            <input
              type="text"
              readOnly
              value={referralLink || `${typeof window !== "undefined" ? window.location.origin : "https://happyhangouts.com"}?ref=HH-VIP`}
              className="text-[11px] font-mono text-slate-800 bg-transparent flex-1 px-2 py-1 outline-none truncate font-bold select-all"
            />
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                navigator.clipboard.writeText(referralLink || "https://happyhangouts.com");
                setCopiedRef(true);
                setTimeout(() => setCopiedRef(false), 2000);
              }}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer"
            >
              {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRef ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        <button 
          onClick={() => {
            audio.playClick();
            setIsSuccess(false);
            setCurrentStep(1);
          }}
          className="text-xs font-bold text-slate-700 hover:text-slate-950 underline transition-colors cursor-pointer"
        >
          Submit another application
        </button>
      </motion.div>
    );
  }

  // -------------------------------------------------------------------------
  // INTERACTIVE 3-STEP FORM EXPERIENCE
  // -------------------------------------------------------------------------
  return (
    <div className={`w-full transition-all duration-300 relative text-left ${
      inlineLayout 
        ? "bg-white border-2 border-slate-300 p-5 sm:p-8 rounded-3xl shadow-xl" 
        : "bg-transparent text-left"
    }`}>
      
      {/* Header Info */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-wider font-mono font-black px-3 py-1 rounded-md inline-flex items-center gap-1.5 text-blue-900 bg-blue-100 border border-blue-200">
            <Sparkles className="w-3 h-3 text-blue-700" />
            <span>DELHI &amp; GURGAON EXCLUSIVE ACCESS</span>
          </span>

          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Currently live in Delhi &amp; Gurgaon only</span>
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
          Join Happy Hangouts in <span className="text-blue-600">{city}</span>
        </h3>
        
        <p className="text-slate-700 text-xs sm:text-sm font-normal leading-relaxed">
          Skip awkward apps. Meet verified local companions by the hour at vetted public cafes, sports complexes, and cultural walks across Delhi and Gurgaon.
        </p>

        {/* Tactile 3-Step Progress Indicator */}
        <div className="pt-2">
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, label: "Role & Contact", icon: User },
              { num: 2, label: "Location & Time", icon: Clock },
              { num: 3, label: "Interests & Finish", icon: Smile }
            ].map(step => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isDone = currentStep > step.num;

              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    if (step.num === 1) setCurrentStep(1);
                    if (step.num === 2 && validateStep1()) setCurrentStep(2);
                    if (step.num === 3 && validateStep1() && validateStep2()) setCurrentStep(3);
                  }}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5 cursor-pointer text-left ${
                    isActive 
                      ? "border-blue-600 bg-blue-50 text-blue-950 shadow-xs" 
                      : isDone
                        ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : isDone 
                        ? "bg-emerald-600 text-white" 
                        : "bg-slate-200 text-slate-700"
                  }`}>
                    {isDone ? <Check className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] sm:text-xs font-black truncate">
                      {step.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse shrink-0" />
          <p className="font-bold">{errorMessage}</p>
        </div>
      )}

      {/* Actual Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ============================================================ */}
        {/* STEP 1: WHO YOU ARE & YOUR ROLE                              */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            {/* Join As: Tactile Card Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase font-black text-slate-800 tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Choose How You Want to Join</span>
                <span className="text-blue-600">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Seeker Card */}
                <div
                  onClick={() => { audio.playClick(); setJoinAs("seeker"); }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    joinAs === "seeker"
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    joinAs === "seeker" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-400 bg-white"
                  }`}>
                    {joinAs === "seeker" && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <h5 className="font-black text-sm text-slate-950">
                      ⚡ Hangout Seeker
                    </h5>
                    <p className="text-xs text-slate-700 font-normal mt-0.5 leading-snug">
                      Book verified companions in Delhi/Gurgaon for badminton, coffee, or hobbies.
                    </p>
                  </div>
                </div>

                {/* Host Partner Card */}
                <div
                  onClick={() => { audio.playClick(); setJoinAs("partner"); }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    joinAs === "partner"
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    joinAs === "partner" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-400 bg-white"
                  }`}>
                    {joinAs === "partner" && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <h5 className="font-black text-sm text-slate-950">
                      🤝 Host Partner
                    </h5>
                    <p className="text-xs text-slate-700 font-normal mt-0.5 leading-snug">
                      Host activities in public hubs, earn ₹400–₹1,500/hr for your company &amp; skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase font-black text-slate-800 tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span>Full Name</span>
                  <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Malhotra"
                  value={name}
                  onChange={(e) => { audio.playType(); setName(e.target.value); }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase font-black text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Mobile (WhatsApp)</span>
                  <span className="text-blue-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98112 34567"
                  value={phone}
                  onChange={(e) => { audio.playType(); setPhone(e.target.value); }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase font-black text-slate-800 tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-600" />
                <span>Email Address</span>
                <span className="text-blue-600">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. aryan@example.com"
                value={email}
                onChange={(e) => { audio.playType(); setEmail(e.target.value); }}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={goToNextStep}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 ml-auto"
              >
                <span>Continue: Location &amp; Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: YOUR LOCATION (DELHI / GURGAON) & FREE TIME SLOTS    */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            {/* Primary City Toggle: Strictly Gurgaon & Delhi */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase font-black text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Choose Your City</span>
                  <span className="text-blue-600">*</span>
                </label>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Focused in Delhi &amp; Gurgaon
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Delhi Button */}
                <button
                  type="button"
                  onClick={() => handleCityChange("Delhi")}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    city === "Delhi"
                      ? "border-blue-600 bg-blue-50 text-blue-950 font-black shadow-xs ring-1 ring-blue-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-bold"
                  }`}
                >
                  <span className="text-lg">🏛️</span>
                  <div className="text-left">
                    <span className="block text-sm leading-tight">Delhi</span>
                    <span className="text-[10px] text-slate-600 font-mono font-medium block">
                      CP, Khan Mkt, South Delhi
                    </span>
                  </div>
                </button>

                {/* Gurgaon Button */}
                <button
                  type="button"
                  onClick={() => handleCityChange("Gurgaon")}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    city === "Gurgaon"
                      ? "border-blue-600 bg-blue-50 text-blue-950 font-black shadow-xs ring-1 ring-blue-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-bold"
                  }`}
                >
                  <span className="text-lg">🌆</span>
                  <div className="text-left">
                    <span className="block text-sm leading-tight">Gurgaon</span>
                    <span className="text-[10px] text-slate-600 font-mono font-medium block">
                      CyberHub, Golf Course, Sec 29
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Popular Hubs in Selected City */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase font-black text-slate-800 tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Select Your Preferred {city} Area / Hub</span>
                <span className="text-blue-600">*</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {activeAreas.map(area => {
                  const isSelected = selectedArea === area;
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => {
                        audio.playClick();
                        setSelectedArea(area);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? "bg-slate-950 text-white border-slate-950 shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                      }`}
                    >
                      {isSelected ? "📍 " : ""}{area}
                    </button>
                  );
                })}
              </div>

              {/* Specific local neighborhood input */}
              <div className="pt-1.5">
                <input
                  type="text"
                  placeholder={`Optional: Nearest landmark or metro in ${city} (e.g. Near Rajiv Chowk, Sector 54 Metro, Galleria)`}
                  value={customLocation}
                  onChange={(e) => { audio.playType(); setCustomLocation(e.target.value); }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* What Time Do You Free Actually? */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase font-black text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>What Time Are You Free Actually?</span>
                  <span className="text-blue-600">*</span>
                </label>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Select all that apply
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FREE_TIME_SLOTS.map(slot => {
                  const slotString = `${slot.label} (${slot.time})`;
                  const isChecked = selectedTimeSlots.includes(slotString);

                  return (
                    <div
                      key={slot.id}
                      onClick={() => toggleTimeSlot(slotString)}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                        isChecked
                          ? "border-blue-600 bg-blue-50 text-slate-950 shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                        isChecked ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-base shrink-0">{slot.icon}</span>
                      <div className="min-w-0">
                        <span className="block text-xs font-black text-slate-950 truncate">
                          {slot.label}
                        </span>
                        <span className="block text-[10px] text-slate-600 font-mono">
                          {slot.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom time note */}
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Specific schedule note (e.g. Free Friday evenings post 6 PM and Sunday mornings)"
                  value={customFreeTime}
                  onChange={(e) => { audio.playType(); setCustomFreeTime(e.target.value); }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={goToPrevStep}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goToNextStep}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Continue: Vibe &amp; Interests</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: HOBBIES & FINAL LIVE APPLICATION PASS REVIEW         */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            {/* Interests Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase font-black text-slate-800 tracking-wider flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Your Activities &amp; Vibe</span>
                  <span className="text-blue-600">*</span>
                </label>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Pick at least 1
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map(option => {
                  const isSelected = selectedInterests.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleInterest(option)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom note */}
              <div className="pt-1">
                <textarea
                  rows={2}
                  placeholder="Optional: Other interests (e.g. Filter coffee at Colocal, pickleball, startup tech discussions...)"
                  value={customInterests}
                  onChange={(e) => { audio.playType(); setCustomInterests(e.target.value); }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* LIVE PREVIEW PASS (Unique, Engaging Visual) */}
            <div className="p-4 rounded-2xl bg-slate-950 text-white border-2 border-slate-800 shadow-xl space-y-2.5 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>READY TO SUBMIT</span>
                </span>
                <span className="text-[9px] font-mono text-cyan-300 font-bold bg-blue-900/50 px-2 py-0.5 rounded">
                  {city.toUpperCase()} · {selectedArea}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider block">Applicant</span>
                  <p className="font-extrabold text-slate-100 truncate">{name || "Your Name"}</p>
                </div>
                <div>
                  <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider block">Role</span>
                  <p className="font-extrabold text-cyan-300">{joinAs === "partner" ? "🤝 Host Partner" : "⚡ Seeker"}</p>
                </div>
                <div>
                  <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider block">When Free</span>
                  <p className="font-bold text-emerald-300 truncate">{selectedTimeSlots[0] || "Flexible"}</p>
                </div>
              </div>
            </div>

            {/* Submit & Back Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goToPrevStep}
                disabled={isSubmitting}
                className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit {city} Membership Application</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% ID Verified &middot; Safe Public Cafes Only &middot; Delhi &amp; Gurgaon</span>
            </div>

          </motion.div>
        )}

      </form>

      <GoogleScriptGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

    </div>
  );
}
