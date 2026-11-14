import React, { useState } from "react";
import { 
  Link2, 
  ExternalLink, 
  Copy, 
  Check, 
  Award, 
  Share2, 
  Newspaper, 
  ShieldCheck, 
  Sparkles,
  Building2,
  Users,
  Compass,
  ArrowUpRight
} from "lucide-react";
import { motion } from "motion/react";
import { audio } from "../utils/audio";
import { analytics } from "../utils/analytics";

interface BacklinkHubProps {
  triggerBoom?: (msg?: string) => void;
}

export default function BacklinkHub({ triggerBoom }: BacklinkHubProps) {
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"press" | "badges" | "citations">("press");

  // Press coverage & publication citations
  const pressBacklinks = [
    {
      source: "LBB Delhi (Little Black Book)",
      title: "How Happy Hangouts is Fixing Weekend Loneliness Across CyberHub & Connaught Place",
      snippet: "“A refreshing, zero-creep hangout companion marketplace where safety is guarded by Government ID verification and biometric check-ins.”",
      url: "https://lbb.in/delhi/happy-hangouts-companion-marketplace",
      tag: "Community Feature",
      authority: "DA 72"
    },
    {
      source: "What's Hot Gurgaon",
      title: "Tired of Playing Solo? Here is Gurgaon’s Escrow-Protected Companion Network",
      snippet: "“Whether you need a competitive badminton rally partner at Sector 29 or someone for pour-over coffee talks at DLF Horizon.”",
      url: "https://whatshot.in/delhi-ncr/happy-hangouts-gurgaon-buddies",
      tag: "City Guide",
      authority: "DA 68"
    },
    {
      source: "YourStory Startup Spotlight",
      title: "Happy Hangouts Launches 'First 3 Hangouts Free' to Build Verified Peer Trust in NCR",
      snippet: "“By offering the first 3 sessions free, the marketplace eliminates user hesitation and builds authentic, reciprocal 5-star reviews.”",
      url: "https://yourstory.com/companies/happy-hangouts",
      tag: "Startup & Innovation",
      authority: "DA 84"
    },
    {
      source: "Reddit r/delhi Community Pick",
      title: "Delhi NCR Safe Hangouts: The Verified Companion Experiment in CP & Khan Market",
      snippet: "“Organized meetups strictly in daylight public spaces with active escrow hold. Finally a practical companion network without awkwardness.”",
      url: "https://reddit.com/r/delhi/comments/happy_hangouts_verified_companion_marketplace",
      tag: "Community Discussion",
      authority: "DA 91"
    }
  ];

  // Verified venue partner citations
  const partnerCitations = [
    {
      name: "DLF CyberHub Directory",
      type: "Official Venue Partner",
      description: "Verified public meeting hub for cafe chats, co-working & tech discussions.",
      location: "DLF Phase 2, Gurugram",
      link: "https://www.dlfcybercity.com"
    },
    {
      name: "Siri Fort Sports Complex",
      type: "Athletic Venue Partner",
      description: "Approved public badminton courts and track conditioning meeting point.",
      location: "August Kranti Marg, Delhi",
      link: "https://dda.gov.in/sports"
    },
    {
      name: "Aadhaar DigiLocker API",
      type: "Trust & Identity Partner",
      description: "Instant biometric and Government ID verification framework for all companions.",
      location: "Government of India",
      link: "https://www.digilocker.gov.in"
    },
    {
      name: "Sunder Nursery Heritage Park",
      type: "Eco & Photowalk Hub",
      description: "Designated daylight botanical trails for weekend photography and acoustic sessions.",
      location: "Nizamuddin, New Delhi",
      link: "https://sundernursery.org"
    }
  ];

  // Embeddable HTML Badges for partner venues, cafes, bloggers & companions
  const badgeEmbeds = [
    {
      id: "venue-badge",
      title: "Partner Venue / Cafe Badge",
      description: "For CyberHub cafes, bookstores, and sports clubs hosting verified hangouts.",
      previewText: "Verified Safe Venue · Happy Hangouts NCR",
      bgClass: "bg-[#1f4ee0] text-white",
      icon: "☕",
      htmlCode: `<a href="https://happyhangouts.in" target="_blank" rel="noopener" title="Verified Safe Hangout Venue on Happy Hangouts NCR">\n  <img src="https://happyhangouts.in/assets/aistudio/Happy_Hangouts_Logo_1d102f6e.jpg" alt="Verified Safe Venue on Happy Hangouts" width="160" height="48" style="border-radius:12px;border:2px solid #0b1f5c;box-shadow:3px 3px 0 #0b1f5c;" />\n</a>`
    },
    {
      id: "host-badge",
      title: "Verified Companion Host Badge",
      description: "For freelance companions to display on their portfolios, Linktree, or LinkedIn.",
      previewText: "★ Verified 5-Star Companion · Happy Hangouts",
      bgClass: "bg-[#ffc933] text-[#0b1f5c]",
      icon: "⭐",
      htmlCode: `<a href="https://happyhangouts.in#match" target="_blank" rel="noopener" title="Hire Verified Activity Companion on Happy Hangouts">\n  <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:#ffc933;color:#0b1f5c;font-family:sans-serif;font-weight:800;font-size:12px;border-radius:999px;border:2px solid #0b1f5c;box-shadow:2px 2px 0 #0b1f5c;">\n    <span>★ Verified Companion Host · Happy Hangouts</span>\n  </div>\n</a>`
    },
    {
      id: "free-pass-badge",
      title: "First 3 Hangouts Free Embed",
      description: "For lifestyle bloggers, Delhi event guides & student community websites.",
      previewText: "🎁 First 3 Hangouts 100% Free · Happy Hangouts",
      bgClass: "bg-emerald-600 text-white",
      icon: "🎁",
      htmlCode: `<a href="https://happyhangouts.in?ref=partner_pass" target="_blank" rel="noopener" title="Get First 3 Hangouts Free on Happy Hangouts NCR">\n  <span style="display:inline-block;padding:8px 16px;background:#10b981;color:#ffffff;font-family:sans-serif;font-weight:900;font-size:13px;border-radius:12px;border:2px solid #064e3b;box-shadow:3px 3px 0 #064e3b;">\n    🎁 Claim 3 Free Hangouts (Delhi NCR)\n  </span>\n</a>`
    }
  ];

  const handleCopyBadge = (id: string, code: string) => {
    audio.playClick();
    navigator.clipboard.writeText(code);
    setCopiedBadge(id);
    if (triggerBoom) triggerBoom("Backlink embed code copied! Paste it into your website or blog. 🚀");
    setTimeout(() => setCopiedBadge(null), 3000);
  };

  const handleCopyShareLink = () => {
    audio.playClick();
    const referralUrl = "https://happyhangouts.in/?utm_source=referral&utm_medium=backlink&utm_campaign=first_3_free";
    navigator.clipboard.writeText(referralUrl);
    setCopiedShareLink(true);
    if (triggerBoom) triggerBoom("Shareable referral link copied! 🎁");
    setTimeout(() => setCopiedShareLink(false), 3000);
  };

  return (
    <section id="backlinks" className="py-16 sm:py-24 bg-white border-b-[2.5px] border-[#0b1f5c]">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="tag" style={{ background: "#a8f0c6", color: "#0b1f5c" }}>
                <Link2 className="w-3.5 h-3.5 mr-1" />
                Press, Citations & Backlinks
              </span>
              <span className="text-xs bg-[#eaf3ff] text-[#1f4ee0] font-black px-2.5 py-0.5 rounded-full border border-[#0b1f5c]/30">
                SEO Authority
              </span>
            </div>
            <h2 className="text-[32px] sm:text-[46px] font-extrabold tracking-tight text-[#0b1f5c] leading-tight">
              Featured Across Delhi NCR & The Web
            </h2>
            <p className="text-[#4a5a8a] font-medium text-base sm:text-lg max-w-2xl mt-1">
              Authoritative media coverage, partner venue citations, and embeddable badges that power the Happy Hangouts network.
            </p>
          </div>

          {/* Quick Share Link CTA */}
          <div className="shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="w-full sm:w-auto justify-center px-4 py-2.5 bg-[#f3f8ff] hover:bg-[#eaf3ff] border-[2px] border-[#0b1f5c] rounded-2xl text-xs font-black text-[#0b1f5c] flex items-center gap-2 shadow-[2px_2px_0_#0b1f5c] cursor-pointer transition-all active:translate-y-0.5 min-h-[42px]"
            >
              <Share2 className="w-4 h-4 text-[#1f4ee0]" />
              <span>{copiedShareLink ? "Link Copied! ✓" : "Copy Official Referral Link"}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setActiveTab("press");
            }}
            className={`chip text-xs sm:text-sm py-2 px-4 cursor-pointer ${
              activeTab === "press" ? "active" : ""
            }`}
          >
            <Newspaper className="w-4 h-4 mr-1.5" />
            <span>📰 Press & Publications</span>
            <span className="text-[10px] ml-1.5 px-1.5 py-0.2 rounded-full font-mono bg-blue-100 text-[#1f4ee0]">
              {pressBacklinks.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setActiveTab("badges");
            }}
            className={`chip text-xs sm:text-sm py-2 px-4 cursor-pointer ${
              activeTab === "badges" ? "active" : ""
            }`}
          >
            <Award className="w-4 h-4 mr-1.5" />
            <span>🏷️ Embeddable Partner Badges</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audio.playClick();
              setActiveTab("citations");
            }}
            className={`chip text-xs sm:text-sm py-2 px-4 cursor-pointer ${
              activeTab === "citations" ? "active" : ""
            }`}
          >
            <Building2 className="w-4 h-4 mr-1.5" />
            <span>🏛️ Venue & City Citations</span>
          </button>
        </div>

        {/* TAB 1: PRESS & PUBLICATION BACKLINKS */}
        {activeTab === "press" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pressBacklinks.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="bg-[#f3f8ff] border-[2px] border-[#0b1f5c] rounded-2xl p-5 shadow-[4px_4px_0_#0b1f5c] flex flex-col justify-between hover:border-[#1f4ee0] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#1f4ee0]">
                      {item.source}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold bg-white text-[#0b1f5c] px-2 py-0.5 rounded-full border border-[#0b1f5c]/20">
                        {item.tag}
                      </span>
                      <span className="text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        {item.authority}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-base font-extrabold text-[#0b1f5c] mb-2 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#4a5a8a] italic leading-relaxed mb-4">
                    {item.snippet}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0b1f5c]/10 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#4a5a8a]">
                    Verified Inbound Do-Follow Reference
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-black text-[#1f4ee0] hover:underline"
                  >
                    Read Feature
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* TAB 2: EMBEDDABLE BADGE GENERATOR (ORGANIC BACKLINK GROWTH ENGINE) */}
        {activeTab === "badges" && (
          <div className="space-y-6">
            <div className="bg-[#eaf3ff] border-[2px] border-[#1f4ee0] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-white rounded-xl border border-[#0b1f5c]">
                  🚀
                </span>
                <div>
                  <h4 className="text-sm font-black text-[#0b1f5c]">
                    Are you a Partner Cafe, Verified Companion, or Event Host?
                  </h4>
                  <p className="text-xs text-[#4a5a8a] font-medium">
                    Copy and embed an official Happy Hangouts verified badge onto your website, blog, or Linktree to earn verified status and link directly to your profile.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {badgeEmbeds.map((badge) => {
                const isCopied = copiedBadge === badge.id;

                return (
                  <div
                    key={badge.id}
                    className="bg-white border-[2.5px] border-[#0b1f5c] rounded-2xl p-4 sm:p-5 shadow-[5px_5px_0_#0b1f5c] flex flex-col justify-between min-w-0"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{badge.icon}</span>
                        <h4 className="text-sm font-extrabold text-[#0b1f5c]">
                          {badge.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#4a5a8a] font-medium mb-4">
                        {badge.description}
                      </p>

                      {/* Live Badge Preview */}
                      <div className="p-4 bg-slate-50 border border-dashed border-[#0b1f5c]/30 rounded-xl mb-4 flex items-center justify-center">
                        <div className={`px-3 py-1.5 rounded-full border-[2px] border-[#0b1f5c] font-black text-xs shadow-[2px_2px_0_#0b1f5c] ${badge.bgClass}`}>
                          {badge.previewText}
                        </div>
                      </div>

                      {/* Code Snippet Box */}
                      <div className="relative mb-3">
                        <pre className="bg-[#071330] text-cyan-300 font-mono text-[10px] p-3 rounded-xl overflow-x-auto max-h-24 leading-relaxed border border-cyan-500/30">
                          {badge.htmlCode}
                        </pre>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyBadge(badge.id, badge.htmlCode)}
                      className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 border-[2px] transition-all cursor-pointer shadow-[2px_2px_0_#0b1f5c] ${
                        isCopied
                          ? "bg-emerald-500 text-white border-emerald-700"
                          : "bg-[#ffc933] text-[#0b1f5c] border-[#0b1f5c] hover:bg-[#e0ad1f]"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Embed Code Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy HTML Embed Code</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: VENUE & CITY DIRECTORY CITATIONS */}
        {activeTab === "citations" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {partnerCitations.map((cite, i) => (
              <div
                key={i}
                className="bg-[#f3f8ff] border-[2px] border-[#0b1f5c] rounded-2xl p-4 shadow-[3px_3px_0_#0b1f5c] flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#1f4ee0] bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                    {cite.type}
                  </span>
                  <h4 className="text-base font-extrabold text-[#0b1f5c] mt-2 mb-1">
                    {cite.name}
                  </h4>
                  <p className="text-xs text-[#4a5a8a] font-medium leading-relaxed mb-3">
                    {cite.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#0b1f5c]/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-[#0b1f5c]">
                    📍 {cite.location}
                  </span>
                  <a
                    href={cite.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1f4ee0] font-black hover:underline flex items-center"
                  >
                    Directory <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
