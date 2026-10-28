import { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

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
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS OK" }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  try {
    const { message, history } = event.body ? JSON.parse(event.body) : {};

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Message is required." }),
      };
    }

    if (!process.env.GEMINI_API_KEY) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          reply:
            "Hey! Just coordinate-checking here—it looks like the Gemini API Key hasn't been set in the environment yet, but I can still help you offline! Ask me about companion profiles or Delhi NCR hangout spots!",
          fallback: true,
        }),
      };
    }

    const ai = getAiClient();
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content || msg.text || "" }],
    }));

    const systemInstruction = `You are Muba, the cool, helpful, and energetic local vibe coordinator and expert guide for the Happy Hangouts experience platform in Delhi NCR (Delhi, Noida, Gurgaon). Always provide clear, structured recommendations with bold keywords for hangout spots, activities, and verified companions.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] },
      ],
      config: {
        systemInstruction,
        temperature: 0.9,
      },
    });

    const replyText =
      response.text ||
      "Hey! I'm around. Let me know what Delhi NCR spot or companion vibe you'd like to explore today!";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: replyText }),
    };
  } catch (error: any) {
    console.error("Gemini API Error in Netlify Function:", error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply:
          "Hey! We hit a brief network speedbump. Ask me again or check out Blue Tokai in Khan Market or Sunder Nursery in the meantime!",
        fallback: true,
      }),
    };
  }
};
