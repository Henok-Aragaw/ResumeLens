import { createServerFn } from '@tanstack/react-start';
import { GoogleGenAI } from "@google/genai";

export const analyzeResumeAction = createServerFn({ method: 'POST' })
  .inputValidator((data: { text: string; jobTitle: string }) => data)
  .handler(async ({ data }) => {
    const rawApiKey = process.env.GEMINI_API_KEY;

    if (!rawApiKey) {
      console.error("Critical: GEMINI_API_KEY is not defined.");
      throw new Error("API Key is missing on the server.");
    }

    const client = new GoogleGenAI({ apiKey: rawApiKey });

    const prompt = `
      Analyze this resume for a ${data.jobTitle} position. 
      Provide a detailed evaluation in JSON format.
      Resume Content: ${data.text}
      
      Return exactly this JSON structure:
      {
        "score": number,
        "missingKeywords": string[],
        "weakBulletPoints": [{ "original": string, "suggestion": string }],
        "atsFriendliness": string,
        "skillsFound": string[]
      }
    `;

    try {

      const result = await client.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json"
        }
      });

      if (!result.text) throw new Error("Empty response from AI");
      
      return JSON.parse(result.text);
    } catch (error: any) {
      console.error("Gemini Error:", error.message || error);
      throw new Error("AI analysis failed.");
    }
  });