import { GoogleGenAI } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function translateResumeToEnglish(data: ResumeData): Promise<ResumeData> {
  const model = "gemini-3-flash-preview";
  const prompt = `Translate the following resume data from Spanish to English. 
  Keep the JSON structure exactly the same. 
  Only translate the text content of the fields. 
  Do not translate technical names, IDs, URLs, or names of technologies (like "React", "Next.js").
  However, translate job positions, descriptions, labels, and degree names.
  
  Return ONLY the translated JSON object.
  
  Data:
  ${JSON.stringify(data)}`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) throw new Error("No response from Gemini");
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}
