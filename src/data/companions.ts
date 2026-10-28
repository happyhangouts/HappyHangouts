export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";
export type DayOption = "today" | "tomorrow" | "weekend" | "weekdays" | "any";

export interface CompanionPartner {
  id: string;
  name: string;
  age: number;
  city: "South Delhi" | "Gurgaon" | "Central Delhi" | "Noida" | "North Delhi" | "West Delhi";
  hub: string;
  vibe: string;
  category: "coffee" | "sports" | "tech" | "photo" | "chess" | "music" | "fitness" | "culture";
  bio: string;
  hourlyRate: number; // in INR (e.g. 400 to 950)
  rating: number;
  hangoutsCompleted: number;
  skills: string[];
  interests: string[];
  goals: string[];
  emoji: string;
  color: string;
  languages: string[];
  coordinates: {
    lat: number;
    lng: number;
    areaCode: string;
  };
  availability: {
    days: ("today" | "tomorrow" | "weekend" | "weekdays")[];
    timeSlots: TimeOfDay[];
    slotsText: string;
    preferredWindow: string;
  };
}

export interface SeekerRequest {
  id?: string;
  seekerName?: string;
  interestTags: string[];
  category?: string;
  city: string; // "all" or specific
  day: DayOption;
  timeSlot: TimeOfDay | "any";
  maxBudget: number; // e.g. 500, 750, 1000
  customNote?: string;
}

export interface MatchResult {
  companion: CompanionPartner;
  score: number; // 0 - 100
  matchReasons: string[];
  slotMatch: boolean;
  locationMatch: boolean;
  interestMatchCount: number;
  budgetMatch: boolean;
}

export const COMPANION_PARTNERS: CompanionPartner[] = [
  {
    id: "comp-1",
    name: "Aarav Mehta",
    age: 26,
    city: "Gurgaon",
    hub: "DLF CyberHub & 32nd Avenue",
    vibe: "Startup Pitching & Tech Co-working",
    category: "tech",
    bio: "Ex-fintech builder. Love whiteboarding product architectures, discussing AI agents, and deep co-working sessions over single-origin pour-overs.",
    hourlyRate: 500,
    rating: 4.98,
    hangoutsCompleted: 34,
    skills: ["Startup Brainstorming", "AI & Tech", "Espresso Tasting", "Pitch Decks"],
    interests: ["Tech & Startups", "AI Agents", "Specialty Coffee", "Product Design", "Co-working"],
    goals: ["Build tech network", "Product feedback", "Focused work sprints"],
    emoji: "💡",
    color: "bg-blue-600",
    languages: ["English", "Hindi"],
    coordinates: { lat: 28.4950, lng: 77.0895, areaCode: "GUR-CYBER-01" },
    availability: {
      days: ["today", "tomorrow", "weekdays", "weekend"],
      timeSlots: ["afternoon", "evening", "night"],
      slotsText: "2:00 PM - 10:00 PM",
      preferredWindow: "Evening 5:00 PM - 8:00 PM"
    }
  },
  {
    id: "comp-2",
    name: "Meera Reddy",
    age: 24,
    city: "South Delhi",
    hub: "Siri Fort Sports Complex",
    vibe: "Badminton Tactical Rally & Fitness",
    category: "sports",
    bio: "State-level badminton player & endurance enthusiast. Looking for active rally partners, morning agility drills, and post-match smoothies in leafy parks.",
    hourlyRate: 600,
    rating: 5.0,
    hangoutsCompleted: 48,
    skills: ["Badminton Rallies", "Footwork Drills", "Morning Fitness", "Park Trails"],
    interests: ["Badminton", "Sports & Fitness", "Pickleball", "Cardio Training", "Healthy Cafes"],
    goals: ["High intensity rallies", "Fitness companion", "Tournament prep"],
    emoji: "🏸",
    color: "bg-emerald-600",
    languages: ["English", "Hindi", "Telugu"],
    coordinates: { lat: 28.5539, lng: 77.2185, areaCode: "DEL-SIRIFORT-02" },
    availability: {
      days: ["today", "tomorrow", "weekend"],
      timeSlots: ["morning", "evening"],
      slotsText: "7:00 AM - 11:00 AM & 5:00 PM - 8:00 PM",
      preferredWindow: "Morning 7:30 AM - 9:30 AM"
    }
  },
  {
    id: "comp-3",
    name: "Kabir Sen",
    age: 27,
    city: "Central Delhi",
    hub: "Khan Market (Blue Tokai & Bahrisons)",
    vibe: "Specialty Coffee & Vintage Vinyls",
    category: "coffee",
    bio: "Vinyl collector, literature enthusiast, and pour-over brewer. Passionate about indie cinema, Murakami novels, and discovering quiet cafe reading corners.",
    hourlyRate: 400,
    rating: 4.92,
    hangoutsCompleted: 29,
    skills: ["Specialty Coffee", "Book Discussions", "Vinyl Hunting", "Art Cafe Crawls"],
    interests: ["Specialty Coffee", "Book Reading", "Indie Cinema", "Vinyl Records", "Quiet Cafes"],
    goals: ["Book discussions", "Cafe exploration", "Relaxed conversations"],
    emoji: "☕",
    color: "bg-amber-600",
    languages: ["English", "Hindi", "Bengali"],
    coordinates: { lat: 28.6003, lng: 77.2270, areaCode: "DEL-KHANMKT-03" },
    availability: {
      days: ["today", "tomorrow", "weekend", "weekdays"],
      timeSlots: ["afternoon", "evening", "night"],
      slotsText: "3:00 PM - 9:30 PM",
      preferredWindow: "Evening 4:30 PM - 7:30 PM"
    }
  },
  {
    id: "comp-4",
    name: "Ananya Kapoor",
    age: 23,
    city: "South Delhi",
    hub: "Lodhi Art District & Sunder Nursery",
    vibe: "Street Photowalks & Heritage Trails",
    category: "photo",
    bio: "Documentary photographer & heritage architecture buff. Let's explore Delhi's vibrant street murals, capture candid film portraits, and sip chai at sunset.",
    hourlyRate: 500,
    rating: 4.96,
    hangoutsCompleted: 41,
    skills: ["Camera Framing", "Street Murals", "Historical Walks", "Candid Portraits"],
    interests: ["Street Photography", "35mm Film", "Heritage Walks", "Visual Arts", "Sunset Spots"],
    goals: ["Portfolio photowalk", "Explore hidden heritage", "Creative visual storytelling"],
    emoji: "📷",
    color: "bg-rose-600",
    languages: ["English", "Hindi", "Punjabi"],
    coordinates: { lat: 28.5898, lng: 77.2285, areaCode: "DEL-LODHI-04" },
    availability: {
      days: ["today", "weekend"],
      timeSlots: ["morning", "evening"],
      slotsText: "7:00 AM - 10:30 AM & 4:30 PM - 7:30 PM",
      preferredWindow: "Evening 5:00 PM - 7:00 PM"
    }
  },
  {
    id: "comp-5",
    name: "Rohan Verma",
    age: 28,
    city: "Central Delhi",
    hub: "Connaught Place (CP Oxford Cafe)",
    vibe: "Chess Strategy & Deep Chats",
    category: "chess",
    bio: "FIDE rated 1850 chess competitor. Happy to play blitz, rapid, analyze grandmaster games, or teach tactical openings over steaming masala chai.",
    hourlyRate: 450,
    rating: 4.95,
    hangoutsCompleted: 22,
    skills: ["Blitz Chess", "Opening Strategy", "Board Games", "Philosophy"],
    interests: ["Chess & Strategy", "Board Games", "Game Theory", "History", "Coffee"],
    goals: ["Competitive chess games", "Tactical analysis", "Intellectual chats"],
    emoji: "♟️",
    color: "bg-indigo-600",
    languages: ["English", "Hindi"],
    coordinates: { lat: 28.6315, lng: 77.2167, areaCode: "DEL-CP-05" },
    availability: {
      days: ["tomorrow", "weekend", "weekdays"],
      timeSlots: ["afternoon", "evening", "night"],
      slotsText: "1:00 PM - 9:00 PM",
      preferredWindow: "Afternoon 3:00 PM - 6:00 PM"
    }
  },
  {
    id: "comp-6",
    name: "Priya Sharma",
    age: 25,
    city: "Noida",
    hub: "Sector 104 Cafe Strip",
    vibe: "Acoustic Guitar Jam & Indie Vocals",
    category: "music",
    bio: "Singer-songwriter playing acoustic melodies. Let's do a duet jam session, explore live indie gigs, or grab iced matcha and talk music production.",
    hourlyRate: 500,
    rating: 5.0,
    hangoutsCompleted: 38,
    skills: ["Acoustic Guitar", "Vocal Harmonies", "Indie Music Gigs", "Songwriting"],
    interests: ["Live Music & Guitar", "Indie Music", "Songwriting", "Acoustic Jams", "Matcha Cafes"],
    goals: ["Acoustic jamming", "Songwriting co-lab", "Live gig companion"],
    emoji: "🎸",
    color: "bg-purple-600",
    languages: ["English", "Hindi"],
    coordinates: { lat: 28.5355, lng: 77.3620, areaCode: "NOI-SEC104-06" },
    availability: {
      days: ["today", "tomorrow", "weekend"],
      timeSlots: ["evening", "night"],
      slotsText: "6:00 PM - 10:30 PM",
      preferredWindow: "Night 7:30 PM - 9:30 PM"
    }
  },
  {
    id: "comp-7",
    name: "Devendra 'Dev' Gill",
    age: 29,
    city: "South Delhi",
    hub: "Hauz Khas Social & Deer Park",
    vibe: "Pickleball, Running & Sunset Lakes",
    category: "sports",
    bio: "Dink master & trail runner. Addicted to fast-paced pickleball doubles, 10k morning runs around Deer Park lake, and protein shakes afterwards.",
    hourlyRate: 550,
    rating: 4.97,
    hangoutsCompleted: 31,
    skills: ["Pickleball Doubles", "Trail Running", "Endurance Pacing", "Sports Chats"],
    interests: ["Pickleball", "Sports & Fitness", "Running", "Outdoor Trails", "Healthy Eating"],
    goals: ["Pickleball match", "Morning run buddy", "Active outdoor weekend"],
    emoji: "🏓",
    color: "bg-teal-600",
    languages: ["English", "Hindi", "Punjabi"],
    coordinates: { lat: 28.5530, lng: 77.1945, areaCode: "DEL-HKV-07" },
    availability: {
      days: ["today", "tomorrow", "weekend"],
      timeSlots: ["morning", "evening"],
      slotsText: "6:30 AM - 10:30 AM & 5:00 PM - 8:00 PM",
      preferredWindow: "Morning 7:00 AM - 9:00 AM"
    }
  },
  {
    id: "comp-8",
    name: "Ishita Bose",
    age: 26,
    city: "Central Delhi",
    hub: "National Gallery of Modern Art & India Habitat",
    vibe: "Art Exhibitions, Indie Books & Filter Coffee",
    category: "culture",
    bio: "Curator and design researcher. I love guiding people through modern art galleries, uncovering unseen Delhi archives, and exchanging reading lists.",
    hourlyRate: 450,
    rating: 4.94,
    hangoutsCompleted: 26,
    skills: ["Art Appreciation", "Museum Walks", "Creative Writing", "Cultural History"],
    interests: ["Art Exhibitions", "Book Reading", "Heritage Walks", "Filter Coffee", "Indie Cinema"],
    goals: ["Explore art galleries", "Deep cultural conversation", "Exhibition companion"],
    emoji: "🎨",
    color: "bg-fuchsia-600",
    languages: ["English", "Hindi", "Bengali"],
    coordinates: { lat: 28.6083, lng: 77.2345, areaCode: "DEL-NGMA-08" },
    availability: {
      days: ["today", "tomorrow", "weekend", "weekdays"],
      timeSlots: ["afternoon", "evening"],
      slotsText: "1:30 PM - 7:30 PM",
      preferredWindow: "Afternoon 2:00 PM - 5:00 PM"
    }
  },
  {
    id: "comp-9",
    name: "Vikram Malhotra",
    age: 31,
    city: "Gurgaon",
    hub: "One Horizon Center & Golf Course Road",
    vibe: "Venture Capital, Fintech & Espresso Talks",
    category: "tech",
    bio: "Early-stage angel investor and mentor. Happy to meet ambitious founders, dissect market moats, critique pitch decks, or exchange notes on tech trends.",
    hourlyRate: 800,
    rating: 5.0,
    hangoutsCompleted: 44,
    skills: ["Angel Investing", "Unit Economics", "Pitch Practice", "Fintech Scaling"],
    interests: ["Tech & Startups", "AI Agents", "Angel Investing", "Specialty Coffee", "Co-working"],
    goals: ["Founder mentorship", "Pitch rehearsal", "High-signal networking"],
    emoji: "🚀",
    color: "bg-sky-600",
    languages: ["English", "Hindi"],
    coordinates: { lat: 28.4735, lng: 77.0980, areaCode: "GUR-HORIZON-09" },
    availability: {
      days: ["today", "weekdays", "tomorrow"],
      timeSlots: ["morning", "afternoon", "evening"],
      slotsText: "9:00 AM - 6:30 PM",
      preferredWindow: "Morning 10:00 AM - 12:00 PM"
    }
  },
  {
    id: "comp-10",
    name: "Tanya Chawla",
    age: 24,
    city: "South Delhi",
    hub: "Saket Select Citywalk & Dhan Mill Compound",
    vibe: "Specialty Bakes, Cold Brews & Pet Cafes",
    category: "coffee",
    bio: "Pastry chef and sourdough baker. Let's taste Delhi's crispiest croissants, visit pet-friendly cafes, and talk culinary adventures over iced cold brews.",
    hourlyRate: 400,
    rating: 4.91,
    hangoutsCompleted: 35,
    skills: ["Artisan Pastries", "Cafe Reviewing", "Pet Socializing", "Sourdough Secrets"],
    interests: ["Specialty Coffee", "Foodie Walk", "Baking", "Pet Friendly Cafes", "Quiet Cafes"],
    goals: ["Cafe bakery hop", "Casual foodie hangout", "Puppy cafe visit"],
    emoji: "🥐",
    color: "bg-orange-500",
    languages: ["English", "Hindi"],
    coordinates: { lat: 28.5284, lng: 77.2190, areaCode: "DEL-SAKET-10" },
    availability: {
      days: ["today", "tomorrow", "weekend"],
      timeSlots: ["morning", "afternoon", "evening"],
      slotsText: "10:00 AM - 7:00 PM",
      preferredWindow: "Afternoon 12:30 PM - 3:30 PM"
    }
  },
  {
    id: "comp-11",
    name: "Karan Johar Negi",
    age: 27,
    city: "Noida",
    hub: "DLF Mall of India & Sector 18",
    vibe: "Table Tennis Smash, Bowling & Arcade Gaming",
    category: "sports",
    bio: "Semi-pro table tennis player & arcade gaming aficionado. Let's play competitive ping pong sets, hit the bowling alleys, or have a fun game night.",
    hourlyRate: 450,
    rating: 4.89,
    hangoutsCompleted: 27,
    skills: ["Table Tennis Spin", "Bowling Technique", "Arcade Games", "Strategy Games"],
    interests: ["Sports & Fitness", "Table Tennis", "Board Games", "Bowling", "Arcade"],
    goals: ["Table tennis challenge", "Bowling night", "Energetic indoor games"],
    emoji: "🏓",
    color: "bg-emerald-700",
    languages: ["English", "Hindi"],
    coordinates: { lat: 28.5675, lng: 77.3210, areaCode: "NOI-SEC18-11" },
    availability: {
      days: ["today", "tomorrow", "weekend"],
      timeSlots: ["evening", "night"],
      slotsText: "5:00 PM - 10:30 PM",
      preferredWindow: "Evening 6:00 PM - 8:30 PM"
    }
  },
  {
    id: "comp-12",
    name: "Zara Qureshi",
    age: 25,
    city: "Central Delhi",
    hub: "Old Delhi Jama Masjid & Chandni Chowk Food Walk",
    vibe: "Heritage Food Trails & Spiced Chai Culture",
    category: "culture",
    bio: "Culinary heritage chronicler born and raised in Walled Delhi. Let me show you 100-year-old jalebi shops, secret rooftop viewpoints, and authentic kebabs.",
    hourlyRate: 600,
    rating: 5.0,
    hangoutsCompleted: 53,
    skills: ["Culinary History", "Old City Navigation", "Street Food Safety", "Heritage Stories"],
    interests: ["Heritage Walks", "Foodie Walk", "Street Photography", "Cultural History", "Chai Walks"],
    goals: ["Authentic street food crawl", "Old Delhi photowalk", "Historical deep dive"],
    emoji: "🍲",
    color: "bg-red-600",
    languages: ["English", "Hindi", "Urdu"],
    coordinates: { lat: 28.6507, lng: 77.2334, areaCode: "DEL-OLD-12" },
    availability: {
      days: ["tomorrow", "weekend"],
      timeSlots: ["morning", "evening", "night"],
      slotsText: "8:00 AM - 12:00 PM & 6:00 PM - 10:00 PM",
      preferredWindow: "Night 7:00 PM - 9:30 PM"
    }
  },
  {
    id: "comp-13",
    name: "Samarth Nair",
    age: 28,
    city: "South Delhi",
    hub: "Green Park & Hauz Khas Village",
    vibe: "Indie Board Games, Catan & Strategy Nights",
    category: "chess",
    bio: "Board game master hosting Settlers of Catan, Wingspan, and Codenames. Ideal for people new to Delhi looking for fun, brainy, laugh-filled table sessions.",
    hourlyRate: 400,
    rating: 4.93,
    hangoutsCompleted: 39,
    skills: ["Board Game Teaching", "Catan Strategy", "Social Deduction", "Group Icebreaking"],
    interests: ["Board Games", "Chess & Strategy", "Game Theory", "Specialty Coffee", "Trivia"],
    goals: ["Board game session", "Strategic board games", "Fun friendly match"],
    emoji: "🎲",
    color: "bg-yellow-600",
    languages: ["English", "Hindi", "Malayalam"],
    coordinates: { lat: 28.5585, lng: 77.2030, areaCode: "DEL-GP-13" },
    availability: {
      days: ["today", "tomorrow", "weekend"],
      timeSlots: ["evening", "night"],
      slotsText: "5:00 PM - 11:00 PM",
      preferredWindow: "Night 7:00 PM - 10:00 PM"
    }
  },
  {
    id: "comp-14",
    name: "Rhea Singhania",
    age: 27,
    city: "Gurgaon",
    hub: "Cross Point Mall & Galleria Market",
    vibe: "Podcast Co-hosting, Mindset & Productivity",
    category: "tech",
    bio: "Host of a top business podcast & certified productivity coach. Meet for structured accountability sprints, book breakdowns, and brainstorming content ideas.",
    hourlyRate: 650,
    rating: 4.97,
    hangoutsCompleted: 32,
    skills: ["Podcast Scripting", "Notion Systems", "Content Strategy", "Goal Auditing"],
    interests: ["Tech & Startups", "Book Reading", "Product Design", "Specialty Coffee", "Content Creation"],
    goals: ["Weekly goal review", "Podcast brainstorm", "Deep focus session"],
    emoji: "🎙️",
    color: "bg-violet-600",
    languages: ["English", "Hindi"],
    coordinates: { lat: 28.4680, lng: 77.0860, areaCode: "GUR-GALLERIA-14" },
    availability: {
      days: ["today", "tomorrow", "weekend", "weekdays"],
      timeSlots: ["morning", "afternoon"],
      slotsText: "8:30 AM - 4:00 PM",
      preferredWindow: "Morning 9:00 AM - 11:30 AM"
    }
  },
  {
    id: "comp-15",
    name: "Nikhil Joshi",
    age: 25,
    city: "North Delhi",
    hub: "Majnu Ka Tilla Tibetan Colony & Delhi University",
    vibe: "Tibetan Cafes, Laphin Tastings & Campus Nostalgia",
    category: "culture",
    bio: "North Campus alumnus & cultural explorer. Let's walk through prayer-wheel alleys, try spicy tingmo & laphin, sip butter tea, and talk student memories.",
    hourlyRate: 350,
    rating: 4.95,
    hangoutsCompleted: 46,
    skills: ["Campus Landmarks", "Tibetan Cuisine Guide", "Budget Travel", "Bilingual Storytelling"],
    interests: ["Heritage Walks", "Foodie Walk", "Cultural History", "Indie Cinema", "Quiet Cafes"],
    goals: ["MKT food exploration", "Tibetan colony photowalk", "Relaxed tea conversations"],
    emoji: "🥟",
    color: "bg-teal-700",
    languages: ["English", "Hindi"],
    coordinates: { lat: 28.7010, lng: 77.2280, areaCode: "DEL-MKT-15" },
    availability: {
      days: ["today", "tomorrow", "weekend"],
      timeSlots: ["afternoon", "evening"],
      slotsText: "12:00 PM - 7:30 PM",
      preferredWindow: "Afternoon 1:00 PM - 4:00 PM"
    }
  },
  {
    id: "comp-16",
    name: "Aditi Mathur",
    age: 26,
    city: "West Delhi",
    hub: "Pacific Mall & Rajouri Garden Cafe Walk",
    vibe: "High-Energy Badminton, HIIT & Cold Pressed Juices",
    category: "sports",
    bio: "Certified fitness trainer and badminton lover. Whether you want a fiery rally to break a sweat or an outdoor functional strength circuit, I'm your hype partner.",
    hourlyRate: 500,
    rating: 4.99,
    hangoutsCompleted: 40,
    skills: ["Badminton Smashes", "HIIT Circuits", "Strength Form Check", "Positive Motivation"],
    interests: ["Badminton", "Sports & Fitness", "Cardio Training", "Running", "Healthy Cafes"],
    goals: ["Break a sweat", "Badminton partner", "Workout motivation"],
    emoji: "⚡",
    color: "bg-emerald-600",
    languages: ["English", "Hindi", "Punjabi"],
    coordinates: { lat: 28.6435, lng: 77.1120, areaCode: "DEL-WEST-16" },
    availability: {
      days: ["today", "tomorrow", "weekend", "weekdays"],
      timeSlots: ["morning", "evening"],
      slotsText: "6:30 AM - 10:30 AM & 4:30 PM - 7:30 PM",
      preferredWindow: "Morning 7:00 AM - 9:00 AM"
    }
  }
];

// Preset Seeker Requests for instant one-click demonstration
export const PRESET_SEEKER_REQUESTS: {
  id: string;
  title: string;
  seekerName: string;
  interestTags: string[];
  city: string;
  day: DayOption;
  timeSlot: TimeOfDay;
  maxBudget: number;
  highlight: string;
}[] = [
  {
    id: "req-1",
    title: "Evening Coffee & Book Chat in Khan Market",
    seekerName: "Dhruv",
    interestTags: ["Specialty Coffee", "Book Reading"],
    city: "Central Delhi",
    day: "today",
    timeSlot: "evening",
    maxBudget: 500,
    highlight: "Looking for an engaging companion to chat about literature and brew pour-overs at Blue Tokai."
  },
  {
    id: "req-2",
    title: "Saturday Morning Badminton Rally at Siri Fort",
    seekerName: "Sanya",
    interestTags: ["Badminton", "Sports & Fitness"],
    city: "South Delhi",
    day: "weekend",
    timeSlot: "morning",
    maxBudget: 650,
    highlight: "Need a fast-paced rally partner on wooden courts who can return quick drop shots."
  },
  {
    id: "req-3",
    title: "Tech Co-working & AI Brainstorm at CyberHub",
    seekerName: "Kunal",
    interestTags: ["Tech & Startups", "AI Agents"],
    city: "Gurgaon",
    day: "tomorrow",
    timeSlot: "afternoon",
    maxBudget: 800,
    highlight: "Working on an AI product MVP and want a high-signal founder companion for feedback & sprints."
  },
  {
    id: "req-4",
    title: "Sunset Heritage Photowalk & Sunder Nursery",
    seekerName: "Neha",
    interestTags: ["Street Photography", "Heritage Walks"],
    city: "South Delhi",
    day: "today",
    timeSlot: "evening",
    maxBudget: 550,
    highlight: "Carrying 35mm film camera. Want a creative companion to walk Lodhi murals and lotus ponds."
  },
  {
    id: "req-5",
    title: "Acoustic Guitar Jam & Indie Vibes in Noida",
    seekerName: "Ayush",
    interestTags: ["Live Music & Guitar", "Indie Music"],
    city: "Noida",
    day: "today",
    timeSlot: "night",
    maxBudget: 600,
    highlight: "Looking for an acoustic partner to jam chords and discover quiet rooftop cafes in Sec 104."
  },
  {
    id: "req-6",
    title: "Blitz Chess & Coffee Challenge in CP",
    seekerName: "Manish",
    interestTags: ["Chess & Strategy", "Board Games"],
    city: "Central Delhi",
    day: "tomorrow",
    timeSlot: "afternoon",
    maxBudget: 500,
    highlight: "Looking for 5+3 or 10-minute chess games at Oxford Cafe with tactical post-mortem."
  }
];

/**
 * Intelligent Companion Matchmaking Algorithm
 * Calculates compatibility between an incoming Seeker Request and all registered Hangout Partners.
 * Returns sorted list with top matches (5 to 10 profiles).
 */
export function calculateMatches(
  request: SeekerRequest,
  partners: CompanionPartner[] = COMPANION_PARTNERS,
  limit: number = 8
): MatchResult[] {
  const results: MatchResult[] = partners.map((companion) => {
    let score = 40; // Base score for ID-verified verified partner
    const matchReasons: string[] = [];

    // 1. Time Slot Match (Weight: 25%)
    let slotMatch = false;
    if (request.timeSlot === "any") {
      score += 20;
      slotMatch = true;
      matchReasons.push(`⏰ Available for flexible time slots`);
    } else if (companion.availability.timeSlots.includes(request.timeSlot)) {
      score += 25;
      slotMatch = true;
      const formattedSlot = 
        request.timeSlot === "morning" ? "Morning (8 AM - 12 PM)" :
        request.timeSlot === "afternoon" ? "Afternoon (12 PM - 4 PM)" :
        request.timeSlot === "evening" ? "Evening (4 PM - 8 PM)" : "Night (8 PM - 11 PM)";
      matchReasons.push(`⏰ Confirmed available in ${formattedSlot}`);
    } else {
      score -= 15;
    }

    // 2. Day Match (Weight: 10%)
    if (request.day === "any") {
      score += 8;
    } else if (companion.availability.days.includes(request.day as any)) {
      score += 10;
      matchReasons.push(`📅 Free on ${request.day.toUpperCase()}`);
    }

    // 3. Location / Zone Match (Weight: 25%)
    let locationMatch = false;
    if (request.city === "all" || !request.city) {
      score += 15;
      locationMatch = true;
      matchReasons.push(`📍 Located at ${companion.hub}`);
    } else if (companion.city.toLowerCase() === request.city.toLowerCase()) {
      score += 25;
      locationMatch = true;
      matchReasons.push(`📍 Near your location: ${companion.hub} (${companion.city})`);
    } else {
      score -= 10;
    }

    // 4. Interest & Hobby & Goal Overlap (Weight: 30%)
    const companionTags = [
      ...companion.interests.map(t => t.toLowerCase()),
      ...companion.skills.map(s => s.toLowerCase()),
      ...companion.goals.map(g => g.toLowerCase()),
      companion.category.toLowerCase()
    ];

    let interestMatchCount = 0;
    const matchedInterestNames: string[] = [];

    request.interestTags.forEach((reqTag) => {
      const lowerReq = reqTag.toLowerCase();
      const hasMatch = companionTags.some(tag => 
        tag.includes(lowerReq) || lowerReq.includes(tag) ||
        (lowerReq.includes("badminton") && tag.includes("sports")) ||
        (lowerReq.includes("coffee") && tag.includes("cafe")) ||
        (lowerReq.includes("tech") && tag.includes("startup"))
      );

      if (hasMatch) {
        interestMatchCount++;
        matchedInterestNames.push(reqTag);
      }
    });

    if (interestMatchCount > 0) {
      const interestBonus = Math.min(30, interestMatchCount * 15);
      score += interestBonus;
      matchReasons.push(`🎯 Shared passion: ${matchedInterestNames.join(", ")}`);
    } else {
      score -= 5;
    }

    // 5. Budget Compatibility (Weight: 10%)
    let budgetMatch = false;
    if (request.maxBudget >= companion.hourlyRate) {
      score += 10;
      budgetMatch = true;
      matchReasons.push(`💰 ₹${companion.hourlyRate}/hr (Within your ₹${request.maxBudget} budget)`);
    } else {
      const diff = companion.hourlyRate - request.maxBudget;
      if (diff <= 100) {
        score -= 5;
        matchReasons.push(`💰 ₹${companion.hourlyRate}/hr (Slightly above ₹${request.maxBudget})`);
      } else {
        score -= 20;
      }
    }

    // Clamp score between 35 and 99
    const finalScore = Math.min(99, Math.max(38, Math.round(score)));

    return {
      companion,
      score: finalScore,
      matchReasons: matchReasons.slice(0, 4),
      slotMatch,
      locationMatch,
      interestMatchCount,
      budgetMatch
    };
  });

  // Sort descending by match score
  results.sort((a, b) => b.score - a.score);

  // Return requested top 5 - 10 profiles
  return results.slice(0, Math.max(5, Math.min(10, limit)));
}
