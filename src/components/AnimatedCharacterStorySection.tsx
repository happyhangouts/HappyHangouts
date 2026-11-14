import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Tv, 
  Smile, 
  Heart, 
  Zap, 
  Coins, 
  Award,
  Compass,
  Coffee,
  Music,
  Check,
  ChevronRight,
  Flame,
  ThumbsUp,
  MessageCircle,
  HelpCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { audio } from "../utils/audio";

// Character Types
export type CharacterId = "muba" | "ujjwal" | "sonika" | "jyoti" | "falguni";

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  role: string;
  emoji: string;
  avatarBg: string;
  accentColor: string;
  clothingColor: string;
  catchphrase: string;
  description: string;
  quickLocation: string;
  quickActivity: string;
}

export const CHARACTERS: Record<CharacterId, CharacterConfig> = {
  muba: {
    id: "muba",
    name: "Muba",
    role: "NCR Vibe Coordinator & Local Guide",
    emoji: "⚡",
    avatarBg: "#ffc933",
    accentColor: "#1f4ee0",
    clothingColor: "#ffc933",
    catchphrase: "Akele kyu? Happy Hangouts Hai na!! 🙌",
    description: "Your high-energy local buddy who knows every corner of Gurugram & Delhi.",
    quickLocation: "All NCR",
    quickActivity: "Vibe Matchmaking"
  },
  ujjwal: {
    id: "ujjwal",
    name: "Ujjwal Poonia",
    role: "Badminton Champion · Sec 29 Gurugram",
    emoji: "🏸",
    avatarBg: "#7cc4ff",
    accentColor: "#0b1f5c",
    clothingColor: "#7cc4ff",
    catchphrase: "Court booked hai, smash lagane kab aa rahe ho?",
    description: "4.9 ★ Host · Competitive doubles player & sports fitness enthusiast.",
    quickLocation: "Sector 29 Arena, Gurugram",
    quickActivity: "Badminton"
  },
  sonika: {
    id: "sonika",
    name: "Sonika Sharma",
    role: "Cafe & Startup Guide · DLF CyberHub",
    emoji: "☕",
    avatarBg: "#ffdd80",
    accentColor: "#b45309",
    clothingColor: "#f59e0b",
    catchphrase: "Good pour-over coffee, zero awkwardness, honest startup talks.",
    description: "4.9 ★ Top Rated · Specialty coffee lover & indie startup consultant.",
    quickLocation: "DLF CyberHub, Gurugram",
    quickActivity: "Cafe Chat"
  },
  jyoti: {
    id: "jyoti",
    name: "Jyoti Nandal",
    role: "Heritage & Botanical Guide · Sunder Nursery",
    emoji: "🥾",
    avatarBg: "#a8f0c6",
    accentColor: "#047857",
    clothingColor: "#10b981",
    catchphrase: "Delhi sunrise at Sunder Nursery beats sleeping till 2 PM any day!",
    description: "5.0 ★ Super Host · Botanical trails, nature photowalks & sunrise walks.",
    quickLocation: "Sunder Nursery & Lodhi, Delhi",
    quickActivity: "Trek & Photowalk"
  },
  falguni: {
    id: "falguni",
    name: "Falguni Baddi",
    role: "Acoustic Musician · Khan Market",
    emoji: "🎸",
    avatarBg: "#ff9e80",
    accentColor: "#b91c1c",
    clothingColor: "#ef4444",
    catchphrase: "Bring your favorite playlist lyrics, I'll strum the chords!",
    description: "4.8 ★ Host · Acoustic guitar jamming & indie music in Central Delhi.",
    quickLocation: "Khan Market & CP, Delhi",
    quickActivity: "Music Jam"
  }
};

// Scene Beat within an Episode
export interface StoryScene {
  id: string;
  stageTitle: string;
  locationBadge: string;
  characterMood: "excited" | "thinking" | "celebrating" | "explaining" | "active";
  dialogue: string;
  speechSubtext: string;
  stageBackdrop: "cyberhub" | "badminton_court" | "safety_vault" | "sunder_nursery" | "earnings_vault";
  relatableTag: string;
  companionAction?: {
    companionName: string;
    location: string;
    buttonLabel: string;
  };
  interactiveAction?: {
    label: string;
    actionOutcome: string;
  };
  keyTakeaways: string[];
}

export interface StoryEpisode {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  badge: string;
  icon: string;
  speakerId: CharacterId;
  scenes: StoryScene[];
}

export const STORY_EPISODES: StoryEpisode[] = [
  {
    id: "relatable-weekends",
    number: "01",
    title: "Saturday 11 AM in Delhi NCR: The Real Weekend Struggle",
    shortTitle: "Weekend Reality",
    badge: "100% Relatable",
    icon: "🛋️",
    speakerId: "muba",
    scenes: [
      {
        id: "rel-1",
        stageTitle: "The Saturday 11:30 AM Flatmate Dilemma",
        locationBadge: "Gurgaon Phase 3 / South Delhi Flat",
        characterMood: "thinking",
        dialogue: "It's Saturday 11:30 AM in Gurgaon. You wake up, open WhatsApp, and the college group is dead silence. Flatmates went home to Jaipur or Chandigarh, or they're sleeping till 3 PM. You want to play badminton or grab good chai, but going alone feels awkward. Sitting at home scrolling reels all day? No way!",
        speechSubtext: "Every single person who moved to Delhi NCR has stared at the ceiling on a lonely weekend.",
        stageBackdrop: "cyberhub",
        relatableTag: "Saturday Solo Dilemma",
        interactiveAction: {
          label: "📱 Open Happy Hangouts Live Radar",
          actionOutcome: "BAM! 42 verified activity partners active right now across CyberHub, CP & Sec 29!"
        },
        keyTakeaways: [
          "Ditch solo weekend doom-scrolling and bedroom boredom",
          "Connect over actual sports, coffee, photowalks & jam sessions",
          "Meet verified companions who are as excited to hang out as you are"
        ]
      },
      {
        id: "rel-2",
        stageTitle: "Dost Cancelled Badminton 20 Mins Before?",
        locationBadge: "Sector 29 Arena, Gurugram",
        characterMood: "active",
        dialogue: "You booked a court in Sector 29, bought new shuttlecocks, and 20 mins before match time your buddy texts: 'Bhai neend aa rahi hai, next week pakka!' 😭 Instead of wasting your court booking, open Happy Hangouts! Ujjwal Poonia is 10 mins away, racket ready, and loves 21-point competitive rallies!",
        speechSubtext: "The universal Delhi NCR pain point: friends dropping out at the very last moment.",
        stageBackdrop: "badminton_court",
        relatableTag: "Friend Dropped Out Fix",
        companionAction: {
          companionName: "Ujjwal Poonia",
          location: "Sector 29 Arena, Gurugram",
          buttonLabel: "⚡ Book Free Badminton with Ujjwal"
        },
        interactiveAction: {
          label: "🏸 Pass the Shuttlecock to Ujjwal",
          actionOutcome: "SMASH! Ujjwal accepts match: First 3 Hangouts Free (₹0 fee applied)!"
        },
        keyTakeaways: [
          "Never waste a pre-booked sports court again",
          "Coached drills, doubles rallies, and fitness partners on demand",
          "First 3 hangouts are 100% FREE to build trust and mutual reviews"
        ]
      },
      {
        id: "rel-3",
        stageTitle: "Solo Cafe Awkwardness? Meet Sonika at CyberHub",
        locationBadge: "DLF CyberHub (Blue Tokai), Gurugram",
        characterMood: "thinking",
        dialogue: "Ever sat alone at Blue Tokai CyberHub pretending to stare intensely at your laptop screen just so you don't look lonely? Sonika Sharma gets it! Meet up for pour-over Ethiopian brews, brainstorm startup pitch decks, or talk indie books without awkward romance pressure.",
        speechSubtext: "Cafe co-working is 10x better when you have a sharp, friendly mind across the table.",
        stageBackdrop: "cyberhub",
        relatableTag: "Solo Cafe Anxiety Solved",
        companionAction: {
          companionName: "Sonika Sharma",
          location: "DLF CyberHub, Gurugram",
          buttonLabel: "☕ Book Free Coffee Chat with Sonika"
        },
        interactiveAction: {
          label: "☕ Brew Fresh Pour-Over Coffee",
          actionOutcome: "Aroma unlocked! Sonika is ready for deep tech, career & book chats."
        },
        keyTakeaways: [
          "Zero creepy small talk — genuine intellectual & lifestyle banter",
          "Perfect for remote founders, techies, designers & newcomers",
          "Meet strictly in public, vibrant third-wave cafes"
        ]
      },
      {
        id: "rel-4",
        stageTitle: "Weather is 10/10: Sunder Nursery Sunrise Trails",
        locationBadge: "Sunder Nursery & Lodhi, Delhi",
        characterMood: "excited",
        dialogue: "Delhi autumn weather is a pure 10/10. Fresh morning breeze, heritage arches, and blooming roses at Sunder Nursery. But your friends refuse to wake up before noon! Jyoti Nandal is already there with her camera and botanical guide map. Lakefront chai and photowalks hit different!",
        speechSubtext: "Don't let gorgeous NCR weather slip away while your flatmates sleep.",
        stageBackdrop: "sunder_nursery",
        relatableTag: "Morning Weather Perfection",
        companionAction: {
          companionName: "Jyoti Nandal",
          location: "Sunder Nursery & Lodhi, Delhi",
          buttonLabel: "🥾 Book Free Trail with Jyoti"
        },
        interactiveAction: {
          label: "📸 Snap Lakefront Sunrise Photo",
          actionOutcome: "Golden hour photo captured! 5,000 steps done before 10 AM."
        },
        keyTakeaways: [
          "Explore hidden Mughal heritage pavilions & lakeside lawns",
          "Fresh morning air and wholesome weekend fitness steps",
          "Great company for photography, birdwatching & quiet reading"
        ]
      }
    ]
  },
  {
    id: "dating-vs-hangouts",
    number: "02",
    title: "Why Happy Hangouts Beats Dating Apps 100x",
    shortTitle: "Dating Apps vs Us",
    badge: "Zero Creepiness",
    icon: "⚡",
    speakerId: "muba",
    scenes: [
      {
        id: "dvs-1",
        stageTitle: "The Exhausting Dating App Small Talk Trap",
        locationBadge: "Any Dating App Screen",
        characterMood: "thinking",
        dialogue: "Let's be completely honest: dating apps in Delhi NCR are exhausting! You swipe 100 times, get ghosted, or chat for 5 days about 'Hey, what are you doing?'. And when you finally meet, there's heavy romantic pressure and awkward expectations. Who has the energy for that?!",
        speechSubtext: "People don't want forced romance; they just want someone fun to do activities with.",
        stageBackdrop: "cyberhub",
        relatableTag: "Dating App Fatigue",
        interactiveAction: {
          label: "🚫 Delete Forced Romance Pressure",
          actionOutcome: "Relief! Welcome to activity-first companionship."
        },
        keyTakeaways: [
          "Zero romance drama, zero awkward expectations",
          "Skip the 5 days of boring 'what are your hobbies' texting",
          "Pick an activity you already love, and do it with a verified buddy"
        ]
      },
      {
        id: "dvs-2",
        stageTitle: "Activity-First: Conversations Flow Naturally",
        locationBadge: "Siri Fort Courts & Khan Market",
        characterMood: "excited",
        dialogue: "When you meet to rally badminton, jam acoustic guitars, or walk Sunder Nursery, there are ZERO awkward silences! You're already focusing on the game, the music, or the trail. The laughter and banter happen organically without anyone judging your outfit or relationship status!",
        speechSubtext: "Shared passion creates instant comfort and mutual respect.",
        stageBackdrop: "badminton_court",
        relatableTag: "Natural Chemistry",
        companionAction: {
          companionName: "Falguni Baddi",
          location: "Khan Market & Connaught Place (CP), Delhi",
          buttonLabel: "🎸 Book Free Jam with Falguni"
        },
        interactiveAction: {
          label: "🎸 Strum Acoustic G-Chord",
          actionOutcome: "Harmonized! Falguni starts playing indie acoustic chords."
        },
        keyTakeaways: [
          "Focus is 100% on the hobby, sports or cafe experience",
          "No creepy interrogations or forced romantic advances",
          "Strict hourly sessions — you have complete control over your time"
        ]
      },
      {
        id: "dvs-3",
        stageTitle: "Launch Privilege: First 3 Hangouts are 100% FREE",
        locationBadge: "Trust Vault & Free Pass",
        characterMood: "celebrating",
        dialogue: "To prove this is genuine and build mutual trust, your first 3 hangouts are 100% FREE! (₹0 fee). The host agrees, you agree, and after having a blast, you trade genuine 5-star reviews to build your community profile. Zero financial risk on both sides!",
        speechSubtext: "Mutual trust is built when both parties experience the platform risk-free.",
        stageBackdrop: "earnings_vault",
        relatableTag: "First 3 Free Privilege",
        interactiveAction: {
          label: "🎁 Claim 3 Free Hangouts Credit",
          actionOutcome: "Pass Armed: ₹0 Fee applied for Sessions 1, 2, and 3!"
        },
        keyTakeaways: [
          "Sessions 1, 2, and 3 are completely free (₹0 platform & host fee)",
          "Designed to establish comfort, verified trust & 5-star feedback",
          "Available for both new companions and activity hosts"
        ]
      }
    ]
  },
  {
    id: "safety-shield",
    number: "03",
    title: "Is It Actually Safe? The 4-Pillar Shield in Plain Words",
    shortTitle: "4-Pillar Safety",
    badge: "Ironclad Security",
    icon: "🛡️",
    speakerId: "muba",
    scenes: [
      {
        id: "saf-1",
        stageTitle: "Pillar 1: Aadhaar + Biometric Face Check",
        locationBadge: "ID Verification Vault",
        characterMood: "explaining",
        dialogue: "Girls and newcomers ask: 'Is it actually safe? What about creeps?'. Here is our ironclad rule: every companion must complete Government ID verification (Aadhaar or PAN) PLUS a live biometric selfie scan before setting foot on the platform. Zero anonymous accounts, zero fake photos!",
        speechSubtext: "We reject 100% of unverified or suspicious profiles immediately.",
        stageBackdrop: "safety_vault",
        relatableTag: "100% ID Verified",
        interactiveAction: {
          label: "🔍 Trigger Aadhaar Liveness Scan",
          actionOutcome: "Biometric Verified: 100% Real Human ID Authenticated."
        },
        keyTakeaways: [
          "Government ID & live biometric selfie match mandatory",
          "Zero bots, zero stock photos, zero catfishing",
          "Verified trust badge displayed publicly on every host profile"
        ]
      },
      {
        id: "saf-2",
        stageTitle: "Pillar 2: Strictly Public Places — No Private Homes, Ever!",
        locationBadge: "CyberHub, CP & Siri Fort",
        characterMood: "explaining",
        dialogue: "We enforce an absolute zero-exception policy: all hangouts take place strictly in verified public venues — like DLF CyberHub, Khan Market, Siri Fort Sports Complex, or Sunder Nursery. Never in private flats, hotels, or isolated cars. Broad daylight and bustling crowds keep everyone safe!",
        speechSubtext: "Public venues eliminate uncomfortable situations completely.",
        stageBackdrop: "cyberhub",
        relatableTag: "Public Daylight Venues",
        interactiveAction: {
          label: "📍 View Verified Safe Hotspots",
          actionOutcome: "8 Major NCR public meeting hubs mapped with Google Maps GPS!"
        },
        keyTakeaways: [
          "Public venues only: third-wave cafes, sports clubs & parks",
          "Broad daylight meeting hours preferred",
          "Instant account ban if a user suggests meeting in private"
        ]
      },
      {
        id: "saf-3",
        stageTitle: "Pillar 3: UPI Escrow Vault — Hosts Only Paid on Approval",
        locationBadge: "Digital Escrow Vault",
        characterMood: "celebrating",
        dialogue: "No awkward cash exchanges! When you book, your payment sits in a secure digital escrow vault. If the host doesn't show up, you get an immediate 100% refund. The host only gets paid after both of you tap thumbs up at the end of the hangout!",
        speechSubtext: "Your money is held in a protected bank escrow until you are 100% satisfied.",
        stageBackdrop: "earnings_vault",
        relatableTag: "Escrow Payment Vault",
        interactiveAction: {
          label: "🔒 Test Escrow Protection Lock",
          actionOutcome: "Vault Locked: Funds protected until mutual session completion."
        },
        keyTakeaways: [
          "Zero cash handling — automated UPI escrow transactions",
          "100% money-back guarantee for cancellations or no-shows",
          "Two-way reviews filter out bad actors permanently"
        ]
      }
    ]
  },
  {
    id: "meet-ncr-hosts",
    number: "04",
    title: "Meet the 4 Founding NCR Companion Hosts",
    shortTitle: "Meet the Hosts",
    badge: "Verified Profiles",
    icon: "👥",
    speakerId: "ujjwal",
    scenes: [
      {
        id: "host-u",
        stageTitle: "Ujjwal Poonia: Competitive Badminton & Fitness",
        locationBadge: "Sector 29, Gurugram (₹400/hr)",
        characterMood: "active",
        dialogue: "Hey! I'm Ujjwal. Need a doubles partner or intense singles rally in Sector 29? Whether you're training for a tournament or just want to burn 500 calories after sitting at a corporate desk all day, grab your racket and let's play!",
        speechSubtext: "4.9 ★ Rating · 40+ Matches Played · All Skill Levels Welcome",
        stageBackdrop: "badminton_court",
        relatableTag: "Badminton Partner",
        companionAction: {
          companionName: "Ujjwal Poonia",
          location: "Sector 29 Arena, Gurugram",
          buttonLabel: "⚡ Book Free Badminton with Ujjwal"
        },
        interactiveAction: {
          label: "🏸 Smash with Ujjwal",
          actionOutcome: "Rally in progress! High energy 21-point game ready."
        },
        keyTakeaways: [
          "Available weekday mornings & weekend evenings in Sector 29",
          "Court booking coordination assistance provided",
          "Friendly drills for beginners & high-speed rallies for advanced players"
        ]
      },
      {
        id: "host-s",
        stageTitle: "Sonika Sharma: Pour-Over Coffee & Startup Chats",
        locationBadge: "DLF CyberHub, Gurugram (₹450/hr)",
        characterMood: "thinking",
        dialogue: "Hi! I'm Sonika. Love artisan coffee and brainstorming startup pitches? Let's meet at Blue Tokai in CyberHub. No small talk fluff — let's review your deck, talk indie books, and share honest career insights.",
        speechSubtext: "4.9 ★ Rating · Specialty Coffee Buff · Startup Consultant",
        stageBackdrop: "cyberhub",
        relatableTag: "CyberHub Startup Coffee",
        companionAction: {
          companionName: "Sonika Sharma",
          location: "DLF CyberHub, Gurugram",
          buttonLabel: "☕ Book Free Coffee Chat with Sonika"
        },
        interactiveAction: {
          label: "☕ Pour Fresh Coffee with Sonika",
          actionOutcome: "Artisan brew ready! Great conversations on decks & indie books."
        },
        keyTakeaways: [
          "Cozy cafe spots across DLF CyberHub & 32nd Avenue",
          "Honest feedback on startup ideas, design, and career transitions",
          "Zero awkwardness — relaxed and inspiring cafe company"
        ]
      },
      {
        id: "host-j",
        stageTitle: "Jyoti Nandal: Heritage Photowalks & Botanical Trails",
        locationBadge: "Sunder Nursery & Lodhi, Delhi (₹500/hr)",
        characterMood: "explaining",
        dialogue: "Namaste! I'm Jyoti. Delhi mornings are breathtaking when you spend them among lush trees and Mughal monuments at Sunder Nursery. Join me for photowalks, history stories, and lakeside peaceful walks!",
        speechSubtext: "5.0 ★ Super Host · Heritage Enthusiast · Botanical Trail Specialist",
        stageBackdrop: "sunder_nursery",
        relatableTag: "Heritage Photowalks",
        companionAction: {
          companionName: "Jyoti Nandal",
          location: "Sunder Nursery & Lodhi, Delhi",
          buttonLabel: "🥾 Book Free Trail with Jyoti"
        },
        interactiveAction: {
          label: "🥾 Walk Botanical Trails with Jyoti",
          actionOutcome: "Historic lakefront pavilion discovered at Sunder Nursery!"
        },
        keyTakeaways: [
          "Sunrise walks among Mughal monuments & lakefront lawns",
          "Fascinating stories of Old and New Delhi's heritage",
          "Peaceful, safe outdoor air away from city traffic"
        ]
      },
      {
        id: "host-f",
        stageTitle: "Falguni Baddi: Acoustic Indie Jamming in Khan Market",
        locationBadge: "Khan Market & CP, Delhi (₹450/hr)",
        characterMood: "celebrating",
        dialogue: "Hey music lovers! I'm Falguni. If you play guitar, write poetry, or just want to sing along to acoustic indie favorites, let's jam in Khan Market! No audition, no judgment — just pure creative musical expression.",
        speechSubtext: "4.8 ★ Host · Singer-Songwriter · Acoustic Jam Partner",
        stageBackdrop: "cyberhub",
        relatableTag: "Acoustic Jam Sessions",
        companionAction: {
          companionName: "Falguni Baddi",
          location: "Khan Market & Connaught Place (CP), Delhi",
          buttonLabel: "🎸 Book Free Jam with Falguni"
        },
        interactiveAction: {
          label: "🎵 Strum Acoustic Chords with Falguni",
          actionOutcome: "Harmonized chord progression unlocked! Beautiful acoustic vibe."
        },
        keyTakeaways: [
          "Acoustic guitar jamming & lyric writing sessions",
          "Cozy cafe settings in Central Delhi and Khan Market",
          "Welcoming to total beginners and experienced musicians alike"
        ]
      }
    ]
  }
];

// Quick Relatable Situations Selector Options
const RELATABLE_SITUATIONS = [
  {
    id: "sit-badminton",
    icon: "🏸",
    title: "Friend bailed on badminton?",
    subtitle: "Court booked at Sec 29, but no partner",
    targetEpisodeIdx: 0,
    targetSceneIdx: 1,
    speaker: "ujjwal" as CharacterId
  },
  {
    id: "sit-cafe",
    icon: "☕",
    title: "Bored of solo cafe WFH?",
    subtitle: "Need pour-over coffee & startup talks",
    targetEpisodeIdx: 0,
    targetSceneIdx: 2,
    speaker: "sonika" as CharacterId
  },
  {
    id: "sit-trail",
    icon: "🥾",
    title: "Weather 10/10 & flatmates sleeping?",
    subtitle: "Sunrise photowalk at Sunder Nursery",
    targetEpisodeIdx: 0,
    targetSceneIdx: 3,
    speaker: "jyoti" as CharacterId
  },
  {
    id: "sit-jam",
    icon: "🎸",
    title: "Want acoustic jam without cringe?",
    subtitle: "Indie chords in Khan Market",
    targetEpisodeIdx: 1,
    targetSceneIdx: 1,
    speaker: "falguni" as CharacterId
  },
  {
    id: "sit-safety",
    icon: "🛡️",
    title: "Is it actually safe for girls?",
    subtitle: "Aadhaar + Escrow + Public places only",
    targetEpisodeIdx: 2,
    targetSceneIdx: 0,
    speaker: "muba" as CharacterId
  },
  {
    id: "sit-free",
    icon: "🎁",
    title: "First 3 Hangouts Free: What's the deal?",
    subtitle: "Zero fee to build mutual trust & reviews",
    targetEpisodeIdx: 1,
    targetSceneIdx: 2,
    speaker: "muba" as CharacterId
  }
];

interface AnimatedCharacterStorySectionProps {
  onOpenBookingClick?: (companionName?: string, location?: string) => void;
  onApplyHostClick?: () => void;
  onExploreSafetyClick?: () => void;
}

export default function AnimatedCharacterStorySection({
  onOpenBookingClick,
  onApplyHostClick,
  onExploreSafetyClick
}: AnimatedCharacterStorySectionProps) {
  // Episode & Scene State
  const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState<number>(0);
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);

  // Character Interaction State
  const [activeSpeakerOverride, setActiveSpeakerOverride] = useState<CharacterId | null>(null);
  const [characterActionPulse, setCharacterActionPulse] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [characterPokeCount, setCharacterPokeCount] = useState<number>(0);

  // Relatable Reaction Live Counters State
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    literallyMe: 1428,
    storyOfMyLife: 986,
    needThisNow: 754,
    freeHangoutSaved: 1195
  });
  const [userClickedReactions, setUserClickedReactions] = useState<{ [key: string]: boolean }>({});

  // Audio / Speech Narration State
  const [voiceNarrationEnabled, setVoiceNarrationEnabled] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentEpisode = STORY_EPISODES[selectedEpisodeIdx];
  const currentScene = currentEpisode.scenes[currentSceneIdx] || currentEpisode.scenes[0];
  const activeSpeakerId = activeSpeakerOverride || currentScene.companionAction?.companionName.toLowerCase().includes("ujjwal") 
    ? "ujjwal" 
    : currentScene.companionAction?.companionName.toLowerCase().includes("sonika")
    ? "sonika"
    : currentScene.companionAction?.companionName.toLowerCase().includes("jyoti")
    ? "jyoti"
    : currentScene.companionAction?.companionName.toLowerCase().includes("falguni")
    ? "falguni"
    : currentEpisode.speakerId;
    
  const currentSpeaker = CHARACTERS[activeSpeakerId] || CHARACTERS.muba;

  // Stop synthetic speech safely
  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Speak dialogue using Web Speech API with expressive pacing
  const speakDialogue = (text: string) => {
    if (!voiceNarrationEnabled) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    stopSpeech();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = activeSpeakerId === "muba" ? 1.15 : activeSpeakerId === "ujjwal" ? 1.0 : activeSpeakerId === "sonika" ? 1.1 : 1.05;
      utterance.lang = "en-IN";

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // Play blip sound on scene change
  useEffect(() => {
    audio.playBlip(540 + currentSceneIdx * 40);
    setActionFeedback(null);

    if (voiceNarrationEnabled) {
      speakDialogue(currentScene.dialogue);
    }

    return () => stopSpeech();
  }, [selectedEpisodeIdx, currentSceneIdx, activeSpeakerId, voiceNarrationEnabled]);

  // Auto-play timer
  useEffect(() => {
    if (!autoPlay) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      handleNextScene();
    }, 7000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [autoPlay, selectedEpisodeIdx, currentSceneIdx]);

  // Navigate scenes
  const handleNextScene = () => {
    audio.playClick();
    if (currentSceneIdx < currentEpisode.scenes.length - 1) {
      setCurrentSceneIdx(currentSceneIdx + 1);
    } else {
      if (selectedEpisodeIdx < STORY_EPISODES.length - 1) {
        setSelectedEpisodeIdx(selectedEpisodeIdx + 1);
        setCurrentSceneIdx(0);
        setActiveSpeakerOverride(null);
      } else {
        setSelectedEpisodeIdx(0);
        setCurrentSceneIdx(0);
        setActiveSpeakerOverride(null);
      }
    }
  };

  const handlePrevScene = () => {
    audio.playClick();
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx(currentSceneIdx - 1);
    } else if (selectedEpisodeIdx > 0) {
      const prevEpisode = STORY_EPISODES[selectedEpisodeIdx - 1];
      setSelectedEpisodeIdx(selectedEpisodeIdx - 1);
      setCurrentSceneIdx(prevEpisode.scenes.length - 1);
      setActiveSpeakerOverride(null);
    }
  };

  const handleSelectEpisode = (idx: number) => {
    audio.playToggle();
    setSelectedEpisodeIdx(idx);
    setCurrentSceneIdx(0);
    setActiveSpeakerOverride(null);
  };

  const handleSelectSituation = (sit: typeof RELATABLE_SITUATIONS[0]) => {
    audio.playClick();
    setSelectedEpisodeIdx(sit.targetEpisodeIdx);
    setCurrentSceneIdx(sit.targetSceneIdx);
    setActiveSpeakerOverride(sit.speaker);
    audio.playSuccess();
  };

  const handleToggleVoice = () => {
    audio.playToggle();
    const nextVal = !voiceNarrationEnabled;
    setVoiceNarrationEnabled(nextVal);
    if (nextVal) {
      speakDialogue(currentScene.dialogue);
    } else {
      stopSpeech();
    }
  };

  // Interactive Action Button
  const handleTriggerAction = () => {
    audio.playSuccess();
    setCharacterActionPulse(true);
    setTimeout(() => setCharacterActionPulse(false), 800);

    if (currentScene.stageBackdrop === "earnings_vault") {
      audio.playCoin();
    } else if (currentScene.stageBackdrop === "badminton_court") {
      audio.playSwoosh();
    }

    if (currentScene.interactiveAction) {
      setActionFeedback(currentScene.interactiveAction.actionOutcome);
    }
  };

  // Relatable Reaction Click
  const handleReactionClick = (key: string) => {
    audio.playClick();
    audio.playBlip(680);
    setReactions((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    setUserClickedReactions((prev) => ({ ...prev, [key]: true }));
    setCharacterActionPulse(true);
    setTimeout(() => setCharacterActionPulse(false), 500);
  };

  // Poke Character (Interactive Easter Egg)
  const handlePokeCharacter = () => {
    audio.playClick();
    audio.playBlip(720);
    setCharacterPokeCount((c) => c + 1);
    setCharacterActionPulse(true);
    setTimeout(() => setCharacterActionPulse(false), 600);

    const quotes = [
      "Akele kyu? Happy Hangouts Hai na!! 🙌",
      "Special launch perk: first 3 hangouts are 100% FREE! Zero risk to try. 🎁",
      "Dost ne badminton plan cancel kiya? Ujjwal is ready in Sector 29!",
      "Pour-over coffee in CyberHub or photowalks in Sunder Nursery — let's go!",
      "Strictly public daylight places. 100% Aadhaar verified companions!",
      "Dating app romance pressure se thak gaye? Connect strictly over hobbies!"
    ];
    const pickedQuote = quotes[characterPokeCount % quotes.length];
    setActionFeedback(`"${pickedQuote}"`);

    if (voiceNarrationEnabled) {
      speakDialogue(pickedQuote);
    }
  };

  return (
    <section id="videos" className="py-16 sm:py-24 bg-[#f3f8ff] border-b-[2.5px] border-[#0b1f5c] relative overflow-hidden">
      
      {/* Decorative Neo-Brutalist Grid Dots */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(#0b1f5c 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="wrap relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="tag">Interactive Character Theatre</span>
              <span className="bg-[#ffc933] text-[#0b1f5c] text-xs font-black px-2.5 py-1 rounded-full border border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c]">
                🎁 First 3 Hangouts Free
              </span>
              <span className="text-xs font-black text-[#1f4ee0] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Living Delhi NCR Stories
              </span>
            </div>
            <h2 className="text-[32px] sm:text-[48px] font-extrabold tracking-tight text-[#0b1f5c] leading-tight">
              Akele kyu? Real NCR Stories Brought to Life!
            </h2>
            <p className="text-[#4a5a8a] font-medium text-base sm:text-lg max-w-2xl mt-1">
              Watch Muba, Ujjwal, Sonika, Jyoti, and Falguni act out real weekend dilemmas: cancelled plans, solo cafe boredom, and how genuine Delhi NCR companions meet safely.
            </p>
          </div>

          {/* Audio & Narrator Controls */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {/* Voice Narration Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-[2px] font-display font-extrabold text-xs transition-all shadow-[2px_2px_0_#0b1f5c] cursor-pointer ${
                voiceNarrationEnabled
                  ? "bg-emerald-400 text-[#0b1f5c] border-[#0b1f5c]"
                  : "bg-white text-[#0b1f5c] border-[#0b1f5c] hover:bg-slate-100"
              }`}
            >
              {voiceNarrationEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#0b1f5c] animate-pulse" />
                  <span>Voice Narration ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#4a5a8a]" />
                  <span>Listen to Characters</span>
                </>
              )}
            </button>

            {/* Auto Play Story Button */}
            <button
              type="button"
              onClick={() => {
                audio.playClick();
                setAutoPlay(!autoPlay);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-[2px] font-display font-extrabold text-xs transition-all shadow-[2px_2px_0_#0b1f5c] cursor-pointer ${
                autoPlay
                  ? "bg-[#1f4ee0] text-white border-[#0b1f5c]"
                  : "bg-white text-[#0b1f5c] border-[#0b1f5c] hover:bg-slate-100"
              }`}
            >
              {autoPlay ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Auto-Playing</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Auto-Play Story</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* 1. ULTRA-RELATABLE SITUATION QUICK-PICKER ("Which situation are you in right now?") */}
        <div className="mb-6 bg-white border-[2.5px] border-[#0b1f5c] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0_#0b1f5c]">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0b1f5c]">
                Which Weekend Situation Resonates with You? (Tap to Jump)
              </h4>
            </div>
            <span className="text-[11px] font-bold text-[#1f4ee0] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Interactive Situation Matcher
            </span>
          </div>

          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {RELATABLE_SITUATIONS.map((sit) => {
              const isActive = selectedEpisodeIdx === sit.targetEpisodeIdx && currentSceneIdx === sit.targetSceneIdx;
              return (
                <button
                  key={sit.id}
                  type="button"
                  onClick={() => handleSelectSituation(sit)}
                  className={`text-left p-2.5 rounded-xl border-[2px] transition-all cursor-pointer flex flex-col justify-between min-w-0 ${
                    isActive
                      ? "bg-[#ffc933] border-[#0b1f5c] shadow-[2.5px_2.5px_0_#0b1f5c] scale-[1.02]"
                      : "bg-[#f3f8ff] border-[#0b1f5c]/40 hover:border-[#0b1f5c] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{sit.icon}</span>
                    <span className="text-[9px] font-extrabold uppercase px-1 rounded bg-white/80 border border-[#0b1f5c]/20 text-[#0b1f5c]">
                      {sit.speaker}
                    </span>
                  </div>
                  <p className="text-xs font-black text-[#0b1f5c] leading-tight line-clamp-2">
                    {sit.title}
                  </p>
                  <p className="text-[10px] text-[#4a5a8a] font-medium truncate mt-1">
                    {sit.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. THE LIVING THEATRE STAGE BOX */}
        <div className="border-[3px] border-[#0b1f5c] rounded-2xl sm:rounded-[32px] bg-white p-3.5 sm:p-7 shadow-[6px_6px_0_#0b1f5c] sm:shadow-[8px_8px_0_#0b1f5c] relative mb-6">
          
          {/* Episode Tabs (Top Strip) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 sm:mb-5 border-b-[2px] border-[#0b1f5c]/20 scrollbar-none">
            {STORY_EPISODES.map((ep, idx) => {
              const isSelected = selectedEpisodeIdx === idx;
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => handleSelectEpisode(idx)}
                  className={`chip text-xs sm:text-sm py-2 px-3.5 transition-all shrink-0 cursor-pointer ${
                    isSelected ? "active" : ""
                  }`}
                >
                  <span>{ep.icon}</span>
                  <span className="font-extrabold">Ep {ep.number}: {ep.shortTitle}</span>
                  <span className={`text-[10px] ml-1.5 px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? "bg-white text-[#0b1f5c]" : "bg-blue-100 text-[#1f4ee0]"
                  }`}>
                    {ep.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* STAGE ARENA: Interactive Set */}
          <div className="bg-[#f8fbff] border-[2.5px] border-[#0b1f5c] rounded-2xl sm:rounded-[24px] p-4 sm:p-8 relative overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-between shadow-inner">
            
            {/* Top Stage Badges & Backdrop Watermark */}
            <div className="flex items-center justify-between flex-wrap gap-2 relative z-10 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#1f4ee0] text-white text-xs font-black px-3 py-1 rounded-full border border-[#0b1f5c] shadow-xs flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#ffc933]" />
                  {currentScene.locationBadge}
                </span>

                <span className="bg-[#ffc933] text-[#0b1f5c] text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-[#0b1f5c] shadow-xs">
                  💬 {currentScene.relatableTag}
                </span>
              </div>

              {/* Host Quick Switcher (Meet our Hosts Episode) */}
              {currentEpisode.id === "meet-ncr-hosts" && (
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border-[2px] border-[#0b1f5c] shadow-xs">
                  <span className="text-[10px] font-black text-[#0b1f5c] px-2 hidden sm:inline">Inspect Host:</span>
                  {(["ujjwal", "sonika", "jyoti", "falguni"] as CharacterId[]).map((hId) => (
                    <button
                      key={hId}
                      type="button"
                      onClick={() => {
                        audio.playClick();
                        setActiveSpeakerOverride(hId);
                        const matchSceneIdx = hId === "ujjwal" ? 0 : hId === "sonika" ? 1 : hId === "jyoti" ? 2 : 3;
                        setCurrentSceneIdx(matchSceneIdx);
                      }}
                      className={`w-8 h-8 rounded-xl font-bold text-sm flex items-center justify-center transition-all cursor-pointer ${
                        activeSpeakerId === hId
                          ? "bg-[#ffc933] border border-[#0b1f5c] scale-110 shadow-xs"
                          : "hover:bg-slate-100"
                      }`}
                      title={CHARACTERS[hId].name}
                    >
                      {CHARACTERS[hId].emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* STAGE CENTER: ANIMATED CHARACTER + SPEECH BUBBLE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10 py-3 my-auto">
              
              {/* LEFT: THE ANIMATED CHARACTER (Vector Figure + Props) */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center">
                
                {/* Character Interactive Hitbox */}
                <motion.div
                  onClick={handlePokeCharacter}
                  animate={{
                    y: characterActionPulse ? [0, -22, 0] : [0, -8, 0],
                    rotate: characterActionPulse ? [0, -4, 4, 0] : 0,
                    scale: characterActionPulse ? 1.08 : 1
                  }}
                  transition={{
                    y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
                    scale: { duration: 0.3 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer relative group flex flex-col items-center select-none"
                  title="Click me to talk or high-five!"
                >
                  
                  {/* Glowing Character Aura / Shadow */}
                  <div 
                    className="absolute -inset-4 rounded-full blur-xl opacity-35 transition-all group-hover:opacity-65"
                    style={{ backgroundColor: currentSpeaker.accentColor }}
                  />

                  {/* Character Avatar Stage Figure (Stylized Vector) */}
                  <div className="relative w-44 h-48 sm:w-52 sm:h-56 flex items-center justify-center">
                    
                    {/* SVG Vector Character Body */}
                    <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[4px_6px_0_#0b1f5c]">
                      
                      {/* Character Shadows on floor */}
                      <ellipse cx="100" cy="225" rx="55" ry="10" fill="#0b1f5c" fillOpacity="0.25" />

                      {/* Legs with rhythmic tapping */}
                      <g>
                        <rect x="75" y="165" width="18" height="45" rx="8" fill="#0b1f5c" />
                        <rect x="107" y="165" width="18" height="45" rx="8" fill="#0b1f5c" />
                        {/* Red/White Sneakers */}
                        <rect x="70" y="200" width="26" height="15" rx="6" fill="#ff6b4a" stroke="#0b1f5c" strokeWidth="2.5" />
                        <rect x="104" y="200" width="26" height="15" rx="6" fill="#ff6b4a" stroke="#0b1f5c" strokeWidth="2.5" />
                      </g>

                      {/* Torso / Hoodie */}
                      <rect 
                        x="55" 
                        y="100" 
                        width="90" 
                        height="75" 
                        rx="22" 
                        fill={currentSpeaker.clothingColor} 
                        stroke="#0b1f5c" 
                        strokeWidth="3.5" 
                      />
                      
                      {/* Hoodie Pocket & Emblems */}
                      <path d="M 75 140 Q 100 155 125 140" stroke="#0b1f5c" strokeWidth="3" fill="none" />
                      <circle cx="100" cy="122" r="10" fill="white" stroke="#0b1f5c" strokeWidth="2" />
                      <text x="96" y="126" fontSize="11" fontWeight="bold" fill="#0b1f5c">HH</text>

                      {/* Arms (Left & Right) with dynamic props */}
                      {activeSpeakerId === "ujjwal" ? (
                        // Ujjwal with badminton racket + flying shuttlecock
                        <g>
                          <line x1="55" y1="120" x2="30" y2="105" stroke="#0b1f5c" strokeWidth="12" strokeLinecap="round" />
                          <circle cx="20" cy="85" r="18" fill="none" stroke="#1f4ee0" strokeWidth="3" />
                          <line x1="20" y1="85" x2="28" y2="105" stroke="#0b1f5c" strokeWidth="3.5" />
                          {/* Flying Shuttlecock */}
                          <text x="8" y="70" fontSize="18" className="animate-bounce">🏸</text>
                        </g>
                      ) : activeSpeakerId === "sonika" ? (
                        // Sonika holding pour-over coffee mug with steam
                        <g>
                          <line x1="145" y1="125" x2="165" y2="135" stroke="#0b1f5c" strokeWidth="12" strokeLinecap="round" />
                          <rect x="160" y="125" width="18" height="18" rx="4" fill="#ffffff" stroke="#0b1f5c" strokeWidth="2.5" />
                          <text x="160" y="120" fontSize="16">☕</text>
                        </g>
                      ) : activeSpeakerId === "jyoti" ? (
                        // Jyoti with explorer camera & hiking gear
                        <g>
                          <line x1="145" y1="125" x2="160" y2="115" stroke="#0b1f5c" strokeWidth="12" strokeLinecap="round" />
                          <text x="155" y="115" fontSize="18">📸</text>
                          <text x="35" y="125" fontSize="16">🌸</text>
                        </g>
                      ) : activeSpeakerId === "falguni" ? (
                        // Falguni with acoustic guitar
                        <g>
                          <ellipse cx="40" cy="140" rx="20" ry="14" fill="#d97706" stroke="#0b1f5c" strokeWidth="2.5" />
                          <line x1="40" y1="140" x2="25" y2="100" stroke="#0b1f5c" strokeWidth="4" />
                          <text x="15" y="95" fontSize="16">🎵</text>
                          <text x="45" y="85" fontSize="14">🎶</text>
                        </g>
                      ) : (
                        // Muba holding glowing smartphone
                        <g>
                          <line x1="145" y1="125" x2="165" y2="125" stroke="#0b1f5c" strokeWidth="12" strokeLinecap="round" />
                          <rect x="160" y="110" width="16" height="26" rx="4" fill="#1f4ee0" stroke="#0b1f5c" strokeWidth="2" />
                          <circle cx="168" cy="120" r="3" fill="#ffc933" />
                        </g>
                      )}

                      {/* Head */}
                      <circle cx="100" cy="62" r="36" fill="#ffd1b3" stroke="#0b1f5c" strokeWidth="3.5" />

                      {/* Hair / Headwear */}
                      {activeSpeakerId === "ujjwal" ? (
                        <g>
                          <path d="M 68 55 Q 100 25 132 55" fill="#1e293b" />
                          {/* Sports Headband */}
                          <rect x="65" y="48" width="70" height="10" rx="4" fill="#ff6b4a" stroke="#0b1f5c" strokeWidth="2" />
                        </g>
                      ) : activeSpeakerId === "sonika" ? (
                        <g>
                          <path d="M 64 65 Q 100 15 136 65" fill="#451a03" />
                          {/* Glasses */}
                          <rect x="78" y="56" width="18" height="12" rx="3" fill="none" stroke="#0b1f5c" strokeWidth="2.5" />
                          <rect x="104" y="56" width="18" height="12" rx="3" fill="none" stroke="#0b1f5c" strokeWidth="2.5" />
                          <line x1="96" y1="62" x2="104" y2="62" stroke="#0b1f5c" strokeWidth="2.5" />
                        </g>
                      ) : activeSpeakerId === "jyoti" ? (
                        <g>
                          {/* Safari/Explorer Hat */}
                          <ellipse cx="100" cy="40" rx="46" ry="12" fill="#065f46" stroke="#0b1f5c" strokeWidth="2.5" />
                          <rect x="75" y="24" width="50" height="20" rx="8" fill="#047857" stroke="#0b1f5c" strokeWidth="2.5" />
                        </g>
                      ) : activeSpeakerId === "falguni" ? (
                        <g>
                          <path d="M 62 70 Q 100 20 138 70" fill="#7f1d1d" />
                          <circle cx="132" cy="70" r="8" fill="#ff6b4a" />
                        </g>
                      ) : (
                        <g>
                          {/* Muba's Signature Blue Snapback */}
                          <path d="M 64 54 Q 100 20 136 54" fill="#1f4ee0" stroke="#0b1f5c" strokeWidth="3" />
                          <path d="M 115 50 Q 150 48 155 58 Q 130 62 115 54" fill="#ffc933" stroke="#0b1f5c" strokeWidth="2.5" />
                        </g>
                      )}

                      {/* Expressive Eyes (with blinking animation) */}
                      <g className="animate-[pulse_3s_infinite]">
                        <ellipse cx="88" cy="62" rx="4.5" ry="6" fill="#0b1f5c" />
                        <ellipse cx="112" cy="62" rx="4.5" ry="6" fill="#0b1f5c" />
                        <circle cx="89.5" cy="60" r="1.5" fill="white" />
                        <circle cx="113.5" cy="60" r="1.5" fill="white" />
                      </g>

                      {/* Eyebrows */}
                      <path d="M 82 52 Q 88 49 94 52" stroke="#0b1f5c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M 106 52 Q 112 49 118 52" stroke="#0b1f5c" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                      {/* Animated Talking Mouth (Lip Sync effect when speaking) */}
                      {isSpeaking ? (
                        <g>
                          <ellipse cx="100" cy="78" rx="8" ry="7" fill="#be123c" stroke="#0b1f5c" strokeWidth="2" />
                          <path d="M 94 76 Q 100 80 106 76" stroke="white" strokeWidth="2" fill="none" />
                        </g>
                      ) : (
                        <path d="M 92 76 Q 100 85 108 76" stroke="#0b1f5c" strokeWidth="3" strokeLinecap="round" fill="#be123c" />
                      )}

                      {/* Rosy Cheeks */}
                      <circle cx="78" cy="72" r="5" fill="#f43f5e" fillOpacity="0.4" />
                      <circle cx="122" cy="72" r="5" fill="#f43f5e" fillOpacity="0.4" />

                    </svg>

                  </div>

                  {/* Character Nameplate Tag */}
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center gap-1.5 bg-[#0b1f5c] text-white px-3 py-1 rounded-full text-xs font-black shadow-[2px_2px_0_#ffc933]">
                      <span>{currentSpeaker.emoji}</span>
                      <span>{currentSpeaker.name}</span>
                    </span>
                    <p className="text-[10px] text-[#4a5a8a] font-bold mt-1">
                      {currentSpeaker.role}
                    </p>
                    <p className="text-[10px] text-[#1f4ee0] font-black underline mt-0.5 group-hover:scale-105 transition-transform">
                      Tap me to hear my catchphrase! 👆
                    </p>
                  </div>

                </motion.div>

              </div>

              {/* RIGHT: INTERACTIVE SPEECH BUBBLE & SCENE NARRATIVE */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                
                {/* Speech Bubble Container */}
                <motion.div
                  key={`${selectedEpisodeIdx}-${currentSceneIdx}-${activeSpeakerId}`}
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white border-[3px] border-[#0b1f5c] rounded-[26px] p-5 sm:p-7 shadow-[6px_6px_0_#0b1f5c] relative mb-3"
                >
                  
                  {/* Bubble Pointer Arrow on desktop */}
                  <div className="hidden lg:block absolute -left-3.5 top-12 w-6 h-6 bg-white border-l-[3px] border-b-[3px] border-[#0b1f5c] -rotate-45" />

                  {/* Speaker Header Strip */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-base border-[1.5px] border-[#0b1f5c] shadow-xs"
                        style={{ backgroundColor: currentSpeaker.avatarBg }}
                      >
                        {currentSpeaker.emoji}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-black text-[#0b1f5c] leading-none">
                          {currentSpeaker.name}
                        </p>
                        <p className="text-[10px] text-[#4a5a8a] font-semibold mt-0.5">
                          {currentScene.characterMood.toUpperCase()} · {currentScene.stageTitle}
                        </p>
                      </div>
                    </div>

                    {isSpeaking && (
                      <div className="flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-300 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        <span className="text-[10px] font-black text-rose-600">SPEAKING DIALOGUE...</span>
                      </div>
                    )}
                  </div>

                  {/* The Dialogue Text (Large & Expressive) */}
                  <p className="font-display font-bold text-base sm:text-xl lg:text-2xl text-[#0b1f5c] leading-relaxed mb-3">
                    "{currentScene.dialogue}"
                  </p>

                  <p className="text-xs sm:text-sm text-[#4a5a8a] font-medium italic border-l-3 border-[#ffc933] pl-3 py-1.5 bg-amber-50/50 rounded-r-lg">
                    💡 <span className="font-bold text-[#0b1f5c]">Relatable Truth:</span> {currentScene.speechSubtext}
                  </p>

                  {/* Key Takeaways Checklist for the scene */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                    {currentScene.keyTakeaways.map((pt, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs font-bold text-[#0b1f5c]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Direct 1-Click Booking Action for this Companion */}
                  {currentScene.companionAction && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          audio.playClick();
                          if (onOpenBookingClick && currentScene.companionAction) {
                            onOpenBookingClick(
                              currentScene.companionAction.companionName,
                              currentScene.companionAction.location
                            );
                          }
                        }}
                        className="btn b text-xs sm:text-sm py-2.5 px-4 shadow-[3px_3px_0_#0b1f5c] cursor-pointer flex items-center justify-center flex-wrap gap-2 w-full sm:w-auto"
                      >
                        <Zap className="w-4 h-4 fill-current text-white shrink-0" />
                        <span>{currentScene.companionAction.buttonLabel}</span>
                        <span className="text-[10px] bg-white text-[#1f4ee0] px-2 py-0.5 rounded-full font-black">₹0 Free</span>
                      </button>

                      <span className="text-[11px] font-bold text-[#4a5a8a] text-center sm:text-right">
                        Meet at {currentScene.companionAction.location}
                      </span>
                    </div>
                  )}

                  {/* Interactive Action Button for this Scene */}
                  {currentScene.interactiveAction && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleTriggerAction}
                        className="px-4 py-2.5 bg-[#f3f8ff] hover:bg-[#eaf3ff] border-[2px] border-[#0b1f5c] rounded-xl text-xs font-black text-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] cursor-pointer flex items-center justify-center gap-1.5 transition-all active:translate-y-0.5 w-full sm:w-auto min-h-[42px]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#1f4ee0] shrink-0" />
                        <span>{currentScene.interactiveAction.label}</span>
                      </button>

                      {actionFeedback && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-emerald-50 text-emerald-800 border-[1.5px] border-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                        >
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{actionFeedback}</span>
                        </motion.div>
                      )}
                    </div>
                  )}

                </motion.div>

                {/* 3. RELATABLE REACTION BUTTONS (Community Peer Engagement) */}
                <div className="bg-slate-50 border-[2px] border-[#0b1f5c]/25 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#0b1f5c]">
                    <span>How relatable is this scene?</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleReactionClick("literallyMe")}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                        userClickedReactions.literallyMe
                          ? "bg-rose-100 text-rose-800 border-rose-400 scale-105"
                          : "bg-white text-[#0b1f5c] border-[#0b1f5c]/30 hover:border-[#0b1f5c]"
                      }`}
                    >
                      <span>😭 Literally Me</span>
                      <span className="font-mono text-[10px] text-[#4a5a8a]">{reactions.literallyMe.toLocaleString()}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReactionClick("storyOfMyLife")}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                        userClickedReactions.storyOfMyLife
                          ? "bg-amber-100 text-amber-900 border-amber-400 scale-105"
                          : "bg-white text-[#0b1f5c] border-[#0b1f5c]/30 hover:border-[#0b1f5c]"
                      }`}
                    >
                      <span>💯 Story of My Life</span>
                      <span className="font-mono text-[10px] text-[#4a5a8a]">{reactions.storyOfMyLife.toLocaleString()}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReactionClick("needThisNow")}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                        userClickedReactions.needThisNow
                          ? "bg-blue-100 text-blue-900 border-blue-400 scale-105"
                          : "bg-white text-[#0b1f5c] border-[#0b1f5c]/30 hover:border-[#0b1f5c]"
                      }`}
                    >
                      <span>🏸 Need This Now</span>
                      <span className="font-mono text-[10px] text-[#4a5a8a]">{reactions.needThisNow.toLocaleString()}</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* STAGE BOTTOM CONTROLS: TIMELINE STEPPER & SCENE SWITCHER */}
            <div className="relative z-10 pt-4 mt-2 border-t-[2px] border-[#0b1f5c]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Scene Timeline Dots / Stepper */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#0b1f5c] mr-1 hidden sm:inline">
                  Scene Progress:
                </span>
                {currentEpisode.scenes.map((sc, sIdx) => {
                  const isActive = sIdx === currentSceneIdx;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        audio.playClick();
                        setCurrentSceneIdx(sIdx);
                      }}
                      className={`h-3 rounded-full transition-all cursor-pointer ${
                        isActive
                          ? "w-8 bg-[#1f4ee0] border border-[#0b1f5c]"
                          : "w-3 bg-slate-300 hover:bg-slate-400"
                      }`}
                      title={`Go to scene ${sIdx + 1}: ${sc.stageTitle}`}
                    />
                  );
                })}
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevScene}
                  className="btn text-xs py-2 px-3 shadow-[2px_2px_0_#0b1f5c] cursor-pointer"
                  title="Previous Scene"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Prev Scene
                </button>

                <button
                  type="button"
                  onClick={handleNextScene}
                  className="btn b text-xs py-2 px-4 shadow-[2px_2px_0_#0b1f5c] cursor-pointer"
                  title="Next Scene"
                >
                  Next Scene <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* 4. HIGH-CONTRAST CONVERSION HERO BANNER */}
        <div className="bg-gradient-to-r from-[#011C92] via-[#082596] to-[#0A2EB8] border-2 border-[#3DAAFC]/30 rounded-3xl p-6 sm:p-8 shadow-xl text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#19C37D]/20 text-[#19C37D] border border-[#19C37D]/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#19C37D] animate-pulse"></span>
              <span>Zero Risk · First 3 Hangouts Free</span>
            </div>
            <h4 className="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug">
              First 3 hangouts are on us. Literally ₹0 fee.
            </h4>
            <p className="text-sm text-white/80 font-normal mt-2 leading-relaxed">
              Tired of friends flaking on weekend badminton or dreading another solo coffee run? Meet background-verified partners across CyberHub, CP, Khan Market & Siri Fort. No awkwardness. Just genuine people.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {/* Real, unmistakable Sunshine Primary Button */}
            <a
              href="#match"
              onClick={() => {
                audio.playClick();
                if (onOpenBookingClick) onOpenBookingClick();
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-bold text-sm sm:text-base py-3.5 px-6 rounded-full shadow-[0_4px_16px_rgba(255,200,61,0.4)] hover:shadow-[0_6px_22px_rgba(255,200,61,0.55)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer select-none min-h-[48px]"
            >
              <span>⚡ Book Free Partner</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Real, unmistakable White/Outline Secondary Button */}
            <a
              href="#join"
              onClick={() => {
                audio.playClick();
                if (onApplyHostClick) onApplyHostClick();
              }}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-[#011C92] font-bold text-sm sm:text-base py-3.5 px-6 rounded-full border-2 border-white/80 hover:border-white shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer select-none min-h-[48px]"
            >
              <span>🎟️ Get Hangout Pass</span>
            </a>
          </div>
        </div>

      </div>

    </section>
  );
}
