// import the generateMockInterviewFeedback function from the feedback utility file
const { generateMockInterviewFeedback } = require('../utils/generateFeedback');

// test suite for the generateMockInterviewFeedback function
describe('generateMockInterviewFeedback', () => {

  // test case: if no input is provided, the function should return a 400 status and an error message
  it('returns 400 if responses are missing', () => {
    const result = generateMockInterviewFeedback(null); // input: null (no responses given)
    expect(result.status).toBe(400); // output: status code 400 indicates missing input
    expect(result.error).toBe("Missing responses"); // output: error message should explain the issue
  });

  // test case: if input is an empty array, return 400 with the same error message
  it('returns 400 if responses array is empty', () => {
    const result = generateMockInterviewFeedback([]); // input: empty array (no answers provided)
    expect(result.status).toBe(400); // output: 400 status since no content to process
    expect(result.error).toBe("Missing responses"); // output: error message matches the previous case
  });

  // test case: if input is not an array (e.g., a string), return 400 with error
  it('returns 400 if responses is not an array', () => {
    const result = generateMockInterviewFeedback("not-an-array"); // input: invalid data type (string)
    expect(result.status).toBe(400); // output: 400 status due to incorrect format
    expect(result.error).toBe("Missing responses"); // output: error message should remain consistent
  });

  // test case: when valid input is provided, return 200 and a structured feedback object
  it('returns 200 and feedback object if valid responses are provided', () => {
    const sampleResponses = [
      "I am a good communicator.",
      "I worked on a full stack project using React and Node.",
      "I enjoy collaborating in teams.",
      "I prefer a flexible and inclusive work environment."
    ]; // input: array of 4 realistic responses to mock interview questions

    const result = generateMockInterviewFeedback(sampleResponses); // call function with valid input

    // output: status code should indicate success
    expect(result.status).toBe(200);

    // output: feedback object should be present
    expect(result.feedback).toBeDefined();
    expect(typeof result.feedback).toBe("object");

    // output: keys of feedback should include responses for each question and a general summary
    expect(Object.keys(result.feedback)).toEqual(
      expect.arrayContaining(["q1", "q2", "q3", "q4", "generalFeedback"])
    );
  });

});
