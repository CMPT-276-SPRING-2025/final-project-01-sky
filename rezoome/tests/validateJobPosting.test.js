// import the validateJobPosting function used to verify job description input
const { validateJobPosting } = require("../utils/validateJobPosting");

// test suite for checking different formats of job posting text
describe("validateJobPosting", () => {

  // test case: returns false for empty or very short input that lacks context
  it("returns false if input is missing or too short", () => {
    expect(validateJobPosting("")).toBe(false); // empty string
    expect(validateJobPosting("Apply now")).toBe(false); // too short and vague
  });

  // test case: returns false if the text has no job-specific terms or context
  it("returns false if text doesn't include job-related terms", () => {
    const text = "I love pizza and want a job at your place."; // no mention of roles, skills, or duties
    expect(validateJobPosting(text)).toBe(false);
  });

  // test case: returns true if the input has responsibilities or technical terms
  it("returns true for input with job-related keywords", () => {
    const text = "This role includes responsibilities like writing code and collaborating with engineers.";
    expect(validateJobPosting(text)).toBe(true); // contains 'responsibilities' and relevant job actions
  });

  // test case: accepts input that includes the keyword 'requirements'
  it("returns true for text with 'requirements'", () => {
    const text = "Requirements: 3+ years of experience with JavaScript.";
    expect(validateJobPosting(text)).toBe(true); // keyword clearly indicates a job listing
  });

  // test case: input made of only emojis or random symbols should be rejected
  it("returns false if input is just emojis or symbols", () => {
    expect(validateJobPosting("🔥🔥🔥✅✅✅🎯")).toBe(false); // emojis only
    expect(validateJobPosting("!!! $$$ ???")).toBe(false); // symbols only
  });

  // test case: input that contains both emojis and valid content should still be accepted
  it("returns true for job listing that includes emojis and valid keywords", () => {
    const text = "Responsibilities include building mobile apps 🚀"; // valid content + emoji
    expect(validateJobPosting(text)).toBe(true);
  });

  // test case: html-wrapped content such as pasted text from a job site should still validate
  it("returns true for job listing wrapped in <p> or <div> tags", () => {
    const text = "<p>Qualifications: Experience in UX design</p>"; // html tags with job-related keywords
    expect(validateJobPosting(text)).toBe(true);
  });

  // test case: valid input may contain code snippets but still describe a job
  it("returns true if input includes both responsibilities and code snippets", () => {
    const text = `
      Responsibilities:
      - Build scalable frontend systems
      - Maintain code quality

      const test = () => console.log("Hello");
    `;
    expect(validateJobPosting(text)).toBe(true); // contains responsibilities + example code
  });

  // test case: job-related keywords should still be recognized if they're in uppercase
  it("returns true if keywords are in uppercase", () => {
    const text = "QUALIFICATIONS: Must be detail-oriented.";
    expect(validateJobPosting(text)).toBe(true); // all caps should still trigger recognition
  });

  // test case: very long input should be accepted if job-related terms exist somewhere inside
  it("returns true for long input that contains valid keywords", () => {
    const text = "Lorem ipsum ".repeat(150) + " responsibilities include coding."; // filler text + valid keyword
    expect(validateJobPosting(text)).toBe(true);
  });

});
