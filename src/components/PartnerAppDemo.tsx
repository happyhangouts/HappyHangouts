import React, { useState } from "react";
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  QrCode, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Bell, 
  PlusCircle, 
  ChevronRight, 
  MapPin, 
  Coffee, 
  Radio, 
  Key,
  Check,
  X,
  UserCheck,
  UserX,
  RefreshCw,
  MessageSquare
} from "lucide-react";
import { audio } from "../utils/audio";
import { CharacteristicAvatar } from "./InteractiveAppDemo";

interface Guest {
  id: string;
  name: string;
  avatar: string;
  session: string;
  happyKey: string;
  verifiedTime: string;
  status: "checked_in" | "confirmed" | "arriving_soon";
  badge: string;
}

interface IncomingRequest {
  id: string;
  seekerName: string;
  avatar: string;
  topic: string;
  timeSlot: string;
  location: string;
  verifiedBadge: string;
  type: "free_trust" | "paid_hourly";
  rateText: string;
  status: "pending" | "accepted" | "rejected";
  receivedAgo: string;
}

export default function PartnerAppDemo() {
  const [activeTab, setActiveTab] = useState<"requests" | "live" | "slots" | "payouts" | "announce">("requests");
  const [keyInput, setKeyInput] = useState("");
  const [keyStatus, setKeyStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [announcedMsg, setAnnouncedMsg] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Incoming Hangout Requests State
  const [requests, setRequests] = useState<IncomingRequest[]>([
    {
      id: "req-1",
      seekerName: "Aarav Mehta",
      avatar: "dl-l1",
      topic: "1-on-1 Coffee & Startup Chat",
      timeSlot: "Today @ 4:30 PM",
      location: "Blue Tokai, CP (Delhi)",
      verifiedBadge: "Aadhaar + Selfie Verified",
      type: "free_trust",
      rateText: "First 3 Free Hangout (#1)",
      status: "pending",
      receivedAgo: "4 mins ago"
    },
    {
      id: "req-2",
      seekerName: "Ananya Deshmukh",
      avatar: "gr-t1",
      topic: "Acoustic Jam Session",
      timeSlot: "Tomorrow @ 6:00 PM",
      location: "CyberHub, Gurgaon",
      verifiedBadge: "Govt ID Verified",
      type: "paid_hourly",
      rateText: "₹500 / hour",
      status: "pending",
      receivedAgo: "18 mins ago"
    },
    {
      id: "req-3",
      seekerName: "Siddharth Rao",
      avatar: "nd-c1",
      topic: "Badminton Rally & Fitness",
      timeSlot: "Saturday @ 8:00 AM",
      location: "Siri Fort Sports Complex",
      verifiedBadge: "Biometric Vetted",
      type: "free_trust",
      rateText: "First 3 Free Hangout (#2)",
      status: "pending",
      receivedAgo: "1 hour ago"
    }
  ]);

  // Sample Live Guests Data with characteristic avatars
  const [guests, setGuests] = useState<Guest[]>([
    {
      id: "g1",
      name: "Rohan Mukherjee",
      avatar: "dl-l1",
      session: "Chess & Pour-over Sync",
      happyKey: "HH-9821",
      verifiedTime: "14:28 PM",
      status: "checked_in",
      badge: "Aadhaar + Govt ID Verified"
    },
    {
      id: "g2",
      name: "Priya Sharma",
      avatar: "gr-t1",
      session: "Acoustic Jam Session",
      happyKey: "HH-4410",
      verifiedTime: "Expected 16:00 PM",
      status: "confirmed",
      badge: "Biometric Selfie Verified"
    },
    {
      id: "g3",
      name: "Kabir Verma",
      avatar: "nd-c1",
      session: "Lodhi Photowalk Meet",
      happyKey: "HH-7723",
      verifiedTime: "Expected 17:30 PM",
      status: "arriving_soon",
      badge: "Aadhaar + Passport Verified"
    }
  ]);

  // Accept request handler
  const handleAcceptRequest = (req: IncomingRequest) => {
    audio.playConnect();
    setRequests(requests.map(r => r.id === req.id ? { ...r, status: "accepted" } : r));
    // Optionally add to guests roster
    setGuests(prev => [
      {
        id: `g-${Date.now()}`,
        name: req.seekerName,
        avatar: req.avatar,
        session: req.topic,
        happyKey: `HH-${Math.floor(1000 + Math.random() * 9000)}`,
        verifiedTime: req.timeSlot,
        status: "confirmed",
        badge: req.verifiedBadge
      },
      ...prev
    ]);
  };

  // Reject request handler
  const handleRejectRequest = (reqId: string) => {
    audio.playClick();
    setRequests(requests.map(r => r.id === reqId ? { ...r, status: "rejected" } : r));
  };

  // Reset demo requests
  const handleResetRequests = () => {
    audio.playClick();
    setRequests([
      {
        id: `req-${Date.now()}-1`,
        seekerName: "Aarav Mehta",
        avatar: "dl-l1",
        topic: "1-on-1 Coffee & Startup Chat",
        timeSlot: "Today @ 4:30 PM",
        location: "Blue Tokai, CP (Delhi)",
        verifiedBadge: "Aadhaar + Selfie Verified",
        type: "free_trust",
        rateText: "First 3 Free Hangout (#1)",
        status: "pending",
        receivedAgo: "Just Now"
      },
      {
        id: `req-${Date.now()}-2`,
        seekerName: "Ananya Deshmukh",
        avatar: "gr-t1",
        topic: "Acoustic Jam Session",
        timeSlot: "Tomorrow @ 6:00 PM",
        location: "CyberHub, Gurgaon",
        verifiedBadge: "Govt ID Verified",
        type: "paid_hourly",
        rateText: "₹500 / hour",
        status: "pending",
        receivedAgo: "5 mins ago"
      },
      {
        id: `req-${Date.now()}-3`,
        seekerName: "Siddharth Rao",
        avatar: "nd-c1",
        topic: "Badminton Rally & Fitness",
        timeSlot: "Saturday @ 8:00 AM",
        location: "Siri Fort Sports Complex",
        verifiedBadge: "Biometric Vetted",
        type: "free_trust",
        rateText: "First 3 Free Hangout (#2)",
        status: "pending",
        receivedAgo: "22 mins ago"
      }
    ]);
  };

  // Handle Happy Key verification simulation
  const handleVerifyKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    audio.playClick();
    setKeyStatus("verifying");

    setTimeout(() => {
      // Check if key exists or auto-add guest
      const existing = guests.find(g => g.happyKey.toLowerCase() === keyInput.trim().toLowerCase());
      if (existing) {
        setGuests(guests.map(g => g.id === existing.id ? { ...g, status: "checked_in", verifiedTime: "Just Now" } : g));
      } else {
        setGuests([
          {
            id: `g-${Date.now()}`,
            name: "New Guest (Verified)",
            avatar: "dl-l1",
            session: "Live Walk-in Sync",
            happyKey: keyInput.trim().toUpperCase(),
            verifiedTime: "Just Now",
            status: "checked_in",
            badge: "Biometrically Vetted ✓"
          },
          ...guests
        ]);
      }
      audio.playConnect();
      setKeyStatus("success");
      setKeyInput("");
      setTimeout(() => setKeyStatus("idle"), 3000);
    }, 800);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcedMsg.trim()) return;
    audio.playClick();
    setBroadcastSent(true);
    setTimeout(() => {
      audio.playConnect();
      setBroadcastSent(false);
      setAnnouncedMsg("");
    }, 2500);
  };

  const pendingCount = requests.filter(r => r.status === "pending").length;

  return (
    <div className="w-full bg-slate-950 border border-indigo-500/30 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl text-slate-100">
      {/* App Header Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold text-xl shadow-inner">
            <Building2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-lg text-white">Partner Host App Portal</h3>
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                LIVE PARTNER APP
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-sky-400" />
              <span>South Delhi &amp; Gurgaon • Certified Partner ID #HH-PAR-892</span>
            </p>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="flex items-center gap-3 sm:gap-6 bg-slate-950/80 p-2.5 px-4 rounded-2xl border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Requests</span>
            <span className="font-bold text-amber-300 text-sm">{pendingCount} New</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Attending</span>
            <span className="font-bold text-emerald-400 text-sm">{guests.length} Verified</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-500 block uppercase">Trust Rating</span>
            <span className="font-bold text-sky-400 text-sm">4.9 ★ (150 Pts)</span>
          </div>
        </div>
      </div>

      {/* App Navigation Bar */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => { audio.playClick(); setActiveTab("requests"); }}
          className={`py-3 px-4 border-b-2 font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "requests"
              ? "border-amber-500 text-amber-400 bg-amber-500/10"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span>Received Requests</span>
          {pendingCount > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => { audio.playClick(); setActiveTab("live"); }}
          className={`py-3 px-4 border-b-2 font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "live"
              ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Live Guest Roster</span>
        </button>

        <button
          onClick={() => { audio.playClick(); setActiveTab("slots"); }}
          className={`py-3 px-4 border-b-2 font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "slots"
              ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule Slots</span>
        </button>

        <button
          onClick={() => { audio.playClick(); setActiveTab("payouts"); }}
          className={`py-3 px-4 border-b-2 font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "payouts"
              ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Earnings &amp; Payouts</span>
        </button>

        <button
          onClick={() => { audio.playClick(); setActiveTab("announce"); }}
          className={`py-3 px-4 border-b-2 font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "announce"
              ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Broadcast</span>
        </button>
      </div>

      {/* Main Partner Dashboard Body */}
      <div className="p-4 sm:p-8 space-y-6">

        {/* TAB 0: RECEIVED REQUESTS (ACCEPT / REJECT) */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    INCOMING SEEKER REQUESTS
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Real-time Sync Active</span>
                </div>
                <h4 className="text-xl font-black font-display text-white mt-1">
                  Requests Received from Local Seekers
                </h4>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Review seeker profiles, requested time, and location. Click Accept or Reject to manage your schedule.
                </p>
              </div>

              <button
                onClick={handleResetRequests}
                className="self-start sm:self-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Reset Demo Requests</span>
              </button>
            </div>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={`bg-slate-900 border rounded-3xl p-5 space-y-4 transition-all relative overflow-hidden flex flex-col justify-between ${
                    req.status === "accepted"
                      ? "border-emerald-500/50 bg-emerald-950/20"
                      : req.status === "rejected"
                      ? "border-slate-800 opacity-60 bg-slate-950/40"
                      : "border-amber-500/30 hover:border-amber-400/60 shadow-lg shadow-amber-500/5"
                  }`}
                >
                  {/* Status Indicator Bar */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {req.receivedAgo}
                    </span>

                    {req.type === "free_trust" ? (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full">
                        ⭐ 3 FREE TRUST HANGOUT
                      </span>
                    ) : (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full">
                        💎 {req.rateText}
                      </span>
                    )}
                  </div>

                  {/* Seeker Profile Card */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-700 overflow-hidden shrink-0">
                        <CharacteristicAvatar id={req.avatar} className="w-full h-full" />
                      </div>
                      <div>
                        <h5 className="text-base font-black font-display text-white">{req.seekerName}</h5>
                        <p className="text-xs font-semibold text-indigo-300 mt-0.5">{req.topic}</p>
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-1">
                          <ShieldCheck className="w-3 h-3" />
                          {req.verifiedBadge}
                        </span>
                      </div>
                    </div>

                    {/* Time & Venue */}
                    <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="font-mono text-white font-bold">{req.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{req.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: ACCEPT / REJECT */}
                  <div className="pt-2 border-t border-slate-800/80">
                    {req.status === "pending" && (
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                        >
                          <Check className="w-4 h-4 text-white" />
                          <span>Accept</span>
                        </button>

                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="py-2.5 px-3 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {req.status === "accepted" && (
                      <div className="bg-emerald-500/20 border border-emerald-500/40 p-2.5 rounded-xl text-center space-y-1">
                        <div className="flex items-center justify-center gap-1.5 text-emerald-300 text-xs font-mono font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Request Accepted!</span>
                        </div>
                        <p className="text-[10px] text-slate-300">
                          Happy Key PIN dispatched to {req.seekerName}. Added to your live guest roster.
                        </p>
                      </div>
                    )}

                    {req.status === "rejected" && (
                      <div className="bg-slate-800/60 border border-slate-700/60 p-2.5 rounded-xl text-center flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>Request Declined</span>
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="text-[10px] text-indigo-400 underline cursor-pointer hover:text-indigo-300"
                        >
                          Undo &amp; Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 1: LIVE GUEST SCANNER & ROSTER */}
        {activeTab === "live" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Check-in Happy Key Scanner */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">SECURE CHECK-IN</span>
                  <h4 className="text-lg font-black font-display text-white">Validate Happy Key</h4>
                </div>
                <QrCode className="w-6 h-6 text-indigo-400" />
              </div>

              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Every seeker carries a biometrically generated Happy Key PIN or QR code upon booking. Type or scan to check them in.
              </p>

              <form onSubmit={handleVerifyKey} className="space-y-3">
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="Enter Key (e.g. HH-9821)"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-white placeholder-slate-500 outline-none uppercase tracking-wider"
                  />
                </div>

                <button
                  type="submit"
                  disabled={keyStatus === "verifying"}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  {keyStatus === "verifying" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Biometric Key...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Check In Seeker</span>
                    </>
                  )}
                </button>
              </form>

              {keyStatus === "success" && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Success! Biometric ID Verified &amp; Guest Checked In.</span>
                </div>
              )}

              {/* Quick instructions */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2 text-[11px] text-slate-400 font-mono">
                <div className="text-slate-200 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Zero-Fake Safety Guarantee</span>
                </div>
                <p className="leading-normal">
                  Seeker identities are auto-matched against government ID credentials. No unverified walk-ins allowed.
                </p>
              </div>
            </div>

            {/* Right: Live Roster List */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black font-display text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Attending Seekers Roster</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                  {guests.length} Total Expected Today
                </span>
              </div>

              <div className="space-y-3">
                {guests.map((g) => (
                  <div 
                    key={g.id}
                    className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-indigo-500/30 flex items-center justify-center shrink-0 overflow-hidden">
                        <CharacteristicAvatar id={g.avatar || g.id} className="w-full h-full" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-white font-display">{g.name}</h5>
                          <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                            {g.happyKey}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">{g.session}</p>
                        <p className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>{g.badge}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60">
                      {g.status === "checked_in" ? (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          Checked In
                        </span>
                      ) : (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          Confirmed
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-500 mt-1">{g.verifiedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SLOT & TABLE MANAGER */}
        {activeTab === "slots" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">HOST &amp; COMPANION SLOTS</span>
                <h4 className="text-xl font-black font-display text-white">Active Partner Session Slots</h4>
                <p className="text-xs text-slate-400 font-light mt-1">
                  Schedule your hosted sessions, peer coffee chats, or outdoor activity walks for verified Happy Hangouts seekers.
                </p>
              </div>

              <button 
                onClick={() => { audio.playClick(); alert("Creating new partner slot template!"); }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Custom Slot</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Slot 1 */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    3:00 PM - 5:00 PM (TODAY)
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <h5 className="text-sm font-bold text-white font-display">Chess &amp; Pour-over Table #4</h5>
                <p className="text-xs text-slate-400 font-sans">2/4 Seekers Booked • Quiet Corner Reserved</p>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-indigo-400 font-bold">Min Spend: ₹300/person</span>
                  <span className="text-slate-500">Status: OPEN</span>
                </div>
              </div>

              {/* Slot 2 */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-500/10 border border-sky-500/30 px-2.5 py-0.5 rounded-full">
                    5:30 PM - 7:30 PM (TODAY)
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <h5 className="text-sm font-bold text-white font-display">Acoustic Jam Lounge</h5>
                <p className="text-xs text-slate-400 font-sans">4/4 Full (Waitlist 2) • Sound System Ready</p>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-indigo-400 font-bold">Host Earnings: ₹1,200</span>
                  <span className="text-emerald-400 font-bold">FULL ✓</span>
                </div>
              </div>

              {/* Slot 3 */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                    8:00 PM - 10:00 PM (TOMORROW)
                  </span>
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                </div>
                <h5 className="text-sm font-bold text-white font-display">Co-Founders Espresso Sync</h5>
                <p className="text-xs text-slate-400 font-sans">1/4 Booked • High-speed WiFi &amp; Power Plugs</p>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-indigo-400 font-bold">Min Spend: ₹400/person</span>
                  <span className="text-slate-500">SCHEDULING</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: PAYOUTS & REVENUE */}
        {activeTab === "payouts" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">INSTANT PAYOUTS</span>
              <h4 className="text-xl font-black font-display text-white">Partner Revenue &amp; Settlement</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase block">Weekly Host Earnings</span>
                <p className="text-2xl font-black text-emerald-400">₹34,800</p>
                <span className="text-[10px] text-slate-500 block">Payout auto-deposited every Monday</span>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase block">Total Verified Seekers</span>
                <p className="text-2xl font-black text-sky-400">142 Seekers</p>
                <span className="text-[10px] text-slate-500 block">100% ID-Verified Connections</span>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase block">Partner Rating</span>
                <p className="text-2xl font-black text-amber-300">4.96 / 5.0 ★</p>
                <span className="text-[10px] text-slate-500 block">Top 5% Partner Host in Delhi NCR</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HOST BROADCAST ANNOUNCEMENT */}
        {activeTab === "announce" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">SEEKER BROADCAST</span>
              <h4 className="text-xl font-black font-display text-white">Send Announcement to Attending Seekers</h4>
              <p className="text-xs text-slate-400 font-light mt-1">
                Welcome incoming seekers, share special offers (e.g. 15% off artisanal pastries), or notify them of reserved seating locations.
              </p>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4 max-w-2xl">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-2">Broadcast Message:</label>
                <textarea
                  rows={3}
                  value={announcedMsg}
                  onChange={(e) => setAnnouncedMsg(e.target.value)}
                  placeholder="e.g. Hi Seekers! Table #4 in the quiet patio is reserved for your Chess & Pour-over session. Enjoy a complimentary cookie on us!"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 outline-none font-sans leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={broadcastSent}
                className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <Radio className="w-4 h-4 text-indigo-300" />
                <span>{broadcastSent ? "Sending Announcement..." : "Broadcast to Attending Seekers"}</span>
              </button>

              {broadcastSent && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Announcement pushed to all attending seekers' WhatsApp &amp; App Inboxes!</span>
                </div>
              )}
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
