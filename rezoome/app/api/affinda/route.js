

// affinda api handling route
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { file } = body; // Extract file from request

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log("Processing file...");
        const result = await processFile(file); // Call processFile function

        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error) {
        console.error("Error processing file:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}




async function parseResumeWithAffinda(base64File) {
  const API_KEY = process.env.AFFINDA_API_KEY; // Ensure API key is set
  const apiUrl = "https://api.affinda.com/v3/documents";

  try {
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              file: base64File,  // Sending the Base64 file
              collection: "tWjKYFPQ", // Optional: replace with your Affinda collection ID
              wait_for_review: false // 🔥 Ensures instant processing
          }),
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      return data; // This contains parsed resume information
  } catch (error) {
      console.error("Failed to parse resume:", error);
      return { error: "Failed to parse resume", details: error.message };
  }
}

async function fetchResumeData(documentId) {
const API_KEY = process.env.AFFINDA_API_KEY; // Ensure API key is set
  const apiUrl = `https://api.affinda.com/v3/documents/${documentId}`;

  try {
      const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();

      console.log("Full Response from Affinda:", JSON.stringify(data, null, 2));

      // Extract parsed resume data
      const resumeData = data;

      if (Object.keys(resumeData).length === 0) {
          console.warn("⚠️ Resume data is empty. It might still be processing.");
      }

      return resumeData;
  } catch (error) {
      console.error("Failed to fetch resume data:", error);
      return { error: "Failed to fetch resume data", details: error.message };
  }
}


export async function processFile(file){
    if (typeof window == "undefined") {
        console.log("Application is on server side");
    } else {
        alert("Application is on client side");
    }
  console.log("using base 64 file to send to affinda")
  let document = await parseResumeWithAffinda(file);
  if (document.error) {
    // Pass this up as a controlled failure
    throw new Error(`Affinda parsing failed: ${document.details}`);
  }

  let response = await fetchResumeData(document.meta.identifier);

  if (response.error) {
    throw new Error(`Failed to fetch resume data: ${response.details}`);
  }
  console.log(response)
  return response
}
