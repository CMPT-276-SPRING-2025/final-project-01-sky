function generateMockInterviewFeedback(responses) {
  // return error if responses are missing or not an array
  if (!Array.isArray(responses) || responses.length === 0) {
    return { status: 400, error: "Missing responses" };
  }

  // return a mock feedback object based on the user's answers
  // each question gets specific feedback, and there's a general summary
  return {
    status: 200, // success status
    feedback: {
      q1: "You explained your strengths clearly.", // feedback for first question
      q2: "Your project example demonstrates practical skills.", // second answer evaluation
      q3: "You work well in teams.", // third response comment
      q4: "Your cultural preferences align with modern companies.", // fourth answer insight
      generalFeedback: "Overall, a solid interview with thoughtful answers." // overall summary
    }
  };
}

// export the function for use in other parts of the app or for testing
module.exports = { generateMockInterviewFeedback };
