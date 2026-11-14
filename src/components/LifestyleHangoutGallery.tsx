import React from "react";
import { motion } from "motion/react";
import CircledHighlight from "./CircledHighlight";
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
  description: string;
  image: string;
  alt: string;
  gridSpan: string;
}

interface LifestyleHangoutGalleryProps {
  onExploreVibes?: () => void;
  onSelectActivity?: (actId: string) => void;
}

export default function LifestyleHangoutGallery({
  onExploreVibes,
  onSelectActivity
}: LifestyleHangoutGalleryProps) {
  const experiences: CoreActivityExperience[] = [
    {
      actId: "running",
      slot: "Weekday mornings",
      title: "Running buddy",
      location: "Lodhi Garden & Tau Devi Lal Park",
      description: "Start weekday mornings strong with 5K/10K pacing buddies for consistent dawn park loops and zero snooze-button excuses.",
      image: interestRunningTrackImg,
      alt: "Running shoes, sports watch, and water bottle on a sunrise track in Delhi NCR",
      gridSpan: "col-span-1 md:col-span-1 lg:col-span-2"
    },
    {
      actId: "rackets",
      slot: "Weekday evenings",
      title: "Pickleball or badminton",
      location: "Sector 29 Courts & Siri Fort Arena",
      description: "Unwind after work with crisp floodlit pickleball rallies or fast-paced badminton doubles with matched court partners.",
      image: siriFortBadmintonImg,
      alt: "Two Indian badminton players mid-rally across the net inside a bright wooden-floor Siri Fort indoor court",
      gridSpan: "col-span-1 md:col-span-1 lg:col-span-2"
    },
    {
      actId: "hike",
      slot: "Saturday morning",
      title: "Weekend hike",
      location: "Aravalli Ridge & Mangar Bani Trail",
      description: "Trade Saturday sleep-ins for sunrise rocky ridge trails, fresh air, and flask tea with vetted outdoor companions.",
      image: interestWeekendHikeImg,
      alt: "Hiking daypack, steel thermos flask, and trail hat overlooking lush sunlit Aravalli hills",
      gridSpan: "col-span-1 md:col-span-1 lg:col-span-2"
    },
    {
      actId: "games_cafe",
      slot: "Saturday evening",
      title: "Chess or board games at a café",
      location: "32nd Avenue & Khan Market Cafés",
      description: "Gather around sunlit café tables for blitz chess, Catan, kulhad chai, and relaxed screen-free Saturday banter.",
      image: courtyardBoardgamesChaiImg,
      alt: "Four friends playing a colorful strategy board game with kulhad chai cups at a sunlit bougainvillea courtyard table",
      gridSpan: "col-span-1 md:col-span-1 lg:col-span-3"
    },
    {
      actId: "photowalk",
      slot: "Sunday morning",
      title: "Photo walk",
      location: "Sunder Nursery & Lodhi Colony",
      description: "Catch golden Sunday morning light through Mughal heritage arches and murals with cameras, sketches, and easy conversation.",
      image: hangoutParkWalkImg,
      alt: "Two friends strolling along a heritage stone garden path in front of Mughal arches in New Delhi",
      gridSpan: "col-span-1 md:col-span-2 lg:col-span-3"
    }
  ];

  const handleCardAction = (actId: string) => {
    if (onSelectActivity) {
      onSelectActivity(actId);
    } else if (onExploreVibes) {
      onExploreVibes();
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F3F7FF] border-b border-[#0B1230]/10">
      <div className="wrap">
        
        {/* Header with High Symmetry & Brand Typography */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1 rounded-full border border-[#0B1230]/10 shadow-xs mb-3">
            <span className="w-2 h-2 rounded-full bg-[#19C37D]"></span>
            <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#0A2EB8]">
              5 Founding Weekly Activities · Delhi NCR
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl text-[#0B1230] leading-tight font-extrabold tracking-tight">
            Starting with{" "}
            <CircledHighlight circleColor="#3DAAFC">5 curated</CircledHighlight>{" "}
            weekly hangouts.
          </h2>
          <p className="mt-4 text-[#0B1230]/75 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Instead of an overwhelming list, we are launching Delhi NCR around 5 structured weekly time slots—so you always know what’s happening and when.
          </p>
        </div>

        {/* Clean 5-Slot Weekly Schedule Quick Bar */}
        <div className="bg-white border-2 border-[#0A2EB8]/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-10 sm:mb-12 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-[#0A2EB8]/10">
            <span className="text-xs uppercase tracking-[0.16em] font-extrabold text-[#0A2EB8]">
              Weekly Slot & Experience Schedule
            </span>
            <span className="text-xs font-bold text-[#0B1230]/70">
              Tap any slot to view curated experiences ↓
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {experiences.map((item) => (
              <button
                key={item.actId}
                type="button"
                onClick={() => handleCardAction(item.actId)}
                className="text-left p-3.5 rounded-xl bg-[#F3F7FF] hover:bg-[#FFC83D]/25 border border-[#0A2EB8]/15 hover:border-[#FFC83D] transition-all cursor-pointer group"
              >
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#0A2EB8] bg-white px-2 py-0.5 rounded border border-[#0A2EB8]/15 mb-1.5">
                  {item.slot}
                </span>
                <div className="text-sm font-extrabold text-[#0B1230] group-hover:text-[#0A2EB8] leading-snug">
                  {item.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Expansive 5-Card Responsive Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-7">
          {experiences.map((item, index) => (
            <motion.div
              key={item.actId}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`group bg-white rounded-3xl overflow-hidden border border-[#0B1230]/10 shadow-sm hover:shadow-xl hover:border-[#3DAAFC]/50 transition-all duration-300 flex flex-col ${item.gridSpan}`}
            >
              {/* Photo Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F3F7FF]">
                <img
                  src={item.image}
                  alt={item.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#011C92]/85 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-3.5 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5 text-white">
                  <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs font-semibold text-white/95">
                    <span className="bg-[#FFC83D] text-[#0B1230] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0">
                      {item.slot}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>

              {/* Editorial Card Body */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl sm:text-2xl text-[#0B1230] font-bold leading-snug mb-2 group-hover:text-[#0A2EB8] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#0B1230]/75 text-sm leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#F3F7FF] flex items-center flex-wrap justify-between gap-3 text-xs">
                  <span className="font-bold text-[#0A2EB8] flex items-center gap-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#19C37D]"></span>
                    <span>First 3 Free</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCardAction(item.actId)}
                    className="inline-flex items-center gap-1.5 bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-bold text-xs py-2.5 px-4 rounded-full shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer min-h-[40px] shrink-0"
                  >
                    <span>Book experience</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Symmetrical Bottom Assurance Banner */}
        <div className="mt-14 p-6 sm:p-8 bg-white border border-[#0B1230]/10 rounded-3xl max-w-4xl mx-auto text-center shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="px-4">
              <div className="text-xl font-extrabold text-[#0B1230] mb-1">100% Public Venues</div>
              <p className="text-xs text-[#0B1230]/70 leading-relaxed font-medium">
                CyberHub, Khan Market, sports courts, cafés & botanical parks only.
              </p>
            </div>
            <div className="px-4 sm:border-x sm:border-[#0B1230]/10">
              <div className="text-xl font-extrabold text-[#0A2EB8] mb-1">5 Curated Experiences</div>
              <p className="text-xs text-[#0B1230]/70 leading-relaxed font-medium">
                Focused weekly rituals designed around real shared activity—never profiles.
              </p>
            </div>
            <div className="px-4">
              <div className="text-xl font-extrabold text-[#0B1230] mb-1 flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#19C37D]"></span>
                <span>Vetted Activity Hosts</span>
              </div>
              <p className="text-xs text-[#0B1230]/70 leading-relaxed font-medium">
                Government ID-checked local captains assigned once your spot is confirmed.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
