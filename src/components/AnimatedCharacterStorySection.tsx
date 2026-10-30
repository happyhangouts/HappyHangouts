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
  ChevronRight
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
}

export const CHARACTERS: Record<CharacterId, CharacterConfig> = {
  muba: {
    id: "muba",
    name: "Muba",
    role: "NCR Vibe Coordinator & Guide",
    emoji: "⚡",
    avatarBg: "#ffc933",
    accentColor: "#1f4ee0",
    clothingColor: "#ffc933",
    catchphrase: "Akele kyu? Happy Hangouts Hai na!! 🙌",
    description: "Your high-energy local buddy who knows every corner of Gurugram & Delhi."
  },
  ujjwal: {
    id: "ujjwal",
    name: "Ujjwal Poonia",
    role: "Badminton Champion · Sec 29",
    emoji: "🏸",
    avatarBg: "#7cc4ff",
    accentColor: "#0b1f5c",
    clothingColor: "#7cc4ff",
    catchphrase: "Ready for a 21-point rally? Let's smash!",
    description: "4.9 ★ Host · Competitive doubles player & sports fitness enthusiast."
  },
  sonika: {
    id: "sonika",
    name: "Sonika Sharma",
    role: "Cafe & Startup Guide · CyberHub",
    emoji: "☕",
    avatarBg: "#ffdd80",
    accentColor: "#b45309",
    clothingColor: "#f59e0b",
    catchphrase: "Good coffee, zero awkwardness, honest conversations.",
    description: "4.9 ★ Top Rated · Pour-over lover & indie startup consultant."
  },
  jyoti: {
    id: "jyoti",
    name: "Jyoti Nandal",
    role: "Heritage & Trek Guide · Sunder Nursery",
    emoji: "🥾",
    avatarBg: "#a8f0c6",
    accentColor: "#047857",
    clothingColor: "#10b981",
    catchphrase: "Sunrise at Sunder Nursery beats any lazy morning!",
    description: "5.0 ★ Super Host · Botanical trails, nature photowalks & sunrise walks."
  },
  falguni: {
    id: "falguni",
    name: "Falguni Baddi",
    role: "Acoustic Musician · Khan Market",
    emoji: "🎸",
    avatarBg: "#ff9e80",
    accentColor: "#b91c1c",
    clothingColor: "#ef4444",
    catchphrase: "Bring your favorite song lyrics, I'll play the chords!",
    description: "4.8 ★ Host · Acoustic guitar jamming & indie open mics in Central Delhi."
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
    id: "how-it-works",
    number: "01",
    title: "How Happy Hangouts Works in Real Life",
    shortTitle: "How It Works",
    badge: "Interactive Walkthrough",
    icon: "💡",
    speakerId: "muba",
    scenes: [
      {
        id: "hiw-1",
        stageTitle: "The Saturday 11 AM Dilemma in Gurugram",
        locationBadge: "DLF CyberHub, Gurugram",
        characterMood: "thinking",
        dialogue: "It's Saturday morning in Gurugram. My roommates are asleep, friends are out of town, and I really want to play badminton or grab good coffee. Sitting at home alone? No way!",
        speechSubtext: "Everyone in Delhi NCR has felt this solo weekend boredom.",
        stageBackdrop: "cyberhub",
        interactiveAction: {
          label: "📱 Tap to open Happy Hangouts app",
          actionOutcome: "Browsing 50+ verified activity partners in Gurugram & Delhi!"
        },
        keyTakeaways: [
          "Zero endless texting or awkward dating app swiping",
          "Activity-first: connect strictly over hobbies & sports",
          "Choose verified local companions in your exact neighborhood"
        ]
      },
      {
        id: "hiw-2",
        stageTitle: "Finding the Perfect Badminton Partner",
        locationBadge: "Sector 29 Sports Complex",
        characterMood: "excited",
        dialogue: "I filter by 'Badminton' in Sector 29 and boom — there's Ujjwal Poonia! 4.9 rating, Aadhaar verified, and available this evening for ₹400/hr. Transparent rates, zero subscriptions!",
        speechSubtext: "Every profile shows real photos, hourly rates, and verified trust badges.",
        stageBackdrop: "badminton_court",
        interactiveAction: {
          label: "⚡ Lock in Session with Ujjwal",
          actionOutcome: "Booking request confirmed with public venue meeting coordinates!"
        },
        keyTakeaways: [
          "Transparent hourly pricing (₹300 to ₹700/hr)",
          "100% ID and biometric selfie verified companions",
          "Meet strictly in vibrant, public sports arenas or cafes"
        ]
      },
      {
        id: "hiw-3",
        stageTitle: "Safety First: Public Meetup & Escrow Protection",
        locationBadge: "Sector 29 Arena & Escrow Vault",
        characterMood: "explaining",
        dialogue: "Here's the genius part: my payment stays in safe Escrow! The host doesn't get paid until we both complete the session and give a thumbs up. And we meet strictly in public sports complexes!",
        speechSubtext: "Your money and personal safety are fully locked and protected.",
        stageBackdrop: "safety_vault",
        interactiveAction: {
          label: "🛡️ Verify Escrow Lock Status",
          actionOutcome: "100% Escrow Protected: Funds only release on mutual approval!"
        },
        keyTakeaways: [
          "UPI Escrow protection: funds held safely until session ends",
          "Zero private flats or isolated locations allowed",
          "Real-time safety timer and 1-tap SOS assistance"
        ]
      },
      {
        id: "hiw-4",
        stageTitle: "Weekend Saved: Game On & High Fives!",
        locationBadge: "Sector 29 Badminton Arena",
        characterMood: "celebrating",
        dialogue: "We played 3 competitive sets, smashed some incredible rallies, and grabbed refreshing nimbu paani afterwards. Weekend dilemma solved! Akele kyu? Happy Hangouts Hai na!!",
        speechSubtext: "From sitting alone at home to an energizing weekend rally in 2 hours.",
        stageBackdrop: "badminton_court",
        interactiveAction: {
          label: "🎉 Celebrate & Give Thumbs Up",
          actionOutcome: "5-Star Review submitted! Host funds released via instant UPI."
        },
        keyTakeaways: [
          "Instant mood boost & healthy active weekend",
          "Built a reliable badminton buddy for future matches",
          "No awkward romance expectations — pure activity fun"
        ]
      }
    ]
  },
  {
    id: "safety-shield",
    number: "02",
    title: "The 4-Pillar Safety Shield Explained",
    shortTitle: "4-Pillar Safety",
    badge: "Trust Protocol",
    icon: "🛡️",
    speakerId: "muba",
    scenes: [
      {
        id: "safe-1",
        stageTitle: "Pillar 1: Aadhaar + Biometric Face Verification",
        locationBadge: "Identity Verification Center",
        characterMood: "explaining",
        dialogue: "Safety isn't just an afterthought here; it's our core engine! Every companion must complete Government ID verification (Aadhaar or PAN) plus a live biometric selfie scan before joining.",
        speechSubtext: "Zero bots, zero fake profiles, zero anonymous accounts.",
        stageBackdrop: "safety_vault",
        interactiveAction: {
          label: "🔍 Run Biometric Scanner Beam",
          actionOutcome: "Biometric Match: 100% Genuine Human Verified!"
        },
        keyTakeaways: [
          "Aadhaar / PAN government document verification",
          "Live liveness detection to eliminate fake photos",
          "Verified badge displayed prominently on every profile"
        ]
      },
      {
        id: "safe-2",
        stageTitle: "Pillar 2: Strictly Public Venues — No Private Homes",
        locationBadge: "DLF CyberHub & Khan Market",
        characterMood: "explaining",
        dialogue: "We enforce an absolute ironclad rule: hangouts ONLY happen in designated public venues like DLF CyberHub, Khan Market, Siri Fort, or Sunder Nursery. Never in private apartments, ever!",
        speechSubtext: "Both partners stay safe, comfortable, and among vibrant public crowds.",
        stageBackdrop: "cyberhub",
        interactiveAction: {
          label: "📍 View Permitted Public Hubs",
          actionOutcome: "45+ approved cafes, parks, and sports complexes across NCR."
        },
        keyTakeaways: [
          "Strict public venue policy enforced on all bookings",
          "Vetted sports arenas, third-wave cafes, and parks",
          "Instant booking cancellation if venue changes to private"
        ]
      },
      {
        id: "safe-3",
        stageTitle: "Pillar 3: Real-Time Session Timer & 1-Tap SOS Beacon",
        locationBadge: "Active Hangout Tracker",
        characterMood: "active",
        dialogue: "While you're hanging out, your session has a live tracker. You can share your live GPS beacon with family, and a 1-tap SOS button connects immediately to our NCR safety desk.",
        speechSubtext: "Peace of mind for you and your loved ones while you enjoy your day.",
        stageBackdrop: "safety_vault",
        interactiveAction: {
          label: "🚨 Test Safety Beacon Signal",
          actionOutcome: "Beacon Active: GPS coordinates securely synced to safety desk."
        },
        keyTakeaways: [
          "Live GPS session beacon with 1-tap family sharing",
          "Emergency SOS response line active 7 days a week",
          "Session check-in ping after 30 minutes"
        ]
      },
      {
        id: "safe-4",
        stageTitle: "Pillar 4: UPI Escrow Protection & 2-Way Reviews",
        locationBadge: "Financial Escrow Vault",
        characterMood: "celebrating",
        dialogue: "No cash awkwardness! Your payment stays in an escrow vault. Only when the hangout ends smoothly and you tap thumbs up do the funds transfer to the companion. Safe and simple!",
        speechSubtext: "Mutual reviews ensure high standards and zero tolerance for misbehavior.",
        stageBackdrop: "earnings_vault",
        interactiveAction: {
          label: "🔒 Inspect Escrow Vault Lock",
          actionOutcome: "Vault Armed: 100% refund guarantee if host fails to show up!"
        },
        keyTakeaways: [
          "Zero cash exchanges — all transactions routed through UPI escrow",
          "Full refund protection for cancellations or no-shows",
          "Mandatory two-way ratings maintain a safe community"
        ]
      }
    ]
  },
  {
    id: "meet-hosts",
    number: "03",
    title: "Meet Our Founding NCR Hosts",
    shortTitle: "Meet the Hosts",
    badge: "Verified Profiles",
    icon: "👥",
    speakerId: "ujjwal",
    scenes: [
      {
        id: "host-1",
        stageTitle: "Ujjwal Poonia: Badminton Rallies in Sector 29",
        locationBadge: "Sector 29, Gurugram (₹400/hr)",
        characterMood: "active",
        dialogue: "Hey! I'm Ujjwal. Whether you want high-intensity match practice or friendly rallies to burn 500 calories after work, grab your racket and let's hit the court in Sector 29!",
        speechSubtext: "4.9 ★ Rating · 40+ Matches Played · All Skill Levels Welcome",
        stageBackdrop: "badminton_court",
        interactiveAction: {
          label: "🏸 Swing Racket with Ujjwal",
          actionOutcome: "Smash rally! High energy 21-point match ready to book."
        },
        keyTakeaways: [
          "Available weekday mornings & weekend evenings",
          "Court booking assistance provided in Gurugram",
          "Coaching tips and doubles tactics included"
        ]
      },
      {
        id: "host-2",
        stageTitle: "Sonika Sharma: Pour-Over Coffee & Startup Chats",
        locationBadge: "DLF CyberHub, Gurugram (₹450/hr)",
        characterMood: "thinking",
        dialogue: "Hi! I'm Sonika. Love artisan coffee and brainstorming business ideas? Let's meet at Blue Tokai in CyberHub. No fluff, no small talk — just authentic startup conversations.",
        speechSubtext: "4.9 ★ Rating · Specialty Coffee Enthusiast · Startup Nomad",
        stageBackdrop: "cyberhub",
        interactiveAction: {
          label: "☕ Brew Pour-Over with Sonika",
          actionOutcome: "Fresh Ethiopian roast poured! Ready for deep startup chats."
        },
        keyTakeaways: [
          "Cozy cafe vibes at DLF CyberHub & 32nd Avenue",
          "Perfect for founders, designers, and remote professionals",
          "Honest feedback on decks, ideas, and career pivots"
        ]
      },
      {
        id: "host-3",
        stageTitle: "Jyoti Nandal: Sunrise Botanical Trails",
        locationBadge: "Sunder Nursery, Delhi (₹500/hr)",
        characterMood: "explaining",
        dialogue: "Namaste! I'm Jyoti. Delhi mornings are magical when you spend them among Mughal monuments and lush trees at Sunder Nursery. Join me for photography and heritage walks!",
        speechSubtext: "5.0 ★ Super Host · Heritage Buff · Sunrise Trail Specialist",
        stageBackdrop: "sunder_nursery",
        interactiveAction: {
          label: "🥾 Explore Trail with Jyoti",
          actionOutcome: "Hidden lakefront pavilion discovered at Sunder Nursery!"
        },
        keyTakeaways: [
          "Sunrise botanical trails & lakefront photography",
          "Fascinating historical stories of Delhi's monuments",
          "Fresh morning air and peaceful birdwatching"
        ]
      },
      {
        id: "host-4",
        stageTitle: "Falguni Baddi: Acoustic Jamming in Khan Market",
        locationBadge: "Khan Market, Delhi (₹450/hr)",
        characterMood: "celebrating",
        dialogue: "Hey music lovers! I'm Falguni. If you play an instrument, write songs, or just want to sing along to acoustic indie classics, let's jam together in Central Delhi!",
        speechSubtext: "4.8 ★ Host · Singer-Songwriter · Creative Jamming Partner",
        stageBackdrop: "cyberhub",
        interactiveAction: {
          label: "🎸 Strum Guitar with Falguni",
          actionOutcome: "Acoustic chord progression unlocked! Beautiful indie vibe."
        },
        keyTakeaways: [
          "Acoustic guitar jamming & lyric writing sessions",
          "Central Delhi & Khan Market cafe settings",
          "Welcoming to complete beginners and seasoned musicians"
        ]
      }
    ]
  },
  {
    id: "community-stories",
    number: "04",
    title: "New to NCR? No More Solo Weekends",
    shortTitle: "NCR Stories",
    badge: "Community Life",
    icon: "🌿",
    speakerId: "muba",
    scenes: [
      {
        id: "comm-1",
        stageTitle: "Moving to Gurugram or Delhi Alone",
        locationBadge: "Cyber City & Golf Course Road",
        characterMood: "thinking",
        dialogue: "Thousands of young professionals move to Gurugram and Delhi every month for tech and corporate jobs. Great career, but weekends can feel quiet and isolated when you don't know anyone.",
        speechSubtext: "The 'big city loneliness' is real, and dating apps are often awkward and exhausting.",
        stageBackdrop: "cyberhub",
        interactiveAction: {
          label: "💭 Reflect on the Newcomer Dilemma",
          actionOutcome: "Happy Hangouts was built specifically to solve this problem!"
        },
        keyTakeaways: [
          "Corporate transplants often struggle to build weekend tribes",
          "Dating apps bring unwanted romantic pressure and ghosting",
          "People want activity buddies, not complicated dates"
        ]
      },
      {
        id: "comm-2",
        stageTitle: "Activity-First: The Natural Way to Connect",
        locationBadge: "Aravalli Biodiversity & Sunder Nursery",
        characterMood: "excited",
        dialogue: "Happy Hangouts removes the pressure! When you meet to play badminton, hike an Aravalli trail, or try a new cafe, the focus is on the activity. Conversations flow naturally and comfortably.",
        speechSubtext: "Zero awkward silences because you're already doing something exciting together.",
        stageBackdrop: "sunder_nursery",
        interactiveAction: {
          label: "🌿 Connect on a Nature Walk",
          actionOutcome: "Shared laughter, great memories, and healthy outdoor steps!"
        },
        keyTakeaways: [
          "Shared activities create immediate organic common ground",
          "Strict hourly sessions give everyone total control of their time",
          "Safe, wholesome, and energizing weekend experiences"
        ]
      },
      {
        id: "comm-3",
        stageTitle: "Building Your Authentic Local Circle",
        locationBadge: "Greater NCR Network",
        characterMood: "celebrating",
        dialogue: "Over time, our members discover their favorite badminton rivals, weekend chai companions, and concert buddies. Delhi NCR starts feeling like home. Akele kyu? Happy Hangouts Hai na!!",
        speechSubtext: "From complete stranger to trusted weekend companion in safe public spaces.",
        stageBackdrop: "cyberhub",
        interactiveAction: {
          label: "🙌 High Five the Community",
          actionOutcome: "Welcome to Happy Hangouts NCR! You'll never spend a weekend alone."
        },
        keyTakeaways: [
          "Curate your personal circle of verified activity hosts",
          "Explore hidden gems across Gurugram, South Delhi & Central Delhi",
          "Join community group walks and weekend meetup hubs"
        ]
      }
    ]
  },
  {
    id: "host-earnings",
    number: "05",
    title: "Become a Host: Earn ₹25k–₹40k/mo on Your Schedule",
    shortTitle: "Host Earnings",
    badge: "Income Blueprint",
    icon: "💰",
    speakerId: "muba",
    scenes: [
      {
        id: "earn-1",
        stageTitle: "Turn Your Free Time & Passions Into Income",
        locationBadge: "Host Onboarding Hub",
        characterMood: "explaining",
        dialogue: "Already playing badminton on weekends? Passionate about third-wave coffee or heritage walks? You can become a verified Happy Hangouts host and earn ₹300 to ₹700 per hour on your terms!",
        speechSubtext: "You decide your schedule, your hourly rate, and which requests you accept.",
        stageBackdrop: "earnings_vault",
        interactiveAction: {
          label: "💼 Calculate My Host Potential",
          actionOutcome: "10 hours/week at ₹450/hr = ~₹34,400 monthly take-home!"
        },
        keyTakeaways: [
          "Set your own transparent hourly rate (₹300 to ₹700/hr)",
          "100% flexibility: host when you want, where you want",
          "Keep 80% take-home pay with automated direct UPI transfers"
        ]
      },
      {
        id: "earn-2",
        stageTitle: "Total Control Over Your Schedule & Locations",
        locationBadge: "Partner Dashboard",
        characterMood: "active",
        dialogue: "You choose strictly public spots close to your home or office. If a request doesn't fit your day, decline with zero penalty. You are your own boss!",
        speechSubtext: "Safe, dignified, and completely transparent platform guidelines.",
        stageBackdrop: "cyberhub",
        interactiveAction: {
          label: "📅 Set Available Time Slots",
          actionOutcome: "Calendar updated: Accepting morning sports & weekend coffee chats."
        },
        keyTakeaways: [
          "Accept or decline requests based on your availability",
          "Only meet at verified public venues you feel comfortable in",
          "ID-verified guests only — your safety is equally protected"
        ]
      },
      {
        id: "earn-3",
        stageTitle: "Weekly Direct UPI Payouts to Your Bank Account",
        locationBadge: "Instant Bank Settlement",
        characterMood: "celebrating",
        dialogue: "Earnings are settled directly into your bank account via UPI every Monday. Founding hosts in Gurugram and Delhi are already earning ₹25,000 to ₹40,000 extra each month doing what they love!",
        speechSubtext: "Monetize your sports passion, city knowledge, and social energy.",
        stageBackdrop: "earnings_vault",
        interactiveAction: {
          label: "💸 Simulate Monday UPI Payout",
          actionOutcome: "Chime! ₹8,600 credited to your UPI account for 5 sessions!"
        },
        keyTakeaways: [
          "Direct UPI weekly payouts with complete earnings reports",
          "Build a top-rated profile with glowing 5-star reviews",
          "Founding host badge unlocks priority bookings in your area"
        ]
      }
    ]
  }
];

interface AnimatedCharacterStorySectionProps {
  onOpenBookingClick?: () => void;
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

  // Audio / Speech Narration State
  const [voiceNarrationEnabled, setVoiceNarrationEnabled] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  const currentEpisode = STORY_EPISODES[selectedEpisodeIdx];
  const currentScene = currentEpisode.scenes[currentSceneIdx];
  const activeSpeakerId = activeSpeakerOverride || currentEpisode.speakerId;
  const currentSpeaker = CHARACTERS[activeSpeakerId];

  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop any active speech synthesis
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

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

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

    return () => {
      stopSpeech();
    };
  }, [selectedEpisodeIdx, currentSceneIdx, activeSpeakerId, voiceNarrationEnabled]);

  // Auto-play timer
  useEffect(() => {
    if (!autoPlay) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      handleNextScene();
    }, 6500);

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
      // Loop or go to next episode
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

  // Poke Character (Interactive Easter Egg)
  const handlePokeCharacter = () => {
    audio.playClick();
    audio.playBlip(720);
    setCharacterPokeCount((c) => c + 1);
    setCharacterActionPulse(true);
    setTimeout(() => setCharacterActionPulse(false), 600);

    const quotes = [
      "Akele kyu? Happy Hangouts Hai na!! 🙌",
      "Ready for some fun in CyberHub or CP? Let's go!",
      "100% ID verified, strictly public places, zero drama!",
      "Badminton, artisan chai, or sunrise trails — you pick!",
      "Need a partner this weekend? We've got you covered!"
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
            <div className="flex items-center gap-2 mb-2">
              <span className="tag">Interactive Character Theatre</span>
              <span className="text-xs font-black text-[#1f4ee0] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Living Animated Guide
              </span>
            </div>
            <h2 className="text-[32px] sm:text-[48px] font-extrabold tracking-tight text-[#0b1f5c] leading-tight">
              Akele kyu? Let Muba & Friends Show You!
            </h2>
            <p className="text-[#4a5a8a] font-medium text-base sm:text-lg max-w-2xl mt-1">
              Watch Muba, Ujjwal, Sonika, Jyoti, and Falguni act out real hangouts, explain our 4-pillar safety shield, and show how Gurugram and Delhi meet.
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
                  ? "bg-[#ffc933] text-[#0b1f5c] border-[#0b1f5c] animate-pulse"
                  : "bg-white text-[#4a5a8a] border-[#0b1f5c] hover:bg-slate-50"
              }`}
              title="Toggle Browser Voice Narration"
            >
              {voiceNarrationEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#0b1f5c]" />
                  <span>Voice Narrator: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#4a5a8a]" />
                  <span>Voice Narrator: OFF</span>
                </>
              )}
            </button>

            {/* Auto-Play Toggle */}
            <button
              type="button"
              onClick={() => {
                audio.playToggle();
                setAutoPlay(!autoPlay);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-[2px] font-display font-extrabold text-xs transition-all shadow-[2px_2px_0_#0b1f5c] cursor-pointer ${
                autoPlay
                  ? "bg-[#1f4ee0] text-white border-[#0b1f5c]"
                  : "bg-white text-[#0b1f5c] border-[#0b1f5c] hover:bg-slate-50"
              }`}
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{autoPlay ? "Auto-Play ON" : "Auto-Play"}</span>
            </button>
          </div>
        </motion.div>

        {/* 1. EPISODE PICKER TABS */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
          {STORY_EPISODES.map((ep, idx) => {
            const isSelected = idx === selectedEpisodeIdx;
            return (
              <button
                key={ep.id}
                type="button"
                onClick={() => handleSelectEpisode(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border-[2.5px] font-display font-black text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#0b1f5c] text-white border-[#0b1f5c] shadow-[4px_4px_0_#ffc933] scale-[1.02]"
                    : "bg-white text-[#0b1f5c] border-[#0b1f5c] hover:bg-[#ffc933]/20 shadow-[2px_2px_0_#0b1f5c]"
                }`}
              >
                <span className="text-base">{ep.icon}</span>
                <span>{ep.shortTitle}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-[#4a5a8a]"}`}>
                  {ep.scenes.length} Scenes
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. THE ANIMATED CHARACTER THEATRE STAGE */}
        <div className="bg-white border-[3px] border-[#0b1f5c] rounded-[32px] shadow-[8px_8px_0_#0b1f5c] overflow-hidden mb-8">
          
          {/* Stage Top Bar: Location & Episode Title */}
          <div className="bg-[#f3f8ff] border-b-[2.5px] border-[#0b1f5c] px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="bg-[#ffc933] text-[#0b1f5c] text-xs font-black px-2.5 py-1 rounded-full border border-[#0b1f5c]">
                EPISODE {currentEpisode.number}
              </span>
              <h3 className="font-display font-extrabold text-[#0b1f5c] text-base sm:text-lg">
                {currentEpisode.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#1f4ee0] bg-white px-3 py-1 rounded-full border border-[#0b1f5c]">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {currentScene.locationBadge}
              </span>
            </div>
          </div>

          {/* MAIN STAGE VIEWPORT (Dynamic Graphic Canvas) */}
          <div className="p-6 sm:p-10 bg-gradient-to-b from-[#eaf2ff] via-[#f7faff] to-white relative min-h-[460px] flex flex-col justify-between overflow-hidden">
            
            {/* Background Graphic Accents based on scene */}
            <div className="absolute top-4 right-6 pointer-events-none opacity-25">
              {currentScene.stageBackdrop === "cyberhub" && (
                <div className="text-7xl font-black text-[#1f4ee0]">🏙️ ☕ ⚡</div>
              )}
              {currentScene.stageBackdrop === "badminton_court" && (
                <div className="text-7xl font-black text-emerald-600">🏸 🏆 ⚡</div>
              )}
              {currentScene.stageBackdrop === "safety_vault" && (
                <div className="text-7xl font-black text-blue-600">🛡️ 🔒 100%</div>
              )}
              {currentScene.stageBackdrop === "sunder_nursery" && (
                <div className="text-7xl font-black text-emerald-700">🌿 🌸 🏛️</div>
              )}
              {currentScene.stageBackdrop === "earnings_vault" && (
                <div className="text-7xl font-black text-amber-500">💰 💸 ₹₹</div>
              )}
            </div>

            {/* Top Scene Subtitle */}
            <div className="relative z-10 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#1f4ee0] block">
                  Scene {currentSceneIdx + 1} of {currentEpisode.scenes.length}
                </span>
                <h4 className="text-xl sm:text-2xl font-extrabold text-[#0b1f5c]">
                  {currentScene.stageTitle}
                </h4>
              </div>

              {/* Host Quick Switcher (Meet our Hosts Episode) */}
              {currentEpisode.id === "meet-hosts" && (
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border-[2px] border-[#0b1f5c] shadow-xs">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 py-4 my-auto">
              
              {/* LEFT: THE ANIMATED CHARACTER (SVG + Framer Motion) */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center">
                
                {/* Character Interactive Hitbox */}
                <motion.div
                  onClick={handlePokeCharacter}
                  animate={{
                    y: characterActionPulse ? [0, -25, 0] : [0, -8, 0],
                    rotate: characterActionPulse ? [0, -5, 5, 0] : 0,
                    scale: characterActionPulse ? 1.08 : 1
                  }}
                  transition={{
                    y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
                    scale: { duration: 0.3 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer relative group flex flex-col items-center"
                  title="Click me to talk or high-five!"
                >
                  
                  {/* Glowing Character Aura / Shadow */}
                  <div 
                    className="absolute -inset-4 rounded-full blur-xl opacity-35 transition-all group-hover:opacity-60"
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
                        // Ujjwal with badminton racket
                        <g>
                          <line x1="55" y1="120" x2="30" y2="105" stroke="#0b1f5c" strokeWidth="12" strokeLinecap="round" />
                          <circle cx="20" cy="85" r="18" fill="none" stroke="#1f4ee0" strokeWidth="3" />
                          <line x1="20" y1="85" x2="28" y2="105" stroke="#0b1f5c" strokeWidth="3.5" />
                          {/* Flying Shuttlecock */}
                          <text x="8" y="70" fontSize="16">🏸</text>
                        </g>
                      ) : activeSpeakerId === "sonika" ? (
                        // Sonika holding coffee mug with steam
                        <g>
                          <line x1="145" y1="125" x2="165" y2="135" stroke="#0b1f5c" strokeWidth="12" strokeLinecap="round" />
                          <rect x="160" y="125" width="18" height="18" rx="4" fill="#ffffff" stroke="#0b1f5c" strokeWidth="2.5" />
                          <text x="160" y="120" fontSize="14">☕</text>
                        </g>
                      ) : activeSpeakerId === "jyoti" ? (
                        // Jyoti with binoculars
                        <g>
                          <line x1="145" y1="125" x2="160" y2="115" stroke="#0b1f5c" strokeWidth="12" strokeLinecap="round" />
                          <text x="155" y="115" fontSize="16">🥾</text>
                        </g>
                      ) : activeSpeakerId === "falguni" ? (
                        // Falguni with acoustic guitar
                        <g>
                          <ellipse cx="40" cy="140" rx="20" ry="14" fill="#d97706" stroke="#0b1f5c" strokeWidth="2.5" />
                          <line x1="40" y1="140" x2="25" y2="100" stroke="#0b1f5c" strokeWidth="4" />
                          <text x="15" y="95" fontSize="14">🎵</text>
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
                      Tap me to interact! 👆
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
                  className="bg-white border-[3px] border-[#0b1f5c] rounded-[26px] p-5 sm:p-7 shadow-[6px_6px_0_#0b1f5c] relative mb-4"
                >
                  
                  {/* Bubble Pointer Arrow on desktop */}
                  <div className="hidden lg:block absolute -left-3.5 top-12 w-6 h-6 bg-white border-l-[3px] border-b-[3px] border-[#0b1f5c] -rotate-45" />

                  {/* Speaker Header Strip */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm border border-[#0b1f5c]"
                        style={{ backgroundColor: currentSpeaker.avatarBg }}
                      >
                        {currentSpeaker.emoji}
                      </div>
                      <div>
                        <p className="text-xs font-black text-[#0b1f5c] leading-none">
                          {currentSpeaker.name}
                        </p>
                        <p className="text-[10px] text-[#4a5a8a] font-semibold">
                          {currentScene.characterMood.toUpperCase()} VIBE
                        </p>
                      </div>
                    </div>

                    {isSpeaking && (
                      <div className="flex items-center gap-1 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        <span className="text-[10px] font-black text-rose-600">SPEAKING...</span>
                      </div>
                    )}
                  </div>

                  {/* The Dialogue Text (Large & Expressive) */}
                  <p className="font-display font-bold text-lg sm:text-2xl text-[#0b1f5c] leading-snug sm:leading-relaxed mb-3">
                    "{currentScene.dialogue}"
                  </p>

                  <p className="text-xs sm:text-sm text-[#4a5a8a] font-medium italic border-l-2 border-[#ffc933] pl-3 py-0.5">
                    💡 {currentScene.speechSubtext}
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

                  {/* Interactive Action Button for this Scene */}
                  {currentScene.interactiveAction && (
                    <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleTriggerAction}
                        className="btn b text-xs sm:text-sm py-2.5 px-5 shadow-[3px_3px_0_#0b1f5c] cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 fill-current" />
                        {currentScene.interactiveAction.label}
                      </button>

                      {actionFeedback && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-emerald-50 text-emerald-800 border-[1.5px] border-emerald-600 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{actionFeedback}</span>
                        </motion.div>
                      )}
                    </div>
                  )}

                </motion.div>

              </div>

            </div>

            {/* STAGE BOTTOM CONTROLS: TIMELINE STEPPER & SCENE SWITCHER */}
            <div className="relative z-10 pt-4 border-t-[2px] border-[#0b1f5c]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              
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

        {/* 3. QUICK ACTION STRIP (Conversion Callouts) */}
        <div className="bg-[#ffc933] border-[2.5px] border-[#0b1f5c] rounded-2xl p-5 sm:p-6 shadow-[5px_5px_0_#0b1f5c] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-display font-extrabold text-xl text-[#0b1f5c]">
              Ready to experience this in Gurugram or Delhi?
            </h4>
            <p className="text-xs sm:text-sm text-[#0b1f5c] font-bold mt-0.5">
              Browse 50+ verified activity partners or join our founding hosts earning ₹25k–₹40k/month.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="#match"
              onClick={() => {
                audio.playClick();
                if (onOpenBookingClick) onOpenBookingClick();
              }}
              className="btn b text-xs sm:text-sm py-2.5 px-4 shadow-[3px_3px_0_#0b1f5c]"
            >
              ⚡ Book a Hangout Partner
            </a>
            <a
              href="#join"
              onClick={() => {
                audio.playClick();
                if (onApplyHostClick) onApplyHostClick();
              }}
              className="btn text-xs sm:text-sm py-2.5 px-4 shadow-[3px_3px_0_#0b1f5c]"
            >
              🙌 Get Hangout Pass
            </a>
          </div>
        </div>

      </div>

    </section>
  );
}
