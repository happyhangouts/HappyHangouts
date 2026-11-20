import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Search,
  HelpCircle,
  Check
} from "lucide-react";
import { audio } from "../utils/audio";

export type FaqCategory = "security" | "payment" | "cancellation";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  categoryLabel: string;
  question: string;
  answer: string;
  highlights: string[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "sec-id-verification",
    category: "security",
    categoryLabel: "Security & Privacy",
    question: "How are Hangout Seekers and Hangout Partners verified before going live?",
    answer:
      "When you apply via the Hangout Pass or Sign Up—whether as a Hangout Seeker or Hangout Partner—our team manually checks your profile and Government ID details (Aadhaar/PAN) first. Only after manual verification do we make your profile live. All meetups happen in screened public places across Gurugram and Delhi.",
    highlights: [
      "Manual profile review before going live",
      "Govt-ID checked for Seekers & Partners",
      "Public cafés, courts & parks only"
    ]
  },
  {
    id: "sec-women-only",
    category: "security",
    categoryLabel: "Security & Privacy",
    question: "Can women book any Hangout Partner, or is Women-Only mandatory?",
    answer:
      "Women can freely book any verified Hangout Partner across all experiences—booking Women-Only is completely optional. Whenever preferred, female members can toggle on Women-Only Preference to match exclusively with a Female Hangout Partner.",
    highlights: [
      "Women can book any Hangout Partner",
      "Women-Only preference is optional",
      "Female Hangout Partners available"
    ]
  },
  {
    id: "sec-data-privacy",
    category: "security",
    categoryLabel: "Security & Privacy",
    question: "Are my personal photos, phone number, and details kept private?",
    answer:
      "Yes. Phone numbers, emails, and partner photos never appear in public browsing. Happy Hangouts leads with the experience and venue; check-in coordination unlocks privately once your Hangout Partner accepts.",
    highlights: [
      "Zero public profile browsing",
      "No exposed phone numbers",
      "4-digit Happy Key check-in PIN"
    ]
  },
  {
    id: "pay-free-launch",
    category: "payment",
    categoryLabel: "Payment",
    question: "What are the hangout prices for 30 min, 1 hr, and 2 hrs?",
    answer:
      "Pricing is fixed and transparent across every Hangout Partner: ₹99 for 30 minutes, ₹199 for 1 hour, and ₹449 for 2 hours. No subscriptions or hidden platform fees. Personal café or shared court bills stay separate.",
    highlights: [
      "30 min: ₹99 · Affordable starter",
      "1 hr: ₹199 · 2 hrs: ₹449",
      "No subscriptions or hidden fees"
    ]
  },
  {
    id: "pay-advance-window",
    category: "payment",
    categoryLabel: "Payment",
    question: "How does the manual booking & confirmation process work?",
    answer:
      "Submit your hire request at least 2 hours before your hangout start time (e.g. by 3:00 PM for 5:00 PM). Once our team receives the request from the Hangout Seeker, we check availability directly with the Hangout Partner and then manually give confirmation back to the Hangout Seeker.",
    highlights: [
      "Request sent 2+ hours prior",
      "Team checks partner availability first",
      "Manual confirmation sent to Seeker"
    ]
  },
  {
    id: "cancel-user-policy",
    category: "cancellation",
    categoryLabel: "Cancellation & Refund",
    question: "Can I cancel in the last hour before my hangout?",
    answer:
      "No—cancellations are locked within 1 hour of the hangout start time to respect your Hangout Partner's schedule. Cancel more than 1 hour ahead for a full refund or free reschedule.",
    highlights: [
      "You can't cancel in the last hour",
      "Full refund if cancelled >1 hr prior",
      "100% refund if partner cancels"
    ]
  },
  {
    id: "cancel-refund-timeline",
    category: "cancellation",
    categoryLabel: "Cancellation & Refund",
    question: "How quickly are eligible refunds processed?",
    answer:
      "Eligible UPI refunds settle within 15–30 minutes (up to 24 hours max). Card refunds reflect in 3–5 business days with confirmation.",
    highlights: [
      "UPI refunds in minutes (max 24h)",
      "Cards in 3–5 business days",
      "Full partner no-show protection"
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
    <section id="faq" className="py-16 sm:py-24 bg-[#F8FAFC] border-t border-[#0B1230]/8 text-left">
      <div className="wrap max-w-4xl space-y-8">
        {/* Clean Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A2EB8]">
              Frequently Asked Questions
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#0B1230] tracking-tight">
              Security, payment &amp; refunds
            </h2>
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#0B1230]/15 rounded-xl focus:outline-none focus:border-[#0A2EB8] text-[#0B1230] placeholder:text-[#475569]/70"
            />
            <Search className="w-3.5 h-3.5 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category Filter Segmented Control */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "All Topics" },
            { id: "security", label: "Security & Privacy" },
            { id: "payment", label: "Payment & Pricing" },
            { id: "cancellation", label: "Cancellation & Refund" }
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
                className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[36px] border ${
                  isActive
                    ? "bg-[#0B1230] text-white border-[#0B1230]"
                    : "bg-white text-[#475569] border-[#0B1230]/12 hover:border-[#0A2EB8] hover:text-[#0A2EB8]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Clean Accordion List */}
        <div className="divide-y divide-[#0B1230]/8 bg-white border border-[#0B1230]/10 rounded-2xl overflow-hidden">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 space-y-2.5">
              <HelpCircle className="w-6 h-6 text-[#475569]/60 mx-auto" />
              <p className="text-sm font-medium text-[#0B1230]">No matching questions</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="text-xs font-semibold text-[#0A2EB8] hover:underline cursor-pointer"
              >
                Show all questions
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <span className="text-[11px] font-semibold text-[#0A2EB8] block">
                        {faq.categoryLabel}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-[#0B1230] leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-[#475569] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#0A2EB8]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-sm text-[#475569] leading-relaxed space-y-3">
                          <p>{faq.answer}</p>
                          <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1">
                            {faq.highlights.map((item, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0B1230]">
                                <Check className="w-3.5 h-3.5 text-[#19C37D] shrink-0" />
                                <span>{item}</span>
                              </span>
                            ))}
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

        {onJoinWaitlist && (
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2 text-xs text-[#475569]">
            <span>
              Need more help? WhatsApp{" "}
              <a href="https://wa.me/917217813236" target="_blank" rel="noopener noreferrer" className="text-[#0A2EB8] font-semibold hover:underline">
                +91 72178 13236
              </a>{" "}
              or email{" "}
              <a href="mailto:happyhangouts.life@gmail.com" className="text-[#0A2EB8] font-semibold hover:underline">
                happyhangouts.life@gmail.com
              </a>.
            </span>
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                onJoinWaitlist();
              }}
              className="font-semibold text-[#0A2EB8] hover:underline cursor-pointer"
            >
              Get your Hangout Pass →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
