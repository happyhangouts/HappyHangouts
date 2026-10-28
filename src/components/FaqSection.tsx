import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ShieldCheck,
  Key,
  Lock,
  MapPin,
  UserCheck,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Search,
  MessageCircleQuestion,
  Users,
  Briefcase,
  DollarSign,
  Calendar,
  Clock
} from "lucide-react";
import { audio } from "../utils/audio";

export interface FaqItem {
  id: string;
  category: "seeker" | "partner" | "verification" | "happykey";
  categoryLabel: string;
  targetRole: "Seeker" | "Partner" | "Both";
  icon: React.ElementType;
  question: string;
  answer: string;
  highlights?: string[];
}

const FAQ_DATA: FaqItem[] = [
  // HANGOUT SEEKER FAQS (5)
  {
    id: "seeker-finding-companions",
    category: "seeker",
    categoryLabel: "Hangout Seeker FAQ",
    targetRole: "Seeker",
    icon: Users,
    question: "How do I find and match with a verified hangout companion in Delhi NCR?",
    answer: "Simply browse available verified companions by location (Gurgaon, South Delhi, Noida, CP) and interests (badminton, coffee crawls, guitar jams, startup chats). Pick a companion, select your preferred certified public hub and proposed time. You'll receive instant booking confirmation and a secure Happy Key PIN for check-in.",
    highlights: [
      "100% ID-verified companions",
      "Verified public hubs in NCR",
      "Instant booking & scheduling"
    ]
  },
  {
    id: "seeker-safety-guarantee",
    category: "seeker",
    categoryLabel: "Hangout Seeker FAQ",
    targetRole: "Seeker",
    icon: ShieldCheck,
    question: "Is it safe to meet a companion for the first time through Happy Hangouts?",
    answer: "Yes, safety is engineered into every step. All companions pass government photo ID verification before joining our pool. All hangouts take place strictly at certified public hubs (like Sunder Nursery, Blue Tokai Cafes, or Siri Fort), supported by our 1-tap Emergency SOS system and 24/7 Safety Desk.",
    highlights: [
      "Government photo ID checked",
      "Certified public spots only",
      "1-tap Emergency SOS feature"
    ]
  },
  {
    id: "seeker-payment-escrow",
    category: "seeker",
    categoryLabel: "Hangout Seeker FAQ",
    targetRole: "Seeker",
    icon: DollarSign,
    question: "How does payment work for booking a companion or host?",
    answer: "During our rollout phase, your first hangouts with early founding partners are completely free! When booking paid companion sessions (₹200 – ₹1,500/hr), payments are made securely via UPI or card. Funds are safely held in escrow and released to the host only after a successful Happy Key handshake at the venue.",
    highlights: [
      "Escrow payment protection",
      "First hangouts 100% free",
      "Seamless UPI & card payments"
    ]
  },
  {
    id: "seeker-cancellation-policy",
    category: "seeker",
    categoryLabel: "Hangout Seeker FAQ",
    targetRole: "Seeker",
    icon: Clock,
    question: "What happens if my companion cancels or doesn't show up?",
    answer: "We enforce a strict zero-ghosting policy. Thanks to our Happy Key dual-handshake protocol, physical presence is verified live at the spot. If a companion cancels unannounced or fails to show up, you receive a 100% instant refund plus priority rebooking tokens, and the host faces account penalties.",
    highlights: [
      "100% instant refund guarantee",
      "Zero-ghosting strict policy",
      "Priority rebooking credits"
    ]
  },
  {
    id: "seeker-group-vs-solo",
    category: "seeker",
    categoryLabel: "Hangout Seeker FAQ",
    targetRole: "Seeker",
    icon: Users,
    question: "Can I hang out in small groups or is it strictly 1-on-1?",
    answer: "You can choose either! Book 1-on-1 companions for personal activities like tennis practice or acoustic guitar jams, or join curated micro-circles (3 to 6 seekers) led by certified partners for group activities like weekend heritage walks or cafe hops.",
    highlights: [
      "Personal 1-on-1 companions",
      "Curated 3–6 person micro-circles",
      "Interest-driven group activities"
    ]
  },

  // HANGOUT PARTNER FAQS (5)
  {
    id: "partner-how-to-apply",
    category: "partner",
    categoryLabel: "Hangout Partner FAQ",
    targetRole: "Partner",
    icon: Briefcase,
    question: "Who can become a Hangout Partner and how do I apply?",
    answer: "Anyone living in Delhi NCR who loves sharing hobbies, mentoring, exploring local spots, or spending quality time can apply! Fill out our Founding Partner application with your top passions and location. Once your government ID is verified and you complete a brief 5-minute onboarding check, your partner profile goes live.",
    highlights: [
      "Open to passionate local hosts",
      "100% government ID verification",
      "Fast 5-minute onboarding"
    ]
  },
  {
    id: "partner-earnings-pricing",
    category: "partner",
    categoryLabel: "Hangout Partner FAQ",
    targetRole: "Partner",
    icon: DollarSign,
    question: "How do I earn money and set my custom hourly rate?",
    answer: "As a founding partner, your first 3 hangouts are 100% free to build trust, collect verified 5-star seeker reviews, and earn 150+ Trust Points. After 3 successful trust hangouts, you unlock custom hourly pricing (₹200 to ₹1,500/hr) and receive direct payouts via UPI or bank transfer right after each completed session.",
    highlights: [
      "Build 5-star reviews on 3 free meets",
      "Set hourly rate freely (₹200–₹1500)",
      "Direct instant UPI payouts"
    ]
  },
  {
    id: "partner-schedule-flexibility",
    category: "partner",
    categoryLabel: "Hangout Partner FAQ",
    targetRole: "Partner",
    icon: Calendar,
    question: "Do I have to host on a fixed schedule or fulfill quotas?",
    answer: "Not at all! You have 100% flexibility over your time. You decide when you're available—whether it's 2 hours on a Sunday morning or weekday coffee chats. You can accept or decline any seeker request based on your schedule and personal comfort.",
    highlights: [
      "Total control over schedule",
      "Accept or decline requests freely",
      "Zero minimum quota requirements"
    ]
  },
  {
    id: "partner-host-safety",
    category: "partner",
    categoryLabel: "Hangout Partner FAQ",
    targetRole: "Partner",
    icon: ShieldCheck,
    question: "How does Happy Hangouts protect partner/host safety?",
    answer: "We prioritize host safety just as much as seeker safety. Seekers must be 100% ID-verified before booking you, and all meetings occur strictly at certified public venues (cafes, sports complexes, parks). You also have access to the 1-tap SOS alert and rate seekers post-hangout.",
    highlights: [
      "100% ID-verified seekers only",
      "Vetted public venues exclusively",
      "Post-hangout seeker ratings"
    ]
  },
  {
    id: "partner-activities-allowed",
    category: "partner",
    categoryLabel: "Hangout Partner FAQ",
    targetRole: "Partner",
    icon: Sparkles,
    question: "What kind of activities or hangouts can I host as a partner?",
    answer: "Anything you are passionate about! Popular partner activities include guitar & acoustic jams, cafe hopping & coffee tasting, badminton & fitness runs, startup napkin chats, photography walks, or simply introducing newcomers to your favorite spots in Delhi NCR.",
    highlights: [
      "Wide range of hobby categories",
      "Host 1-on-1 or micro-groups",
      "Monetize your passions"
    ]
  }
];

interface FaqSectionProps {
  onJoinWaitlist?: (interestStr?: string) => void;
}

export default function FaqSection({ onJoinWaitlist }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>("seeker-finding-companions");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAccordion = (id: string) => {
    audio.playClick();
    setOpenId(prev => (prev === id ? null : id));
  };

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-20 bg-slate-50/60 border-t border-b border-slate-200/60 relative overflow-hidden text-left">
      {/* Background ambient lighting glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-mono font-black uppercase tracking-[0.2em]">
            <MessageCircleQuestion className="w-3.5 h-3.5" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-[-0.03em] font-display">
            Got Questions? <span className="text-blue-600">We've Got Answers</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Everything you need to know about joining as a <strong>Hangout Seeker</strong> or a <strong>Hangout Partner</strong> in Delhi NCR.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-sm">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: "all", label: "All Questions (10)" },
              { id: "seeker", label: "💙 Hangout Seeker (5)" },
              { id: "partner", label: "⚡ Hangout Partner (5)" }
            ].map(tab => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    audio.playClick();
                    setActiveCategory(tab.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-800 placeholder-slate-400 font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 space-y-3">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">No matching questions found</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Clear search & filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              const IconComp = faq.icon;
              const isPartner = faq.targetRole === "Partner";

              return (
                <motion.div
                  key={faq.id}
                  initial={false}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? isPartner 
                        ? "border-indigo-500/40 shadow-[0_8px_30px_rgba(99,102,241,0.08)] ring-1 ring-indigo-500/20"
                        : "border-blue-500/40 shadow-[0_8px_30px_rgba(59,130,246,0.08)] ring-1 ring-blue-500/20"
                      : "border-slate-200/80 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  {/* Accordion Trigger */}
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none select-none"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-xl border shrink-0 transition-colors duration-300 ${
                        isOpen
                          ? isPartner ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-slate-50 text-slate-500 border-slate-100"
                      }`}>
                        <IconComp className="w-4 h-4" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isPartner 
                              ? "bg-indigo-50 text-indigo-600 border border-indigo-200/60" 
                              : "bg-blue-50 text-blue-600 border border-blue-200/60"
                          }`}>
                            {isPartner ? "⚡ Hangout Partner" : "💙 Hangout Seeker"}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight font-display leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div className={`p-2 rounded-full border transition-all duration-300 shrink-0 mt-0.5 ${
                      isOpen
                        ? isPartner ? "bg-indigo-600 text-white border-indigo-600 rotate-180" : "bg-blue-600 text-white border-blue-600 rotate-180"
                        : "bg-slate-50 text-slate-400 border-slate-200/80"
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-0 border-t border-slate-100/80 text-xs sm:text-sm text-slate-600 font-light leading-relaxed space-y-4">
                          <p className="pt-4">{faq.answer}</p>

                          {faq.highlights && (
                            <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-xl border border-slate-100 space-y-2">
                              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                                Key Takeaways:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {faq.highlights.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium text-xs">
                                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isPartner ? "text-indigo-500" : "text-emerald-500"}`} />
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Bottom CTA prompt */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> Have more questions or ready to join?
            </div>
            <h4 className="text-lg sm:text-xl font-black font-display tracking-tight">
              Ready to Connect or Host in Delhi NCR?
            </h4>
            <p className="text-slate-400 text-xs font-light max-w-md">
              Join as a Hangout Seeker or apply to be one of our First 50 Founding Partners!
            </p>
          </div>

          <button
            onClick={() => {
              audio.playClick();
              if (onJoinWaitlist) {
                onJoinWaitlist("Applying from FAQ section");
              } else {
                const formEl = document.getElementById("waitlist-section");
                formEl?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/30 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            Apply Now
          </button>
        </div>

      </div>
    </section>
  );
}

