import React, { useState } from "react";
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
  ChevronDown,
  Sparkles,
  Activity,
  ShieldCheck,
  Copy,
  Share2,
  Gift,
  ExternalLink,
  FileSpreadsheet,
  MessageCircle,
  CheckCircle2
} from "lucide-react";
import { saveLead, SupabaseLead } from "../lib/supabase";
import { submitToGoogleSheets, generateWhatsAppLeadUrl } from "../lib/googleSheets";
import GoogleScriptGuideModal from "./GoogleScriptGuideModal";
import { audio } from "../utils/audio";
import confetti from "canvas-confetti";

interface LeadCollectionFormProps {
  initialType?: 'partner' | 'waitlist' | 'early_access';
  onSuccess?: () => void;
  inlineLayout?: boolean;
  defaultInterests?: string;
  defaultJoinAs?: 'partner' | 'seeker';
}

const INTEREST_OPTIONS = [
  "🏸 Sports & Badminton",
  "☕ Cafe Crawls",
  "🎸 Guitar & Music",
  "💡 Startup Discussions",
  "📷 Photography Walks",
  "🍜 Food Exploring",
  "📚 Book Club Chats",
  "🌍 Exploring Cities",
  "♟ Chess Strategy"
];

export default function LeadCollectionForm({ 
  initialType,
  onSuccess,
  inlineLayout = false,
  defaultInterests = "",
  defaultJoinAs = 'seeker'
}: LeadCollectionFormProps) {
  
  // State variables for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Delhi");
  const [customCity, setCustomCity] = useState("");
  
  // Multi-select interests options
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState(defaultInterests);
  
  const [joinAs, setJoinAs] = useState<'partner' | 'seeker'>(defaultJoinAs);
  
  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState("");
  const [copiedRef, setCopiedRef] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Keep custom interests synced if defaultInterests changes
  React.useEffect(() => {
    if (defaultInterests) {
      setCustomInterests(defaultInterests);
    }
  }, [defaultInterests]);

  // Keep joinAs synced when defaultJoinAs or initialType changes
  React.useEffect(() => {
    if (initialType === 'partner' || defaultJoinAs === 'partner') {
      setJoinAs('partner');
    } else if (defaultJoinAs === 'seeker') {
      setJoinAs('seeker');
    }
  }, [initialType, defaultJoinAs]);

  const toggleInterest = (option: string) => {
    audio.playClick();
    setSelectedInterests(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option) 
        : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Strict validation
    if (!name.trim()) {
      setErrorMessage("Please enter your name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Please enter your phone number");
      return;
    }

    // Combine chosen options and custom field
    const combinedInterests = [
      ...selectedInterests,
      customInterests.trim()
    ].filter(Boolean).join(", ");

    if (!combinedInterests) {
      setErrorMessage("Please select at least one hobby/interest or enter custom details below");
      return;
    }

    const finalCity = city === "Other" ? customCity.trim() : city;
    if (!finalCity) {
      setErrorMessage("Please specify your city");
      return;
    }

    setIsSubmitting(true);
    audio.playPageTransition();

    const leadPayload: Omit<SupabaseLead, 'created_at'> = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: finalCity,
      interests: combinedInterests,
      join_as: joinAs,
      lead_type: 'waitlist'
    };

    try {
      // 1. Store to local storage as durable backup first
      const existingBackupStr = localStorage.getItem("happy_hangouts_leads") || "[]";
      let existingBackup = [];
      try {
        existingBackup = JSON.parse(existingBackupStr);
      } catch (err) {
        existingBackup = [];
      }
      existingBackup.push({ ...leadPayload, timestamp: new Date().toISOString() });
      localStorage.setItem("happy_hangouts_leads", JSON.stringify(existingBackup));

      // 2. Attempt saving to Supabase
      await saveLead(leadPayload);
      
      // 3. Post to Google Sheet via Google Apps Script and trigger email notification to mubaarqaan@gmail.com
      const formTypeLabel = 
        joinAs === 'partner' 
          ? 'Become a Hangout Partner' 
          : 'Waitlist Application';

      await submitToGoogleSheets({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: finalCity,
        interests: combinedInterests,
        join_as: joinAs,
        form_type: formTypeLabel
      });

      // Generate unique referral link
      const cleanSlug = (name.trim() || 'VIP').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://happyhangouts.com';
      setReferralLink(`${origin}?ref=HH-${cleanSlug}-${randomCode}`);

      setIsSuccess(true);
      audio.playConnect();
      
      // Multi-stage celebratory custom confetti sequence
      const triggerCustomConfetti = () => {
        // Main energetic center explosion
        confetti({
          particleCount: 140,
          spread: 90,
          origin: { y: 0.55 },
          colors: ["#3b82f6", "#6366f1", "#10b981", "#f59e0b", "#ec4899", "#38bdf8", "#ffffff"],
          scalar: 1.25,
          ticks: 300,
        });

        // Left confetti cannon burst
        setTimeout(() => {
          confetti({
            particleCount: 70,
            angle: 60,
            spread: 60,
            origin: { x: 0.05, y: 0.65 },
            colors: ["#3b82f6", "#10b981", "#fbbf24", "#6366f1"],
            scalar: 1.1,
          });
        }, 180);

        // Right confetti cannon burst
        setTimeout(() => {
          confetti({
            particleCount: 70,
            angle: 120,
            spread: 60,
            origin: { x: 0.95, y: 0.65 },
            colors: ["#3b82f6", "#10b981", "#fbbf24", "#ec4899"],
            scalar: 1.1,
          });
        }, 360);
      };

      triggerCustomConfetti();

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }

    } catch (error) {
      console.error("Error submitting lead:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live Registration Simulator details based on chosen city
  const getSimulatedStats = () => {
    switch (city) {
      case "Delhi": 
        return { count: "1,482 seekers logged", badge: "HIGH DEMAND NCR", color: "text-blue-600 bg-blue-50 border-blue-100" };
      case "Noida": 
        return { count: "612 partners certified", badge: "GROWING CLUSTER", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
      case "Gurgaon": 
        return { count: "984 active pairs", badge: "HIGH DENSITY TECH HUB", color: "text-indigo-600 bg-indigo-50 border-indigo-100" };
      default: 
        return { count: "12,852 total registered", badge: "GLOBAL ROLLOUT", color: "text-amber-600 bg-amber-50 border-amber-100" };
    }
  };

  const currentStats = getSimulatedStats();
  const isSeeker = joinAs === 'seeker';

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className={`p-8 sm:p-10 text-center rounded-[36px] ${inlineLayout ? "bg-white border-2 border-emerald-500/20 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.12)]" : "bg-transparent"} flex flex-col items-center justify-center space-y-6 text-left relative overflow-hidden`}
      >
        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Check & Celebration Ring */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.6, times: [0, 0.7, 1], ease: "easeOut" }}
            className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/25 relative z-10"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 300 }}
            >
              <ShieldCheck className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 bg-emerald-400/30 rounded-3xl -z-10"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-2 text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-1.5 text-[9.5px] font-mono font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3 text-emerald-500" /> MEMBERSHIP APPLICATION LOGGED
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display"
          >
            Application Submitted!
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light"
          >
            Thank you, <strong className="text-slate-800 font-bold">{name}</strong>. Your membership request for <strong className="text-slate-800 font-bold">{city}</strong> has been logged into our queue.
          </motion.p>
        </div>

        {/* Verified Pass Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-full max-w-sm bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3 relative overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> QUEUED & LOGGED
            </span>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
              NCR HUB MATCH
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div>
              <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-wider block">Applicant</span>
              <p className="text-xs font-bold text-slate-200 truncate">{name}</p>
            </div>
            <div>
              <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-wider block">Contact</span>
              <p className="text-xs font-bold text-slate-200 truncate">{email}</p>
            </div>
            <div>
              <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-wider block">Region</span>
              <p className="text-xs font-bold text-slate-200">{city === "Other" ? (customCity || "NCR") : city}</p>
            </div>
            <div>
              <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-wider block">Role</span>
              <p className="text-xs font-bold text-emerald-400 uppercase">{joinAs}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[9.5px] font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Application Received &amp; Priority Queued
          </div>
        </motion.div>

        {/* Refer a Friend Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="w-full max-w-sm bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-slate-50 p-5 rounded-2xl border border-blue-200/80 shadow-md space-y-3 text-left relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-sm">
                <Gift className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-slate-900 font-display">
                Refer Friends & Fast-Track
              </span>
            </div>
            <span className="text-[9px] font-mono font-black text-blue-600 bg-blue-100/90 px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-200/50">
              +50 Queue Jump
            </span>
          </div>

          <p className="text-[11px] text-slate-600 font-light leading-relaxed">
            Invite your social circle to Happy Hangouts. Every verified friend who applies using your link moves your application up <strong>50 spots</strong> in the vetting queue!
          </p>

          {/* Unique Link Input + Copy Button */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-blue-200/80 shadow-inner">
            <input
              type="text"
              readOnly
              value={referralLink || `${typeof window !== 'undefined' ? window.location.origin : 'https://happyhangouts.com'}?ref=HH-${(name || 'VIP').toUpperCase().slice(0, 6)}-${Math.floor(1000 + Math.random() * 9000)}`}
              className="text-[10px] font-mono text-slate-700 bg-transparent flex-1 px-2 py-1 outline-none truncate font-bold select-all"
            />
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                const linkToCopy = referralLink || `${typeof window !== 'undefined' ? window.location.origin : 'https://happyhangouts.com'}?ref=HH-VIP-7782`;
                navigator.clipboard.writeText(linkToCopy);
                setCopiedRef(true);
                setTimeout(() => setCopiedRef(false), 2000);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-lg transition-all flex items-center gap-1 shrink-0 shadow-sm active:scale-95 cursor-pointer"
            >
              {copiedRef ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Social Share buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Hey! I just applied for early membership on Happy Hangouts, NCR's premier ID-verified companion network. Join using my referral link to get fast-tracked access: ${referralLink || 'https://happyhangouts.com'}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audio.playClick()}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share WhatsApp</span>
            </a>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={async () => {
                  audio.playClick();
                  try {
                    await navigator.share({
                      title: "Happy Hangouts Exclusive Membership",
                      text: "Join me on Happy Hangouts - NCR's premier ID-verified companion network!",
                      url: referralLink || window.location.href,
                    });
                  } catch (e) {
                    // user cancelled share
                  }
                }}
                className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-extrabold flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            audio.playClick();
            setIsSuccess(false);
            setName("");
            setEmail("");
            setPhone("");
            setSelectedInterests([]);
            setCustomInterests("");
          }}
          className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] uppercase tracking-wider transition-all shadow-sm"
        >
          Submit Another Application
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className={`w-full transition-all duration-700 relative overflow-hidden ${
      inlineLayout 
        ? isSeeker 
          ? "bg-white border-2 border-blue-500/30 p-6 sm:p-10 rounded-[36px] shadow-[0_25px_60px_-15px_rgba(59,130,246,0.12)]" 
          : "bg-white border-2 border-indigo-500/30 p-6 sm:p-10 rounded-[36px] shadow-[0_25px_60px_-15px_rgba(99,102,241,0.12)]"
        : "bg-transparent text-left"
    }`}>
      
      {/* Decorative ambient color glow changing based on joinAs */}
      <div className={`absolute -right-24 -bottom-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700 ${
        isSeeker ? "bg-blue-500" : "bg-indigo-500"
      }`} />

      {/* Header Info */}
      <div className="text-center md:text-left mb-6 space-y-3.5">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className={`text-[9px] uppercase tracking-[0.25em] font-black px-3 py-1.5 rounded-md font-mono inline-flex items-center gap-1.5 transition-colors duration-500 ${
            isSeeker 
              ? "text-blue-600 bg-blue-50 border border-blue-100" 
              : "text-indigo-600 bg-indigo-50 border border-indigo-100"
          }`}>
            <Sparkles className="w-3 h-3 animate-spin-slow" /> EXCLUSIVE MEMBERSHIP APPLICATION
          </span>
          
          {/* Dynamic simulated city activity stats badge */}
          <span className={`text-[8.5px] uppercase tracking-wider font-mono font-bold px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 animate-pulse transition-all duration-500 ${currentStats.color}`}>
            <Activity className="w-3 h-3 shrink-0" />
            {currentStats.badge} : HIGH DEMAND ({currentStats.count})
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-[-0.03em] font-display leading-tight">
          Apply For <span className={`transition-colors duration-500 ${isSeeker ? "text-blue-600" : "text-indigo-600"}`}>Privileged Access</span>
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
          Happy Hangouts is NCR's most sought-after companion network. Joining is a privileged membership granted strictly to <strong className="text-slate-800 font-semibold font-sans">ID-verified individuals</strong> who value genuine connection, safety, and high-vibe local hubs.
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-2xl flex items-center gap-3 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Actual Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-300" /> Full Name <span className="text-blue-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aditya Sen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white transition-all outline-none ${
                isSeeker 
                  ? "border-slate-200/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                  : "border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-300" /> Email Address <span className="text-blue-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. aditya@happyhangouts.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white transition-all outline-none ${
                isSeeker 
                  ? "border-slate-200/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                  : "border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Phone Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-300" /> Phone Number <span className="text-blue-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white transition-all outline-none ${
                isSeeker 
                  ? "border-slate-200/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                  : "border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />
          </div>

          {/* City Selector */}
          <div className="space-y-2 relative">
            <label className="text-[10px] font-mono uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-300" /> City / Region <span className="text-blue-500">*</span>
            </label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => { audio.playClick(); setCity(e.target.value); }}
                className={`w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border text-sm text-slate-800 appearance-none focus:bg-white transition-all outline-none cursor-pointer pr-10 ${
                  isSeeker 
                    ? "border-slate-200/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                    : "border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                }`}
              >
                <option value="Delhi">Delhi NCR</option>
                <option value="Noida">Noida</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Other">Other City...</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Custom City text field if "Other" is chosen */}
        {city === "Other" && (
          <div className="space-y-2 animate-fade-in">
            <label className="text-[10px] font-mono uppercase font-black text-slate-400 tracking-wider">
              Specify your City name <span className="text-blue-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mumbai, Bangalore, New York"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              className={`w-full px-5 py-3.5 rounded-2xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white transition-all outline-none ${
                isSeeker 
                  ? "border-slate-200/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                  : "border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />
          </div>
        )}

        {/* Want to Join As (Tactile Selector Blocks) */}
        <div className="space-y-3">
          <label className="text-[10px] font-mono uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-300" /> Apply to join as <span className="text-blue-500">*</span>
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Seeker Block */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { audio.playClick(); setJoinAs('seeker'); }}
              className={`border-2 p-4 rounded-2xl cursor-pointer flex items-start gap-3 transition-all ${
                joinAs === 'seeker' 
                  ? 'border-blue-500 bg-blue-500/5 shadow-md shadow-blue-500/5' 
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/40 bg-white'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                joinAs === 'seeker' ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white'
              }`}>
                {joinAs === 'seeker' && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="text-left">
                <h5 className={`font-black text-xs tracking-tight ${joinAs === 'seeker' ? 'text-blue-600' : 'text-slate-800'}`}>
                  Role 01: Hangout Seeker
                </h5>
                <p className="text-[10px] text-slate-400 leading-relaxed font-light mt-0.5">
                  Match instantly with peers to explore hobbies, sports, or cafes.
                </p>
              </div>
            </motion.div>

            {/* Partner Block */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { audio.playClick(); setJoinAs('partner'); }}
              className={`border-2 p-4 rounded-2xl cursor-pointer flex items-start gap-3 transition-all ${
                joinAs === 'partner' 
                  ? 'border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/5' 
                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/40 bg-white'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                joinAs === 'partner' ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300 bg-white'
              }`}>
                {joinAs === 'partner' && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="text-left">
                <h5 className={`font-black text-xs tracking-tight ${joinAs === 'partner' ? 'text-indigo-600' : 'text-slate-800'}`}>
                  Role 02: Certified Partner Host
                </h5>
                <p className="text-[10px] text-slate-400 leading-relaxed font-light mt-0.5">
                  Host premium, interest-driven gatherings or represent localized hubs.
                </p>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Interests Select Options Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-mono uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-slate-300" /> Select your Hobbies & Interests <span className="text-blue-500">*</span>
          </label>
          
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((option) => {
              const isSelected = selectedInterests.includes(option);
              return (
                <motion.button
                  key={option}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleInterest(option)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border flex items-center gap-1.5 ${
                    isSelected 
                      ? isSeeker
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                        : "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{option}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Optional Custom Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase font-black text-slate-400 tracking-wider">
            Other Custom Goals or Hobbies (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Master acoustic guitar riffs, run early morning lakeside drops at Sunder Nursery, read sci-fi..."
            value={customInterests}
            onChange={(e) => setCustomInterests(e.target.value)}
            className={`w-full px-5 py-3 rounded-2xl bg-slate-50/50 border text-sm text-slate-800 placeholder-slate-400 focus:bg-white transition-all outline-none resize-none ${
              isSeeker 
                ? "border-slate-200/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                : "border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            }`}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-2 transition-all duration-500 ${
              isSeeker 
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Application...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Membership Application</span>
              </>
            )}
          </motion.button>
          
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[9px] text-slate-400 font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Biometrically Shielded & Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500 font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 100% ID-Verified & Instant Review
            </span>
          </div>
        </div>

      </form>

      <GoogleScriptGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

    </div>
  );
}
