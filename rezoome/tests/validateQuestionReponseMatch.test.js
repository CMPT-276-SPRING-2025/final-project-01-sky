const { validateQuestionResponseMatch } = require('../utils/validateQuestionResponseMatch');

describe('validateQuestionResponseMatch', () => {
  // no responses or questions
  it('returns false if either questions or responses is missing', () => {
    expect(validateQuestionResponseMatch(null, ["Q1", "Q2"])).toBe(false);
    expect(validateQuestionResponseMatch(["A1", "A2"], null)).toBe(false);
  });

  // both are not arrays
  it('returns false if either input is not an array', () => {
    expect(validateQuestionResponseMatch("not-an-array", ["Q1", "Q2"])).toBe(false);
    expect(validateQuestionResponseMatch(["A1", "A2"], "not-an-array")).toBe(false);
  });

  // length mismatch: more responses than questions
  it('returns false if responses are longer than questions', () => {
    const res = ["A1", "A2", "A3", "A4"];
    const q = ["Q1", "Q2"];
    expect(validateQuestionResponseMatch(res, q)).toBe(false);
  });

  // length mismatch: more questions than responses
  it('returns false if questions are longer than responses', () => {
    const res = ["A1", "A2"];
    const q = ["Q1", "Q2", "Q3"];
    expect(validateQuestionResponseMatch(res, q)).toBe(false);
  });

  // valid: same number of questions and responses
  it('returns true if lengths match and both are arrays', () => {
    const res = ["A1", "A2", "A3", "A4"];
    const q = ["Q1", "Q2", "Q3", "Q4"];
    expect(validateQuestionResponseMatch(res, q)).toBe(true);
  });
});
