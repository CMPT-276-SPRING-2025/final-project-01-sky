const { generateMockInterviewFeedback } = require('../utils/generateFeedback');

describe('generateMockInterviewFeedback', () => {
  // should return 400 if no input is provided
  it('returns 400 if responses are missing', () => {
    const result = generateMockInterviewFeedback(null);
    expect(result.status).toBe(400);
    expect(result.error).toBe("Missing responses");
  });

  // should return 400 if input is an empty array
  it('returns 400 if responses array is empty', () => {
    const result = generateMockInterviewFeedback([]);
    expect(result.status).toBe(400);
    expect(result.error).toBe("Missing responses");
  });

  // should return 400 if responses is not an array
  it('returns 400 if responses is not an array', () => {
    const result = generateMockInterviewFeedback("not-an-array");
    expect(result.status).toBe(400);
    expect(result.error).toBe("Missing responses");
  });

  // should return 200 and a full feedback object with valid input
  it('returns 200 and feedback object if valid responses are provided', () => {
    const sampleResponses = [
      "I am a good communicator.",
      "I worked on a full stack project using React and Node.",
      "I enjoy collaborating in teams.",
      "I prefer a flexible and inclusive work environment."
    ];

    const result = generateMockInterviewFeedback(sampleResponses);

    // confirm a successful response
    expect(result.status).toBe(200);

    // confirm feedback object exists
    expect(result.feedback).toBeDefined();
    expect(typeof result.feedback).toBe("object");

    // feedback keys should include q1–q4 and general feedback
    expect(Object.keys(result.feedback)).toEqual(
      expect.arrayContaining(["q1", "q2", "q3", "q4", "generalFeedback"])
    );
  });
});
