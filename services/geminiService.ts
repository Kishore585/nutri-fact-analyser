import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, SafetyStatus } from "../types";

/**
 * Helper to convert File to Base64 data part for Gemini API.
 */
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

/**
 * Analyzes a food label image using Gemini for advanced reasoning.
 * Includes consumption guidance with recipes, portion, or moderation advice.
 */
export const analyzeImage = async (imageFile: File, baseProfileContext: string, customConditions?: string): Promise<ScanResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    
    CONSUMPTION GUIDANCE INSTRUCTIONS:
    6. Based on the product type and the user's health goal, provide consumption guidance:
       - For RAW/COOKABLE food items (like paneer, chicken, vegetables, eggs, tofu, fish, lentils, rice etc.):
         Set type to "recipe". Provide 2-3 healthy recipes specifically tailored to the user's health goal.
         Each recipe should have a descriptive name, a brief description of how to prepare it,
         and a YouTube search query that would find a relevant cooking video (e.g., "paneer tikka high protein muscle building recipe").
       - For PACKAGED/PROCESSED JUNK food items (like chips, candies, sodas, instant noodles, cookies etc.):
         Set type to "moderation". Provide advice on why minimal consumption is better and suggest healthier alternatives.
       - For HEALTHY SNACKS/DRY FRUITS (like almonds, walnuts, dates, seeds, dark chocolate, dried berries etc.):
         Set type to "portion". Provide the recommended daily consumption amount (e.g., "5-6 almonds per day")
         and explain the nutritional benefit for the user's specific health goal.
    7. The consumptionGuidance title should be specific to the product and health goal.
    
    Return the response in strict JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
            },
            consumptionGuidance: {
              type: Type.OBJECT,
              description: "Guidance on how to consume this product based on its type and the user's health goal.",
              properties: {
                type: {
                  type: Type.STRING,
                  enum: ['recipe', 'moderation', 'portion'],
                  description: "The type of guidance: 'recipe' for cookable items, 'moderation' for junk food, 'portion' for healthy snacks."
                },
                title: {
                  type: Type.STRING,
                  description: "A descriptive title for the guidance section (e.g., 'Paneer Recipes for Muscle Building')."
                },
                advice: {
                  type: Type.STRING,
                  description: "Main guidance text explaining how to best consume this product for the health goal."
                },
                recipes: {
                  type: Type.ARRAY,
                  description: "Array of 2-3 recipes (only for type 'recipe'). Omit for moderation/portion types.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Recipe name (e.g., 'High-Protein Paneer Tikka')." },
                      description: { type: Type.STRING, description: "Brief description of ingredients and preparation." },
                      youtubeSearchQuery: { type: Type.STRING, description: "A YouTube search query to find a video of this recipe (e.g., 'paneer tikka high protein recipe')." }
                    },
                    required: ["name", "description", "youtubeSearchQuery"]
                  }
                },
                dailyAmount: {
                  type: Type.STRING,
                  description: "Recommended daily consumption amount (only for type 'portion', e.g., '5-6 almonds per day')."
                }
              },
              required: ["type", "title", "advice"]
            }
          },
          required: ["verdict", "summary", "ingredients", "nutritionalHighlights", "consumptionGuidance"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text.trim()) as ScanResult;

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze image. Please try again.");
  }
};