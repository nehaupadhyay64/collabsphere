import { GoogleGenAI } from "@google/genai";
import config from "../config/index.js";
import asyncHandler from "../utils/asyncHandler.js";

// Agar kabhi model error aaye, to AI Studio mein current model ka naam dekh ke yahan badal do
const GEMINI_MODEL = "gemini-2.5-flash";

const askGemini = async (prompt) => {
  const ai = new GoogleGenAI({ apiKey: config.geminiKey });
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });
  return response.text;
};

// Higher-order function: prompt banane ka tareeqa do, ye ek controller bana deta hai
const makeGeminiController = (buildPrompt) =>
  asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim())
      return res.status(400).json({ message: "Text is required" });
    if (!config.geminiKey)
      return res.status(500).json({ message: "Gemini API key is missing on the server" });

    try {
      const result = await askGemini(buildPrompt(text.slice(0, 8000)));
      res.json({ result });
    } catch (err) {
      res.status(502).json({ message: "Gemini request failed: " + err.message });
    }
  });

export const explain = makeGeminiController(
  (t) => `Explain the following content in simple words for a beginner:\n\n${t}`
);

export const improve = makeGeminiController(
  (t) => `Suggest clear improvements for this note. Give short bullet points:\n\n${t}`
);

export const docs = makeGeminiController(
  (t) => `Generate clean documentation (purpose, functions, usage) in Markdown for this code:\n\n${t}`
);

export const readme = makeGeminiController(
  (t) => `Write a professional README.md in Markdown for this project:\n\n${t}`
);