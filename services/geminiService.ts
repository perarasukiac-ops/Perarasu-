import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

// Initialize Gemini
// NOTE: API KEY is managed via process.env.API_KEY as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeUrl = async (url: string): Promise<ScanResult> => {
  const modelId = "gemini-2.5-flash"; // Efficient for rapid analysis

  const prompt = `
    Act as a world-class Cyber Security Expert. 
    Analyze the following URL for potential phishing indicators.
    URL: "${url}"

    Perform a heuristic and semantic analysis. Look for:
    1. Typosquatting (e.g., g0ogle.com instead of google.com)
    2. IP address usage in host
    3. Suspicious TLDs
    4. Excessive length or obfuscation characters
    5. Keyword stuffing (e.g., 'secure', 'login', 'bank')
    
    Return a JSON response strictly following this schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isPhishing: { type: Type.BOOLEAN },
            riskScore: { type: Type.NUMBER, description: "0 to 100, where 100 is definite phishing" },
            verdict: { type: Type.STRING, description: "Short verdict e.g. 'Phishing', 'Legitimate', 'Suspicious'" },
            confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            reasons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of reasons for the verdict"
            },
            features: {
              type: Type.OBJECT,
              properties: {
                urlLength: { type: Type.NUMBER },
                hasIpAddress: { type: Type.BOOLEAN },
                hasAtSymbol: { type: Type.BOOLEAN },
                hasSuspiciousKeywords: { type: Type.BOOLEAN },
                domainAge: { type: Type.STRING },
                sslStatus: { type: Type.STRING }
              },
              required: ["urlLength", "hasIpAddress", "hasAtSymbol", "hasSuspiciousKeywords"]
            }
          },
          required: ["isPhishing", "riskScore", "verdict", "confidence", "reasons", "features"]
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }
    const result = JSON.parse(text) as ScanResult;
    return result;

  } catch (error) {
    console.error("Analysis failed:", error);
    // Return a fallback error state so the UI doesn't crash
    return {
      isPhishing: false,
      riskScore: 0,
      verdict: "Error",
      confidence: "Low",
      reasons: ["Failed to connect to analysis engine.", "Please check your network or API key."],
      features: {
        urlLength: url.length,
        hasIpAddress: false,
        hasAtSymbol: url.includes('@'),
        hasSuspiciousKeywords: false
      }
    };
  }
};
