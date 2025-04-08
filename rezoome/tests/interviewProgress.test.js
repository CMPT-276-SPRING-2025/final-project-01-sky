const {
    getCurrentStep,
    isAllAnswered,
    hasAnyAnswered
  } = require('../utils/interviewProgress');
  
  describe('interviewProgress utils', () => {
    // converts index to step number (1-based)
    it('getCurrentStep returns step number (1-based)', () => {
      expect(getCurrentStep(0)).toBe(1);
      expect(getCurrentStep(2)).toBe(3);
    });
  
    // returns true if at least one response is valid
    it('hasAnyAnswered returns true if any valid response exists', () => {
      expect(hasAnyAnswered([null, "hi", null])).toBe(true);
      expect(hasAnyAnswered(["", "no response", ""])).toBe(false);
    });
  
    // returns false if one or more answers are missing
    it('isAllAnswered returns false if any are missing', () => {
      const res = ["one", "two", "three", null];
      expect(isAllAnswered(res)).toBe(false);
    });
  
    // returns true if all answers are valid
    it('isAllAnswered returns true if all are valid', () => {
      const res = ["yes", "ok", "fine", "sure"];
      expect(isAllAnswered(res)).toBe(true);
    });
  
    // ignores placeholder values like "no response" or "unintelligible"
    it('filters out "no response" and "unintelligible"', () => {
      const res = ["yes", "no response", "ok", "unintelligible"];
      expect(isAllAnswered(res)).toBe(false);
      expect(hasAnyAnswered(res)).toBe(true);
    });
  });
  