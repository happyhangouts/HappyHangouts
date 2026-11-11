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
  Sparkles, 
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

    // Play initial radar sonar ping
    audio.playBlip(620);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoCancel();
          return 0;
        }

        // Add periodic realistic timeline updates
        if (prev === 295) {
          setTimelineEvents((t) => [...t, `Host device received notification (${companion.location})`]);
          audio.playBlip(580);
        } else if (prev === 280) {
          setTimelineEvents((t) => [...t, "Host is reviewing the meetup location and time slot..."]);
        } else if (prev === 240) {
          setTimelineEvents((t) => [...t, "4 minutes remaining for host action"]);
        } else if (prev === 120) {
          setTimelineEvents((t) => [...t, "⚠️ 2 minutes remaining before automatic cancellation"]);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  // Auto-cancel handler when 5 minutes expire
  const handleAutoCancel = () => {
    setStatus("expired");
    audio.playToggle();
    setTimelineEvents((t) => [
      ...t,
      `⏰ 5:00 minutes elapsed without host response. Request automatically cancelled.`
    ]);
  };

  // Host Confirms Action
  const handleHostConfirm = () => {
    audio.playSuccess();
    setStatus("confirmed");
    setTimelineEvents((t) => [
      ...t,
      `🎉 ${companion.name} CONFIRMED the meetup! Escrow lock armed at ₹0.`
    ]);
    if (triggerBoom) {
      triggerBoom(`Confirmed! ${companion.name} accepted your hangout request! 🎉`);
    }
  };

  // Host Declines Action
  const handleHostDecline = () => {
    audio.playToggle();
    setStatus("declined");
    setTimelineEvents((t) => [
      ...t,
      `${companion.name} is currently in another session and declined this slot.`
    ]);
  };

  // Fast-Forward to 0:00 (Simulate 5-minute timeout)
  const handleSimulateTimeout = () => {
    setSecondsLeft(0);
    handleAutoCancel();
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
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="bg-white border-[3px] border-[#0b1f5c] rounded-[28px] max-w-lg w-full shadow-[10px_10px_0_#0b1f5c] overflow-hidden relative my-auto"
      >
        
        {/* Top Header Strip */}
        <div className="bg-[#f3f8ff] border-b-[2.5px] border-[#0b1f5c] p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1f4ee0] text-white flex items-center justify-center text-sm font-black shadow-xs">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0b1f5c] leading-tight">
                {status === "waiting" && "Live Partner Dispatching..."}
                {status === "confirmed" && "Meetup Confirmed! 🎉"}
                {status === "declined" && "Partner Unavailable"}
                {status === "expired" && "Request Automatically Cancelled"}
              </h3>
              <p className="text-[11px] font-bold text-[#4a5a8a]">
                Uber/Ola-Style 5-Minute Auto-Action Rule Active
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full border-[2px] border-[#0b1f5c] hover:bg-slate-200 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4 text-[#0b1f5c]" />
          </button>
        </div>

        {/* Uber/Ola Concept Explainer Banner */}
        <div className="bg-[#0b1f5c] text-white px-4 py-2 flex items-center justify-between text-xs font-bold gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🚕</span>
            <span className="text-[11px] text-white/90">
              Partner has <strong>5:00 mins</strong> to confirm or reject. If no response, system auto-cancels with <strong>₹0 charge</strong>.
            </span>
          </div>
          <span className="text-[9px] bg-white/20 text-white uppercase px-2 py-0.5 rounded-full font-mono shrink-0">
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
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping pointer-events-none"></div>
                  <div className="absolute -inset-3 rounded-full border border-blue-500/20 animate-pulse pointer-events-none"></div>

                  {/* SVG Circular Progress */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="text-slate-100"
                      strokeWidth="7"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className={`${
                        secondsLeft > 120 
                          ? "text-[#1f4ee0]" 
                          : secondsLeft > 60 
                          ? "text-amber-500" 
                          : "text-rose-600"
                      } transition-all duration-1000`}
                      strokeWidth="7"
                      strokeDasharray={264}
                      strokeDashoffset={264 - (264 * progressPercent) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>

                  {/* Center Time Remaining */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-mono text-3xl font-black text-[#0b1f5c] tracking-tight">
                      {formatTime(secondsLeft)}
                    </span>
                    <span className="text-[10px] font-bold text-[#4a5a8a] uppercase tracking-wider">
                      Host Timeout
                    </span>
                  </div>
                </div>

                <p className="text-xs font-bold text-[#0b1f5c] mt-2 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Awaiting action from {companion.name}...</span>
                </p>
              </div>

              {/* Companion Target Card */}
              <div className="bg-[#f3f8ff] border-[2px] border-[#0b1f5c] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-[3px_3px_0_#0b1f5c]">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full border-[2px] border-[#0b1f5c] flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: companion.bgColor }}
                  >
                    {companion.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-black text-[#0b1f5c] truncate">{companion.name}</p>
                      <span className="text-[10px] font-extrabold bg-[#ffc933] text-[#0b1f5c] px-1.5 py-0.2 rounded border border-[#0b1f5c]">
                        ★ {companion.rating}
                      </span>
                    </div>
                    <p className="text-xs text-[#4a5a8a] font-medium truncate">
                      {companion.categoryLabel} · {meetingLocation}
                    </p>
                    <p className="text-[10px] text-[#1f4ee0] font-bold">
                      {meetingDate} · {meetingTime}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300 block">
                    ₹0 Free Pass
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    ₹{companion.rate}/hr
                  </span>
                </div>
              </div>

              {/* Live Dispatch Log / Timeline */}
              <div className="bg-slate-50 border border-[#0b1f5c]/20 rounded-xl p-3 space-y-1.5 max-h-24 overflow-y-auto">
                <span className="text-[10px] font-black uppercase text-[#4a5a8a] block">
                  Live Dispatch Stream:
                </span>
                {timelineEvents.map((ev, i) => (
                  <p key={i} className="text-[11px] text-[#0b1f5c] font-medium leading-tight flex items-start gap-1.5">
                    <span className="text-[#1f4ee0] font-bold">›</span>
                    <span>{ev}</span>
                  </p>
                ))}
              </div>

              {/* DEMO SIMULATION CONTROLS (So user can test all 3 states right now!) */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Simulate Host Actions (Demo Testing):
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-xs font-black">
                  <button
                    type="button"
                    onClick={handleHostConfirm}
                    className="py-1.5 px-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg cursor-pointer transition-colors text-center text-[11px]"
                  >
                    ✓ Partner Confirms
                  </button>

                  <button
                    type="button"
                    onClick={handleHostDecline}
                    className="py-1.5 px-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg cursor-pointer transition-colors text-center text-[11px]"
                  >
                    ✕ Partner Declines
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateTimeout}
                    className="py-1.5 px-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg cursor-pointer transition-colors text-center text-[11px]"
                  >
                    ⏰ Timeout 5:00
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
                  className="w-full py-2.5 bg-white hover:bg-slate-100 border-[2px] border-[#0b1f5c] text-[#0b1f5c] rounded-xl text-xs font-black cursor-pointer transition-colors"
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
                <div className="w-16 h-16 bg-emerald-100 border-[2.5px] border-[#0b1f5c] text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-[3px_3px_0_#0b1f5c]">
                  🎉
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                  Accepted within 5-Minute Window
                </span>
                <h4 className="text-2xl font-black text-[#0b1f5c] mt-2 mb-1">
                  Meetup Locked with {companion.name}!
                </h4>
                <p className="text-xs text-[#4a5a8a] max-w-sm mx-auto">
                  {companion.name} confirmed your session at <strong>{meetingLocation}</strong> for <strong>{meetingDate} ({meetingTime})</strong>.
                </p>
              </div>

              {/* Free Launch Pass Summary Box */}
              <div className="bg-emerald-50 border-[2px] border-emerald-600 rounded-2xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-black text-emerald-950 mb-1">
                  <span>🎁 First 3 Hangouts Free Benefit:</span>
                  <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                    ₹0 Charged (100% Free)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-900 font-medium">
                  <span>Companion Regular Fee:</span>
                  <span className="line-through text-slate-500 font-bold">₹{companion.rate}/hr</span>
                </div>
                <div className="flex items-center justify-between text-sm font-black text-emerald-950 pt-1 border-t border-emerald-200 mt-1">
                  <span>Your Total Cost:</span>
                  <span className="text-base text-emerald-700 font-black">₹0 Free Launch Credit</span>
                </div>
              </div>

              {/* Direct Actions: Open WhatsApp & Google Maps Directions */}
              <div className="space-y-2 pt-1">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => audio.playClick()}
                  className="btn b w-full py-3.5 text-sm shadow-[3px_3px_0_#0b1f5c] flex items-center justify-center gap-2"
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
                  className="w-full py-2.5 bg-white hover:bg-slate-100 border-[2px] border-[#0b1f5c] rounded-xl text-xs font-black text-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#1f4ee0]" />
                  <span>Get Directions to {meetingLocation} in Google Maps</span>
                </a>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-bold text-[#4a5a8a] hover:underline cursor-pointer"
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
                <div className="w-16 h-16 bg-amber-100 border-[2.5px] border-[#0b1f5c] text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-[3px_3px_0_#0b1f5c]">
                  ⏰
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
                  5:00 Minute Window Elapsed
                </span>
                <h4 className="text-2xl font-black text-[#0b1f5c] mt-2 mb-1">
                  Request Cancelled Automatically
                </h4>
                <p className="text-xs text-[#4a5a8a] max-w-sm mx-auto leading-relaxed">
                  Just like Uber/Ola, when a host doesn't respond within 5 minutes, we cancel the request automatically so you aren't kept waiting.
                </p>
              </div>

              {/* Zero-Penalty Guarantee Box */}
              <div className="bg-[#f3f8ff] border-[2px] border-[#0b1f5c] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-1 text-xs font-black text-[#0b1f5c]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero Fees Deducted · 100% Free Credits Intact</span>
                </div>
                <p className="text-[11px] text-[#4a5a8a] leading-relaxed">
                  Your "First 3 Hangouts Free" launch credit was not used and remains 100% available. You can re-ping {companion.name} or match with another active companion nearby.
                </p>
              </div>

              {/* Action Buttons: Retry or Match Another */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="btn b w-full py-3 text-sm shadow-[3px_3px_0_#0b1f5c] flex items-center justify-center gap-2 cursor-pointer"
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
                  className="w-full py-2.5 bg-white hover:bg-slate-100 border-[2px] border-[#0b1f5c] rounded-xl text-xs font-black text-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#1f4ee0]" />
                  <span>Match with Another Verified Companion Nearby</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. DECLINED VIEW (Host Busy / in another session) */}
          {status === "declined" && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 border-[2.5px] border-[#0b1f5c] text-rose-700 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-[3px_3px_0_#0b1f5c]">
                  ⚠️
                </div>
                <h4 className="text-2xl font-black text-[#0b1f5c] mb-1">
                  {companion.name} is Busy
                </h4>
                <p className="text-xs text-[#4a5a8a] max-w-sm mx-auto leading-relaxed">
                  {companion.name} is currently in another session or has a scheduling conflict for {meetingDate} ({meetingTime}).
                </p>
              </div>

              <div className="bg-[#f3f8ff] border-[2px] border-[#0b1f5c] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-1 text-xs font-black text-[#0b1f5c]">
                  <Sparkles className="w-4 h-4 text-[#1f4ee0]" />
                  <span>Try Nearby Companions with ₹0 Free Pass:</span>
                </div>
                <p className="text-[11px] text-[#4a5a8a] leading-relaxed">
                  We have other verified activity partners available right now in Gurugram and Delhi for badminton, coffee, or photowalks.
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
                  className="btn b w-full py-3 text-sm shadow-[3px_3px_0_#0b1f5c] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Choose Another Companion</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 border-[2px] border-[#0b1f5c] rounded-xl text-xs font-black text-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Safety Guarantee Footer Note */}
        <div className="bg-slate-50 border-t border-[#0b1f5c]/20 p-3 text-center text-[10px] font-bold text-[#4a5a8a] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Strictly Public Venues · Escrow Protection · First 3 Hangouts 100% Free</span>
        </div>

      </motion.div>
    </div>
  );
}
