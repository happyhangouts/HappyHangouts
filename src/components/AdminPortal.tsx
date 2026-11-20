import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Download,
  Lock,
  Search,
  ShieldCheck,
  Users,
  X,
  IndianRupee,
  Calendar,
  AlertCircle,
  Ban,
  Bell,
  MessageCircle,
} from "lucide-react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ADMIN_EMAIL,
  OperationType,
  db,
  handleFirestoreError,
} from "../lib/firebase";
import { UserProfile, useAuth } from "../contexts/AuthContext";
import {
  BookingRecord,
  BookingStatus,
  PartnerRecord,
  updateBookingStatus,
} from "../lib/bookings";
import { audio } from "../utils/audio";

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export default function AdminPortal({
  isOpen,
  onClose,
  onOpenAuth,
}: AdminPortalProps) {
  const { firebaseUser, isAdmin, logout } = useAuth();

  const [tab, setTab] = useState<"bookings" | "partners" | "users" | "rules">("bookings");
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [durationFilter, setDurationFilter] = useState<"all" | "30m" | "1h" | "2h">("all");
  const [womenOnlyOnly, setWomenOnlyOnly] = useState(false);
  const [cityFilter, setCityFilter] = useState<"all" | "Gurugram" | "Delhi">("all");

  useEffect(() => {
    if (!isOpen || !firebaseUser || !isAdmin) return;

    const unsubBookings = onSnapshot(
      query(collection(db, "bookings"), orderBy("createdAt", "desc")),
      (snap) => {
        setBookings(snap.docs.map((d) => d.data() as BookingRecord));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "bookings")
    );

    const unsubPartners = onSnapshot(
      query(collection(db, "partners"), orderBy("createdAt", "desc")),
      (snap) => {
        setPartners(snap.docs.map((d) => d.data() as PartnerRecord));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "partners")
    );

    const unsubUsers = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc")),
      (snap) => {
        setUsers(snap.docs.map((d) => d.data() as UserProfile));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, "users")
    );

    return () => {
      unsubBookings();
      unsubPartners();
      unsubUsers();
    };
  }, [isOpen, firebaseUser, isAdmin]);

  const metrics = useMemo(() => {
    const grossRevenue = bookings
      .filter((b) => !["cancelled", "declined", "expired"].includes(b.status))
      .reduce((acc, b) => acc + (b.chargedPriceInr || 0), 0);
    const platformFee = bookings
      .filter((b) => !["cancelled", "declined", "expired"].includes(b.status))
      .reduce((acc, b) => acc + (b.platformFeeInr || 0), 0);
    const partnerPayout = bookings
      .filter((b) => !["cancelled", "declined", "expired"].includes(b.status))
      .reduce((acc, b) => acc + (b.partnerPayoutInr || 0), 0);

    const pendingBookings = bookings.filter((b) => b.status === "pending").length;
    const confirmedBookings = bookings.filter((b) =>
      ["accepted", "checked_in", "completed"].includes(b.status)
    ).length;
    const womenOnlyCount = bookings.filter((b) => b.womenOnly).length;
    const firstFreeCount = bookings.filter((b) => b.isFirstFree).length;
    const pendingKycPartners = partners.filter((p) => p.kycStatus === "pending").length;

    return {
      grossRevenue,
      platformFee,
      partnerPayout,
      pendingBookings,
      confirmedBookings,
      womenOnlyCount,
      firstFreeCount,
      pendingKycPartners,
    };
  }, [bookings, partners]);

  const filteredBookings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (durationFilter !== "all" && b.durationKey !== durationFilter) return false;
      if (womenOnlyOnly && !b.womenOnly) return false;
      if (cityFilter !== "all" && !b.venue.toLowerCase().includes(cityFilter.toLowerCase())) {
        return false;
      }
      if (!q) return true;
      return (
        b.bookingId.toLowerCase().includes(q) ||
        b.seekerName.toLowerCase().includes(q) ||
        b.seekerEmail.toLowerCase().includes(q) ||
        b.seekerPhone.toLowerCase().includes(q) ||
        b.partnerName.toLowerCase().includes(q) ||
        b.experienceTitle.toLowerCase().includes(q) ||
        b.venue.toLowerCase().includes(q) ||
        b.happyKeyPin.toLowerCase().includes(q)
      );
    });
  }, [bookings, searchTerm, statusFilter, durationFilter, womenOnlyOnly, cityFilter]);

  if (!isOpen) return null;

  const handleUpdatePartnerKyc = async (
    partnerId: string,
    kycStatus: "pending" | "verified" | "suspended",
    active: boolean
  ) => {
    audio.playClick();
    try {
      await updateDoc(doc(db, "partners", partnerId), {
        kycStatus,
        active,
        updatedAt: serverTimestamp(),
      });
      audio.playSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `partners/${partnerId}`);
    }
  };

  const handleToggleUserKyc = async (uid: string, currentVal: boolean) => {
    audio.playClick();
    try {
      await updateDoc(doc(db, "users", uid), {
        kycVerified: !currentVal,
        updatedAt: serverTimestamp(),
      });
      audio.playSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const handleToggleUserSuspended = async (uid: string, currentVal?: boolean) => {
    audio.playClick();
    try {
      await updateDoc(doc(db, "users", uid), {
        suspended: !currentVal,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const handleExportCsv = () => {
    audio.playClick();
    const headers = [
      "BookingID",
      "SeekerName",
      "SeekerPhone",
      "SeekerEmail",
      "PartnerName",
      "Experience",
      "Venue",
      "Day",
      "StartHour",
      "Duration",
      "ChargedINR",
      "PartnerPayoutINR",
      "PlatformFeeINR",
      "WomenOnly",
      "HappyKeyPIN",
      "Status",
    ];
    const rows = filteredBookings.map((b) =>
      [
        b.bookingId,
        b.seekerName,
        b.seekerPhone,
        b.seekerEmail,
        b.partnerName,
        b.experienceTitle,
        b.venue,
        b.dayLabel,
        b.startHour,
        b.durationLabel,
        b.chargedPriceInr,
        b.partnerPayoutInr,
        b.platformFeeInr,
        b.womenOnly ? "Yes" : "No",
        b.happyKeyPin,
        b.status,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `happy-hangouts-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1230]/75 backdrop-blur-xs flex flex-col overflow-hidden">
      <div className="flex-1 bg-[#F3F7FF] text-[#0B1230] flex flex-col overflow-hidden">
        {/* Top Command Header */}
        <header className="bg-white border-b border-[#0A2EB8]/15 px-4 sm:px-8 py-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#011C92] text-[#FFC83D] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#0B1230] truncate">
                Happy Hangouts Admin Console
              </h2>
              <p className="text-xs text-[#0B1230]/65 truncate">
                Alerts routed to happyhangouts.life@gmail.com &amp; +91 72178 13236 · Bookings, KYC approvals &amp; payouts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isAdmin && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#0A2EB8]/20 bg-white hover:bg-[#F3F7FF] text-xs font-bold text-[#0A2EB8] cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-[#011C92] text-white hover:bg-[#0A2EB8] text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              <span>Close Console</span>
            </button>
          </div>
        </header>

        {/* Access Guard */}
        {!firebaseUser || !isAdmin ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white border border-[#0A2EB8]/20 rounded-3xl p-7 shadow-lg text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#011C92] text-[#FFC83D] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0B1230]">
                Administrator Sign-In Required
              </h3>
              <p className="text-sm text-[#0B1230]/75 leading-relaxed">
                {!firebaseUser
                  ? `Sign in with the platform administrator Google account (${ADMIN_EMAIL}) to inspect bookings, approve Hangout Partner KYC, and manage payouts.`
                  : `Signed in as ${firebaseUser.email}. Only the verified administrator (${ADMIN_EMAIL}) can view full platform PII and payout ledgers.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                {!firebaseUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="flex-1 py-3 px-5 rounded-full bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-sm cursor-pointer"
                  >
                    Sign In as Admin
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      onClose();
                      onOpenAuth();
                    }}
                    className="flex-1 py-3 px-5 rounded-full bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-sm cursor-pointer"
                  >
                    Switch Account
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-5 rounded-full border border-[#0A2EB8]/25 text-[#0B1230] font-bold text-sm cursor-pointer"
                >
                  Return to Site
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
            {/* 4-KPI Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-5">
                <span className="text-xs font-bold text-[#0B1230]/60 block">
                  Total Bookings Tracked
                </span>
                <p className="font-serif text-3xl font-bold text-[#0B1230] mt-1 tabular-nums">
                  {bookings.length}
                </p>
                <p className="text-xs text-[#0B1230]/65 mt-1 tabular-nums">
                  {metrics.pendingBookings} pending · {metrics.confirmedBookings} confirmed ·{" "}
                  {metrics.womenOnlyCount} Women-Only
                </p>
              </div>

              <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-5">
                <span className="text-xs font-bold text-[#0B1230]/60 block">
                  Gross Volume / 20% Fee
                </span>
                <p className="font-serif text-3xl font-bold text-[#0A2EB8] mt-1 tabular-nums">
                  ₹{metrics.grossRevenue.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-[#0B1230]/65 mt-1 tabular-nums">
                  Fee: ₹{metrics.platformFee.toLocaleString("en-IN")} · 80% Partner: ₹
                  {metrics.partnerPayout.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-5">
                <span className="text-xs font-bold text-[#0B1230]/60 block">
                  Registered Members
                </span>
                <p className="font-serif text-3xl font-bold text-[#0B1230] mt-1 tabular-nums">
                  {users.length}
                </p>
                <p className="text-xs text-[#0B1230]/65 mt-1 tabular-nums">
                  {users.filter((u) => u.role === "seeker").length} seekers ·{" "}
                  {users.filter((u) => u.role === "partner").length} partner signups
                </p>
              </div>

              <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-5">
                <span className="text-xs font-bold text-[#0B1230]/60 block">
                  Hangout Partners Roster
                </span>
                <p className="font-serif text-3xl font-bold text-[#19C37D] mt-1 tabular-nums">
                  {partners.length}
                </p>
                <p className="text-xs text-[#0B1230]/65 mt-1 tabular-nums">
                  {partners.filter((p) => p.kycStatus === "verified").length} verified ·{" "}
                  {metrics.pendingKycPartners} pending KYC
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#0A2EB8]/15">
              {[
                { id: "bookings", label: `All Bookings (${bookings.length})` },
                { id: "partners", label: `Hangout Partners (${partners.length})` },
                { id: "users", label: `Members Directory (${users.length})` },
                { id: "rules", label: "Pricing & Policy Audit" },
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

            {/* TAB 1: ALL BOOKINGS */}
            {tab === "bookings" && (
              <div className="space-y-4">
                {/* Filter Bar */}
                <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-0">
                    <Search className="w-4 h-4 text-[#0B1230]/40 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search seeker, partner, venue, email, phone, or Happy Key PIN..."
                      className="w-full pl-10"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="text-xs font-semibold"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="checked_in">Checked In</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="declined">Declined</option>
                      <option value="expired">Expired</option>
                    </select>
                    <select
                      value={durationFilter}
                      onChange={(e) => setDurationFilter(e.target.value as any)}
                      className="text-xs font-semibold"
                    >
                      <option value="all">All Durations</option>
                      <option value="30m">30 min · ₹99</option>
                      <option value="1h">1 hr · ₹199</option>
                      <option value="2h">2 hrs · ₹449</option>
                    </select>
                    <select
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value as any)}
                      className="text-xs font-semibold"
                    >
                      <option value="all">All NCR Cities</option>
                      <option value="Gurugram">Gurugram</option>
                      <option value="Delhi">Delhi</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setWomenOnlyOnly((v) => !v)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer whitespace-nowrap ${
                        womenOnlyOnly
                          ? "bg-[#011C92] text-white border-[#011C92]"
                          : "bg-white text-[#0B1230] border-[#0A2EB8]/20"
                      }`}
                    >
                      Women-Only Filter
                    </button>
                  </div>
                </div>

                {/* Manual-First Hire Notification Inbox */}
                {metrics.pendingBookings > 0 && (
                  <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#0A2EB8]" />
                        <h4 className="font-serif text-base sm:text-lg font-bold text-[#0B1230]">
                          New Hire Notifications — Manual Action Required ({metrics.pendingBookings})
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-[#0A2EB8]">
                        1. Check availability from Hangout Partner → 2. Send manual confirmation to Seeker
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {bookings
                        .filter((b) => b.status === "pending")
                        .map((b) => {
                          const waBody = `Hi ${b.seekerName}, confirming your Happy Hangouts request: ${b.partnerName} for ${b.experienceTitle} (${b.durationLabel} · ₹${b.chargedPriceInr}) on ${b.dayLabel} at ${b.startHour}, Venue: ${b.venue}. Happy Key PIN: ${b.happyKeyPin}.`;
                          return (
                            <div
                              key={b.bookingId}
                              className="bg-white border border-amber-300/80 rounded-xl p-4 space-y-2.5 text-xs"
                            >
                              <p className="font-bold text-[#0B1230] leading-snug">
                                <span className="text-[#0A2EB8]">{b.seekerName}</span> (+91{" "}
                                {b.seekerPhone}) wants to hire{" "}
                                <span className="text-[#0A2EB8]">{b.partnerName}</span>
                              </p>
                              <div className="text-[11px] text-[#0B1230]/80 space-y-0.5">
                                <p>
                                  <strong>Activity:</strong> {b.experienceTitle}
                                  {b.womenOnly ? " · Women-Only" : ""}
                                </p>
                                <p>
                                  <strong>Time Period:</strong> {b.dayLabel} · {b.startHour} (
                                  {b.durationLabel} · ₹{b.chargedPriceInr})
                                </p>
                                <p>
                                  <strong>Location:</strong> {b.venue}
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => updateBookingStatus(b.bookingId, "accepted")}
                                  className="px-3 py-1.5 rounded-lg bg-[#19C37D] text-[#0B1230] font-bold cursor-pointer"
                                >
                                  Confirm Spot
                                </button>
                                <a
                                  href={`https://wa.me/91${b.seekerPhone}?text=${encodeURIComponent(waBody)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-[#FFC83D] text-[#0B1230] font-bold inline-flex items-center gap-1"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  WhatsApp Seeker
                                </a>
                                <button
                                  type="button"
                                  onClick={() => updateBookingStatus(b.bookingId, "declined")}
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-[#0B1230] font-semibold cursor-pointer"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Bookings Table */}
                <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl overflow-hidden">
                  {filteredBookings.length === 0 ? (
                    <div className="p-10 text-center text-sm text-[#0B1230]/65">
                      No booking records match the current filters yet. Whenever a visitor signs up and sends a booking request, it appears here in real time.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#F3F7FF] border-b border-[#0A2EB8]/15 text-[#0B1230]/70 font-bold">
                            <th className="py-3 px-4">Seeker</th>
                            <th className="py-3 px-4">Experience &amp; Venue</th>
                            <th className="py-3 px-4">Hangout Partner</th>
                            <th className="py-3 px-4">Slot &amp; Cutoff</th>
                            <th className="py-3 px-4">Pricing / 80-20</th>
                            <th className="py-3 px-4">Happy Key</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredBookings.map((b) => (
                            <tr
                              key={b.bookingId}
                              className="hover:bg-[#F3F7FF]/60 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <p className="font-bold text-[#0B1230]">{b.seekerName}</p>
                                <p className="text-[11px] text-[#0B1230]/65 tabular-nums">
                                  +91 {b.seekerPhone} · {b.seekerGender}
                                </p>
                              </td>
                              <td className="py-3 px-4 max-w-[220px]">
                                <p className="font-bold text-[#0B1230] truncate">
                                  {b.experienceTitle}
                                </p>
                                <p className="text-[11px] text-[#0B1230]/65 truncate">
                                  {b.venue}
                                </p>
                                {b.womenOnly && (
                                  <span className="text-[10px] font-extrabold text-[#011C92] block mt-0.5">
                                    Women-Only Cohort
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-semibold text-[#0B1230]">{b.partnerName}</p>
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-semibold text-[#0B1230]">{b.dayLabel}</p>
                                <p className="text-[11px] text-[#0B1230]/65">
                                  {b.startHour} · 2h Prior Ack
                                </p>
                              </td>
                              <td className="py-3 px-4 tabular-nums">
                                <p className="font-bold text-[#0A2EB8]">
                                  ₹{b.chargedPriceInr} · {b.durationLabel}
                                </p>
                                <p className="text-[11px] text-[#0B1230]/65">
                                  Host ₹{b.partnerPayoutInr} / Fee ₹{b.platformFeeInr}
                                </p>
                              </td>
                              <td className="py-3 px-4 font-mono font-bold text-[#0B1230] tabular-nums">
                                {b.happyKeyPin}
                              </td>
                              <td className="py-3 px-4 font-bold uppercase text-[11px]">
                                {b.status}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <select
                                    value={b.status}
                                    onChange={(e) =>
                                      updateBookingStatus(
                                        b.bookingId,
                                        e.target.value as BookingStatus
                                      )
                                    }
                                    className="text-[11px] py-1 px-2 border border-[#0A2EB8]/25 rounded-lg bg-white"
                                  >
                                    <option value="pending">pending</option>
                                    <option value="accepted">accepted</option>
                                    <option value="checked_in">checked_in</option>
                                    <option value="completed">completed</option>
                                    <option value="declined">declined</option>
                                    <option value="cancelled">cancelled</option>
                                    <option value="expired">expired</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedBooking(b)}
                                    className="px-2.5 py-1.5 rounded-lg bg-[#F3F7FF] hover:bg-[#0A2EB8] text-[#0A2EB8] hover:text-white font-bold text-[11px] cursor-pointer"
                                  >
                                    Inspect
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Selected Booking Inspector */}
                {selectedBooking && (
                  <div className="bg-white border border-[#0A2EB8]/25 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-lg font-bold text-[#0B1230]">
                        Booking Audit Detail · {selectedBooking.bookingId}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setSelectedBooking(null)}
                        className="text-xs font-bold text-[#0A2EB8] cursor-pointer"
                      >
                        Close Inspector
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="bg-[#F3F7FF] p-3.5 rounded-xl space-y-1">
                        <span className="font-bold text-[#0A2EB8] block">Seeker Details</span>
                        <p className="font-bold">{selectedBooking.seekerName}</p>
                        <p>{selectedBooking.seekerEmail}</p>
                        <p className="tabular-nums">+91 {selectedBooking.seekerPhone}</p>
                        <p>Gender: {selectedBooking.seekerGender}</p>
                      </div>
                      <div className="bg-[#F3F7FF] p-3.5 rounded-xl space-y-1">
                        <span className="font-bold text-[#0A2EB8] block">Experience &amp; Partner</span>
                        <p className="font-bold">{selectedBooking.experienceTitle}</p>
                        <p>Partner: {selectedBooking.partnerName}</p>
                        <p>Venue: {selectedBooking.venue}</p>
                        <p>
                          {selectedBooking.dayLabel} · {selectedBooking.startHour}
                        </p>
                      </div>
                      <div className="bg-[#F3F7FF] p-3.5 rounded-xl space-y-1 tabular-nums">
                        <span className="font-bold text-[#0A2EB8] block">Ledger &amp; Pin</span>
                        <p>
                          Charged: ₹{selectedBooking.chargedPriceInr} (Standard ₹
                          {selectedBooking.standardPriceInr})
                        </p>
                        <p>
                          Partner Payout: ₹{selectedBooking.partnerPayoutInr} · Platform Fee: ₹
                          {selectedBooking.platformFeeInr}
                        </p>
                        <p className="font-mono font-bold">
                          Happy Key PIN: {selectedBooking.happyKeyPin}
                        </p>
                        {selectedBooking.cancelReason && (
                          <p className="text-rose-700">
                            Cancel Reason: {selectedBooking.cancelReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: HANGOUT PARTNERS & KYC APPROVAL */}
            {tab === "partners" && (
              <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl overflow-hidden">
                {partners.length === 0 ? (
                  <div className="p-10 text-center text-sm text-[#0B1230]/65">
                    No Hangout Partner applications in Firestore yet. Users who sign up selecting the &quot;Hangout Partner&quot; role appear here for KYC approval &amp; payout tracking.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F3F7FF] border-b border-[#0A2EB8]/15 text-[#0B1230]/70 font-bold">
                          <th className="py-3 px-4">Partner Name</th>
                          <th className="py-3 px-4">City &amp; Hub</th>
                          <th className="py-3 px-4">Experience &amp; Slots</th>
                          <th className="py-3 px-4">Women-Only</th>
                          <th className="py-3 px-4">UPI ID</th>
                          <th className="py-3 px-4">KYC Status</th>
                          <th className="py-3 px-4 text-right">Admin Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {partners.map((p) => (
                          <tr key={p.partnerId} className="hover:bg-[#F3F7FF]/50">
                            <td className="py-3 px-4">
                              <p className="font-bold text-[#0B1230]">{p.displayName}</p>
                              <p className="text-[11px] text-[#0B1230]/60">
                                {p.gender} · ★ {p.rating} · {p.totalSessions} sessions
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold">{p.city}</p>
                              <p className="text-[11px] text-[#0B1230]/65">{p.hub}</p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold">{p.experienceTitle}</p>
                              <p className="text-[11px] text-[#0B1230]/65">
                                {p.availableSlots.join(" · ")}
                              </p>
                            </td>
                            <td className="py-3 px-4 font-semibold">
                              {p.womenOnlyEligible ? "Female Partner ✓" : "Open Cohort"}
                            </td>
                            <td className="py-3 px-4 font-mono">
                              {p.upiHandleMasked || "Not added"}
                            </td>
                            <td className="py-3 px-4 font-bold uppercase text-[11px]">
                              {p.kycStatus} · {p.active ? "Active" : "Offline"}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdatePartnerKyc(p.partnerId, "verified", true)
                                  }
                                  className="px-2.5 py-1.5 rounded-lg bg-[#19C37D] text-[#0B1230] font-bold text-[11px] cursor-pointer"
                                >
                                  {p.kycStatus === "verified" && p.active
                                    ? "Live ✓"
                                    : "Verify & Go Live"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdatePartnerKyc(p.partnerId, "suspended", false)
                                  }
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-rose-100 text-[#0B1230] font-bold text-[11px] cursor-pointer"
                                >
                                  Suspend
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: REGISTERED USERS & SEEKERS */}
            {tab === "users" && (
              <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl overflow-hidden">
                {users.length === 0 ? (
                  <div className="p-10 text-center text-sm text-[#0B1230]/65">
                    No member profiles recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#F3F7FF] border-b border-[#0A2EB8]/15 text-[#0B1230]/70 font-bold">
                          <th className="py-3 px-4">Member</th>
                          <th className="py-3 px-4">Phone &amp; Emergency</th>
                          <th className="py-3 px-4">City / Hub</th>
                          <th className="py-3 px-4">Govt ID Check</th>
                          <th className="py-3 px-4">KYC / Status</th>
                          <th className="py-3 px-4 text-right">Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                          <tr key={u.uid} className="hover:bg-[#F3F7FF]/50">
                            <td className="py-3 px-4">
                              <p className="font-bold text-[#0B1230]">{u.name}</p>
                              <p className="text-[11px] text-[#0B1230]/65">
                                {u.email} · {u.role} · {u.gender}
                              </p>
                            </td>
                            <td className="py-3 px-4 tabular-nums">
                              <p>+91 {u.phone}</p>
                              <p className="text-[11px] text-[#0B1230]/65">
                                SOS: +91 {u.emergencyContact}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold">{u.city}</p>
                              <p className="text-[11px] text-[#0B1230]/65">{u.preferredHub}</p>
                            </td>
                            <td className="py-3 px-4 tabular-nums">
                              {u.govtIdType} · ****{u.govtIdLast4}
                            </td>
                            <td className="py-3 px-4 font-bold text-[11px]">
                              {u.kycVerified ? "Verified & Live ✓" : "Pending Manual Check"} ·{" "}
                              {u.suspended ? "Suspended" : "Active"}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserKyc(u.uid, u.kycVerified)}
                                  className="px-2.5 py-1 rounded-lg bg-[#F3F7FF] border border-[#0A2EB8]/25 text-[#0A2EB8] font-bold cursor-pointer"
                                >
                                  {u.kycVerified ? "Unverify" : "Approve & Go Live"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleUserSuspended(u.uid, u.suspended)
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-100 text-[#0B1230] font-bold cursor-pointer"
                                >
                                  {u.suspended ? "Restore" : "Suspend"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PRICING & SAFETY RULES AUDIT */}
            {tab === "rules" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0A2EB8]">
                    <IndianRupee className="w-4 h-4" />
                    <span>Fixed Pricing &amp; 80/20 Split Rules</span>
                  </div>
                  <div className="space-y-2 text-xs tabular-nums">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span>30 Min Hangout (Affordable Starter)</span>
                      <span className="font-bold">₹99 total · ₹79 partner (80%) · ₹20 fee</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span>1 Hour Hangout (Popular)</span>
                      <span className="font-bold">₹199 total · ₹159 partner (80%) · ₹40 fee</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span>2 Hours Hangout (Extended)</span>
                      <span className="font-bold">₹449 total · ₹359 partner (80%) · ₹90 fee</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Process Mode</span>
                      <span className="font-bold text-[#0A2EB8]">Manual-first hire notification &amp; admin coordination</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#0A2EB8]/15 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0A2EB8]">
                    <Calendar className="w-4 h-4" />
                    <span>Safety &amp; Scheduling Enforcements</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#0B1230]/80 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#19C37D] shrink-0 mt-0.5" />
                      <span>
                        <strong>Minimum 2-Hour Advance Notice:</strong> Seekers must request at least 2 hours prior (e.g. by 3:00 PM for 5:00 PM start).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Cancellation Policy:</strong> You can&apos;t cancel last hour (1-hour lock prior to hangout start).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Ban className="w-4 h-4 text-[#0A2EB8] shrink-0 mt-0.5" />
                      <span>
                        <strong>Optional Women-Only Preference:</strong> Female seekers can book any partner (Standard Open) or optionally pick Women-Only (`seekerGender == &apos;female&apos;`).
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
