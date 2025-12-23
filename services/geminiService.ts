import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  translate: async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
    if (!text.trim()) return "";
    
    try {
      const ai = getClient();
      const prompt = `
        You are a highly skilled professional translator.
        Translate the following text from ${sourceLang} to ${targetLang}.
        
        Rules:
        1. Return ONLY the translated text.
        2. Do not include quotes or explanations.
        3. Maintain tone and context.
        
        Text: "${text}"
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-latest',
        contents: prompt,
      });

      return response.text?.trim() || "";
    } catch (error: any) {
      console.error("Translation error:", error);
      // Re-throw to handle in UI
      throw error;
    }
  },

  simulatePeerResponse: async (lastUserMessage: string, peerLang: string): Promise<string> => {
    try {
      const ai = getClient();
      const prompt = `
        Roleplay as a friendly person chatting in a messenger app. 
        The user just said: "${lastUserMessage}".
        
        Respond naturally in ${peerLang} language.
        Keep it short (1-2 sentences).
        Return ONLY the response text.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-latest',
        contents: prompt,
      });

      return response.text?.trim() || "...";
    } catch (error) {
      console.error("Peer Simulation error:", error);
      throw error;
    }
  }
};