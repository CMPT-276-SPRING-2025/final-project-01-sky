// import the validateFeedbackInput function that checks stored interview responses
const { validateFeedbackInput } = require('../utils/validateFeedbackInput');

// test suite for validating the structure and content of mock interview responses
describe('validateFeedbackInput', () => {

  // test case: returns false when there is no mockInterviewResponses key in storage
  it('returns false if mockInterviewResponses is missing', () => {
    const storage = {}; // input: no key present
    const result = validateFeedbackInput(storage); // function should reject this case
    expect(result).toBe(false); // output: false because data is missing
  });

  // test case: returns false if the stored value is an empty array
  it('returns false if responses are an empty array', () => {
    const storage = {
      mockInterviewResponses: JSON.stringify([]), // input: empty valid array
    };
    const result = validateFeedbackInput(storage); // no content means invalid
    expect(result).toBe(false); // output: false due to lack of answers
  });

  // test case: returns false if the stored value is not valid JSON
  it('returns false if mockInterviewResponses is not valid JSON', () => {
    const storage = {
      mockInterviewResponses: "not-valid-json", // input: corrupted or badly formatted data
    };
    const result = validateFeedbackInput(storage); // should fail parsing
    expect(result).toBe(false); // output: false due to JSON parse error
  });

  // test case: returns true if the key holds a non-empty, correctly formatted array
  it('returns true if valid responses are provided', () => {
    const storage = {
      mockInterviewResponses: JSON.stringify(["A", "B", "C", "D"]), // input: valid stringified array
    };
    const result = validateFeedbackInput(storage); // should pass validation
    expect(result).toBe(true); // output: true because input meets all conditions
  });

});
