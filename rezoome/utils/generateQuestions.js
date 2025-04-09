function generateMockInterviewQuestions(resume, listing) {
  // check if resume or job listing is missing or empty
  // resume must have keys and listing must be non-empty text
  if (!resume || !listing || Object.keys(resume).length === 0 || listing.trim() === "") {
    return { status: 400, error: "Missing resume or listing" };
  }

  // return a mock set of four interview questions
  // questions are separated by a pipe character for later splitting
  return {
    status: 200, // success status
    questions: "What are your strengths? | How do you work in teams? | Describe a project. | What's your ideal work culture?"
  };
}

// export the function so it can be used or tested elsewhere
module.exports = { generateMockInterviewQuestions };
