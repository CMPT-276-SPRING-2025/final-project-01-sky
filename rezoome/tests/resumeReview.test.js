import { POST, PUT, GET } from "@/app/api/openai-resume-review/route"; // Adjust path as needed if it's not in this folder
import { NextResponse } from "next/server";

// Mock OpenAI response
jest.mock("openai", () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    feedback: "Strong resume but could use more quantified results.",
                    suggestions: [
                      "Add metrics to your achievements",
                      "Tailor each experience to the job description",
                      "Include more industry keywords",
                      "Highlight relevant projects",
                    ],
                  }),
                },
              },
            ],
          }),
        },
      },
    })),
  };
});

describe("OpenAI Resume Review API", () => {
  it("POST should store resume data and return success", async () => {
    const req = { json: jest.fn().mockResolvedValue({ name: "John" }) };
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Resume data received successfully");
    expect(data.data).toEqual({ name: "John" });
  });

  it("PUT should store job listing data and return success", async () => {
    const req = { json: jest.fn().mockResolvedValue({ title: "Frontend Developer" }) };
    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Job listing data received successfully");
  });

  it("GET should return formatted feedback and suggestions", async () => {
    const resumeData = {
      name: "John Doe",
      education: [],
      workExperience: [],
      skills: [],
      projects: [],
    };
    const listingData = "Job listing text here";

    const req = {
      url: `http://localhost:3000/api/openai?resumeData=${encodeURIComponent(
        JSON.stringify(resumeData)
      )}&listingData=${encodeURIComponent(listingData)}`,
    };

    const response = await GET(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.feedback).toBeDefined();
    expect(Array.isArray(json.suggestions)).toBe(true);
    expect(json.suggestions.length).toBeGreaterThan(0);
  });

  it("GET should return 400 if data is missing", async () => {
    const req = {
      url: `http://localhost:3000/api/openai?resumeData=&listingData=`,
    };
    const response = await GET(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("Missing data");
  });
});

it("POST should return 500 if JSON parsing fails", async () => {
    const brokenReq = { json: jest.fn().mockRejectedValue(new Error("Parse error")) };
    const response = await POST(brokenReq);
    const text = await response.text();
  
    expect(response.status).toBe(500);
    expect(text).toBe("Internal Server Error");
  });

  it("PUT should return 500 if JSON parsing fails", async () => {
    const brokenReq = { json: jest.fn().mockRejectedValue(new Error("Parse error")) };
    const response = await PUT(brokenReq);
    const text = await response.text();
  
    expect(response.status).toBe(500);
    expect(text).toBe("Internal Server Error");
  });

  it("GET should return 400 if resumeData is not valid JSON", async () => {
    const req = {
      url: "http://localhost:3000/api/openai?resumeData=bad%7Bjson&listingData=some%20job"
    };
  
    const response = await GET(req);
    const json = await response.json();
  
    expect(response.status).toBe(400);
    expect(json.error).toBe("Invalid resume data format");
  });
  