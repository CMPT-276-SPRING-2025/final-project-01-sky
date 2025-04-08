// app/api/whisper/route.js

import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";

// Init OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    console.log("📥 Whisper route hit");

    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `recording-${Date.now()}.webm`;
    const tempPath = path.join(os.tmpdir(), fileName);


    await writeFile(tempPath, buffer);

    const fileStream = fs.createReadStream(tempPath);

    const whisperResponse = await openai.audio.transcriptions.create({
      file: fileStream,
      fileName,
      model: "whisper-1",
      response_format: "json",
    });

    console.log("✅ Transcription result:", whisperResponse.text);

    return NextResponse.json({ transcription: whisperResponse.text });
  } catch (error) {
    console.error("❌ Whisper route error:", error);
    return NextResponse.json({ error: "Whisper failed" }, { status: 500 });
  }
}
