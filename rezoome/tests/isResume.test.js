const { isValidResume } = require('../utils/isResume');

// education, work experience, and skills are arrays
// name is a string
// the function isValidResume checks if the resume is valid based on the following criteria

describe('isValidResume', () => {
  // test returns true when there is a name and at least one section like education
  it('returns true for a valid resume', () => {
    const resume = {
      name: "John Doe", // name should be required on a resume
      education: [{ institution: "Simon Fraser University" }], // education should be filled
      workExperience: [],
      skills: []
    };
    expect(isValidResume(resume)).toBe(true);
  });

  // test returns false if there is no name or content at all 
  it('returns false if all sections are empty', () => {
    const resume = {
      name: "", //if its missing a name
      education: [], // if all these arrays are empty
      workExperience: [],
      skills: []
    };
    expect(isValidResume(resume)).toBe(false); // returns as false
  });

  // test returns true if there is name and skills present 
  it('returns true if only skills are present', () => {
    const resume = {
      name: "Jane Smith",
      education: [],
      workExperience: [],
      skills: ["JavaScript"]
    };
    expect(isValidResume(resume)).toBe(true);
  });

  // test returns false if there is work exprience but no name 
  it('returns false if no name even with experience', () => {
    const resume = {
      name: "",
      education: [],
      workExperience: [{ jobTitle: "Dev" }],
      skills: []
    };
    expect(isValidResume(resume)).toBe(false);
  });
});
