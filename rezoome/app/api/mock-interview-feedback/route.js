import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
You are an expert career coach and interview trainer.
You will receive four responses from a mock interview.
For each response, provide concise, actionable feedback to help the candidate improve their communication, structure, or content.

Return your response as valid JSON in this exact format:
{
  "q1": "Feedback for response 1",
  "q2": "Feedback for response 2",
  "q3": "Feedback for response 3",
  "q4": "Feedback for response 4"
}

Responses:
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
