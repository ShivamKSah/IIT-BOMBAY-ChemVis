import { GoogleGenAI } from "@google/genai";
import { DatasetRecord } from "../types";

// We'll initialize the client when needed, not at module load time
let ai: GoogleGenAI | null = null;

// Function to initialize the AI client when needed
const getAI = () => {
    if (!ai) {
        // Check if API key is available
        const apiKey = process.env.API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("API Key not found. Please set API_KEY, VITE_GEMINI_API_KEY, or GEMINI_API_KEY environment variable.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

export const analyzeDataset = async (dataset: DatasetRecord): Promise<string> => {
    try {
        // Initialize AI client when needed
        const aiClient = getAI();
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
            return "Error: API key is missing or invalid. Please check your environment configuration.";
        }
        return "Error generating analysis. Please check your API key configuration.";
    }
};