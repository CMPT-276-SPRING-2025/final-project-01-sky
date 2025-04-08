const { validateJobPosting } = require("../utils/validateJobPosting");

describe("validateJobPosting", () => {
  // empty or short input
  it("returns false if input is missing or too short", () => {
    expect(validateJobPosting("")).toBe(false);
    expect(validateJobPosting("Apply now")).toBe(false);
  });

  // missing job keywords
  it("returns false if text doesn't include job-related terms", () => {
    const text = "I love pizza and want a job at your place.";
    expect(validateJobPosting(text)).toBe(false);
  });

  // valid job posting
  it("returns true for input with job-related keywords", () => {
    const text = "This role includes responsibilities like writing code and collaborating with engineers.";
    expect(validateJobPosting(text)).toBe(true);
  });

  it("returns true for text with 'requirements'", () => {
    const text = "Requirements: 3+ years of experience with JavaScript.";
    expect(validateJobPosting(text)).toBe(true);
  });

  // emoji or symbols only
  it("returns false if input is just emojis or symbols", () => {
    expect(validateJobPosting("🔥🔥🔥✅✅✅🎯")).toBe(false);
    expect(validateJobPosting("!!! $$$ ???")).toBe(false);
  });

  // valid job posting with emoji mixed in
  it("returns true for job listing that includes emojis and valid keywords", () => {
    const text = "Responsibilities include building mobile apps 🚀";
    expect(validateJobPosting(text)).toBe(true);
  });

  // styled/pasted HTML content
  it("returns true for job listing wrapped in <p> or <div> tags", () => {
    const text = "<p>Qualifications: Experience in UX design</p>";
    expect(validateJobPosting(text)).toBe(true);
  });

  // includes code but is still a valid job description
  it("returns true if input includes both responsibilities and code snippets", () => {
    const text = `
      Responsibilities:
      - Build scalable frontend systems
      - Maintain code quality

      const test = () => console.log("Hello");
    `;
    expect(validateJobPosting(text)).toBe(true);
  });

  // uppercase keywords
  it("returns true if keywords are in uppercase", () => {
    const text = "QUALIFICATIONS: Must be detail-oriented.";
    expect(validateJobPosting(text)).toBe(true);
  });

  // very long text with valid keyword
  it("returns true for long input that contains valid keywords", () => {
    const text = "Lorem ipsum ".repeat(150) + " responsibilities include coding.";
    expect(validateJobPosting(text)).toBe(true);
  });
});
