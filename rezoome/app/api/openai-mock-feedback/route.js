import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client using the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("API route /api/openai-mock-feedback hit!");

// Handle POST requests to generate mock interview feedback using OpenAI
export async function POST(req) {
  try {
    // Parse the incoming JSON request body
    const body = await req.json();
    const responses = body.responses;

    // Validate input: must be an array of exactly 4 responses
    if (!Array.isArray(responses) || responses.length !== 4) {
      return NextResponse.json(
        { error: "Invalid input. Must provide exactly 4 responses." },
        { status: 400 }
      );
    }

    // Construct the prompt to be sent to OpenAI
    const prompt = `

You are an expert career coach and technical recruiter with deep insight into what employers look for during interviews.

You will receive four answers from a mock interview. These answers were spoken aloud by a candidate and transcribed using OpenAI Whisper. Therefore, small issues like missing punctuation, incorrect casing, or subtle transcription errors are to be expected and should be ignored. Focus on the ideas and intentions the candidate was trying to convey.

Instructions:

For each response:
- Give short, actionable feedback from the perspective of a real recruiter.
- Provide concise, helpful, first-person feedback.
- Focus on clarity, relevance, structure, confidence, and professionalism.
- Prioritize how clearly the idea is expressed, how well the response matches what recruiters want to hear, and the strength of your structure and communication.
- Prioritize constructive suggestions.
- Use a tone that is Professional.
- Speak as if you're giving feedback directly to the candidate
- If they didn't answer the question just say you did not give a response


2. **Also provide one general feedback comment at the end**, reflecting your overall impression of the candidate based on all four answers. Focus on general feedback that could improve the impression.
  - this can be longer in a consise paragraph
  - You don't have to be nice if the responses they gave is not relavent and doesn't answer the question
  - Your primary job is giving general feedback

Return your response in **strict valid JSON** in this format:
{
  "q1": "Feedback for response 1",
  "q2": "Feedback for response 2",
  "q3": "Feedback for response 3",
  "q4": "Feedback for response 4",
  "generalFeedback": "General summary of candidate's character and performance"
}

Candidate's Responses:
Q1: ${responses[0]}
Q2: ${responses[1]}
Q3: ${responses[2]}
Q4: ${responses[3]}
    `.trim();
// Make a chat completion request to OpenAI with GPT-4o
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert career coach providing structured mock interview feedback in JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" }, // Request response in JSON format
      temperature: 0.5,
    });

    const result = JSON.parse(completion.choices[0].message.content);

    // Ensure fallback structure if field is missing
    const structured = {
      q1: result.q1 || "No feedback.",
      q2: result.q2 || "No feedback.",
      q3: result.q3 || "No feedback.",
      q4: result.q4 || "No feedback.",
      generalFeedback: result.generalFeedback || "No general feedback available.",
    };
// Return the structured feedback to the client
    return NextResponse.json({ feedback: structured });

  } catch (err) {
    // Handle unexpected errors and log for debugging
    console.error("Mock interview feedback error:", err);
    return NextResponse.json(
      { error: "Failed to generate feedback." },
      { status: 500 }
    );
  }
}
