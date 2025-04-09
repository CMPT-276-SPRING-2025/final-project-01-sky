// import the generateMockInterviewQuestions function from the questions utility file
const { generateMockInterviewQuestions } = require('../utils/generateQuestions');

// test suite for the generateMockInterviewQuestions function
describe('generateMockInterviewQuestions', () => {

  // test case: if both resume and job listing are missing, return 400 status
  it('returns 400 if input is missing', async () => {
    const res = await generateMockInterviewQuestions(null, null); // input: null values for both fields
    expect(res.status).toBe(400); // output: 400 status indicates bad request due to missing data
  });

  // test case: if job listing is missing, return 400 status
  it('returns 400 if listing is missing', () => {
    const result = generateMockInterviewQuestions({ name: "jane" }, null); // input: resume provided, no listing
    expect(result.status).toBe(400); // output: 400 due to incomplete input
  });

  // test case (redundant): both resume and listing are missing again, still return 400
  it('returns 400 if both resume and listing are missing', () => {
    const result = generateMockInterviewQuestions(null, null); // input: null for both
    expect(result.status).toBe(400); // output: 400 status should still apply
  });

  // test case: if resume is an empty object, return 400
  it('returns 400 if resume is an empty object', () => {
    const result = generateMockInterviewQuestions({}, "full stack role"); // input: empty resume, valid listing
    expect(result.status).toBe(400); // output: resume lacks useful data, so return 400
  });

  // test case: if listing is an empty string, return 400
  it('returns 400 if listing is an empty string', () => {
    const result = generateMockInterviewQuestions({ name: "anna" }, ""); // input: valid resume, empty job listing
    expect(result.status).toBe(400); // output: empty listing means function can’t generate relevant questions
  });

  // test case: if both resume and listing are valid, return 200 and 4 interview questions
  it('returns 200 and 4 questions if valid input is given', () => {
    const result = generateMockInterviewQuestions(
      { name: "sam", skills: ["react"] },
      "frontend developer"
    ); // input: realistic resume and job title

    expect(result.status).toBe(200); // output: successful generation of questions
    expect(result.questions.split('|')).toHaveLength(4); // output: questions field contains 4 items, separated by '|'
  });

});
