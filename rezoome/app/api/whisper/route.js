// app/api/whisper/route.js

import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST route to handle audio transcription using OpenAI Whisper
export async function POST(req) {
  try {
    console.log("Whisper route hit");

    // Parse multipart/form-data from the incoming request
    const formData = await req.formData();
    const file = formData.get("file");

    // Validate that a file exists and is not a string
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
    }

    // Convert uploaded file to a buffer for saving to the file system
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a temporary file name and path for the uploaded file
    const fileName = `recording-${Date.now()}.webm`;
    const tempPath = path.join(os.tmpdir(), fileName);

    // Write the file buffer to a temporary location
    await writeFile(tempPath, buffer);
    
  // Create a readable stream from the saved file for OpenAI API
    const fileStream = fs.createReadStream(tempPath);

     // Call OpenAI Whisper API to transcribe the audio
    const whisperResponse = await openai.audio.transcriptions.create({
      file: fileStream,
      fileName,
      model: "whisper-1",
      response_format: "json",
    });

    console.log("Transcription result:", whisperResponse.text);

     // Return the transcribed text to the client
    return NextResponse.json({ transcription: whisperResponse.text });
  } catch (error) {
    // Handle unexpected errors and return 500 response
    console.error("Whisper route error:", error);
    return NextResponse.json({ error: "Whisper failed" }, { status: 500 });
  }
}
