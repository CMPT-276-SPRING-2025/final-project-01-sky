const { isValidResume } = require('../utils/isResume');

describe('isValidResume – edge cases', () => {
    // test return false if the input is null
  it('returns false for null input', () => {
    expect(isValidResume(null)).toBe(false);
  });
  // test return false if the input is undefined
  it('returns false for undefined input', () => {
    expect(isValidResume(undefined)).toBe(false);
  });
  // test return false if the input is an empty object
  it('returns false for empty object', () => {
    expect(isValidResume({})).toBe(false);
  });
  // test returns false if there is only a name with no other sections
  it('returns false if resume has no education, workExperience, or skills', () => {
    const resume = {
      name: "Name Only"
    };
    expect(isValidResume(resume)).toBe(false);
  });
  // test returns false if the education, workExperience, or skills are not arrays
  it('returns false if sections are not arrays', () => {
    const resume = {
      name: "Invalid",
      education: "MIT",
      workExperience: { job: "Engineer" },
      skills: "React"
    };
    expect(isValidResume(resume)).toBe(false);
  });
  // test returns false if the skills array contains only empty strings 
  it('returns false if skills contain only empty strings', () => {
    const resume = {
      name: "Empty",
      education: [],
      workExperience: [],
      skills: [""]
    };
    expect(isValidResume(resume)).toBe(false);
  });

  // test returns false if the skills array contains only whitespace strings 
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
