import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    //console.log("Received resume data:", body);
    // Store in session storage or another persistence layer if needed
    return NextResponse.json({ message: 'Resume data received successfully', data: body });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    console.log("Received job listing data:", body);
    // Store in session storage or another persistence layer if needed
    return NextResponse.json({ message: 'Job listing data received successfully' });
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req) {
  try {
    // Get data from URL parameters
    const url = new URL(req.url);
    const resumeDataParam = url.searchParams.get('resumeData');
    const listingDataParam = url.searchParams.get('listingData');
    
    if (!resumeDataParam || !listingDataParam) {
      return NextResponse.json({ 
        error: 'Missing data', 
        resumeDataExists: !!resumeDataParam, 
        listingDataExists: !!listingDataParam 
      }, { status: 400 });
    }

    let resumeData;
    try {
      resumeData = JSON.parse(resumeDataParam);
    } catch (e) {
      console.error("Failed to parse resume data:", e);
      return NextResponse.json({ error: 'Invalid resume data format' }, { status: 400 });
    }

    // Prepare the data for OpenAI - Simplifying the prompt structure to ensure consistent JSON
    const prompt = `
    You are an expert resume reviewer and career advisor.
    
    RESUME INFORMATION:
    Name: ${resumeData.name || 'Not provided'}
    
    Education:
    ${resumeData.education && resumeData.education.length > 0 ? 
      resumeData.education.map(edu => 
        `- ${edu.degree || 'Degree not specified'} in ${edu.major || 'Field not specified'} from ${edu.institution || 'Institution not specified'} (${edu.date || 'Date not specified'})`
      ).join('\n') : 'No education information provided'}
    
    Work Experience:
    ${resumeData.workExperience && resumeData.workExperience.length > 0 ? 
      resumeData.workExperience.map(job => 
        `- ${job.jobTitle || 'Title not specified'} at ${job.company || 'Company not specified'} (${job.startDate || 'Start date not specified'} - ${job.endDate || 'Present'})\n  ${job.description || 'Description not provided'}`
      ).join('\n\n') : 'No work experience provided'}
    
    Skills:
    ${resumeData.skills && resumeData.skills.length > 0 ? 
      resumeData.skills.join(', ') : 'None specified'}
    
    Projects:
    ${resumeData.projects && resumeData.projects.length > 0 ? 
      resumeData.projects.map(project => 
        `- ${project.projectTitle || 'Title not specified'}: ${project.description || 'Description not provided'}`
      ).join('\n') : 'No projects listed'}
    
    JOB LISTING:
    ${listingDataParam}
    
    Based on the above information, please provide:
    1. A detailed feedback section analyzing the resume's strengths and weaknesses in relation to the job listing
    2. A list of 4-6 specific, actionable suggestions to improve the resume for this particular job
    
    Your response MUST be a valid JSON object with exactly this structure:
    {
      "feedback": "Your detailed feedback here...",
      "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3", "Suggestion 4"]
    }
    
    Make sure the suggestions are an array of strings, not a nested object or formatted text. Each suggestion should be a complete, actionable sentence.
    `;

    // Call OpenAI API - using gpt-4o
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert resume reviewer providing specific, actionable advice to job seekers. Always return responses in valid JSON format with a 'feedback' string and 'suggestions' array of strings." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }, // Force JSON response
      temperature: 0.7,
    });

    // Parse the response
    const responseText = completion.choices[0].message.content;
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
      
      // Validate that suggestions exist and is an array
      if (!responseData.suggestions || !Array.isArray(responseData.suggestions)) {
        console.warn("Suggestions missing or not an array, creating default array");
        responseData.suggestions = ["Highlight relevant skills that match the job requirements", 
                                   "Quantify your achievements with specific metrics", 
                                   "Tailor your work experience descriptions to the job listing",
                                   "Add industry-specific keywords from the job posting"];
      }
      
      // Ensure feedback exists
      if (!responseData.feedback) {
        responseData.feedback = "The AI couldn't generate specific feedback. Please try again or contact support.";
      }
    } catch (e) {
      console.error("Failed to parse OpenAI response as JSON:", e);
      //console.log("Raw response:", responseText);
      
      // Create a fallback response with default suggestions
      responseData = {
        feedback: responseText.includes("feedback") ? 
          responseText.split("feedback")[1].split("suggestions")[0].trim() : 
          "The AI couldn't generate specific feedback in the correct format. Please try again.",
        suggestions: [
          "Highlight relevant skills that match the job requirements", 
          "Quantify your achievements with specific metrics", 
          "Tailor your work experience descriptions to the job listing",
          "Add industry-specific keywords from the job posting"
        ]
      };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error generating feedback:", error);
    return new NextResponse("Error generating feedback", { status: 500 });
  }
}