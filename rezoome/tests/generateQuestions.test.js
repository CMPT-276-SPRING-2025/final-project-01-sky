const { generateMockInterviewQuestions } = require('../utils/generateQuestions');

describe('generateMockInterviewQuestions', () => {
  // both resume and listing missing
  it('returns 400 if input is missing', async () => {
    const res = await generateMockInterviewQuestions(null, null);
    expect(res.status).toBe(400);
  });

  // listing is missing
  it('returns 400 if listing is missing', () => {
    const result = generateMockInterviewQuestions({ name: "jane" }, null);
    expect(result.status).toBe(400);
  });

  // both inputs are missing again (duplicate test)
  it('returns 400 if both resume and listing are missing', () => {
    const result = generateMockInterviewQuestions(null, null);
    expect(result.status).toBe(400);
  });

  // resume is empty object
  it('returns 400 if resume is an empty object', () => {
    const result = generateMockInterviewQuestions({}, "full stack role");
    expect(result.status).toBe(400);
  });

  // listing is an empty string
  it('returns 400 if listing is an empty string', () => {
    const result = generateMockInterviewQuestions({ name: "anna" }, "");
    expect(result.status).toBe(400);
  });

  // valid resume and listing
  it('returns 200 and 4 questions if valid input is given', () => {
    const result = generateMockInterviewQuestions({ name: "sam", skills: ["react"] }, "frontend developer");
    expect(result.status).toBe(200);
    expect(result.questions.split('|')).toHaveLength(4);
  });
});
