import React, { useState, useEffect } from "react";
import { 
  X, 
  RefreshCw, 
  ShieldCheck, 
  MessageCircle, 
  Radio, 
  UserCheck,
  Lock,
  Unlock,
  CheckCircle2
} from "lucide-react";
import { motion } from "motion/react";
import { audio } from "../utils/audio";
import { CompanionProfile } from "../App";

export type DispatchStatus = "waiting" | "confirmed" | "declined" | "expired";

interface HangoutRequestDispatcherProps {
  companion: CompanionProfile;
  meetingLocation: string;
  meetingDate: string;
  meetingTime: string;
  womenOnly?: boolean;
  isAlreadyUnlocked?: boolean;
  onPartnerAccepted?: (companionId: string) => void;
  onClose: () => void;
  onMatchAnother?: () => void;
  triggerBoom?: (msg?: string) => void;
}

const TOTAL_TIMEOUT_SECONDS = 300; // 5 Minutes strictly like Uber/Ola

export default function HangoutRequestDispatcher({
  companion,
  meetingLocation,
  meetingDate,
  meetingTime,
  womenOnly = false,
  isAlreadyUnlocked = false,
  onPartnerAccepted,
  onClose,
  onMatchAnother,
  triggerBoom
}: HangoutRequestDispatcherProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_TIMEOUT_SECONDS);
  const [status, setStatus] = useState<DispatchStatus>("waiting");
  const [timelineEvents, setTimelineEvents] = useState<string[]>([
    "Request initialized with 5-minute partner action window",
    `Pinging ${companion.name} via WhatsApp & Companion Applet...`
  ]);

  const photoUnlocked = status === "confirmed" || isAlreadyUnlocked;

  // Audio timer & ping intervals
  useEffect(() => {
    if (status !== "waiting") return;

    audio.playBlip(620);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoCancel();
          return 0;
        }

        if (prev === 295) {
          setTimelineEvents((e) => [
            ...e,
            `Notification delivered to ${companion.name}'s verified device`
          ]);
        } else if (prev === 240) {
          setTimelineEvents((e) => [
            ...e,
            `${companion.name} active in Gurugram/Delhi radius (within 5 km)`
          ]);
        } else if (prev === 120) {
          setTimelineEvents((e) => [
            ...e,
            `Halfway mark: awaiting confirmation from ${companion.name}`
          ]);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, companion.name]);

  // Auto-cancellation when timer hits 0 (Uber/Ola style)
  const handleAutoCancel = () => {
    setStatus("expired");
    audio.playBlip(320);
    setTimelineEvents((e) => [
      ...e,
      "5-minute window expired. Request automatically cancelled with ₹0 fee. Partner photo kept private."
    ]);
  };

  // Host Action: Confirmed -> Unlocks Partner Photo!
  const handleHostConfirm = () => {
    audio.playSuccess();
    setStatus("confirmed");
    if (onPartnerAccepted) onPartnerAccepted(companion.id);
    if (triggerBoom) triggerBoom(`Hangout Confirmed! ${companion.name}'s verified photo is now unlocked.`);
    setTimelineEvents((e) => [
      ...e,
      `✓ ${companion.name} accepted! Verified partner photo unlocked & meetup locked.`
    ]);
  };

  // Host Action: Declined
  const handleHostDecline = () => {
    audio.playBlip(320);
    setStatus("declined");
    setTimelineEvents((e) => [
      ...e,
      `✕ ${companion.name} had a scheduling conflict. Request closed & photo remained private.`
    ]);
  };

  // Host Action: Simulate Timeout
  const handleSimulateTimeout = () => {
    audio.playBlip(320);
    setSecondsLeft(0);
    setStatus("expired");
    setTimelineEvents((e) => [
      ...e,
      "Simulation: 5-minute window expired. Request auto-cancelled with ₹0 charge."
    ]);
  };

  // Retry Request (Reset 5:00 countdown)
  const handleRetry = () => {
    audio.playClick();
    setSecondsLeft(TOTAL_TIMEOUT_SECONDS);
    setStatus("waiting");
    setTimelineEvents([
      "New 5-minute request window initiated",
      `Pinging ${companion.name} again at ${meetingLocation}...`
    ]);
  };

  // Format time as MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
  };

  // Circular progress calculation
  const progressPercent = (secondsLeft / TOTAL_TIMEOUT_SECONDS) * 100;

  // WhatsApp chat message
  const activePartnerName = womenOnly ? companion.womenCaptainName : companion.name;
  const bookingModeTag = womenOnly ? " [WOMEN-ONLY BOOKING — Exclusively for Women · Verified Female Hangout Partner]" : "";
  const waMessage = `Hi! I reserved a FREE spot (1st Hangout Free) for "${companion.experienceTitle}" (${companion.categoryLabel})${bookingModeTag} at ${meetingLocation} on ${meetingDate} (${meetingTime}) via Happy Hangouts (submitted 2+ hrs in advance). Excited for the experience!`;
  const waUrl = `https://wa.me/918800843189?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#011C92]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        className="bg-white border border-[#0A2EB8]/20 rounded-3xl max-w-lg w-full shadow-2xl overflow-y-auto max-h-[92vh] relative my-auto"
      >
        
        {/* Top Header Strip */}
        <div className="bg-[#F3F7FF] border-b border-[#0A2EB8]/15 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              status === "confirmed" ? "bg-[#19C37D] text-white" : "bg-[#0A2EB8] text-white"
            }`}>
              {status === "confirmed" ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Radio className="w-4 h-4 animate-pulse" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-bold text-[#0B1230] leading-tight truncate">
                {status === "waiting" && "Confirming Experience Spot"}
                {status === "confirmed" && "Experience Spot Confirmed!"}
                {status === "declined" && "Slot Unavailable"}
                {status === "expired" && "Request Auto-Cancelled"}
              </h3>
              <p className="text-[11px] text-[#0B1230]/65 font-medium truncate">
                {status === "confirmed"
                  ? `${companion.experienceTitle} · Check-in Ready`
                  : "5-minute Hangout Partner check-in · Details share on confirm"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full border border-[#0A2EB8]/15 bg-white hover:bg-[#F3F7FF] transition-colors cursor-pointer text-[#0B1230]/70 shrink-0 min-w-[38px] min-h-[38px] flex items-center justify-center"
            title="Close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Experience-First Privacy Explainer Banner */}
        <div className="bg-[#011C92] text-white px-4 py-2.5 flex items-center justify-between text-xs gap-2">
          <span className="text-[11px] text-white/95 leading-snug">
            {photoUnlocked
              ? `✓ Confirmed! Meet ${womenOnly ? "Female Hangout Partner" : "Hangout Partner"} ${activePartnerName} at ${meetingLocation}.`
              : womenOnly
              ? "👩 Women-Only Booking (For Women Only): Verified Female Hangout Partner locked."
              : "Experience-first matching: Hangout Partner identity stays private until confirmed."}
          </span>
          <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold shrink-0 ${
            photoUnlocked
              ? "bg-[#19C37D] text-[#0B1230]"
              : womenOnly
              ? "bg-[#FFC83D] text-[#0B1230]"
              : "bg-[#3DAAFC]/25 text-[#3DAAFC]"
          }`}>
            {photoUnlocked ? "Spot Locked" : womenOnly ? "Women Only" : "Experience First"}
          </span>
        </div>

        {/* Modal Main Body */}
        <div className="p-5 sm:p-6 space-y-4">

          {/* 1. WAITING / DISPATCHING VIEW */}
          {status === "waiting" && (
            <div className="space-y-4">
              
              {/* Circular Timer & Radar Animation */}
              <div className="flex flex-col items-center justify-center py-1">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                  
                  {/* Outer Pulsing Radar Rings */}
                  <div className="absolute inset-0 rounded-full border border-[#3DAAFC]/35 animate-ping pointer-events-none"></div>

                  {/* SVG Circular Progress */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="text-[#F3F7FF]"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="text-[#0A2EB8] transition-all duration-1000 ease-linear"
                      strokeWidth="6"
                      strokeDasharray={264}
                      strokeDashoffset={264 - (264 * progressPercent) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>

                  {/* Center Time Remaining */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-serif text-3xl font-bold text-[#0B1230] tracking-tight tabular-nums">
                      {formatTime(secondsLeft)}
                    </span>
                    <span className="text-[10px] text-[#0A2EB8] uppercase tracking-wider font-bold">
                      Partner Window
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#0B1230] font-semibold mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3DAAFC] animate-ping"></span>
                  <span>
                    {womenOnly
                      ? `Confirming Women-Only spot with Female Hangout Partner ${activePartnerName}...`
                      : `Confirming spot with Hangout Partner ${activePartnerName}...`}
                  </span>
                </p>
              </div>

              {/* Experience Target Card */}
              <div className="bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#0A2EB8]/20 bg-white shrink-0">
                    <img
                      src={companion.interestPhoto}
                      alt={companion.interestPhotoAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-bold text-[#0B1230] truncate">{companion.experienceTitle}</p>
                    </div>
                    <p className="text-xs text-[#0B1230]/75 truncate font-medium">
                      {companion.slotLabel} · {meetingLocation}
                    </p>
                    <p className="text-[11px] text-[#0A2EB8] font-semibold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {womenOnly
                          ? "👩 Women-Only · Female Hangout Partner"
                          : "Govt-ID vetted Hangout Partner · Reveals on confirm"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#19C37D] bg-[#19C37D]/15 px-2 py-0.5 rounded block">
                    ₹0 Free
                  </span>
                  <span className="text-[10px] text-[#0B1230]/45 line-through">
                    ₹{companion.rate}/hr
                  </span>
                </div>
              </div>

              {/* Live Dispatch Log / Timeline */}
              <div className="bg-[#F3F7FF]/70 border border-[#0A2EB8]/15 rounded-xl p-3 space-y-1.5 max-h-24 overflow-y-auto">
                <span className="text-[10px] font-bold uppercase text-[#0A2EB8] tracking-wider block">
                  Live Dispatch Stream:
                </span>
                {timelineEvents.map((ev, i) => (
                  <p key={i} className="text-[11px] text-[#0B1230]/80 font-normal leading-tight flex items-start gap-1.5">
                    <span className="text-[#0A2EB8] font-bold">›</span>
                    <span>{ev}</span>
                  </p>
                ))}
              </div>

              {/* DEMO SIMULATION CONTROLS */}
              <div className="bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A2EB8]">
                    Experience Dispatch Preview (Demo):
                  </span>
                  <span className="text-[10px] font-semibold text-[#0B1230]/60">
                    Confirming locks spot & host
                  </span>
                </div>

                <div className="grid grid-cols-1 min-[380px]:grid-cols-3 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={handleHostConfirm}
                    className="py-2 px-2 min-h-[42px] bg-[#19C37D] hover:bg-[#15ad6e] text-[#0B1230] rounded-lg cursor-pointer transition-colors text-center text-[11px] shadow-xs"
                  >
                    ✓ Confirm Spot
                  </button>

                  <button
                    type="button"
                    onClick={handleHostDecline}
                    className="py-2 px-2 min-h-[42px] bg-[#0B1230] hover:bg-[#1b2654] text-white rounded-lg cursor-pointer transition-colors text-center text-[11px]"
                  >
                    ✕ Decline
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateTimeout}
                    className="py-2 px-2 min-h-[42px] bg-white hover:bg-slate-100 text-[#0B1230] border border-[#0A2EB8]/25 rounded-lg cursor-pointer transition-colors text-center text-[11px]"
                  >
                    Timeout 5:00
                  </button>
                </div>
              </div>

              {/* Manual Cancel Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    onClose();
                  }}
                  className="btn outline w-full py-2.5 text-xs"
                >
                  Cancel Request (No Charge)
                </button>
              </div>

            </div>
          )}

          {/* 2. CONFIRMED VIEW (Partner Accepted -> Verified Photo UNLOCKED!) */}
          {status === "confirmed" && (
            <div className="space-y-4 py-1">
              
              {/* Confirmed Experience Pass Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="bg-gradient-to-br from-[#F3F7FF] to-white border-2 border-[#19C37D]/50 rounded-2xl p-4 shadow-md"
              >
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="relative w-28 h-24 sm:w-28 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#19C37D] shadow-md shrink-0 bg-[#F3F7FF]">
                    <img
                      src={companion.interestPhoto}
                      alt={companion.interestPhotoAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-[#19C37D] text-[#0B1230] rounded-full p-1 shadow-xs" title="Experience Confirmed">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#0B1230] bg-[#19C37D]/20 px-2.5 py-0.5 rounded font-bold mb-1.5">
                      <CheckCircle2 className="w-3 h-3 text-[#19C37D]" />
                      <span>
                        {womenOnly ? `Women-Only Confirmed · ${companion.slotLabel}` : `Spot Confirmed · ${companion.slotLabel}`}
                      </span>
                    </div>
                    <h4 className="font-serif text-xl font-bold text-[#0B1230] leading-tight">
                      {companion.experienceTitle}
                    </h4>
                    <p className="text-xs text-[#0B1230]/75 mt-1 leading-relaxed">
                      <strong>{meetingLocation}</strong> · {meetingDate} ({meetingTime})
                    </p>
                    <p className="text-[11px] font-semibold text-[#0A2EB8] mt-1">
                      {womenOnly ? "👩 Female Hangout Partner:" : "Hangout Partner assigned:"} {activePartnerName} (ID Verified · ★ {companion.rating})
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Free Launch Pass Summary Box */}
              <div className="bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-2xl p-3.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#0A2EB8] mb-1">
                  <span>1st Hangout Free Offer:</span>
                  <span className="bg-[#19C37D] text-[#0B1230] text-[10px] px-2 py-0.5 rounded font-bold">
                    ₹0 Charged
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#0B1230]/65">
                  <span>Hangout Partner Regular Fee:</span>
                  <span className="line-through">₹{companion.rate}/hr</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-[#0B1230] pt-1.5 border-t border-[#0A2EB8]/10 mt-1.5">
                  <span>Your Total Cost:</span>
                  <span className="font-serif text-base text-[#19C37D]">₹0 (1st Hangout Free)</span>
                </div>
              </div>

              {/* Policy Reminder: 2hr Advance & No Last-Hour Cancellation */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-[11px] text-[#0B1230] font-semibold leading-snug">
                ⏰ <strong>Booking &amp; Cancellation Rule:</strong> Requests are accepted min. 2 hrs prior (e.g. by 3 PM for 5 PM). You cannot cancel in the last 1 hour before hangout start.
              </div>

              {/* Direct Actions: Open WhatsApp */}
              <div className="space-y-2 pt-1">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audio.playClick()}
                  className="w-full py-3 px-5 rounded-full bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Hangout Partner {activePartnerName} on WhatsApp</span>
                </a>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-bold text-[#0A2EB8] hover:underline cursor-pointer"
                >
                  Back to Partners (Photo stays unlocked)
                </button>
              </div>
            </div>
          )}

          {/* 3. EXPIRED VIEW (5 Minutes Elapsed without Response -> Photo stays locked) */}
          {status === "expired" && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <div className="w-14 h-14 bg-[#F3F7FF] border border-[#0A2EB8]/20 text-[#0A2EB8] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase tracking-wider text-[#0A2EB8] bg-[#F3F7FF] px-3 py-0.5 rounded border border-[#0A2EB8]/20 font-bold">
                  5:00 Window Elapsed · Photo Private
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#0B1230] mt-2 mb-1">
                  Request Cancelled Automatically
                </h4>
                <p className="text-xs text-[#0B1230]/75 max-w-sm mx-auto leading-relaxed">
                  Just like Uber or Ola, when a partner does not accept within 5 minutes, the request auto-cancels with ₹0 charge and their personal photo stays locked.
                </p>
              </div>

              {/* Zero-Penalty Guarantee Box */}
              <div className="bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#0B1230]">
                  <ShieldCheck className="w-4 h-4 text-[#19C37D] shrink-0" />
                  <span>Zero Fees Deducted · 100% Free Credits Intact</span>
                </div>
                <p className="text-[11px] text-[#0B1230]/70 leading-relaxed font-normal">
                  Your "1st Hangout Free" launch credit was not used. Re-ping Hangout Partner {activePartnerName} or browse another experience.
                </p>
              </div>

              {/* Action Buttons: Retry or Match Another */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="w-full py-3 px-5 rounded-full bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Re-Ping {companion.name} (Restart 5:00 Timer)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    onClose();
                    if (onMatchAnother) onMatchAnother();
                  }}
                  className="btn outline w-full py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#0A2EB8]" />
                  <span>Explore Other Experiences</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. DECLINED VIEW (Host Busy -> Photo stays locked) */}
          {status === "declined" && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <div className="w-14 h-14 bg-[#F3F7FF] border border-[#0A2EB8]/20 text-[#0B1230] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#0B1230] mb-1">
                  {companion.name} is Unavailable
                </h4>
                <p className="text-xs text-[#0B1230]/75 max-w-sm mx-auto leading-relaxed">
                  {companion.name} has a scheduling conflict for {meetingDate} ({meetingTime}). Their personal photo remains locked.
                </p>
              </div>

              <div className="bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#0B1230]">
                  <span>Try Other Partners Matching Your Interests:</span>
                </div>
                <p className="text-[11px] text-[#0B1230]/70 leading-relaxed font-normal">
                  We have verified partners available right now in Gurugram and Delhi for badminton, coffee, or photowalks with ₹0 free pass.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    onClose();
                    if (onMatchAnother) onMatchAnother();
                  }}
                  className="w-full py-3 px-5 rounded-full bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Choose Another Partner</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="btn outline w-full py-2.5 text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Safety Guarantee Footer Note */}
        <div className="bg-[#F3F7FF] border-t border-[#0A2EB8]/15 p-3 text-center text-[11px] text-[#0B1230]/75 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#19C37D] shrink-0" />
          <span>Public Venues Only · Min 2-Hr Advance Request · No Last-Hour Cancel · 1st Hangout Free</span>
        </div>

      </motion.div>
    </div>
  );
}
