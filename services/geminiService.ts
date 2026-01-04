import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real production app, ensure your API key is secure.
// Using Vite's import.meta.env for environment variables
// IMPORTANT: In Vite, only variables prefixed with VITE_ are exposed to client code
// Use VITE_GEMINI_API_KEY in your .env file (not GEMINI_API_KEY)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAssistantResponse = async (
  history: { role: string; text: string }[],
  userMessage: string
): Promise<string> => {
  try {
    if (!apiKey) {
      return "I'm sorry, I'm currently offline (API Key missing). Please check back later.";
    }

    const model = "gemini-3-flash-preview";
    
    // Construct chat history for context
    // We limit history to last 10 messages to keep context window manageable
    const relevantHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Add current user message
    relevantHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: `You are AloAssistant, the AI support agent for AloTelcom. 
        AloTelcom sells eSIMs for global travel.
        Your goal is to help users find the right data plan for their destination and answer basic travel questions.
        Be concise, friendly, and helpful. 
        If asked about prices, you can mention:
        - 1GB plans start around $5.
        - 3GB plans start around $12.
        - 10GB plans start around $25.
        We cover over 190 countries.
        Do not make up fake specific plan details if you don't know, just give general ranges.
        `
      },
      history: relevantHistory.slice(0, -1) // Pass previous history
    });

    const result = await chat.sendMessage({
      message: userMessage
    });

    return result.text || "I didn't catch that. Could you please rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the network right now. Please try again.";
  }
};