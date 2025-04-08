function validateQuestionResponseMatch(responses, questions) {
    // check if both inputs are arrays
    if (!Array.isArray(responses) || !Array.isArray(questions)) {
      return false;
    }
  
    // check if lengths match exactly
    return responses.length === questions.length;
  }
  
  module.exports = { validateQuestionResponseMatch };
  