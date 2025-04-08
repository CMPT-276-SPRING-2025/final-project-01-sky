function generateMockInterviewQuestions(resume, listing) {
    if (!resume || !listing || Object.keys(resume).length === 0 || listing.trim() === "") {
      return { status: 400, error: "Missing resume or listing" };
    }
  
    return {
      status: 200,
      questions: "What are your strengths? | How do you work in teams? | Describe a project. | What's your ideal work culture?"
    };
  }
  
  module.exports = { generateMockInterviewQuestions };
  