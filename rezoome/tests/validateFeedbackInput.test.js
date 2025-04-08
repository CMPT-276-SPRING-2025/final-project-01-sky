const { validateFeedbackInput } = require('../utils/validateFeedbackInput');

describe('validateFeedbackInput', () => {
  // localstorage has no responses
  it('returns false if mockInterviewResponses is missing', () => {
    const storage = {};
    const result = validateFeedbackInput(storage);
    expect(result).toBe(false);
  });

  // localstorage has empty responses
  it('returns false if responses are an empty array', () => {
    const storage = {
      mockInterviewResponses: JSON.stringify([]),
    };
    const result = validateFeedbackInput(storage);
    expect(result).toBe(false);
  });

  // localstorage has invalid json
  it('returns false if mockInterviewResponses is not valid JSON', () => {
    const storage = {
      mockInterviewResponses: "not-valid-json",
    };
    const result = validateFeedbackInput(storage);
    expect(result).toBe(false);
  });

  // valid case: non-empty json-parsable array
  it('returns true if valid responses are provided', () => {
    const storage = {
      mockInterviewResponses: JSON.stringify(["A", "B", "C", "D"]),
    };
    const result = validateFeedbackInput(storage);
    expect(result).toBe(true);
  });
});
