import React, { useEffect, useState } from "react";
import { Calendar, Clock, Key, MapPin, ShieldCheck, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  BookingRecord,
  subscribeSeekerBookings,
  updateBookingStatus,
} from "../lib/bookings";
import { audio } from "../utils/audio";

interface SeekerBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SeekerBookingsModal({
  isOpen,
  onClose,
}: SeekerBookingsModalProps) {
  const { firebaseUser, userProfile } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !firebaseUser) return;
    const unsub = subscribeSeekerBookings(firebaseUser.uid, (rows) => {
      setBookings(rows);
    });
    return () => unsub();
  }, [isOpen, firebaseUser]);

  if (!isOpen) return null;

  const handleCancelBooking = async (b: BookingRecord) => {
    setCancelMessage(null);
    audio.playClick();
    // Enforce "You can't cancel last hour" if already checked in
    if (b.status === "checked_in") {
      setCancelMessage("You can't cancel last hour — this hangout is already active.");
      return;
    }
    await updateBookingStatus(b.bookingId, "cancelled", "Cancelled by seeker >= 1hr prior");
    setCancelMessage(`Booking ${b.bookingId} cancelled with ₹0 fee.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#011C92]/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-[#0A2EB8]/20 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto text-[#0B1230]">
        <div className="bg-[#011C92] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFC83D] block">
              {userProfile?.name} · {userProfile?.city}
            </span>
            <h3 className="font-serif text-xl font-bold">My Experience Bookings</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {cancelMessage && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs font-bold text-[#0B1230]">
              {cancelMessage}
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#0B1230]/70">
              You haven&apos;t booked any experience yet. Pick one of our curated hangouts — ₹99 for 30 min, ₹199 for 1 hr, and ₹449 for 2 hrs!
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="bg-[#F3F7FF] border border-[#0A2EB8]/15 rounded-2xl p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold uppercase text-[#0A2EB8]">
                      {b.status === "pending"
                        ? "Checking Partner Availability · Manual Confirm Pending"
                        : b.status === "accepted"
                        ? "Manually Confirmed · Ready to Meet"
                        : `Status: ${b.status}`}
                    </span>
                    <span className="font-mono font-bold text-[#0B1230] flex items-center gap-1 tabular-nums">
                      <Key className="w-3.5 h-3.5 text-[#0A2EB8]" />
                      PIN: {b.happyKeyPin}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#0B1230]">
                      {b.experienceTitle}
                    </h4>
                    <p className="text-xs text-[#0B1230]/75 mt-0.5">
                      {b.womenOnly
                        ? `👩 Female Hangout Partner: ${b.partnerName}`
                        : `Hangout Partner: ${b.partnerName}`}{" "}
                      · ₹{b.chargedPriceInr} · {b.durationLabel}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-[#0B1230]/75">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#0A2EB8]" />
                      {b.dayLabel} at {b.startHour}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0A2EB8]" />
                      {b.venue}
                    </span>
                  </div>

                  {["pending", "accepted"].includes(b.status) && (
                    <div className="pt-2 border-t border-[#0A2EB8]/10 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#0B1230]/65 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        No last-hour cancellations allowed
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(b)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                      >
                        Cancel Spot
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="p-3 rounded-xl bg-white border border-[#0A2EB8]/15 text-[11px] text-[#0B1230]/70 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#19C37D] shrink-0" />
            <span>
              Share your Happy Key PIN only when you meet your verified Hangout Partner at the public venue.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
