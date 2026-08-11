/**
 * Shared utility for mapping subcategories (interests/hobbies & goals) 
 * to certified, popular venues and spots in Delhi, Gurgaon, and Noida.
 */

export const getSubcategorySpots = (subcategory: string): string[] => {
  switch (subcategory) {
    case "Learn Guitar":
      return ["Delhi Guitar Academy, Saket", "Friction Cafe Jam Stage, Noida", "The Piano Man Acoustic Room, Gurgaon"];
    case "Learn Photography":
      return ["Sunder Nursery Gardens, Delhi", "Okhla Bird Sanctuary, Noida", "Aravalli Biodiversity Park, Gurgaon"];
    case "Learn Chess":
      return ["The Reader's Cafe, Noida Sector 18", "Kunzum Travel Cafe, Hauz Khas Delhi", "WeWork Lounge, CyberHub Gurgaon"];
    case "Learn Cooking":
      return ["DDA Community Culinary Center, Saket", "Culinary Craft studio, Gurgaon", "Noida Cooking Studio, Sector 50"];
    case "Language Exchange":
      return ["Alliance Française, Lodhi Road Delhi", "Instituto Cervantes, Connaught Place", "Blue Tokai, Sector 15 Noida"];
    case "Public Speaking Practice":
      return ["Habitat World, Lodhi Road Delhi", "Innov8 Conference Hall, CP Delhi", "The Forest Cowork Seminar Area, Noida"];
    case "Startup Discussions":
      return ["WeWork Club, CyberHub Gurgaon", "Innov8 Lounge, Connaught Place Delhi", "The Forest Cowork, Noida Sector 62"];
    case "Find a Co-founder":
      return ["Co-founder's Desk, WeWork CyberHub", "Innov8 Lounge, CP Delhi", "The Forest Cowork, Noida Sector 62"];
    case "Business Networking":
      return ["The Executive Club, CyberHub Gurgaon", "The Lodhi Meeting Lawns, Delhi", "Innov8 Lounge, CP Delhi"];
    case "Marketing Brainstorming":
      return ["Savor Cafe, Khan Market Delhi", "Third Wave Coffee, Sector 54 Gurgaon", "Blue Tokai, Sector 15 Noida"];
    case "AI Discussions":
      return ["Innov8 Tech Lounge, CP Delhi", "WeWork Labs, CyberHub Gurgaon", "The Forest Cowork, Noida Sector 62"];
    case "Resume Review":
      return ["Third Wave Coffee, Sector 54 Gurgaon", "Blue Tokai, Sector 15 Noida", "The Reader's Cafe, Noida Sector 18"];
    case "Mock Interviews":
      return ["WeWork Meeting Room, Gurgaon", "The Forest Cowork Private Cabin, Noida", "Innov8 CP Private Pods, Delhi"];
    case "Coffee Conversations":
      return ["Blue Tokai, Sector 15 Noida", "Savor Cafe, Khan Market Delhi", "Third Wave Coffee, Sector 54 Gurgaon"];
    case "Deep Conversations":
      return ["Deer Park Lakefront, Hauz Khas Delhi", "Leopard Trail Rustic Tapri, Gurgaon", "Sunder Nursery Lotus Pond, Delhi"];
    case "Walk & Talk":
      return ["Sunder Nursery Lakefront, Delhi", "Okhla Bird Sanctuary trails, Noida", "Leopard Trail Scenic Route, Gurgaon"];
    case "Book Discussions":
      return ["Oxford Bookstore, Connaught Place Delhi", "The Reader's Cafe, Noida Sector 18", "The Book Cover Cafe, Noida Sector 104"];
    case "Meet New People":
      return ["Blue Tokai, Sector 15 Noida", "Savor Cafe, Khan Market Delhi", "Third Wave Coffee, Sector 54 Gurgaon"];
    case "Singing":
      return ["The Piano Man Jazz Club, Gurgaon", "Friction Cafe Open Mic stage, Noida", "Habitat World, Lodhi Road Delhi"];
    case "Music Jam":
      return ["The Piano Man Jazz Club, Gurgaon", "Delhi Guitar Academy, Saket", "Friction Cafe Open Mic stage, Noida"];
    case "Dance Practice":
      return ["Delhi Dance Academy, Lajpat Nagar", "Cult Fit Studio Space, Gurgaon", "Noida Stadium Dance Arena"];
    case "Poetry":
      return ["Habitat World Auditorium, Delhi", "Kunzum Travel Cafe, CP Delhi", "Friction Cafe Open Mic, Noida"];
    case "Sketch Together":
      return ["National Gallery of Modern Art, Delhi", "Lodhi Art District, Delhi", "Sunder Nursery Gardens, Delhi"];
    case "Open Mic":
      return ["Friction Cafe Open Mic, Noida", "The Piano Man Open Stage, Gurgaon", "Habitat World Open Theater, Delhi"];
    case "Badminton":
      return ["Siri Fort Sports Complex, Delhi", "Cult Fit Arena, Gurgaon Sector 45", "Noida Stadium Courts, Sector 21A Noida"];
    case "Cricket":
      return ["Noida Stadium Cricket Ground", "Siri Fort Cricket Nets, Delhi", "Decathlon Playcourts, Gurgaon Sector 45"];
    case "Hockey":
      return ["Major Dhyan Chand National Stadium, Delhi", "Noida Stadium Turf Ground", "Gurgaon Sports Arena Sector 56"];
    case "Football":
      return ["Decathlon Playcourts, Noida Sector 38A", "Siri Fort Turf Field, Delhi", "Cult Fit Football Turf, Gurgaon"];
    case "Gym Buddy":
      return ["Gold's Gym, Sector 15 Noida", "Cult Fit Gym, CyberHub Gurgaon", "Anytime Fitness, Connaught Place Delhi"];
    case "Running Partner":
      return ["Aravalli Biodiversity Park, Gurgaon", "Sunder Nursery Trails, Delhi", "Okhla Bird Sanctuary trails, Noida"];
    case "Cycling":
      return ["Leopard Trail Scenic Route, Gurgaon", "Noida Expressway Cycling Track", "Sunder Nursery Outer Loop, Delhi"];
    case "Food Trails":
      return ["Connaught Place Backlanes, Delhi", "CyberHub Food Trails, Gurgaon", "Sector 18 Food Walk, Noida"];
    case "Road Trips":
      return ["Noida-Greater Noida Expressway", "Gurgaon-Faridabad Scenic Road", "Ridge Road, New Delhi"];
    case "Museums":
      return ["National Museum, Delhi", "National Gallery of Modern Art, Delhi", "Kiran Nadar Museum of Art, Noida"];
    case "Photography Walks":
      return ["Sunder Nursery Heritage Walk, Delhi", "Humayun's Tomb, Delhi", "Okhla Bird Sanctuary trails, Noida"];
    case "Sunrise & Sunset":
      return ["Sunder Nursery Lakefront, Delhi", "Okhla Bird Sanctuary trails, Noida", "Leopard Trail Scenic Route, Gurgaon"];
    case "Hidden Cafés":
      return ["The Book Cover Café, Sector 104 Noida", "Savor Cafe, Khan Market Delhi", "Hamoni Golf Cafe, Gurgaon"];
    case "Need someone to attend a wedding with":
      return ["The Lodhi, New Delhi", "Taj Mahal Hotel, Delhi", "The Leela, Gurgaon"];
    case "Looking for a travel companion":
      return ["Oxford Bookstore, CP Delhi", "Kunzum Travel Cafe, CP Delhi", "The Reader's Cafe, Noida Sector 18"];
    case "Festival celebrations":
      return ["CyberHub Central Arena, Gurgaon", "The Lodhi, New Delhi", "Noida Stadium Fest Grounds"];
    case "Birthday celebrations":
      return ["The Piano Man Jazz Club, Gurgaon", "Savor Cafe, Khan Market Delhi", "Logix Mall Event Lounge, Noida"];
    case "Concert buddy":
      return ["CyberHub Central Arena, Gurgaon", "Habitat World, Lodhi Road Delhi", "DLF Avenue Open Stage, Delhi"];
    case "Garba partner":
      return ["Noida Stadium Fest Grounds", "Siri Fort Auditorium Grounds, Delhi", "Kingdom of Dreams Arena, Gurgaon"];
    case "New Year's Eve plans":
      return ["CyberHub Central Arena, Gurgaon", "The Lodhi, New Delhi", "Logix Mall Event Lounge, Noida"];
    default:
      return ["Savor Cafe, Khan Market Delhi", "The Reader's Cafe, Noida", "WeWork Club, CyberHub Gurgaon"];
  }
};

/**
 * Filter spots by city name
 */
export const filterSpotsByCity = (spots: string[], city: "Delhi" | "Gurgaon" | "Noida"): string[] => {
  const filtered = spots.filter(spot => spot.toLowerCase().includes(city.toLowerCase()));
  if (filtered.length === 0) {
    // Fallback if none matches city explicitly
    return [spots[0] || "Cozy Cafe Spot"];
  }
  return filtered;
};
