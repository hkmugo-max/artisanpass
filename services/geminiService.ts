import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// NOTE: Ideally, this service would handle errors gracefully if the API key is missing or invalid.
// We assume process.env.API_KEY is available.

// Fix: Use process.env.API_KEY directly in named parameter as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to safely parse JSON from markdown code blocks or raw text
 */
const cleanAndParseJSON = (text: string | undefined): any => {
  if (!text) return null;
  try {
    // Remove markdown code blocks if present (e.g. ```json ... ```)
    let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
    // Locate the first '{' and last '}'
    const firstOpen = clean.indexOf('{');
    const lastClose = clean.lastIndexOf('}');
    if (firstOpen !== -1 && lastClose !== -1) {
      clean = clean.substring(firstOpen, lastClose + 1);
    }
    return JSON.parse(clean);
  } catch (e) {
    console.warn("Failed to parse JSON from AI response:", text);
    return null;
  }
};

/**
 * Analyzes an image of raw material to suggest type and quality.
 * Useful for low-literacy users to auto-fill forms.
 */
export const analyzeMaterialImage = async (base64Image: string): Promise<{ type: string; originGuess: string; quality: string }> => {
  if (!process.env.API_KEY) return { type: "Unknown", originGuess: "Unknown", quality: "Standard" };

  try {
    // Fix: Use gemini-3-flash-preview for multimodal analysis (Image -> Text)
    // gemini-2.5-flash-image is for Image Generation.
    const model = 'gemini-3-flash-preview';
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: "Analyze this textile material. Return a VALID JSON object (no markdown) with keys: 'type' (e.g. Wool, Cotton), 'originGuess' (broad region based on visual style if apparent, else General), and 'quality' (High, Medium, Low)." }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = cleanAndParseJSON(response.text);
    return parsed || { type: "Manual Entry Required", originGuess: "Unknown", quality: "Unknown" };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return { type: "Manual Entry Required", originGuess: "Unknown", quality: "Unknown" };
  }
};

/**
 * Analyzes an audio recording of the artisan describing the material.
 */
export const analyzeMaterialAudio = async (audioBlob: Blob): Promise<{ type: string; originGuess: string; quality: string; quantity?: string }> => {
    if (!process.env.API_KEY) return { type: "Audio Processed (Mock)", originGuess: "Local", quality: "High" };

    try {
        // Convert Blob to Base64
        const buffer = await audioBlob.arrayBuffer();
        const base64Audio = btoa(
            new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        // Fix: Use gemini-3-flash-preview for multimodal analysis (Audio -> Text)
        // gemini-2.5-flash-native-audio is typically for Live API / Streaming
        const model = 'gemini-3-flash-preview';

        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { 
                        inlineData: { 
                            mimeType: audioBlob.type || 'audio/webm', 
                            data: base64Audio 
                        } 
                    },
                    { text: "Listen to the artisan's description. Extract the material 'type', 'originGuess' (location), 'quality', and 'quantity' (if mentioned). Return a VALID JSON object (no markdown) with these keys." }
                ]
            },
            config: {
                responseMimeType: 'application/json'
            }
        });

        const parsed = cleanAndParseJSON(response.text);
        return parsed || { type: "Error Processing Audio", originGuess: "Unknown", quality: "Unknown" };

    } catch (error) {
        console.error("Gemini Audio Analysis Failed:", error);
        return { type: "Error Processing Audio", originGuess: "Unknown", quality: "Unknown" };
    }
};

/**
 * Generates the "Artisan Story" for the EU Digital Product Passport based on technical logs.
 */
export const generateDPPStory = async (product: Product): Promise<string> => {
    if (!process.env.API_KEY) return "Verified artisanal product created with care.";

    const logsSummary = product.logs.map(l => `${l.stage} at ${new Date(l.timestamp).toLocaleDateString()}: ${l.description}`).join('\n');
    const materialSummary = product.materials.map(m => `${m.type} from ${m.origin}`).join(', ');

    const prompt = `
        Create a short, engaging narrative (max 50 words) for a Digital Product Passport consumer view.
        The product is a handmade artisanal textile.
        Materials: ${materialSummary}
        Process Logs: ${logsSummary}
        Focus on the craftsmanship and transparency.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "Handcrafted product.";
    } catch (e) {
        return "Authentic handmade product verified by ArtisanPass.";
    }
}