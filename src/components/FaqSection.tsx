import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ShieldCheck,
  Lock,
  CreditCard,
  RotateCcw,
  CheckCircle2,
  Search,
  HelpCircle,
  Sparkles,
  Users
} from "lucide-react";
import { audio } from "../utils/audio";

export type FaqCategory = "security" | "payment" | "cancellation";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  categoryLabel: string;
  icon: React.ElementType;
  question: string;
  answer: string;
  highlights: string[];
}

const FAQ_DATA: FaqItem[] = [
  // 1. SECURITY & PRIVACY
  {
    id: "sec-id-verification",
    category: "security",
    categoryLabel: "Security & Privacy",
    icon: ShieldCheck,
    question: "How are experience hosts, captains, and attendees verified?",
    answer:
      "Every local captain and community member passes Government ID verification (Aadhaar/PAN) along with a live selfie match before hosting or joining any session. Experiences only run at screened public daylight or floodlit venues across Gurugram and Delhi.",
    highlights: [
      "Govt ID (Aadhaar/PAN) verified",
      "Public parks, courts & cafés only",
      "1-tap Emergency SOS support"
    ]
  },
  {
    id: "sec-women-only",
    category: "security",
    categoryLabel: "Security & Privacy",
    icon: Users,
    question: "How does the Women-Only booking option work?",
    answer:
      "You can switch on the 'Women-Only Booking' toggle directly inside the experience lineup or booking modal. When selected, your booking is strictly routed to a verified Woman Captain and an all-women cohort at safe, bustling public hubs like Lodhi Garden, Khan Market, 32nd Avenue, or Sunder Nursery.",
    highlights: [
      "Verified Woman Captain assigned",
      "100% female-only participant cohort",
      "Available across all 5 experiences"
    ]
  },
  {
    id: "sec-data-privacy",
    category: "security",
    categoryLabel: "Security & Privacy",
    icon: Lock,
    question: "Are my personal photos, phone number, and details kept private?",
    answer:
      "Yes. Your phone number and email are never publicly visible on any card or directory. We lead with experiences, schedules, and venues—not personal profiles. Host captain details and WhatsApp check-in coordination are shared privately only after your spot is confirmed.",
    highlights: [
      "No public profile or number exposure",
      "Experience-first matching",
      "Captain details unlock post-confirm"
    ]
  },

  // 2. PAYMENT & PRICING
  {
    id: "pay-free-launch",
    category: "payment",
    categoryLabel: "Payment",
    icon: Sparkles,
    question: "Are my first 3 hangouts really 100% free?",
    answer:
      "Yes! Under our Launch Offer, your first 3 curated experiences carry a ₹0 booking and platform fee so you can build genuine trust first-hand before paying a rupee. Note that personal café orders (coffee/snacks) or shared court rentals at public venues remain pay-as-you-go.",
    highlights: [
      "First 3 experiences at ₹0 fee",
      "No hidden subscription lock-in",
      "Pay personal café bills directly"
    ]
  },
  {
    id: "pay-escrow-flow",
    category: "payment",
    categoryLabel: "Payment",
    icon: CreditCard,
    question: "How do payments work after my 3 free experiences?",
    answer:
      "From your 4th experience onward, standard session fees (typically ₹250–₹600 depending on activity and venue) are paid seamlessly via UPI or cards. Funds are held safely in digital escrow and only released after both sides check in at the public venue.",
    highlights: [
      "UPI & card digital escrow protection",
      "Transparent ₹250–₹600 session pricing",
      "No awkward cash handoffs"
    ]
  },
  {
    id: "pay-pending-window",
    category: "payment",
    categoryLabel: "Payment",
    icon: Lock,
    question: "Am I charged if a booking isn't confirmed within the 5-minute window?",
    answer:
      "Never. During the 5-minute confirmation countdown, ₹0 is settled to any host. If the slot fills up or isn't confirmed within 5 minutes, the request auto-expires immediately with ₹0 charged.",
    highlights: [
      "Zero charge until spot is confirmed",
      "Automatic 5-minute expiry",
      "Switch to another slot instantly"
    ]
  },

  // 3. CANCELLATION & REFUND
  {
    id: "cancel-user-policy",
    category: "cancellation",
    categoryLabel: "Cancellation & Refund",
    icon: RotateCcw,
    question: "What is your Cancellation & Refund policy if my plans change?",
    answer:
      "Cancel at least 4 hours before the experience start time to receive a 100% instant refund to your original UPI ID or card—no deductions. If something comes up within 4 hours of start time, you get 1 free reschedule to any upcoming weekly slot.",
    highlights: [
      "100% refund if cancelled 4+ hrs prior",
      "Instant automated UPI/card reversal",
      "1 free reschedule under 4 hours"
    ]
  },
  {
    id: "cancel-host-noshow",
    category: "cancellation",
    categoryLabel: "Cancellation & Refund",
    icon: ShieldCheck,
    question: "What happens if a captain cancels or the experience doesn't run?",
    answer:
      "We enforce a strict zero-ghosting policy. If a captain cancels, weather disrupts an outdoor run/hike, or a venue closes unexpectedly, you receive an immediate 100% full refund plus a complimentary priority spot for your next session.",
    highlights: [
      "100% instant refund on host cancel",
      "Weather & venue disruption coverage",
      "Complimentary priority rebooking"
    ]
  },
  {
    id: "cancel-refund-timeline",
    category: "cancellation",
    categoryLabel: "Cancellation & Refund",
    icon: CreditCard,
    question: "How fast do refunds reflect in my bank account or UPI app?",
    answer:
      "UPI refunds are triggered immediately upon cancellation and typically settle within 15–30 minutes (maximum 24 hours). Card refunds process within 3–5 business days depending on your issuing bank, with real-time confirmation sent via WhatsApp and email.",
    highlights: [
      "UPI refunds settle in mins (max 24h)",
      "Cards settle in 3–5 business days",
      "Instant WhatsApp refund receipt"
    ]
  }
];

interface FaqSectionProps {
  onJoinWaitlist?: () => void;
}

export default function FaqSection({ onJoinWaitlist }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>("sec-id-verification");
  const [activeCategory, setActiveCategory] = useState<"all" | FaqCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAccordion = (id: string) => {
    audio.playClick();
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.categoryLabel.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white border-t border-b border-[#0A2EB8]/15 relative overflow-hidden text-left">
      <div className="wrap max-w-5xl relative z-10 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="text-left sm:text-center space-y-2.5 max-w-2xl sm:mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-bold text-[#0A2EB8] bg-[#F3F7FF] border border-[#0A2EB8]/15 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-[#19C37D]" />
            FAQ · Trust & Transparency
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B1230] tracking-tight">
            Security, Payment & Refund FAQs
          </h2>
          <p className="text-[#0B1230]/75 text-sm sm:text-base font-normal leading-relaxed">
            Clear answers on ID verification, Women-Only booking privacy, ₹0 launch payments, and instant cancellations.
          </p>
        </div>

        {/* Category Filter Tabs + Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#F3F7FF] p-3 rounded-2xl border border-[#0A2EB8]/15">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: "all", label: `All (${FAQ_DATA.length})` },
              { id: "security", label: "🔒 Security & Privacy" },
              { id: "payment", label: "💳 Payment" },
              { id: "cancellation", label: "↩️ Cancellation & Refund" }
            ].map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    setActiveCategory(tab.id as "all" | FaqCategory);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer min-h-[38px] ${
                    isActive
                      ? "bg-[#0A2EB8] text-white shadow-sm"
                      : "bg-white text-[#0B1230] border border-[#0A2EB8]/15 hover:border-[#0A2EB8]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <input
              type="text"
              placeholder="Search security, refund, UPI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#0A2EB8]/20 rounded-xl focus:outline-none focus:border-[#0A2EB8] text-[#0B1230] placeholder:text-[#0B1230]/45 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-[#0A2EB8]/60 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Accordion Questions */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-[#F3F7FF] rounded-3xl border border-[#0A2EB8]/15 space-y-3">
              <HelpCircle className="w-8 h-8 text-[#0A2EB8]/40 mx-auto" />
              <p className="text-sm font-semibold text-[#0B1230]">No matching questions found</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="text-xs font-bold text-[#0A2EB8] hover:underline cursor-pointer"
              >
                Show all FAQs
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              const IconComp = faq.icon;

              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-[#0A2EB8] shadow-md ring-1 ring-[#0A2EB8]/15"
                      : "border-[#0A2EB8]/15 hover:border-[#3DAAFC]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 cursor-pointer focus:outline-none select-none"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl border shrink-0 transition-colors ${
                          isOpen
                            ? "bg-[#0A2EB8] text-white border-[#0A2EB8]"
                            : "bg-[#F3F7FF] text-[#0A2EB8] border-[#0A2EB8]/15"
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F3F7FF] text-[#0A2EB8] border border-[#0A2EB8]/15">
                          {faq.categoryLabel}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-[#0B1230] leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`p-2 rounded-full border transition-transform duration-200 shrink-0 mt-0.5 ${
                        isOpen
                          ? "bg-[#FFC83D] text-[#0B1230] border-[#FFC83D] rotate-180"
                          : "bg-[#F3F7FF] text-[#0A2EB8] border-[#0A2EB8]/15"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                      >
                        <div className="px-4 sm:px-5 pb-5 pt-0 border-t border-[#F3F7FF] text-xs sm:text-sm text-[#0B1230]/80 leading-relaxed space-y-3.5">
                          <p className="pt-3.5">{faq.answer}</p>

                          <div className="bg-[#F3F7FF] p-3 sm:p-3.5 rounded-xl border border-[#0A2EB8]/10">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A2EB8] block mb-2">
                              Guarantee Highlights
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {faq.highlights.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-[#0B1230] font-semibold text-xs">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#19C37D] shrink-0" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Help Banner */}
        <div className="p-5 sm:p-7 bg-[#011C92] text-white rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3DAAFC]">
              Still have a question?
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Try your first 3 NCR experiences with ₹0 risk.
            </h4>
            <p className="text-white/75 text-xs sm:text-sm max-w-lg">
              Choose Open or Women-Only booking across Gurugram & Delhi with verified hosts and instant cancellation protection.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href="#match"
              onClick={() => audio.playClick()}
              className="flex-1 sm:flex-none text-center bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-extrabold text-xs sm:text-sm py-3 px-5 rounded-full shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Explore Experiences →
            </a>
            {onJoinWaitlist && (
              <button
                type="button"
                onClick={() => {
                  audio.playClick();
                  onJoinWaitlist();
                }}
                className="flex-1 sm:flex-none text-center bg-white/10 hover:bg-white hover:text-[#011C92] text-white border border-white/30 font-bold text-xs sm:text-sm py-3 px-5 rounded-full transition-all cursor-pointer"
              >
                Get Hangout Pass
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
