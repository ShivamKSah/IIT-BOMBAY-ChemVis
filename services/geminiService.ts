import { GoogleGenAI } from "@google/genai";
import { DatasetRecord } from "../types";

// Initialize client. NOTE: process.env.API_KEY is assumed to be injected.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDataset = async (dataset: DatasetRecord): Promise<string> => {
    try {
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

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || "No analysis generated.";
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return "Error generating analysis. Please check your API key configuration.";
    }
};