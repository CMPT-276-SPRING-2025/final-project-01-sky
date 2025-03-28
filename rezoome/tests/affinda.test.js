import { POST } from "../app/api/affinda/route"; // Adjust the path as needed
import { NextResponse } from "next/server";

// Mocking fetch
global.fetch = jest.fn();

describe("Affinda API File Upload", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it("should return 400 if no file is provided", async () => {
        const req = { json: jest.fn().mockResolvedValue({}) };
        const response = await POST(req);

        expect(response).toEqual(
            NextResponse.json({ error: "No file provided" }, { status: 400 })
        );
    });

    it("should successfully process a file and return data", async () => {
        const mockFile = "mockBase64FileString"; // Simulating a Base64-encoded file
        const mockAffindaResponse = { meta: { identifier: "12345" } };
        const mockResumeData = { name: "John Doe", email: "johndoe@example.com" };

        // Mocking Affinda API responses
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockAffindaResponse),
        });

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue(mockResumeData),
        });

        const req = { json: jest.fn().mockResolvedValue({ file: mockFile }) };
        const response = await POST(req);
        const jsonResponse = await response.json();

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(jsonResponse).toEqual({ success: true, data: mockResumeData });
    });

    it("should return 500 if Affinda API fails", async () => {
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
    });
});
