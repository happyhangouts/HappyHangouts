import React from "react";
import {
  X,
  ShieldCheck,
  MessageCircle,
  Bell,
  UserCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Calendar
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
  durationPrice?: number;
  durationLabel?: string;
  bookingId?: string | null;
  happyKeyPin?: string | null;
  isFirstFree?: boolean;
  womenOnly?: boolean;
  isAlreadyUnlocked?: boolean;
  seekerName?: string;
  seekerPhone?: string;
  onPartnerAccepted?: (companionId: string) => void;
  onClose: () => void;
  onMatchAnother?: () => void;
  triggerBoom?: (msg?: string) => void;
}

export default function HangoutRequestDispatcher({
  companion,
  meetingLocation,
  meetingDate,
  meetingTime,
  durationPrice = 199,
  durationLabel = "1 hr",
  bookingId = null,
  happyKeyPin = null,
  womenOnly = false,
  seekerName = "Member",
  seekerPhone = "",
  onClose,
  onMatchAnother
}: HangoutRequestDispatcherProps) {
  const activePartnerName = womenOnly ? companion.womenCaptainName : companion.name;
  const bookingModeTag = womenOnly
    ? " [WOMEN-ONLY PREFERENCE — Female Hangout Partner]"
    : "";

  const waMessage =
    `Hi Happy Hangouts Team! Manual Hire Request (${bookingId || "New"}):\n` +
    `• Member: ${seekerName}${seekerPhone ? ` (+91 ${seekerPhone})` : ""}\n` +
    `• Wants to Hire: ${activePartnerName}${bookingModeTag}\n` +
    `• Activity: ${companion.experienceTitle} (${companion.categoryLabel})\n` +
    `• Time Period: ${meetingDate} (${meetingTime}) · ${durationLabel}\n` +
    `• Location: ${meetingLocation}\n` +
    `• Price: ₹${durationPrice}\n` +
    `Please confirm availability manually.`;

  const waUrl = `https://wa.me/917217813236?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1230]/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="bg-white border border-[#0B1230]/15 rounded-3xl max-w-lg w-full shadow-2xl overflow-y-auto max-h-[92vh] relative my-auto text-[#0B1230]"
      >
        {/* Top Header */}
        <div className="bg-[#011C92] text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#FFC83D] text-[#0B1230] flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFC83D] block">
                Manual-First Coordination
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight truncate">
                Hire Request Notification Sent
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors cursor-pointer text-white shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Team Notified Confirmation Banner */}
          <div className="bg-[#19C37D]/10 border border-[#19C37D]/40 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#19C37D] shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-[#0B1230]">
              <p className="font-bold text-sm text-[#0B1230] mb-1">
                Notification dispatched to +91 72178 13236 &amp; happyhangouts.life@gmail.com
              </p>
              <p>
                <strong>{seekerName}</strong> wants to hire{" "}
                <strong>{activePartnerName}</strong> for{" "}
                <strong>{companion.experienceTitle}</strong> ({durationLabel} · ₹
                {durationPrice}) on{" "}
                <strong>
                  {meetingDate} · {meetingTime}
                </strong>{" "}
                at <strong>{meetingLocation}</strong>.
              </p>
            </div>
          </div>

          {/* Structured Request Details */}
          <div className="bg-[#F8FAFC] border border-[#0B1230]/10 rounded-2xl p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#0B1230]/8">
              <span className="text-[#475569] font-medium">Requested Activity</span>
              <span className="font-bold text-[#0B1230] text-right">
                {companion.experienceTitle}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#475569] font-medium">Hangout Partner</span>
              <span className="font-bold text-[#0A2EB8] text-right">
                {activePartnerName}
                {womenOnly ? " (Women-Only)" : ""}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#475569] font-medium inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#0A2EB8]" />
                Time Period
              </span>
              <span className="font-semibold text-[#0B1230] text-right">
                {meetingDate} · {meetingTime}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#475569] font-medium inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0A2EB8]" />
                Duration &amp; Rate
              </span>
              <span className="font-bold text-[#0B1230] tabular-nums">
                {durationLabel} · ₹{durationPrice}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[#475569] font-medium inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0A2EB8]" />
                Location
              </span>
              <span className="font-semibold text-[#0B1230] text-right">
                {meetingLocation}
              </span>
            </div>

            {happyKeyPin && (
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#0B1230]/8">
                <span className="text-[#475569] font-medium">Check-In PIN</span>
                <span className="font-mono font-bold text-[#0A2EB8] tabular-nums">
                  {happyKeyPin}
                </span>
              </div>
            )}
          </div>

          {/* Manual Coordination Steps */}
          <div className="space-y-2 text-xs text-[#475569] bg-white border border-[#0B1230]/10 rounded-2xl p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A2EB8] block">
              How Manual Confirmation Works
            </span>
            <p>
              1. Our team receives your hire request and checks availability directly from Hangout Partner{" "}
              <strong className="text-[#0B1230]">{activePartnerName}</strong> for {meetingTime}.
            </p>
            <p>
              2. Once the Hangout Partner confirms availability, our team manually sends confirmation to you ({seekerName}) on WhatsApp (+91 72178 13236) and activates your check-in spot.
            </p>
            <p>
              3. Note: Requests require 2+ hours notice, and you can&apos;t cancel in the last hour.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-1">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audio.playClick()}
              className="w-full py-3.5 px-5 rounded-full bg-[#FFC83D] hover:bg-[#f5bc2c] text-[#0B1230] font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Notify Official Number on WhatsApp (+91 72178 13236)</span>
            </a>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  onClose();
                  if (onMatchAnother) onMatchAnother();
                }}
                className="py-2.5 px-4 rounded-full border border-[#0B1230]/15 hover:border-[#0A2EB8] text-xs font-semibold text-[#0B1230] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#0A2EB8]" />
                <span>Browse More</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  onClose();
                }}
                className="py-2.5 px-4 rounded-full border border-[#0B1230]/15 hover:border-[#0A2EB8] text-xs font-semibold text-[#0B1230] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>

        {/* Safety Footer */}
        <div className="bg-[#F8FAFC] border-t border-[#0B1230]/8 p-3 text-center text-[11px] text-[#475569] flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#19C37D] shrink-0" />
          <span>Public Venues Only · Manual Team Confirmation · ₹99 / ₹199 / ₹449</span>
        </div>
      </motion.div>
    </div>
  );
}
