import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, X, Send, Heart, Shield, Sparkles, Coffee, ArrowRight, 
  HelpCircle, Smartphone, Star, MapPin, CheckCircle, Download,
  MessageCircle, Mail, Phone, ExternalLink, FileSpreadsheet
} from "lucide-react";
import { audio } from "../utils/audio";
import { CharacteristicAvatar } from "./InteractiveAppDemo";
import { submitToGoogleSheets, generateWhatsAppLeadUrl } from "../lib/googleSheets";
import GoogleScriptGuideModal from "./GoogleScriptGuideModal";

interface Message {
  id: string;
  sender: "user" | "muba";
  text: string;
  timestamp: Date;
}

export const COMPANIONS = [
  { 
    id: "dl-l1", 
    name: "Rohan Malhotra", 
    age: 26, 
    badge: "Chess Master", 
    bio: "Can talk endlessly about chess tactics, strategies, and deep mental models. Let's play a friendly game!", 
    city: "Delhi", 
    spots: ["Sunder Nursery Library", "Delhi Guitar Academy, Saket", "Habitat World Auditorium"], 
    vibe: "Learn" 
  },
  { 
    id: "dl-c1", 
    name: "Aditi Sharma", 
    age: 24, 
    badge: "Vinyl Collector", 
    bio: "Obsessed with cozy coffee conversations and magic realism books. Let's trace stories together.", 
    city: "Delhi", 
    spots: ["Blue Tokai, Khan Market", "Third Wave Coffee, CP", "Savor Cafe, Lodhi Colony"], 
    vibe: "Connections" 
  },
  { 
    id: "dl-n1", 
    name: "Meera Reddy", 
    age: 25, 
    badge: "Sunder Lover", 
    bio: "Sunder Nursery's lake trails are my second home. Let's spot parakeets and explore local street food.", 
    city: "Delhi", 
    spots: ["Sunder Nursery Lakefront", "Lodi Garden Rose Corridor", "Chandni Chowk Food Trails"], 
    vibe: "Explore" 
  },
  { 
    id: "nd-c1", 
    name: "Ananya Kapoor", 
    age: 23, 
    badge: "Creative Mind", 
    bio: "Let's sit in a hidden rustic cafe and enjoy deep, unhurried conversations about cinema & life.", 
    city: "Noida", 
    spots: ["The Reader's Cafe, Sector 18", "The Book Cover, Sector 104", "Third Wave Coffee, Sector 62"], 
    vibe: "Connections" 
  },
  { 
    id: "nd-s1", 
    name: "Karan Prasad", 
    age: 25, 
    badge: "Smash Champion", 
    bio: "Friendly badminton and running partner. Ready for cooperative rallies and high-energy runs!", 
    city: "Noida", 
    spots: ["Sector 62 Sports Arena", "Noida Stadium Courts", "Cult Fit Play Arena"], 
    vibe: "Active" 
  },
  { 
    id: "nd-n1", 
    name: "Vikram Sen", 
    age: 27, 
    badge: "Road Tripper", 
    bio: "Okhla Bird Sanctuary is amazing during sunsets. Let's explore scenic lakes and hidden food joints.", 
    city: "Noida", 
    spots: ["Okhla Bird Sanctuary", "Noida Botanical Garden", "Sector 50 Hidden Cafes"], 
    vibe: "Explore" 
  },
  { 
    id: "gr-t2", 
    name: "Aaryan Gupta", 
    age: 27, 
    badge: "Startup Nomad", 
    bio: "Pitching venture concepts on paper napkins. Let's secure a desk at CyberHub and network.", 
    city: "Gurgaon", 
    spots: ["WeWork Club, CyberHub", "Innov8 Lounge, Sector 54", "The Forest Cowork, Sector 45"], 
    vibe: "Career" 
  },
  { 
    id: "gr-t1", 
    name: "Shruti Aggarwal", 
    age: 24, 
    badge: "Poetry & Jam", 
    bio: "Acoustic music lover and sketch companion. Let's meet at a cozy open-mic cafe and express ourselves.", 
    city: "Gurgaon", 
    spots: ["The Piano Man Jazz Club", "Friction Cafe Open Stage", "Sector 29 Acoustic Lounge"], 
    vibe: "Express" 
  },
  { 
    id: "gr-d1", 
    name: "Muba Mehta", 
    age: 26, 
    badge: "Festival Buddy", 
    bio: "Concert goer, Garba fan, and travel companion. Let's count down New Year's Eve together!", 
    city: "Gurgaon", 
    spots: ["CyberHub Central Arena", "The Lodhi event lawns", "Ambience Mall Concert stage"], 
    vibe: "Celebrate" 
  }
];

const getMentionedCompanions = (text: string) => {
  const lowerText = text.toLowerCase();
  return COMPANIONS.filter(comp => {
    const fullName = comp.name.toLowerCase();
    const firstName = comp.name.split(" ")[0].toLowerCase();
    
    // Match full name
    if (lowerText.includes(fullName)) return true;
    
    // Match first name, except for "muba" to prevent collision with chatbot name
    if (firstName !== "muba" && lowerText.includes(firstName)) return true;
    
    return false;
  });
};


const renderFormattedText = (text: string) => {
  const lines = text.split("\n");
  
  return (
    <div className="space-y-1">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
        const cleanLine = isBullet ? trimmed.replace(/^[-*]\s+/, "") : line;

        // Split by ** for bold elements
        const parts = cleanLine.split("**");
        const formattedContent = parts.map((part, partIdx) => {
          if (partIdx % 2 !== 0) {
            return (
              <strong key={partIdx} className="text-blue-400 font-bold">
                {part}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 ml-2 my-0.5">
              <span className="text-blue-400 mt-1 select-none text-[10px]">•</span>
              <span className="text-slate-100 flex-1">{formattedContent}</span>
            </div>
          );
        }

        return (
          <p key={lineIdx} className="text-slate-200">
            {formattedContent}
          </p>
        );
      })}
    </div>
  );
};

export default function MubaInteractiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "muba",
      text: "Hey! I'm **Muba**. ☕️ I am the experience coordinator for **Happy Hangouts**. Ask me anything about our **features**, **safety**, or **hangout spots**!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedComp, setSelectedComp] = useState<typeof COMPANIONS[0] | null>(null);
  const [downloadTriggered, setDownloadTriggered] = useState(false);
  
  // Contact Us & WhatsApp states inside Chatbot
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [contactData, setContactData] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages list changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Handle Contact Submit inside Chatbot
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email) return;

    setIsSubmittingContact(true);
    try {
      await submitToGoogleSheets({
        name: contactData.name.trim(),
        email: contactData.email.trim(),
        phone: contactData.phone.trim(),
        city: "Delhi NCR",
        interests: contactData.message.trim() || "Contact Inquiry via Chatbot",
        join_as: "contact",
        form_type: "Contact Us"
      });

      // Automatically launch WhatsApp with prefilled notification to Gaurav (+91 8800843189)
      const waNotifyUrl = generateWhatsAppLeadUrl({
        name: contactData.name.trim(),
        email: contactData.email.trim(),
        phone: contactData.phone.trim(),
        city: "Delhi NCR",
        interests: contactData.message.trim() || "Contact Inquiry via Chatbot",
        join_as: "contact",
        form_type: "Contact Us"
      });

      try {
        window.open(waNotifyUrl, "_blank");
      } catch (popupErr) {
        console.warn("Auto-open WhatsApp popup blocked by browser:", popupErr);
      }

      setContactSubmitted(true);
      audio.playBeacon();
    } catch (err) {
      console.error("Failed to submit contact request:", err);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Prompt suggestions for quick taps
  const quickSuggestions = [
    { label: "💬 Direct WhatsApp Chat", value: "WHATSAPP_ACTION" },
    { label: "📩 Contact Us / Inquiry", value: "CONTACT_ACTION" },
    { label: "❓ FAQs & Verification", value: "What are the frequently asked questions about verification, safety, and Happy Keys?" },
    { label: "💡 Experience categories", value: "Give me information about experience categories" },
    { label: "🛡️ Selfie Verification", value: "What is Selfie Verification and safety?" },
    { label: "🔑 Happy Key Sync", value: "How do I synchronize with a partner using Happy Keys?" },
    { label: "🍜 Top Hangout Spots", value: "What are the best hangout spots in Delhi NCR?" }
  ];

  const handleOpenToggle = () => {
    audio.playClick();
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    if (textToSend === "WHATSAPP_ACTION") {
      window.open("https://wa.me/918800843189?text=Hello%20Gaurav!%20I%20would%20like%20to%20connect%20and%20chat%20about%20Happy%20Hangouts.", "_blank");
      
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: "Connecting to WhatsApp with Gaurav (+91 8800843189)...",
        timestamp: new Date()
      };
      const mubaMsg: Message = {
        id: `muba-${Date.now()}`,
        sender: "muba",
        text: "I've launched **WhatsApp Chat** with **Gaurav (+91 8800843189)** in a new tab! You can directly chat with Gaurav on WhatsApp for instant assistance.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, userMsg, mubaMsg]);
      audio.playClick();
      return;
    }

    if (textToSend === "CONTACT_ACTION") {
      setIsContactModalOpen(true);
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: "I want to Contact Us / Submit Inquiry",
        timestamp: new Date()
      };
      const mubaMsg: Message = {
        id: `muba-${Date.now()}`,
        sender: "muba",
        text: "I've opened the **Contact Request Form**! Fill in your details and our team will get back to you shortly.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, userMsg, mubaMsg]);
      audio.playClick();
      return;
    }

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    audio.playBeacon();

    // Trigger typing animation
    setIsTyping(true);

    const lower = textToSend.toLowerCase();

    if (lower.includes("contact") || lower.includes("whatsapp") || lower.includes("reach") || lower.includes("inquiry") || lower.includes("email") || lower.includes("phone")) {
      setTimeout(() => {
        setIsContactModalOpen(true);
        const mubaMsg: Message = {
          id: `muba-${Date.now()}`,
          sender: "muba",
          text: "You can reach **Gaurav** directly on **WhatsApp (+91 8800843189)** or submit a quick **Contact Inquiry**! We will respond promptly to your request.",
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, mubaMsg]);
        setIsTyping(false);
      }, 500);
      return;
    }

    try {
      // Build conversation history payload
      const history = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        content: m.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          history: history,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach server");
      }

      const data = await response.json();
      
      const mubaMsg: Message = {
        id: `muba-${Date.now()}`,
        sender: "muba",
        text: data.reply || data.fallback,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, mubaMsg]);
    } catch (err) {
      console.error("Backend request failed, using local offline model:", err);
      
      let replyText = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes("profile") || lower.includes("suggest") || lower.includes("recommend") || lower.includes("match") || lower.includes("partner") || lower.includes("companion") || lower.includes("who") || lower.includes("friend") || lower.includes("person") || lower.includes("people")) {
        // Detailed offline suggestions based on specific hobbies/preferences
        if (lower.includes("chess") || lower.includes("learn") || lower.includes("rohan") || lower.includes("strategy") || lower.includes("game")) {
          replyText = "Based on your interest in Chess/Strategy, you should meet **Rohan Malhotra** (26, Chess Master)!\n- **Bio**: 'Can talk endlessly about chess tactics, strategies, and deep mental models.'\n- **Suggested Spots**: **Sunder Nursery Library** or **Delhi Guitar Academy, Saket**.\n\nBecome a Founding Hangout Partner to host or connect!";
        } else if (lower.includes("coffee") || lower.includes("book") || lower.includes("reading") || lower.includes("aditi") || lower.includes("conversations") || lower.includes("vinyl")) {
          replyText = "Based on your love for books & coffee, you should connect with **Aditi Sharma** (24, Vinyl Collector)!\n- **Bio**: 'Obsessed with cozy coffee conversations and magic realism books.'\n- **Suggested Spots**: **Blue Tokai, Khan Market** or **Third Wave Coffee, CP**.\n\nBecome a Founding Hangout Partner to host or connect!";
        } else if (lower.includes("nature") || lower.includes("sunset") || lower.includes("meera") || lower.includes("parakeet") || lower.includes("walk") || lower.includes("trail")) {
          replyText = "If you love nature walks, you'll match perfectly with **Meera Reddy** (25, Sunder Lover)!\n- **Bio**: 'Sunder Nursery's lake trails are my second home. Let's spot parakeets.'\n- **Suggested Spots**: **Sunder Nursery Lakefront** or **Lodi Garden Rose Corridor**.\n\nBecome a Founding Hangout Partner to host or connect!";
        } else if (lower.includes("art") || lower.includes("creative") || lower.includes("ananya") || lower.includes("cinema") || lower.includes("movie") || lower.includes("draw")) {
          replyText = "For deep creative talks, you should meet **Ananya Kapoor** (23, Creative Mind) in Noida!\n- **Bio**: 'Let's sit in a hidden rustic cafe and enjoy deep, unhurried conversations about cinema & life.'\n- **Suggested Spots**: **The Reader's Cafe, Sector 18** or **The Book Cover, Sector 104**.\n\nBecome a Founding Hangout Partner to host or connect!";
        } else if (lower.includes("sport") || lower.includes("badminton") || lower.includes("run") || lower.includes("karan") || lower.includes("active") || lower.includes("fitness")) {
          replyText = "For high-energy physical activities, you should meet **Karan Prasad** (25, Smash Champion) in Noida!\n- **Bio**: 'Friendly badminton and running partner. Ready for cooperative rallies.'\n- **Suggested Spots**: **Sector 62 Sports Arena** or **Noida Stadium Courts**.\n\nBecome a Founding Hangout Partner to host or connect!";
        } else if (lower.includes("road") || lower.includes("trip") || lower.includes("vikram") || lower.includes("bird") || lower.includes("sanctuary")) {
          replyText = "If you're in the mood to explore hidden gems, connect with **Vikram Sen** (27, Road Tripper) in Noida!\n- **Bio**: 'Okhla Bird Sanctuary is amazing during sunsets. Let's explore scenic lakes.'\n- **Suggested Spots**: **Okhla Bird Sanctuary** or **Noida Botanical Garden**.\n\nBecome a Founding Hangout Partner to host or connect!";
        } else if (lower.includes("startup") || lower.includes("business") || lower.includes("pitch") || lower.includes("aaryan") || lower.includes("network") || lower.includes("tech") || lower.includes("code") || lower.includes("coding")) {
          replyText = "For professional networking & tech brainstorming, connect with **Aaryan Gupta** (27, Startup Nomad) in Gurgaon!\n- **Bio**: 'Pitching venture concepts on paper napkins. Let's network.'\n- **Suggested Spots**: **WeWork Club, CyberHub** or **Innov8 Lounge, Sector 54**.\n\nBecome a Founding Hangout Partner to host or connect!";
        } else if (lower.includes("music") || lower.includes("guitar") || lower.includes("jam") || lower.includes("shruti") || lower.includes("poetry") || lower.includes("sing") || lower.includes("song")) {
          replyText = "For beautiful acoustic music and artistic expression, connect with **Shruti Aggarwal** (24, Poetry & Jam) in Gurgaon!\n- **Bio**: 'Acoustic music lover and sketch companion. Let's meet at a cozy open-mic cafe.'\n- **Suggested Spots**: **The Piano Man Jazz Club** or **Friction Cafe Open Stage**.\n\nBecome a Founding Hangout Partner to host or connect!";
        } else if (lower.includes("festival") || lower.includes("party") || lower.includes("concert") || lower.includes("celebrate") || lower.includes("muba mehta")) {
          replyText = "If you love festivals and social events, you'll match with **Muba Mehta** (26, Festival Buddy) in Gurgaon!\n- **Bio**: 'Concert goer, Garba fan, and travel companion. Let's celebrate!'\n- **Suggested Spots**: **CyberHub Central Arena** or **The Lodhi event lawns**.\n\nBecome a Founding Hangout Partner to host or connect!";
        } else {
          replyText = "Welcome to Happy Hangouts! As NCR's premier ID-verified peer network, membership into our companion pools is selectively granted. Here are some of our esteemed verified members:\n- **Rohan Malhotra** (Delhi, Chess/Deep Learn)\n- **Aditi Sharma** (Delhi, Book & Coffee Connections)\n- **Ananya Kapoor** (Noida, Cinema & Artsy Cafe Vibe)\n- **Karan Prasad** (Noida, Active Badminton & Run)\n- **Aaryan Gupta** (Gurgaon, Startup Tech & Networking)\n- **Shruti Aggarwal** (Gurgaon, Music Jamming & Poetry)\n\nSubmit your membership application on our waitlist to be reviewed for companion matching!";
        }
      } else if (lower.includes("faq") || lower.includes("question") || lower.includes("cost") || lower.includes("price") || lower.includes("privacy")) {
        replyText = "Here are key answers to common **Happy Hangouts FAQs**:\n- **Verification**: 2-step government photo ID & 3D facial biometric scan.\n- **Happy Keys**: Dual visual puzzle handshake at certified venues ensures genuine presence.\n- **Privacy**: Phone numbers and exact coordinates are strictly shielded via encrypted channels.\n- **Certified Hubs**: Meets take place strictly at vetted public venues (Sunder Nursery, Blue Tokai, Siri Fort).\n- **Membership Cost**: Free to apply for early access during our NCR rollout phase!\n\nAsk me any specific question about safety, spots, or companion matching!";
      } else if (lower.includes("suggestion") || lower.includes("idea") || lower.includes("activities") || lower.includes("what to do") || lower.includes("vibe") || lower === "suggestions" || lower.includes("category") || lower.includes("categories")) {
        replyText = "Happy Hangouts hosts high-vibe, curated experience categories:\n- **Startup & Founders Sync**: Paper napkin pitches & deep strategy.\n- **Acoustic Guitar Sessions**: Creative jamming at certified hubs.\n- **Photography Expeditions**: Outdoor photo walks at Sunder Nursery & Lodhi.\n- **Co-Working & Coding Pairs**: Focused build sessions at premium lounges.";
      } else if (lower.includes("safe") || lower.includes("safety") || lower.includes("genuine") || lower.includes("verification") || lower.includes("fake") || lower === "safety") {
        replyText = "Our strict security standard is why people strive to join Happy Hangouts:\n- **Government ID & Biometric Matching**: Zero tolerance for fake accounts.\n- **100% Vetted Members**: Every companion is photo-verified.\n- **Shielded Encrypted Sync**: Private coordinates unlocked only via dual Happy Keys.";
      } else if (lower.includes("sync") || lower.includes("match") || lower.includes("key") || lower.includes("puzzle")) {
        replyText = "The **Happy Key Handshake** is our signature arrival verification:\n- **Dual Visual Puzzle Match**: Both companions bring their phones together at a certified spot.\n- **Verified Check-In**: Eliminates ghosting and guarantees authentic presence.\n- **Map Pulse Glow**: Confirms live active sync at the venue!";
      } else if (lower.includes("coffee") || lower.includes("cafe") || lower.includes("café") || lower.includes("tea") || lower.includes("chai") || lower === "coffee" || lower.includes("spot") || lower.includes("spots") || lower.includes("where")) {
        replyText = "Certified Partner Hubs across Delhi NCR:\n- **Blue Tokai (Khan Market / CP)**: High-vibe pour-over cafes.\n- **Sunder Nursery Gardens**: Scenic heritage lakefronts.\n- **The Reader's Cafe (Noida)**: Premium quiet book nooks.\n- **WeWork Lounge (CyberHub Gurgaon)**: Exclusive founder spaces.";
      } else if (lower.includes("help") || lower.includes("support") || lower.includes("ticket") || lower.includes("problem") || lower.includes("error")) {
        replyText = "Happy Hangouts Membership Services:\n- **Concierge Support**: Message concierge@happyhangouts.com.\n- **24/7 Safety Desk**: Instant SOS trigger available in active meetup views.";
      } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("muba") || lower.includes("yo")) {
        replyText = "Greetings! I am **Muba**, Brand Ambassador for Happy Hangouts.\n\nHappy Hangouts is NCR's most sought-after verified companion network. Joining is a privileged membership granted through strict biometric vetting.\n- Ask me about **certified hubs** (Blue Tokai, Sunder Nursery, CP).\n- Ask about our **vetted member profiles**.\n- Ask about **Happy Key Handshakes** & **Safety Standards**.\n\nHow can I assist your membership application today?";
      } else if (lower.includes("blue light") || lower.includes("lights") || lower.includes("glow")) {
        replyText = "The **Blue Light Pulse** on our Trust Map signifies verified active handshakes:\n- Real-time confirmation of ID-checked members meeting at certified hubs.\n- Total coordinate privacy until both members slide their Happy Keys!";
      } else {
        replyText = "I am **Muba**, your Happy Hangouts Concierge.\n- Ask about **Happy Key Handshakes** & **Biometric Verification**.\n- Explore **certified hubs** across Delhi, Gurgaon, and Noida.\n- Submit your **Membership Application** to join our exclusive companion pools!";
      }

      const mubaMsg: Message = {
        id: `muba-${Date.now()}`,
        sender: "muba",
        text: replyText,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, mubaMsg]);
    } finally {
      setIsTyping(false);
      audio.playClick();
    }
  };

  return (
    <>
      {/* FLOATING ACTION TRIGGER BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleOpenToggle}
          id="muba-chat-trigger"
          className="relative group w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full shadow-[0_8px_30px_rgb(37,99,235,0.4)] flex items-center justify-center text-white border-2 border-white/20 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          {/* Glowing ring */}
          <span className="absolute -inset-1.5 bg-blue-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {isOpen ? (
            <X className="w-6 h-6 relative z-10" />
          ) : (
            <div className="relative z-10">
              {/* Custom micro Muba head icon inside badge */}
              <svg 
                className="w-10 h-10 drop-shadow-sm" 
                viewBox="0 0 160 160" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="80" cy="80" r="68" fill="#0A192F" stroke="#3B82F6" strokeWidth="2" />
                {/* Collar */}
                <path d="M50 130 C55 115, 65 105, 80 105 C95 105, 105 115, 110 130 Z" fill="#0E46A3" />
                {/* Face */}
                <path d="M60 75 C60 58, 100 58, 100 75 C100 93, 100 98, 80 102 C60 98, 60 93, 60 75 Z" fill="#F3C19E" />
                {/* Beard */}
                <path d="M60 75 C60 88, 66 98, 80 101 C94 98, 100 88, 100 75 C100 80, 96 92, 80 94 C64 92, 60 80, 60 75 Z" fill="#2D3139" />
                {/* Hair - Stylish Curly Muba Hair */}
                <circle cx="62" cy="62" r="10" fill="#21252D" />
                <circle cx="72" cy="56" r="11" fill="#1E2129" />
                <circle cx="82" cy="52" r="12" fill="#282C36" />
                <circle cx="92" cy="56" r="11" fill="#1E2129" />
                <circle cx="102" cy="62" r="10" fill="#21252D" />
                {/* Smile */}
                <path d="M75 84 Q80 88 85 84" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              
              {/* Live green pulse online dot */}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </span>
            </div>
          )}

          {/* Unread badge */}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* EXPANDABLE CHAT PANEL INTERFACE */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] sm:w-[390px] h-[520px] max-h-[80vh] bg-[#0B1528]/95 backdrop-blur-xl rounded-[28px] border border-blue-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden animate-fade-in-up">
          
          {/* HEADER BAR */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 px-5 py-4 border-b border-blue-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Custom avatar mini */}
                <svg 
                  className="w-10 h-10 border border-blue-500/30 rounded-full bg-[#0A192F]" 
                  viewBox="0 0 160 160" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="80" cy="80" r="68" fill="#0A192F" />
                  <path d="M50 130 C55 115, 65 105, 80 105 C95 105, 105 115, 110 130 Z" fill="#0E46A3" />
                  <path d="M60 75 C60 58, 100 58, 100 75 C100 93, 100 98, 80 102 C60 98, 60 93, 60 75 Z" fill="#F3C19E" />
                  <path d="M60 75 C60 88, 66 98, 80 101 C94 98, 100 88, 100 75 C100 80, 96 92, 80 94 C64 92, 60 80, 60 75 Z" fill="#2D3139" />
                  <circle cx="62" cy="62" r="10" fill="#21252D" />
                  <circle cx="72" cy="56" r="11" fill="#1E2129" />
                  <circle cx="82" cy="52" r="12" fill="#282C36" />
                  <circle cx="92" cy="56" r="11" fill="#1E2129" />
                  <circle cx="102" cy="62" r="10" fill="#21252D" />
                  <path d="M75 84 Q80 88 85 84" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-slate-900 rounded-full" />
              </div>
              
              <div>
                <h3 className="font-bold text-xs tracking-tight text-white font-display flex items-center gap-1">
                  Ask Muba
                  <Heart className="w-3 h-3 text-blue-500 fill-blue-500 animate-pulse" />
                </h3>
                <p className="text-[9px] text-blue-400 font-mono font-bold tracking-widest uppercase">
                  EXPERIENCE GUIDE • ACTIVE
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href="https://wa.me/918800843189?text=Hello%20Gaurav!%20I%20want%20to%20connect%20with%20you%20regarding%20Happy%20Hangouts."
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all shadow-sm active:scale-95"
                title="Chat with Gaurav on WhatsApp (+91 8800843189)"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  audio.playClick();
                  setIsContactModalOpen(true);
                }}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Contact Us / Inquiry Form"
              >
                <Mail className="w-3 h-3" />
                <span>Contact</span>
              </button>

              <button 
                onClick={handleOpenToggle}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-1"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MESSAGES LIST AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {messages.map((msg) => {
              const mentionedCompanions = msg.sender === "muba" ? getMentionedCompanions(msg.text) : [];
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div 
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                      msg.sender === "user" 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none"
                    }`}
                  >
                    {msg.sender === "user" ? msg.text : renderFormattedText(msg.text)}
                  </div>

                  {/* Clickable Companion Cards */}
                  {mentionedCompanions.map((comp) => (
                    <React.Fragment key={comp.id}>
                      <div 
                        onClick={() => {
                          audio.playClick();
                          setSelectedComp(comp);
                          setDownloadTriggered(false);
                        }}
                        className="mt-2 w-full bg-slate-950/80 hover:bg-slate-900 border border-blue-500/10 hover:border-blue-500/40 p-2.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2.5 group relative overflow-hidden text-left"
                      >
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-900">
                          <CharacteristicAvatar id={comp.id} className="w-full h-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-slate-100 text-xs truncate group-hover:text-blue-400 transition-colors">
                              {comp.name}
                            </span>
                            <span className="text-[8px] bg-blue-950 border border-blue-500/20 text-blue-400 font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                              {comp.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {comp.bio}
                          </p>
                        </div>
                        <div className="shrink-0 text-slate-500 group-hover:text-blue-400 transition-colors">
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                      
                      {/* Prominent booking banner nudge underneath the profile suggestion */}
                      <div className="mt-1.5 w-full bg-blue-950/40 border border-blue-500/20 px-3 py-2 rounded-xl flex items-center justify-between gap-2 shadow-[0_4px_12px_rgba(37,99,235,0.05)]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Smartphone className="w-3.5 h-3.5 text-blue-400 shrink-0 animate-pulse" />
                          <span className="text-[9px] text-blue-300 font-bold tracking-tight uppercase truncate">
                            Book your companion.. download app now!
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            audio.playClick();
                            setSelectedComp(comp);
                            setDownloadTriggered(false);
                          }}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[8px] font-black uppercase tracking-wider rounded-md shrink-0 transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </React.Fragment>
                  ))}

                  <span className="text-[8px] text-slate-500 font-mono mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex flex-col items-start max-w-[85%] mr-auto">
                <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 rounded-tl-none flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-medium">Muba is typing</span>
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-75" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-300" />
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* COMPANION DETAILS OVERLAY */}
          {selectedComp && (
            <div className="absolute inset-0 bg-[#070e1b]/98 z-50 flex flex-col animate-fade-in-up">
              {/* Header */}
              <div className="px-5 py-4 border-b border-blue-500/10 flex items-center justify-between bg-slate-950/40">
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Companion Profile</span>
                <button 
                  onClick={() => {
                    audio.playClick();
                    setSelectedComp(null);
                  }}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Avatar Display */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500/40 shadow-xl shadow-blue-500/5 bg-slate-900 mb-2 relative">
                    <CharacteristicAvatar id={selectedComp.id} className="w-full h-full" />
                    <span className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-emerald-500 border-2 border-slate-950 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-md">
                      ✓
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-base text-white tracking-tight">
                    {selectedComp.name}, <span className="text-slate-400">{selectedComp.age}</span>
                  </h3>
                  
                  <div className="flex gap-1.5 items-center justify-center mt-1">
                    <span className="text-[9px] bg-blue-950 border border-blue-500/30 text-blue-400 font-bold px-2 py-0.5 rounded-full">
                      {selectedComp.badge}
                    </span>
                    <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-red-400" /> {selectedComp.city}
                    </span>
                  </div>
                </div>

                {/* About Bio Section */}
                <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/60 text-left">
                  <span className="text-[8px] uppercase font-bold tracking-widest text-slate-500 block mb-1">About Bio</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    "{selectedComp.bio}"
                  </p>
                </div>

                {/* Handpicked Hangout Spots */}
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/40 text-left">
                  <span className="text-[8px] uppercase font-bold tracking-widest text-slate-500 block mb-1.5">Favorite Hangout Spots ({selectedComp.city})</span>
                  <div className="space-y-1">
                    {selectedComp.spots.map((spot, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-200">
                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                        <span>{spot}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="flex items-center gap-2 bg-emerald-950/20 border border-emerald-500/10 px-3 py-2 rounded-2xl text-left">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-wider text-emerald-400 block">Verified Community Star</span>
                    <p className="text-[9px] text-emerald-500/80 leading-normal">
                      Profile passes biometric selfie checks and safety standards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-4 bg-slate-950/80 border-t border-blue-500/10 flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    audio.playClick();
                    setDownloadTriggered(true);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-xl text-[11px] font-black tracking-wide shadow-lg shadow-blue-500/15 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 animate-bounce" />
                  BOOK YOUR COMPANION.. DOWNLOAD APP NOW!
                </button>
                
                {downloadTriggered ? (
                  <div className="text-[9px] text-emerald-400 font-bold text-center animate-pulse flex items-center justify-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Download started! App installer triggered in preview tab.
                  </div>
                ) : (
                  <span className="text-[8px] text-slate-500 text-center font-mono">
                    * Booking and chats unlock instantly on iOS & Android download.
                  </span>
                )}
              </div>
            </div>
          )}


          {/* CONTACT US INLINE MODAL OVERLAY */}
          {isContactModalOpen && (
            <div className="absolute inset-0 bg-[#070e1b]/98 z-50 flex flex-col animate-fade-in-up text-left">
              <div className="px-5 py-4 border-b border-blue-500/10 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Contact & Direct WhatsApp</span>
                </div>
                <button 
                  onClick={() => {
                    audio.playClick();
                    setIsContactModalOpen(false);
                    setContactSubmitted(false);
                  }}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
                
                {/* WhatsApp Quick Link Box */}
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-300">WhatsApp Chat with Gaurav</h4>
                      <p className="text-[10px] text-emerald-400/80">+91 8800843189 • Instant Connect</p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/918800843189?text=Hello%20Gaurav!%20I%20want%20to%20connect%20and%20chat%20about%20Happy%20Hangouts."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 transition-all flex items-center gap-1 shadow-sm"
                  >
                    <span>Chat with Gaurav</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">or send direct inquiry</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                {contactSubmitted ? (
                  <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                    <CheckCircle className="w-7 h-7 text-emerald-400 mx-auto" />
                    <h4 className="text-xs font-bold text-white">Inquiry Submitted Successfully!</h4>
                    <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                      Thank you! Our team has received your inquiry and will reach out shortly.
                    </p>
                    
                    <a
                      href={generateWhatsAppLeadUrl({
                        name: contactData.name,
                        email: contactData.email,
                        phone: contactData.phone,
                        city: "Delhi NCR",
                        join_as: "Contact Inquiry",
                        form_type: "Contact Us",
                        interests: contactData.message
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Notify Gaurav (+91 8800843189) on WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => {
                        setContactSubmitted(false);
                        setContactData({ name: "", email: "", phone: "", message: "" });
                      }}
                      className="mt-1 px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer block mx-auto"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-2.5">
                    <div>
                      <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={contactData.name}
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@example.com"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Inquiry Details</label>
                      <textarea
                        rows={2}
                        placeholder="What would you like to know or request?"
                        value={contactData.message}
                        onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingContact || !contactData.name || !contactData.email}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      {isSubmittingContact ? (
                        <span>Submitting Inquiry...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Inquiry</span>
                        </>
                      )}
                    </button>


                  </form>
                )}

              </div>
            </div>
          )}

          <GoogleScriptGuideModal
            isOpen={isGuideModalOpen}
            onClose={() => setIsGuideModalOpen(false)}
          />
          <div className="px-4 py-2 border-t border-blue-500/5 bg-slate-950/20 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
            {quickSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug.value)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-blue-900/30 text-slate-300 hover:text-blue-200 border border-slate-800 hover:border-blue-500/30 rounded-full text-[10px] font-bold tracking-tight whitespace-nowrap transition-all duration-300"
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* CHAT INPUT AREA */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-4 border-t border-blue-500/10 bg-slate-950/50 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Muba about features or spots..."
              className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
            
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 ${
                inputValue.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-slate-900 text-slate-600 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
