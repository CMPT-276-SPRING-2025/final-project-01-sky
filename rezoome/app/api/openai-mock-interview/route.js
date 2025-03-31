
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

let resumeData = ""
let listingData = ""

export async function POST(req) {
  try {
    const body = await req.json(); // Parse incoming JSON
    console.log("Received resume data:", body);

    resumeData = body;
    // You could use the formatted data here if needed
    // Or store it somewhere

    return NextResponse.json({ message: 'Data received successfully' });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json(); // Parse incoming JSON
    console.log("Received listing data:", body);

    listingData = body;
    // You could use the formatted data here if needed
    // Or store it somewhere

    return NextResponse.json({ message: 'Data received successfully' });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req) {
  try {
    if (!resumeData || !listingData) {
      return new NextResponse("Missing resume or listing data", { status: 400 });
    }

    const prompt = `
You are an AI assistant helping a candidate prepare for a job interview.

Here is their resume:
${JSON.stringify(resumeData, null, 2)}

Here is the job listing:
${JSON.stringify(listingData, null, 2)}

Based on the resume and job description, generate a list of 5 tailored technical and behavioral interview questions to help them prepare.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = completion.choices[0].message.content;
    return NextResponse.json({ questions: responseText });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return new NextResponse("Failed to generate questions", { status: 500 });
  }
}