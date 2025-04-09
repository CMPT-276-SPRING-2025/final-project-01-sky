// import the isValidResume function used to validate parsed resume objects
const { isValidResume } = require('../utils/isResume');

// test suite for validating docx resume files
describe('isValidResume - DOCX handling', () => {

  // test case: rejects resumes that have no content (just images or placeholders)
  it('rejects a docx file with no resume data (just images)', () => {
    const resume = {
      name: "resume.docx", // name is just a filename, not an actual person's name
      education: [], // no education entries
      workExperience: [], // no jobs listed
      skills: [] // no skills
    };

    expect(isValidResume(resume)).toBe(false); // output: false because there's no usable resume data
  });

  // test case: accepts resumes that have a name and at least one job experience
  it('accepts a valid docx resume with work experience', () => {
    const resume = {
      name: "John Smith", // valid name
      education: [], // education can be empty
      workExperience: [{ jobTitle: "Engineer" }], // at least one job
      skills: [] // skills can be empty
    };

    expect(isValidResume(resume)).toBe(true); // output: true because there's enough data to evaluate
  });

  // test case: accepts resumes that have a name and at least one skill
  it('accepts a valid docx resume with skills', () => {
    const resume = {
      name: "Jane Doe", // valid name
      education: [], // empty education section
      workExperience: [], // no job history
      skills: ["Java", "Python"] // valid technical skills present
    };

    expect(isValidResume(resume)).toBe(true); // output: true because skills + name is enough to consider valid
  });

});
