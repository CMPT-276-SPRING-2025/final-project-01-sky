// import utility functions from the interviewProgress helper file
const {
  getCurrentStep,
  isAllAnswered,
  hasAnyAnswered
} = require('../utils/interviewProgress');

// test suite for all interview progress utility functions
describe('interviewProgress utils', () => {

  // test case: converts a zero-based index to a human-readable step number (1-based)
  it('getCurrentStep returns step number (1-based)', () => {
    expect(getCurrentStep(0)).toBe(1); // input: index 0 → step 1
    expect(getCurrentStep(2)).toBe(3); // input: index 2 → step 3
  });

  // test case: checks if at least one non-placeholder response is present
  it('hasAnyAnswered returns true if any valid response exists', () => {
    expect(hasAnyAnswered([null, "hi", null])).toBe(true); // input: valid response at index 1
    expect(hasAnyAnswered(["", "no response", ""])).toBe(false); // input: all are empty or placeholders
  });

  // test case: checks that not all answers are valid if one or more are missing
  it('isAllAnswered returns false if any are missing', () => {
    const res = ["one", "two", "three", null]; // input: last value is null
    expect(isAllAnswered(res)).toBe(false); // output: false because one answer is missing
  });

  // test case: checks that all responses are valid and not placeholders
  it('isAllAnswered returns true if all are valid', () => {
    const res = ["yes", "ok", "fine", "sure"]; // input: all valid answers
    expect(isAllAnswered(res)).toBe(true); // output: true since none are null or placeholders
  });

  // test case: ignores placeholder values such as "no response" and "unintelligible"
  it('filters out "no response" and "unintelligible"', () => {
    const res = ["yes", "no response", "ok", "unintelligible"]; // input: 2 placeholders mixed with 2 valid responses
    expect(isAllAnswered(res)).toBe(false); // output: false since some values are not real answers
    expect(hasAnyAnswered(res)).toBe(true); // output: true because there are valid responses too
  });

});
