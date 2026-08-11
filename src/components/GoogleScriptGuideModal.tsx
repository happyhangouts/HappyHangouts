import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check, FileSpreadsheet, Mail, ExternalLink, Sparkles, CheckCircle, Shield } from "lucide-react";
import { GOOGLE_APPS_SCRIPT_CODE, getGoogleScriptUrl, setGoogleScriptUrl } from "../lib/googleSheets";

interface GoogleScriptGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleScriptGuideModal({ isOpen, onClose }: GoogleScriptGuideModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [scriptUrl, setScriptUrlInput] = useState(getGoogleScriptUrl());
  const [savedUrlSuccess, setSavedUrlSuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleScriptUrl(scriptUrl);
    setSavedUrlSuccess(true);
    setTimeout(() => setSavedUrlSuccess(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white border border-slate-200 rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-left relative overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase mb-3">
              <FileSpreadsheet className="w-3.5 h-3.5" /> GOOGLE SHEETS & EMAIL AUTOMATION
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Google Apps Script Integration
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm font-light mt-1">
              Form submissions (Contact, Waitlist, Partner/Seeker) automatically append rows to Google Sheets and dispatch instant email alerts to <strong className="text-white font-bold">mubaarqaan@gmail.com</strong>.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-slate-700 text-xs sm:text-sm">
            
            {/* Step 1: Copy Code */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 font-display flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-mono text-xs flex items-center justify-center font-bold">1</span>
                  Copy Ready-To-Use Apps Script (`Code.gs`)
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Google Apps Script Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Snippet Box */}
              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-200 rounded-2xl text-[10.5px] font-mono overflow-x-auto max-h-48 border border-slate-800 leading-relaxed">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>

            {/* Step 2: Deployment Guide */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> Quick 2-Minute Google Apps Script Setup Instructions:
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed font-light">
                <li>Open a new or existing <strong>Google Sheet</strong>.</li>
                <li>Click <strong>Extensions &gt; Apps Script</strong> in top menu.</li>
                <li>Paste the copied script code replacing all existing contents in `Code.gs`.</li>
                <li>Click <strong>Deploy &gt; New deployment</strong>. Select type: <strong>Web App</strong>.</li>
                <li>Set <strong>Execute as: Me</strong> and <strong>Who has access: Anyone</strong>.</li>
                <li>Click <strong>Deploy</strong> and authorize permissions (see authorization step below).</li>
              </ol>

              {/* Google Security Warning Instructions */}
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-600" /> What to click on "This app hasn't been verified by Google":
                </p>
                <ol className="list-disc list-inside pl-1 space-y-0.5 text-amber-800">
                  <li>Click <strong>"Advanced"</strong> at the bottom left of the popup warning.</li>
                  <li>Click <strong>"Go to Untitled project (unsafe)"</strong> (it says unsafe only because it is your custom script).</li>
                  <li>Check both permission boxes (Google Sheets &amp; Email permissions).</li>
                  <li>Click <strong>"Continue" / "Allow"</strong> to finish deployment.</li>
                </ol>
              </div>
            </div>

            {/* Step 3: Web App URL Configuration Input */}
            <form onSubmit={handleSaveUrl} className="space-y-3 pt-2 border-t border-slate-100">
              <label className="font-extrabold text-slate-900 font-display flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-mono text-xs flex items-center justify-center font-bold">2</span>
                  Target Web App URL (Optional / Saved)
                </span>
                {savedUrlSuccess && (
                  <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 animate-fade-in">
                    <CheckCircle className="w-3.5 h-3.5" /> Endpoint Saved!
                  </span>
                )}
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={scriptUrl}
                  onChange={(e) => setScriptUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer"
                >
                  Save Web App URL
                </button>
              </div>
            </form>

            {/* Email Notification Notice */}
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-left">
                <h5 className="font-bold text-emerald-900 text-xs">Email Alerts Configured</h5>
                <p className="text-emerald-700 text-[11px] font-light leading-relaxed">
                  Every form submission (Contact, Waitlist, Become a Partner) triggers an automated HTML email notification directly to <strong className="font-bold">mubaarqaan@gmail.com</strong>.
                </p>
              </div>
            </div>

            {/* Close Modal */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Close Setup Guide
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
