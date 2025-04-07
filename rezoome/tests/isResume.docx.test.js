const { isValidResume } = require('../utils/isResume');

describe('isValidResume - DOCX handling', () => {
  it('rejects a docx file with no resume data (just images)', () => {
    const resume = {
      name: "resume.docx",
      education: [],
      workExperience: [],
      skills: []
    };

    expect(isValidResume(resume)).toBe(false);
  });

  it('accepts a valid docx resume with work experience', () => {
    const resume = {
      name: "John Smith",
      education: [],
      workExperience: [{ jobTitle: "Engineer" }],
      skills: []
    };

    expect(isValidResume(resume)).toBe(true);
  });

  it('accepts a valid docx resume with skills', () => {
    const resume = {
      name: "Jane Doe",
      education: [],
      workExperience: [],
      skills: ["Java", "Python"]
    };

    expect(isValidResume(resume)).toBe(true);
  });
});
