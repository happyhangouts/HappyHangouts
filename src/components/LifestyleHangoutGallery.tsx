import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import interestRunningTrackImg from "../assets/images/interest_running_track_1794643865023.jpg";
import siriFortBadmintonImg from "../assets/images/siri_fort_badminton_1794643259030.jpg";
import interestWeekendHikeImg from "../assets/images/interest_weekend_hike_1794650755581.jpg";
import courtyardBoardgamesChaiImg from "../assets/images/courtyard_boardgames_chai_1794643259092.jpg";
import hangoutParkWalkImg from "../assets/images/hangout_park_walk_1794391404397.jpg";

export interface CoreActivityExperience {
  actId: "running" | "rackets" | "hike" | "games_cafe" | "photowalk";
  slot: string;
  title: string;
  location: string;
  image: string;
  alt: string;
}

interface LifestyleHangoutGalleryProps {
  onExploreVibes?: () => void;
  onSelectActivity?: (actId: string) => void;
}

export default function LifestyleHangoutGallery({
  onExploreVibes,
  onSelectActivity
}: LifestyleHangoutGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const experiences: CoreActivityExperience[] = [
    {
      actId: "running",
      slot: "Weekday mornings",
      title: "Running buddy",
      location: "Lodhi Garden & Tau Devi Lal Park",
      image: interestRunningTrackImg,
      alt: "Running shoes, sports watch, and water bottle on a sunrise track in Delhi NCR"
    },
    {
      actId: "rackets",
      slot: "Weekday evenings",
      title: "Pickleball or badminton",
      location: "Sector 29 Courts & Siri Fort Arena",
      image: siriFortBadmintonImg,
      alt: "Two Indian badminton players mid-rally across the net inside Siri Fort indoor court"
    },
    {
      actId: "hike",
      slot: "Saturday morning",
      title: "Weekend hike",
      location: "Aravalli Ridge & Mangar Bani Trail",
      image: interestWeekendHikeImg,
      alt: "Hiking daypack, steel thermos flask, and trail hat overlooking sunlit Aravalli hills"
    },
    {
      actId: "games_cafe",
      slot: "Saturday evening",
      title: "Chess or board games at a café",
      location: "32nd Avenue & Khan Market Cafés",
      image: courtyardBoardgamesChaiImg,
      alt: "Friends playing a strategy board game with kulhad chai at a sunlit courtyard café"
    },
    {
      actId: "photowalk",
      slot: "Sunday morning",
      title: "Photo walk",
      location: "Sunder Nursery & Lodhi Colony",
      image: hangoutParkWalkImg,
      alt: "Friends strolling along a heritage stone garden path near Mughal arches in New Delhi"
    }
  ];

  const handleCardAction = (actId: string) => {
    if (onSelectActivity) {
      onSelectActivity(actId);
    } else if (onExploreVibes) {
      onExploreVibes();
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const distance = direction === "right" ? 260 : -260;
    scrollContainerRef.current.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <section className="py-10 sm:py-14 bg-[#F3F7FF] border-b border-[#0B1230]/10">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Side: Concise Intro */}
          <div className="lg:col-span-5 text-left">
            <span className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-[#0A2EB8] block mb-2">
              5 Curated Weekly Slots · Delhi NCR
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#0B1230] leading-tight font-extrabold tracking-tight">
              5 curated weekly hangouts.
            </h2>
            <p className="mt-2.5 text-[#0B1230]/75 text-sm sm:text-base leading-relaxed font-normal">
              Pick a weekly time slot on the right to jump straight into curated public experiences below.
            </p>
          </div>

          {/* Right Side: Compact Horizontal Scrollable Slot Strip */}
          <div className="lg:col-span-7 min-w-0 bg-white border border-[#0A2EB8]/15 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#0A2EB8]/10">
              <span className="text-[11px] uppercase tracking-[0.14em] font-extrabold text-[#0A2EB8]">
                Weekly Slot Schedule
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] font-semibold text-[#0B1230]/60 hidden sm:inline mr-1">
                  Scroll right
                </span>
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  aria-label="Scroll weekly slots left"
                  className="w-8 h-8 rounded-full border border-[#0A2EB8]/20 bg-[#F3F7FF] hover:bg-[#0A2EB8] hover:text-white text-[#0A2EB8] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  aria-label="Scroll weekly slots right"
                  className="w-8 h-8 rounded-full border border-[#0A2EB8]/20 bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex flex-nowrap gap-3 overflow-x-auto snap-x snap-mandatory pb-1.5 scroll-smooth scrollbar-none"
            >
              {experiences.map((item) => (
                <button
                  key={item.actId}
                  type="button"
                  onClick={() => handleCardAction(item.actId)}
                  className="w-[225px] sm:w-[240px] shrink-0 snap-start rounded-xl overflow-hidden border border-[#0A2EB8]/15 hover:border-[#3DAAFC] bg-[#0B1230] text-left transition-all group cursor-pointer relative shadow-xs"
                >
                  <div className="relative h-28 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.alt}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#011C92]/95 via-[#0B1230]/65 to-[#0B1230]/40" />
                    <div className="absolute inset-0 p-3 flex flex-col justify-between text-white">
                      <span className="self-start text-[10px] font-extrabold uppercase tracking-wider bg-[#FFC83D] text-[#0B1230] px-2 py-0.5 rounded">
                        {item.slot}
                      </span>
                      <div>
                        <div className="text-sm font-extrabold leading-snug text-white">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-white/80 font-medium truncate mt-0.5">
                          {item.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
