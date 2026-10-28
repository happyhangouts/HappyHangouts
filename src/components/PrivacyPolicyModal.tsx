import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ShieldCheck,
  Fingerprint,
  Lock,
  EyeOff,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Scale,
  RefreshCw,
  KeyRound,
  DownloadCloud
} from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "biometric" | "location" | "full">("summary");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPolicy = () => {
    const policyText = `HAPPY HANGOUTS - PRIVACY & BIOMETRIC DATA SECURITY POLICY
Last Updated: August 2026
Applicable Region: Delhi NCR & Pan-India

1. CORE MISSION & PRIVACY PLEDGE
Happy Hangouts ("we", "our", or "us") operates as a verified social experience platform connecting individuals in Delhi NCR for safe, real-world shared activities. We treat your personal data, biometric verification tokens, and location coordinates with bank-grade encryption and zero-compromise confidentiality.

2. BIOMETRIC PRIVACY & SELFIE VERIFICATION
- Purpose: Biometric facial liveness verification is conducted solely to eliminate bot accounts, prevent catfishing, and verify real human presence.
- Processing: Facial landmarks are converted into an irreversibly hashed cryptographic mathematical vector. We NEVER sell, lease, or distribute biometric data.
- Storage: Biometric vectors are stored in isolated, hardware-encrypted security enclaves.

3. HAPPY KEY & LOCATION SECURITY
- Ephemeral Geo-Fencing: Your precise GPS location or home address is NEVER made public.
- Synchronized Meetups: Precise meeting spots are generated only when two verified members authenticate using a matching 6-digit Happy Key.

4. USER RIGHTS & 1-CLICK PURGE
You hold absolute rights to inspect, export, or permanently delete your account, waitlist entries, and verification records by emailing mubaarqaan@gmail.com.

Contact: Data Protection Office, Happy Hangouts Inc. (support@happyhangouts.life | mubaarqaan@gmail.com)
`;
    const blob = new Blob([policyText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Happy-Hangouts-Privacy-Biometric-Policy.txt";
    link.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <AnimatePresence>
      <div 
        id="privacy-policy-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          id="privacy-policy-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-slate-200/90 rounded-[28px] sm:rounded-[36px] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col text-left overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative flex-shrink-0">
            <button
              id="privacy-modal-close-btn"
              onClick={onClose}
              className="absolute top-5 right-5 p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-full text-white transition-all cursor-pointer"
              title="Close Privacy Policy"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider text-blue-300 uppercase mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Bank-Grade Trust &amp; Biometric Security</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white flex items-center gap-2">
              Privacy Policy &amp; Security Standards
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm font-light mt-1 max-w-xl leading-relaxed">
              Designed with strict biometric privacy, zero data resale, and encrypted handshake protocols so you can connect in Delhi NCR with complete peace of mind.
            </p>

            {/* Quick Navigation Tabs */}
            <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 no-scrollbar">
              <button
                id="privacy-tab-summary"
                onClick={() => setActiveTab("summary")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "summary"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white/10 text-slate-300 hover:bg-white/15"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Executive Summary</span>
              </button>

              <button
                id="privacy-tab-biometric"
                onClick={() => setActiveTab("biometric")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "biometric"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white/10 text-slate-300 hover:bg-white/15"
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Biometric Protection</span>
              </button>

              <button
                id="privacy-tab-location"
                onClick={() => setActiveTab("location")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "location"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white/10 text-slate-300 hover:bg-white/15"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Location &amp; Happy Key</span>
              </button>

              <button
                id="privacy-tab-full"
                onClick={() => setActiveTab("full")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "full"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white/10 text-slate-300 hover:bg-white/15"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full Legal Clauses</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6 text-slate-700 text-xs sm:text-sm overflow-y-auto flex-1 font-sans leading-relaxed">
            {activeTab === "summary" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3.5">
                    <div className="p-2.5 bg-blue-600 text-white rounded-xl flex-shrink-0 shadow-sm">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Biometric Liveness Tokens</h4>
                      <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                        Selfie checks generate one-way cryptographic tokens. We <strong>never store raw video feeds</strong> or sell facial recognition datasets.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3.5">
                    <div className="p-2.5 bg-indigo-600 text-white rounded-xl flex-shrink-0 shadow-sm">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Happy Key Dual Handshake</h4>
                      <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                        Exact locations stay concealed until both parties enter mutual 6-digit keys at certified public cafes and hubs.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3.5">
                    <div className="p-2.5 bg-emerald-600 text-white rounded-xl flex-shrink-0 shadow-sm">
                      <EyeOff className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Zero Ad Brokers &amp; Zero Resale</h4>
                      <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                        Your phone number, email, and vibe preferences are never leased, sold, or shared with third-party advertisers.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-3.5">
                    <div className="p-2.5 bg-amber-600 text-white rounded-xl flex-shrink-0 shadow-sm">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">AES-256 Cloud Encryption</h4>
                      <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                        All application requests, chat sessions, and waitlist records are encrypted at rest and in transit via TLS 1.3.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your Trust &amp; Control Rights at Launch</span>
                  </h4>
                  <ul className="mt-2 space-y-2 text-slate-600 text-xs list-disc list-inside">
                    <li><strong>Right to Erasure:</strong> Purge all your waitlist contact data and selfie scans anytime with 1 click.</li>
                    <li><strong>Public-Only Zones:</strong> Meetups are restricted to verified commercial partner zones (cafes, sports complexes, libraries).</li>
                    <li><strong>Direct Human Accountability:</strong> Inquiries are audited directly by our verified Delhi NCR security desk.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "biometric" && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200/80 rounded-2xl">
                  <h3 className="font-extrabold text-blue-950 text-sm flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-blue-600" />
                    <span>Biometric Verification Framework &amp; DPDP Compliance</span>
                  </h3>
                  <p className="mt-1 text-slate-600 text-xs leading-relaxed">
                    To maintain an authentic ecosystem free of impersonation, synthetic AI avatars, and bots, Happy Hangouts requires a quick selfie liveness verification during companion or seeker registration.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="border border-slate-200 p-4 rounded-xl">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">1. Mathematical Vectorization</h4>
                    <p className="text-slate-600 text-xs mt-1">
                      During selfie verification, your camera capture is processed directly by an encrypted liveness scanner that computes mathematical facial ratios. No unencrypted photograph or high-resolution facial geometry is ever stored in public cloud storage.
                    </p>
                  </div>

                  <div className="border border-slate-200 p-4 rounded-xl">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">2. Zero Commercial Resale</h4>
                    <p className="text-slate-600 text-xs mt-1">
                      Happy Hangouts will <strong>NEVER</strong> license, rent, monetize, or transfer biometric records to data aggregators, government monitoring databases, or commercial entities.
                    </p>
                  </div>

                  <div className="border border-slate-200 p-4 rounded-xl">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">3. Automatic Purge Policy</h4>
                    <p className="text-slate-600 text-xs mt-1">
                      If an account is deactivated or if verification fails, transient scan caches are automatically cleared within 72 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "location" && (
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 border border-indigo-200/80 rounded-2xl">
                  <h3 className="font-extrabold text-indigo-950 text-sm flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-indigo-600" />
                    <span>Happy Key Protocol &amp; Ephemeral Geofencing</span>
                  </h3>
                  <p className="mt-1 text-slate-600 text-xs leading-relaxed">
                    Unlike standard dating or dating-adjacent apps, Happy Hangouts does not publish real-time live distance meters or home neighborhood heatmaps.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="border border-slate-200 p-4 rounded-xl">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">1. Safe Public Hubs Only</h4>
                    <p className="text-slate-600 text-xs mt-1">
                      Coordinates are strictly constrained to vetted public cafes (Blue Tokai, Third Wave, Starbucks, Habitats), verified sport arenas (Siri Fort, Sector 62 sports arenas), and cultural parks (Sunder Nursery, Lodhi Gardens).
                    </p>
                  </div>

                  <div className="border border-slate-200 p-4 rounded-xl">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">2. Mutual 6-Digit Handshake</h4>
                    <p className="text-slate-600 text-xs mt-1">
                      Meeting confirmation requires both companions to exchange and input their randomized 6-digit Happy Key upon arrival, confirming physical presence and consent.
                    </p>
                  </div>

                  <div className="border border-slate-200 p-4 rounded-xl">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">3. Ephemeral Geo-Tracking</h4>
                    <p className="text-slate-600 text-xs mt-1">
                      Location access is strictly active during an accepted hangout session and is immediately terminated upon meetup completion.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "full" && (
              <div className="space-y-5 text-slate-700 text-xs leading-relaxed">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Section 1: Information We Collect</h3>
                  <p className="mt-1">
                    We collect contact details (name, email address, WhatsApp/phone number, city in Delhi NCR) submitted through registration, waitlist, and contact forms. In addition, user-selected vibe preferences (sports, acoustic music, cafe conversations, coding/startups) are stored to suggest compatible companions.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Section 2: Legal Basis &amp; Compliance</h3>
                  <p className="mt-1">
                    Processing of personal data is governed by the Digital Personal Data Protection (DPDP) Act of India and international best practices for privacy and security. We process data strictly with explicit user consent provided at the time of form submission or mobile app account creation.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Section 3: Security &amp; Encryption Standards</h3>
                  <p className="mt-1">
                    All data in transit is encrypted using Transport Layer Security (TLS 1.3). Server endpoints employ strict HTTPS headers, rate limiting, and authenticated serverless endpoints.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Section 4: Data Retention &amp; Deletion Rights</h3>
                  <p className="mt-1">
                    You have the right to request a complete copy of your personal data or request immediate permanent deletion of your account, waitlist entries, and communication logs. Requests are processed within 48 business hours by contacting our Data Protection Officer.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Section 5: Contact &amp; Grievance Redressal</h3>
                  <p className="mt-1">
                    If you have questions regarding this Privacy Policy, biometric safeguards, or data deletion, please contact our lead data coordinator at:
                  </p>
                  <div className="mt-2 p-3 bg-slate-100 rounded-xl font-mono text-[11px] text-slate-800">
                    <p><strong>Entity:</strong> Happy Hangouts Experience Network</p>
                    <p><strong>Contact Email:</strong> mubaarqaan@gmail.com | support@happyhangouts.life</p>
                    <p><strong>Operating Region:</strong> Delhi, Noida &amp; Gurgaon (Delhi NCR)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Last updated: August 2026 • Certified for Launch</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id="download-privacy-doc-btn"
                onClick={handleDownloadPolicy}
                className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Download Policy (.txt)</span>
                  </>
                )}
              </button>

              <button
                id="accept-privacy-policy-btn"
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                I Understand &amp; Agree
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
