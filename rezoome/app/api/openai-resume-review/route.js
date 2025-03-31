
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