import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Check, 
  X, 
  ArrowRight, 
  Radio, 
  Film, 
  Users, 
  CheckCircle2,
  Tv
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { audio } from "../utils/audio";

export interface InformativeVideo {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  category: "how-it-works" | "safety" | "hosts" | "community";
  categoryLabel: string;
  badge: string;
  thumbnail: string;
  videoUrl: string;
  presenter: string;
  presenterRole: string;
  keyPoints: string[];
  subtitles: { time: number; text: string }[];
  viewsCount: string;
  ctaText: string;
  ctaAction: "book" | "host" | "safety";
}

export const INFORMATIVE_VIDEOS: InformativeVideo[] = [
  {
    id: "how-it-works-60s",
    title: "How Happy Hangouts Works in 60 Seconds",
    subtitle: "From picking your activity to meeting safely at DLF CyberHub or CP",
    duration: "0:12",
    category: "how-it-works",
    categoryLabel: "How It Works",
    badge: "Must Watch",
    thumbnail: "/src/assets/images/video_thumb_how_it_works_1793357739439.jpg",
    videoUrl: "/assets/videos/hh_how_it_works.mp4",
    presenter: "Muba & Community Team",
    presenterRole: "Local Vibe Lead · NCR",
    keyPoints: [
      "Select your activity (badminton, specialty cafe, trek, music jam)",
      "Browse 100% ID-verified companions with transparent hourly rates",
      "Meet strictly in vibrant public hubs (CyberHub, Khan Market, Siri Fort)",
      "Escrow UPI protection: funds only release after your session thumbs up"
    ],
    subtitles: [
      { time: 0, text: "Akele kyu? Happy Hangouts Hai na!!" },
      { time: 2, text: "STEP 1: Pick an activity — Badminton, Cafe, Treks or Music" },
      { time: 5, text: "STEP 2: Choose 100% ID-verified companions in Gurugram & Delhi" },
      { time: 8, text: "STEP 3: Meet at verified public hubs (DLF CyberHub, CP, Khan Market)" },
      { time: 10, text: "STEP 4: UPI Escrow Safe — Funds only released after you approve!" }
    ],
    viewsCount: "14.2k views",
    ctaText: "Find a Hangout Partner →",
    ctaAction: "book"
  },
  {
    id: "safety-protocol-4pillar",
    title: "The 4-Pillar Safety Shield & Biometrics",
    subtitle: "How we verify every Aadhaar ID & enforce public-only meetups",
    duration: "0:12",
    category: "safety",
    categoryLabel: "Safety & Escrow",
    badge: "Trust Protocol",
    thumbnail: "/src/assets/images/video_thumb_safety_escrow_1793357740741.jpg",
    videoUrl: "/assets/videos/hh_safety_shield.mp4",
    presenter: "Safety Operations Lead",
    presenterRole: "Trust & Safety · Gurugram & Delhi",
    keyPoints: [
      "Government ID (Aadhaar/PAN) + Live Biometric selfie verification",
      "Strict public meeting spots only (No private residences, ever)",
      "Real-time session timer with 1-tap SOS and live GPS beacon",
      "Mandatory two-way post-hangout reviews with zero tolerance policy"
    ],
    subtitles: [
      { time: 0, text: "PILLAR 1: Govt ID (Aadhaar/PAN) + Live Biometric Face Matching" },
      { time: 3, text: "PILLAR 2: Strictly Public Places — No Private Home Meetups Ever" },
      { time: 6, text: "PILLAR 3: Real-Time Session Timer & 1-Tap SOS Emergency Beacon" },
      { time: 9, text: "PILLAR 4: Mutual 2-Way Reviews — Zero Tolerance for Bad Actors" }
    ],
    viewsCount: "9.8k views",
    ctaText: "Explore Safety Features →",
    ctaAction: "safety"
  },
  {
    id: "hosts-spotlight-ncr",
    title: "Meet Our Hosts: Ujjwal, Sonika, Jyoti & Falguni",
    subtitle: "Real badminton players, coffee lovers & trek leaders in NCR",
    duration: "0:12",
    category: "hosts",
    categoryLabel: "Host Spotlight",
    badge: "Featured Hosts",
    thumbnail: "/src/assets/images/video_thumb_host_spotlight_1793357740785.jpg",
    videoUrl: "/assets/videos/hh_hosts_spotlight.mp4",
    presenter: "Ujjwal, Sonika, Jyoti & Falguni",
    presenterRole: "Founding Activity Hosts",
    keyPoints: [
      "🏸 Ujjwal Poonia: Competitive badminton rallies in Sector 29 (₹400/hr)",
      "☕ Sonika Sharma: Pour-overs & startup chats at DLF CyberHub (₹450/hr)",
      "🥾 Jyoti Nandal: Sunrise botanical trails at Sunder Nursery (₹500/hr)",
      "🎸 Falguni Baddi: Acoustic open mics & songwriting in Khan Market (₹450/hr)"
    ],
    subtitles: [
      { time: 0, text: "UJJWAL POONIA: Badminton rallies & court drills in Sector 29" },
      { time: 3, text: "SONIKA SHARMA: Pour-over coffee & startup talks at DLF CyberHub" },
      { time: 6, text: "JYOTI NANDAL: Sunrise heritage walks & trails at Sunder Nursery" },
      { time: 9, text: "FALGUNI BADDI: Acoustic jamming & indie open mics in Central Delhi" }
    ],
    viewsCount: "18.5k views",
    ctaText: "Book a Host Session →",
    ctaAction: "book"
  },
  {
    id: "weekend-community-walks",
    title: "First-Timer Walkthrough: No More Solo Weekends",
    subtitle: "How newcomers to Gurugram & Delhi connect without dating app noise",
    duration: "0:12",
    category: "community",
    categoryLabel: "Community Stories",
    badge: "NCR Stories",
    thumbnail: "/src/assets/images/video_thumb_community_walk_1793357742267.jpg",
    videoUrl: "/assets/videos/hh_community_walks.mp4",
    presenter: "NCR Community Members",
    presenterRole: "Active Hangout Seekers",
    keyPoints: [
      "Eliminates awkwardness with transparent, activity-first focus",
      "Pay strictly by the hour with zero subscription lock-ins",
      "Perfect for corporate transplants, sport lovers, and weekend wanderers",
      "Join morning runs, museum walks, or weekend board game sessions"
    ],
    subtitles: [
      { time: 0, text: "New in town? Skip the awkward dating app chatter and noise" },
      { time: 3, text: "Connect for an hour over sports, board games or specialty chai" },
      { time: 6, text: "Pay hourly with zero subscriptions and zero awkward expectations" },
      { time: 9, text: "Find your weekend tribe across Gurugram, Delhi & South NCR" }
    ],
    viewsCount: "11.1k views",
    ctaText: "Join Community Waitlist →",
    ctaAction: "host"
  },
  {
    id: "host-earnings-walkthrough",
    title: "Become a Host: Earn ₹25,000–₹40,000/mo on Your Schedule",
    subtitle: "Turn your badminton hobby, chai passion, or city knowledge into income",
    duration: "0:12",
    category: "hosts",
    categoryLabel: "Host Guide",
    badge: "Host Blueprint",
    thumbnail: "/src/assets/images/video_thumb_host_spotlight_1793357740785.jpg",
    videoUrl: "/assets/videos/hh_host_earnings.mp4",
    presenter: "Partner Onboarding Team",
    presenterRole: "Host Success Lead",
    keyPoints: [
      "Set your transparent hourly rate (₹300 to ₹700/hr) on your terms",
      "Retain 80% take-home pay with automated weekly direct UPI transfers",
      "Accept only requests that fit your calendar and preferred public spots",
      "Gain verified host badges and build your local reputation"
    ],
    subtitles: [
      { time: 0, text: "Love badminton, cafe hopping, photography or trekking?" },
      { time: 3, text: "Set your hourly rate (Rs 300 to Rs 700/hr) on your terms" },
      { time: 6, text: "Keep 80% take-home pay with automated weekly direct UPI transfers" },
      { time: 9, text: "Become a verified founding host in Gurugram & Delhi today!" }
    ],
    viewsCount: "16.9k views",
    ctaText: "Apply to Earn as Host →",
    ctaAction: "host"
  }
];

const VIDEO_CATEGORIES = [
  { id: "all", label: "🎬 All Videos" },
  { id: "how-it-works", label: "💡 How It Works" },
  { id: "safety", label: "🛡️ Safety & Escrow" },
  { id: "hosts", label: "🏸 Host Spotlights" },
  { id: "community", label: "🌿 Community Stories" }
];

interface InformativeVideosSectionProps {
  onOpenBookingClick?: () => void;
  onApplyHostClick?: () => void;
  onExploreSafetyClick?: () => void;
}

export default function InformativeVideosSection({
  onOpenBookingClick,
  onApplyHostClick,
  onExploreSafetyClick
}: InformativeVideosSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeVideo, setActiveVideo] = useState<InformativeVideo | null>(null);
  
  // Custom Video Player States inside Modal
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(12.7);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Featured Hero Video (First one)
  const featuredVideo = INFORMATIVE_VIDEOS[0];

  // Filtered video list
  const filteredVideos = INFORMATIVE_VIDEOS.filter(
    (v) => selectedCategory === "all" || v.category === selectedCategory
  );

  // Play video in modal
  const handleOpenVideo = (video: InformativeVideo) => {
    audio.playPageTransition();
    setActiveVideo(video);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handleCloseVideo = () => {
    audio.playToggle();
    setActiveVideo(null);
  };

  const handleTogglePlay = () => {
    audio.playClick();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    audio.playToggle();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    audio.playClick();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Find active subtitle
  const currentSubtitle = activeVideo?.subtitles.slice().reverse().find(
    (s) => currentTime >= s.time
  )?.text;

  return (
    <section id="videos" className="py-16 sm:py-24 bg-white border-b-[2.5px] border-[#0b1f5c] relative overflow-hidden">
      <div className="wrap">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="tag">Watch & Learn</span>
              <span className="text-xs font-black text-[#1f4ee0] uppercase tracking-wider flex items-center gap-1">
                <Tv className="w-3.5 h-3.5" /> Informative Video Guides
              </span>
            </div>
            <h2 className="text-[32px] sm:text-[50px] font-extrabold tracking-tight text-[#0b1f5c] leading-tight">
              See How Happy Hangouts Works
            </h2>
            <p className="text-[#4a5a8a] font-medium text-base sm:text-lg max-w-2xl mt-1">
              Watch real host walkthroughs, understand our 4-pillar safety shield, and see how Gurugram and Delhi residents meet for badminton, coffee, and weekend treks.
            </p>
          </div>

          {/* Quick Counter Badge */}
          <div className="bg-[#f3f8ff] border-[2px] border-[#0b1f5c] rounded-2xl px-4 py-2.5 shadow-[3px_3px_0_#0b1f5c] shrink-0 self-start md:self-auto flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
            <div>
              <p className="text-xs font-black text-[#0b1f5c]">5 Video Guides</p>
              <p className="text-[10px] text-[#4a5a8a] font-bold">100% ID & Escrow Verified</p>
            </div>
          </div>
        </motion.div>

        {/* 1. FEATURED HERO VIDEO CAROUSEL / SPOTLIGHT BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="bg-[#f3f8ff] border-[3px] border-[#0b1f5c] rounded-[28px] p-6 sm:p-8 shadow-[8px_8px_0_#0b1f5c] mb-12 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Video Preview Card with Real Play Trigger */}
            <div className="lg:col-span-7 relative group cursor-pointer" onClick={() => handleOpenVideo(featuredVideo)}>
              <div className="relative aspect-video rounded-2xl overflow-hidden border-[2.5px] border-[#0b1f5c] shadow-[4px_4px_0_#0b1f5c] bg-[#0b1f5c]">
                
                {/* Poster Image */}
                <img 
                  src={featuredVideo.thumbnail} 
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f5c]/80 via-transparent to-black/20"></div>

                {/* Duration Badge */}
                <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-xs text-white text-xs font-mono font-bold px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#ffc933]" /> {featuredVideo.duration}
                </span>

                {/* Category Sticker */}
                <span className="absolute top-3 left-3 bg-[#ffc933] text-[#0b1f5c] text-xs font-extrabold px-3 py-1 rounded-full border-[1.5px] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c]">
                  ⭐ {featuredVideo.badge}
                </span>

                {/* Big Interactive Play Button Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.92 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1f4ee0] text-white flex items-center justify-center border-[3px] border-[#0b1f5c] shadow-[4px_4px_0_#0b1f5c] group-hover:bg-[#ffc933] group-hover:text-[#0b1f5c] transition-colors"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-current" />
                  </motion.div>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs font-bold">
                  <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md">
                    Tap to watch interactive walkthrough (Audio On)
                  </span>
                  <span className="bg-emerald-600/90 px-2 py-0.5 rounded text-[10px] font-mono font-extrabold">
                    HD · 1080P
                  </span>
                </div>

              </div>
            </div>

            {/* Right: Featured Video Story & Takeaways */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#1f4ee0] mb-1 block">
                  {featuredVideo.categoryLabel} · {featuredVideo.viewsCount}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0b1f5c] leading-tight mb-2">
                  {featuredVideo.title}
                </h3>
                <p className="text-sm sm:text-base text-[#4a5a8a] font-medium mb-4 leading-relaxed">
                  {featuredVideo.subtitle}
                </p>

                {/* Presenter pill */}
                <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border-[1.5px] border-[#0b1f5c] mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#1f4ee0] text-white flex items-center justify-center font-bold text-base border border-[#0b1f5c]">
                    ☕
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0b1f5c]">{featuredVideo.presenter}</p>
                    <p className="text-[10px] text-[#4a5a8a] font-semibold">{featuredVideo.presenterRole}</p>
                  </div>
                </div>

                {/* Key Points Checklist */}
                <div className="space-y-2 mb-6">
                  {featuredVideo.keyPoints.slice(0, 3).map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-bold text-[#0b1f5c]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenVideo(featuredVideo)}
                  className="btn b text-sm py-2.5 px-5 shadow-[3px_3px_0_#0b1f5c] cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> Watch Full Guide ({featuredVideo.duration})
                </button>
                <a
                  href="#match"
                  onClick={() => audio.playClick()}
                  className="btn text-sm py-2.5 px-4 shadow-[3px_3px_0_#0b1f5c]"
                >
                  Find a Partner →
                </a>
              </div>

            </div>

          </div>
        </motion.div>

        {/* 2. CATEGORY FILTER TABS */}
        <div className="flex gap-2 flex-wrap mb-6">
          {VIDEO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                audio.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`chip text-xs sm:text-sm py-1.5 px-3.5 ${
                selectedCategory === cat.id ? "active" : ""
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3. INFORMATIVE VIDEO CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-white border-[2.5px] border-[#0b1f5c] rounded-[22px] p-4 sm:p-5 shadow-[5px_5px_0_#0b1f5c] flex flex-col justify-between group cursor-pointer"
              onClick={() => handleOpenVideo(video)}
            >
              <div>
                {/* Thumbnail container */}
                <div className="relative aspect-video rounded-xl overflow-hidden border-[2px] border-[#0b1f5c] mb-3 bg-[#0b1f5c]">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  
                  {/* Category Pill */}
                  <span className="absolute top-2 left-2 bg-[#ffc933] text-[#0b1f5c] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#0b1f5c]">
                    {video.badge}
                  </span>

                  {/* Duration Badge */}
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/20 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-[#ffc933]" /> {video.duration}
                  </span>

                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-[#1f4ee0] text-white flex items-center justify-center border-[2px] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] group-hover:bg-[#ffc933] group-hover:text-[#0b1f5c] group-hover:scale-110 transition-all">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex items-center justify-between text-[11px] font-bold text-[#4a5a8a] mb-1">
                  <span>{video.categoryLabel}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-extrabold">
                    {video.viewsCount}
                  </span>
                </div>

                <h4 className="text-lg font-extrabold text-[#0b1f5c] leading-snug mb-1 group-hover:text-[#1f4ee0] transition-colors">
                  {video.title}
                </h4>
                
                <p className="text-xs text-[#4a5a8a] font-medium line-clamp-2 mb-3">
                  {video.subtitle}
                </p>
              </div>

              {/* Presenter Footer Bar */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#1f4ee0] flex items-center justify-center text-xs font-bold border border-[#0b1f5c]">
                    ✓
                  </div>
                  <span className="text-xs font-bold text-[#0b1f5c] truncate max-w-[150px]">
                    {video.presenter}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#1f4ee0] flex items-center gap-1">
                  Play <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

            </motion.div>
          ))}
        </div>

      </div>

      {/* 4. INTERACTIVE FULL VIDEO PLAYER MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border-[3px] border-[#0b1f5c] rounded-[28px] max-w-3xl w-full shadow-[12px_12px_0_#0b1f5c] overflow-hidden flex flex-col max-h-[92vh]"
            >
              
              {/* Modal Top Bar */}
              <div className="px-5 py-3.5 bg-[#f3f8ff] border-b-[2px] border-[#0b1f5c] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#0b1f5c]">
                    Happy Hangouts Media Player · {activeVideo.categoryLabel}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCloseVideo}
                  className="p-1.5 rounded-full border-[2px] border-[#0b1f5c] hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Close Video"
                >
                  <X className="w-5 h-5 text-[#0b1f5c]" />
                </button>
              </div>

              {/* Video Player Viewport */}
              <div className="relative bg-black aspect-video w-full overflow-hidden flex items-center justify-center group">
                <video
                  key={activeVideo.id}
                  ref={videoRef}
                  src={activeVideo.videoUrl}
                  autoPlay
                  playsInline
                  loop
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full object-contain"
                />

                {/* Subtitles Overlay */}
                {showSubtitles && currentSubtitle && (
                  <div className="absolute bottom-16 inset-x-4 text-center pointer-events-none z-20">
                    <span className="inline-block bg-black/85 text-[#ffc933] font-display font-bold text-xs sm:text-base px-3 py-1.5 rounded-lg border border-white/20 shadow-lg">
                      {currentSubtitle}
                    </span>
                  </div>
                )}

                {/* Big Center Play/Pause button on Hover */}
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent cursor-pointer"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {!isPlaying && (
                    <div className="w-16 h-16 rounded-full bg-[#1f4ee0]/90 text-white flex items-center justify-center border-2 border-white shadow-xl">
                      <Play className="w-8 h-8 ml-1 fill-current" />
                    </div>
                  )}
                </button>

                {/* Player Bottom Control Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-6 z-30 flex flex-col gap-1.5">
                  
                  {/* Progress Timeline Scrubber */}
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={duration || 12.7}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-[#ffc933]"
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between text-white text-xs font-bold pt-1">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="p-1 hover:text-[#ffc933] transition-colors cursor-pointer"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>

                      <button
                        type="button"
                        onClick={handleRestart}
                        className="p-1 hover:text-[#ffc933] transition-colors cursor-pointer"
                        title="Restart"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleMute}
                        className="p-1 hover:text-[#ffc933] transition-colors cursor-pointer"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <span className="font-mono text-[11px] text-slate-300">
                        {Math.floor(currentTime)}s / {Math.floor(duration || 12.7)}s
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          audio.playClick();
                          setShowSubtitles(!showSubtitles);
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          showSubtitles ? "bg-[#ffc933] text-[#0b1f5c] border-[#ffc933]" : "bg-transparent text-slate-300 border-slate-500"
                        }`}
                      >
                        CC {showSubtitles ? "ON" : "OFF"}
                      </button>

                      <span className="text-[10px] text-blue-300 font-mono hidden sm:inline">
                        Happy Hangouts NCR
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Modal Body Info & Key Takeaways */}
              <div className="p-5 overflow-y-auto space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#0b1f5c]">
                      {activeVideo.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4a5a8a] font-medium mt-0.5">
                      {activeVideo.subtitle}
                    </p>
                  </div>
                  <span className="text-xs font-black bg-[#ffc933] text-[#0b1f5c] px-3 py-1 rounded-full border border-[#0b1f5c] self-start sm:self-auto shrink-0">
                    ⭐ {activeVideo.badge}
                  </span>
                </div>

                {/* Quick Video Switcher Strip inside modal */}
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#4a5a8a] mb-2 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[#1f4ee0]" />
                    Watch Other Happy Hangouts Guides:
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                    {INFORMATIVE_VIDEOS.map((v) => {
                      const isCurrent = v.id === activeVideo.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            audio.playClick();
                            setActiveVideo(v);
                            setIsPlaying(true);
                            setCurrentTime(0);
                          }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border-[2px] transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                            isCurrent
                              ? "bg-[#ffc933] text-[#0b1f5c] border-[#0b1f5c] shadow-[2px_2px_0_#0b1f5c] scale-[1.02]"
                              : "bg-white text-[#4a5a8a] border-[#0b1f5c]/30 hover:border-[#0b1f5c] hover:text-[#0b1f5c]"
                          }`}
                        >
                          <span>{v.category === "how-it-works" ? "💡" : v.category === "safety" ? "🛡️" : v.category === "community" ? "🌿" : "🏸"}</span>
                          <span className="truncate max-w-[130px] sm:max-w-none">{v.title}</span>
                          <span className="text-[10px] font-mono opacity-80">({v.duration})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Key Takeaways Box */}
                <div className="bg-[#f3f8ff] border-[2px] border-[#0b1f5c] rounded-2xl p-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0b1f5c] mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1f4ee0]" />
                    Key Takeaways & Safety Guidelines
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeVideo.keyPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-semibold text-[#0b1f5c] bg-white p-2.5 rounded-xl border border-[#0b1f5c]/30">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Presenter & Bottom Action Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1f4ee0] text-white flex items-center justify-center text-xs font-bold border border-[#0b1f5c]">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0b1f5c]">{activeVideo.presenter}</p>
                      <p className="text-[10px] text-[#4a5a8a] font-medium">{activeVideo.presenterRole}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="#match"
                      onClick={() => {
                        handleCloseVideo();
                        if (onOpenBookingClick) onOpenBookingClick();
                      }}
                      className="btn b text-xs py-2 px-4 shadow-[2px_2px_0_#0b1f5c]"
                    >
                      Browse Companions →
                    </a>
                    <a
                      href="#join"
                      onClick={() => {
                        handleCloseVideo();
                        if (onApplyHostClick) onApplyHostClick();
                      }}
                      className="btn text-xs py-2 px-4 shadow-[2px_2px_0_#0b1f5c]"
                    >
                      Get Hangout Pass 🙌
                    </a>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
