// import the utility that checks if the number of questions and responses match
const { validateQuestionResponseMatch } = require('../utils/validateQuestionResponseMatch');

// test suite to verify question and response matching logic
describe('validateQuestionResponseMatch', () => {

  // test case: returns false if either questions or responses is missing
  it('returns false if either questions or responses is missing', () => {
    expect(validateQuestionResponseMatch(null, ["Q1", "Q2"])).toBe(false); // missing responses
    expect(validateQuestionResponseMatch(["A1", "A2"], null)).toBe(false); // missing questions
  });

  // test case: returns false if one or both inputs are not arrays
  it('returns false if either input is not an array', () => {
    expect(validateQuestionResponseMatch("not-an-array", ["Q1", "Q2"])).toBe(false); // invalid responses
    expect(validateQuestionResponseMatch(["A1", "A2"], "not-an-array")).toBe(false); // invalid questions
  });

  // test case: returns false if there are more responses than questions
  it('returns false if responses are longer than questions', () => {
    const res = ["A1", "A2", "A3", "A4"]; // 4 responses
    const q = ["Q1", "Q2"]; // only 2 questions
    expect(validateQuestionResponseMatch(res, q)).toBe(false); // mismatch
  });

  // test case: returns false if there are more questions than responses
  it('returns false if questions are longer than responses', () => {
    const res = ["A1", "A2"]; // 2 responses
    const q = ["Q1", "Q2", "Q3"]; // 3 questions
    expect(validateQuestionResponseMatch(res, q)).toBe(false); // mismatch
  });

  // test case: returns true if both are arrays and lengths match
  it('returns true if lengths match and both are arrays', () => {
    const res = ["A1", "A2", "A3", "A4"]; // 4 responses
    const q = ["Q1", "Q2", "Q3", "Q4"]; // 4 questions
    expect(validateQuestionResponseMatch(res, q)).toBe(true); // valid match
  });

});
