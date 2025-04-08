function loadStoredQuestions() {
    const stored = localStorage.getItem("mockInterviewQuestions");
    return stored ? JSON.parse(stored) : [];
  }
  
  function loadStoredResponses() {
    const stored = localStorage.getItem("mockInterviewResponses");
    return stored ? JSON.parse(stored) : [null, null, null, null];
  }
  
  function saveResponses(responses) {
    localStorage.setItem("mockInterviewResponses", JSON.stringify(responses));
  }
  
  function saveQuestions(questions) {
    localStorage.setItem("mockInterviewQuestions", JSON.stringify(questions));
  }
  
  module.exports = {
    loadStoredQuestions,
    loadStoredResponses,
    saveResponses,
    saveQuestions
  };
  