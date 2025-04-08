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

// Enhanced GET endpoint for match score with better debugging
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const documentId = searchParams.get('documentId');
        const jobDescription = searchParams.get('jobDescription');
        
        if (!documentId || !jobDescription) {
            return NextResponse.json({ error: "Missing documentId or jobDescription" }, { status: 400 });
        }
        
        console.log("Getting match score with documentId:", documentId);
        console.log("Job description length:", jobDescription.length);
        
        const result = await getMatchScore(documentId, jobDescription);
        
        return NextResponse.json({ success: true, matchScore: result.score, details: result.details || {} }, { status: 200 });
    } catch (error) {
        console.error("Error getting match score:", error);
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
              collection: "DbKdQIFn", // Optional: replace with your Affinda collection ID
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

async function uploadJobDescription(base64File) {
    const API_KEY = process.env.AFFINDA_API_KEY;
    const apiUrl = "https://api.affinda.com/v3/documents";
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          file: base64File,
          collection: "cZFJhrSP",
          wait_for_review: false
        })
      });
  
      const data = await response.json();
      console.log("Uploaded job description:", data);
  
      return data;
    } catch (error) {
      console.error("Error uploading job description:", error);
      return null;
    }
}


async function addResumeToIndex(documentId, indexName = "Resume-Search-Demo") {
    const API_KEY = process.env.AFFINDA_API_KEY;
    const apiUrl = "https://api.affinda.com/v3/indexes/resumes";
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: indexName,
          resume_identifiers: [documentId]
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error adding resume to index:", errorText);
        throw new Error(`Failed to add resume to index: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Resume added to index successfully:", data);
      return data;
    } catch (error) {
      console.error("Error adding resume to index:", error);
      throw error;
    }
  }
  
  

// Corrected getMatchScore function that follows Affinda API docs
async function getMatchScore(documentId, jobDescription) {
    const API_KEY = process.env.AFFINDA_API_KEY;
    const apiUrl = "https://api.affinda.com/v3/resume_search/match";
    console.log(documentId);
    if (!API_KEY) {
        console.error("API key is not set");
        return { score: 0, error: "API key not configured" };
    }
    
    try {
        
        const url = new URL(apiUrl);
        // Add parameters
        url.searchParams.append('resume', documentId);
        let jobDocument = await uploadJobDescription(jobDescription);
        let jobIdentifier = jobDocument?.meta?.identifier;
        console.log("job document id: ", jobIdentifier)
        url.searchParams.append('job_description', jobIdentifier);
        

        
        
        console.log("Document ID:", documentId);
        console.log("Job description length:", jobDescription.length);
        console.log("Full request URL:", url.toString());
        
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${API_KEY}`, // Make sure this is your actual API key
                "Accept": "application/json"
            }
        });
        
        console.log("Response status:", response.status);
        
        // Get the raw response text first for debugging
        const responseText = await response.text();
        console.log("Raw response:", responseText);
        
        // Parse the response if it's valid JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse response as JSON:", parseError);
            return { score: 0, error: "Invalid JSON response" };
        }
        
        console.log("Parsed response data:", data);
        
        if (data && typeof data.score === 'number') {
            console.log("Successfully got score:", data.score);
            return { score: data.score, details: data.details || {} };
        } else {
            console.warn("Score not found in response data");
            return { score: 0, error: "Score not found in API response" };
        }
    } catch (error) {
        console.error("Error getting match score:", error);
        return { score: 0, error: error.message };
    }
}

export async function processFile(file){
  console.log("using base 64 file to send to affinda")
  let document = await parseResumeWithAffinda(file)
  let response = await fetchResumeData(document.meta.identifier)
  
  // Store the document ID in the response for later use
  response.documentId = document.meta.identifier;

  try {
    await addResumeToIndex(document.meta.identifier);
    response.indexStatus = "added";
  } catch (error) {
    console.error("Failed to add resume to index:", error);
    response.indexStatus = "failed";
  }
  
  console.log(response)
  return response
}