import React from "react";
import { Sparkles, MapPin, Heart, Quote, MessageCircle } from "lucide-react";
import { audio } from "../utils/audio";
import { CharacteristicAvatar } from "./InteractiveAppDemo";

export interface VisualStory {
  id: string;
  avatarId: string;
  title: string;
  emotion: string;
  feelingColor: string;
  quote: string;
  location: string;
  city: string;
  badge: string;
  hostName: string;
  role: string;
  bgGradient: string;
  accentBorder: string;
  slots: number;
}

const VISUAL_STORIES: VisualStory[] = [
  {
    id: "vs1",
    avatarId: "dl-l1",
    title: "Chess & Pour-over Coffee",
    emotion: "✨ Belonging & Quiet Connection",
    feelingColor: "text-amber-300 bg-amber-500/20 border-amber-400/30",
    quote: "“Moved to Delhi last month. Weekends felt empty until I hosted a 2-hour chess & coffee sync. Now it's my favorite ritual.”",
    location: "Saket Social",
    city: "South Delhi",
    badge: "ID VERIFIED ✓",
    hostName: "Rohan M.",
    role: "Product Designer",
    bgGradient: "from-indigo-900 via-slate-900 to-purple-950",
    accentBorder: "border-indigo-500/30 hover:border-amber-400/50",
    slots: 2
  },
  {
    id: "vs2",
    avatarId: "dl-l2",
    title: "Acoustic Jam Session",
    emotion: "🎸 Unwinding Without Pressure",
    feelingColor: "text-sky-300 bg-sky-500/20 border-sky-400/30",
    quote: "“Exhausted after long code sprints. I just wanted to play acoustic chords with someone who gets the vibe—no party noise.”",
    location: "Third Wave Coffee",
    city: "Gurgaon",
    badge: "TECH & CREATIVE",
    hostName: "Priya Sharma",
    role: "AI Developer",
    bgGradient: "from-slate-900 via-sky-950 to-blue-950",
    accentBorder: "border-sky-500/30 hover:border-sky-400/50",
    slots: 1
  },
  {
    id: "vs3",
    avatarId: "dl-l3",
    title: "Lodhi Sunset Photowalk",
    emotion: "📸 Inspiration & Screen-Free Mindfulness",
    feelingColor: "text-rose-300 bg-rose-500/20 border-rose-400/30",
    quote: "“Tired of endless phone scrolling. Met 3 film camera lovers for a golden hour walk. Real conversations happened naturally.”",
    location: "Lodhi Art District",
    city: "Central Delhi",
    badge: "ART & CINEMA",
    hostName: "Kabir Verma",
    role: "Filmmaker",
    bgGradient: "from-purple-950 via-slate-900 to-rose-950",
    accentBorder: "border-purple-500/30 hover:border-rose-400/50",
    slots: 3
  },
  {
    id: "vs4",
    avatarId: "dl-l4",
    title: "Badminton Morning Rally",
    emotion: "🏸 High Energy & Endorphins",
    feelingColor: "text-emerald-300 bg-emerald-500/20 border-emerald-400/30",
    quote: "“Finding court partners in Gurgaon was frustrating. Now we smash rallies every Tuesday morning then grab fresh juice together.”",
    location: "Siri Fort Sports",
    city: "South Delhi",
    badge: "SPORTS HUB",
    hostName: "Ananya Kapoor",
    role: "Architect",
    bgGradient: "from-emerald-950 via-slate-900 to-teal-950",
    accentBorder: "border-emerald-500/30 hover:border-emerald-400/50",
    slots: 2
  }
];

interface Props {
  onSelectStory: (story: VisualStory) => void;
}

export function VisualStoryReel({ onSelectStory }: Props) {
  return (
    <div className="w-full py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
        <div>
          <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            HUMAN EMOTIONS & STORIES
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-900 mt-2">
            Real Feelings. Real Characters.
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl font-light">
            Behind every hangout is a genuine human feeling—looking for a chord partner, a quiet chess match, or a screen-free walk.
          </p>
        </div>
      </div>

      {/* Character Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {VISUAL_STORIES.map((story) => (
          <div
            key={story.id}
            onClick={() => {
              audio.playClick();
              onSelectStory(story);
            }}
            className={`group relative rounded-3xl p-5 cursor-pointer bg-gradient-to-b ${story.bgGradient} border ${story.accentBorder} shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col justify-between overflow-hidden`}
          >
            {/* Top Bar: Emotion Tag + Spot pill */}
            <div className="flex items-center justify-between gap-2 z-10">
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${story.feelingColor}`}>
                {story.emotion}
              </span>
              <span className="bg-emerald-500/90 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                {story.slots} SPOTS
              </span>
            </div>

            {/* Middle: Character Avatar Showcase + Quote */}
            <div className="my-5 space-y-4 z-10">
              {/* Character Avatar Circle */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-white/20 shadow-xl overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-500 bg-slate-950">
                  <CharacteristicAvatar id={story.avatarId} className="w-full h-full" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white font-display leading-tight group-hover:text-amber-300 transition-colors">
                    {story.hostName}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400">{story.role}</p>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-sky-300 mt-1">
                    <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                    <span>{story.location}, {story.city}</span>
                  </div>
                </div>
              </div>

              {/* Relatable Quote */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm relative">
                <Quote className="w-4 h-4 text-white/20 absolute top-2 right-2" />
                <p className="text-xs text-slate-200 font-light leading-relaxed italic pr-4">
                  {story.quote}
                </p>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between z-10 text-xs">
              <span className="text-[11px] font-extrabold text-amber-300 font-display">
                {story.title}
              </span>

              <button className="text-[10px] font-mono font-bold uppercase bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-md group-hover:scale-105">
                <MessageCircle className="w-3 h-3" />
                <span>Join Sync</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
