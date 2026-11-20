import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Key,
  MapPin,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  X,
} from "lucide-react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  FIELD_LIMITS,
  OperationType,
  clampString,
  db,
  handleFirestoreError,
  normalizeDocId,
} from "../lib/firebase";
import { ActivityCategoryId, useAuth } from "../contexts/AuthContext";
import {
  BookingRecord,
  PartnerRecord,
  subscribePartnerBookings,
  updateBookingStatus,
} from "../lib/bookings";
import { audio } from "../utils/audio";

interface PartnerPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

const WEEKLY_SLOTS = [
  "Weekday mornings — Running buddy",
  "Weekday evenings — Pickleball or badminton",
  "Saturday morning — Weekend hike",
  "Saturday evening — Chess or board games at a café",
  "Sunday morning — Photo walk",
];

export default function PartnerPortal({
  isOpen,
  onClose,
  onOpenAuth,
}: PartnerPortalProps) {
  const { firebaseUser, userProfile, isAdmin } = useAuth();

  const [tab, setTab] = useState<"requests" | "schedule" | "earnings" | "profile">("requests");
  const [partnerDoc, setPartnerDoc] = useState<PartnerRecord | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  // Check-in PIN verifier
  const [pinInput, setPinInput] = useState("");
  const [pinNotice, setPinNotice] = useState<string | null>(null);

  // Partner Profile Settings
  const [hub, setHub] = useState("");
  const [experienceTitle, setExperienceTitle] = useState("");
  const [bio, setBio] = useState("");
  const [upiHandle, setUpiHandle] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([
    "Weekday evenings — Pickleball or badminton",
  ]);
  const [activityCategory, setActivityCategory] = useState<ActivityCategoryId>("rackets");
  const [isActive, setIsActive] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);

  // Subscribe to Partner record owned by this user
  useEffect(() => {
    if (!isOpen || !firebaseUser) return;

    const q = query(
      collection(db, "partners"),
      where("ownerUid", "==", firebaseUser.uid)
    );
    const unsubPartner = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const p = snap.docs[0].data() as PartnerRecord;
          setPartnerDoc(p);
          setHub(p.hub);
          setExperienceTitle(p.experienceTitle);
          setBio(p.bio || "");
          setUpiHandle(p.upiHandleMasked || "");
          setAvailableSlots(p.availableSlots || []);
          setActivityCategory(p.activityCategory);
          setIsActive(p.active);
        } else {
          setPartnerDoc(null);
        }
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "partners")
    );

    const unsubBookings = subscribePartnerBookings(firebaseUser.uid, (rows) => {
      setBookings(rows);
    });

    return () => {
      unsubPartner();
      unsubBookings();
    };
  }, [isOpen, firebaseUser]);

  const metrics = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "pending");
    const activeRoster = bookings.filter((b) =>
      ["accepted", "checked_in"].includes(b.status)
    );
    const completed = bookings.filter((b) => b.status === "completed");
    const earnedInr = completed.reduce((acc, b) => acc + (b.partnerPayoutInr || 0), 0);
    const projectedInr = [...activeRoster, ...completed].reduce(
      (acc, b) => acc + (b.partnerPayoutInr || 0),
      0
    );
    return {
      pending,
      activeRoster,
      completed,
      earnedInr,
      projectedInr,
    };
  }, [bookings]);

  if (!isOpen) return null;

  const handleVerifyHappyKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinNotice(null);
    const clean = pinInput.trim().toUpperCase();
    if (!clean) return;
    const match = bookings.find(
      (b) =>
        b.happyKeyPin.toUpperCase() === clean &&
        ["accepted", "checked_in"].includes(b.status)
    );
    if (!match) {
      setPinNotice("No accepted booking matched that Happy Key PIN.");
      return;
    }
    audio.playConnect();
    const nextStatus = match.status === "accepted" ? "checked_in" : "completed";
    await updateBookingStatus(match.bookingId, nextStatus);
    setPinInput("");
    setPinNotice(
      nextStatus === "checked_in"
        ? `Seeker ${match.seekerName} checked in! Verify once finished to mark completed.`
        : `Session completed! Partner payout ₹${match.partnerPayoutInr} queued to ${upiHandle || "your UPI"}.`
    );
  };

  const handleSavePartnerSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !userProfile) return;
    setSavingProfile(true);
    setProfileNotice(null);
    audio.playClick();

    const partnerId = partnerDoc?.partnerId || normalizeDocId(`partner_${firebaseUser.uid}`);
    try {
      if (partnerDoc) {
        await updateDoc(doc(db, "partners", partnerId), {
          hub: clampString(hub || userProfile.preferredHub, FIELD_LIMITS.HUB_MAX),
          experienceTitle: clampString(
            experienceTitle || `${userProfile.city} Experience`,
            FIELD_LIMITS.EXPERIENCE_MAX
          ),
          bio: clampString(bio, FIELD_LIMITS.BIO_MAX),
          availableSlots:
            availableSlots.length > 0 ? availableSlots.slice(0, 5) : [WEEKLY_SLOTS[0]],
          active: isActive,
          upiHandleMasked: clampString(upiHandle, FIELD_LIMITS.UPI_MAX),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, "partners", partnerId), {
          partnerId,
          ownerUid: firebaseUser.uid,
          displayName: userProfile.name,
          gender: userProfile.gender,
          city: userProfile.city,
          hub: clampString(hub || userProfile.preferredHub, FIELD_LIMITS.HUB_MAX),
          activityCategory,
          experienceTitle: clampString(
            experienceTitle || `${userProfile.city} Curated Hangout`,
            FIELD_LIMITS.EXPERIENCE_MAX
          ),
          bio: clampString(bio, FIELD_LIMITS.BIO_MAX),
          rating: 5.0,
          totalSessions: 0,
          womenOnlyEligible: userProfile.gender === "female",
          kycStatus: "pending",
          active: false,
          availableSlots:
            availableSlots.length > 0 ? availableSlots.slice(0, 5) : [WEEKLY_SLOTS[0]],
          upiHandleMasked: clampString(upiHandle, FIELD_LIMITS.UPI_MAX),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      audio.playSuccess();
      setProfileNotice("Partner profile, availability slots & UPI settings saved.");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `partners/${partnerId}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleSlot = (slot: string) => {
    audio.playClick();
    setAvailableSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot].slice(0, 5)
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1230]/75 backdrop-blur-xs flex flex-col overflow-hidden">
      <div className="flex-1 bg-[#F3F7FF] text-[#0B1230] flex flex-col overflow-hidden">
        {/* Top Partner Bar */}
        <header className="bg-white border-b border-[#0A2EB8]/15 px-4 sm:px-8 py-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#0A2EB8] text-[#FFC83D] flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#0B1230] truncate">
                Hangout Partner Portal
              </h2>
              <p className="text-xs text-[#0B1230]/65 truncate">
                {partnerDoc
                  ? `${partnerDoc.displayName} · ${partnerDoc.city} (${partnerDoc.hub}) · KYC: ${partnerDoc.kycStatus}`
                  : "Manage incoming requests, Happy Key check-ins, 80% UPI payouts & weekly slots"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-[#011C92] text-white hover:bg-[#0A2EB8] text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <X className="w-4 h-4" />
            <span>Close Portal</span>
          </button>
        </header>

        {!firebaseUser || !userProfile ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white border border-[#0A2EB8]/20 rounded-3xl p-7 shadow-lg text-center space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#0B1230]">
                Sign In or Apply as a Hangout Partner
              </h3>
              <p className="text-sm text-[#0B1230]/75 leading-relaxed">
                Sign in with your verified account (or complete your Hangout Partner signup profile) to view incoming seeker requests, manage your weekly slots, verify Happy Key check-ins, and track your 80% payouts.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="flex-1 py-3 px-5 rounded-full bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-sm cursor-pointer"
                >
                  Sign Up / Sign In
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-5 rounded-full border border-[#0A2EB8]/25 text-[#0B1230] font-bold text-sm cursor-pointer"
                >
                  Back to Site
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-6xl w-full mx-auto">
            {/* Partner Onboarding Prompt if user is currently Seeker without Partner doc */}
            {!partnerDoc && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-[#0B1230]">
                    Activate Your Hangout Partner Profile
                  </p>
                  <p className="text-xs text-[#0B1230]/75 mt-0.5">
                    You are currently registered as a Seeker. Complete the &quot;Hub &amp; KYC Settings&quot; tab below (add your UPI ID &amp; activity) to start receiving bookings in Delhi NCR.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab("profile")}
                  className="px-4 py-2 rounded-full bg-[#0A2EB8] text-white text-xs font-bold whitespace-nowrap cursor-pointer shrink-0"
                >
                  Complete Partner Setup →
                </button>
              </div>
            )}

            {/* Partner Pending Manual Review Notice */}
            {partnerDoc && partnerDoc.kycStatus === "pending" && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-[#0B1230]">
                    Profile Pending Manual Review
                  </p>
                  <p className="text-xs text-[#0B1230]/75 mt-0.5">
                    Our team checks every Hangout Partner profile manually before making it live. Questions? WhatsApp +91 72178 13236 or email happyhangouts.life@gmail.com.
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-white border border-amber-300 text-amber-900 text-xs font-bold whitespace-nowrap shrink-0">
                  KYC: Pending Approval
                </span>
              </div>
            )}

            {/* 4-KPI Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-5">
                <span className="text-xs font-bold text-[#0B1230]/60 block">
                  Incoming Requests
                </span>
                <p className="font-serif text-3xl font-bold text-[#0A2EB8] mt-1 tabular-nums">
                  {metrics.pending.length}
                </p>
                <p className="text-xs text-[#0B1230]/65 mt-1">
                  Manual availability confirmation
                </p>
              </div>

              <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-5">
                <span className="text-xs font-bold text-[#0B1230]/60 block">
                  Upcoming Confirmed
                </span>
                <p className="font-serif text-3xl font-bold text-[#0B1230] mt-1 tabular-nums">
                  {metrics.activeRoster.length}
                </p>
                <p className="text-xs text-[#0B1230]/65 mt-1">
                  Happy Key check-in ready
                </p>
              </div>

              <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-5">
                <span className="text-xs font-bold text-[#0B1230]/60 block">
                  Settled 80% Earnings
                </span>
                <p className="font-serif text-3xl font-bold text-[#19C37D] mt-1 tabular-nums">
                  ₹{metrics.earnedInr.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-[#0B1230]/65 mt-1 tabular-nums">
                  Projected pipeline: ₹{metrics.projectedInr.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-5">
                <span className="text-xs font-bold text-[#0B1230]/60 block">
                  Verification &amp; Rating
                </span>
                <p className="font-serif text-2xl font-bold text-[#0B1230] mt-1">
                  ★ {partnerDoc?.rating || "5.0"} ·{" "}
                  <span className="text-base uppercase">
                    {partnerDoc?.kycStatus || "New"}
                  </span>
                </p>
                <p className="text-xs text-[#0B1230]/65 mt-1">
                  {userProfile.gender === "female"
                    ? "Eligible for Women-Only & Open"
                    : "Open Cohort Hangout Partner"}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#0A2EB8]/15">
              {[
                { id: "requests", label: `Incoming Requests (${metrics.pending.length})` },
                { id: "schedule", label: `Schedule & Check-In (${metrics.activeRoster.length})` },
                { id: "earnings", label: "80% Earnings & UPI" },
                { id: "profile", label: "Hub, Slots & KYC Profile" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setTab(t.id as any);
                  }}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                    tab === t.id
                      ? "border-[#0A2EB8] text-[#0A2EB8] bg-white"
                      : "border-transparent text-[#0B1230]/65 hover:text-[#0B1230]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB 1: INCOMING REQUESTS */}
            {tab === "requests" && (
              <div className="space-y-4">
                {metrics.pending.length === 0 ? (
                  <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-8 text-center space-y-2">
                    <Bell className="w-8 h-8 text-[#0A2EB8]/40 mx-auto" />
                    <h4 className="font-serif text-xl font-bold text-[#0B1230]">
                      No Pending Requests Right Now
                    </h4>
                    <p className="text-xs text-[#0B1230]/70 max-w-md mx-auto">
                      Seekers send requests at least 2 hours before start time. When a seeker books an experience matched to you ({isAdmin ? "Admin / Partner UID" : firebaseUser.uid}), you can Accept or Decline here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {metrics.pending.map((req) => (
                      <div
                        key={req.bookingId}
                        className="bg-white border border-[#0A2EB8]/20 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xs"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#0A2EB8]">
                              {req.slotLabel} · 2-Hr Advance Confirmed
                            </span>
                            <span className="font-extrabold text-[#19C37D] tabular-nums">
                              Your 80% Payout: ₹{req.partnerPayoutInr} ({req.durationLabel})
                            </span>
                          </div>

                          <div>
                            <h4 className="font-serif text-lg font-bold text-[#0B1230]">
                              {req.experienceTitle}
                            </h4>
                            <p className="text-xs text-[#0B1230]/75 mt-0.5">
                              Seeker: <strong>{req.seekerName}</strong> ({req.seekerGender} · Govt-ID Verified)
                            </p>
                            {req.womenOnly && (
                              <p className="text-xs font-extrabold text-[#011C92] mt-1">
                                👩 Optional Women-Only Preference Selected (Female Partner Requested)
                              </p>
                            )}
                          </div>

                          <div className="bg-[#F3F7FF] rounded-xl p-3 space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-[#0A2EB8] shrink-0" />
                              <span className="font-bold">
                                {req.dayLabel} at {req.startHour} ({req.durationLabel})
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[#0B1230]/75">
                              <MapPin className="w-3.5 h-3.5 text-[#0A2EB8] shrink-0" />
                              <span>{req.venue}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={async () => {
                              audio.playConnect();
                              await updateBookingStatus(req.bookingId, "accepted");
                            }}
                            className="py-2.5 px-4 rounded-xl bg-[#19C37D] hover:bg-[#16ad6e] text-[#0B1230] font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Accept Spot</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              audio.playClick();
                              await updateBookingStatus(req.bookingId, "declined");
                            }}
                            className="py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-rose-50 text-[#0B1230] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                            <span>Decline</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SCHEDULE & HAPPY KEY CHECK-IN */}
            {tab === "schedule" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white border border-[#0A2EB8]/15 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0A2EB8]">
                    <Key className="w-4 h-4" />
                    <span>Verify Seeker Happy Key PIN</span>
                  </div>
                  <p className="text-xs text-[#0B1230]/75 leading-relaxed">
                    When you meet at the public venue, enter the seeker&apos;s 6-character Happy Key (e.g. HH-4821) to check in and complete the hangout payout.
                  </p>
                  <form onSubmit={handleVerifyHappyKey} className="space-y-3">
                    <input
                      type="text"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="Enter Happy Key (e.g. HH-4821)"
                      className="w-full font-mono uppercase"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 rounded-full bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-xs cursor-pointer"
                    >
                      Verify Check-In / Complete Hangout
                    </button>
                  </form>
                  {pinNotice && (
                    <div className="p-3 rounded-xl bg-[#F3F7FF] border border-[#0A2EB8]/20 text-xs font-semibold text-[#0B1230]">
                      {pinNotice}
                    </div>
                  )}
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-[#0B1230] font-semibold">
                    Policy Reminder: No cancellations are allowed in the last 1 hour before hangout start.
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white border border-[#0A2EB8]/15 rounded-2xl p-6 space-y-4">
                  <h4 className="font-serif text-lg font-bold text-[#0B1230]">
                    Confirmed Hangout Roster
                  </h4>
                  {metrics.activeRoster.length === 0 ? (
                    <p className="text-xs text-[#0B1230]/65">
                      No upcoming accepted hangouts right now. Accept an incoming request to unlock seeker WhatsApp &amp; Happy Key check-in.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {metrics.activeRoster.map((b) => (
                        <div
                          key={b.bookingId}
                          className="bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#0B1230]">
                                {b.seekerName}
                              </span>
                              <span className="font-mono text-xs font-bold text-[#0A2EB8]">
                                {b.happyKeyPin}
                              </span>
                            </div>
                            <p className="text-xs text-[#0B1230]/75">
                              {b.experienceTitle} · {b.dayLabel} {b.startHour} ({b.durationLabel})
                            </p>
                            <p className="text-xs text-[#0B1230]/65">{b.venue}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`https://wa.me/91${b.seekerPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-lg bg-white border border-[#0A2EB8]/25 text-[#0A2EB8] text-xs font-bold inline-flex items-center gap-1"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <button
                              type="button"
                              onClick={() =>
                                updateBookingStatus(
                                  b.bookingId,
                                  b.status === "accepted" ? "checked_in" : "completed"
                                )
                              }
                              className="px-3 py-2 rounded-lg bg-[#19C37D] text-[#0B1230] text-xs font-extrabold cursor-pointer"
                            >
                              {b.status === "accepted" ? "Check In" : "Mark Completed"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: 80% EARNINGS & UPI PAYOUTS */}
            {tab === "earnings" && (
              <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-serif text-xl font-bold text-[#0B1230]">
                      Partner Earnings Ledger (80% Share)
                    </h4>
                    <p className="text-xs text-[#0B1230]/70 mt-0.5">
                      Fixed 80% partner payouts: ₹79 (30 min · ₹99) · ₹159 (1 hr · ₹199) · ₹359 (2 hrs · ₹449).
                    </p>
                  </div>
                  <div className="text-right tabular-nums">
                    <span className="text-[11px] font-bold text-[#0B1230]/60 block">
                      Linked UPI Handle
                    </span>
                    <span className="font-mono text-sm font-bold text-[#0A2EB8]">
                      {partnerDoc?.upiHandleMasked || upiHandle || "Add UPI in Profile Tab"}
                    </span>
                  </div>
                </div>

                {metrics.completed.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#F3F7FF] text-xs text-[#0B1230]/70 text-center">
                    No completed sessions logged yet. Completed hangouts appear here with exact 80% UPI payout amounts.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs tabular-nums">
                      <thead>
                        <tr className="bg-[#F3F7FF] border-b border-[#0A2EB8]/15 font-bold">
                          <th className="py-3 px-4">Session</th>
                          <th className="py-3 px-4">Seeker</th>
                          <th className="py-3 px-4">Duration</th>
                          <th className="py-3 px-4">Gross Price</th>
                          <th className="py-3 px-4">Platform Fee (20%)</th>
                          <th className="py-3 px-4">Your Payout (80%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {metrics.completed.map((b) => (
                          <tr key={b.bookingId}>
                            <td className="py-3 px-4 font-bold">{b.experienceTitle}</td>
                            <td className="py-3 px-4">{b.seekerName}</td>
                            <td className="py-3 px-4">{b.durationLabel}</td>
                            <td className="py-3 px-4">₹{b.chargedPriceInr}</td>
                            <td className="py-3 px-4">₹{b.platformFeeInr}</td>
                            <td className="py-3 px-4 font-bold text-[#19C37D]">
                              ₹{b.partnerPayoutInr}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: HUB, SLOTS & KYC PROFILE */}
            {tab === "profile" && (
              <form
                onSubmit={handleSavePartnerSettings}
                className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-6 space-y-5 max-w-3xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-xl font-bold text-[#0B1230]">
                      Host Profile, Weekly Slots &amp; UPI Settings
                    </h4>
                    <p className="text-xs text-[#0B1230]/65 mt-0.5">
                      Govt ID ({userProfile.govtIdType} ****{userProfile.govtIdLast4}) · KYC Status:{" "}
                      <strong>{partnerDoc?.kycStatus || "pending"}</strong>
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 accent-[#0A2EB8]"
                    />
                    <span>Available for Bookings</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Primary Activity</label>
                    <select
                      value={activityCategory}
                      onChange={(e) =>
                        setActivityCategory(e.target.value as ActivityCategoryId)
                      }
                      className="w-full"
                    >
                      <option value="running">Running buddy</option>
                      <option value="rackets">Pickleball or badminton</option>
                      <option value="hike">Weekend hike</option>
                      <option value="games_cafe">Chess or board games at a café</option>
                      <option value="photowalk">Photo walk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Public Venue Hub</label>
                    <input
                      type="text"
                      value={hub}
                      onChange={(e) => setHub(e.target.value)}
                      placeholder="e.g. Sector 29 Courts, Gurugram"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">Experience Title</label>
                    <input
                      type="text"
                      value={experienceTitle}
                      onChange={(e) => setExperienceTitle(e.target.value)}
                      placeholder="e.g. After-Work Badminton Rallies"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      UPI ID for 80% Payouts
                    </label>
                    <input
                      type="text"
                      value={upiHandle}
                      onChange={(e) => setUpiHandle(e.target.value)}
                      placeholder="name@okicici"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Host Bio &amp; Safety Notes</label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Public venue rules, equipment tips & group style..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Weekly Availability Slots (Max 5)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {WEEKLY_SLOTS.map((slot) => {
                      const active = availableSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => toggleSlot(slot)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                            active
                              ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                              : "bg-white text-[#0B1230] border-[#0A2EB8]/20"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {profileNotice && (
                  <div className="p-3 rounded-xl bg-[#19C37D]/15 border border-[#19C37D] text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#19C37D]" />
                    <span>{profileNotice}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="py-3 px-6 rounded-full bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-sm cursor-pointer shadow-sm"
                >
                  {savingProfile ? "Saving Settings..." : "Save Partner Settings"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
