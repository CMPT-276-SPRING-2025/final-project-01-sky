function generateMockInterviewFeedback(responses) {
    // return 400 if input is invalid or missing
    if (!Array.isArray(responses) || responses.length === 0) {
      return { status: 400, error: "Missing responses" };
    }
  
    // return a fake feedback object for now (mock logic)
    return {
      status: 200,
      feedback: {
        q1: "You explained your strengths clearly.",
        q2: "Your project example demonstrates practical skills.",
        q3: "You work well in teams.",
        q4: "Your cultural preferences align with modern companies.",
        generalFeedback: "Overall, a solid interview with thoughtful answers."
      }
    };
  }
  
  module.exports = { generateMockInterviewFeedback };
  