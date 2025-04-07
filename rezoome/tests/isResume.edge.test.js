const { isValidResume } = require('../utils/isResume');

describe('isValidResume – edge cases', () => {
  it('returns false for null input', () => {
    expect(isValidResume(null)).toBe(false);
  });

  it('returns false for undefined input', () => {
    expect(isValidResume(undefined)).toBe(false);
  });

  it('returns false for empty object', () => {
    expect(isValidResume({})).toBe(false);
  });

  it('returns false if resume has no education, workExperience, or skills', () => {
    const resume = {
      name: "Name Only"
    };
    expect(isValidResume(resume)).toBe(false);
  });

  it('returns false if sections are not arrays', () => {
    const resume = {
      name: "Invalid",
      education: "MIT",
      workExperience: { job: "Engineer" },
      skills: "React"
    };
    expect(isValidResume(resume)).toBe(false);
  });

  it('returns false if skills contain only empty strings', () => {
    const resume = {
      name: "Empty",
      education: [],
      workExperience: [],
      skills: [""]
    };
    expect(isValidResume(resume)).toBe(false);
  });

  it('returns false if name is only whitespace', () => {
    const resume = {
      name: "   ",
      education: [{ institution: "UBC" }],
      workExperience: [],
      skills: []
    };
    expect(isValidResume(resume)).toBe(false);
  });
});
