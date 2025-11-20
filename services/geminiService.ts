import { GoogleGenAI } from "@google/genai";
import { DatasetRecord } from "../types";

// We'll initialize the client when needed, not at module load time
let ai: GoogleGenAI | null = null;

// Function to initialize the AI client when needed
const getAI = () => {
    if (!ai) {
        // Check if API key is available from various sources
        // This approach works for both Vercel and other deployment platforms
        const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY ||
                      (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) ||
                      (typeof window !== 'undefined' && (window as any).VITE_GEMINI_API_KEY) ||
                      (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
                      (import.meta as any).env?.GEMINI_API_KEY ||
                      '';
        
        // Log the API key status for debugging (without exposing the actual key)
        console.log('API Key Status:', {
            hasViteEnvKey: !!(import.meta as any).env?.VITE_GEMINI_API_KEY,
            hasProcessEnvViteKey: !!(typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY),
            hasWindowKey: !!(typeof window !== 'undefined' && (window as any).VITE_GEMINI_API_KEY),
            hasProcessEnvKey: !!(typeof process !== 'undefined' && process.env?.GEMINI_API_KEY),
            hasImportMetaEnvKey: !!(import.meta as any).env?.GEMINI_API_KEY,
            keyLength: apiKey ? apiKey.length : 0
        });
        
        if (!apiKey || apiKey.length < 20) { // Basic validation - real keys are longer
            console.warn("Valid API Key not found. AI features will be disabled.");
            return null;
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

export const analyzeDataset = async (dataset: DatasetRecord): Promise<string> => {
    try {
        // Initialize AI client when needed
        const aiClient = getAI();
        
        // If no API key is available, return a friendly message
        if (!aiClient) {
            return "AI analysis is currently unavailable. Please ensure the administrator has configured a valid API key.";
        }
        
        const model = 'gemini-2.5-flash';
        
        const prompt = `
        As a senior chemical process engineer, analyze the following dataset summary from a chemical plant.
        
        Dataset Name: ${dataset.file_name}
        Uploaded At: ${dataset.uploaded_at}
        
        Summary Statistics:
        - Total Equipment Count: ${dataset.summary.total_count}
        - Average Flowrate: ${dataset.summary.average_flowrate} m3/h
        - Average Pressure: ${dataset.summary.average_pressure} bar
        - Average Temperature: ${dataset.summary.average_temperature} °C
        
        Equipment Type Distribution:
        ${dataset.summary.type_distribution.map(t => `- ${t.name}: ${t.value}`).join('\n')}
        
        Please provide a concise technical analysis (approx 150 words) covering:
        1. Operational efficiency based on the averages.
        2. Any potential safety concerns (e.g., high pressure/temp for typical equipment).
        3. Observations on the equipment mix.
        
        Format the response in Markdown.
        `;

        const response = await aiClient.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || "No analysis generated.";
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        // Provide a more user-friendly error message
        if (error instanceof Error && error.message.includes("API Key")) {
            return "Error: Invalid API key. Please contact the administrator to configure a valid API key.";
        }
        return "Error generating analysis. Please contact the administrator. Technical details: " + (error as Error).message;
    }
};