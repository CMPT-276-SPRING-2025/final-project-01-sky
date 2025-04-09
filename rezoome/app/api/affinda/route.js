

// affinda api handling route
// This route handles POST requests for processing resume files using the Affinda API
import { NextResponse } from "next/server";

// POST handler to accept a resume file and return parsed data
export async function POST(req) {
    try {
        // Extract JSON body from the request
        const body = await req.json();
        const { file } = body; // Get the Base64-encoded file from the request body

        // Return an error if no file is provided
        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log("Processing file...");
        // Process the file using helper function and return result
        const result = await processFile(file); // Calls processFile(file: string) -> Promise<object>

        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error) {
        console.error("Error processing file:", error);
        // Return 500 status if something goes wrong during processing
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}

// Parses a Base64 resume file using Affinda’s document parsing endpoint
// Input: base64File (string)
// Output: Parsed resume data object from Affinda API
async function parseResumeWithAffinda(base64File) {
  const API_KEY = process.env.AFFINDA_API_KEY; // Fetch Affinda API key from environment variable
  const apiUrl = "https://api.affinda.com/v3/documents";

  try {
       // Send POST request to Affinda with Base64 file
      const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              file: base64File,  // Sending the Base64 file
              collection: "txgiAHqZ", // Optional collection ID for grouping resumes
              wait_for_review: false // Set to false for immediate auto-processing
          }),
      });

       // Throw error if the response is not OK (e.g. 400/500)
      if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      return data; // Return parsed resume data
  } catch (error) {
      console.error("Failed to parse resume:", error);
      return { error: "Failed to parse resume", details: error.message };
  }
}


// Fetches full resume data from Affinda using a document ID
// Input: documentId (string)
// Output: Resume data object or error object
async function fetchResumeData(documentId) {
const API_KEY = process.env.AFFINDA_API_KEY; // Ensure API key is set
  const apiUrl = `https://api.affinda.com/v3/documents/${documentId}`;

  try {
      // Send GET request to Affinda to fetch full resume data
      const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
          },
      });

      // Throw error if response fails
      if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();

      console.log("Full Response from Affinda:", JSON.stringify(data, null, 2));

      // Extract parsed resume data
      const resumeData = data;

      // Warn if data is empty (possibly still processing)
      if (Object.keys(resumeData).length === 0) {
          console.warn("Resume data is empty. It might still be processing.");
      }

      return resumeData;
  } catch (error) {
      console.error("Failed to fetch resume data:", error);
      return { error: "Failed to fetch resume data", details: error.message };
  }
}

// Main function to handle resume file processing
// Input: file (string - Base64 encoded)
// Output: Resume data object
export async function processFile(file){
    // Check if running on server or client side
  if (typeof window == "undefined") {
    console.log("Application is on server side");
} else {
    alert("Application is on client side");
}
  console.log("using base 64 file to send to affinda")
    // Step 1: Parse the resume file using Affinda
  let document = await parseResumeWithAffinda(file)
     // Step 2: Use the returned document ID to fetch detailed resume data
  let response = await fetchResumeData(document.meta.identifier)
  console.log(response)
  return response
}
