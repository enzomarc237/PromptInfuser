import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedFile, MockupComponent, TechStack } from '../types';
import { MODELS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

const generateContentWithRetry = async (params: any) => {
    try {
        return await ai.models.generateContent(params);
    } catch (error) {
        console.error("API call failed, retrying...", error);
        await new Promise(res => setTimeout(res, 1500));
        return ai.models.generateContent(params);
    }
}

export const generateUIPrompt = async (task: string): Promise<string> => {
  const prompt = `You are an expert UI/UX designer and prompt engineer. Your task is to generate a detailed, structured prompt for an AI design generator.
  The user wants to design the following: "${task}".
  Create a prompt that includes the AI's role, the specific task, the context (purpose, audience), and the desired output format. Be specific about UI components, layout, and visual style.`;

  const response = await generateContentWithRetry({
    model: MODELS.FLASH,
    contents: prompt,
  });
  return response.text;
};

export const refineUIPrompt = async (existingPrompt: string): Promise<string> => {
    const prompt = `You are an expert UI/UX designer and prompt engineer. Your task is to refine the following UI design prompt to make it more effective, specific, and structured.
    Existing prompt: "${existingPrompt}"
    Return only the refined prompt.`;

    const response = await generateContentWithRetry({
        model: MODELS.FLASH,
        contents: prompt,
    });
    return response.text;
};


export const generatePromptFromImage = async (image: {inlineData: {data: string, mimeType: string}}): Promise<string> => {
  const prompt = "Analyze this UI design image. Generate a detailed, structured prompt that could be used by an AI image generator to recreate a similar design. Describe the layout, components, color scheme, typography, and overall style.";
  
  const response = await generateContentWithRetry({
    model: MODELS.FLASH,
    contents: { parts: [image, { text: prompt }] },
  });
  return response.text;
};


export const generateMockup = async (prompt: string): Promise<MockupComponent> => {
    const response = await generateContentWithRetry({
        model: MODELS.PRO,
        contents: `You are a UI layout generator. Based on the user's prompt, create a JSON representation of a web page.
        The JSON must follow this schema: { "type": "OBJECT", "properties": { "component": { "type": "STRING", "enum": ["container", "header", "text", "button", "input", "card"] }, "text": { "type": "STRING" }, "children": { "type": "ARRAY", "items": { "$ref": "#" } } } }.
        User prompt: "${prompt}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    component: { type: Type.STRING },
                    text: { type: Type.STRING, nullable: true },
                    children: { 
                        type: Type.ARRAY, 
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                component: { type: Type.STRING },
                                text: { type: Type.STRING, nullable: true },
                                children: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            component: { type: Type.STRING },
                                            text: { type: Type.STRING, nullable: true },
                                        },
                                    },
                                    nullable: true
                                }
                            }
                        },
                        nullable: true 
                    },
                }
            }
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as MockupComponent;
};

export const generateCodeFromImage = async (image: {inlineData: {data: string, mimeType: string}}, instructions: string, stack: TechStack): Promise<string> => {
    const prompt = `You are an expert frontend developer. Analyze the provided UI image. Based on the user's instructions and the chosen tech stack (${stack}), generate a single block of clean, functional code that recreates this UI.
    The code must use Tailwind CSS for styling. Do not include any explanations, just the code.
    User instructions: "${instructions}"`;

    const response = await generateContentWithRetry({
        model: MODELS.PRO,
        contents: { parts: [image, { text: prompt }] },
    });
    return response.text.replace(/```[\w-]*\n/g, '').replace(/```/g, '').trim();
};


export const scaffoldProject = async (description: string, stack: TechStack): Promise<GeneratedFile[]> => {
    const prompt = `You are a senior software architect. Based on the user's project description and chosen tech stack, scaffold a complete frontend project.
    Generate the content for the following files: 'README.md', 'package.json', 'src/App.tsx' (or 'index.html' if not React), 'src/components/Button.tsx' (or skip if not React), and 'src/design-tokens.json'.
    Return the output as a single JSON object, where keys are the full file paths and values are the file content as strings.
    Project Description: "${description}"
    Tech Stack: "${stack}"`;
    
    const response = await generateContentWithRetry({
        model: MODELS.PRO,
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
            responseMimeType: 'application/json',
        }
    });

    const jsonText = response.text.trim();
    const filesObject = JSON.parse(jsonText);
    return Object.entries(filesObject).map(([name, content]) => ({ name, content: content as string }));
};

export const getAIGuide = async (toolName: string): Promise<{text: string, sources: any[]}> => {
    const prompt = `Provide a concise guide on how to write effective UI design prompts for the AI tool '${toolName}'. Include best practices, examples, and key parameters to consider. Also provide links to official documentation or top community guides.`;

    const response = await generateContentWithRetry({
        model: MODELS.FLASH,
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text: response.text, sources };
};