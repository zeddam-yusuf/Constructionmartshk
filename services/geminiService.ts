import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProjectDescription = async (
  prompt: string,
  serviceType: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert construction and interior design consultant. 
      A user wants to start a project related to: ${serviceType}.
      Here is their rough idea: "${prompt}".
      
      Please generate a professional, detailed, and concise project description (max 100 words) that they can post on a marketplace to attract vendors. 
      Focus on technical requirements and clarity.`,
    });
    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};

export const findStrategicMatch = async (
  projectDesc: string,
  vendorProfiles: string[]
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a channel partner matching projects to vendors.
      Project: "${projectDesc}"
      
      Available Vendor Profiles:
      ${vendorProfiles.join('\n')}
      
      Recommend the best vendor type or specific skills to look for this project in 2 sentences.`,
    });
    return response.text || "No recommendation available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI matching unavailable.";
  }
};