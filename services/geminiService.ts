
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, SafetyStatus } from "../types";

// Robust API Key detection for different environments (Node, Vite, Webpack)
const getApiKey = (): string => {
  // 1. Check for standard process.env (Node/Webpack/CRA)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  
  // 2. Check for Vite environment variables (Standard for Vercel/Netlify React deployments)
  // @ts-ignore - import.meta is a valid ES property but TS might complain depending on config
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    if (import.meta.env.VITE_API_KEY) return import.meta.env.VITE_API_KEY;
    // @ts-ignore
    if (import.meta.env.API_KEY) return import.meta.env.API_KEY;
  }

  return '';
};

const API_KEY = getApiKey();

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeImage = async (imageFile: File, baseProfileContext: string, customConditions?: string): Promise<ScanResult> => {
  const imagePart = await fileToGenerativePart(imageFile);

  const prompt = `
    Analyze this food label image (nutrition facts or ingredient list).
    
    User Profile Configuration:
    1. Base Health Goal: "${baseProfileContext}"
    2. STRICT PERSONAL CONDITIONS (These override everything): "${customConditions || 'None'}"
    
    Instructions:
    1. Identify all ingredients and nutritional values visible.
    2. Determine if the product is Safe, Caution, or Unsafe based on the Base Goal AND the Strict Personal Conditions.
    3. If an ingredient violates the Strict Personal Conditions (e.g., user is allergic to peanuts), it MUST be marked UNSAFE.
    4. Translate complex chemical names into common names.
    5. Explain *why* an ingredient is good or bad for this specific user.
    
    Return the response in strict JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              enum: [SafetyStatus.SAFE, SafetyStatus.CAUTION, SafetyStatus.UNSAFE, SafetyStatus.UNKNOWN],
              description: "The overall safety verdict for the user profile."
            },
            summary: {
              type: Type.STRING,
              description: "A friendly, plain English summary of the analysis (2-3 sentences) specifically addressing the user's conditions."
            },
            nutritionalHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key nutritional facts relevant to the profile (e.g., 'High in Sugar', 'Contains Peanuts')."
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "The name as it appears on the label." },
                  commonName: { type: Type.STRING, description: "The common, easy-to-understand name." },
                  description: { type: Type.STRING, description: "A simple explanation of what this is." },
                  status: {
                    type: Type.STRING,
                    enum: [SafetyStatus.SAFE, SafetyStatus.CAUTION, SafetyStatus.UNSAFE, SafetyStatus.UNKNOWN]
                  },
                  reason: { type: Type.STRING, description: "Why this status was assigned based on the profile." }
                },
                required: ["name", "commonName", "description", "status", "reason"]
              }
            }
          },
          required: ["verdict", "summary", "ingredients", "nutritionalHighlights"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ScanResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};
