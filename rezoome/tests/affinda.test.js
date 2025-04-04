import { POST } from "../app/api/affinda/route"; // Adjust the path as needed
import { NextResponse } from "next/server";

// Mocking fetch
global.fetch = jest.fn();
process.env.AFFINDA_API_KEY = "test-key";

describe("Affinda API File Upload", () => {
  beforeEach(() => {
    fetch.mockClear();
    jest.restoreAllMocks(); // Reset any spies like console.error
  });

  it("should return 400 if no file is provided", async () => {
    const req = { json: jest.fn().mockResolvedValue({}) };
    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(jsonResponse).toEqual({ error: "No file provided" });
    expect(response.status).toBe(400);
  });

  it("should successfully process a file and return data", async () => {
    const mockFile = "mockBase64FileString";
    const mockAffindaResponse = { meta: { identifier: "12345" } };
    const mockResumeData = { name: "John Doe", email: "johndoe@example.com" };

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockAffindaResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResumeData),
      });

    const req = { json: jest.fn().mockResolvedValue({ file: mockFile }) };
    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(jsonResponse).toEqual({ success: true, data: mockResumeData });
    expect(response.status).toBe(200);
  });

  it("should return 500 if Affinda API fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const mockFile = "mockBase64FileString";

    fetch.mockResolvedValueOnce({
      ok: false,
      text: jest.fn().mockResolvedValue("API error"),
      status: 500,
    });

    const req = { json: jest.fn().mockResolvedValue({ file: mockFile }) };
    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(jsonResponse.error).toBe("Internal Server Error");
    expect(response.status).toBe(500);

    consoleErrorSpy.mockRestore();
  });

  it("should return 500 if resume ID is missing from Affinda response", async () => {
    const mockFile = "mockBase64FileString";

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ meta: {} }),
    });

    const req = { json: jest.fn().mockResolvedValue({ file: mockFile }) };
    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse.error).toBe("Internal Server Error");
  });

  it("should return 500 if second fetch fails (resume retrieval)", async () => {
    const mockFile = "mockBase64FileString";
    const mockAffindaResponse = { meta: { identifier: "12345" } };

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockAffindaResponse),
      })
      .mockResolvedValueOnce({
        ok: false,
        text: jest.fn().mockResolvedValue("Resume fetch failed"),
        status: 500,
      });

    const req = { json: jest.fn().mockResolvedValue({ file: mockFile }) };
    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(response.status).toBe(500);
    expect(jsonResponse.error).toBe("Internal Server Error");
  });

  it("should return 500 if req.json() throws an error", async () => {
    const brokenReq = { json: jest.fn().mockRejectedValue(new Error("Broken JSON")) };

    const response = await POST(brokenReq);
    const text = await response.text();

    expect(response.status).toBe(500);
    expect(text).toBe("{\"error\":\"Internal Server Error\",\"details\":\"Broken JSON\"}");
  });

  it("should handle unexpected errors and log them", async () => {
    const mockFile = "mockBase64FileString";
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    fetch.mockImplementation(() => {
      throw new Error("Unexpected failure");
    });

    const req = { json: jest.fn().mockResolvedValue({ file: mockFile }) };
    const response = await POST(req);
    const json = await response.json();

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(response.status).toBe(500);
    expect(json.error).toBe("Internal Server Error");

    consoleErrorSpy.mockRestore();
  });
});
