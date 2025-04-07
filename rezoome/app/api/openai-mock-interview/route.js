
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const { resume, listing } = await req.json();

    if (!resume || !listing) {
      return new NextResponse("Missing resume or listing data", { status: 400 });
    }

    const prompt = `
You are an AI assistant helping a candidate prepare for a job interview.

Here is their resume:
${JSON.stringify(resume, null, 2)}

Here is the job listing:
${JSON.stringify(listing, null, 2)}

Based on the resume and job description, generate a list of technical and behavioral interview questions to help them prepare, tailored to their job listing and resume. This list should have exactly 4 questions total. Do not number the questions. Only respond with the questions and separate each with |
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an interviewer making questions for a potential hire" },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
      }),
    });

    const json = await response.json();
    const responseText = json.choices[0].message.content;

    return NextResponse.json({ questions: responseText });

  } catch (error) {
    console.error("Error generating interview questions:", error);
    return new NextResponse("Failed to generate questions", { status: 500 });
  }
}