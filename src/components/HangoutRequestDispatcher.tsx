import React, { useState, useEffect, useRef } from "react";
import { 
  Clock, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  Navigation, 
  Calendar, 
  Radio, 
  Zap,
  ArrowRight,
  PhoneCall,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { audio } from "../utils/audio";
import { CompanionProfile } from "../App";

export type DispatchStatus = "waiting" | "confirmed" | "declined" | "expired";

interface HangoutRequestDispatcherProps {
  companion: CompanionProfile;
  meetingLocation: string;
  meetingDate: string;
  meetingTime: string;
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
      "5-minute window expired. Request automatically cancelled with ₹0 fee."
    ]);
  };

  // Host Action: Confirmed
  const handleHostConfirm = () => {
    audio.playSuccess();
    setStatus("confirmed");
    if (triggerBoom) triggerBoom("Hangout Confirmed!");
    setTimelineEvents((e) => [
      ...e,
      `✓ ${companion.name} accepted the hangout request! Meetup locked.`
    ]);
  };

  // Host Action: Declined
  const handleHostDecline = () => {
    audio.playBlip(320);
    setStatus("declined");
    setTimelineEvents((e) => [
      ...e,
      `✕ ${companion.name} had a scheduling conflict. Request closed.`
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
  const waMessage = `Hi ${companion.name}! I booked our FREE Hangout (Launch Offer: First 3 Hangouts Free) at ${meetingLocation} for ${meetingDate} (${meetingTime}) via Happy Hangouts. Excited to meet!`;
  const waUrl = `https://wa.me/918800843189?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        className="bg-white border border-[#E4E4E7] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative my-auto"
      >
        
        {/* Top Header Strip */}
        <div className="bg-[#FAF9F5] border-b border-[#E4E4E7] p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#18181B] text-white flex items-center justify-center text-xs font-semibold">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#18181B] leading-tight">
                {status === "waiting" && "Live Partner Dispatch"}
                {status === "confirmed" && "Hangout Confirmed"}
                {status === "declined" && "Companion Unavailable"}
                {status === "expired" && "Request Automatically Cancelled"}
              </h3>
              <p className="text-[11px] text-[#71717A] font-normal">
                Uber/Ola-style 5-minute action window active
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full border border-[#E4E4E7] hover:bg-slate-100 transition-colors cursor-pointer text-[#71717A]"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Uber/Ola Concept Explainer Banner */}
        <div className="bg-[#18181B] text-white px-4 py-2.5 flex items-center justify-between text-xs gap-2">
          <span className="text-[11px] text-white/90">
            Partner has <strong>5:00 mins</strong> to confirm. If no response, system auto-cancels with <strong>₹0 charge</strong>.
          </span>
          <span className="text-[10px] bg-white/20 text-white uppercase px-2 py-0.5 rounded-full font-mono shrink-0">
            Auto-Cancel
          </span>
        </div>

        {/* Modal Main Body */}
        <div className="p-5 sm:p-6 space-y-4">

          {/* 1. WAITING / DISPATCHING VIEW */}
          {status === "waiting" && (
            <div className="space-y-4">
              
              {/* Circular Timer & Radar Radar Animation */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  
                  {/* Outer Pulsing Radar Rings */}
                  <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-ping pointer-events-none"></div>

                  {/* SVG Circular Progress */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="text-slate-100"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="text-[#C2410C] transition-all duration-1000 ease-linear"
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
                    <span className="font-serif text-3xl font-semibold text-[#18181B] tracking-tight">
                      {formatTime(secondsLeft)}
                    </span>
                    <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-medium">
                      Host Timeout
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#18181B] font-medium mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C2410C] animate-ping"></span>
                  <span>Awaiting action from {companion.name}...</span>
                </p>
              </div>

              {/* Companion Target Card */}
              <div className="bg-[#FAF9F5] border border-[#E4E4E7] rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-[#E4E4E7] bg-white flex items-center justify-center font-serif text-base font-semibold text-[#18181B] shrink-0">
                    {companion.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-[#18181B] truncate">{companion.name}</p>
                      <span className="text-[10px] text-[#C2410C] bg-[#FFF7ED] px-1.5 py-0.2 rounded border border-[#FED7AA] font-medium">
                        ★ {companion.rating}
                      </span>
                    </div>
                    <p className="text-xs text-[#71717A] truncate font-normal">
                      {companion.categoryLabel} · {meetingLocation}
                    </p>
                    <p className="text-[11px] text-[#52525B] font-medium">
                      {meetingDate} · {meetingTime}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-[#C2410C] bg-[#FFF7ED] px-2 py-0.5 rounded-full border border-[#FED7AA] block">
                    ₹0 Free
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    ₹{companion.rate}/hr
                  </span>
                </div>
              </div>

              {/* Live Dispatch Log / Timeline */}
              <div className="bg-slate-50 border border-[#E4E4E7] rounded-xl p-3 space-y-1.5 max-h-24 overflow-y-auto">
                <span className="text-[10px] font-semibold uppercase text-[#71717A] tracking-wider block">
                  Live Dispatch Stream:
                </span>
                {timelineEvents.map((ev, i) => (
                  <p key={i} className="text-[11px] text-[#52525B] font-normal leading-tight flex items-start gap-1.5">
                    <span className="text-[#C2410C] font-bold">›</span>
                    <span>{ev}</span>
                  </p>
                ))}
              </div>

              {/* DEMO SIMULATION CONTROLS */}
              <div className="bg-[#FAF9F5] border border-[#E4E4E7] rounded-xl p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A]">
                    Simulate Host Actions (Demo Preview):
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
                  <button
                    type="button"
                    onClick={handleHostConfirm}
                    className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition-colors text-center text-[11px]"
                  >
                    ✓ Confirms
                  </button>

                  <button
                    type="button"
                    onClick={handleHostDecline}
                    className="py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer transition-colors text-center text-[11px]"
                  >
                    ✕ Declines
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateTimeout}
                    className="py-1.5 px-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg cursor-pointer transition-colors text-center text-[11px]"
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

          {/* 2. CONFIRMED VIEW (Partner Accepted!) */}
          {status === "confirmed" && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 font-serif text-2xl font-bold">
                  ✓
                </div>
                <span className="text-xs uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200 font-semibold">
                  Accepted within 5-Minute Window
                </span>
                <h4 className="font-serif text-2xl font-medium text-[#18181B] mt-2 mb-1">
                  Meetup Locked with {companion.name}
                </h4>
                <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                  {companion.name} confirmed your session at <strong>{meetingLocation}</strong> for <strong>{meetingDate} ({meetingTime})</strong>.
                </p>
              </div>

              {/* Free Launch Pass Summary Box */}
              <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-3.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#C2410C] mb-1">
                  <span>First 3 Hangouts Free:</span>
                  <span className="bg-[#C2410C] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    ₹0 Charged
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#71717A]">
                  <span>Companion Regular Fee:</span>
                  <span className="line-through">₹{companion.rate}/hr</span>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-[#18181B] pt-1 border-t border-[#FED7AA]/60 mt-1">
                  <span>Your Total Cost:</span>
                  <span className="font-serif text-base text-[#C2410C]">₹0 Launch Credit</span>
                </div>
              </div>

              {/* Direct Actions: Open WhatsApp & Google Maps Directions */}
              <div className="space-y-2 pt-1">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audio.playClick()}
                  className="btn b w-full py-3 text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with {companion.name} on WhatsApp</span>
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    `${meetingLocation}, Delhi NCR, India`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audio.playClick()}
                  className="btn outline w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>Get Directions to {meetingLocation} in Google Maps</span>
                </a>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-medium text-[#71717A] hover:underline cursor-pointer"
                >
                  Back to Hangouts
                </button>
              </div>
            </div>
          )}

          {/* 3. EXPIRED VIEW (5 Minutes Elapsed without Response) */}
          {status === "expired" && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <div className="w-14 h-14 bg-[#FFF7ED] border border-[#FED7AA] text-[#C2410C] rounded-full flex items-center justify-center mx-auto mb-3 font-serif text-2xl font-bold">
                  ⏱
                </div>
                <span className="text-xs uppercase tracking-wider text-[#C2410C] bg-[#FFF7ED] px-3 py-0.5 rounded-full border border-[#FED7AA] font-semibold">
                  5:00 Minute Window Elapsed
                </span>
                <h4 className="font-serif text-2xl font-medium text-[#18181B] mt-2 mb-1">
                  Request Cancelled Automatically
                </h4>
                <p className="text-xs text-[#71717A] max-w-sm mx-auto leading-relaxed">
                  Just like Uber or Ola, when a host does not respond within 5 minutes, we cancel the request automatically with ₹0 charge so you aren't kept waiting.
                </p>
              </div>

              {/* Zero-Penalty Guarantee Box */}
              <div className="bg-[#FAF9F5] border border-[#E4E4E7] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-[#18181B]">
                  <ShieldCheck className="w-4 h-4 text-[#C2410C] shrink-0" />
                  <span>Zero Fees Deducted · 100% Free Credits Intact</span>
                </div>
                <p className="text-[11px] text-[#52525B] leading-relaxed font-normal">
                  Your "First 3 Hangouts Free" launch credit was not used and remains 100% available. You can re-ping {companion.name} or match with another companion.
                </p>
              </div>

              {/* Action Buttons: Retry or Match Another */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="btn b w-full py-3 text-sm flex items-center justify-center gap-2 cursor-pointer"
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
                  <UserCheck className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>Match with Another Verified Companion</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. DECLINED VIEW (Host Busy / in another session) */}
          {status === "declined" && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-3 font-serif text-2xl font-bold">
                  ✕
                </div>
                <h4 className="font-serif text-2xl font-medium text-[#18181B] mb-1">
                  {companion.name} is Unavailable
                </h4>
                <p className="text-xs text-[#71717A] max-w-sm mx-auto leading-relaxed">
                  {companion.name} has a scheduling conflict for {meetingDate} ({meetingTime}).
                </p>
              </div>

              <div className="bg-[#FAF9F5] border border-[#E4E4E7] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-[#18181B]">
                  <span>Try Other Verified Companions:</span>
                </div>
                <p className="text-[11px] text-[#52525B] leading-relaxed font-normal">
                  We have other verified companions available right now in Gurugram and Delhi for badminton, coffee, or photowalks with ₹0 free pass.
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
                  className="btn b w-full py-3 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Choose Another Companion</span>
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
        <div className="bg-[#FAF9F5] border-t border-[#E4E4E7] p-3 text-center text-[11px] text-[#71717A] flex items-center justify-center gap-1.5 font-normal">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C2410C]" />
          <span>Strictly Public Venues · Escrow Protection · First 3 Hangouts 100% Free</span>
        </div>

      </motion.div>
    </div>
  );
}
