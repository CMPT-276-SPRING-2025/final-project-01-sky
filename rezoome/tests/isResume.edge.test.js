// import the isValidResume utility used to validate resume structure and content
const { isValidResume } = require('../utils/isResume');

// test suite to handle edge cases for resume validation
describe('isValidResume – edge cases', () => {

  // test case: should return false if the resume input is null
  it('returns false for null input', () => {
    expect(isValidResume(null)).toBe(false); // input: null → invalid resume
  });

  // test case: should return false if the resume input is undefined
  it('returns false for undefined input', () => {
    expect(isValidResume(undefined)).toBe(false); // input: undefined → invalid resume
  });

  // test case: should return false for an empty object with no data
  it('returns false for empty object', () => {
    expect(isValidResume({})).toBe(false); // input: empty object → lacks all required fields
  });

  // test case: returns false if resume only has a name but no other sections
  it('returns false if resume has no education, workExperience, or skills', () => {
    const resume = {
      name: "Name Only" // input: name present but no supporting data
    };
    expect(isValidResume(resume)).toBe(false); // output: false because resume content is missing
  });

  // test case: returns false if the main sections are not arrays (invalid structure)
  it('returns false if sections are not arrays', () => {
    const resume = {
      name: "Invalid",
      education: "MIT", // should be an array, not a string
      workExperience: { job: "Engineer" }, // should be an array
      skills: "React" // should also be an array
    };
    expect(isValidResume(resume)).toBe(false); // output: false because data types are incorrect
  });

  // test case: returns false if skills array contains only empty strings
  it('returns false if skills contain only empty strings', () => {
    const resume = {
      name: "Empty",
      education: [],
      workExperience: [],
      skills: [""] // empty string is not valid skill content
    };
    expect(isValidResume(resume)).toBe(false); // output: false because the skills are meaningless
  });

  // test case: returns false if the name field is only whitespace
  it('returns false if name is only whitespace', () => {
    const resume = {
      name: "   ", // only whitespace, not a real name
      education: [{ institution: "UBC" }], // has some data in education
      workExperience: [],
      skills: []
    };
    expect(isValidResume(resume)).toBe(false); // output: false because name is invalid
  });

});
