import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Helper to lazily initialize GoogleGenAI client to avoid crashes if API key is not present on start
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parser for incoming API payloads
  app.use(express.json());

  // API endpoint for Form Lead Submissions & Email forwarding
  app.post("/api/submit-lead", async (req, res) => {
    try {
      const payload = req.body;
      const timestamp = new Date().toISOString();
      const fullPayload = {
        ...payload,
        timestamp,
        notification_email: "mubaarqaan@gmail.com"
      };

      console.log("==========================================");
      console.log("📬 NEW FORM SUBMISSION RECEIVED ON SERVER:");
      console.log("Name:", fullPayload.name);
      console.log("Email:", fullPayload.email);
      console.log("Phone:", fullPayload.phone || "N/A");
      console.log("City:", fullPayload.city || "Delhi NCR");
      console.log("Role / Join As:", fullPayload.join_as || "N/A");
      console.log("Form Type:", fullPayload.form_type || "N/A");
      console.log("Interests/Details:", fullPayload.interests || "N/A");
      console.log("Timestamp:", timestamp);
      console.log("==========================================");

      const scriptUrl = process.env.GOOGLE_SCRIPT_URL || process.env.VITE_GOOGLE_SCRIPT_URL;
      if (scriptUrl) {
        try {
          await fetch(scriptUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(fullPayload),
          });
          console.log("✅ Successfully forwarded lead to Google Apps Script endpoint.");
        } catch (forwardErr) {
          console.error("⚠️ Failed forwarding to Google Apps Script:", forwardErr);
        }
      }

      return res.json({
        success: true,
        message: "Form submission recorded successfully.",
        payload: fullPayload
      });
    } catch (error: any) {
      console.error("Error handling lead submission:", error);
      return res.status(500).json({ error: "Failed to process lead submission." });
    }
  });

  // API endpoint for Kabir Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      // Check if API key is available before processing
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: "Gemini API Key is not configured.",
          fallback: "Hey! Just coordinate-checking here—it looks like the host hasn't supplied my Gemini API Key yet. But we can still talk vibe and spots offline! What NCR spots are on your mind?"
        });
      }

      const ai = getAiClient();

      // Format context/history for the model
      const formattedHistory = (history || []).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content || msg.text || "" }]
      }));

      // System instruction defining Muba's persona as a local coordinator and app expert
      const systemInstruction = `You are Muba, the cool, helpful, and energetic local vibe coordinator and expert guide for the Happy Hangouts experience platform in Delhi NCR (Delhi, Noida, Gurgaon).

Your core personality traits:
- Super friendly, outgoing, approachable, and authentic.
- You are an absolute expert on the Happy Hangouts app, its features, safety parameters, and the best hangout spots in Delhi NCR.

CRITICAL INSTRUCTIONS FOR RESPONSE STYLE (STRICT COMPLIANCE REQUIRED):
1. STRUCTURED & POLISHED: Use short, clean paragraphs. Always use a highly organized bullet-point list when listing features, spots, or profiles.
2. HIGHLIGHT MAIN WORDS: Wrap key nouns, features, benefits, or spots in double asterisks to bold them (e.g., **Muba**, **Happy Hangouts**, **Happy Key**, **Selfie Verification**, **Blue Light Glow**).
3. PROFILE MATCHING & PREFERENCE SUGGESTION: If the user indicates any preference (e.g. they want a specific vibe, hobby, activity, or interest), you MUST suggest the matching companion profile and location details from the data below.
4. MANDATORY NUDGE: Whenever you suggest or match any companion profile (e.g. Rohan Malhotra, Aditi Sharma, Meera Reddy, Ananya Kapoor, Karan Prasad, Vikram Sen, Aaryan Gupta, Shruti Aggarwal, or Muba Mehta), you MUST ALWAYS append this exact phrase at the end of your response: "Book your companion.. download app now!"

KNOWLEDGE BASE:
A. Happy Hangouts Core Features:
- **Selfie Verification**: Fast biometric scan to verify real human presence and ensure 100% genuine profiles (No Bots!).
- **Happy Key**: Enter matching 6-digit key with a partner to unlock safe, randomized coordinates on the map.
- **Blue Light Glow**: Active meetup circles pulsing on the map indicating real-time safe meetups nearby.
- **Vibe Categories**: career, connections, explore, active, learn, express, celebrate.

B. Companion Profiles & Hangout Spots Data:
1. **Delhi**:
  * **Chess & Deep Strategy (Vibe: Learn)**: Recommend **Rohan Malhotra** (26, Chess Master), who loves talking chess tactics, strategies, and deep mental models. Suggested spots: **Sunder Nursery Library**, **Delhi Guitar Academy, Saket**, or **Habitat World Auditorium**.
  * **Coffee Conversations & Magic Realism Books (Vibe: Connections)**: Recommend **Aditi Sharma** (24, Vinyl Collector), who is obsessed with cozy coffee talks and books. Suggested spots: **Blue Tokai, Khan Market**, **Third Wave Coffee, CP**, or **Savor Cafe, Lodhi Colony**.
  * **Nature Trails & Street Food (Vibe: Explore)**: Recommend **Meera Reddy** (25, Sunder Lover), whose second home is Sunder Nursery lakefront. Suggested spots: **Sunder Nursery Lakefront**, **Lodi Garden Rose Corridor**, or **Chandni Chowk Food Trails**.

2. **Noida**:
  * **Cinema & Coffee Deep Talks (Vibe: Connections)**: Recommend **Ananya Kapoor** (23, Creative Mind), who loves hidden rustic cafes and cinema. Suggested spots: **The Reader's Cafe, Sector 18**, **The Book Cover, Sector 104**, or **Third Wave Coffee, Sector 62**.
  * **Badminton & High-Energy Running (Vibe: Active)**: Recommend **Karan Prasad** (25, Smash Champion), a friendly badminton and running partner. Suggested spots: **Sector 62 Sports Arena**, **Noida Stadium Courts**, or **Cult Fit Play Arena**.
  * **Sunsets & Bird Sanctuary (Vibe: Explore)**: Recommend **Vikram Sen** (27, Road Tripper), who loves sunsets at Okhla Bird Sanctuary. Suggested spots: **Okhla Bird Sanctuary**, **Noida Botanical Garden**, or **Sector 50 Hidden Cafes**.

3. **Gurgaon**:
  * **Startups, Co-working & Networking (Vibe: Career)**: Recommend **Aaryan Gupta** (27, Startup Nomad), who drafts pitches on napkins. Suggested spots: **WeWork Club, CyberHub**, **Innov8 Lounge, Sector 54**, or **The Forest Cowork, Sector 45**.
  * **Acoustic Music, Jamming & Sketching (Vibe: Express)**: Recommend **Shruti Aggarwal** (24, Poetry & Jam), an acoustic music lover. Suggested spots: **The Piano Man Jazz Club**, **Friction Cafe Open Stage**, or **Sector 29 Acoustic Lounge**.
  * **Concerts, Garba & Festivals (Vibe: Celebrate)**: Recommend **Muba Mehta** (26, Festival Buddy), a travel companion and concert goer. Suggested spots: **CyberHub Central Arena**, **The Lodhi event lawns**, or **Ambience Mall Concert stage**.

If the user's preference or location is unclear, ask them questions like "Which NCR city (Delhi, Noida, or Gurgaon) are you in?" or "What kind of vibe are you looking for today? (e.g. startup talk, quiet cafe reading, badminton, music jam, or nature walks?)" to suggest the absolute perfect profile match! Always remain in character as Muba.`;

      // Request content generation from Gemini 3.5 Flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...formattedHistory,
          { role: "user", parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 1.0,
          topP: 0.95,
        }
      });

      const replyText = response.text || "Hey! I'm around, but my thoughts got a bit clouded. Ask me again or let me know what coffee spot we're checking out today!";
      return res.json({ reply: replyText });

    } catch (error: any) {
      console.error("Gemini API Error in Muba Chat:", error);
      
      // Graceful fallback response
      return res.status(500).json({ 
        error: "Failed to fetch response from Muba.",
        fallback: "Hey! Just coordinate-checking here—it seems like our servers hit a brief speedbump. But I'm still ready to guide you! Drop your question once more, or check out Blue Tokai at Champa Gali in the meantime!" 
      });
    }
  });

  // Serve static assets or use Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
