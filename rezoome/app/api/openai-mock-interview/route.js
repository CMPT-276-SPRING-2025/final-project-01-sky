
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Handle POST request to generate interview questions using OpenAI
export async function POST(req) {
  const apiKey = process.env.OPENAI_API_KEY; // Retrieve OpenAI API key from environment variables

  try {
    // Parse incoming JSON request body and extract resume and job listing
    const { resume, listing } = await req.json();

    // Input validation: resume and listing are required
    if (!resume || !listing) {
      return new NextResponse("Missing resume or listing data", { status: 400 });
    }
    // Prompt construction: instructs the AI to generate 4 custom interview questions
    const prompt = `
You are an AI assistant helping a candidate prepare for a job interview.

Here is their resume:
${JSON.stringify(resume, null, 2)}

Here is the job listing:
${JSON.stringify(listing, null, 2)}

Based on the resume and job description, generate a list of technical and behavioral interview questions to help them prepare, tailored to their job listing and resume. This list should have exactly 4 questions total. Do not number the questions. Only respond with the questions and separate each with |
`;
    // Send POST request to OpenAI chat completion API using the GPT-4o-mini model
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`, // Auth header with API key
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Lightweight GPT-4 model for efficiency
        messages: [
          { role: "system", content: "You are an interviewer making questions for a potential hire" },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
      }),
    });

    // Parse JSON response from OpenAI

    const json = await response.json();

    // Extract generated question string from the response

    const responseText = json.choices[0].message.content;

    // Return formatted list of questions to the frontend
    return NextResponse.json({ questions: responseText });

  } catch (error) {
    // Handle unexpected errors (e.g. API failures or JSON parsing issues)
    console.error("Error generating interview questions:", error);
    return new NextResponse("Failed to generate questions", { status: 500 });
  }
}
