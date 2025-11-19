import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME, ANALYSIS_SYSTEM_INSTRUCTION, generateUserPrompt } from "../constants";
import { SearchResult, ProductAnalysis } from "../types";

export const analyzeProduct = async (query: string): Promise<SearchResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: generateUserPrompt(query),
      config: {
        systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.3, // Low temperature for more factual/consistent data extraction
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    // Extract JSON from the response
    // More robust regex that handles optional 'json' language identifier and whitespace
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    
    if (!jsonMatch) {
      console.error("Raw response:", text);
      throw new Error("Failed to parse structured data from the analysis. Please try again.");
    }

    let analysisData: ProductAnalysis;
    try {
      analysisData = JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      throw new Error("The analysis data was malformed.");
    }

    // Extract grounding metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      analysis: analysisData,
      groundingChunks: groundingChunks,
    };

  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};