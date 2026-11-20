import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Lock,
  Phone,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { User } from "firebase/auth";
import {
  ActivityCategoryId,
  GovtIdType,
  ProfileFormSubmission,
  UserGender,
  UserRole,
  useAuth,
} from "../contexts/AuthContext";
import { audio } from "../utils/audio";
import type { CompanionProfile } from "../App";

interface AuthBookingGateModalProps {
  isOpen: boolean;
  pendingExperience: CompanionProfile | null;
  initialMode?: "signup" | "signin";
  defaultRole?: UserRole;
  onClose: () => void;
  onAuthenticatedReady: () => void;
}

const ACTIVITIES_LIST: { id: ActivityCategoryId; label: string; slot: string }[] = [
  { id: "running", label: "Running buddy", slot: "Weekday mornings" },
  { id: "rackets", label: "Pickleball or badminton", slot: "Weekday evenings" },
  { id: "hike", label: "Weekend hike", slot: "Saturday morning" },
  { id: "games_cafe", label: "Chess or board games at a café", slot: "Saturday evening" },
  { id: "photowalk", label: "Photo walk", slot: "Sunday morning" },
];

const HUB_CHOICES: Record<"Gurugram" | "Delhi", string[]> = {
  Gurugram: [
    "Sector 29 Courts",
    "Tau Devi Lal Park",
    "Aravalli Ridge Trail",
    "32nd Avenue Cafés",
    "DLF CyberHub",
  ],
  Delhi: [
    "Lodhi Garden Track",
    "Siri Fort Complex",
    "Sanjay Van Trail",
    "Khan Market Cafés",
    "Sunder Nursery Park",
  ],
};

export default function AuthBookingGateModal({
  isOpen,
  pendingExperience,
  initialMode = "signup",
  defaultRole = "seeker",
  onClose,
  onAuthenticatedReady,
}: AuthBookingGateModalProps) {
  const { firebaseUser, userProfile, signInWithGoogle, saveProfileAfterAuth } = useAuth();

  const [tab, setTab] = useState<"signup" | "signin">(initialMode);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<UserGender>("female");
  const [city, setCity] = useState<"Gurugram" | "Delhi">("Gurugram");
  const [preferredHub, setPreferredHub] = useState("Sector 29 Courts");
  const [govtIdType, setGovtIdType] = useState<GovtIdType>("Aadhaar");
  const [govtIdLast4, setGovtIdLast4] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [interests, setInterests] = useState<string[]>([
    "Running buddy",
    "Pickleball or badminton",
  ]);

  // Extra Hangout Partner KYC/Onboarding fields
  const [partnerCategory, setPartnerCategory] = useState<ActivityCategoryId>("rackets");
  const [partnerExpTitle, setPartnerExpTitle] = useState("After-Work Doubles Badminton Smash");
  const [partnerBio, setPartnerBio] = useState("");
  const [partnerUpi, setPartnerUpi] = useState("");
  const [partnerSlots, setPartnerSlots] = useState<string[]>([
    "Weekday evenings",
    "Saturday morning",
  ]);

  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTab(initialMode);
      setRole(defaultRole);
      setErrorMsg(null);
      setStatusMsg(null);
    }
  }, [isOpen, initialMode, defaultRole]);

  // Pre-fill Google account info if user signed in via Google but hasn't finished submitting profile yet
  useEffect(() => {
    if (firebaseUser) {
      if (!name && firebaseUser.displayName) setName(firebaseUser.displayName);
      if (firebaseUser.email) setEmail(firebaseUser.email);
    }
    if (userProfile) {
      setRole(userProfile.role);
      setName(userProfile.name);
      setEmail(userProfile.email);
      setPhone(userProfile.phone);
      setGender(userProfile.gender);
      setCity(userProfile.city);
      setPreferredHub(userProfile.preferredHub);
      setGovtIdType(userProfile.govtIdType);
      setGovtIdLast4(userProfile.govtIdLast4);
      setEmergencyContact(userProfile.emergencyContact);
      setInterests(userProfile.interests);
      if (userProfile.upiId) setPartnerUpi(userProfile.upiId);
      if (userProfile.bio) setPartnerBio(userProfile.bio);
    }
  }, [firebaseUser, userProfile]);

  if (!isOpen) return null;

  const toggleInterest = (label: string) => {
    audio.playClick();
    setInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label].slice(0, 5)
    );
  };

  const togglePartnerSlot = (slot: string) => {
    audio.playClick();
    setPartnerSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot].slice(0, 5)
    );
  };

  const handleGoogleQuickSignIn = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    setBusy(true);
    audio.playClick();
    try {
      const { user, hasProfile } = await signInWithGoogle();
      if (hasProfile) {
        audio.playSuccess();
        setStatusMsg("Signed in! Opening your selected experience...");
        onAuthenticatedReady();
      } else {
        // Brand-new Google user: collect their mandatory booking details cleanly
        if (user.displayName) setName(user.displayName);
        if (user.email) setEmail(user.email);
        setTab("signup");
        setStatusMsg(
          "Google account verified! Now submit your safety & contact details once to unlock booking."
        );
      }
    } catch (err: any) {
      const msg = err?.code || err?.message || "Google sign-in could not complete.";
      if (String(msg).includes("popup-closed-by-user")) {
        setErrorMsg("Sign-in window closed before completing. Please try again.");
      } else if (String(msg).includes("popup-blocked")) {
        setErrorMsg("Popup was blocked by your browser. Allow popups for this site and click Continue with Google.");
      } else {
        setErrorMsg(`Sign-in notice: ${msg}`);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSubmitProfileAndBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatusMsg(null);

    if (name.trim().length < 2) {
      setErrorMsg("Please enter your full name (at least 2 characters).");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit WhatsApp phone number.");
      return;
    }
    const cleanEmergency = emergencyContact.replace(/\D/g, "");
    if (cleanEmergency.length < 10) {
      setErrorMsg("Please enter a valid 10-digit Emergency Contact number for meetup safety.");
      return;
    }
    const cleanLast4 = govtIdLast4.replace(/\D/g, "");
    if (cleanLast4.length !== 4) {
      setErrorMsg("Please enter the last 4 digits of your Government ID.");
      return;
    }
    if (interests.length === 0) {
      setErrorMsg("Please select at least 1 weekly experience interest.");
      return;
    }
    if (role === "partner") {
      if (partnerExpTitle.trim().length < 4) {
        setErrorMsg("Please enter the experience title you want to host.");
        return;
      }
      if (!partnerUpi.trim() || !partnerUpi.includes("@")) {
        setErrorMsg("Please enter a valid UPI ID (e.g. name@okicici) for 80% payouts.");
        return;
      }
    }

    setBusy(true);
    audio.playClick();
    try {
      let activeUser: User | null = firebaseUser;
      if (!activeUser) {
        const res = await signInWithGoogle();
        activeUser = res.user;
      }

      const submission: ProfileFormSubmission = {
        role,
        name: name.trim(),
        email: activeUser.email || email.trim(),
        phone: cleanPhone.slice(-10),
        gender,
        city,
        preferredHub: preferredHub.trim(),
        govtIdType,
        govtIdLast4: cleanLast4,
        emergencyContact: cleanEmergency.slice(-10),
        interests,
        ...(role === "partner"
          ? {
              partnerExtra: {
                activityCategory: partnerCategory,
                experienceTitle: partnerExpTitle.trim(),
                bio:
                  partnerBio.trim() ||
                  "Verified Delhi NCR Hangout Partner hosting structured public experiences.",
                upiHandleMasked: partnerUpi.trim(),
                availableSlots:
                  partnerSlots.length > 0 ? partnerSlots : ["Weekday evenings"],
              },
            }
          : {}),
      };

      await saveProfileAfterAuth(activeUser, submission);

      // Non-blocking notification forward to server endpoint
      fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: submission.name,
          email: submission.email,
          phone: submission.phone,
          city: submission.city,
          location_area: submission.preferredHub,
          join_as: submission.role,
          interests: submission.interests.join(", "),
          form_type: `Account Signup (${submission.role})`,
        }),
      }).catch(() => {});

      audio.playSuccess();
      onAuthenticatedReady();
    } catch (err: any) {
      const msg = err?.code || err?.message || "Could not save your profile.";
      if (String(msg).includes("popup-closed-by-user")) {
        setErrorMsg("Please finish Google verification in the popup to save your details and book.");
      } else {
        setErrorMsg(String(msg));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#011C92]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 14 }}
        className="bg-white border border-[#0A2EB8]/20 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[94vh] flex flex-col my-auto text-[#0B1230]"
      >
        {/* Top Context Header */}
        <div className="bg-[#011C92] text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFC83D] block">
              {pendingExperience ? "Verify Once Before Booking" : "Happy Hangouts Member Access"}
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight truncate">
              {tab === "signup"
                ? "Sign Up & Submit Details"
                : "Sign In to Happy Hangouts"}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            aria-label="Close sign in dialog"
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pending Experience Summary Strip */}
        {pendingExperience && (
          <div className="bg-[#F3F7FF] border-b border-[#0A2EB8]/15 px-5 py-3 flex items-center gap-3 shrink-0">
            <img
              src={pendingExperience.interestPhoto}
              alt={pendingExperience.interestPhotoAlt}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover border border-[#0A2EB8]/20 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-[#0A2EB8] uppercase tracking-wider truncate">
                Booking Intent · {pendingExperience.slotLabel}
              </p>
              <p className="text-sm font-bold text-[#0B1230] truncate">
                {pendingExperience.experienceTitle}
              </p>
              <p className="text-[11px] text-[#0B1230]/65 truncate">
                {pendingExperience.location} · From ₹99 (30m ₹99 · 1h ₹199 · 2h ₹449)
              </p>
            </div>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="px-5 pt-4 pb-2 bg-white border-b border-slate-100 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setTab("signup");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              tab === "signup"
                ? "bg-[#0A2EB8] text-white shadow-sm"
                : "bg-[#F3F7FF] text-[#0B1230]/75 hover:text-[#0A2EB8]"
            }`}
          >
            Sign Up (Submit Info)
          </button>
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setTab("signin");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              tab === "signin"
                ? "bg-[#0A2EB8] text-white shadow-sm"
                : "bg-[#F3F7FF] text-[#0B1230]/75 hover:text-[#0A2EB8]"
            }`}
          >
            Sign In (Returning Member)
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {statusMsg && (
            <div className="p-3 rounded-xl bg-[#19C37D]/15 border border-[#19C37D] text-[#0B1230] text-xs font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#19C37D] shrink-0 mt-0.5" />
              <span>{statusMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-400 text-amber-950 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === "signin" ? (
            <div className="space-y-4 py-2">
              <div className="bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0A2EB8] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>One-Tap Verified Google Sign-In</span>
                </div>
                <p className="text-sm text-[#0B1230]/80 leading-relaxed">
                  Already submitted your Happy Hangouts safety details? Sign in with Google to instantly unlock booking, view your Happy Key PIN, or open your Partner / Admin workspace.
                </p>

                <button
                  type="button"
                  disabled={busy}
                  onClick={handleGoogleQuickSignIn}
                  className="w-full py-3.5 px-5 rounded-full bg-[#FFC83D] hover:bg-[#ffbe26] disabled:opacity-60 text-[#0B1230] font-extrabold text-sm shadow-md flex items-center justify-center gap-2.5 cursor-pointer transition-transform hover:-translate-y-0.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {busy ? "Verifying Account..." : "Continue with Google"}
                  </span>
                </button>
              </div>

              <div className="text-center text-xs text-[#0B1230]/65">
                First time booking?{" "}
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className="text-[#0A2EB8] font-bold underline cursor-pointer"
                >
                  Switch to Sign Up &amp; submit your details
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitProfileAndBook} className="space-y-4">
              {/* Google Verification Banner */}
              <div className="bg-[#F3F7FF] border border-[#0A2EB8]/20 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#0A2EB8] flex items-center gap-1.5">
                    {firebaseUser ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#19C37D]" />
                        <span>Google Connected: {firebaseUser.email}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Step 1 · Link your Google account or fill details below</span>
                      </>
                    )}
                  </p>
                  <p className="text-[11px] text-[#0B1230]/65 mt-0.5">
                    {firebaseUser
                      ? "Complete your booking & safety profile below."
                      : "You can pre-fill with Google now or click Submit at the bottom to verify."}
                  </p>
                </div>
                {!firebaseUser && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleGoogleQuickSignIn}
                    className="py-2 px-4 rounded-full bg-white border border-[#0A2EB8]/30 hover:border-[#0A2EB8] text-[#0A2EB8] text-xs font-bold whitespace-nowrap cursor-pointer shrink-0"
                  >
                    Pre-fill via Google
                  </button>
                )}
              </div>

              {/* Account Role Selection */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setRole("seeker");
                  }}
                  className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    role === "seeker"
                      ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                      : "bg-white text-[#0B1230] border-[#0A2EB8]/20 hover:border-[#0A2EB8]"
                  }`}
                >
                  <span className="block text-xs font-extrabold">Experience Seeker</span>
                  <span className={`block text-[11px] ${role === "seeker" ? "text-white/80" : "text-[#0B1230]/60"}`}>
                    Starting at ₹99 per hangout
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setRole("partner");
                  }}
                  className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                    role === "partner"
                      ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                      : "bg-white text-[#0B1230] border-[#0A2EB8]/20 hover:border-[#0A2EB8]"
                  }`}
                >
                  <span className="block text-xs font-extrabold">Hangout Partner</span>
                  <span className={`block text-[11px] ${role === "partner" ? "text-white/80" : "text-[#0B1230]/60"}`}>
                    Host &amp; earn Money
                  </span>
                </button>
              </div>

              {/* Core Identity Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0B1230] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B1230] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    disabled={Boolean(firebaseUser?.email)}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>
              </div>

              {/* Contact & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0B1230] mb-1">
                    WhatsApp Number (+91) *
                  </label>
                  <div className="flex items-center rounded-xl overflow-hidden border border-[#0B1230]/20 bg-white">
                    <span className="px-3 py-2.5 bg-[#F3F7FF] text-xs font-bold text-[#0B1230] border-r border-[#0B1230]/15 flex items-center gap-1 shrink-0">
                      <Phone className="w-3 h-3 text-[#19C37D]" />
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      className="clean-input w-full px-3 py-2.5 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1230] mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as UserGender)}
                    className="w-full"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other / Non-Binary</option>
                  </select>
                </div>
              </div>

              {/* City & Preferred Hub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0B1230] mb-1">
                    NCR City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => {
                      const c = e.target.value as "Gurugram" | "Delhi";
                      setCity(c);
                      setPreferredHub(HUB_CHOICES[c][0]);
                    }}
                    className="w-full"
                  >
                    <option value="Gurugram">Gurugram</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B1230] mb-1">
                    Preferred Public Hub *
                  </label>
                  <select
                    value={preferredHub}
                    onChange={(e) => setPreferredHub(e.target.value)}
                    className="w-full"
                  >
                    {HUB_CHOICES[city].map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Govt ID + Emergency Contact */}
              <div className="bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-2xl p-3.5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0A2EB8]">
                  <ShieldCheck className="w-4 h-4 text-[#19C37D]" />
                  <span>4-Pillar Safety Verification</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0B1230] mb-1">
                      Govt ID Type *
                    </label>
                    <select
                      value={govtIdType}
                      onChange={(e) => setGovtIdType(e.target.value as GovtIdType)}
                      className="w-full text-xs"
                    >
                      <option value="Aadhaar">Aadhaar</option>
                      <option value="PAN">PAN Card</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0B1230] mb-1">
                      Last 4 Digits *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={govtIdLast4}
                      onChange={(e) => setGovtIdLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="4829"
                      className="w-full tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0B1230] mb-1">
                      Emergency Contact (+91) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={emergencyContact}
                      onChange={(e) =>
                        setEmergencyContact(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="9811002233"
                      className="w-full tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* 5 Founding Activities Interest Selection */}
              <div>
                <label className="block text-xs font-bold text-[#0B1230] mb-1.5">
                  Your Top Weekly Experiences (Pick 1–5) *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ACTIVITIES_LIST.map((act) => {
                    const selected = interests.includes(act.label);
                    return (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => toggleInterest(act.label)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          selected
                            ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                            : "bg-white text-[#0B1230] border-[#0A2EB8]/20 hover:border-[#0A2EB8]"
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" />}
                        <span>{act.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Extra Hangout Partner Onboarding Section */}
              {role === "partner" && (
                <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 space-y-3">
                  <span className="text-xs font-extrabold text-[#0B1230] uppercase tracking-wider block">
                    Hangout Partner Onboarding &amp; 80% Payout Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0B1230] mb-1">
                        Primary Activity Category *
                      </label>
                      <select
                        value={partnerCategory}
                        onChange={(e) =>
                          setPartnerCategory(e.target.value as ActivityCategoryId)
                        }
                        className="w-full text-xs"
                      >
                        {ACTIVITIES_LIST.map((act) => (
                          <option key={act.id} value={act.id}>
                            {act.label} ({act.slot})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0B1230] mb-1">
                        UPI ID for 80% Payouts *
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerUpi}
                        onChange={(e) => setPartnerUpi(e.target.value)}
                        placeholder="ananya@okhdfcbank"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0B1230] mb-1">
                      Experience Title You Will Host *
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerExpTitle}
                      onChange={(e) => setPartnerExpTitle(e.target.value)}
                      placeholder="e.g. Morning 5K Track Pacing at Lodhi Garden"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0B1230] mb-1">
                      Host Bio &amp; Safety Approach
                    </label>
                    <input
                      type="text"
                      value={partnerBio}
                      onChange={(e) => setPartnerBio(e.target.value)}
                      placeholder="Short note on your activity style & public hub preference"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#0B1230] mb-1.5">
                      Available Weekly Slots
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ACTIVITIES_LIST.map((act) => {
                        const active = partnerSlots.includes(act.slot);
                        return (
                          <button
                            key={act.slot}
                            type="button"
                            onClick={() => togglePartnerSlot(act.slot)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                              active
                                ? "bg-[#0B1230] text-white border-[#0B1230]"
                                : "bg-white text-[#0B1230] border-amber-300"
                            }`}
                          >
                            {act.slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-[#0B1230]/70 bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-xl px-3.5 py-2.5 leading-relaxed">
                <strong>Manual Profile Activation:</strong> After you submit your{" "}
                {role === "partner" ? "Hangout Partner" : "Hangout Seeker"} details, our team checks your profile manually and activates it once verified. Any booking request you send will be confirmed manually after checking Hangout Partner availability.
              </p>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3.5 px-6 rounded-full bg-[#FFC83D] hover:bg-[#ffbe26] disabled:opacity-60 text-[#0B1230] font-extrabold text-sm shadow-md cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                {busy
                  ? "Submitting Profile..."
                  : pendingExperience
                  ? "Submit Profile & Continue Request →"
                  : "Submit Profile for Manual Review →"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
