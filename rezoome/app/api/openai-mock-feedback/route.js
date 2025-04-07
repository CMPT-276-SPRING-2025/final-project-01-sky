import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log("✅ API route /api/openai-mock-feedback hit!");

export async function POST(req) {
  try {
    const body = await req.json();
    const responses = body.responses;

    // Validate input
    if (!Array.isArray(responses) || responses.length !== 4) {
      return NextResponse.json(
        { error: "Invalid input. Must provide exactly 4 responses." },
        { status: 400 }
      );
    }

    // Prompt to OpenAI
    const prompt = `
You are an expert career coach and technical recruiter.

You will receive four answers from a candidate's mock interview. These responses were generated from spoken answers and transcribed by OpenAI Whisper, so punctuation, capitalization, and grammar may be imperfect.

Do not penalize surface-level errors like lowercase letters, missing punctuation, or minor misinterpretations. Instead, focus entirely on the ideas the candidate is trying to convey.

For each answer:
- Give short, actionable feedback based on what real recruiters would look for: clarity, relevance to the question, structure, and professionalism.
- Prioritize the overall message and communication of intent.
- Highlight strengths when present, but focus on constructive tips that would help the candidate improve their impact in a real interview.

Return your response as strict valid JSON in this format:
{
  "q1": "Feedback for response 1",
  "q2": "Feedback for response 2",
  "q3": "Feedback for response 3",
  "q4": "Feedback for response 4"
}

Candidate's Responses (transcribed from speech):
Q1: ${responses[0]}
Q2: ${responses[1]}
Q3: ${responses[2]}
Q4: ${responses[3]}
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach providing mock interview feedback in structured JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5
    });

    const feedback = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json({ feedback });

  } catch (err) {
    console.error("Mock interview feedback error:", err);
    return NextResponse.json({ error: "Failed to generate feedback." }, { status: 500 });
  }
}
