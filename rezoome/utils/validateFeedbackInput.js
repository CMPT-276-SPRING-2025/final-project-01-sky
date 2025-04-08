function validateFeedbackInput(storage) {
    try {
      // try to parse the responses from localstorage
      const responses = JSON.parse(storage.mockInterviewResponses);
  
      // check if it's an array and not empty
      if (!Array.isArray(responses) || responses.length === 0) {
        return false;
      }
  
      // valid input
      return true;
    } catch (err) {
      // invalid json or parsing failed
      return false;
    }
  }
  
  module.exports = { validateFeedbackInput };
  