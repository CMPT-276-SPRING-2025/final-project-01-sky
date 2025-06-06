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
          collection: "VfbNjkoz",
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


async function indexAffindaDocument(documentId) {
  const API_KEY = process.env.AFFINDA_API_KEY;
  if (!documentId) {
    throw new Error('Document ID is required');
  }
  
  // First check if the document is already indexed
  try {
    const isIndexed = await isDocumentIndexed(documentId);
    if (isIndexed) {
      console.log(`Document ${documentId} is already indexed, skipping indexing`);
      return { status: 'already_indexed', documentId };
    }
  } catch (error) {
    console.warn(`Error checking index status: ${error.message}. Will attempt to index anyway.`);
  }
  
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify({ document: documentId })
  };
  
  try {
    const response = await fetch('https://api.affinda.com/v3/index/search/documents', options);
    
    if (!response.ok) {
      const errorData = await response.json();
      // If the error is that the document is already indexed, don't treat it as an error
      if (errorData?.errors?.some(e => e.code === "unique" && 
          e.detail?.includes("already contains the specified document"))) {
        console.log(`Document ${documentId} is already indexed (confirmed from error)`);
        return { status: 'already_indexed', documentId };
      }
      throw new Error(`Affinda API error: ${JSON.stringify(errorData)}`);
    }
    
    return await response.json();
  } catch (error) {
    // Check if the error message indicates the document is already indexed
    if (error.message.includes("already contains the specified document")) {
      console.log(`Document ${documentId} is already indexed (caught from error)`);
      return { status: 'already_indexed', documentId };
    }
    console.error('Error indexing document:', error);
    throw error;
  }

}

  
async function isDocumentIndexed(documentId) {
  const API_KEY = process.env.AFFINDA_API_KEY; // Ensure API key is set
  if (!documentId) {
    throw new Error('Document ID is required');
  }
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${API_KEY}`
    }
  };
  
  try {
    // First, check if the document exists
    const documentResponse = await fetch(`https://api.affinda.com/v3/documents/${documentId}`, options);
    
    if (!documentResponse.ok) {
      if (documentResponse.status === 404) {
        return false; // Document doesn't exist
      }
      const errorData = await documentResponse.json();
      throw new Error(`Affinda API error checking document: ${JSON.stringify(errorData)}`);
    }
    
    // Next, check if the document is in the search index
    const indexResponse = await fetch(`https://api.affinda.com/v3/index/search/documents/${documentId}`, options);
    
    // If we get a 200 response, the document is indexed
    return indexResponse.ok;
    
  } catch (error) {
    console.error('Error checking document index status:', error);
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
        let indexStatus;
        try {
            let indexedBool = await isDocumentIndexed(documentId);
            if (!indexedBool) {
                indexStatus = await indexAffindaDocument(documentId);
                console.log("Index status:", indexStatus);
            } else {
                console.log(`Document ${documentId} is already indexed`);
            }
        } catch (indexError) {
            console.warn("Error with document indexing, but continuing:", indexError.message);
            // Continue with the match score request anyway
        }
        
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
    // Step 1: Parse the resume file using Affinda
  let document = await parseResumeWithAffinda(file)
     // Step 2: Use the returned document ID to fetch detailed resume data
  let response = await fetchResumeData(document.meta.identifier)
  
  // Store the document ID in the response for later use
  response.documentId = document.meta.identifier;

  try {
    response.indexStatus = "added";
  } catch (error) {
    console.error("Failed to add resume to index:", error);
    response.indexStatus = "failed";
  }
  
  console.log(response)
  return response
}