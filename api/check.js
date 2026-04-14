import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required." });
    }

    const prompt = `
You are an English writing assistant.

Check the user's text and return:
1. Mistakes
2. Corrected version
3. Short explanation in simple English

Text:
${text}
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.status(200).json({
      result: response.text,
    });
  } catch (error) {
    console.error("Gemini error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to check text with Gemini.",
    });
  }
}