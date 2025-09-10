
import { GoogleGenAI, Type } from "@google/genai";
import { type Action, type Entity, type Location } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable is not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const VISUALS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    entities: {
      type: Type.ARRAY,
      description: "All characters, creatures, and key inanimate objects in the story.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The unique name of the entity." },
          emoji: { type: Type.STRING, description: "A single emoji that best represents the entity." },
          properties: {
            type: Type.ARRAY,
            description: "Up to 3 descriptive adjective-based properties of the entity.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "The name of the property (e.g., 'curious', 'brave')." },
                value: { type: Type.INTEGER, description: "The intensity of the property on a scale of 1 to 10." }
              },
              required: ['name', 'value']
            }
          }
        },
        required: ['name', 'emoji', 'properties']
      }
    },
    locations: {
      type: Type.ARRAY,
      description: "All distinct locations or settings mentioned in the story.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The unique name of the location." },
          emoji: { type: Type.STRING, description: "A single emoji that best represents the location." }
        },
        required: ['name', 'emoji']
      }
    },
    actions: {
      type: Type.ARRAY,
      description: "A chronologically ordered list of all significant actions taken by entities.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "A short, 2-3 word verb-phrase describing the action (e.g., 'peeped into', 'ran after')." },
          source: { type: Type.STRING, description: "The name of the entity performing the action." },
          target: { type: Type.STRING, description: "The name of the entity or object receiving the action. Can be the same as the source." },
          location: { type: Type.STRING, description: "The name of the location where the action takes place. Use 'unknown' if not specified." },
          passage: { type: Type.STRING, description: "The exact, word-for-word sentence or clause from the text that describes this specific action." }
        },
        required: ['name', 'source', 'target', 'location', 'passage']
      }
    }
  },
  required: ['entities', 'locations', 'actions']
};

export const extractVisualsFromText = async (text: string): Promise<{ entities: Entity[], locations: Location[], actions: Action[] }> => {
  try {
    const ai = getAI();
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following story and extract all entities, locations, and actions. Ensure the actions are in chronological order as they appear in the story. The 'passage' for each action must be the exact, word-for-word quote from the text.\n\nSTORY:\n${text}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: VISUALS_SCHEMA,
      }
    });
    
    const jsonString = result.text.trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error extracting visuals:", error);
    // Return empty structure on error to prevent crashes
    return { entities: [], locations: [], actions: [] };
  }
};


export const rewriteStoryFromVisuals = async (entities: Entity[], actions: Action[]): Promise<string> => {
    try {
        const ai = getAI();
        const entitiesString = entities.map(e => e.name).join(', ');
        const actionsString = actions.map((a, i) => `${i+1}. ${a.source} ${a.name} ${a.target} (in ${a.location})`).join('\n');

        const prompt = `Write a simple and cohesive short story involving these characters: ${entitiesString}. The story must follow this exact sequence of events:\n${actionsString}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error rewriting story:", error);
        return "Error generating story.";
    }
};
