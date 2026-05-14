import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function evaluateCandidate({
  transcript,
  jobDescription,
}: {
  transcript: string;
  jobDescription: string;
}) {
  const prompt = `
You are an expert recruiter.

Evaluate the candidate based on the job description and interview transcript.

SCORING CRITERIA:
- communication
- confidence
- technical understanding
- relevance to role
- problem solving
- clarity of answers

Penalize:
- vague answers
- weak communication
- lack of technical depth

JOB DESCRIPTION:
${jobDescription}

INTERVIEW TRANSCRIPT:
${transcript}

Return STRICT JSON ONLY.

{
  "score": number between 1-10,
  "summary": "short summary",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendation": "SHORTLIST" or "REJECT"
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    contents: prompt,

    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(text);
}
