import React from "react";
import { motion } from "motion/react";
import CircledHighlight from "./CircledHighlight";

interface LifestyleHangoutGalleryProps {
  onExploreVibes?: () => void;
}

export default function LifestyleHangoutGallery({ onExploreVibes }: LifestyleHangoutGalleryProps) {
  const experiences = [
    {
      title: "Artisan Coffee & Honest Conversations",
      category: "Café Social",
      location: "DLF CyberHub & Khan Market",
      description: "Stroll bright coffee promenades, swap book recs, and share easygoing conversations over iced lattes.",
      image: "/src/assets/images/cyberhub_terrace_coffee_1794643257959.jpg",
      alt: "Two Indian friends walking outside a sunlit glass coffee bar at DLF CyberHub with iced lattes",
      aspect: "col-span-1 md:col-span-2 lg:col-span-2"
    },
    {
      title: "Morning Badminton & Weekend Sports",
      category: "Sports & Fitness",
      location: "Siri Fort Complex & Sector 29",
      description: "Never miss a court rally again. Team up with enthusiastic badminton buddies for friendly or competitive sets.",
      image: "/src/assets/images/siri_fort_badminton_1794643259030.jpg",
      alt: "Two Indian badminton players mid-rally across the net inside a bright wooden-floor Siri Fort indoor court",
      aspect: "col-span-1 md:col-span-1 lg:col-span-1"
    },
    {
      title: "Heritage Garden Walks & Photography",
      category: "Nature & Culture",
      location: "Sunder Nursery & Lodhi Gardens",
      description: "Breathe in Delhi's lush botanical gardens, historical arches, and tranquil morning photography walks.",
      image: "/src/assets/images/hangout_park_walk_1794391404397.jpg",
      alt: "Two women strolling and chatting along a stone garden path in front of Mughal heritage arches",
      aspect: "col-span-1 md:col-span-1 lg:col-span-1"
    },
    {
      title: "Board Games, Chai & Evening Banter",
      category: "Games & Social",
      location: "32nd Avenue & Connaught Place",
      description: "Gather around sunlit terrazzo courtyard tables for board games, kulhad chai, and relaxed weekend laughter.",
      image: "/src/assets/images/courtyard_boardgames_chai_1794643259092.jpg",
      alt: "Four friends playing a colorful strategy board game with kulhad chai cups at a sunlit bougainvillea courtyard table",
      aspect: "col-span-1 md:col-span-2 lg:col-span-2"
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F3F7FF] border-b border-[#0B1230]/10">
      <div className="wrap">
        
        {/* Header with High Symmetry & Brand Typography */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1 rounded-full border border-[#0B1230]/10 shadow-xs mb-3">
            <span className="w-2 h-2 rounded-full bg-[#19C37D]"></span>
            <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#0A2EB8]">
              Real Hangouts Across Delhi NCR
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl text-[#0B1230] leading-tight font-extrabold tracking-tight">
            Everyday moments are better with a{" "}
            <CircledHighlight circleColor="#3DAAFC">hangout</CircledHighlight> partner.
          </h2>
          <p className="mt-4 text-[#0B1230]/75 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            Happy Hangouts connects you with verified local companions for your favorite offline pastimes. Strictly safe, public spaces with zero awkwardness.
          </p>
        </div>

        {/* Expansive Responsive Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {experiences.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group bg-white rounded-3xl overflow-hidden border border-[#0B1230]/10 shadow-sm hover:shadow-xl hover:border-[#3DAAFC]/50 transition-all duration-300 flex flex-col ${item.aspect}`}
            >
              {/* Photo Container */}
              <div className="relative aspect-[16/10] sm:aspect-[16/11] overflow-hidden bg-[#F3F7FF]">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#011C92]/80 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-3.5 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5 text-white">
                  <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs font-semibold text-white/90">
                    <span className="bg-[#3DAAFC] text-[#0B1230] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>

              {/* Editorial Card Body */}
              <div className="p-5 sm:p-7 flex flex-col justify-between flex-1">
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
                    <span>1st 3 Hangouts Free</span>
                  </span>
                  <button
                    type="button"
                    onClick={onExploreVibes}
                    className="inline-flex items-center gap-1.5 bg-[#FFC83D] hover:bg-[#ffbe26] text-[#0B1230] font-bold text-xs py-2.5 px-4 rounded-full shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer min-h-[40px] shrink-0"
                  >
                    <span>View partners</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Symmetrical Bottom Assurance Banner with Cloud / White styling */}
        <div className="mt-14 p-6 sm:p-8 bg-white border border-[#0B1230]/10 rounded-3xl max-w-4xl mx-auto text-center shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="px-4">
              <div className="text-xl font-extrabold text-[#0B1230] mb-1">100% Public Venues</div>
              <p className="text-xs text-[#0B1230]/70 leading-relaxed font-medium">
                CyberHub, Khan Market, cafes, courts & botanical parks only.
              </p>
            </div>
            <div className="px-4 sm:border-x sm:border-[#0B1230]/10">
              <div className="text-xl font-extrabold text-[#0A2EB8] mb-1">3 Hangouts Free</div>
              <p className="text-xs text-[#0B1230]/70 leading-relaxed font-medium">
                Zero booking fees during launch to build mutual 5-star trust.
              </p>
            </div>
            <div className="px-4">
              <div className="text-xl font-extrabold text-[#0B1230] mb-1 flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#19C37D]"></span>
                <span>Verified Partner</span>
              </div>
              <p className="text-xs text-[#0B1230]/70 leading-relaxed font-medium">
                Government ID checks & peer ratings before any hangout.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
