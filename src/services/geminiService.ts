import { GoogleGenAI } from '@google/genai';
import { RecommendationResult } from '../types';

interface RecommendationInput {
  qualification: 'High School' | 'Diploma' | "Bachelor's Degree" | "Master's Degree" | 'PhD';
  experience: number;
  career_goal: string;
  profession: string;
  full_name: string;
}

export async function getAiRecommendation(data: RecommendationInput): Promise<RecommendationResult> {
  const geminiApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (
    !geminiApiKey || 
    geminiApiKey === '' || 
    geminiApiKey.includes('your-gemini-api-key') || 
    geminiApiKey === 'MY_GEMINI_API_KEY'
  ) {
    throw new Error(
      'Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file to use the AI Recommendation system.'
    );
  }

  const ai = new GoogleGenAI({ apiKey: geminiApiKey });

  const prompt = `You are an expert academic advisor. Analyze the following candidate profile:
- Full Name: ${data.full_name}
- Highest Qualification: ${data.qualification}
- Years of Work Experience: ${data.experience} years
- Current Profession: ${data.profession}
- Career Goal/Aspiration: ${data.career_goal}

Provide a structured, personalized higher education pathway recommendation. Focus on matching their background and goals with the most suitable academic path:
- PhD (Doctor of Philosophy): for research/academia/scientific R&D goals.
- DBA (Doctor of Business Administration): for senior leadership, management, or strategy goals with professional experience.
- Honorary Doctorate: for candidates with extensive (15+ years) landmark industry contributions.
- Master's Degree: for specializing, career pivoting, or intermediate research.
- Bachelor's Degree: for foundational undergraduate academic grounding.
- Professional Certification Program: for fast, applied skill acquisition or specialized credentials.

Return your response in JSON format matching the schema exactly. DO NOT wrap the output in markdown code blocks like \`\`\`json. Return only raw JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            recommendation: { 
              type: 'string',
              description: 'The recommended degree or path name (e.g. PhD (Doctor of Philosophy), DBA (Doctor of Business Administration), Honorary Doctorate, Master’s Degree, Bachelor’s Degree, or Professional Certification Program).'
            },
            reason: { 
              type: 'string', 
              description: 'A comprehensive, detailed, and premium analysis (3-4 sentences) explaining why this path is the strategic fit and how it connects to their career goals and professional profile.'
            }
          },
          required: ['recommendation', 'reason']
        }
      }
    });

    if (!response.text) {
      throw new Error('Received empty response from Gemini API.');
    }

    const result = JSON.parse(response.text.trim());
    
    if (!result.recommendation || !result.reason) {
      throw new Error('Invalid response structure returned by Gemini.');
    }

    return {
      recommendation: result.recommendation,
      reason: result.reason
    };
  } catch (err: any) {
    console.error('Gemini API call failed:', err);
    throw new Error(err.message || 'Failed to generate recommendation using Gemini AI.');
  }
}
