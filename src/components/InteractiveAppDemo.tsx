import React, { useState } from "react";
import { 
  Coffee, 
  Car, 
  Lightbulb, 
  Film, 
  Compass, 
  Soup, 
  BookOpen, 
  Dumbbell, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Key, 
  Sparkles, 
  ChevronRight, 
  Check, 
  ArrowRight,
  RotateCcw,
  Volume2,
  Award,
  Crown,
  Edit2,
  TrendingUp,
  Bell,
  Lock,
  CheckCircle,
  X
} from "lucide-react";
import { audio } from "../utils/audio";
import confetti from "canvas-confetti";

// Characteristic Illustrated Vector Avatar Generator
export function CharacteristicAvatar({ id, className = "w-full h-full" }: { id: string; className?: string }) {
  // Aditya Sen (User, based on the attached hand-drawn style of Muba with curly hair, beard, white t-shirt and blue open shirt)
  if (id === "user" || id === "user-profile") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="user-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="url(#user-grad)" />
        <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.15" />
        
        {/* Body & Shoulders */}
        {/* White T-shirt */}
        <path d="M25 88 C25 74, 35 70, 50 70 C65 70, 75 74, 75 88 Z" fill="#FFFFFF" />
        
        {/* Blue Open Overshirt (exactly like the attached photo!) */}
        <path d="M20 88 C20 73, 28 68, 41 68 L38 88 Z" fill="#1E40AF" />
        <path d="M80 88 C80 73, 72 68, 59 68 L62 88 Z" fill="#1E40AF" />
        {/* Shirt Collar lapels */}
        <path d="M36 68 L44 76 L40 88 Z" fill="#2563EB" />
        <path d="M64 68 L56 76 L60 88 Z" fill="#2563EB" />
        
        {/* Neck */}
        <path d="M42 56 L58 56 L58 72 L42 72 Z" fill="#E2A684" />
        <path d="M42 66 L50 70 L58 66 L58 72 L42 72 Z" fill="#C68C6A" /> {/* neck shadow */}
        
        {/* Face */}
        <path d="M34 44 C34 32, 42 26, 50 26 C58 26, 66 32, 66 44 C66 56, 58 60, 50 60 C42 60, 34 56, 34 44 Z" fill="#F0B596" />
        
        {/* Dark curly beard & mustache (highly groomed!) */}
        <path d="M34 44 C34 52, 40 60, 50 60 C60 60, 66 52, 66 44 C66 45, 65 47, 63 49 C60 52, 55 54, 50 54 C45 54, 40 52, 37 49 C35 47, 34 45, 34 44 Z" fill="#1F2937" />
        <path d="M34 40 C33 42, 34 46, 36 49 C39 54, 44 57, 50 57 C56 57, 61 54, 64 49 C66 46, 67 42, 66 40 C65 43, 62 46, 59 47 C56 48, 53 49, 50 49 C47 49, 44 48, 41 47 C38 46, 35 43, 34 40 Z" fill="#111827" />
        {/* Mustache */}
        <path d="M41 48 C44 46, 47 46, 50 47 C53 46, 56 46, 59 48 C60 49, 59 51, 57 51 C55 51, 53 49, 50 50 C47 49, 45 51, 43 51 C41 51, 40 49, 41 48 Z" fill="#111827" />
        
        {/* Nose */}
        <path d="M48 42 L52 42 L50 46 Z" fill="#D39675" />
        
        {/* Eyes & groomed Eyebrows */}
        <circle cx="44" cy="40" r="2.5" fill="#111827" />
        <circle cx="56" cy="40" r="2.5" fill="#111827" />
        <path d="M40 36 C42 34, 46 35, 47 37" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M60 36 C58 34, 54 35, 53 37" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Warm friendly smile */}
        <path d="M46 51 C48 53, 52 53, 54 51" stroke="#E07A5F" strokeWidth="1" strokeLinecap="round" fill="none" />
        
        {/* Curly Black Hair (overlapping premium vector curls) */}
        <circle cx="38" cy="28" r="7" fill="#111827" />
        <circle cx="45" cy="23" r="8" fill="#111827" />
        <circle cx="55" cy="23" r="8" fill="#111827" />
        <circle cx="62" cy="28" r="7" fill="#111827" />
        <circle cx="34" cy="35" r="6" fill="#111827" />
        <circle cx="66" cy="35" r="6" fill="#111827" />
        <circle cx="41" cy="25" r="7" fill="#1F2937" />
        <circle cx="50" cy="22" r="8" fill="#1F2937" />
        <circle cx="59" cy="25" r="7" fill="#1F2937" />
        
        {/* Coffee Cup in corner (Muba is holding his coffee!) */}
        <g transform="translate(68, 64)">
          {/* Cardboard sleeve */}
          <path d="M0 8 L10 8 L8 24 L2 24 Z" fill="#C5A880" /> 
          {/* Cup */}
          <path d="M-2 0 L14 0 L12 8 L0 8 Z" fill="#F3F4F6" /> 
          <path d="M2 24 L8 24 L7 28 L3 28 Z" fill="#F3F4F6" />
          {/* Lid */}
          <path d="M-3 -2 L15 -2 L14 1 L-2 1 Z" fill="#4B3E35" /> 
        </g>
      </svg>
    );
  }

  // Rohan Malhotra (Chess Master, dl-l1) - Intellectual look with specs, purple gradient
  if (id === "dl-l1") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dl-l1-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#dl-l1-grad)" />
        {/* Chess board lines watermarked */}
        <path d="M15 15 H30 V30 H15 Z M42 15 H57 V30 H42 Z M15 42 H30 V57 H15 Z M42 42 H57 V57 H42 Z" fill="#FFFFFF" fillOpacity="0.07" />
        
        {/* Neck */}
        <path d="M44 58 L56 58 L56 68 L44 68 Z" fill="#E8B490" />
        {/* Black turtleneck sweater */}
        <path d="M28 85 C28 72, 36 65, 50 65 C64 65, 72 72, 72 85 Z" fill="#111827" />
        <path d="M40 65 C40 62, 60 62, 60 65 Z" fill="#1F2937" />
        
        {/* Face */}
        <path d="M36 41 C36 31, 42 26, 50 26 C58 26, 64 31, 64 41 C64 52, 58 56, 50 56 C42 56, 36 52, 36 41 Z" fill="#F5C39E" />
        {/* Nose */}
        <path d="M48 41 L52 41 L50 45 Z" fill="#DBA37B" />
        
        {/* Eyes & spectacles */}
        <circle cx="44" cy="38" r="6" stroke="#111827" strokeWidth="2.5" fill="none" />
        <circle cx="56" cy="38" r="6" stroke="#111827" strokeWidth="2.5" fill="none" />
        <line x1="47" y1="38" x2="53" y2="38" stroke="#111827" strokeWidth="2.5" />
        <circle cx="44" cy="38" r="1.5" fill="#111827" />
        <circle cx="56" cy="38" r="1.5" fill="#111827" />
        
        {/* Sleek mustache & stubble */}
        <path d="M44 47 C47 45, 53 45, 56 47" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M46 51 C48 53, 52 53, 54 51" stroke="#E07A5F" strokeWidth="1" strokeLinecap="round" fill="none" />
        
        {/* Sleek Hair */}
        <path d="M34 32 C34 21, 40 18, 50 18 C60 18, 66 21, 66 32 C60 28, 55 28, 50 30 C45 28, 40 28, 34 32 Z" fill="#111827" />
        <path d="M33 35 L38 30 L36 26 Z" fill="#111827" />
        <path d="M67 35 L62 30 L64 26 Z" fill="#111827" />
      </svg>
    );
  }

  // Aditi Sharma (Vinyl Collector, dl-c1) - Cute headphones, orange/terracotta background
  if (id === "dl-c1") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dl-c1-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#F33F5E" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#dl-c1-grad)" />
        {/* Vinyl record watermark */}
        <circle cx="20" cy="80" r="12" stroke="white" strokeWidth="1" strokeOpacity="0.12" fill="none" />
        <circle cx="20" cy="80" r="5" stroke="white" strokeWidth="1" strokeOpacity="0.12" fill="none" />
        
        {/* Neck */}
        <path d="M45 56 L55 56 L55 68 L45 68 Z" fill="#FFD0B4" />
        {/* Yellow knitted sweater */}
        <path d="M28 85 C28 72, 36 66, 50 66 C64 66, 72 72, 72 85 Z" fill="#FBBF24" />
        <path d="M42 66 C42 70, 58 70, 58 66 Z" fill="#D97706" />
        
        {/* Face */}
        <path d="M37 41 C37 31, 42 26, 50 26 C58 26, 63 31, 63 41 C63 52, 58 56, 50 56 C42 56, 37 52, 37 41 Z" fill="#FFD0B4" />
        
        {/* Stylish frames */}
        <circle cx="45" cy="39" r="5.5" stroke="#EC4899" strokeWidth="1.8" fill="none" />
        <circle cx="55" cy="39" r="5.5" stroke="#EC4899" strokeWidth="1.8" fill="none" />
        <line x1="47.5" y1="39" x2="52.5" y2="39" stroke="#EC4899" strokeWidth="1.8" />
        
        {/* Eyes & beautiful smile */}
        <circle cx="45" cy="39" r="1.5" fill="#111827" />
        <circle cx="55" cy="39" r="1.5" fill="#111827" />
        <path d="M47 48 C48 50, 52 50, 53 48" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Retro Headphones */}
        <path d="M32 40 C32 20, 68 20, 68 40" stroke="#06B6D4" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="29" y="37" width="6" height="11" rx="3" fill="#06B6D4" />
        <rect x="65" y="37" width="6" height="11" rx="3" fill="#06B6D4" />

        {/* Hair bob with bangs */}
        <path d="M34 38 C34 22, 40 18, 50 18 C60 18, 66 22, 66 38 C66 48, 63 48, 63 44 C59 36, 41 36, 37 44 C37 48, 34 48, 34 38 Z" fill="#4B3621" />
        <path d="M37 28 C42 24, 48 24, 50 26 C52 24, 58 24, 63 28" stroke="#4B3621" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // Meera Reddy (Sunder Lover, dl-n1) - Nature outdoor lover, green windbreaker
  if (id === "dl-n1") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dl-n1-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#dl-n1-grad)" />
        {/* Leaf icon watermark */}
        <path d="M80 30 C75 35, 75 45, 80 50 C85 45, 85 35, 80 30 Z" fill="#FFFFFF" fillOpacity="0.15" />
        
        {/* Neck */}
        <path d="M45 56 L55 56 L55 68 L45 68 Z" fill="#F2BCA0" />
        {/* Windbreaker Jacket */}
        <path d="M26 85 C26 71, 35 65, 50 65 C65 65, 74 71, 74 85 Z" fill="#1F2937" />
        <path d="M35 67 L50 78 L65 67 Z" fill="#059669" />
        <line x1="50" y1="78" x2="50" y2="85" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.7" />
        
        {/* Face */}
        <path d="M37 41 C37 31, 42 26, 50 26 C58 26, 63 31, 63 41 C63 51, 58 55, 50 55 C42 55, 37 51, 37 41 Z" fill="#F2BCA0" />
        
        {/* Eyes & blush */}
        <circle cx="45" cy="38" r="1.5" fill="#111827" />
        <circle cx="55" cy="38" r="1.5" fill="#111827" />
        <circle cx="42" cy="42" r="2.5" fill="#EF4444" fillOpacity="0.25" />
        <circle cx="58" cy="42" r="2.5" fill="#EF4444" fillOpacity="0.25" />
        <path d="M47 47 C48 49, 52 49, 53 47" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Braided long hair */}
        <path d="M34 35 C34 22, 40 18, 50 18 C60 18, 66 35, 66 45 C66 52, 63 52, 63 46 C63 36, 37 36, 37 46 C37 52, 34 52, 34 35 Z" fill="#111827" />
        <circle cx="33" cy="50" r="4" fill="#111827" />
        <circle cx="32" cy="56" r="3.5" fill="#111827" />
        <circle cx="67" cy="50" r="4" fill="#111827" />
        <circle cx="68" cy="56" r="3.5" fill="#111827" />
      </svg>
    );
  }

  // Ananya Kapoor (Creative Mind, nd-c1) - Red beret, yellow background
  if (id === "nd-c1") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="nd-c1-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#nd-c1-grad)" />
        {/* Sparkle watermark */}
        <path d="M80 25 L82 29 L86 30 L82 31 L80 35 L78 31 L74 30 L78 29 Z" fill="#FFFFFF" fillOpacity="0.25" />
        
        {/* Neck */}
        <path d="M45 56 L55 56 L55 68 L45 68 Z" fill="#ECC19C" />
        {/* Striped shirt & red dungarees */}
        <path d="M28 85 C28 72, 36 66, 50 66 C64 66, 72 72, 72 85 Z" fill="#111827" />
        <path d="M34 66 L36 85 M40 66 L42 85 M60 66 L58 85 M66 66 L64 85" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.3" />
        <path d="M38 72 C38 85, 62 85, 62 72 Z" fill="#DC2626" />
        
        {/* Face */}
        <path d="M37 42 C37 31, 42 26, 50 26 C58 26, 63 31, 63 42 C63 52, 58 56, 50 56 C42 56, 37 52, 37 42 Z" fill="#FFDFD0" />
        
        {/* Eyes & smile */}
        <circle cx="45" cy="39" r="1.5" fill="#111827" />
        <circle cx="55" cy="39" r="1.5" fill="#111827" />
        <path d="M47 48 C48 50, 52 50, 53 48" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Hair & Red Beret */}
        <circle cx="50" cy="18" r="9" fill="#2D1A0A" />
        <path d="M32 38 C32 25, 40 22, 50 22 C60 22, 68 25, 68 38 C68 45, 64 45, 62 39 C55 33, 45 33, 38 39 C36 45, 32 45, 32 38 Z" fill="#4B331A" />
        <path d="M30 24 C36 15, 64 15, 70 24 Z" fill="#DC2626" />
        <path d="M48 14 L52 14 L50 10 Z" fill="#DC2626" />
      </svg>
    );
  }

  // Karan Prasad (Smash Champion, nd-s1) - Sports headband, athletic style
  if (id === "nd-s1") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="nd-s1-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#nd-s1-grad)" />
        {/* Athletic design */}
        <path d="M20 20 L40 15 L25 35 L45 35 L15 70 L30 45 L15 45 Z" fill="#FFFFFF" fillOpacity="0.1" />
        
        {/* Neck */}
        <path d="M44 56 L56 56 L56 68 L44 68 Z" fill="#E2A17C" />
        {/* Blue track jersey */}
        <path d="M26 85 C26 71, 35 65, 50 65 C65 65, 74 71, 74 85 Z" fill="#2563EB" />
        <path d="M48 65 L48 85" stroke="#FFFFFF" strokeWidth="2.5" />
        <circle cx="48" cy="69" r="2" fill="#FBBF24" />
        
        {/* Face */}
        <path d="M36 41 C36 30, 42 25, 50 25 C58 25, 64 30, 64 41 C64 52, 58 56, 50 56 C42 56, 36 52, 36 41 Z" fill="#F1B694" />
        
        {/* Eyes & active smile */}
        <circle cx="44" cy="38" r="1.8" fill="#111827" />
        <circle cx="56" cy="38" r="1.8" fill="#111827" />
        <path d="M46 47 C48 50, 52 50, 54 47" stroke="#111827" strokeWidth="2" strokeLinecap="round" fill="none" />
        
        {/* Spiky hair with red headband */}
        <path d="M32 30 C32 18, 38 12, 50 12 C62 12, 68 18, 68 30 Z" fill="#111827" />
        <path d="M34 28 H66 V32 H34 Z" fill="#EF4444" />
        <rect x="46" y="27" width="8" height="6" fill="#FFFFFF" rx="1" />
      </svg>
    );
  }

  // Vikram Sen (Road Tripper, nd-n1) - Orange beanie, traveler look, rugged background
  if (id === "nd-n1") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="nd-n1-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#nd-n1-grad)" />
        <path d="M10 85 L35 45 L50 65 L75 35 L90 85 Z" fill="#FFFFFF" fillOpacity="0.06" />
        
        {/* Neck */}
        <path d="M44 56 L56 56 L56 68 L44 68 Z" fill="#DF9F7E" />
        {/* Yellow/Amber traveler coat & green scarf */}
        <path d="M26 85 C26 71, 35 66, 50 66 C65 66, 74 71, 74 85 Z" fill="#D97706" />
        <path d="M38 66 C38 62, 62 62, 62 66 Z" fill="#047857" />
        
        {/* Face & stubble beard */}
        <path d="M36 41 C36 30, 42 25, 50 25 C58 25, 64 30, 64 41 C64 52, 58 56, 50 56 C42 56, 36 52, 36 41 Z" fill="#EDAC8D" />
        <path d="M36 41 C36 49, 41 56, 50 56 C59 56, 64 49, 64 41 C64 43, 62 47, 50 47 C38 47, 36 43, 36 41 Z" fill="#111827" fillOpacity="0.3" />
        
        {/* Eyes */}
        <circle cx="44" cy="37" r="1.5" fill="#111827" />
        <circle cx="56" cy="37" r="1.5" fill="#111827" />
        <path d="M46 45 C48 47, 52 47, 54 45" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Knit Beanie Hat */}
        <path d="M33 28 C33 16, 42 12, 50 12 C58 12, 67 16, 67 28 Z" fill="#EA580C" />
        <path d="M31 25 H69 V29 H31 Z" fill="#C2410C" rx="1" />
      </svg>
    );
  }

  // Aaryan Gupta (Startup Nomad, gr-t2) - Entrepreneur grey suit, airpods
  if (id === "gr-t2") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gr-t2-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#gr-t2-grad)" />
        {/* Grid watermark */}
        <line x1="25" y1="0" x2="25" y2="100" stroke="#FFFFFF" strokeOpacity="0.04" />
        <line x1="75" y1="0" x2="75" y2="100" stroke="#FFFFFF" strokeOpacity="0.04" />
        
        {/* Neck */}
        <path d="M44 56 L56 56 L56 68 L44 68 Z" fill="#E8B091" />
        {/* Grey blazer & dark tee */}
        <path d="M26 85 C26 71, 35 66, 50 66 C65 66, 74 71, 74 85 Z" fill="#1E293B" />
        <path d="M22 85 L36 68 L42 85 Z" fill="#475569" stroke="#1E293B" strokeWidth="1" />
        <path d="M78 85 L64 68 L58 85 Z" fill="#475569" stroke="#1E293B" strokeWidth="1" />
        
        {/* Face */}
        <path d="M36 41 C36 30, 42 25, 50 25 C58 25, 64 30, 64 41 C64 52, 58 56, 50 56 C42 56, 36 52, 36 41 Z" fill="#FBC1A2" />
        
        {/* Wireless Airpods */}
        <path d="M34 40 L34 45 L32 45" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M66 40 L66 45 L68 45" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Eyes */}
        <circle cx="44" cy="38" r="1.5" fill="#111827" />
        <circle cx="56" cy="38" r="1.5" fill="#111827" />
        <path d="M46 47 C48 49, 52 49, 54 47" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Sleek part hair */}
        <path d="M33 30 C33 18, 42 12, 50 14 C58 12, 67 18, 67 30 C60 26, 53 28, 50 30 C47 28, 40 26, 33 30 Z" fill="#1F2937" />
      </svg>
    );
  }

  // Shruti Aggarwal (Poetry & Jam, gr-t1) - Creative musical girl, flower headband, pink/purple
  if (id === "gr-t1") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gr-t1-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#gr-t1-grad)" />
        {/* Melody wave watermark */}
        <path d="M15 50 Q25 35 35 50 T55 50 T75 50 T95 50" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.15" fill="none" />
        
        {/* Neck */}
        <path d="M45 56 L55 56 L55 68 L45 68 Z" fill="#ECC3A9" />
        {/* Indigo artistic dress */}
        <path d="M28 85 C28 72, 36 66, 50 66 C64 66, 72 72, 72 85 Z" fill="#312E81" />
        <path d="M45 66 L50 75 L55 66 Z" fill="#EC4899" />
        
        {/* Face */}
        <path d="M37 41 C37 30, 42 25, 50 25 C58 25, 63 30, 63 41 C63 51, 58 55, 50 55 C42 55, 37 51, 37 41 Z" fill="#FFE2D1" />
        
        {/* Eyes & lovely smile */}
        <circle cx="45" cy="37" r="1.5" fill="#111827" />
        <circle cx="55" cy="37" r="1.5" fill="#111827" />
        <path d="M45 46 C47 49, 53 49, 55 46" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" fill="none" />
        
        {/* Pretty hair & cute flower slide */}
        <path d="M34 32 C34 20, 40 16, 50 16 C60 16, 66 20, 66 32 C66 45, 63 45, 62 40 C55 34, 45 34, 38 40 C37 45, 34 45, 34 32 Z" fill="#111827" />
        <path d="M35 24 C40 18, 60 18, 65 24" stroke="#EC4899" strokeWidth="2" fill="none" />
        <circle cx="37" cy="22" r="2.5" fill="#FBBF24" />
      </svg>
    );
  }

  // Muba Mehta (Festival Buddy, gr-d1) - Festival buddy with party glasses
  if (id === "gr-d1") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gr-d1-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#gr-d1-grad)" />
        {/* Festive sparkles */}
        <path d="M25 30 L27 34 L31 35 L27 36 L25 40 L23 36 L19 35 L23 34 Z" fill="#FBBF24" fillOpacity="0.3" />
        <path d="M75 70 L77 74 L81 75 L77 76 L75 80 L73 76 L69 75 L73 74 Z" fill="#FBBF24" fillOpacity="0.3" />
        
        {/* Neck */}
        <path d="M44 56 L56 56 L56 68 L44 68 Z" fill="#E5A381" />
        {/* Bright festival printed shirt */}
        <path d="M26 85 C26 71, 35 65, 50 65 C65 65, 74 71, 74 85 Z" fill="#EF4444" />
        <path d="M35 72 L45 65 L48 85" fill="#FBBF24" />
        <path d="M65 72 L55 65 L52 85" fill="#3B82F6" />
        
        {/* Face & stubble beard */}
        <path d="M36 41 C36 30, 42 25, 50 25 C58 25, 64 30, 64 41 C64 52, 58 56, 50 56 C42 56, 36 52, 36 41 Z" fill="#EDAC8E" />
        <path d="M36 41 C36 48, 41 54, 50 54 C59 54, 64 48, 64 41 C64 43, 62 46, 50 46 C38 46, 36 43, 36 41 Z" fill="#1F2937" fillOpacity="0.3" />
        
        {/* Yellow festival shades */}
        <rect x="38" y="34" width="11" height="8" rx="2" fill="#FBBF24" stroke="#111827" strokeWidth="1.5" />
        <rect x="51" y="34" width="11" height="8" rx="2" fill="#FBBF24" stroke="#111827" strokeWidth="1.5" />
        <line x1="49" y1="36" x2="51" y2="36" stroke="#111827" strokeWidth="1.5" />
        <path d="M47 47 C48 49, 52 49, 53 47" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        
        {/* Curly hair */}
        <circle cx="36" cy="28" r="6" fill="#111827" />
        <circle cx="43" cy="22" r="7" fill="#111827" />
        <circle cx="51" cy="21" r="7" fill="#111827" />
        <circle cx="58" cy="23" r="7" fill="#111827" />
        <circle cx="65" cy="29" r="6" fill="#111827" />
        <circle cx="34" cy="34" r="5" fill="#111827" />
        <circle cx="67" cy="34" r="5" fill="#111827" />
      </svg>
    );
  }

  // Priya Sharma (Acoustic Jam, dl-l2 / vs2) - Tech AI developer & guitarist with cyan headphones
  if (id === "dl-l2" || id === "vs2") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dl-l2-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#dl-l2-grad)" />
        {/* Musical note watermark */}
        <path d="M70 25 L85 20 L85 45 C83 44, 80 44, 78 46 C75 48, 75 52, 78 54 C81 56, 85 55, 87 51 C88 50, 88 20, 88 20 L68 25 Z" fill="#FFFFFF" fillOpacity="0.15" />
        {/* Neck */}
        <path d="M45 56 L55 56 L55 68 L45 68 Z" fill="#F5C39E" />
        {/* Denim jacket */}
        <path d="M28 85 C28 72, 36 66, 50 66 C64 66, 72 72, 72 85 Z" fill="#1E3A8A" />
        <path d="M40 66 L50 78 L60 66 Z" fill="#38BDF8" />
        {/* Face */}
        <path d="M37 41 C37 31, 42 26, 50 26 C58 26, 63 31, 63 41 C63 52, 58 56, 50 56 C42 56, 37 52, 37 41 Z" fill="#F5C39E" />
        {/* Eyes & smile */}
        <circle cx="44" cy="38" r="1.8" fill="#111827" />
        <circle cx="56" cy="38" r="1.8" fill="#111827" />
        <path d="M46 47 C48 50, 52 50, 54 47" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Cyan Studio Headphones */}
        <path d="M31 38 C31 20, 69 20, 69 38" stroke="#06B6D4" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="28" y="35" width="6" height="12" rx="3" fill="#06B6D4" />
        <rect x="66" y="35" width="6" height="12" rx="3" fill="#06B6D4" />
        {/* Hair with cool bangs */}
        <path d="M34 32 C34 20, 42 16, 50 16 C58 16, 66 20, 66 32 C66 42, 63 42, 62 38 C55 32, 45 32, 38 38 C37 42, 34 42, 34 32 Z" fill="#18181B" />
      </svg>
    );
  }

  // Kabir Verma (Lodhi Sunset Photowalk, dl-l3 / vs3) - Filmmaker with vintage camera & hat
  if (id === "dl-l3" || id === "vs3") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dl-l3-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#BE123C" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#dl-l3-grad)" />
        {/* Camera aperture watermark */}
        <circle cx="22" cy="25" r="12" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.15" fill="none" />
        <circle cx="22" cy="25" r="6" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.15" fill="none" />
        {/* Neck */}
        <path d="M44 56 L56 56 L56 68 L44 68 Z" fill="#E5A381" />
        {/* Burgundy coat & mustard scarf */}
        <path d="M26 85 C26 71, 35 66, 50 66 C65 66, 74 71, 74 85 Z" fill="#881337" />
        <path d="M38 66 C38 62, 62 62, 62 66 Z" fill="#D97706" />
        {/* Face */}
        <path d="M36 41 C36 30, 42 25, 50 25 C58 25, 64 30, 64 41 C64 52, 58 56, 50 56 C42 56, 36 52, 36 41 Z" fill="#E5A381" />
        {/* Camera strap across chest */}
        <line x1="30" y1="85" x2="68" y2="68" stroke="#111827" strokeWidth="2.5" />
        {/* Eyes & groomed mustache */}
        <circle cx="44" cy="38" r="1.5" fill="#111827" />
        <circle cx="56" cy="38" r="1.5" fill="#111827" />
        <path d="M44 45 Q50 48 56 45" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Vintage fedora hat */}
        <path d="M25 28 Q50 22 75 28 L72 23 Q50 18 28 23 Z" fill="#1E293B" />
        <path d="M33 24 Q50 12 67 24 Z" fill="#334155" />
        <rect x="33" y="22" width="34" height="3" fill="#BE123C" />
      </svg>
    );
  }

  // Ananya Kapoor (Badminton Rally, dl-l4 / vs4) - Sports headband & emerald jersey
  if (id === "dl-l4" || id === "vs4") {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dl-l4-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#dl-l4-grad)" />
        {/* Shuttlecock watermark */}
        <path d="M80 30 L88 20 M82 32 L92 25 M80 34 L90 32" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.2" />
        <circle cx="78" cy="35" r="3" fill="#FFFFFF" fillOpacity="0.3" />
        {/* Neck */}
        <path d="M45 56 L55 56 L55 68 L45 68 Z" fill="#FFE2D1" />
        {/* Emerald athletic jersey */}
        <path d="M28 85 C28 72, 36 66, 50 66 C64 66, 72 72, 72 85 Z" fill="#047857" />
        <path d="M45 66 L50 74 L55 66 Z" fill="#34D399" />
        {/* Face */}
        <path d="M37 41 C37 30, 42 25, 50 25 C58 25, 63 30, 63 41 C63 51, 58 55, 50 55 C42 55, 37 51, 37 41 Z" fill="#FFE2D1" />
        {/* Eyes & active smile */}
        <circle cx="45" cy="37" r="1.5" fill="#111827" />
        <circle cx="55" cy="37" r="1.5" fill="#111827" />
        <path d="M46 46 C48 49, 52 49, 54 46" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* High ponytail & sports headband */}
        <circle cx="68" cy="22" r="8" fill="#111827" />
        <path d="M34 32 C34 20, 40 16, 50 16 C60 16, 66 20, 66 32 Z" fill="#111827" />
        <rect x="33" y="25" width="34" height="5" rx="2" fill="#F43F5E" />
      </svg>
    );
  }

  // Fallback characteristic cartoon animal avatar generated deterministically based on id
  return <HashAnimalAvatar id={id} className={className} />;
}

// Deterministic Cartoon Animal Avatar Generator for Any Profile ID
function HashAnimalAvatar({ id, className = "w-full h-full" }: { id: string; className?: string }) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }

  const gradients = [
    { start: "#3B82F6", end: "#1E1B4B" },
    { start: "#EC4899", end: "#8B5CF6" },
    { start: "#10B981", end: "#065F46" },
    { start: "#F59E0B", end: "#9A3412" },
    { start: "#06B6D4", end: "#1E3A8A" },
    { start: "#8B5CF6", end: "#4C1D95" },
    { start: "#EF4444", end: "#881337" },
    { start: "#64748B", end: "#0F172A" },
  ];
  const grad = gradients[hash % gradients.length];
  const animalType = (hash >> 2) % 8;
  const accessoryType = (hash >> 5) % 5;
  const furColors = ["#D97706", "#EA580C", "#374151", "#4B5563", "#059669", "#2563EB", "#7C3AED", "#CA8A04"];
  const fur = furColors[(hash >> 8) % furColors.length];
  const gradId = `hash-grad-${hash}`;

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={grad.start} />
          <stop offset="100%" stopColor={grad.end} />
        </linearGradient>
      </defs>
      
      <circle cx="50" cy="50" r="48" fill={`url(#${gradId})`} />
      <circle cx="50" cy="50" r="46" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.15" />

      {/* ANIMAL TYPE 0: FOX */}
      {animalType === 0 && (
        <g>
          <polygon points="25,40 33,18 43,32" fill="#EA580C" />
          <polygon points="28,38 33,22 40,32" fill="#FFEDD5" />
          <polygon points="75,40 67,18 57,32" fill="#EA580C" />
          <polygon points="72,38 67,22 60,32" fill="#FFEDD5" />
          <path d="M25 88 C25 72, 35 68, 50 68 C65 68, 75 72, 75 88 Z" fill="#C2410C" />
          <circle cx="50" cy="48" r="23" fill="#EA580C" />
          <path d="M36 50 Q50 65 64 50 Q50 44 36 50 Z" fill="#FFF7ED" />
          <ellipse cx="50" cy="48" rx="4" ry="3" fill="#111827" />
          <circle cx="41" cy="42" r="2" fill="#111827" />
          <circle cx="59" cy="42" r="2" fill="#111827" />
          <path d="M46 54 Q50 57 54 54" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* ANIMAL TYPE 1: BEAR */}
      {animalType === 1 && (
        <g>
          <circle cx="32" cy="28" r="9" fill={fur} />
          <circle cx="32" cy="28" r="5" fill="#FDE68A" />
          <circle cx="68" cy="28" r="9" fill={fur} />
          <circle cx="68" cy="28" r="5" fill="#FDE68A" />
          <path d="M25 88 C25 72, 35 68, 50 68 C65 68, 75 72, 75 88 Z" fill={fur} />
          <circle cx="50" cy="48" r="24" fill={fur} />
          <ellipse cx="50" cy="53" rx="11" ry="8" fill="#FDE68A" />
          <ellipse cx="50" cy="49" rx="4" ry="3" fill="#1E1B4B" />
          <circle cx="41" cy="43" r="2" fill="#111827" />
          <circle cx="59" cy="43" r="2" fill="#111827" />
          <path d="M46 56 Q50 59 54 56" stroke="#1E1B4B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* ANIMAL TYPE 2: OWL */}
      {animalType === 2 && (
        <g>
          <polygon points="30,32 38,15 45,30" fill="#7C3AED" />
          <polygon points="70,32 62,15 55,30" fill="#7C3AED" />
          <path d="M26 88 C26 70, 36 66, 50 66 C64 66, 74 70, 74 88 Z" fill="#6D28D9" />
          <circle cx="50" cy="46" r="24" fill="#7C3AED" />
          <circle cx="40" cy="43" r="9" fill="#FFFBEB" />
          <circle cx="60" cy="43" r="9" fill="#FFFBEB" />
          <circle cx="40" cy="43" r="4" fill="#111827" />
          <circle cx="60" cy="43" r="4" fill="#111827" />
          <polygon points="46,48 54,48 50,56" fill="#F59E0B" />
        </g>
      )}

      {/* ANIMAL TYPE 3: CAT */}
      {animalType === 3 && (
        <g>
          <polygon points="28,38 35,20 44,32" fill="#EC4899" />
          <polygon points="31,36 35,23 41,32" fill="#FBCFE8" />
          <polygon points="72,38 65,20 56,32" fill="#EC4899" />
          <polygon points="69,36 65,23 59,32" fill="#FBCFE8" />
          <path d="M25 88 C25 72, 35 68, 50 68 C65 68, 75 72, 75 88 Z" fill="#DB2777" />
          <circle cx="50" cy="48" r="23" fill="#EC4899" />
          <circle cx="45" cy="52" r="4" fill="#FDF2F8" />
          <circle cx="55" cy="52" r="4" fill="#FDF2F8" />
          <polygon points="48,49 52,49 50,52" fill="#BE185D" />
          <line x1="30" y1="48" x2="42" y2="50" stroke="#111827" strokeWidth="1" />
          <line x1="30" y1="53" x2="42" y2="52" stroke="#111827" strokeWidth="1" />
          <line x1="70" y1="48" x2="58" y2="50" stroke="#111827" strokeWidth="1" />
          <line x1="70" y1="53" x2="58" y2="52" stroke="#111827" strokeWidth="1" />
          <ellipse cx="40" cy="43" rx="2" ry="3" fill="#111827" />
          <ellipse cx="60" cy="43" rx="2" ry="3" fill="#111827" />
        </g>
      )}

      {/* ANIMAL TYPE 4: PANDA */}
      {animalType === 4 && (
        <g>
          <circle cx="32" cy="28" r="9" fill="#111827" />
          <circle cx="68" cy="28" r="9" fill="#111827" />
          <path d="M25 88 C25 72, 35 68, 50 68 C65 68, 75 72, 75 88 Z" fill="#111827" />
          <circle cx="50" cy="48" r="24" fill="#F9FAFB" />
          <ellipse cx="40" cy="44" rx="6" ry="8" fill="#111827" transform="rotate(-15 40 44)" />
          <ellipse cx="60" cy="44" rx="6" ry="8" fill="#111827" transform="rotate(15 60 44)" />
          <circle cx="41" cy="44" r="2" fill="#FFFFFF" />
          <circle cx="59" cy="44" r="2" fill="#FFFFFF" />
          <ellipse cx="50" cy="52" rx="4" ry="2.5" fill="#111827" />
          <path d="M46 56 Q50 59 54 56" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* ANIMAL TYPE 5: BUNNY */}
      {animalType === 5 && (
        <g>
          <ellipse cx="38" cy="22" rx="6" ry="16" fill="#F472B6" />
          <ellipse cx="38" cy="22" rx="3.5" ry="11" fill="#FCE7F3" />
          <ellipse cx="62" cy="22" rx="6" ry="16" fill="#F472B6" />
          <ellipse cx="62" cy="22" rx="3.5" ry="11" fill="#FCE7F3" />
          <path d="M25 88 C25 72, 35 68, 50 68 C65 68, 75 72, 75 88 Z" fill="#EC4899" />
          <circle cx="50" cy="50" r="22" fill="#F472B6" />
          <polygon points="48,50 52,50 50,53" fill="#BE185D" />
          <path d="M46 56 Q50 58 54 56" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <circle cx="41" cy="44" r="2" fill="#111827" />
          <circle cx="59" cy="44" r="2" fill="#111827" />
        </g>
      )}

      {/* ANIMAL TYPE 6: LION */}
      {animalType === 6 && (
        <g>
          <circle cx="50" cy="46" r="30" fill="#D97706" />
          <circle cx="50" cy="46" r="22" fill="#FBBF24" />
          <path d="M25 88 C25 72, 35 68, 50 68 C65 68, 75 72, 75 88 Z" fill="#B45309" />
          <ellipse cx="50" cy="51" rx="8" ry="6" fill="#FEF3C7" />
          <polygon points="46,47 54,47 50,51" fill="#78350F" />
          <circle cx="42" cy="42" r="2" fill="#111827" />
          <circle cx="58" cy="42" r="2" fill="#111827" />
          <path d="M46 54 Q50 57 54 54" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* ANIMAL TYPE 7: KOALA */}
      {animalType === 7 && (
        <g>
          <circle cx="28" cy="32" r="12" fill="#6B7280" />
          <circle cx="28" cy="32" r="7" fill="#E5E7EB" />
          <circle cx="72" cy="32" r="12" fill="#6B7280" />
          <circle cx="72" cy="32" r="7" fill="#E5E7EB" />
          <path d="M25 88 C25 72, 35 68, 50 68 C65 68, 75 72, 75 88 Z" fill="#4B5563" />
          <circle cx="50" cy="48" r="23" fill="#9CA3AF" />
          <ellipse cx="50" cy="49" rx="6" ry="9" fill="#111827" />
          <circle cx="39" cy="42" r="2" fill="#111827" />
          <circle cx="61" cy="42" r="2" fill="#111827" />
          <path d="M45 59 Q50 61 55 59" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* ACCESSORIES */}
      {accessoryType === 0 && (
        <g>
          <circle cx="40" cy="43" r="6" stroke="#111827" strokeWidth="2" fill="none" />
          <circle cx="60" cy="43" r="6" stroke="#111827" strokeWidth="2" fill="none" />
          <line x1="46" y1="43" x2="54" y2="43" stroke="#111827" strokeWidth="2" />
        </g>
      )}
      {accessoryType === 1 && (
        <g>
          <path d="M30 40 C30 20, 70 20, 70 40" stroke="#06B6D4" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <rect x="26" y="36" width="7" height="12" rx="3" fill="#06B6D4" />
          <rect x="67" y="36" width="7" height="12" rx="3" fill="#06B6D4" />
        </g>
      )}
      {accessoryType === 2 && (
        <g>
          <polygon points="50,8 38,28 62,28" fill="#FBBF24" />
          <circle cx="50" cy="8" r="3" fill="#EF4444" />
        </g>
      )}
      {accessoryType === 3 && (
        <g>
          <rect x="30" y="30" width="40" height="6" rx="2" fill="#EF4444" />
          <circle cx="50" cy="33" r="2" fill="#FFFFFF" />
        </g>
      )}
      {accessoryType === 4 && (
        <g>
          <polygon points="40,68 50,72 40,76" fill="#EC4899" />
          <polygon points="60,68 50,72 60,76" fill="#EC4899" />
          <circle cx="50" cy="72" r="2.5" fill="#BE185D" />
        </g>
      )}
    </svg>
  );
}

interface Companion {
  id: string;
  name: string;
  age: number;
  avatar: string;
  vibeScore: string;
  badge: string;
  bio: string;
}

const companionsByCityAndVibe: Record<string, Record<string, Companion[]>> = {
  Delhi: {
    learn: [
      { id: "dl-l1", name: "Rohan Malhotra", age: 26, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", vibeScore: "9.7", badge: "Chess Master", bio: "Can talk endlessly about chess tactics, strategies, and deep mental models. Let's play a friendly game!" }
    ],
    connections: [
      { id: "dl-c1", name: "Aditi Sharma", age: 24, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", vibeScore: "9.9", badge: "Vinyl Collector", bio: "Obsessed with cozy coffee conversations and magic realism books. Let's trace stories together." }
    ],
    explore: [
      { id: "dl-n1", name: "Meera Reddy", age: 25, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200", vibeScore: "9.8", badge: "Sunder Lover", bio: "Sunder Nursery's lake trails are my second home. Let's spot parakeets and explore local street food." }
    ]
  },
  Noida: {
    connections: [
      { id: "nd-c1", name: "Ananya Kapoor", age: 23, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", vibeScore: "9.8", badge: "Creative Mind", bio: "Let's sit in a hidden rustic cafe and enjoy deep, unhurried conversations about cinema & life." }
    ],
    active: [
      { id: "nd-s1", name: "Karan Prasad", age: 25, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", vibeScore: "9.9", badge: "Smash Champion", bio: "Friendly badminton and running partner. Ready for cooperative rallies and high-energy runs!" }
    ],
    explore: [
      { id: "nd-n1", name: "Vikram Sen", age: 27, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200", vibeScore: "9.5", badge: "Road Tripper", bio: "Okhla Bird Sanctuary is amazing during sunsets. Let's explore scenic lakes and hidden food joints." }
    ]
  },
  Gurgaon: {
    career: [
      { id: "gr-t2", name: "Aaryan Gupta", age: 27, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200", vibeScore: "9.7", badge: "Startup Nomad", bio: "Pitching venture concepts on paper napkins. Let's secure a desk at CyberHub and network." }
    ],
    express: [
      { id: "gr-t1", name: "Shruti Aggarwal", age: 24, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", vibeScore: "9.8", badge: "Poetry & Jam", bio: "Acoustic music lover and sketch companion. Let's meet at a cozy open-mic cafe and express ourselves." }
    ],
    celebrate: [
      { id: "gr-d1", name: "Muba Mehta", age: 26, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", vibeScore: "9.9", badge: "Festival Buddy", bio: "Concert goer, Garba fan, and travel companion. Let's count down New Year's Eve together!" }
    ]
  }
};

const venuesByCityAndVibe: Record<string, Record<string, string[]>> = {
  Delhi: {
    learn: ["Sunder Nursery Library", "Delhi Guitar Academy, Saket", "Habitat World Auditorium"],
    connections: ["Blue Tokai, Khan Market", "Third Wave Coffee, CP", "Savor Cafe, Lodhi Colony"],
    explore: ["Sunder Nursery Lakefront", "Lodi Garden Rose Corridor", "Chandni Chowk Food Trails"]
  },
  Noida: {
    connections: ["The Reader's Cafe, Sector 18", "The Book Cover, Sector 104", "Third Wave Coffee, Sector 62"],
    active: ["Sector 62 Sports Arena", "Noida Stadium Courts", "Cult Fit Play Arena"],
    explore: ["Okhla Bird Sanctuary", "Noida Botanical Garden", "Sector 50 Hidden Cafes"]
  },
  Gurgaon: {
    career: ["WeWork Club, CyberHub", "Innov8 Lounge, Sector 54", "The Forest Cowork, Sector 45"],
    express: ["The Piano Man Jazz Club", "Friction Cafe Open Stage", "Sector 29 Acoustic Lounge"],
    celebrate: ["CyberHub Central Arena", "The Lodhi event lawns", "Ambience Mall Concert stage"]
  }
};

const COMPANION_SPOTS: Record<string, string[]> = {
  "dl-l1": ["Third Wave Coffee, CP", "Sunder Nursery Library", "Habitat Centre"],
  "dl-c1": ["Blue Tokai, Khan Market", "Savor Cafe, Lodhi Colony", "Third Wave Coffee, CP"],
  "dl-n1": ["Sunder Nursery Lakefront", "Lodi Garden Rose Corridor", "Safdarjung Tomb"],
  "nd-c1": ["The Reader's Cafe, Sector 18", "The Book Cover, Sector 104", "Third Wave Coffee, Sector 62"],
  "nd-s1": ["Noida Stadium Courts", "Sector 62 Sports Arena", "Cult Fit Play Arena"],
  "nd-n1": ["Okhla Bird Sanctuary", "Noida Botanical Garden", "Sector 50 Hidden Cafes"],
  "gr-t2": ["WeWork Club, CyberHub", "Innov8 Lounge, Sector 54", "Unitech Cyber Park"],
  "gr-t1": ["The Piano Man Jazz Club", "Friction Cafe Open Stage", "Sector 29 Acoustic Lounge"],
  "gr-d1": ["CyberHub Central Arena", "The Lodhi event lawns", "DLF Phase 3 Club"]
};

export default function InteractiveAppDemo() {
  const [selectedCity, setSelectedCity] = useState<"Delhi" | "Noida" | "Gurgaon">("Delhi");

  // User Profile & Achievements State
  const [simTab, setSimTab] = useState<"explore" | "profile">("explore");
  const [userName, setUserName] = useState("Aditya Sen");
  const [isEditingName, setIsEditingName] = useState(false);
  const [reliabilityScore, setReliabilityScore] = useState(94);
  const [hangoutsCount, setHangoutsCount] = useState(0);
  const [exploredVibes, setExploredVibes] = useState<string[]>(["connections"]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeBadgeUnlock, setActiveBadgeUnlock] = useState<{
    title: string;
    description: string;
    gradient: string;
    icon: string;
  } | null>(null);
  const [newBadgeUnlockedAlert, setNewBadgeUnlockedAlert] = useState(false);
  const [detailedCompanion, setDetailedCompanion] = useState<Companion | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const triggerBadgeUnlock = (badgeTitle: string) => {
    audio.playConnect();
    setNewBadgeUnlockedAlert(true);
    
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#FBBF24", "#3B82F6", "#EC4899", "#8B5CF6"]
    });

    let details = {
      title: badgeTitle,
      description: "",
      gradient: "from-amber-400 via-orange-500 to-rose-500",
      icon: "Award"
    };

    if (badgeTitle === "Pioneer Explorer") {
      details.description = "Successfully synced your first physical Happy Key and verified your offline arrival.";
      details.gradient = "from-amber-400 to-orange-500";
      details.icon = "Award";
    } else if (badgeTitle === "Apex Anchor") {
      details.description = "Maintained an exceptional reliability score of 98%+ through flawless presence.";
      details.gradient = "from-blue-500 via-indigo-600 to-purple-600";
      details.icon = "Crown";
    } else if (badgeTitle === "Vibe Navigator") {
      details.description = "Explored and matched across 3 or more distinct regional lifestyle avenues.";
      details.gradient = "from-fuchsia-500 to-pink-500";
      details.icon = "Compass";
    }

    setActiveBadgeUnlock(details);
  };
  
  // Available vibes based on current city selection
  const getVibesForCity = () => {
    if (selectedCity === "Delhi") {
      return [
        { key: "learn", label: "Learn Something", icon: <BookOpen className="w-4 h-4" />, emoji: "🌱" },
        { key: "connections", label: "Build Connections", icon: <Coffee className="w-4 h-4" />, emoji: "❤️" },
        { key: "explore", label: "Explore Together", icon: <Compass className="w-4 h-4" />, emoji: "🌍" }
      ];
    } else if (selectedCity === "Noida") {
      return [
        { key: "connections", label: "Build Connections", icon: <Coffee className="w-4 h-4" />, emoji: "❤️" },
        { key: "active", label: "Stay Active", icon: <Dumbbell className="w-4 h-4" />, emoji: "🏸" },
        { key: "explore", label: "Explore Together", icon: <Compass className="w-4 h-4" />, emoji: "🌍" }
      ];
    } else {
      return [
        { key: "career", label: "Build Your Career", icon: <Lightbulb className="w-4 h-4" />, emoji: "💼" },
        { key: "express", label: "Express Yourself", icon: <Film className="w-4 h-4" />, emoji: "🎨" },
        { key: "celebrate", label: "Celebrate Together", icon: <Sparkles className="w-4 h-4" />, emoji: "🎉" }
      ];
    }
  };

  const currentVibes = getVibesForCity();
  const [selectedVibe, setSelectedVibe] = useState("learn");

  // When city changes, reset vibe to the first available for that city
  const handleCityChange = (city: "Delhi" | "Noida" | "Gurgaon") => {
    audio.playClick();
    setSelectedCity(city);
    const vibes = city === "Delhi" ? "learn" : city === "Noida" ? "connections" : "career";
    setSelectedVibe(vibes);
    setSelectedCompanion(null);
    setScheduledTime("");
    setLockStep(1);
    setHappyKeyConnected(false);
    setKeySlider(35);

    // Track explored vibe
    setExploredVibes(prev => {
      if (!prev.includes(vibes)) {
        const next = [...prev, vibes];
        if (next.length === 3) {
          setTimeout(() => triggerBadgeUnlock("Vibe Navigator"), 600);
        }
        return next;
      }
      return prev;
    });
  };

  const handleVibeChange = (vibeKey: string) => {
    audio.playClick();
    setSelectedVibe(vibeKey);
    setSelectedCompanion(null);
    setScheduledTime("");
    setLockStep(1);
    setHappyKeyConnected(false);
    setKeySlider(35);

    // Track explored vibe
    setExploredVibes(prev => {
      if (!prev.includes(vibeKey)) {
        const next = [...prev, vibeKey];
        if (next.length === 3) {
          setTimeout(() => triggerBadgeUnlock("Vibe Navigator"), 600);
        }
        return next;
      }
      return prev;
    });
  };

  // Companion Selection
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  
  // Hangout variables
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [selectedVenue, setSelectedVenue] = useState<string>("");

  // Demo state machine: 
  // Step 1: Browse & Choose companion
  // Step 2: Schedule Time & Choose Vetted Venue
  // Step 3: Tactile Happy Key Verification
  // Step 4: Archived Memory (Success Card!)
  const [lockStep, setLockStep] = useState<number>(1);

  // Happy Key parameters
  const [keySlider, setKeySlider] = useState<number>(35);
  const [happyKeyConnected, setHappyKeyConnected] = useState<boolean>(false);

  // Mock available hours
  const mockTimes = ["4:00 PM (Today)", "5:30 PM (Today)", "7:00 PM (Today)", "8:15 PM (Today)"];

  const companions = companionsByCityAndVibe[selectedCity]?.[selectedVibe] || [];
  const venues = venuesByCityAndVibe[selectedCity]?.[selectedVibe] || [];

  const chooseCompanion = (comp: Companion) => {
    audio.playBeacon();
    setSelectedCompanion(comp);
    setSelectedVenue(venues[0] || "Standard Cafe");
    setLockStep(2);
  };

  const handleBackToStep1 = () => {
    audio.playClick();
    setSelectedCompanion(null);
    setLockStep(1);
  };

  const proceedToHappyKey = () => {
    if (!scheduledTime) {
      alert("Please select a convenient time for the hangout!");
      return;
    }
    audio.playBeacon();
    setLockStep(3);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setKeySlider(val);
    if (val >= 98) {
      // Connect Key trigger
      setHappyKeyConnected(true);
      setKeySlider(100);
      audio.playConnect();

      // Dynamic achievement unlock checking
      setHangoutsCount(prev => {
        const next = prev + 1;
        if (next === 1) {
          // Trigger first hangout badge unlock with 800ms delay for maximum dramatic build-up
          setTimeout(() => triggerBadgeUnlock("Pioneer Explorer"), 800);
        }
        return next;
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#3B82F6", "#60A5FA", "#FFFFFF"]
      });
      setTimeout(() => {
        setLockStep(4);
      }, 1500);
    }
  };

  const resetAllDemo = () => {
    audio.playClick();
    setSelectedCompanion(null);
    setScheduledTime("");
    setLockStep(1);
    setHappyKeyConnected(false);
    setKeySlider(35);
  };

  return (
    <div id="interactive-app-demo" className="mt-16 bg-slate-900 rounded-[44px] p-6 sm:p-10 border border-slate-800 shadow-3xl text-left relative overflow-hidden">
      
      {/* Decorative ambient lighting glow background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

      {/* Title block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-8 mb-8">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3.5">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
            Interactive Companion Simulator
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-[-0.02em] font-display">
            Step Into The Living App
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed font-light">
            Delhi, Noida, and Gurgaon are now active. Try selecting a city, choosing an authentic local vibe, locking in your timing, and sliding the visual safety key.
          </p>
        </div>

        {/* Audio feedback notice */}
        <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-3 self-stretch md:self-auto justify-center">
          <Volume2 className="w-5 h-5 text-blue-400 animate-pulse" />
          <div className="text-left">
            <span className="text-white text-[11px] font-bold block">Sound Integration Live</span>
            <span className="text-slate-500 text-[10px] leading-relaxed block">Enjoy real synthesized chords &amp; haptics</span>
          </div>
        </div>
      </div>

      {/* Main Demo Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Controls & Device (Lg: 4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* City Selection Tabs */}
          <div className="bg-slate-950/90 rounded-3xl p-5 border border-slate-800/80">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-4">
              1. Onboarding Regional Hub
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(["Delhi", "Noida", "Gurgaon"] as const).map((city) => (
                <button
                  key={city}
                  onClick={() => handleCityChange(city)}
                  className={`py-3 px-2 rounded-2xl text-xs font-bold tracking-tight transition-luxury ${
                    selectedCity === city 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/50"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
            <p className="text-slate-500 text-[10px] mt-3 leading-relaxed font-light">
              Only verified residents of the selected NCR district are dynamically queried.
            </p>
          </div>

          {/* Vibe Selection Tabs */}
          <div className="bg-slate-950/90 rounded-3xl p-5 border border-slate-800/80">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-4">
              2. Core Emotional Vibe
            </span>
            <div className="flex flex-col gap-2.5">
              {currentVibes.map((vibe) => (
                <button
                  key={vibe.key}
                  onClick={() => handleVibeChange(vibe.key)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl text-xs font-bold transition-luxury text-left border ${
                    selectedVibe === vibe.key 
                      ? "bg-white text-slate-900 border-white shadow-xl shadow-white/5" 
                      : "bg-slate-900 text-slate-400 border-transparent hover:bg-slate-900/60 hover:text-slate-200"
                  }`}
                >
                  <span className="text-base">{vibe.emoji}</span>
                  <div className="flex-1">
                    <span className="block font-bold">{vibe.label}</span>
                    <span className="text-[9px] text-slate-500 font-normal">Matching open coordinates</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${selectedVibe === vibe.key ? "translate-x-1" : "opacity-30"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Step visual tracker */}
          <div className="bg-slate-950/60 rounded-3xl p-5 border border-slate-900 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">App Flow Status</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <span 
                  key={stepNum} 
                  className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                    lockStep === stepNum 
                      ? "bg-blue-600 text-white animate-pulse" 
                      : lockStep > stepNum 
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" 
                        : "bg-slate-800 text-slate-600"
                  }`}
                >
                  {lockStep > stepNum ? <Check className="w-3 h-3" /> : stepNum}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Phone / Simulation Screen (Lg: 8 columns) */}
        <div className="lg:col-span-8 perspective-2000 py-6">
          {/* Futuristic Smartphone Frame Bezel Wrapper with live 3D floating animation */}
          <div className="relative mx-auto max-w-[440px] lg:max-w-none border-[12px] border-slate-800 rounded-[56px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(59,130,246,0.15)] bg-slate-950 p-2 overflow-hidden transition-all duration-700 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_70px_rgba(59,130,246,0.3)] animate-float-3d-live transform-style-3d">
            
            {/* Top Speaker Notch Bezel */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-full z-40 flex items-center justify-between px-4 shadow-inner border border-slate-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 border border-slate-800/80" />
              <span className="w-8 h-1 bg-slate-800 rounded-full" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-950 border-2 border-blue-900 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse-slow" />
              </span>
            </div>

            {/* Side hardware buttons (Power, Volume) */}
            <div className="absolute -left-[14px] top-28 w-1 h-12 bg-slate-800 rounded-r-md z-10 border-t border-b border-slate-700/60" />
            <div className="absolute -left-[14px] top-44 w-1 h-10 bg-slate-800 rounded-r-md z-10 border-t border-b border-slate-700/60" />
            <div className="absolute -right-[14px] top-36 w-1 h-16 bg-slate-800 rounded-l-md z-10 border-t border-b border-slate-700/60" />

            {/* Inner Phone Screen Content Container */}
            <div className="bg-slate-950 rounded-[44px] border border-slate-900 p-5 sm:p-7 relative min-h-[460px] flex flex-col justify-between overflow-hidden">
              
              {/* Phone Status Bar Row */}
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 px-3 pt-2 pb-3 mb-1 relative z-30 border-b border-slate-900/60">
                <span className="font-semibold text-slate-400">9:41 AM</span>
                <span className="text-[7.5px] uppercase tracking-widest text-blue-500/80 font-black">5G LTE Sync</span>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>📶</span>
                  <span>🔋 98%</span>
                </div>
              </div>
            
            {/* Mesh pattern for device content */}
            <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />

            {/* HEADER SIMULATION WITH TAB SELECTOR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-4 mb-6 gap-3 relative z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { audio.playClick(); setSimTab("explore"); }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-wider uppercase font-black transition-all ${
                    simTab === "explore"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🌐 Avenue Deck
                </button>
                <button
                  onClick={() => { audio.playClick(); setSimTab("profile"); }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-wider uppercase font-black transition-all flex items-center gap-1.5 ${
                    simTab === "profile"
                      ? "bg-white text-slate-950 shadow-md shadow-white/10"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  👤 My Profile
                  {((hangoutsCount >= 1 ? 1 : 0) + (reliabilityScore >= 98 ? 1 : 0) + (exploredVibes.length >= 3 ? 1 : 0)) > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0 border border-slate-950" />
                  )}
                </button>
              </div>

              <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/15 font-mono self-start sm:self-auto">
                {simTab === "profile" ? "Achievements Suite" : `${selectedVibe.toUpperCase()} AVENUE`}
              </span>
            </div>

            {/* TOAST MESSAGE DISPLAYER */}
            {toastMessage && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-white text-[10px] font-bold uppercase px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 z-40 animate-fadeIn font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                {toastMessage}
              </div>
            )}

            {/* EXPLORE AVENUE DECK TAB */}
            {simTab === "explore" && (
              <div className="flex-1 flex flex-col justify-between">

            {/* STAGE MAIN INTERFACE: STEP 1 - CHOOSE COMPANION */}
            {lockStep === 1 && (
              <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-center">
                <div className="text-center py-2 max-w-md mx-auto">
                  <h4 className="text-lg font-bold text-white font-display tracking-tight">Select Genuine Companion</h4>
                  <p className="text-slate-400 text-xs mt-1 font-light leading-relaxed">
                    Double-vetted biometrically for safety. Click any companion's profile to view their detailed spots &amp; credentials.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companions.map((comp) => (
                    <div 
                      key={comp.id}
                      className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-[24px] hover:border-blue-500/30 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between gap-4 relative group"
                    >
                      {/* Interactive click indicator */}
                      <button 
                        onClick={() => {
                          audio.playPageTransition();
                          setDetailedCompanion(comp);
                        }}
                        className="absolute top-3 right-3 text-[8px] text-blue-400 border border-blue-500/20 bg-blue-950/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono opacity-60 group-hover:opacity-100 transition-opacity"
                      >
                        🔍 Details
                      </button>

                      <div 
                        onClick={() => {
                          audio.playPageTransition();
                          setDetailedCompanion(comp);
                        }}
                        className="flex gap-3.5 cursor-pointer text-left"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-slate-800 bg-slate-900 group-hover:border-blue-500/40 transition-colors">
                          <CharacteristicAvatar id={comp.id} className="w-full h-full" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-white text-sm truncate group-hover:text-blue-400 transition-colors">{comp.name}</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest">{comp.badge}</span>
                            <span className="text-slate-600 text-[10px]">•</span>
                            <span className="text-slate-400 text-[10px] font-mono">{comp.vibeScore} Vibe</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-400 text-[11px] leading-relaxed font-light text-left">
                        "{comp.bio}"
                      </p>

                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => {
                            audio.playPageTransition();
                            setDetailedCompanion(comp);
                          }}
                          className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all text-center"
                        >
                          View Portfolio
                        </button>
                        <button
                          onClick={() => chooseCompanion(comp)}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-1.5"
                        >
                          Book Now
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {companions.length === 0 && (
                    <div className="col-span-2 py-12 text-center text-slate-500">
                      No matching verified profiles active on this block right now.
                    </div>
                  )}
                </div>

                {/* Explicit download app callout right below the suggested companion grid */}
                <div className="bg-slate-950 border border-slate-900/60 p-4.5 rounded-3xl text-center space-y-2.5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial-at-t from-blue-500/[0.03] to-transparent pointer-events-none" />
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Want to lock in your match right now? <span className="text-blue-400 font-extrabold uppercase tracking-wide text-[11px] block sm:inline mt-0.5">Book your companion.. download app now!</span>
                  </p>
                  <div className="flex items-center justify-center gap-2.5">
                    <a
                      href="#download"
                      onClick={() => audio.playPageTransition()}
                      className="px-4.5 py-2 bg-slate-900 hover:bg-slate-850 border border-white/5 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      🤖 Android APK
                    </a>
                    <a
                      href="#download"
                      onClick={() => audio.playPageTransition()}
                      className="px-4.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10 transition-all"
                    >
                      🍏 Apple iOS
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE MAIN INTERFACE: STEP 2 - SCHEDULE & VENUE */}
            {lockStep === 2 && selectedCompanion && (
              <div className="space-y-6 relative z-10 flex-1">
                
                {/* Back button */}
                <button 
                  onClick={handleBackToStep1}
                  className="text-slate-400 hover:text-white text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-all"
                >
                  ← Reselect Companion
                </button>

                <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/60">
                  <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-slate-800 bg-slate-900">
                    <CharacteristicAvatar id={selectedCompanion.id} className="w-full h-full" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Selected Partner</span>
                    <h5 className="font-extrabold text-white text-sm">{selectedCompanion.name}</h5>
                    <p className="text-slate-500 text-[10px] mt-0.5">{selectedCompanion.badge} • Verified Biometrically</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                  
                  {/* Timing options */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                      ⏰ Select Synchronous Slot
                    </label>
                    <div className="flex flex-col gap-2">
                      {mockTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            audio.playClick();
                            setScheduledTime(time);
                          }}
                          className={`p-3 rounded-xl text-left text-xs font-semibold transition-luxury border ${
                            scheduledTime === time 
                              ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/10" 
                              : "bg-slate-900 text-slate-300 border-slate-800/80 hover:bg-slate-850"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            {time}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Certified Venues list */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                      📍 Secured Certified Haven
                    </label>
                    <div className="flex flex-col gap-2">
                      {venues.map((v) => (
                        <button
                          key={v}
                          onClick={() => {
                            audio.playClick();
                            setSelectedVenue(v);
                          }}
                          className={`p-3 rounded-xl text-left text-xs font-semibold transition-luxury border ${
                            selectedVenue === v 
                              ? "bg-white text-slate-900 border-white" 
                              : "bg-slate-900 text-slate-300 border-slate-800/80 hover:bg-slate-850"
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                            <span className="truncate">{v}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Big Proceed action */}
                <button
                  onClick={proceedToHappyKey}
                  disabled={!scheduledTime}
                  className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-luxury flex items-center justify-center gap-2 shadow-lg ${
                    scheduledTime 
                      ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" 
                      : "bg-slate-900 text-slate-600 border border-slate-800/50 cursor-not-allowed"
                  }`}
                >
                  Lock reservation &amp; Proceed to Happy Key sync
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STAGE MAIN INTERFACE: STEP 3 - HAPPY KEY PUZZLE */}
            {lockStep === 3 && selectedCompanion && (
              <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-center">
                <div className="text-center py-2 max-w-md mx-auto">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-1 font-mono">
                    SECURITY COMPANION PAIRING
                  </span>
                  <h4 className="text-lg font-bold text-white font-display tracking-tight">Align Happy Key</h4>
                  <p className="text-slate-400 text-xs mt-1 font-light leading-relaxed">
                    Slide the visual puzzle block to the right to verify dual identity presence with <span className="text-white font-semibold">{selectedCompanion.name}</span>.
                  </p>
                </div>

                {/* The visual slider area */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative max-w-md mx-auto w-full overflow-hidden">
                  
                  {/* Dynamic interlocking assembly */}
                  <div className="flex flex-row flex-nowrap items-center justify-center relative py-8 overflow-hidden w-full max-w-[340px] mx-auto">
                    
                    {/* Left Part */}
                    <div 
                      className="w-24 sm:w-28 h-20 sm:h-24 bg-[#0047BA] text-white rounded-l-2xl p-2.5 flex flex-col justify-between shadow-xl transition-all duration-100 z-20 border border-blue-700/20 border-r-0 relative shrink-0"
                      style={{
                        transform: `translateX(${happyKeyConnected ? "0px" : `-${(100 - keySlider) * 0.4}px`})`
                      }}
                    >
                      {/* Waving SVG Figure (Left) */}
                      <div className="w-full flex justify-center">
                        <svg className="w-8 h-8 animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="30" r="10" fill="white" />
                          <path d="M38 75 C42 55, 48 48, 50 48 C52 48, 58 55, 62 75" stroke="white" strokeWidth="12" strokeLinecap="round" />
                          <path d="M50 48 C55 42, 65 30, 72 26" stroke="white" strokeWidth="10" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black block font-display">Happy</span>
                        <span className="text-[6px] text-blue-100 italic tracking-wider block">Akele Kyu....?</span>
                      </div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0047BA] -mr-2 z-30" />
                    </div>

                    {/* Right Part */}
                    <div 
                      className="w-24 sm:w-28 h-20 sm:h-24 bg-white text-[#0047BA] rounded-r-2xl p-2.5 flex flex-col justify-between shadow-xl transition-all duration-100 z-20 border border-slate-150 border-l-0 relative shrink-0"
                      style={{
                        transform: `translateX(${happyKeyConnected ? "0px" : `${(100 - keySlider) * 0.4}px`})`
                      }}
                    >
                      {/* Waving SVG Figure (Right) */}
                      <div className="w-full flex justify-center">
                        <svg className="w-8 h-8 animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="30" r="10" fill="#0047BA" />
                          <path d="M62 75 C58 55, 52 48, 50 48 C48 48, 42 55, 38 75" stroke="#0047BA" strokeWidth="12" strokeLinecap="round" />
                          <path d="M50 48 C45 42, 35 30, 28 26" stroke="#0047BA" strokeWidth="10" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black block font-display">Hangouts</span>
                        <span className="text-[6px] text-[#0047BA]/70 italic tracking-wider block">Happy Hangouts Hai Na!</span>
                      </div>
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full -ml-2 z-30 transition-colors" 
                        style={{ backgroundColor: happyKeyConnected ? "#0047BA" : "#020617" }}
                      />
                    </div>

                  </div>

                  {/* Range Slider control */}
                  <div className="mt-4 space-y-3">
                    <input 
                      type="range" 
                      min="35" 
                      max="100" 
                      value={keySlider}
                      disabled={happyKeyConnected}
                      onChange={handleSliderChange}
                      className="w-full accent-blue-500 h-2 bg-slate-950 rounded-full cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>SLIDE TO CONNECT</span>
                      <span className={happyKeyConnected ? "text-emerald-400 font-bold" : ""}>
                        {happyKeyConnected ? "SECURED!" : `${keySlider}% SYNC`}
                      </span>
                    </div>
                  </div>

                </div>

                <p className="text-[10px] text-slate-500 text-center italic">
                  Connecting coordinates with {selectedCompanion.name} at {selectedVenue} ({scheduledTime})
                </p>
              </div>
            )}

            {/* STAGE MAIN INTERFACE: STEP 4 - ARCHIVED POLAROID */}
            {lockStep === 4 && selectedCompanion && (
              <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-center items-center">
                
                {/* The Polaroid Polaroid */}
                <div className="bg-white text-slate-900 p-4 pb-6 rounded-2xl shadow-2xl max-w-xs w-full border border-slate-200 transform rotate-1 hover:rotate-0 transition-all duration-500">
                  
                  {/* Photo area with companion and location details */}
                  <div className="aspect-square bg-slate-950 rounded-lg overflow-hidden relative border border-slate-800 mb-4">
                    <CharacteristicAvatar id={selectedCompanion.id} className="w-full h-full filter contrast-105 brightness-95" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Tiny Badge */}
                    <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3 h-3" />
                      Archived
                    </span>

                    {/* Vibe overlay text */}
                    <div className="absolute bottom-3 left-3 text-left">
                      <span className="text-[9px] uppercase tracking-wider text-blue-300 font-bold">{selectedCity} • Hangout Complete</span>
                      <p className="text-white text-xs font-semibold">{selectedVenue}</p>
                    </div>
                  </div>

                  {/* Handwriting style caption font */}
                  <div className="text-center space-y-1">
                    <span className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold">MEMORY CAPTION</span>
                    <h5 className="font-extrabold text-base tracking-tight text-slate-900 font-display">
                      With {selectedCompanion.name}
                    </h5>
                    <p className="text-slate-500 text-[10px] italic">
                      "{selectedVibe} • {scheduledTime}"
                    </p>
                  </div>
                </div>

                <div className="text-center space-y-4 max-w-xs">
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-white font-display tracking-tight">Hangout Secured!</h4>
                    <p className="text-slate-400 text-xs font-light leading-relaxed">
                      Your memory is archived, and your offline connection is forged. Welcome to the regional tribe.
                    </p>
                  </div>

                  <button
                    onClick={resetAllDemo}
                    className="mx-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-luxury flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Another Vibe
                  </button>
                </div>

              </div>
            )}
              </div>
            )}

            {/* MY PROFILE & ACHIEVEMENTS SYSTEM TAB */}
            {simTab === "profile" && (
              <div className="space-y-6 relative z-10 flex-1 animate-fadeIn text-left">
                
                {/* Profile Identity Card */}
                <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                  
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/80 shadow-lg shadow-blue-500/15 bg-slate-900">
                      <CharacteristicAvatar id="user" className="w-full h-full" />
                    </div>
                    <span className="absolute bottom-0 right-0 bg-emerald-500 border-2 border-slate-950 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-md">
                      ✓
                    </span>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1 min-w-0 w-full">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      {isEditingName ? (
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          onBlur={() => {
                            setIsEditingName(false);
                            audio.playClick();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setIsEditingName(false);
                              audio.playClick();
                            }
                          }}
                          className="bg-slate-950 border border-slate-800 text-white font-extrabold text-lg px-3 py-1 rounded-xl w-full max-w-[180px] focus:outline-none focus:border-blue-500 font-display"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 group max-w-full">
                          <h4 className="font-extrabold text-white text-lg tracking-tight font-display truncate">
                            {userName}
                          </h4>
                          <button
                            onClick={() => {
                              audio.playClick();
                              setIsEditingName(true);
                            }}
                            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                            title="Edit Name"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                      Delhi NCR Member • Joined Today
                    </span>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                      <span className="text-[9px] font-bold uppercase bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-lg">
                        🛡 Verified Resident
                      </span>
                      <span className="text-[9px] font-bold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg animate-pulse-slow">
                        ✦ Active Vibe Anchor
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reliability & Core Stats Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Interactive Reliability Score */}
                  <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-3 top-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400 opacity-60" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block mb-2">
                        🛡 Safety &amp; Reliability Score
                      </span>
                      <div className="flex items-center gap-4 my-2">
                        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="#0f172a" strokeWidth="3" />
                            <circle 
                              cx="18" 
                              cy="18" 
                              r="16" 
                              fill="none" 
                              stroke="url(#reliabilityGradient)" 
                              strokeWidth="3.2" 
                              strokeDasharray="100"
                              strokeDashoffset={100 - reliabilityScore}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                              <linearGradient id="reliabilityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#10b981" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <span className="absolute text-xs font-black text-white font-mono">{reliabilityScore}%</span>
                        </div>
                        <div>
                          <p className="text-white text-xs font-bold">Pristine Reputation</p>
                          <p className="text-slate-400 text-[10px] leading-relaxed mt-0.5 font-light">
                            Scores are boosted by perfect synchronous meetups and fast keys syncing.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        audio.playConnect();
                        setReliabilityScore(prev => {
                          const next = Math.min(100, prev + 2);
                          if (prev < 98 && next >= 98) {
                            setTimeout(() => triggerBadgeUnlock("Apex Anchor"), 500);
                          } else {
                            showToast("Presence check-in complete! Reliability rating +2.0%");
                          }
                          return next;
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white py-2.5 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors mt-3 text-center"
                    >
                      🌟 Simulate Safe Check-In (+2%)
                    </button>
                  </div>

                  {/* Core Stats Overview */}
                  <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 block mb-3">
                        📊 Live Companion Analytics
                      </span>
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                          <span className="text-[11px] text-slate-400">Completed Hangouts</span>
                          <span className="text-xs font-mono font-bold text-white bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/10">
                            {hangoutsCount} Completed
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                          <span className="text-[11px] text-slate-400">Avenues Explored</span>
                          <span className="text-xs font-mono font-bold text-white bg-purple-500/10 px-2.5 py-0.5 rounded-md border border-purple-500/10">
                            {exploredVibes.length} / 3 Vibes
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] text-slate-400">Tribe Trust Level</span>
                          <span className="text-xs font-mono font-extrabold text-emerald-400 uppercase tracking-widest text-[9.5px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            {reliabilityScore >= 98 ? "Elite Anchor" : "Rising Peer"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-[9.5px] text-slate-500 font-light italic mt-3 leading-relaxed">
                      💡 Tip: Use 'Avenue Deck' to connect, sync with companions, and gain new badges!
                    </p>
                  </div>

                </div>

                {/* Animated Badge Achievements Grid */}
                <div className="bg-slate-900/90 border border-slate-800/80 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                      🎖 Animated Credentials Badge Case
                    </span>
                    <span className="text-[10px] text-blue-400 font-bold bg-blue-500/5 px-2.5 py-1 rounded-md">
                      {((hangoutsCount >= 1 ? 1 : 0) + (reliabilityScore >= 98 ? 1 : 0) + (exploredVibes.length >= 3 ? 1 : 0))} / 3 Acquired
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Badge 1: Pioneer Explorer */}
                    {hangoutsCount >= 1 ? (
                      <div className="bg-slate-950/95 border border-amber-500/30 p-4 rounded-2xl text-center space-y-2.5 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-500">
                        <div className="absolute -inset-y-12 -inset-x-24 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out" />
                        <div className="relative w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-bounce-slow">
                          <div className="absolute inset-0 rounded-full border border-amber-400/80 animate-ping opacity-75" />
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="text-white text-xs font-black font-display tracking-tight">Pioneer Explorer</h5>
                          <p className="text-[9px] text-slate-400 leading-relaxed mt-0.5">Completed first tactile sync</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-2xl text-center space-y-2.5 opacity-40 hover:opacity-50 transition-opacity">
                        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <h5 className="text-slate-400 text-xs font-bold font-display">Pioneer Explorer</h5>
                          <p className="text-[9px] text-slate-500 leading-relaxed mt-0.5">Complete 1/1 hangout to unlock</p>
                        </div>
                      </div>
                    )}

                    {/* Badge 2: Apex Anchor */}
                    {reliabilityScore >= 98 ? (
                      <div className="bg-slate-950/95 border border-blue-500/30 p-4 rounded-2xl text-center space-y-2.5 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-500">
                        <div className="absolute -inset-y-12 -inset-x-24 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out" />
                        <div className="relative w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse-slow">
                          <div className="absolute inset-0 rounded-full border border-blue-400/80 animate-ping opacity-60" />
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="text-white text-xs font-black font-display tracking-tight">Apex Anchor</h5>
                          <p className="text-[9px] text-slate-400 leading-relaxed mt-0.5">Reliability score &gt;= 98%</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-2xl text-center space-y-2.5 opacity-40 hover:opacity-50 transition-opacity">
                        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <h5 className="text-slate-400 text-xs font-bold font-display">Apex Anchor</h5>
                          <p className="text-[9px] text-slate-500 leading-relaxed mt-0.5">{reliabilityScore}/98% score to unlock</p>
                        </div>
                      </div>
                    )}

                    {/* Badge 3: Vibe Navigator */}
                    {exploredVibes.length >= 3 ? (
                      <div className="bg-slate-950/95 border border-pink-500/30 p-4 rounded-2xl text-center space-y-2.5 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all duration-500">
                        <div className="absolute -inset-y-12 -inset-x-24 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out" />
                        <div className="relative w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20 animate-spin-slow">
                          <div className="absolute inset-0 rounded-full border border-pink-400/80 animate-ping opacity-60" />
                          <Compass className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h5 className="text-white text-xs font-black font-display tracking-tight">Vibe Navigator</h5>
                          <p className="text-[9px] text-slate-400 leading-relaxed mt-0.5">Matched across 3 core vibes</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-2xl text-center space-y-2.5 opacity-40 hover:opacity-50 transition-opacity">
                        <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <h5 className="text-slate-400 text-xs font-bold font-display">Vibe Navigator</h5>
                          <p className="text-[9px] text-slate-400 leading-relaxed mt-0.5">{exploredVibes.length}/3 unique vibes matched</p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            )}

            {/* FULL SCREEN DYNAMIC ACHIEVEMENT UNLOCK OVERLAY */}
            {newBadgeUnlockedAlert && activeBadgeUnlock && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col justify-center items-center p-6 text-center animate-fadeIn">
                <div className="absolute inset-0 bg-grid-mesh opacity-10 pointer-events-none" />
                
                <div className={`absolute w-64 h-64 rounded-full bg-gradient-to-br ${activeBadgeUnlock.gradient} opacity-20 blur-3xl`} />

                <span className="text-[10px] tracking-widest font-extrabold text-amber-400 uppercase font-mono block mb-2 animate-pulse">
                  🏆 ACHIEVEMENT ACQUIRED!
                </span>

                <h3 className="text-3xl font-black text-white font-display tracking-tight">
                  New Badge Unlocked!
                </h3>

                <div className="my-8 relative">
                  <div className="absolute -inset-4 rounded-full bg-white/5 animate-ping opacity-30" />
                  <div className="absolute -inset-10 rounded-full bg-white/5 animate-ping opacity-15" />
                  
                  <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${activeBadgeUnlock.gradient} p-0.5 shadow-2xl flex items-center justify-center animate-bounce-slow`}>
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center relative">
                      <div className={`absolute inset-0.5 rounded-full bg-gradient-to-br ${activeBadgeUnlock.gradient} opacity-15 animate-spin-slow`} />
                      
                      {activeBadgeUnlock.icon === "Award" && <Award className="w-14 h-14 text-white relative z-10" />}
                      {activeBadgeUnlock.icon === "Crown" && <Crown className="w-14 h-14 text-white relative z-10" />}
                      {activeBadgeUnlock.icon === "Compass" && <Compass className="w-14 h-14 text-white relative z-10" />}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 max-w-sm mb-8 relative z-10">
                  <h4 className="text-xl font-extrabold text-white font-display">{activeBadgeUnlock.title}</h4>
                  <p className="text-slate-400 text-xs font-light leading-relaxed">
                    {activeBadgeUnlock.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    audio.playConnect();
                    setNewBadgeUnlockedAlert(false);
                  }}
                  className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-widest transition-luxury relative z-10 shadow-lg shadow-white/5"
                >
                  Claim &amp; Continue
                </button>
              </div>
            )}

            {/* COMPANION PORTFOLIO DETAILS MODAL OVERLAY */}
            {detailedCompanion && (
              <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-md z-50 flex flex-col justify-between p-6 animate-fadeIn text-left">
                <div className="absolute inset-0 bg-grid-mesh opacity-10 pointer-events-none" />
                
                {/* Decorative glow background */}
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-slate-900 pb-3.5 relative z-10">
                  <span className="text-[10px] tracking-widest font-mono font-extrabold text-blue-400 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
                    Verified Companion Profile
                  </span>
                  <button
                    onClick={() => {
                      audio.playClick();
                      setDetailedCompanion(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Content (scrollable) */}
                <div className="flex-1 overflow-y-auto py-5 space-y-6 relative z-10 pr-1">
                  
                  {/* Portrait Block */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/40 p-4.5 rounded-2xl border border-slate-800/80">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/80 shadow-lg bg-slate-900">
                        <CharacteristicAvatar id={detailedCompanion.id} className="w-full h-full" />
                      </div>
                      <span className="absolute bottom-0 right-0 bg-emerald-500 border-2 border-slate-950 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-md">
                        ✓
                      </span>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5">
                        <h4 className="text-lg font-extrabold text-white font-display tracking-tight">{detailedCompanion.name}</h4>
                        <span className="text-xs text-slate-400">({detailedCompanion.age})</span>
                      </div>
                      <p className="text-blue-400 font-extrabold uppercase tracking-widest text-[9px] mt-0.5">{detailedCompanion.badge}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded font-mono">
                          9.9 Vetted Score
                        </span>
                        <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded font-mono">
                          ID: {detailedCompanion.id.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Bio */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 block font-mono">
                      Personal Statement
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed font-light bg-slate-900/30 p-3 rounded-xl border border-slate-900">
                      "{detailedCompanion.bio}"
                    </p>
                  </div>

                  {/* Favorite Spots */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 block font-mono">
                      📍 Favorite Secure Spots
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {(COMPANION_SPOTS[detailedCompanion.id] || ["Cozy Local Cafe", "Scenic Public Park"]).map((spot, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/40 text-[11px] text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="font-semibold">{spot}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verification Integrity */}
                  <div className="space-y-2 bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
                    <span className="text-[9px] uppercase font-extrabold tracking-widest text-emerald-400 block font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      TRUST &amp; INTEGRITY SUMMARY
                    </span>
                    <ul className="text-[10px] text-slate-400 space-y-1 font-light list-disc list-inside">
                      <li>Biometric Retina Profile validated securely on live system</li>
                      <li>Government identity documentation verified by local anchor</li>
                      <li>Vibe rating calculated via 100% genuine user peer reviews</li>
                    </ul>
                  </div>

                </div>

                {/* Modal Footer Callout */}
                <div className="border-t border-slate-900 pt-4 space-y-3 relative z-10 text-center">
                  <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl">
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      To meet and connect offline with <span className="text-white font-bold">{detailedCompanion.name}</span>, book them instantly inside the mobile app!
                    </p>
                    <span className="text-amber-400 font-extrabold uppercase tracking-widest text-[10px] block mt-1.5 animate-pulse-slow">
                      Book your companion.. download app now!
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="#download"
                      onClick={() => {
                        audio.playClick();
                        setDetailedCompanion(null);
                      }}
                      className="bg-slate-900 hover:bg-slate-850 text-white font-bold py-3.5 rounded-xl text-[10px] uppercase tracking-widest transition-all text-center"
                    >
                      🤖 Android APK
                    </a>
                    <a
                      href="#download"
                      onClick={() => {
                        audio.playClick();
                        setDetailedCompanion(null);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-[10px] uppercase tracking-widest transition-all text-center shadow-lg shadow-blue-500/15"
                    >
                      🍏 Apple iOS
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* SIMULATION FOOTER STATS */}
            <div className="border-t border-slate-900 pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-slate-500 relative z-10">
              <span className="font-semibold uppercase tracking-wider">Happy Hangouts V1.4.0</span>
              <span className="text-blue-400 font-bold uppercase">LIVE CONNECTION ACTIVE</span>
            </div>

            {/* Home Pill Indicator */}
            <div className="w-28 h-1 bg-slate-800/80 rounded-full mx-auto mt-4 mb-0.5 animate-pulse relative z-30" />

          </div>

        </div>

      </div>

    </div>

  </div>
  );
}
