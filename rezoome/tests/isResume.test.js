// import the isValidResume function used to validate resume structure and content
const { isValidResume } = require('../utils/isResume');

// test suite for general isValidResume validation rules
describe('isValidResume', () => {

  // test case: returns true if resume has a name and at least one filled section like education
  it('returns true for a valid resume', () => {
    const resume = {
      name: "John Doe", // valid full name
      education: [{ institution: "Simon Fraser University" }], // at least one item in education
      workExperience: [], // empty but allowed
      skills: [] // empty but allowed
    };
    expect(isValidResume(resume)).toBe(true); // output: valid since name and one section are provided
  });

  // test case: returns false if all content is empty, including the name
  it('returns false if all sections are empty', () => {
    const resume = {
      name: "", // no name provided
      education: [], // no education entries
      workExperience: [], // no work history
      skills: [] // no skills listed
    };
    expect(isValidResume(resume)).toBe(false); // output: invalid because everything is empty
  });

  // test case: returns true if there is a name and at least one skill
  it('returns true if only skills are present', () => {
    const resume = {
      name: "Jane Smith", // valid name
      education: [], // no education
      workExperience: [], // no work history
      skills: ["JavaScript"] // valid skill included
    };
    expect(isValidResume(resume)).toBe(true); // output: valid since name and one section (skills) exist
  });

  // test case: returns false if work experience exists but name is missing
  it('returns false if no name even with experience', () => {
    const resume = {
      name: "", // name is required and missing here
      education: [], // no education
      workExperience: [{ jobTitle: "Dev" }], // some work history
      skills: [] // no skills
    };
    expect(isValidResume(resume)).toBe(false); // output: invalid due to missing name
  });

});
